import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Environment variable ka istemal karte hue BASE_URL set kiya gaya hai
const BASE_URL = `${import.meta.env.VITE_API_URL}/auth/verify-otp`;

// Async Thunk for OTP Verification
export const verifyOtpAction = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, { email, otp });

      if (response.data.success) {
        // Token localstorage mein save karna
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message || "Login Successful! 🍅", { autoClose: 2000 });
        return response.data;
      } else {
        toast.error(response.data.message || "Invalid OTP");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const logOtpSlice = createSlice({
  name: "logotp",
  initialState: {
    user: null,
    loading: false,
    error: null,
    token: localStorage.getItem("token") || null,
  },
  reducers: {
    // Basic logout function
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(verifyOtpAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuth } = logOtpSlice.actions;
export default logOtpSlice.reducer;