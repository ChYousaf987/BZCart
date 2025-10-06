import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://bzbackend.online/api";

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async ({ guestId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const userId = auth.user?._id;
      const query = userId ? `userId=${userId}` : `guestId=${guestId}`;
      console.log("fetchMyOrders - Querying with:", { query, guestId, userId });
      const response = await axios.get(`${API_URL}/orders/my-orders?${query}`);
      console.log("fetchMyOrders - Response data:", response.data);
      return response.data;
    } catch (err) {
      console.error("fetchMyOrders error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;