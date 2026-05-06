import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://foodwebbe.onrender.com/api/address/create";

// Async Thunk for creating address
export const createAddress = createAsyncThunk(
  "address/createAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Local storage se token
      const response = await axios.post(API_URL, addressData, {
        headers: {
          token: token, // Headers me token pass kiya
        },
      });

      if (response.data.success) {
        toast.success("Address saved successfully!",{autoClose:1000});
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