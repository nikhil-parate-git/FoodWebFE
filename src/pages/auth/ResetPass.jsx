import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/slice/auth/forgotPassSlice";
import {
  ArrowLeft,
  EyeOpen,
  EyeClosed,
  LeftPanel,
  GlobalStyles,
} from "../../components/Shared";

export default function ResetPass() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.password);

  const emailFromState = location.state?.email || "";
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: emailFromState,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email().required("Required"),
      otp: Yup.string()
        .length(6, "Full OTP required")
        .required("OTP is required"),
      newPassword: Yup.string().min(8, "Min 8 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(resetPassword(values));
      if (result.meta.requestStatus === "fulfilled") {
        setDone(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    },
  });

  // Handle OTP Input Logic
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    // Formik value update
    const fullOtp = newOtp.join("");
    formik.setFieldValue("otp", fullOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0d0905] overflow-hidden relative font-['Nunito']">
      <GlobalStyles />
      <LeftPanel
        title="New password,"
        subtitle="fresh start 🔒"
        desc="Choose a strong password."
      />

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[460px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/35 mb-8 bg-transparent cursor-pointer border-none"
          >
            <ArrowLeft /> Go back
          </button>

          <div className="mb-8">
            <h2 className="text-[1.6rem] font-black text-white">
              {done ? "Success! ✅" : "Reset Details 🔒"}
            </h2>
          </div>

          {!done ? (
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-6">
                <label className="text-white text-sm mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  readOnly
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white/40 outline-none cursor-not-allowed"
                />
              </div>

              {/* 6 BLOCKS OTP UI */}
              <div className="mb-8">
                <label className="text-white text-[14.5px] font-black mb-3 block text-center">
                  Verify OTP
                </label>
                <div className="flex justify-between gap-2">
                  {otpValues.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 text-center text-xl font-bold rounded-xl bg-white/5 border transition-all outline-none text-white
                        ${formik.errors.otp && formik.touched.otp ? "border-red-500/50" : "border-white/10 focus:border-[#e84825] focus:bg-[#e848250a]"}`}
                    />
                  ))}
                </div>
                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-red-400 text-center text-[11px] mt-2">
                    {formik.errors.otp}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="text-white text-sm mb-2 block font-black">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    {...formik.getFieldProps("newPassword")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-[#e84825]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-3.5 text-white/30 hover:text-white transition-colors"
                  >
                    {showNew ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-red-400 text-[11px] mt-1.5">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="text-white text-sm mb-2 block font-black">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    {...formik.getFieldProps("confirmPassword")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white outline-none focus:border-[#e84825]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3.5 text-white/30 hover:text-white transition-colors"
                  >
                    {showConfirm ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-400 text-[11px] mt-1.5">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-br from-[#e84825] to-[#ff7043] text-white font-black shadow-[0_8px_20px_rgba(232,72,37,0.3)] hover:brightness-110 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </div>
                ) : (
                  "Reset Password →"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-white font-bold mb-2">Password Updated!</h3>
              <p className="text-white/40 text-sm">
                Redirecting to login page...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
