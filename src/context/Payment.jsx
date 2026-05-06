import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Lock, ChevronLeft, ShoppingBag } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Payment = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.pagecart);

  const DELIVERY_FEE = totalPrice > 499 ? 0 : totalPrice > 0 ? 40 : 0;
  const PLATFORM_FEE = 10;
  const PACKING = 20;
  const TOTAL_AMOUNT = totalPrice + DELIVERY_FEE + PLATFORM_FEE + PACKING;

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    cardNumber: Yup.string()
      .matches(/^[0-9\s]{19}$/, "Invalid card number")
      .required("Required"),
    expiry: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Use MM/YY")
      .required("Required"),
    cvc: Yup.string()
      .matches(/^[0-9]{3}$/, "3 digits")
      .required("Required"),
    cardName: Yup.string().min(3, "Too short").required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      cardNumber: "",
      expiry: "",
      cvc: "",
      cardName: "",
    },
    validationSchema,
    onSubmit: () => {
      alert("Payment Successful! Redirecting...");
      navigate("/orders");
    },
  });

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 16);
    let sections = value.match(/.{1,4}/g);
    formik.setFieldValue("cardNumber", sections ? sections.join(" ") : value);
  };

  const inputStyle = (name) =>
    `w-full border ${
      formik.touched[name] && formik.errors[name]
        ? "border-red-400 bg-red-50"
        : "border-gray-200"
    } rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#e84825]/20 focus:border-[#e84825] outline-none transition-all`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className=" w-full bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100">
        {/* LEFT: Order Summary */}
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

          {/* Charges */}
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

        {/* RIGHT: Payment Form */}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-[#e84825]" />
            <h2 className="text-xl font-bold text-gray-900">Pay with card</h2>
          </div>

          {/* ✅ form onSubmit properly handle ho raha hai */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="email@example.com"
                className={inputStyle("email")}
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                Card Information
              </label>
              <div
                className={`border ${formik.touched.cardNumber && formik.errors.cardNumber ? "border-red-400" : "border-gray-200"} rounded-xl overflow-hidden focus-within:border-[#e84825] focus-within:ring-2 focus-within:ring-[#e84825]/10 transition-all`}
              >
                <input
                  name="cardNumber"
                  type="text"
                  placeholder="1234 5678 1234 5678"
                  className="w-full p-3 text-sm border-b border-gray-100 outline-none"
                  value={formik.values.cardNumber}
                  onChange={handleCardNumberChange}
                  onBlur={formik.handleBlur}
                />
                <div className="flex">
                  <input
                    name="expiry"
                    type="text"
                    placeholder="MM / YY"
                    className="w-1/2 p-3 text-sm border-r border-gray-100 outline-none"
                    {...formik.getFieldProps("expiry")}
                  />
                  <input
                    name="cvc"
                    type="text"
                    placeholder="CVC"
                    maxLength={3}
                    className="w-1/2 p-3 text-sm outline-none"
                    {...formik.getFieldProps("cvc")}
                  />
                </div>
              </div>
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.cardNumber}
                </p>
              )}
              {formik.touched.expiry && formik.errors.expiry && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.expiry}
                </p>
              )}
              {formik.touched.cvc && formik.errors.cvc && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.cvc}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                Cardholder Name
              </label>
              <input
                name="cardName"
                type="text"
                placeholder="Name on card"
                className={inputStyle("cardName")}
                {...formik.getFieldProps("cardName")}
              />
              {formik.touched.cardName && formik.errors.cardName && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.cardName}
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#e84825] to-[#ff6b4a] text-white py-3.5 rounded-xl font-bold mt-2 flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:shadow-xl transition-all"
            >
              <Lock className="w-4 h-4" />
              Pay ₹{TOTAL_AMOUNT.toFixed(2)}
            </motion.button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-2">
              <Lock className="w-3 h-3" />
              256-bit SSL encrypted & secure
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
