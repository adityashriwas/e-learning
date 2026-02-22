import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { ThemeProvider } from "./components/ThemeProvider";
import { useLoadUserQuery } from "./features/api/authApi";

const Login = lazy(() => import("./pages/Login"));
const HeroSection = lazy(() => import("./pages/student/HeroSection"));
const MainLayout = lazy(() => import("./layout/MainLayout"));
const Courses = lazy(() => import("./pages/student/Courses"));
const MyLearning = lazy(() => import("./pages/student/MyLearning"));
const Profile = lazy(() => import("./pages/student/Profile"));
const Sidebar = lazy(() => import("./pages/admin/Sidebar"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const CourseTable = lazy(() => import("./pages/admin/course/CourseTable"));
const AddCourse = lazy(() => import("./pages/admin/course/AddCourse"));
const EditCourse = lazy(() => import("./pages/admin/course/EditCourse"));
const CreateLecture = lazy(() => import("./pages/admin/lecture/CreateLecture"));
const EditLecture = lazy(() => import("./pages/admin/lecture/EditLecture"));
const CourseDetail = lazy(() => import("./pages/student/CourseDetail"));
const CourseProgress = lazy(() => import("./pages/student/CourseProgress"));
const SearchPage = lazy(() => import("./pages/student/SearchPage"));

const withSuspense = (node) => (
  <Suspense fallback={<LoadingSpinner />}>{node}</Suspense>
);

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<MainLayout />),
    children: [
      {
        path: "/",
        element: withSuspense(
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <AuthenticatedUser>{withSuspense(<Login />)}</AuthenticatedUser>
        ),
      },
      {
        path: "my-learning",
        element: <ProtectedRoute>{withSuspense(<MyLearning />)}</ProtectedRoute>,
      },
      {
        path: "profile",
        element: <ProtectedRoute>{withSuspense(<Profile />)}</ProtectedRoute>,
      },
      {
        path: "course/search",
        element: <ProtectedRoute>{withSuspense(<SearchPage />)}</ProtectedRoute>,
      },
      {
        path: "course-detail/:courseId",
        element: (
          <ProtectedRoute>{withSuspense(<CourseDetail />)}</ProtectedRoute>
        ),
      },
      {
        path: "course-progress/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              {withSuspense(<CourseProgress />)}
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: <AdminRoute>{withSuspense(<Sidebar />)}</AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: withSuspense(<Dashboard />),
          },
          {
            path: "course",
            element: withSuspense(<CourseTable />),
          },
          {
            path: "course/create",
            element: withSuspense(<AddCourse />),
          },
          {
            path: "course/:courseId",
            element: withSuspense(<EditCourse />),
          },
          {
            path: "course/:courseId/lecture",
            element: withSuspense(<CreateLecture />),
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: withSuspense(<EditLecture />),
          },
        ],
      },
    ],
  },
]);

function App() {
  useLoadUserQuery();

  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  );
}

export default App;
