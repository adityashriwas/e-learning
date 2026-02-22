import {
  useGetCourseDetailWithStatusQuery,
  useVerifyCheckoutSessionMutation,
} from "@/features/api/purchaseApi";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useEffect } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { data, isLoading, refetch } = useGetCourseDetailWithStatusQuery(courseId);
  const { refetch: refetchUser } = useLoadUserQuery();
  const [verifyCheckoutSession, { isLoading: isVerifying }] =
    useVerifyCheckoutSessionMutation();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;
      try {
        await verifyCheckoutSession(sessionId).unwrap();
        await Promise.all([refetch(), refetchUser()]);
      } catch {
        // ignore and fallback to purchased check
      }
    };

    verifyPayment();
  }, [sessionId, verifyCheckoutSession, refetch, refetchUser]);

  if (isLoading || isVerifying) return <p>Loading...</p>;

  return data?.purchased ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};
export default PurchaseCourseProtectedRoute;
