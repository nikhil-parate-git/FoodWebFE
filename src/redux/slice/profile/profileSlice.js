import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://foodwebbe.onrender.com/api/auth";

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/getprofile`, getHeaders());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "profile/logout",
  async (_, thunkAPI) => {
    try {
      await axios.post(`${API_URL}/userlogout`, {}, getHeaders());
      localStorage.removeItem("token");
      toast.success("Logout Successful",{ autoClose: 2000 });
      return null;
    } catch (error) {
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
  },
  reducers: {
    // 🔥 IMPORTANT: login ke baad ye call hoga
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { setToken } = profileSlice.actions;
export default profileSlice.reducer;