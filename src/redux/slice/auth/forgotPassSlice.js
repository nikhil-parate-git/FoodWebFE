import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://foodwebbe.onrender.com/api/auth";

// Thunk for Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, {
        email,
      });

      // OTP Toast with 10 seconds duration
      if (response.data.otp) {
        toast.success(`OTP: ${response.data.otp}`, {
          autoClose: 10000, // 10 seconds
        });
      } else {
        toast.success(response.data.message || "OTP sent successfully!");
      }

      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);
// Thunk for Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/reset-password`, data);
      toast.success("Password reset successfully!");
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reset password";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

const authSlice = createSlice({
  name: "password",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = authSlice.actions;
export default authSlice.reducer;
