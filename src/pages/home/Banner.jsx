import React, { useState, useEffect, useRef } from "react";

// Unsplash images for a professional look
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200",
    tag: "🍕 Fast Delivery",
    title: "Order your favourite food here",
    desc: "Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.",
    btn: "View Menu",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1200",
    tag: "🌮 Fresh & Hot",
    title: "Taste the world, one bite at a time",
    desc: "From sizzling street food to fine dining classics — explore hundreds of cuisines delivered straight to your door.",
    btn: "Explore Now",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200",
    tag: "🥗 Eat Healthy",
    title: "Fresh ingredients, bold flavours",
    desc: "Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.",
    btn: "Order Now",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200",
    tag: "💪 Eat Healthy & Live Fit",
    title: "Fuel your body with the right nutrition",
    desc: "Discover wholesome meals packed with proteins, vitamins, and minerals — because healthy eating should never be boring.",
    btn: "See Healthy Options",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200",
    tag: "😍 Smells Good, Tastes Better",
    title: "Irresistible aromas, unforgettable flavours",
    desc: "Every dish is crafted to awaken your senses — from the first whiff to the very last bite. Fall in love with food, all over again.",
    btn: "Order Now",
  },
];

// ── Lazy Image Hook ──
function useLazyImage(src) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);

  useEffect(() => {
    if (!src) return;
    setLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setLoaded(true);
    };
    return () => { img.onload = null; };
  }, [src]);

  return { currentSrc, loaded };
}

// ── Skeleton Shimmer ──
function Skeleton() {
  return (
    <div className="absolute inset-0 bg-gray-200 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const bannerRef = useRef(null);
  const [inView, setInView] = useState(false);

  // ── IntersectionObserver — only load when banner is visible ──
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Preload next slide image in background ──
  useEffect(() => {
    if (!inView) return;
    const nextIndex = (current + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextIndex].image;
  }, [current, inView]);

  const goTo = (index) => {
    if (animating || index === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  // Auto-play
  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [inView]);

  const slide = slides[current];
  const { currentSrc, loaded } = useLazyImage(inView ? slide.image : null);

  return (
    <div
      ref={bannerRef}
      className="relative w-full overflow-hidden rounded-2xl mx-auto"
      style={{ maxWidth: "1200px", height: "420px" }}
    >
      {/* ── SKELETON while loading ── */}
      {!loaded && <Skeleton />}

      {/* ── BACKGROUND IMAGE ── */}
      {currentSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${currentSrc})`,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      {/* ── OVERLAY ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* ── CONTENT ── */}
      <div
        className="relative z-10 flex flex-col justify-center h-full px-8 sm:px-14 max-w-xl"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <span className="inline-block mb-3 text-xs font-semibold bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full w-fit">
          {slide.tag}
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {slide.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-6 max-w-sm">
          {slide.desc}
        </p>
        <button className="w-fit px-6 py-2.5 bg-[#e84825] hover:bg-[#cf3d1e] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-orange-500/30 hover:scale-105">
          {slide.btn}
        </button>
      </div>

      {/* ── PREV / NEXT ARROWS ── */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── DOTS ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? "#e84825" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}