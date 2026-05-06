import React, { useEffect, useState, useMemo } from "react";
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
  Heart,
  Search,
  X,
  Filter,
} from "lucide-react";

const AllDishes = ({ activeCategory }) => {
  const dispatch = useDispatch();
  const [hoveredDish, setHoveredDish] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const { items: dishes, loading } = useSelector((state) => state.dishes);
  const { items: cartItems, loading: cartLoading } = useSelector(
    (state) => state.pagecart,
  );

  useEffect(() => {
    const catId = activeCategory?.id || activeCategory?._id || null;
    if (catId) {
      dispatch(fetchDishesByCategory({ categoryId: catId }));
    } else {
      dispatch(fetchDishes());
    }
    // Reset search when category changes

    setSortBy("default");
  }, [dispatch, activeCategory]);

  const getCartQty = (dishId) => {
    const found = cartItems?.find((i) => i.dish?._id === dishId);
    return found?.quantity || 0;
  };

  const handleAddClick = (dishId) => {
    if (!cartLoading) {
      dispatch(addToCartThunk({ dishId, quantity: 1 }));
    }
  };

  const toggleWishlist = (dishId) => {
    setWishlist((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId],
    );
  };

  // Filter and search dishes (case-insensitive)
  const filteredAndSortedDishes = useMemo(() => {
    let filtered = dishes;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = dishes.filter((dish) => {
        return (
          dish.name?.toLowerCase().includes(searchLower) ||
          dish.description?.toLowerCase().includes(searchLower) ||
          // ✅ category string ya object dono handle karo
          (typeof dish.category === "string" &&
            dish.category.toLowerCase().includes(searchLower)) ||
          (typeof dish.category?.name === "string" &&
            dish.category.name.toLowerCase().includes(searchLower))
        );
      });
    }

    if (sortBy === "price_low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0),
      );
    }

    return filtered;
  }, [dishes, searchTerm, sortBy]);

  const clearSearch = () => {
    setSearchTerm("");
    setShowSearch(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Skeleton Loader
  const SkeletonLoader = () => (
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
  );

  return (
    <div className=" to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Premium Section Header */}
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
                <span className="font-semibold text-[#e84825]">
                  {filteredAndSortedDishes.length}
                </span>{" "}
                items available
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Freshly prepared</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Toggle Button */}
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

            {/* Sort Dropdown */}
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
                <button
                  onClick={() => setSortBy("default")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl"
                >
                  Default
                </button>
                <button
                  onClick={() => setSortBy("price_low")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => setSortBy("price_high")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => setSortBy("rating")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-xl"
                >
                  Top Rated
                </button>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-gray-600">
                Trending now
              </span>
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedDishes.map((dish) => {
                const inCart = getCartQty(dish._id) > 0;
                const isWishlisted = wishlist.includes(dish._id);
                const isHovered = hoveredDish === dish._id;

                return (
                  <motion.div
                    key={dish._id}
                    variants={itemVariants}
                    layout
                    onHoverStart={() => setHoveredDish(dish._id)}
                    onHoverEnd={() => setHoveredDish(null)}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#e84825]/0 to-[#e84825]/0 rounded-2xl transition-all duration-300 group-hover:shadow-2xl" />

                    <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                      {/* Image Section */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />

                        {/* Premium Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => toggleWishlist(dish._id)}
                            className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isWishlisted
                                  ? "fill-red-500 text-red-500"
                                  : "text-gray-600 hover:text-red-500"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddClick(dish._id)}
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
                              <span className="text-xl font-bold leading-none group-hover/btn:hidden">
                                +
                              </span>
                              <span className="hidden group-hover/btn:inline text-xs font-semibold whitespace-nowrap">
                                Add to Cart
                              </span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 space-y-3">
                        {/* Title & Rating */}
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

                        {/* Description */}
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 min-h-[2.5rem]">
                          {dish.description ||
                            "Delicious dish prepared with fresh ingredients and authentic spices."}
                        </p>

                        {/* Highlight search term in description (optional) */}
                        {searchTerm &&
                          dish.description
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()) && (
                            <div className="bg-yellow-50 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full inline-block">
                              🔍 Matches your search
                            </div>
                          )}

                        {/* Price & Delivery */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                          <div className="space-y-0.5">
                            <span className="text-xl font-extrabold text-gray-900">
                              ₹{dish.price}
                            </span>
                            {dish.originalPrice && (
                              <span className="text-xs text-gray-400 line-through ml-2">
                                ₹{dish.originalPrice}
                              </span>
                            )}
                          </div>

                          {inCart && (
                            <div className="bg-green-50 px-2 py-1 rounded-lg">
                              <span className="text-green-700 text-xs font-semibold">
                                {getCartQty(dish._id)} in cart
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State - No results found */}
        {!loading &&
          dishes.length > 0 &&
          filteredAndSortedDishes.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white rounded-2xl border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No matching dishes found
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                We couldn't find any dishes matching "{searchTerm}". Try
                searching with different keywords.
              </p>
              <button
                onClick={clearSearch}
                className="px-6 py-2 bg-[#e84825] text-white rounded-full text-sm font-semibold hover:bg-[#c73d1e] transition-colors"
              >
                Clear Search
              </button>
            </motion.div>
          )}

        {/* Empty State - No dishes at all */}
        {!loading && dishes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-2xl border border-gray-100"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No dishes found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any dishes in this category. Try exploring other
              categories.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllDishes;
