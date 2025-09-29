import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://bzbackend.online/api";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartData, { rejectWithValue }) => {
    try {
      if (!cartData.product_id || !cartData.selected_image) {
        return rejectWithValue("Product ID and selected image are required");
      }

      const payload = {
        product_id: cartData.product_id,
        selected_image: cartData.selected_image,
        guestId: cartData.guestId || null,
      };

      // Include selected_size only if provided
      if (cartData.selected_size) {
        payload.selected_size = cartData.selected_size;
      }

      console.log("cartSlice - addToCart payload:", payload);

      const response = await axios.post(`${API_URL}/products/cart`, payload);
      return response.data;
    } catch (error) {
      console.error("cartSlice - addToCart error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add to cart"
      );
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/products/cart?guestId=${guestId}`,
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
        `${API_URL}/products/cart/remove`,
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
        `${API_URL}/orders/create-order`,
        orderData,
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
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
    items: [], // Cart items
    loading: false, // General loading state for cart operations
    error: null, // General error state
    orderLoading: false, // Specific loading state for order creation
    orderError: null, // Specific error state for order creation
    orderSuccess: false, // Flag for successful order
    orderMessage: "", // Message for order creation status
    lastOrder: null, // Store last created order details
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
    resetOrderState: (state) => {
      state.orderLoading = false;
      state.orderError = null;
      state.orderSuccess = false;
      state.orderMessage = "";
      state.lastOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Always expect an array
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
        state.orderSuccess = false;
        state.orderMessage = "";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orderSuccess = true;
        state.orderMessage = "Order placed successfully!";
        state.lastOrder = action.payload; // Store order details
        state.items = []; // Clear cart after successful order
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload;
        state.orderMessage = action.payload;
      });
  },
});

export const { clearCart, resetOrderState } = cartSlice.actions;
export default cartSlice.reducer;