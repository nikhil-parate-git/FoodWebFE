import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Environment variable ka use karte hue API URL set kiya gaya hai
const API_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

// Async Thunk for Login API
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, credentials);

      const { success, otp, developmentMode } = response.data;

      if (success) {
        if (developmentMode && otp) {
          toast.success(`Your OTP is: ${otp}`, {
            position: "top-right",
            autoClose: 10000, // 10 seconds
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        return response.data;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    userData: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetLoginState: (state) => {
      state.userData = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetLoginState } = loginSlice.actions;
export default loginSlice.reducer;