import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLoadUserQuery } from "@/features/api/authApi";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const {
    data: purchasedData,
    isSuccess,
    isError,
    isLoading,
  } = useGetPurchasedCoursesQuery();

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useLoadUserQuery();

  const userId = userData?.user?._id;

  if (isLoading || userLoading) return <h1>Loading...</h1>;
  if (isError || userError)
    return <h1 className="text-red-500">Failed to load dashboard data</h1>;

  const { purchasedCourse = [] } = purchasedData || {};

  // ✅ Filter only those purchases where the logged-in user is the course creator
  const mySales = purchasedCourse.filter((item) => {
  const creatorId = item?.course?.creator;
  return creatorId?.toString() === userId?.toString();
});


  // ✅ Format for chart
  const courseData = mySales.map((item) => ({
    name: item.course?.courseTitle,
    price: item.amount || 0,
  }));

  const totalRevenue = mySales.reduce((acc, el) => acc + (el.amount || 0), 0);
  const totalSales = mySales.length;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Sales Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {courseData.length === 0 ? (
            <p className="text-gray-500 italic">No sales data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4a90e2"
                  strokeWidth={3}
                  dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
