import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const user     = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  if (role && !role.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return n;
}

export default ProtectedRoute;