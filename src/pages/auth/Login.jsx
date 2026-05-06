import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slice/auth/loginSlice";
import {
  EyeOpen,
  EyeClosed,
  LeftPanel,
  GlobalStyles,
} from "../../components/Shared";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);

  // Redux state se loading nikalna
  const { loading } = useSelector((state) => state.login);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Minimum 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(loginUser(values));

      // Agar API call successful rahi toh redirect
      if (loginUser.fulfilled.match(result)) {
        navigate("/logotp", { state: { email: values.email } });
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-[#0d0905] overflow-hidden relative font-['Nunito']">
      <GlobalStyles />

      <LeftPanel
        title="Good food,"
        subtitle="great vibes."
        desc="Sign in to order your favourite meals, track deliveries & unlock exclusive deals."
      />

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[460px]">
          <div className="mb-8 animate-fadeUp">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🍅</span>
              <span className="text-[1.8rem] font-black text-[#e84825] tracking-tight">
                Tomato.
              </span>
            </div>
            <h2 className="text-[1.6rem] font-black text-white tracking-tight">
              Welcome back 👋
            </h2>
            <p className="text-sm text-white/35 mt-1.5">
              Sign in to continue your foodie journey
            </p>
          </div>

          <div className="animate-fadeUp delay-2 my-6 flex items-center gap-3 text-white/20 text-[11px] font-bold uppercase tracking-widest">
            <div className="flex-1 h-px bg-white/10" />
            or use your credentials
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="animate-fadeUp delay-3 mb-4">
              <label className="text-[14.5px] font-black text-white mb-2 block">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">
                  ✉️
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  {...formik.getFieldProps("email")}
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 px-4 pl-11 text-white text-[14px] outline-none transition-all placeholder:text-white/20
                    focus:bg-[#e848250a] focus:shadow-[0_0_0_3.5px_rgba(232,72,37,0.13)]
                    ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-[#e84825]"
                    }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-[11px] mt-1.5 ml-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="animate-fadeUp delay-4 mb-2">
              <label className="text-[14.5px] font-black text-white mb-2 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">
                  🔒
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  {...formik.getFieldProps("password")}
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 px-11 text-white text-[14px] outline-none transition-all placeholder:text-white/20
                    focus:bg-[#e848250a] focus:shadow-[0_0_0_3.5px_rgba(232,72,37,0.13)]
                    ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-500/60 focus:border-red-500"
                        : "border-white/10 focus:border-[#e84825]"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors p-1"
                >
                  {showPass ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-[11px] mt-1.5 ml-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="animate-fadeUp delay-5 flex justify-end mb-6">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-[13px] font-bold text-[#e84825] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <div className="animate-fadeUp delay-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3.5 rounded-2xl border-none bg-gradient-to-br from-[#e84825] to-[#ff7043] text-white text-[15px] font-black cursor-pointer
                  shadow-[0_8px_28px_rgba(232,72,37,0.4)] hover:shadow-[0_14px_36px_rgba(232,72,37,0.55)]
                  hover:-translate-y-0.5 hover:brightness-[1.07] active:translate-y-0 transition-all duration-200
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </div>
          </form>

          <p className="animate-fadeUp delay-7 text-[13px] text-white/35 text-center mt-6">
            New to Tomato?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-black text-[#e84825] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer text-[13px]"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
