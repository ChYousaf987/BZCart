import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import {
  fetchProductById,
  fetchProductsByCategory,
  submitReview,
  fetchReviews,
} from "../features/products/productSlice";
import { addToCart, fetchCart } from "../features/cart/cartSlice";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    product,
    relatedProducts,
    reviews,
    loading,
    relatedLoading,
    reviewsLoading,
    error,
    relatedError,
    reviewsError,
  } = useSelector((state) => state.products);
  const [mainImage, setMainImage] = useState(null);
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [nicotineStrength, setNicotineStrength] = useState("");
  const [flavor, setFlavor] = useState("");

  const user = JSON.parse(localStorage.getItem("myUser"));

  useEffect(() => {
    dispatch(fetchProductById(id))
      .unwrap()
      .catch((err) => {
        toast.error(err || "Failed to fetch product");
      });
    dispatch(fetchReviews(id))
      .unwrap()
      .catch((err) => {
        toast.error(err || "Failed to fetch reviews");
      });
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.category?._id) {
      dispatch(fetchProductsByCategory(product.category._id))
        .unwrap()
        .catch((err) => {
          toast.error(err || "Failed to fetch related products");
        });
    }
    if (product?.product_images?.length > 0) {
      setMainImage(product.product_images[0]);
    }
  }, [product, dispatch]);

  const handleAddToCart = (item) => {
    if (!user) {
      toast.warn("Please log in to add items to cart");
      navigate("/login");
      return;
    }
    if (!nicotineStrength && item.nicotine_strengths?.length > 0) {
      toast.error("Please select a nicotine strength");
      return;
    }
    if (!flavor && item.flavors?.length > 0) {
      toast.error("Please select a flavor");
      return;
    }
    if (!mainImage) {
      toast.error("Please select a product image");
      return;
    }
    setLoadingAddToCart(true);
    const cartItem = {
      prod_id: item._id,
      selected_image: mainImage,
      nicotine_strength: Number(nicotineStrength) || 0,
      flavor: flavor || item.flavors[0],
    };
    console.log("handleAddToCart - Sending cart item:", cartItem);
    dispatch(addToCart(cartItem))
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
        dispatch(fetchCart());
      })
      .catch((err) => toast.error(err || "Failed to add to cart"))
      .finally(() => setLoadingAddToCart(false));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn("Please log in to submit a review");
      navigate("/login");
      return;
    }
    if (!reviewText || reviewRating < 1 || reviewRating > 5) {
      toast.error("Please provide a valid review and rating (1–5)");
      return;
    }
    dispatch(
      submitReview({
        productId: id,
        reviewData: { rating: reviewRating, review_text: reviewText },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Review submitted successfully!");
        setReviewText("");
        setReviewRating(0);
        dispatch(fetchProductById(id));
        dispatch(fetchReviews(id));
      })
      .catch((err) => toast.error(err || "Failed to submit review"));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <PulseLoader color="#4f46e5" size={15} />
      </div>
    );

  if (error || !product)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl bg-gradient-to-br from-gray-50 to-gray-100">
        {error || "Product Not Found"}
      </div>
    );

  const stockBadge =
    product.product_stock > 0 ? (
      <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
        IN STOCK
      </span>
    ) : (
      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
        OUT OF STOCK
      </span>
    );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar />
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-8">
            {/* Product Images */}
            <div className="space-y-4 sm:space-y-6">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl overflow-hidden aspect-square flex items-center justify-center p-2 sm:p-4">
                {stockBadge}
                <img
                  src={mainImage || "https://via.placeholder.com/150"}
                  alt={product.product_name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.product_images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-200 flex items-center justify-center bg-gray-50 p-1 sm:p-2 ${
                      mainImage === img
                        ? "border-indigo-500 ring-2 ring-indigo-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      className="w-full h-full object-contain"
                      alt={`variant-${idx}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
                      {product.product_name}
                    </h1>
                    <div className="flex flex-wrap items-center mt-1 sm:mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => {
                          const rating = product.rating || 4;
                          return (
                            <svg
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                i < Math.floor(rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                            </svg>
                          );
                        })}
                      </div>
                      <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
                        {(product.rating || 4).toFixed(1)} out of 5
                      </span>
                      <span className="mx-1 sm:mx-2 text-gray-300">|</span>
                      <span className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                        {reviews.length} customer reviews
                      </span>
                    </div>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                    #{product.product_code || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  Rs. {product.product_discounted_price}
                </span>
                {product.product_discounted_price <
                  product.product_base_price && (
                  <>
                    <span className="text-sm sm:text-lg text-gray-500 line-through">
                      Rs. {product.product_base_price}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full">
                      Save Rs.{" "}
                      {Math.floor(
                        product.product_base_price -
                          product.product_discounted_price
                      )}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {product.product_description || "No description available"}
              </p>

              <div className="space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-medium">Category:</span>{" "}
                  <Link
                    to={`/category/${product.category?._id}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {product.category?.name || "Unknown Category"}
                  </Link>
                </p>
                {product.subcategories?.length > 0 && (
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-medium">Subcategories:</span>{" "}
                    {product.subcategories.map((subcat, idx) => (
                      <Link
                        key={subcat._id}
                        to={`/category/${subcat._id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {subcat.name || "Unknown Subcategory"}
                        {idx < product.subcategories.length - 1 ? ", " : ""}
                      </Link>
                    ))}
                  </p>
                )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                {product.nicotine_strengths?.length > 0 && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Nicotine Strength
                    </label>
                    <select
                      value={nicotineStrength}
                      onChange={(e) => setNicotineStrength(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 shadow-sm text-xs sm:text-sm"
                    >
                      <option value="">Select Nicotine Strength</option>
                      {product.nicotine_strengths.map((strength) => (
                        <option key={strength} value={strength}>
                          {strength} mg
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {product.flavors?.length > 0 && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Flavor
                    </label>
                    <select
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 shadow-sm text-xs sm:text-sm"
                    >
                      <option value="">Select Flavor</option>
                      {product.flavors.map((flav) => (
                        <option key={flav} value={flav}>
                          {flav}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={loadingAddToCart || product.product_stock <= 0}
                className={`w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                  product.product_stock <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : loadingAddToCart
                    ? "bg-indigo-400"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                } shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base`}
              >
                {loadingAddToCart ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding to Cart...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>

              <div className="pt-3 sm:pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-gray-500 font-medium">Brand:</span>
                    <span className="ml-2 text-gray-700">
                      {product.brand_name || "N/A"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-gray-500 font-medium">Category:</span>
                    <span className="ml-2 text-gray-700">
                      {product.category?.name || "Unknown Category"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-gray-500 font-medium">
                      Availability:
                    </span>
                    <span
                      className={`ml-2 font-medium ${
                        product.product_stock > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.product_stock > 0
                        ? `${product.product_stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                    <span className="text-gray-500 font-medium">SKU:</span>
                    <span className="ml-2 text-gray-700">
                      {product.product_code || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 sm:p-8 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Customer Reviews
                </h2>
                {reviewsLoading ? (
                  <div className="flex justify-center">
                    <PulseLoader color="#4f46e5" />
                  </div>
                ) : reviewsError ? (
                  <p className="text-red-500 text-sm sm:text-base">
                    {reviewsError}
                  </p>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <svg
                      className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">
                      No reviews yet
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500">
                      Be the first to review this product
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100"
                      >
                        <div className="flex items-center mb-2 sm:mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-xs sm:text-sm font-medium text-gray-500">
                            {review.rating}.0
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
                          {review.review_text}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium text-gray-700">
                            {review.user_id?.username || "Anonymous"}
                          </span>{" "}
                          •{" "}
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Write a Review
                </h2>
                <form
                  onSubmit={handleSubmitReview}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewRating(i + 1)}
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            i < reviewRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } focus:outline-none`}
                        >
                          <svg
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            className="w-full h-full"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mt-3 sm:mt-4 mb-1 sm:mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-xs sm:text-sm"
                      rows="4"
                      placeholder="Write your review here..."
                    ></textarea>
                    <button
                      type="submit"
                      className="mt-3 sm:mt-4 w-full px-4 py-2 sm:px-6 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 text-sm sm:text-base"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              You May Also Like
            </h2>
            {relatedLoading ? (
              <div className="flex justify-center">
                <PulseLoader color="#4f46e5" />
              </div>
            ) : relatedError ? (
              <p className="text-red-500 text-sm sm:text-base">
                {relatedError}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts
                  .filter((p) => p._id !== product._id)
                  .slice(0, 4)
                  .map((related) => (
                    <Link
                      key={related._id}
                      to={`/product/${related._id}`}
                      className="group bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden hover:shadow-md sm:hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1"
                    >
                      <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-2 sm:p-4">
                        <img
                          src={
                            related.product_images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={related.product_name}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        {related.product_stock <= 0 && (
                          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-sm sm:shadow-md">
                            SOLD OUT
                          </span>
                        )}
                      </div>
                      <div className="p-3 sm:p-5">
                        <h3 className="text-sm sm:text-base text-gray-900 font-bold group-hover:text-indigo-600 line-clamp-2 mb-1 sm:mb-2">
                          {related.product_name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm sm:text-base text-gray-900 font-bold">
                              Rs. {related.product_discounted_price}
                            </span>
                            {related.product_discounted_price <
                              related.product_base_price && (
                              <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500 line-through">
                                Rs. {related.product_base_price}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                            </svg>
                            <span className="ml-1 text-xs sm:text-sm text-gray-600">
                              {(related.rating || 4).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SingleProduct;
