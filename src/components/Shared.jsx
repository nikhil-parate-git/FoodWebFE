// ─── Icons ───────────────────────────────────────────────────────────────────

export const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
    <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v8.898h12.954c-.558 3.006-2.25 5.556-4.794 7.266v6.03h7.764c4.542-4.182 7.128-10.338 7.128-17.49z" fill="#4285F4" />
    <path d="M24.48 48c6.504 0 11.958-2.154 15.948-5.838l-7.764-6.03c-2.154 1.44-4.908 2.292-8.184 2.292-6.294 0-11.628-4.248-13.536-9.96H2.934v6.228C6.906 42.636 15.114 48 24.48 48z" fill="#34A853" />
    <path d="M10.944 28.464A14.46 14.46 0 0110.2 24c0-1.566.27-3.09.744-4.464V13.308H2.934A23.94 23.94 0 00.48 24c0 3.864.924 7.524 2.454 10.692l8.01-6.228z" fill="#FBBC05" />
    <path d="M24.48 9.576c3.546 0 6.726 1.218 9.228 3.606l6.912-6.912C36.432 2.394 30.978 0 24.48 0 15.114 0 6.906 5.364 2.934 13.308l8.01 6.228c1.908-5.712 7.242-9.96 13.536-9.96z" fill="#EA4335" />
  </svg>
);

export const EyeOpen = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EyeClosed = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowLeft = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Floating Food Background ─────────────────────────────────────────────────

const foods = ["🍕", "🍔", "🌮", "🍜", "🍣", "🧆", "🥗", "🍩"];

export const LeftPanel = ({ title, subtitle, desc }) => (
  <div className="hidden md:flex w-[42%] relative flex-col items-center justify-center bg-gradient-to-br from-[#1c0a02] via-[#2d1206] to-[#1a0800] border-r border-white/5 overflow-hidden">
    {/* Glow blobs */}
    <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,#e8482544,transparent_70%)] blur-[50px] animate-[pulse-glow_5s_ease-in-out_infinite]" />
    <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(circle,#ff704330,transparent_70%)] blur-[45px] animate-[pulse-glow_7s_ease-in-out_1s_infinite]" />

    {/* Floating emojis */}
    {foods.map((f, i) => (
      <span
        key={i}
        className="absolute opacity-[0.11] pointer-events-none select-none"
        style={{
          left: `${10 + ((i * 12) % 80)}%`,
          top: `${8 + ((i * 19) % 84)}%`,
          fontSize: `${1.4 + (i % 3) * 0.6}rem`,
          animation: `drift ${7 + (i % 4)}s ease-in-out ${i * 0.9}s infinite`,
        }}
      >
        {f}
      </span>
    ))}

    <div className="relative z-10 text-center px-10">
      <div className="text-6xl mb-4">🍅</div>
      <h1 className="text-[2.5rem] font-black text-white leading-[1.1] tracking-tighter">
        {title}
        <br />
        <span className="text-[#e84825]">{subtitle}</span>
      </h1>
      <p className="text-[14.5px] text-white/35 mt-5 leading-relaxed max-w-[260px] mx-auto">
        {desc}
      </p>
      <div className="flex gap-3 mt-10 justify-center flex-wrap">
        {["🍕 Pizza", "🍔 Burger", "🍜 Noodles"].map((d, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-full px-3.5 py-2 text-[12px] text-white/50 font-bold">
            {d}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Global Keyframes (inject once via <style>) ───────────────────────────────
export const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

    *, *::before, *::after { font-family: 'Nunito', sans-serif; }

    @keyframes drift {
      0%   { transform: translate(0,0) rotate(0deg); }
      33%  { transform: translate(12px,-18px) rotate(8deg); }
      66%  { transform: translate(-8px,10px) rotate(-5deg); }
      100% { transform: translate(0,0) rotate(0deg); }
    }
    @keyframes pulse-glow {
      0%,100% { opacity: 0.5; transform: scale(1); }
      50%      { opacity: 0.8; transform: scale(1.06); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pop {
      0%   { transform: scale(0.6); opacity: 0; }
      70%  { transform: scale(1.12); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes checkDraw {
      from { stroke-dashoffset: 100; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    input:-webkit-autofill {
      -webkit-background-clip: text;
      -webkit-text-fill-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
      box-shadow: inset 0 0 20px 20px #1a140f;
    }

    .animate-fadeUp { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
    .animate-pop    { animation: pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }

    /* Stagger delays */
    .delay-1 { animation-delay: 0.05s; }
    .delay-2 { animation-delay: 0.10s; }
    .delay-3 { animation-delay: 0.15s; }
    .delay-4 { animation-delay: 0.20s; }
    .delay-5 { animation-delay: 0.25s; }
    .delay-6 { animation-delay: 0.30s; }
    .delay-7 { animation-delay: 0.35s; }
  `}</style>
);