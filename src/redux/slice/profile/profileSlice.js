import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

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
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateprofile`,
        formData,
        getHeaders(),
      );
      toast.success("Profile updated successfully", { autoClose: 2000 });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed", {
        autoClose: 2000,
      });
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "profile/logout",
  async (_, thunkAPI) => {
    try {
      await axios.post(`${API_URL}/userlogout`, {}, getHeaders());
      localStorage.removeItem("token");
      toast.success("Logout Successful", { autoClose: 2000 });
      return null;
    } catch (error) {
      localStorage.removeItem("token");
      return thunkAPI.rejectWithValue("Logout failed");
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    updating: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
      })

      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.updating = false;
      })

      // logoutUser
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
