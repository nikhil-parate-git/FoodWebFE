import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slice/auth/signupSlice";

const foods = ["🍕", "🍔", "🌮", "🍜", "🍣", "🥗", "🍩", "🌯", "🧆", "🥘"];

const GENDERS = [
  { label: "Male", emoji: "👨", value: "male" },
  { label: "Female", emoji: "👩", value: "female" },
  { label: "Other", emoji: "🧑", value: "other" },
];

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  gender: Yup.string().required("Please select your gender"),
  agreed: Yup.boolean().oneOf([true], "You must accept terms"),
});

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPass, setShowPass] = useState(false);

  const getStrength = (pw) => {
    if (!pw) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 10) return 2;
    return 3;
  };

  const strengthColors = [
    "bg-transparent",
    "bg-orange-600",
    "bg-amber-500",
    "bg-green-500",
  ];
  const textColors = [
    "",
    "text-orange-600",
    "text-amber-500",
    "text-green-500",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const handleSignup = async (values) => {
    const userData = {
      name: values.name,
      email: values.email,
      password: values.password,
      gender: values.gender,
    };

    const result = await dispatch(registerUser(userData));
    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex rounded-2xl bg-[#0d0905] overflow-hidden relative font-['Nunito']">
      {/* Floating Background Elements */}
      {foods.map((f, i) => (
        <span
          key={i}
          className="absolute opacity-[0.07] pointer-events-none select-none z-0 animate-[drift_6s_ease-in-out_infinite]"
          style={{
            left: `${(i * 9.7 + 3) % 95}%`,
            top: `${(i * 13.3 + 5) % 90}%`,
            fontSize: `${1.1 + (i % 3) * 0.55}rem`,
            animationDuration: `${6 + (i % 5)}s`,
            animationDelay: `${i * 0.6}s`,
          }}
        >
          {f}
        </span>
      ))}

      {/* ── LEFT FORM PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-5 md:p-10 relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full max-w-[600px]"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🍅</span>
              <span className="font-['Syne'] text-[1.8rem] font-extrabold text-[#e84825] tracking-tighter">
                Tomato.
              </span>
            </div>
            <h2 className="font-['Syne'] text-[1.6rem] font-bold text-white tracking-tight">
              Create your account 🚀
            </h2>
          </motion.div>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              gender: "",
              agreed: false,
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ values, touched, errors, setFieldValue }) => (
              <Form className="space-y-4">
                {/* Name */}
                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-semibold text-white mb-1.5 ml-1">
                    Full Name
                  </label>
                  <Field
                    name="name"
                    placeholder="John Doe"
                    className={`w-full bg-white/5 border ${
                      touched.name && errors.name
                        ? "border-red-500"
                        : "border-white/10"
                    } rounded-xl py-3 px-4 text-white outline-none focus:border-[#e84825] transition-all`}
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-semibold text-white mb-1.5 ml-1">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full bg-white/5 border ${
                      touched.email && errors.email
                        ? "border-red-500"
                        : "border-white/10"
                    } rounded-xl py-3 px-4 text-white outline-none focus:border-[#e84825] transition-all`}
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-semibold text-white mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${
                        touched.password && errors.password
                          ? "border-red-500"
                          : "border-white/10"
                      } rounded-xl py-3 px-4 pr-12 text-white outline-none focus:border-[#e84825]`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#e84825]"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />

                  {/* ✅ Password Strength Bar */}
                  {values.password && (
                    <div className="mt-2 ml-1">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              getStrength(values.password) >= level
                                ? strengthColors[getStrength(values.password)]
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs font-semibold ${
                          textColors[getStrength(values.password)]
                        }`}
                      >
                        {strengthLabels[getStrength(values.password)]}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Gender */}
                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-semibold text-white mb-2 ml-1">
                    Gender
                  </label>
                  <div className="flex gap-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setFieldValue("gender", g.value)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                          values.gender === g.value
                            ? "border-[#e84825] bg-[#e848251a] text-[#e84825]"
                            : "border-white/10 bg-white/5 text-white/40 hover:border-white/30"
                        }`}
                      >
                        <span className="text-xl">{g.emoji}</span> {g.label}
                      </button>
                    ))}
                  </div>
                  <ErrorMessage
                    name="gender"
                    component="p"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                </motion.div>

                {/* ✅ Terms & Conditions Checkbox — YE MISSING THA */}
                <motion.div variants={fadeUp}>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreed"
                      checked={values.agreed}
                      onChange={(e) => setFieldValue("agreed", e.target.checked)}
                      className="mt-1 accent-[#e84825] w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor="agreed"
                      className="text-sm text-white/40 cursor-pointer leading-relaxed"
                    >
                      I agree to the{" "}
                      <span className="text-[#e84825] font-bold hover:underline">
                        Terms & Conditions
                      </span>{" "}
                      and{" "}
                      <span className="text-[#e84825] font-bold hover:underline">
                        Privacy Policy
                      </span>
                    </label>
                  </div>
                  <ErrorMessage
                    name="agreed"
                    component="p"
                    className="text-red-500 text-xs mt-1 ml-1"
                  />
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#e84825] to-[#ff7043] text-white font-bold text-base shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Account 🍕"}
                  </button>
                </motion.div>
              </Form>
            )}
          </Formik>

          <motion.p
            variants={fadeUp}
            className="text-center text-sm text-white/30 mt-6"
          >
            Already a foodie?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#e84825] cursor-pointer font-bold hover:underline"
            >
              Sign in
            </button>
          </motion.p>
        </motion.div>
      </div>

      {/* ── RIGHT DECORATIVE PANEL ── */}
      <div className="hidden lg:flex w-[40%] flex-col items-center justify-center relative bg-gradient-to-br from-[#1c0a02] via-[#2d1206] to-[#180800] border-l border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12"
        >
          <div className="text-7xl mb-6 animate-[spin_12s_linear_infinite] inline-block">
            🍽️
          </div>
          <h2 className="font-['Syne'] text-4xl font-extrabold text-white leading-tight mb-4 tracking-tighter">
            Your table <br /> <span className="text-[#e84825]">is ready.</span>
          </h2>
          <p className="text-white/40 text-base mb-10 max-w-[280px] mx-auto">
            Join the club of 50k+ food lovers and get the best meals delivered.
          </p>

          <div className="space-y-4 inline-block text-left">
            {[
              ["⚡", "Fast delivery"],
              ["🎁", "Pro rewards"],
              ["📍", "Live tracking"],
            ].map(([icon, text]) => (
              <div
                key={text}
                className="flex items-center gap-4 bg-white/5 py-2 px-4 rounded-full border border-white/5"
              >
                <span>{icon}</span>
                <span className="text-sm font-bold text-white/60">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes drift {
          0%   { transform: translate(0,0) rotate(0deg); }
          50%  { transform: translate(15px,-20px) rotate(10deg); }
          100% { transform: translate(0,0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}