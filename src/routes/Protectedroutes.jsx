import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // ✅ Redux token + localStorage token dono check karo
  const reduxToken = useSelector((state) => state.profile.token);
  const localToken = localStorage.getItem("token");
  
  const token = reduxToken || localToken;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;