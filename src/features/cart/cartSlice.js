import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ prod_id, selected_image, guestId }, { rejectWithValue }) => {
    try {
      const payload = {
        product_id: prod_id,
        selected_image,
        guestId,
      };
      const response = await axios.post(
        "https://bzbackend.online/api/products/cart",
        payload,
        { timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.error("addToCart error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://bzbackend.online/api/products/cart?guestId=${guestId}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.error("fetchCart error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ prod_id, selected_image, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://bzbackend.online/api/products/cart/remove",
        { product_id: prod_id, selected_image, guestId },
        { timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.error("removeFromCart error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item from cart"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://bzbackend.online/api/orders/create-order",
        orderData,
        { timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.error("createOrder error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to create order"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, ( state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = []; // Clear cart after order is placed
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;