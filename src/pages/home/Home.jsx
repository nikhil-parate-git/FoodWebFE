import React, { useState, lazy, Suspense, useEffect, useRef } from "react";
import Banner from "../../pages/home/Banner";
import ListingMenu from "../../pages/category/ListingMenu";

const AllDishes = lazy(() => import("../../pages/category/AllDishes"));
const About = lazy(() => import("../../pages/aboutcontact/About"));
const Contact = lazy(() => import("../../pages/aboutcontact/Contact"));

const LazyAllDishes = ({ activeCategory }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {shouldRender && (
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-16">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-400 rounded-full animate-spin" />
            </div>
          }
        >
          <AllDishes activeCategory={activeCategory} />
        </Suspense>
      )}
    </div>
  );
};

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[40vh]">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-400 rounded-full animate-spin" />
  </div>
);

const Home = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Banner */}
      <div className="px-6 py-8">
        <Suspense fallback={<div className="h-48 bg-gray-100 animate-pulse rounded-xl" />}>
          <Banner />
        </Suspense>
      </div>

      {/* Menu Listing */}
      <ListingMenu active={activeCategory} setActive={setActiveCategory} />

      {/* All Dishes — lazy loads on scroll */}
      <LazyAllDishes activeCategory={activeCategory} />

      {/* About Section */}
      <Suspense fallback={<PageLoader />}>
        <About />
      </Suspense>

      {/* Contact Section */}
      <Suspense fallback={<PageLoader />}>
        <Contact />
      </Suspense>
    </div>
  );
};

export default Home;