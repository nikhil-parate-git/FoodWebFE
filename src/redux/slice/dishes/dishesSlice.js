import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// 1. Fetch All Dishes
export const fetchDishes = createAsyncThunk(
  "dishes/fetch",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://foodwebbe.onrender.com/api/dishes/getall?page=${page}`);
      if (response.data.success) return response.data;
      return rejectWithValue(response.data.message);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch dishes";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// 2. Fetch Dishes by Category ID (Aapki nayi API)
export const fetchDishesByCategory = createAsyncThunk(
  "dishes/fetchByCategory",
  async ({ categoryId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://foodwebbe.onrender.com/api/dishes/category/${categoryId}?page=${page}`);
      if (response.data.success) return response.data;
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
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle All Dishes
      .addCase(fetchDishes.pending, (state) => { state.loading = true; })
      .addCase(fetchDishes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.dishes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Category Dishes
      .addCase(fetchDishesByCategory.pending, (state) => { state.loading = true; })
      .addCase(fetchDishesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.dishes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDishesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage } = dishSlice.actions;
export default dishSlice.reducer;