import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../../redux/slice/orders/orderSlice";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle2,
  MapPin,
  Loader2,
} from "lucide-react";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    orders: myOrders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "bg-[#EAF3DE] text-[#27500A]";
    if (s === "processing") return "bg-[#FAEEDA] text-[#633806]";
    return "bg-[#E6F1FB] text-[#0C447C]";
  };

  const totalSpent = myOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const lastOrder = myOrders[0]
    ? new Date(myOrders[0].createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-gray-50 font-[Outfit,sans-serif] py-8 px-4">
      <div className="w-full mx-auto">
        {/* Top Bar with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/menu")}
            className="w-10 cursor-pointer h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-[28px] font-serif font-normal text-gray-900 tracking-tight leading-tight">
              My Orders
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Track and manage your recent orders
            </p>
          </div>
        </div>

        {/* Stats Row
        {!loading && myOrders.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total orders", value: `${myOrders.length}`, sub: "placed" },
              { label: "Total spent", value: `₹${totalSpent}` },
              { label: "Last order", value: lastOrder, small: true },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">{s.label}</p>
                <p className={`font-semibold text-gray-900 ${s.small ? "text-[15px]" : "text-xl"}`}>
                  {s.value}{" "}
                  {s.sub && <span className="text-xs font-normal text-gray-400">{s.sub}</span>}
                </p>
              </div>
            ))}
          </div>
        )} */}

        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm">Loading your orders...</span>
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-24 text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && myOrders.length === 0 && (
          <div className="text-center py-24 text-gray-400 text-sm">
            No orders yet.
          </div>
        )}

        {/* Order Cards */}
        {!loading &&
          !error &&
          myOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5"
            >
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={17} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-gray-700 font-mono truncate max-w-[180px]">
                      {order.razorpayOrderId}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${getStatusStyle(order.status)}`}
                >
                  {order.status?.toLowerCase() === "delivered" ? (
                    <CheckCircle2 size={11} />
                  ) : (
                    <Clock size={11} />
                  )}
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="px-5">
                {(order.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-none"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{item.quantity * item.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              {order.address && (
                <div className="px-5 py-4 border-t border-gray-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
                      Delivered to
                    </p>
                    <p className="text-[13px] text-gray-500 leading-relaxed">
                      {order.address.firstName} {order.address.lastName} ·{" "}
                      {order.address.street}, {order.address.city},{" "}
                      {order.address.state} {order.address.zipCode}
                    </p>
                  </div>
                </div>
              )}

              {/* Bill Breakdown */}
              <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Delivery fee</span>
                    <span>₹{order.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Platform fee</span>
                    <span>₹{order.platformFee}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Packing charges</span>
                    <span>₹{order.packingCharge}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
                    <span className="text-[15px] font-semibold text-gray-900">
                      Total paid
                    </span>
                    <span className="text-[16px] font-semibold text-blue-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-[11px] text-gray-400 font-mono">
                      Paid via Razorpay · {order.razorpayPaymentId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Orders;
