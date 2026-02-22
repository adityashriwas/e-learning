import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const resolveFrontendBaseUrl = () => {
  const explicitBase = process.env.FRONTEND_PUBLIC_URL?.trim();
  if (explicitBase) return explicitBase.replace(/\/+$/, "");

  const firstOriginFromList = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)[0];

  if (firstOriginFromList) return firstOriginFromList.replace(/\/+$/, "");
  return "http://localhost:5173";
};

const finalizePurchase = async (purchase, amountTotal) => {
  if (!purchase) return;

  if (amountTotal) {
    purchase.amount = amountTotal / 100;
  }

  if (purchase.status !== "completed") {
    purchase.status = "completed";
    await purchase.save();
  }

  await User.findByIdAndUpdate(
    purchase.userId,
    { $addToSet: { enrolledCourses: purchase.courseId._id } },
    { new: true }
  );

  await Course.findByIdAndUpdate(
    purchase.courseId._id,
    { $addToSet: { enrolledStudents: purchase.userId } },
    { new: true }
  );
};

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    // Create a new course purchase record
    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const frontendBaseUrl = resolveFrontendBaseUrl();
    try {
      new URL(frontendBaseUrl);
    } catch {
      return res.status(500).json({
        success: false,
        message:
          "Invalid frontend URL configuration. Set FRONTEND_PUBLIC_URL to a single valid URL.",
      });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, // Amount in paise (lowest denomination)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${frontendBaseUrl}/course-progress/${courseId}?session_id={CHECKOUT_SESSION_ID}`, // once payment successful redirect to course progress page
      cancel_url:  `${frontendBaseUrl}/course-detail/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], // Optionally restrict allowed countries
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    // Save the purchase record
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, // Return the Stripe checkout URL
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to create checkout session",
    });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Stripe checkout session not found",
      });
    }

    if (session.metadata?.userId && session.metadata.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to verify this session",
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is not completed yet",
      });
    }

    const purchase = await CoursePurchase.findOne({
      paymentId: session.id,
    }).populate({ path: "courseId" });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    if (purchase.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to verify this purchase",
      });
    }

    await finalizePurchase(purchase, session.amount_total);

    return res.status(200).json({
      success: true,
      message: "Purchase verified and enrollment updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify checkout session",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  // Stripe sends a signature header which must be used to verify the payload.
  // The route uses express.raw for the webhook, so `req.body` is the raw Buffer.
  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.WEBHOOK_ENDPOINT_SECRET;

  try {
    // Use the raw request body (Buffer) and the signature header to construct the event
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  console.log("Stripe webhook received:", event.type);

  // Handle the checkout session completed event
  if (event.type === "checkout.session.completed") {
    // console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        console.warn("Purchase not found for session id:", session.id);
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      await finalizePurchase(purchase, session.amount_total);
      console.log("Purchase processed and enrollment updated for user:", purchase.userId);
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    const purchasedRecord = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed",
    });
    // console.log(purchased);

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }

    const purchased = !!purchasedRecord;
    const sanitizedCourse = course.toObject();
    sanitizedCourse.lectures = sanitizedCourse.lectures.map((lecture) => {
      if (purchased || lecture.isPreviewFree) return lecture;
      return { ...lecture, videoUrl: "" };
    });

    return res.status(200).json({
      course: sanitizedCourse,
      purchased,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("role");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        purchasedCourse: [],
      });
    }

    let purchasedCourse = [];
    if (user.role === "instructor") {
      const instructorSales = await CoursePurchase.find({
        status: "completed",
      }).populate({
        path: "courseId",
        match: { creator: userId },
      });

      purchasedCourse = instructorSales.filter((sale) => sale.courseId);
    } else {
      purchasedCourse = await CoursePurchase.find({
        status: "completed",
        userId,
      }).populate("courseId");
    }

    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};
