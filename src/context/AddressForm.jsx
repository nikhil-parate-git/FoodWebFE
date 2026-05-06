import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MapPin, Building2 } from "lucide-react";

const AddressForm = () => {
  const navigate = useNavigate();
  const { totalPrice } = useSelector((state) => state.pagecart);

  const DELIVERY_FEE = totalPrice > 499 ? 0 : totalPrice > 0 ? 40 : 0;
  const PLATFORM_FEE = 10;
  const PACKING = 20;
  const GRAND_TOTAL = totalPrice + DELIVERY_FEE + PLATFORM_FEE + PACKING;

  const inputStyle =
    "w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-[#e84825] focus:ring-2 focus:ring-[#e84825]/10 transition-all placeholder:text-gray-300 autofill-custom";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <style>{`
        input.autofill-custom:-webkit-autofill,
        input.autofill-custom:-webkit-autofill:hover,
        input.autofill-custom:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px white inset !important;
          -webkit-text-fill-color: #333 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-8 bg-gradient-to-b from-[#e84825] to-[#ff6b4a] rounded-full" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Delivery Information
          </h1>
        </div>

        {/* ✅ form → div */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Left: Address Inputs */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-[#e84825]" />
              <h2 className="text-lg font-bold text-gray-800">Shipping Address</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <input type="text" placeholder="First name" className={inputStyle} />
                <input type="text" placeholder="Last name" className={inputStyle} />
              </div>
              <input type="email" placeholder="Email address" className={inputStyle} />
              <input type="text" placeholder="Street address" className={inputStyle} />
              <div className="flex gap-4">
                <input type="text" placeholder="City" className={inputStyle} />
                <input type="text" placeholder="State" className={inputStyle} />
              </div>
              <div className="flex gap-4">
                <input type="text" placeholder="Zip code" className={inputStyle} />
                <input type="text" placeholder="Country" className={inputStyle} />
              </div>
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                className={inputStyle}
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                }}
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#e84825]" />
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Delivery Fee</span>
                    <span className={`font-semibold ${DELIVERY_FEE === 0 ? "text-green-600" : "text-gray-900"}`}>
                      {DELIVERY_FEE === 0 ? "FREE" : `₹${DELIVERY_FEE}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Platform Fee</span>
                    <span className="font-semibold text-gray-900">₹{PLATFORM_FEE}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b border-gray-50 pb-3">
                    <span>Packing Charge</span>
                    <span className="font-semibold text-gray-900">₹{PACKING}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                    <span>Total</span>
                    <span className="text-xl">₹{GRAND_TOTAL.toFixed(2)}</span>
                  </div>
                </div>

                {/* ✅ type="button" + navigate */}
                <button
                  type="button"
                  onClick={() => navigate("/payment")}
                  className="w-full mt-6 bg-gradient-to-r from-[#e84825] to-[#ff6b4a] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Proceed To Payment →
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="w-full mt-3 py-2.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                >
                  ← Back to Cart
                </button>
              </div>

              {totalPrice < 500 && totalPrice > 0 && (
                <div className="border-t border-gray-100 p-4 bg-orange-50">
                  <p className="text-xs text-[#e84825] font-medium text-center">
                    Add ₹{(500 - totalPrice).toFixed(0)} more for FREE delivery!
                  </p>
                  <div className="h-1.5 bg-orange-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#e84825] rounded-full transition-all"
                      style={{ width: `${Math.min((totalPrice / 500) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div> {/* ✅ div close */}
      </div>
    </div>
  );
};

export default AddressForm;