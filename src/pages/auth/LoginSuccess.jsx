import { useNavigate, useLocation } from "react-router-dom";
import { GlobalStyles } from "../../components/Shared";
import { useState, useEffect } from "react";

const foods = ["🍕", "🍔", "🌮", "🍜", "🍣", "🧆", "🥗", "🍩"];

const quotes = [
  { text: "Good food is the foundation of genuine happiness.", author: "Auguste Escoffier" },
  { text: "One cannot think well, love well, sleep well, if one has not dined well.", author: "Virginia Woolf" },
  { text: "Food is not just eating energy. It's an experience.", author: "Guy Fieri" },
  { text: "Life is a combination of magic and pasta.", author: "Federico Fellini" },
  { text: "People who love to eat are always the best people.", author: "Julia Child" },
  { text: "First we eat, then we do everything else.", author: "M.F.K. Fisher" },
];

export default function LoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "foodie@tomato.com";
  const username = email.split("@")[0];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeQuote, setFadeQuote] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeQuote(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFadeQuote(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0905] flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Nunito']">
      <GlobalStyles />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(232,72,37,0.12),transparent_65%)] blur-[80px] pointer-events-none" />

      {/* Floating food */}
      {foods.map((f, i) => (
        <span key={i} className="absolute pointer-events-none select-none opacity-[0.06]"
          style={{
            left: `${5 + ((i * 13) % 88)}%`,
            top: `${4 + ((i * 17) % 88)}%`,
            fontSize: `${1.6 + (i % 3) * 0.6}rem`,
            animation: `drift ${7 + (i % 4)}s ease-in-out ${i * 0.7}s infinite`,
          }}>
          {f}
        </span>
      ))}

      <div className="relative z-10 w-full max-w-[520px] text-center">

        {/* Animated Check */}
        <div className="animate-pop mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#e84825] to-[#ff7043] flex items-center justify-center shadow-[0_16px_48px_rgba(232,72,37,0.55)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="animate-fadeUp delay-1 mb-2">
          <div className="flex items-center gap-2 justify-center mb-3">
            <span className="text-2xl">🍅</span>
            <span className="text-[1.8rem] font-black text-[#e84825] tracking-tight">Tomato.</span>
          </div>
          <h1 className="text-[2.2rem] font-black text-white tracking-tight">
            You're in, {username}! 🎉
          </h1>
          <p className="text-[14.5px] text-white/35 mt-2">
            Your foodie journey begins now.
          </p>
        </div>

        {/* User Card */}
        <div className="animate-fadeUp delay-2 mt-6 mb-8 p-5 rounded-3xl bg-white/[0.04] border border-white/8 flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e84825] to-[#ff7043] flex items-center justify-center text-2xl shrink-0 shadow-[0_8px_20px_rgba(232,72,37,0.35)] font-black text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-black text-white truncate">{username}</p>
            <p className="text-[12.5px] text-white/35 truncate">{email}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-green-400 font-bold">Online</span>
            </div>
          </div>
          <div className="text-white/20 text-sm font-bold shrink-0">✓ Verified</div>
        </div>

        {/* Quote Card */}
        <div
          className="animate-fadeUp delay-3 mb-8 p-7 rounded-3xl bg-white/[0.04] border border-white/8 text-center relative overflow-hidden"
          style={{ transition: "opacity 0.4s, transform 0.4s", opacity: fadeQuote ? 1 : 0, transform: fadeQuote ? "translateY(0)" : "translateY(8px)" }}
        >
          {/* Decorative quote mark */}
          <span className="absolute top-[-10px] left-4 text-[7rem] text-[rgba(232,72,37,0.1)] font-serif leading-none pointer-events-none select-none">"</span>
          <p className="relative z-10 text-[15px] font-bold text-white/75 leading-relaxed italic">
            {quotes[quoteIndex].text}
          </p>
          <p className="mt-3 text-[11px] font-black text-[#e84825] uppercase tracking-widest">
            — {quotes[quoteIndex].author}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fadeUp delay-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 p-3.5 rounded-2xl bg-gradient-to-br from-[#e84825] to-[#ff7043] text-white text-[15px] font-black border-none cursor-pointer
              shadow-[0_8px_28px_rgba(232,72,37,0.4)] hover:shadow-[0_14px_36px_rgba(232,72,37,0.55)]
              hover:-translate-y-0.5 hover:brightness-[1.07] transition-all duration-200"
          >
            🚀 Welcome — Go Inside!
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex-1 p-3.5 rounded-2xl border border-white/10 bg-white/5 text-white/70 text-[14px] font-bold cursor-pointer
              hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}