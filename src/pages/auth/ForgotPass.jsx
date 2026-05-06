// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { ArrowLeft, LeftPanel, GlobalStyles } from "../../components/Shared";

// export default function ForgotPass() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [sent, setSent] = useState(false);

//   const formik = useFormik({
//     initialValues: { email: "" },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Invalid email address").required("Email is required"),
//     }),
//     onSubmit: async (values) => {
//       setLoading(true);
//       await new Promise((r) => setTimeout(r, 1200));
//       setLoading(false);
//       setSent(true);
//       // Navigate to OTP page with email state
//       setTimeout(() => navigate("/reset-password", { state: { email: values.email, from: "forgot" } }), 800);
//     },
//   });

//   return (
//     <div className="min-h-screen flex bg-[#0d0905] overflow-hidden relative font-['Nunito']">
//       <GlobalStyles />

//       {/* LEFT PANEL */}
//       <LeftPanel
//         title="Forgot your"
//         subtitle="password?"
//         desc="No worries! Enter your email and we'll send you a reset link in seconds."
//       />

//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex items-center justify-center p-6 md:p-10">
//         <div className="w-full max-w-[460px]">

//           {/* Back button */}
//           <button
//             type="button"
//             onClick={() => navigate("/login")}
//             className="animate-fadeUp flex items-center gap-2 text-white/35 hover:text-white font-bold text-[13.5px] mb-8 bg-transparent border-none cursor-pointer transition-colors"
//           >
//             <ArrowLeft />
//             Back to login
//           </button>

//           {/* Brand */}
//           <div className="animate-fadeUp delay-1 mb-8">
//             <div className="flex items-center gap-2 mb-1.5">
//               <span className="text-2xl">🍅</span>
//               <span className="text-[1.8rem] font-black text-[#e84825] tracking-tight">Tomato.</span>
//             </div>
//             <h2 className="text-[1.6rem] font-black text-white tracking-tight">Reset Password 🔑</h2>
//             <p className="text-sm text-white/35 mt-1.5">
//               Enter your registered email and we'll send you an OTP
//             </p>
//           </div>

//           {/* Icon */}
//           <div className="animate-fadeUp delay-2 mb-8 flex justify-center">
//             <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#e84825]/20 to-[#ff7043]/10 border border-[#e84825]/20 flex items-center justify-center text-4xl">
//               ✉️
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={formik.handleSubmit} noValidate>
//             <div className="animate-fadeUp delay-3 mb-6">
//               <label className="text-[14.5px] font-black text-white mb-2 block">Email Address</label>
//               <div className="relative">
//                 <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">✉️</span>
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="you@example.com"
//                   {...formik.getFieldProps("email")}
//                   className={`w-full bg-white/5 border rounded-2xl py-3.5 px-4 pl-11 text-white text-[14px] outline-none transition-all placeholder:text-white/20
//                     focus:bg-[#e848250a] focus:shadow-[0_0_0_3.5px_rgba(232,72,37,0.13)]
//                     ${formik.touched.email && formik.errors.email
//                       ? "border-red-500/60 focus:border-red-500"
//                       : "border-white/10 focus:border-[#e84825]"}`}
//                 />
//               </div>
//               {formik.touched.email && formik.errors.email && (
//                 <p className="text-red-400 text-[11px] mt-1.5 ml-1">{formik.errors.email}</p>
//               )}
//             </div>

//             {/* Submit */}
//             <div className="animate-fadeUp delay-4">
//               <button
//                 type="submit"
//                 disabled={loading || sent}
//                 className="w-full p-3.5 rounded-2xl border-none bg-gradient-to-br from-[#e84825] to-[#ff7043] text-white text-[15px] font-black cursor-pointer
//                   shadow-[0_8px_28px_rgba(232,72,37,0.4)] hover:shadow-[0_14px_36px_rgba(232,72,37,0.55)]
//                   hover:-translate-y-0.5 hover:brightness-[1.07] active:translate-y-0 transition-all duration-200
//                   disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Sending OTP...
//                   </>
//                 ) : sent ? (
//                   "OTP Sent! Redirecting... ✓"
//                 ) : (
//                   "Send OTP →"
//                 )}
//               </button>
//             </div>
//           </form>

//           {/* Info note */}
//           <div className="animate-fadeUp delay-5 mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/8">
//             <p className="text-[12.5px] text-white/30 text-center leading-relaxed">
//               📬 Check your spam folder if you don't see the email in your inbox within a minute.
//             </p>
//           </div>

//           {/* Back to login */}
//           <p className="animate-fadeUp delay-6 text-[13px] text-white/35 text-center mt-5">
//             Remembered it?{" "}
//             <button
//               type="button"
//               onClick={() => navigate("/login")}
//               className="font-black text-[#e84825] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer text-[13px]"
//             >
//               Sign in
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/slice/auth/forgotPassSlice";
import { ArrowLeft, LeftPanel, GlobalStyles } from "../../components/Shared";

export default function ForgotPass() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.password);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(forgotPassword(values.email));
      if (result.meta.requestStatus === "fulfilled") {
        setTimeout(() => {
          navigate("/reset-password", { state: { email: values.email } });
        }, 1000);
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-[#0d0905] overflow-hidden relative font-['Nunito']">
      <GlobalStyles />
      <LeftPanel
        title="Forgot your"
        subtitle="password?"
        desc="No worries! Enter your email and we'll send you a reset link in seconds."
      />
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[460px]">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="animate-fadeUp flex items-center gap-2 text-white/35 hover:text-white font-bold text-[13.5px] mb-8 bg-transparent border-none cursor-pointer transition-colors"
          >
            <ArrowLeft />
            Back to login
          </button>
          <div className="animate-fadeUp delay-1 mb-8">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🍅</span>
              <span className="text-[1.8rem] font-black text-[#e84825] tracking-tight">Tomato.</span>
            </div>
            <h2 className="text-[1.6rem] font-black text-white tracking-tight">Reset Password 🔑</h2>
            <p className="text-sm text-white/35 mt-1.5">Enter your registered email and we'll send you an OTP</p>
          </div>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="animate-fadeUp delay-3 mb-6">
              <label className="text-[14.5px] font-black text-white mb-2 block">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  {...formik.getFieldProps("email")}
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 px-4 pl-11 text-white text-[14px] outline-none transition-all
                    ${formik.touched.email && formik.errors.email ? "border-red-500/60" : "border-white/10"}`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-[11px] mt-1.5 ml-1">{formik.errors.email}</p>
              )}
            </div>
            <div className="animate-fadeUp delay-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-br from-[#e84825] to-[#ff7043] text-white text-[15px] font-black flex items-center justify-center gap-2"
              >
                {loading ? <span className="w-4 h-4 border-2 border-t-white rounded-full animate-spin" /> : "Send OTP →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}