import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((store) => store.auth);

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated, authChecked } = useSelector((store) => store.auth);

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, authChecked } = useSelector(
    (store) => store.auth
  );

  if (!authChecked) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== "instructor") {
    return <Navigate to="/" />;
  }

  return children;
};
