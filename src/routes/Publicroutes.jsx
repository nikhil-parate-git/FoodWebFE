import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import ProtectedRoute from "../routes/Protectedroutes";
import GuestRoute from "../routes/GuestRoute";

// Eager load — above the fold / critical
import Home from "../pages/home/Home";

// Lazy load — baaki sab
const MenuPage     = lazy(() => import("../pages/category/MenuPage"));
const CartPage     = lazy(() => import("../context/CartPage"));
const LoginPage    = lazy(() => import("../pages/auth/Login"));
const SignupPage   = lazy(() => import("../pages/auth/Signup"));
const AddressForm  = lazy(() => import("../context/AddressForm"));
const Payment      = lazy(() => import("../context/Payment"));
const Orders       = lazy(() => import("../pages/myorders/Orders"));
const ForgotPass   = lazy(() => import("../pages/auth/ForgotPass"));
const ResetPass    = lazy(() => import("../pages/auth/ResetPass"));
const LoginSuccess = lazy(() => import("../pages/auth/LoginSuccess"));
const LogOtp       = lazy(() => import("../pages/auth/LogOtp"));
const Profile      = lazy(() => import("../pages/profile/Profile"));

// Central fallback spinner
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-400 rounded-full animate-spin" />
  </div>
);

const Publicroutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/menu"
          element={
            <Suspense fallback={<PageLoader />}>
              <MenuPage />
            </Suspense>
          }
        />

        {/* Guest routes */}
        <Route element={<GuestRoute />}>
          <Route path="/login"            element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
          <Route path="/signup"           element={<Suspense fallback={<PageLoader />}><SignupPage /></Suspense>} />
          <Route path="/logotp"           element={<Suspense fallback={<PageLoader />}><LogOtp /></Suspense>} />
          <Route path="/forgot-password"  element={<Suspense fallback={<PageLoader />}><ForgotPass /></Suspense>} />
          <Route path="/reset-password"   element={<Suspense fallback={<PageLoader />}><ResetPass /></Suspense>} />
          <Route path="/dashboard"        element={<Suspense fallback={<PageLoader />}><LoginSuccess /></Suspense>} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart"        element={<Suspense fallback={<PageLoader />}><CartPage /></Suspense>} />
          <Route path="/addressform" element={<Suspense fallback={<PageLoader />}><AddressForm /></Suspense>} />
          <Route path="/payment"     element={<Suspense fallback={<PageLoader />}><Payment /></Suspense>} />
          <Route path="/orders"      element={<Suspense fallback={<PageLoader />}><Orders /></Suspense>} />
          <Route path="/profile"     element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Publicroutes;