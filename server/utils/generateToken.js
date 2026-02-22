import jwt from "jsonwebtoken";
import { getCookieOptions } from "./cookieOptions.js";

export const generateToken = (res, user, message) => {
  const jwtSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
  const token = jwt.sign({ userId: user._id }, jwtSecret, {
    expiresIn: "1d",
  });
  const cookieOptions = getCookieOptions();
  const safeUser = user?.toObject ? user.toObject() : { ...user };
  if (safeUser?.password) {
    delete safeUser.password;
  }

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      message,
      user: safeUser,
    });
};
