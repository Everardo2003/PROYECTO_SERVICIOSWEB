// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) return <Navigate to="/" replace />;
  if (rol !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
