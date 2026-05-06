import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtpAction } from "../../redux/slice/auth/logOtpSlice";
import { setToken, getProfile } from "../../redux/slice/profile/profileSlice"; // ✅ FIX
import { toast } from "react-toastify";
import { ArrowLeft, LeftPanel, GlobalStyles } from "../../components/Shared";

export default function LogOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, error: reduxError } = useSelector((state) => state.logotp);

  const email = location.state?.email || "your email";
  const from = location.state?.from || "forgot";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(59);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
    toast.info("A new OTP has been sent to your email.");
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      setError("Please enter all 6 digits");
      toast.warning("Complete the OTP!");
      return;
    }

    const result = await dispatch(verifyOtpAction({ email, otp: code }));

    if (verifyOtpAction.fulfilled.match(result)) {
      // 🔥🔥🔥 MAIN FIX START

      const token = result.payload?.token;

      if (token) {
        localStorage.setItem("token", token); // save token
        dispatch(setToken(token)); // 🔥 Redux update (instant navbar change)
        dispatch(getProfile()); // fetch user profile
      }

      navigate("/");
    } else {
      toast.error(result.payload || "Invalid OTP");
    }
  };

  const maskedEmail = email.replace(/(.{2}).+(@.+)/, "$1****$2");

  return (
    <div className="min-h-screen flex bg-[#0d0905] overflow-hidden relative font-['Nunito']">
      <GlobalStyles />

      <LeftPanel
        title="Check your"
        subtitle="inbox 📬"
        desc="We've sent a 6-digit code to verify your identity. It expires in 10 minutes."
      />

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[460px]">
          <button
            type="button"
            onClick={() =>
              navigate(from === "forgot" ? "/forgot-password" : "/login")
            }
            className="animate-fadeUp flex items-center gap-2 text-white/35 hover:text-white font-bold text-[13.5px] mb-8 bg-transparent border-none cursor-pointer transition-colors"
          >
            <ArrowLeft />
            Go back
          </button>

          <div className="animate-fadeUp delay-1 mb-8">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">🍅</span>
              <span className="text-[1.8rem] font-black text-[#e84825] tracking-tight">
                Tomato.
              </span>
            </div>
            <h2 className="text-[1.6rem] font-black text-white tracking-tight">
              Verify OTP 🔐
            </h2>
            <p className="text-sm text-white/35 mt-1.5">
              Code sent to{" "}
              <span className="text-white/60 font-bold">{maskedEmail}</span>
            </p>
          </div>

          <div className="animate-fadeUp delay-2 mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-[#e84825]/20 to-[#ff7043]/10 border border-[#e84825]/20 flex items-center justify-center text-4xl">
              🔐
            </div>
          </div>

          <div className="animate-fadeUp delay-3 mb-2">
            <label className="text-[14.5px] font-black text-white mb-4 block text-center">
              Enter 6-digit OTP
            </label>
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`w-12 h-14 text-center text-xl font-black text-white bg-white/5 rounded-2xl outline-none transition-all
                    border ${digit ? "border-[#e84825]" : "border-white/10"}
                    focus:border-[#e84825] focus:bg-[#e848250a] focus:shadow-[0_0_0_3px_rgba(232,72,37,0.2)]
                    ${error || reduxError ? "border-red-500/60" : ""}
                    sm:w-14 sm:h-16`}
                />
              ))}
            </div>

            {(error || reduxError) && (
              <p className="text-red-400 text-[11px] mt-3 text-center">
                {error || reduxError}
              </p>
            )}
          </div>

          <div className="animate-fadeUp delay-4 text-center mt-4 mb-6">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#e84825] font-black text-[13.5px] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
              >
                Resend OTP →
              </button>
            ) : (
              <p className="text-[12.5px] text-white/30">
                Resend code in{" "}
                <span className="text-[#e84825] font-black">
                  0:{String(timer).padStart(2, "0")}
                </span>
              </p>
            )}
          </div>

          <div className="animate-fadeUp delay-5">
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || otp.join("").length < 6}
              className="w-full p-3.5 rounded-2xl border-none bg-gradient-to-br from-[#e84825] to-[#ff7043] text-white text-[15px] font-black cursor-pointer
                shadow-[0_8px_28px_rgba(232,72,37,0.4)] hover:shadow-[0_14px_36px_rgba(232,72,37,0.55)]
                hover:-translate-y-0.5 hover:brightness-[1.07] active:translate-y-0 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP →"
              )}
            </button>
          </div>

          <div className="animate-fadeUp delay-6 mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/8">
            <p className="text-[12px] text-white/25 text-center leading-relaxed">
              💡 You can paste the OTP directly — it'll auto-fill all boxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
