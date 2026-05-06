// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { toast } from "react-toastify";

// const BASE_URL = "https://foodwebbe.onrender.com/api/payment";

// // ── Token Helper ─────────────────────────────────────────────────────────────
// const getToken = () => {
//   try {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("authToken") ||
//       localStorage.getItem("userToken") ||
//       JSON.parse(localStorage.getItem("user"))?.token ||
//       null
//     );
//   } catch {
//     return null;
//   }
// };

// // ── Axios Instance ────────────────────────────────────────────────────────────
// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
// });

// // ── Thunk 1: Create Razorpay Order ───────────────────────────────────────────
// export const createRazorpayOrder = createAsyncThunk(
//   "payment/createOrder",
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = getToken();

//       if (!token) {
//         toast.error("Please login to continue");
//         return rejectWithValue("No auth token found");
//       }

//       const { data } = await api.post(
//         "/create-order",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,

//             token: token,
//           },
//         },
//       );

//       if (data.success) return data;

//       toast.error(data.message || "Order creation failed");
//       return rejectWithValue(data.message);
//     } catch (err) {
//       if (axios.isCancel(err)) return rejectWithValue("Request cancelled");

//       const status = err.response?.status;
//       const msg = err.response?.data?.message;

//       if (!err.response) {
//         // Network / CORS / server not running
//         toast.error(
//           "Cannot connect to server. Make sure backend is running on port 8000.",
//         );
//         return rejectWithValue("Network error — server unreachable");
//       }

//       if (status === 401) {
//         toast.error("Session expired. Please login again.");
//         return rejectWithValue("Unauthorized");
//       }

//       toast.error(msg || `Server error (${status})`);
//       return rejectWithValue(msg || "Order creation failed");
//     }
//   },
// );

// // ── Thunk 2: Verify Payment ───────────────────────────────────────────────────
// export const verifyRazorpayPayment = createAsyncThunk(
//   "payment/verifyPayment",
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       const token = getToken();

//       const { data } = await api.post("/verify-payment", paymentData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           token: token,
//         },
//       });

//       if (data.success) {
//         toast.success("Payment successful! 🎉", { autoClose: 1000 });
//         return data;
//       }

//       toast.error(data.message || "Payment verification failed");
//       return rejectWithValue(data.message);
//     } catch (err) {
//       if (!err.response) {
//         toast.error(
//           "Network error during verification. Please contact support.",
//         );
//         return rejectWithValue("Network error");
//       }

//       const msg = err.response?.data?.message || "Verification error";
//       toast.error(msg);
//       return rejectWithValue(msg);
//     }
//   },
// );

// // ── Slice ─────────────────────────────────────────────────────────────────────
// const paymentSlice = createSlice({
//   name: "payment",
//   initialState: {
//     orderLoading: false,
//     verifyLoading: false,
//     orderData: null,
//     paymentSuccess: false,
//     error: null,
//   },
//   reducers: {
//     resetPayment: (state) => {
//       state.orderData = null;
//       state.paymentSuccess = false;
//       state.error = null;
//       state.orderLoading = false;
//       state.verifyLoading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ── Create Order ──────────────────────────────────────────────────────
//       .addCase(createRazorpayOrder.pending, (state) => {
//         state.orderLoading = true;
//         state.error = null;
//       })
//       .addCase(createRazorpayOrder.fulfilled, (state, action) => {
//         state.orderLoading = false;
//         state.orderData = action.payload;
//       })
//       .addCase(createRazorpayOrder.rejected, (state, action) => {
//         state.orderLoading = false;
//         state.error = action.payload;
//       })
//       // ── Verify Payment ────────────────────────────────────────────────────
//       .addCase(verifyRazorpayPayment.pending, (state) => {
//         state.verifyLoading = true;
//         state.error = null;
//       })
//       .addCase(verifyRazorpayPayment.fulfilled, (state) => {
//         state.verifyLoading = false;
//         state.paymentSuccess = true;
//       })
//       .addCase(verifyRazorpayPayment.rejected, (state, action) => {
//         state.verifyLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetPayment } = paymentSlice.actions;
// export default paymentSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://foodwebbe.onrender.com/api/payment";

// ── Token Helper ─────────────────────────────────────────────────────────────
const getToken = () => {
  try {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken") ||
      JSON.parse(localStorage.getItem("user"))?.token ||
      null
    );
  } catch {
    return null;
  }
};

// ── Headers Helper ────────────────────────────────────────────────────────────
const getHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      token: token,
    },
  };
};

// ── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// ── Thunk 1: Create Razorpay Order ───────────────────────────────────────────
export const createRazorpayOrder = createAsyncThunk(
  "payment/createOrder",
  async ({ amount }, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login to continue");
        return rejectWithValue("No auth token found");
      }

      const { data } = await api.post(
        "/create-order",
        { amount: amount * 100  }, // ✅ grandTotal backend ko bhejo
        getHeaders(),
      );

      if (data.success) return data;

      toast.error(data.message || "Order creation failed");
      return rejectWithValue(data.message);
    } catch (err) {
      if (axios.isCancel(err)) return rejectWithValue("Request cancelled");

      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (!err.response) {
        toast.error(
          "Cannot connect to server. Make sure backend is running on port 8000.",
        );
        return rejectWithValue("Network error — server unreachable");
      }

      if (status === 401) {
        toast.error("Session expired. Please login again.");
        return rejectWithValue("Unauthorized");
      }

      toast.error(msg || `Server error (${status})`);
      return rejectWithValue(msg || "Order creation failed");
    }
  },
);

// ── Thunk 2: Verify Payment ───────────────────────────────────────────────────
export const verifyRazorpayPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        toast.error("Please login to continue");
        return rejectWithValue("No auth token found");
      }

      const { data } = await api.post(
        "/verify-payment",
        paymentData,
        getHeaders(),
      );

      if (data.success) {
        toast.success("Payment successful! 🎉", { autoClose: 1000 });
        return data;
      }

      toast.error(data.message || "Payment verification failed");
      return rejectWithValue(data.message);
    } catch (err) {
      if (!err.response) {
        toast.error(
          "Network error during verification. Please contact support.",
        );
        return rejectWithValue("Network error");
      }

      const msg = err.response?.data?.message || "Verification error";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    orderLoading: false,
    verifyLoading: false,
    orderData: null,
    paymentSuccess: false,
    error: null,
  },
  reducers: {
    resetPayment: (state) => {
      state.orderData = null;
      state.paymentSuccess = false;
      state.error = null;
      state.orderLoading = false;
      state.verifyLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Create Order ────────────────────────────────────────────────────
      .addCase(createRazorpayOrder.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderData = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload;
      })
      // ── Verify Payment ──────────────────────────────────────────────────
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.verifyLoading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state) => {
        state.verifyLoading = false;
        state.paymentSuccess = true;
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.verifyLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;