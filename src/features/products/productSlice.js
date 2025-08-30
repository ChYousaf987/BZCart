import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://72.60.104.192:3003/api/products/product/${id}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.error("fetchProductById error:", err.message, err.code);
      if (err.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Unable to connect to the server. Please check if the server is running or try again later."
        );
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://72.60.104.192:3003/api/products/products");
      return response.data;
    } catch (err) {
      console.error("fetchProducts error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://72.60.104.192:3003/api/products/category/${categoryId}`
      );
      return response.data;
    } catch (err) {
      console.error("fetchProductsByCategory error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products by category"
      );
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "products/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://72.60.104.192:3003/api/products/reviews/${productId}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (err) {
      console.error("fetchReviews error:", err.message, err.code);
      if (err.code === "ERR_NETWORK") {
        return rejectWithValue(
          "Unable to connect to the server. Please check if the server is running or try again later."
        );
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

export const submitReview = createAsyncThunk(
  "products/submitReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem("myUser"));
      console.log("submitReview - User from localStorage:", user);
      if (!user?._id) {
        throw new Error("Please log in to submit a review");
      }
      const payload = {
        ...reviewData,
        user_id: user._id,
      };
      console.log("submitReview - Sending request with body:", payload);
      const response = await axios.post(
        `http://72.60.104.192:3003/api/products/reviews/${productId}`,
        payload,
        { timeout: 5000 }
      );
      console.log("submitReview - Response:", response.data);
      return response.data;
    } catch (err) {
      console.error("submitReview error:", err.response?.data || err.message);
      if (err.response?.status === 500) {
        return rejectWithValue(
          "Server error occurred while submitting review. Please try again later."
        );
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    relatedProducts: [],
    reviews: [],
    loading: false,
    relatedLoading: false,
    reviewsLoading: false,
    error: null,
    relatedError: null,
    reviewsError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.relatedLoading = true;
        state.relatedError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.relatedLoading = false;
        state.relatedError = action.payload;
      })
      .addCase(fetchReviews.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.payload;
      })
      .addCase(submitReview.pending, (state) => {
        state.reviewsLoading = true;
        state.reviewsError = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.reviewsLoading = false;
        state.reviews = [...state.reviews, action.payload];
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.reviewsLoading = false;
        state.reviewsError = action.payload;
      });
  },
});

export default productSlice.reducer;