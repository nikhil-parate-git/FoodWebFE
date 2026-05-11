import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Environment variables ka use karke URLs set kiye
const API_URL = `${import.meta.env.VITE_API_URL}/banners/all`;
const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.banners;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch banners";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        // Mapping API data to match your UI structure
        state.items = action.payload.map((item) => ({
          id: item._id,
          image: `${BASE_IMAGE_URL}${item.image}`, // Dynamic image URL
          tag: item.bannerTag,
          title: item.bannerTitle,
          desc: item.description,
          btn: "Order Now",
        }));
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
