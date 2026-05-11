// bannerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://foodwebbe.onrender.com/api/banners/all";
const BASE_IMAGE_URL = "https://foodwebbe.onrender.com"; // Assuming images are hosted on the same domain

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);

      return response.data.banners;
    } catch (error) {
      toast.error(error.message || "Failed to fetch banners");
      return rejectWithValue(error.message);
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
          image: `${BASE_IMAGE_URL}${item.image}`,
          tag: item.bannerTag,
          title: item.bannerTitle,
          desc: item.description,
          btn: "Order Now", // Default button text
        }));
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bannerSlice.reducer;
