import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateCartQty,
  removeFromCartThunk,
  clearCartThunk,
  fetchCart,
} from "../redux/slice/cart/cartSlice";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Truck,
  Shield,
  Clock,
  ChevronLeft,
  CreditCard,
  Wallet,
  Gift,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice, loading } = useSelector((state) => state.pagecart);

  const [showDeleteModal, setShowDeleteModal] = useState(null);
  // ✅ Initial load track karne ke liye — blink fix
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    // ✅ Refresh pe cart fetch karo, phir initialLoading false karo
    dispatch(fetchCart()).finally(() => {
      setInitialLoading(false);
    });
  }, [dispatch]);

  const stats = useMemo(() => {
    const deliveryFee = totalPrice > 0 && totalPrice < 500 ? 40 : 0;
    const platformFee = 10;
    const packingCharge = 20;
    let discount = 0;
    const grandTotal =
      totalPrice + deliveryFee + platformFee + packingCharge - discount;
    const savings = deliveryFee === 0 && totalPrice > 0 ? 40 : 0;
    return {
      deliveryFee,
      grandTotal,
      savings,
      platformFee,
      packingCharge,
      discount,
    };
  }, [totalPrice]);

  const handleQtyChange = (dishId, newQty) => {
    if (newQty < 1) {
      setShowDeleteModal(dishId);
    } else {
      dispatch(updateCartQty({ dishId, quantity: newQty }));
    }
  };

  const confirmRemove = () => {
    if (showDeleteModal) {
      dispatch(removeFromCartThunk(showDeleteModal));
      setShowDeleteModal(null);
    }
  };

  // ✅ Jab tak cart fetch ho raha hai — full page loader dikhao (blink nahi hoga)
  if (initialLoading || loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-[#e84825]" />
        </motion.div>
        <p className="text-gray-400 font-medium text-sm">
          Loading your cart...
        </p>
      </div>
    );
  }

  // ✅ Sirf fetch complete hone ke baad empty check karo
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#e84825]/20 to-orange-500/20 rounded-full blur-3xl" />
          <div className="relative w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-8 max-w-sm">
          Looks like you haven't added anything yet. Let's find something
          delicious for you!
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-8 py-3.5 bg-gradient-to-r from-[#e84825] to-[#ff6b4a] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm uppercase tracking-wide"
        >
          Browse Menu
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-1 h-8 bg-gradient-to-b from-[#e84825] to-[#ff6b4a] rounded-full" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Your Cart
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-11">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch(clearCartThunk())}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold px-4 py-2 rounded-full border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">Clear Cart</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white rounded-xl border border-gray-100 text-base text-gray-500 font-semibold">
              <div className="col-span-5">Item Details</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.dish?._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="bg-white rounded-2xl border border-gray-100 hover:border-[#e84825]/20 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Item Info */}
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={item.dish?.image}
                            alt={item.dish?.name}
                            className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                          />
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
                            {item.dish?.name}
                          </h3>
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {item.dish?.description?.substring(0, 60)}
                          </p>
                          <div className="md:hidden mt-2">
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{item.dish?.price}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center hidden md:block">
                        <span className="text-sm font-semibold text-gray-700">
                          ₹{item.dish?.price}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-3 flex items-center justify-center">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQtyChange(item.dish?._id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#e84825] hover:bg-[#e84825] hover:text-white flex items-center justify-center text-gray-600 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </motion.button>
                          <span className="w-8 text-center font-bold text-gray-900 text-sm">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleQtyChange(item.dish?._id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:border-[#e84825] hover:bg-[#e84825] hover:text-white flex items-center justify-center text-gray-600 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 text-right">
                        <span className="font-extrabold text-gray-900 text-lg">
                          ₹{(item.dish?.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Mobile Remove */}
                    <div className="md:hidden mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>Fresh preparation</span>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(item.dish?._id)}
                        className="text-red-400 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg sticky top-24 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#e84825]" />
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-gray-900">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Delivery Fee
                    </span>
                    <span
                      className={`font-semibold ${stats.deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}
                    >
                      {stats.deliveryFee === 0
                        ? "FREE"
                        : `₹${stats.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      Platform Fee
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{stats.platformFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      Packing Charge
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{stats.packingCharge}
                    </span>
                  </div>

                  {stats.discount > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-xl">
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        🎉 Promo Discount (10%)
                      </span>
                      <span>-₹{stats.discount.toFixed(2)}</span>
                    </div>
                  )}

                  {stats.savings > 0 && (
                    <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-xl text-xs font-semibold">
                      <span className="flex items-center gap-1">
                        🎉 Delivery Savings
                      </span>
                      <span>+₹{stats.savings}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-900 text-lg">
                      Total Amount
                    </span>
                    <span className="font-extrabold text-2xl text-gray-900">
                      ₹{stats.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Inclusive of all taxes
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/addressform")}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#e84825] to-[#ff6b4a] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 text-base flex items-center justify-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  Proceed to Checkout
                </motion.button>

                <button
                  onClick={() => navigate("/")}
                  className="w-full mt-3 py-2.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors flex items-center justify-center gap-1"
                >
                  ← Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex justify-around text-center">
                  <div>
                    <Shield className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Secure Payment</p>
                  </div>
                  <div>
                    <Clock className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Fast Delivery</p>
                  </div>
                  <div>
                    <Gift className="w-4 h-4 text-green-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">
                      Quality Guarantee
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Remove Item</h3>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
