import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slice/category/categorySlice";
import { setCurrentPage } from "../../redux/slice/dishes/dishesSlice";

const SkeletonItem = () => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 animate-pulse" />
    <div className="w-12 h-3 rounded-full bg-gray-200 animate-pulse" />
  </div>
);

const ListingMenu = ({ active, setActive }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (id, name) => {
    if (active?.id === id) {
      setActive(null);
    } else {
      setActive({ id, name });
    }
    dispatch(setCurrentPage(1));
  };

  return (
    <section className="w-full px-6 py-10 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Explore our menu
      </h2>
      <p className="text-sm text-gray-500 mb-8">
        Choose from a diverse menu featuring a delectable array of dishes.
      </p>
      <div className="w-16 h-0.5 bg-[#e84825] rounded-full mb-8" />

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonItem key={i} />)
          : items.map(({ _id, name, image }) => {
              const isActive = active?.id === _id;
              return (
                <button
                  key={_id}
                  onClick={() => handleCategoryClick(_id, name)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all ${isActive ? "border-[#e84825] scale-110 shadow-lg" : "border-transparent"}`}
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${isActive ? "text-[#e84825]" : "text-gray-600"}`}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
      </div>
    </section>
  );
};

export default ListingMenu;