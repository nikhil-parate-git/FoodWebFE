import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Environment variable ka upyog karke base path set kiya
const API_URL = `${import.meta.env.VITE_API_URL}/address/create`;

export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      // Token nikalne ki koshish
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("userToken") ||
        (() => {
          try {
            return JSON.parse(localStorage.getItem("user"))?.token;
          } catch {
            return null;
          }
        })();

      if (!token) {
        toast.error("Please login to continue");
        return rejectWithValue("No token found");
      }

      const response = await axios.post(API_URL, addressData, {
        headers: {
          token: token,           // Agar backend custom header mangta hai
          Authorization: `Bearer ${token}`, // Standard Bearer token
        },
      });

      if (response.data.success) {
        toast.success("Address saved successfully!", { autoClose: 1000 });
        return response.data.address;
      } else {
        toast.error(response.data.message || "Something went wrong");
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Server Error";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressInfo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addressInfo = action.payload;
        state.error = null;
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;