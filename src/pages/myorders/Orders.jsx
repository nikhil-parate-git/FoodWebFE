import React from "react";
import {
  Package,
  CheckCircle2,
  Clock,
} from "lucide-react";

const Orders = () => {
  // Dummy Data with Images
  const myOrders = [
    {
      id: "ORD-9921",
      date: "May 1, 2026",
      total: 380.0,
      status: "Processing",
      items: [
        {
          name: "Greek salad",
          qty: 2,
          price: 150,
          image:
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=100&q=80",
        },
        {
          name: "Peri Peri Rolls",
          qty: 1,
          price: 80,
          image:
            "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=100&q=80",
        },
      ],
    },
    {
      id: "ORD-9845",
      date: "April 28, 2026",
      total: 540.0,
      status: "Delivered",
      items: [
        {
          name: "Margherita Pizza",
          qty: 1,
          price: 540,
          image:
            "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=100&q=80",
        },
      ],
    },
  ];

  // Status Badge Logic
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600 border-green-200";
      case "Processing":
        return "bg-orange-100 text-orange-600 border-orange-200";
      default:
        return "bg-blue-100 text-blue-600 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen w-full font-['Nunito'] py-5 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-gray-500 mt-2">
              Check the status of your recent orders and manage returns.
            </p>
          </div>
        
        </div>

        <div className="space-y-8">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Order Header Info */}
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Order Placed
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {order.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Total Amount
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Order ID
                    </p>
                    <p className="text-sm font-medium text-gray-600">
                      #{order.id}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-tight flex items-center gap-1.5 ${getStatusStyle(order.status)}`}
                >
                  {order.status === "Delivered" ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                  {order.status}
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-6">
                <div className="divide-y divide-gray-50">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-50 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                            Quantity:{" "}
                            <span className="text-gray-600 font-semibold">
                              {item.qty}
                            </span>
                            <span className="text-gray-200">|</span>
                            Price:{" "}
                            <span className="text-gray-600 font-semibold">
                              ₹{item.price}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button className="text-[#e84825] text-xs font-bold hover:underline hidden sm:block">
                        View Product
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-12 p-8 bg-orange-50 rounded-3xl border border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Package className="text-[#e84825]" size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                Need help with an order?
              </h3>
              <p className="text-sm text-gray-500">
                Our 24/7 support team is here to assist you.
              </p>
            </div>
          </div>
          <button className="px-8 py-3 bg-[#e84825] text-white font-bold rounded-2xl text-sm shadow-xl shadow-orange-200 hover:bg-[#cf3d1e] transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
