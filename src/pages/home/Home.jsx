import React, { useState, lazy, Suspense, useEffect, useRef } from "react";
import Banner from "../../pages/home/Banner";
import ListingMenu from "../../pages/category/ListingMenu";

const AllDishes = lazy(() => import("../../pages/category/AllDishes"));

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

const Home = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-6 py-8">
        <Suspense
          fallback={
            <div className="h-48 bg-gray-100 animate-pulse rounded-xl" />
          }
        >
          <Banner />
        </Suspense>
      </div>

      <ListingMenu active={activeCategory} setActive={setActiveCategory} />

      <LazyAllDishes activeCategory={activeCategory} />
    </div>
  );
};

export default Home;
