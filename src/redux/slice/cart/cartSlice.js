import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Environment variable ka use karte hue BASE_URL set kiya gaya hai
const BASE_URL = `${import.meta.env.VITE_API_URL}/cart`;

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const addToCartThunk = createAsyncThunk(
  "cart/add",
  async ({ dishId, quantity }, { rejectWithValue }) => {
    try {
      // ✅ Token check karo pehle
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warn("Please login first!", { autoClose: 1000 });
        return rejectWithValue({ message: "Not authenticated" });
      }

      const res = await axios.post(
        `${BASE_URL}/add`,
        { dishId, quantity },
        getHeaders(),
      );
      toast.success(res.data.message || "Item added to cart!", {
        autoClose: 2000,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const updateCartQty = createAsyncThunk(
  "cart/update",
  async ({ dishId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/update`,
        { dishId, quantity },
        getHeaders(),
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/getcart`, getHeaders());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/remove",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/remove/${itemId}`,
        getHeaders(),
      );
      toast.warn("Item removed from cart", { autoClose: 1000 });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const clearCartThunk = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/clear`, getHeaders());
      toast.info("Cart cleared", { autoClose: 2000 });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  },
);

const cartThunks = [
  addToCartThunk,
  updateCartQty,
  fetchCart,
  removeFromCartThunk,
  clearCartThunk,
];

const updateCartState = (state, action) => {
  state.loading = false;
  state.items = action.payload?.cart?.items || [];
  state.totalPrice = action.payload?.totalPrice || 0;
};

const cartSlice = createSlice({
  name: "pagecart",
  initialState: { items: [], totalPrice: 0, loading: false, error: null },
  reducers: {
    clearCartLocally: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    cartThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, updateCartState)
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { clearCartLocally } = cartSlice.actions;
export default cartSlice.reducer;