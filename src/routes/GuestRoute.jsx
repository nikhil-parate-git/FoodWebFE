import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const reduxToken = useSelector((state) => state.profile.token);
  const localToken = localStorage.getItem("token");
  
  const token = reduxToken || localToken;

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;