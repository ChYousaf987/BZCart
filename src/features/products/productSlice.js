import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://bzbackend.online/api";

// Utility function for retrying API calls
const retryRequest = async (requestFn, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      if (attempt === retries || err.code !== "ECONNABORTED") {
        throw err;
      }
      console.warn(
        `Retry attempt ${attempt} failed: ${err.message}. Retrying after ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await retryRequest(() =>
        axios.get(`${API_URL}/products/product/${id}`, { timeout: 10000 })      );
      return response.data;
    } catch (err) {
      console.error("fetchProductById error:", err.message, err.code);
      if (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
        return rejectWithValue(
          "Unable to connect to the server. Please check your internet connection or try again later."
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
      const response = await retryRequest(() =>
        axios.get(`${API_URL}/products/products`, { timeout: 10000 })
      );
      return response.data;
    } catch (err) {
      console.error("fetchProducts error:", err.message, err.code);
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
      const response = await retryRequest(() =>
        axios.get(`${API_URL}/products/category/${categoryId}`, {
          timeout: 10000,
        })
      );
      return response.data;
    } catch (err) {
      console.error("fetchProductsByCategory error:", err.message, err.code);
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
      const response = await retryRequest(() =>
        axios.get(`${API_URL}/products/reviews/${productId}`, {
          timeout: 10000,
        })
      );
      return response.data;
    } catch (err) {
      console.error("fetchReviews error:", err.message, err.code);
      if (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
        return rejectWithValue(
          "Unable to connect to the server. Please check your internet connection or try again later."
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
      if (!user?._id) {
        throw new Error("Please log in to submit a review");
      }
      const payload = {
        ...reviewData,
        user_id: user._id,
      };
      const response = await retryRequest(() =>
        axios.post(`${API_URL}/products/reviews/${productId}`, payload, {
          timeout: 10000,
        })
      );
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
    sortedProducts: [],
    product: null,
    relatedProducts: [],
    reviews: [],
    loading: false,
    relatedLoading: false,
    reviewsLoading: false,
    error: null,
    relatedError: null,
    reviewsError: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
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
        // Compute sortedProducts
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const newProducts = action.payload.filter((p) => {
          const createdAt = new Date(p.createdAt);
          return now - createdAt < oneDay;
        });
        const oldProducts = action.payload.filter((p) => {
          const createdAt = new Date(p.createdAt);
          return now - createdAt >= oneDay;
        });
        const sortedNew = [...newProducts].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const shuffledOld = [...oldProducts].sort(() => Math.random() - 0.5);
        state.sortedProducts = [...sortedNew, ...shuffledOld];
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

export const { setSearchTerm } = productSlice.actions;
export default productSlice.reducer;
