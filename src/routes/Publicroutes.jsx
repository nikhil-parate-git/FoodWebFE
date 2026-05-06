import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ProtectedRoute from "../routes/Protectedroutes";
import GuestRoute from "../routes/GuestRoute";

import Home from "../pages/home/Home";
import MenuPage from "../pages/category/MenuPage";
import CartPage from "../context/CartPage";
import LoginPage from "../pages/auth/Login";
import SignupPage from "../pages/auth/Signup";
import AddressForm from "../context/AddressForm";
import Payment from "../context/Payment";
import Orders from "../pages/myorders/Orders";
import ForgotPass from "../pages/auth/ForgotPass";
import ResetPass from "../pages/auth/ResetPass";
import LoginSuccess from "../pages/auth/LoginSuccess";
import LogOtp from "../pages/auth/LogOtp";
import Profile from "../pages/profile/Profile";

const Publicroutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* ✅ Public routes — sabko dikhe */}
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* ✅ Guest routes — logged in user login/signup pe nahi jayega */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/logotp" element={<LogOtp />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route path="/dashboard" element={<LoginSuccess />} />
        </Route>

        {/* ✅ Protected routes — sirf logged in user access kar sakta hai */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/addressform" element={<AddressForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Publicroutes;
