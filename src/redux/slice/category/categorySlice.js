import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// API fetch thunk
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://foodwebbe.onrender.com/api/categories/getall');
      if (response.data.success) {
        // toast.success(response.data.message); // Optional: silent fetch ke liye comment kar sakte hain
        return response.data.categories;
      }
      return rejectWithValue(response.data.message);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch categories";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;