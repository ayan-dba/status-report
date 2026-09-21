import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("dba_token");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
