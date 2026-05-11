import React, { useEffect, memo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slice/category/categorySlice";
import { setCurrentPage } from "../../redux/slice/dishes/dishesSlice";

const SkeletonItem = memo(() => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 animate-pulse" />
    <div className="w-12 h-3 rounded-full bg-gray-200 animate-pulse" />
  </div>
));

const CategoryItem = memo(({ _id, name, image, isActive, onClick }) => (
  <button
    onClick={() => onClick(_id, name)}
    aria-pressed={isActive}
    className="flex flex-col items-center gap-2 group focus:outline-none"
  >
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
        isActive
          ? "border-[#e84825] scale-110 shadow-lg shadow-orange-100"
          : "border-transparent group-hover:border-orange-200 group-hover:scale-105"
      }`}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
    <span
      className={`text-xs font-medium transition-colors duration-200 ${
        isActive ? "text-[#e84825]" : "text-gray-600 group-hover:text-gray-900"
      }`}
    >
      {name}
    </span>
  </button>
));

// ─── All Dishes Icon ──────────────────────────────────────────────────────────
const AllDishesItem = memo(({ isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-pressed={isActive}
    className="flex flex-col items-center gap-2 group focus:outline-none"
  >
    <div
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
        isActive
          ? "border-[#e84825] scale-110 shadow-lg shadow-orange-100 bg-orange-50"
          : "border-transparent group-hover:border-orange-200 group-hover:scale-105 bg-gray-100"
      }`}
    >
      {/* Plate + fork & knife SVG */}
      <svg
        viewBox="0 0 64 64"
        className="w-9 h-9 sm:w-11 sm:h-11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Plate circle */}
        <circle
          cx="32"
          cy="32"
          r="18"
          stroke={isActive ? "#e84825" : "#9ca3af"}
          strokeWidth="2.5"
          fill={isActive ? "#fff5f2" : "#f3f4f6"}
          className="transition-all duration-300"
        />
        {/* Inner plate ring */}
        <circle
          cx="32"
          cy="32"
          r="12"
          stroke={isActive ? "#e84825" : "#d1d5db"}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="2 2"
          className="transition-all duration-300"
        />
        {/* Fork — left of plate */}
        <line
          x1="13" y1="20" x2="13" y2="34"
          stroke={isActive ? "#e84825" : "#6b7280"}
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <line
          x1="11" y1="20" x2="11" y2="26"
          stroke={isActive ? "#e84825" : "#6b7280"}
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        <line
          x1="15" y1="20" x2="15" y2="26"
          stroke={isActive ? "#e84825" : "#6b7280"}
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        {/* Knife — right of plate */}
        <path
          d="M51 20 C51 20 53 23 53 26 C53 29 51 30 51 30 L51 44"
          stroke={isActive ? "#e84825" : "#6b7280"}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300"
        />
      </svg>
    </div>
    <span
      className={`text-xs font-medium transition-colors duration-200 ${
        isActive ? "text-[#e84825]" : "text-gray-600 group-hover:text-gray-900"
      }`}
    >
      All
    </span>
  </button>
));

// ─── Main Component ───────────────────────────────────────────────────────────
const ListingMenu = ({ active, setActive }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.categories);

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = useCallback(
    (id, name) => {
      const current = activeRef.current;
      setActive(current?.id === id ? null : { id, name });
      dispatch(setCurrentPage(1));
    },
    [setActive, dispatch]
  );

  const handleAllClick = useCallback(() => {
    setActive(null);
    dispatch(setCurrentPage(1));
  }, [setActive, dispatch]);

  return (
    <section className="w-full px-6 py-10 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore our menu</h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose from a diverse menu featuring a delectable array of dishes.
      </p>
      <div className="w-16 h-0.5 bg-[#e84825] rounded-full mb-8" />

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {/* All Dishes — hamesha pehle */}
        <AllDishesItem isActive={active === null} onClick={handleAllClick} />

        {loading
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonItem key={i} />)
          : items.map(({ _id, name, image }) => (
              <CategoryItem
                key={_id}
                _id={_id}
                name={name}
                image={image}
                isActive={active?.id === _id}
                onClick={handleCategoryClick}
              />
            ))}
      </div>

      {/* Active filter pill */}
      {active && (
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-2 rounded-full">
            <span className="text-sm text-gray-600">Showing dishes for</span>
            <span className="text-sm font-semibold text-[#e84825]">{active.name}</span>
            <button
              onClick={handleAllClick}
              className="ml-1 text-gray-400 hover:text-[#e84825] transition-colors leading-none"
              aria-label="Clear category filter"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ListingMenu;