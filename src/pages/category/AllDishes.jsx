import React, { useEffect, useState, useMemo, memo, useCallback} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDishes,
  fetchDishesByCategory,
} from "../../redux/slice/dishes/dishesSlice";
import { addToCartThunk } from "../../redux/slice/cart/cartSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Clock,
  Flame,
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

// ─── Animation variants ────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonLoader = memo(() => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden">
            <div className="w-full h-56 bg-gradient-to-r from-gray-200 to-gray-100" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-8 bg-gray-200 rounded-full w-8" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

// ─── Single Dish Card ──────────────────────────────────────────────────────────
const DishCard = memo(({ dish, inCart, cartQty, cartLoading, onAddClick, searchTerm }) => {
  return (
    <motion.div
      key={dish._id}
      variants={itemVariants}
      layout
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#e84825]/0 to-[#e84825]/0 rounded-2xl transition-all duration-300 " />

      <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddClick(dish._id)}
            disabled={cartLoading}
            className={`absolute bottom-4 right-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              inCart
                ? "bg-[#e84825] text-white w-10 h-10"
                : "bg-white text-[#e84825] w-10 h-10 hover:w-28 hover:bg-[#e84825] hover:text-white group/btn"
            }`}
          >
            {inCart ? (
              <ShoppingBag className="w-4 h-4" />
            ) : (
              <>
                <span className="text-xl font-bold leading-none group-hover/btn:hidden">+</span>
                <span className="hidden group-hover/btn:inline text-xs font-semibold whitespace-nowrap">
                  Add to Cart
                </span>
              </>
            )}
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-1 flex-1">
              {dish.name}
            </h3>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg shrink-0">
              <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
              <span className="text-green-700 text-xs font-semibold">
                {dish.rating || "4.5"}
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {dish.description || "Delicious dish prepared with fresh ingredients and authentic spices."}
          </p>

          {searchTerm && dish.description?.toLowerCase().includes(searchTerm.toLowerCase()) && (
            <div className="bg-yellow-50 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full inline-block">
              Matches your search
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <div className="space-y-0.5">
              <span className="text-xl font-extrabold text-gray-900">₹{dish.price}</span>
              {dish.originalPrice && (
                <span className="text-xs text-gray-400 line-through ml-2">
                  ₹{dish.originalPrice}
                </span>
              )}
            </div>
            {inCart && (
              <div className="bg-green-50 px-2 py-1 rounded-lg">
                <span className="text-green-700 text-xs font-semibold">{cartQty} in cart</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ─── Main Component ────────────────────────────────────────────────────────────
const AllDishes = ({ activeCategory }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  // Track whether user has expanded beyond page 1
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  const { items: dishes, loading, loadingMore, pagination } = useSelector((state) => state.dishes);
  const { items: cartItems, loading: cartLoading } = useSelector((state) => state.pagecart);

  // Category/page change hone par fresh fetch (page 1)
  useEffect(() => {
    const catId = activeCategory?.id || activeCategory?._id || null;
    if (catId) {
      dispatch(fetchDishesByCategory({ categoryId: catId, page: 1 }));
    } else {
      dispatch(fetchDishes(1));
    }
    setSortBy("default");
    setSearchTerm("");
    setShowSearch(false);
    setHasLoadedMore(false); // reset on category change
  }, [dispatch, activeCategory]);

  // "Show More" handler — next page fetch karta hai
  const handleShowMore = useCallback(() => {
    if (loadingMore) return;
    const nextPage = (pagination?.currentPage || 1) + 1;
    const catId = activeCategory?.id || activeCategory?._id || null;
    if (catId) {
      dispatch(fetchDishesByCategory({ categoryId: catId, page: nextPage }));
    } else {
      dispatch(fetchDishes(nextPage));
    }
    setHasLoadedMore(true);
  }, [dispatch, activeCategory, pagination, loadingMore]);

  // "Show Less" handler — page 1 pe wapas le jaata hai
  const handleShowLess = useCallback(() => {
    const catId = activeCategory?.id || activeCategory?._id || null;
    if (catId) {
      dispatch(fetchDishesByCategory({ categoryId: catId, page: 1 }));
    } else {
      dispatch(fetchDishes(1));
    }
    setHasLoadedMore(false);
    // Smoothly scroll back to top of dish section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, activeCategory]);

  const getCartQty = useCallback(
    (dishId) => cartItems?.find((i) => i.dish?._id === dishId)?.quantity || 0,
    [cartItems]
  );

  const handleAddClick = useCallback(
    (dishId) => {
      if (!cartLoading) dispatch(addToCartThunk({ dishId, quantity: 1 }));
    },
    [dispatch, cartLoading]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setShowSearch(false);
  }, []);

  const filteredAndSortedDishes = useMemo(() => {
    let filtered = dishes;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = dishes.filter((dish) =>
        dish.name?.toLowerCase().includes(searchLower) ||
        dish.description?.toLowerCase().includes(searchLower) ||
        (typeof dish.category === "string" && dish.category.toLowerCase().includes(searchLower)) ||
        (typeof dish.category?.name === "string" && dish.category.name.toLowerCase().includes(searchLower))
      );
    }

    if (sortBy === "price_low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price_high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return filtered;
  }, [dishes, searchTerm, sortBy]);

  // Kya aur pages bache hain?
  const hasMore = pagination?.currentPage < pagination?.totalPages;

  return (
    <div className="to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-7 bg-gradient-to-b from-[#e84825] to-[#ff6b4a] rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {activeCategory ? activeCategory.name : "All Dishes"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#e84825]">{filteredAndSortedDishes.length}</span>
                {pagination?.totalDishes > dishes.length && (
                  <span className="text-gray-400"> of {pagination.totalDishes}</span>
                )}
                {" "}items available
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Freshly prepared</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:bg-white transition-all"
            >
              <Search className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">
                {showSearch ? "Hide Search" : "Search"}
              </span>
            </motion.button>

            <div className="relative group">
              <button className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm hover:bg-white transition-all">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">
                  {sortBy === "default" && "Sort by"}
                  {sortBy === "price_low" && "Price: Low to High"}
                  {sortBy === "price_high" && "Price: High to Low"}
                  {sortBy === "rating" && "Top Rated"}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {[
                  { val: "default", label: "Default" },
                  { val: "price_low", label: "Price: Low to High" },
                  { val: "price_high", label: "Price: High to Low" },
                  { val: "rating", label: "Top Rated" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setSortBy(val)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-gray-600">Trending now</span>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="relative max-w-2xl mx-auto">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#e84825] transition-colors" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by dish name, ingredients, or category..."
                    className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-100 focus:border-[#e84825] rounded-2xl text-sm focus:outline-none transition-all shadow-sm"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dishes Grid */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredAndSortedDishes.map((dish) => {
                  const cartQty = getCartQty(dish._id);
                  return (
                    <DishCard
                      key={dish._id}
                      dish={dish}
                      inCart={cartQty > 0}
                      cartQty={cartQty}
                      cartLoading={cartLoading}
                      onAddClick={handleAddClick}
                      searchTerm={searchTerm}
                    />
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* ── Show More / Show Less Buttons ── */}
            {!searchTerm && (hasMore || hasLoadedMore) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 mt-12"
              >
               

                <div className="flex items-center gap-3">
                  {/* Show More — only when more pages exist */}
                  {hasMore && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={handleShowMore}
                      disabled={loadingMore}
                      className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#e84825] text-[#e84825] rounded-full font-semibold text-sm hover:bg-[#e84825] hover:text-white transition-all duration-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>Show More</span>
                        </>
                      )}
                    </motion.button>
                  )}

                  {/* Show Less — only when user has loaded extra pages */}
                  {hasLoadedMore && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={handleShowLess}
                      disabled={loadingMore}
                      className="flex items-center gap-2 px-8 py-3 bg-gray-50 border-2 border-gray-200 text-gray-600 rounded-full font-semibold text-sm hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span>Show Less</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {/* All dishes loaded message */}
            {!hasMore && dishes.length > 0 && pagination?.totalPages > 1 && !searchTerm && !hasLoadedMore && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-400 mt-10"
              >
                ✓ All {pagination.totalDishes} dishes loaded
              </motion.p>
            )}
          </>
        )}

        {/* Empty States */}
        {!loading && dishes.length > 0 && filteredAndSortedDishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-2xl border border-gray-100"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching dishes found</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-6">
              We couldn't find any dishes matching "{searchTerm}". Try searching with different keywords.
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-2 bg-[#e84825] text-white rounded-full text-sm font-semibold hover:bg-[#c73d1e] transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {!loading && dishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-2xl border border-gray-100"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No dishes found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any dishes in this category. Try exploring other categories.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllDishes;