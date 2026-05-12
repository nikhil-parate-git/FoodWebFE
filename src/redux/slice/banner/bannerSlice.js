import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_URL}/banners/all`;


const BASE_IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
  "http://localhost:5000";

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
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((item) => ({
          id: item._id,
          // ── FIX 2: Agar image already full URL hai toh BASE_IMAGE_URL mat lagao ──
          image: item.image?.startsWith("http")
            ? item.image
            : `${BASE_IMAGE_URL}${item.image}`,
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