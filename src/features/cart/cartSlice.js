import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartItem, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("myUser"));
      console.log("addToCart - User from localStorage:", user);
      if (!user?._id) {
        throw new Error("Please log in to add items to cart");
      }
      const { prod_id, selected_image, nicotine_strength, flavor } = cartItem;
      if (!prod_id || !selected_image || !flavor) {
        console.log("addToCart - Invalid fields:", {
          prod_id,
          selected_image,
          nicotine_strength,
          flavor,
        });
        throw new Error(
          "Product ID, selected image, and flavor must be provided"
        );
      }
      if (isNaN(Number(nicotine_strength))) {
        console.log(
          "addToCart - Invalid nicotine_strength:",
          nicotine_strength
        );
        throw new Error("Nicotine strength must be a valid number");
      }
      const payload = {
        product_id: prod_id,
        selected_image,
        nicotine_strength: Number(nicotine_strength),
        flavor: flavor.trim(),
        user_id: user._id,
      };
      console.log("addToCart - Sending request with body:", payload);
      const response = await axios.post(
        "https://api.cloudandroots.com/api/products/cart",
        payload,
        { timeout: 5000 }
      );
      console.log("addToCart - Response:", response.data);
      return response.data;
    } catch (err) {
      console.error("addToCart error:", err.response?.data || err.message);
      if (err.response?.status === 500) {
        return rejectWithValue(
          "Server error occurred while adding to cart. Please try again later."
        );
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("myUser"));
      console.log("fetchCart - User from localStorage:", user);
      if (!user?.token) {
        throw new Error("Please log in to view your cart");
      }
      const response = await axios.get(
        "https://api.cloudandroots.com/api/products/cart",
        {
          headers: { Authorization: `Bearer ${user.token}` },
          timeout: 5000,
        }
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
  async (
    { prod_id, selected_image, nicotine_strength, flavor },
    { rejectWithValue }
  ) => {
    try {
      const user = JSON.parse(localStorage.getItem("myUser"));
      console.log("removeFromCart - User from localStorage:", user);
      if (!user?.token) {
        throw new Error("Please log in to remove items from cart");
      }
      if (!prod_id || !selected_image || !flavor) {
        console.log("removeFromCart - Invalid fields:", {
          prod_id,
          selected_image,
          nicotine_strength,
          flavor,
        });
        throw new Error(
          "Product ID, selected image, and flavor must be provided"
        );
      }
      if (isNaN(Number(nicotine_strength))) {
        console.log(
          "removeFromCart - Invalid nicotine_strength:",
          nicotine_strength
        );
        throw new Error("Nicotine strength must be a valid number");
      }
      const response = await axios.post(
        "https://api.cloudandroots.com/api/products/cart/remove",
        {
          product_id: prod_id,
          selected_image,
          nicotine_strength: Number(nicotine_strength),
          flavor,
        },
        { headers: { Authorization: `Bearer ${user.token}` }, timeout: 5000 }
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

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("myUser"));
      console.log("clearCart - User from localStorage:", user);
      if (!user?.token) {
        throw new Error("Please log in to clear cart");
      }
      const response = await axios.delete(
        "https://api.cloudandroots.com/api/products/cart/clear",
        {
          headers: { Authorization: `Bearer ${user.token}` },
          timeout: 5000,
        }
      );
      return response.data;
    } catch (err) {
      console.error("clearCart error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear cart"
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
      .addCase(fetchCart.rejected, (state, action) => {
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
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
