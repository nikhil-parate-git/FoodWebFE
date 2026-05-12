import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = `${import.meta.env.VITE_API_URL}/dishes`;

// 1. Fetch All Dishes
export const fetchDishes = createAsyncThunk(
  "dishes/fetch",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getall?page=${page}`);
      if (response.data.success) return { ...response.data, page };
      return rejectWithValue(response.data.message);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch dishes";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// 2. Fetch Dishes by Category ID
export const fetchDishesByCategory = createAsyncThunk(
  "dishes/fetchByCategory",
  async ({ categoryId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/category/${categoryId}?page=${page}`);
      if (response.data.success) return { ...response.data, page };
      return rejectWithValue(response.data.message);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch category dishes";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const dishSlice = createSlice({
  name: "dishes",
  initialState: {
    items: [],
    pagination: { currentPage: 1, totalPages: 1, totalDishes: 0 },
    loading: false,
    loadingMore: false,   // "Show More" ke liye alag loading state
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchDishes ────────────────────────────────────────────────────────
      .addCase(fetchDishes.pending, (state, action) => {
        const page = action.meta.arg || 1;
        if (page === 1) state.loading = true;
        else state.loadingMore = true;
      })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        // Page 1 → fresh list; page > 1 → append
        if (action.payload.page === 1) {
          state.items = action.payload.dishes;
        } else {
          state.items = [...state.items, ...action.payload.dishes];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      })

      // ── fetchDishesByCategory ──────────────────────────────────────────────
      .addCase(fetchDishesByCategory.pending, (state, action) => {
        const page = action.meta.arg?.page || 1;
        if (page === 1) state.loading = true;
        else state.loadingMore = true;
      })
      .addCase(fetchDishesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        if (action.payload.page === 1) {
          state.items = action.payload.dishes;
        } else {
          state.items = [...state.items, ...action.payload.dishes];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDishesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage } = dishSlice.actions;
export default dishSlice.reducer;