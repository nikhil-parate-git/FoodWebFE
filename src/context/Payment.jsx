import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Lock, ChevronLeft, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "react-toastify"; // ✅ FIXED: was missing
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  resetPayment,
} from "../redux/slice/payment/paymentSlice";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ FIX: Prevent double API call in React StrictMode (dev) or fast re-renders
  const isPayingRef = useRef(false);

  const { items, totalPrice } = useSelector((state) => state.pagecart);
  const { orderLoading, verifyLoading, paymentSuccess } = useSelector(
    (state) => state.payment,
  );

  const DELIVERY_FEE = totalPrice > 499 ? 0 : totalPrice > 0 ? 40 : 0;
  const PLATFORM_FEE = 10;
  const PACKING = 20;
  const TOTAL_AMOUNT = totalPrice + DELIVERY_FEE + PLATFORM_FEE + PACKING;

  // ── Redirect after successful payment ──────────────────────────────────────
  useEffect(() => {
    if (paymentSuccess) {
      dispatch(resetPayment());
      navigate("/orders");
    }
  }, [paymentSuccess, navigate, dispatch]);

  // ── Load Razorpay script dynamically if not already loaded ─────────────────
  useEffect(() => {
    if (window.Razorpay) return; // already loaded

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () =>
      toast.error("Failed to load Razorpay. Check your internet connection.");
    document.body.appendChild(script);

    return () => {
      // cleanup only if we added it
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // ── Open Razorpay Checkout ─────────────────────────────────────────────────
  const openRazorpay = (orderData) => {
    if (!window.Razorpay) {
      toast.error("Razorpay not loaded. Please refresh and try again.");
      isPayingRef.current = false;
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "FoodWeb",
      description: "Food Order Payment",
      order_id: orderData.orderId,
      prefill: {
        name: orderData.userInfo?.name || "",
        email: orderData.userInfo?.email || "",
        contact: orderData.userInfo?.phone || "",
      },
      theme: { color: "#e84825" },

      // ── Payment Success Handler ──────────────────────────────────────────
      handler: async (response) => {
        await dispatch(
          verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId: orderData.dbOrderId,
          }),
        );
        isPayingRef.current = false;
      },

      // ── Payment Dismiss Handler ──────────────────────────────────────────
      modal: {
        ondismiss: () => {
          toast.info("Payment cancelled");
          isPayingRef.current = false; // ✅ Reset guard on dismiss too
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", (response) => {
      toast.error(
        `Payment failed: ${response.error?.description || "Unknown error"}`,
      );
      isPayingRef.current = false; // ✅ Reset guard on failure too
    });

    rzp.open();
  };

  // ── Pay Button Click ───────────────────────────────────────────────────────
  const handlePay = async () => {
    // ✅ FIX: Prevent duplicate calls from double-click or StrictMode
    if (isPayingRef.current) return;
    isPayingRef.current = true;

    const resultAction = await dispatch(createRazorpayOrder());

    if (createRazorpayOrder.fulfilled.match(resultAction)) {
      openRazorpay(resultAction.payload);
    } else {
      // Reset guard if order creation itself failed
      isPayingRef.current = false;
    }
  };

  const isLoading = orderLoading || verifyLoading;

  // ── Guard: empty cart ──────────────────────────────────────────────────────
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            Cart is empty
          </h2>
          <p className="text-gray-400 mb-6">
            Add items to proceed with payment.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#e84825] text-white px-6 py-2 rounded-xl font-semibold"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100">
        {/* ── LEFT: Order Summary ────────────────────────────────────────── */}
        <div className="p-8 bg-gray-50 border-r border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 text-sm mb-8 hover:text-gray-800 transition-colors gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="mb-8">
            <span className="bg-orange-100 text-[#e84825] text-[10px] px-2 py-0.5 rounded font-bold">
              SECURE CHECKOUT
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mt-2">
              ₹{TOTAL_AMOUNT.toFixed(2)}
            </h1>
            <p className="text-gray-400 text-xs mt-1">Total payable amount</p>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-4 h-4 text-[#e84825]" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Order Items
              </span>
            </div>
            {items.map((item) => (
              <div
                key={item.dish?._id}
                className="flex justify-between items-center text-sm bg-white rounded-xl px-3 py-2.5 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.dish?.image}
                    alt={item.dish?.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-gray-700 font-medium line-clamp-1">
                    {item.dish?.name}
                    <span className="text-gray-400 font-normal">
                      {" "}
                      × {item.quantity}
                    </span>
                  </span>
                </div>
                <span className="font-semibold text-gray-800 shrink-0">
                  ₹{(item.dish?.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Charges Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Fee</span>
              <span
                className={
                  DELIVERY_FEE === 0 ? "text-green-600 font-medium" : ""
                }
              >
                {DELIVERY_FEE === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Platform Fee</span>
              <span>₹{PLATFORM_FEE}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Packing Charge</span>
              <span>₹{PACKING}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 text-base">
              <span>Total</span>
              <span>₹{TOTAL_AMOUNT.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Pay via Razorpay ────────────────────────────────────── */}
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-[#e84825]" />
            <h2 className="text-xl font-bold text-gray-900">
              Complete Payment
            </h2>
          </div>

          {/* Razorpay Info Card */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8">
            <p className="text-sm text-gray-600 leading-relaxed">
              Click the button below to open the{" "}
              <span className="font-bold text-[#e84825]">Razorpay</span> secure
              checkout. You can pay using UPI, Cards, Net Banking, or Wallets.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["UPI", "Cards", "Net Banking", "Wallets", "EMI"].map(
                (method) => (
                  <span
                    key={method}
                    className="text-[10px] font-bold bg-white border border-orange-200 text-[#e84825] px-2.5 py-1 rounded-full"
                  >
                    {method}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">
              Amount to Pay
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ₹{TOTAL_AMOUNT.toFixed(2)}
            </span>
          </div>

          {/* Pay Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: isLoading ? 1 : 1.01 }}
            type="button"
            onClick={handlePay}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#e84825] to-[#ff6b4a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {orderLoading ? "Creating Order..." : "Verifying Payment..."}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay ₹{TOTAL_AMOUNT.toFixed(2)} via Razorpay
              </>
            )}
          </motion.button>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-4">
            <Lock className="w-3 h-3" />
            256-bit SSL encrypted & secure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
