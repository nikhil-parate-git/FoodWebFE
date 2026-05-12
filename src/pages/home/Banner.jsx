import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBanners } from "../../redux/slice/banner/bannerSlice";

// ── Lazy Image Hook ──
function useLazyImage(src) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);

  useEffect(() => {
    if (!src) {
      setLoaded(false);
      return;
    }
    setLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setLoaded(true);
    };
    img.onerror = () => {
      setCurrentSrc(src);
      setLoaded(true);
    };
    return () => {
      img.onload = null;
      img.onerror = null;
    };
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
          background:
            "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: slides, loading } = useSelector((state) => state.banners);

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const currentImageUrl = slides.length > 0 ? slides[current]?.image : null;
  const { currentSrc, loaded } = useLazyImage(currentImageUrl);

  // Preload next image
  useEffect(() => {
    if (slides.length < 2) return;
    const nextIndex = (current + 1) % slides.length;
    const nextSrc = slides[nextIndex]?.image;
    if (!nextSrc) return;
    const img = new Image();
    img.src = nextSrc;
    return () => { img.src = ""; };
  }, [current, slides]);

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

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading && slides.length === 0) {
    return (
      <div
        ref={bannerRef}
        className="relative w-full overflow-hidden rounded-2xl mx-auto bg-gray-100"
        style={{ maxWidth: "1200px", height: "420px" }}
      >
        <Skeleton />
      </div>
    );
  }

  if (!loading && slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div
      ref={bannerRef}
      className="relative w-full overflow-hidden rounded-2xl mx-auto"
      style={{ maxWidth: "1200px", height: "420px" }}
    >
      {!loaded && <Skeleton />}

      {/* ── BACKGROUND IMAGE — pura banner dikhega, koi crop nahi ── */}
      {currentSrc && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${currentSrc})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      {/* Dark overlay only on left side for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />

      {/* ── CONTENT ── */}
      <div
        className="relative z-10 flex flex-col justify-center h-full px-8 sm:px-14 max-w-xl"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <span className="inline-block mb-3 text-xs font-semibold bg-white/20 text-white backdrop-blur-sm px-3 py-1 rounded-full w-fit uppercase">
          {slide.tag}
        </span>
        <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-4">
          {slide.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-6 max-w-sm">
          {slide.desc}
        </p>
        <button
          onClick={() => navigate("/menu")}
          className="w-fit px-6 py-2.5 bg-[#e84825] hover:bg-[#cf3d1e] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg hover:scale-105"
        >
          {slide.btn}
        </button>
      </div>

      {/* ── PREV BUTTON ── */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ── NEXT BUTTON ── */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white"
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