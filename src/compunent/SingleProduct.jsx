import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  FaHeadset,
  FaMoneyBillAlt,
  FaTruck,
  FaUndo,
  FaStar,
} from "react-icons/fa";
import {
  fetchProductById,
  fetchReviews,
  submitReview,
} from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { v4 as uuidv4 } from "uuid";
import Loader from "./Loader";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error, reviews, reviewsLoading, reviewsError } =
    useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedImage, setSelectedImage] = useState("");
  const [guestId] = useState(
    localStorage.getItem("guestId") || `guest_${uuidv4()}`
  );

  useEffect(() => {
    localStorage.setItem("guestId", guestId);
    Promise.all([dispatch(fetchProductById(id)), dispatch(fetchReviews(id))])
      .then(([productResult]) => {
        if (
          productResult.payload?.product_images &&
          productResult.payload?.product_images[0]
        ) {
          setSelectedImage(productResult.payload.product_images[0]);
        }
      })
      .catch((err) => console.error("Error loading product:", err));
  }, [dispatch, id, guestId]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review", {
        position: "top-right",
      });
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a review", { position: "top-right" });
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Please select a valid rating (1–5)", {
        position: "top-right",
      });
      return;
    }
    dispatch(
      submitReview({
        productId: id,
        reviewData: { comment: reviewText, rating },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Review submitted successfully!", {
          position: "top-right",
        });
        setReviewText("");
        setRating(5);
        dispatch(fetchReviews(id));
      })
      .catch((err) => {
        toast.error(err || "Failed to submit review", {
          position: "top-right",
        });
      });
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        prod_id: id,
        selected_image: selectedImage || product.product_images[0],
        guestId: user ? undefined : guestId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart!", { position: "top-right" });
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart", { position: "top-right" });
      });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } text-lg`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Product not found"}</p>
      </div>
    );
  }

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        prod_id: id,
        selected_image: selectedImage || product.product_images[0],
        guestId: user ? undefined : guestId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Redirecting to checkout...", { position: "top-right" });
        // Navigate to cart/checkout page
        window.location.href = "/payment"; // or "/checkout" if you make a separate page
      })
      .catch((err) => {
        toast.error(err || "Failed to proceed with Buy Now", {
          position: "top-right",
        });
      });
  };

  return (
    <>
      <Navbar />
      <div className="w-[95%] mx-auto md:px-0 p-4">
        {/* ---------------- IMAGES + INFO ---------------- */}
        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* Mobile: Big image with thumbnails below */}
          <div className="md:hidden">
            <img
              src={
                selectedImage ||
                product.product_images?.[0] ||
                "https://via.placeholder.com/500"
              }
              alt={product.product_name}
              className="w-full h-[320px] object-contain rounded-md border bg-gray-50"
            />
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.product_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className={`w-16 h-16 border rounded-md cursor-pointer ${
                    selectedImage === img ? "border-primary" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Desktop: thumbnails left, big image right */}
          <div className="hidden md:flex gap-4">
            <div className="flex flex-col gap-3 w-20">
              {product.product_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.product_name} thumbnail ${i}`}
                  className={`w-20 h-20 border rounded-md cursor-pointer hover:border-primary ${
                    selectedImage === img ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
            <div className="flex-1 bg-gray-50 p-2 rounded-md border">
              <img
                src={
                  selectedImage ||
                  product.product_images?.[0] ||
                  "https://via.placeholder.com/500"
                }
                alt={product.product_name}
                className="w-full h-[450px] object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-4 md:mt-0">
            <h2 className="text-xl md:text-2xl font-semibold mb-2">
              {product.product_name}
            </h2>

            <div className="flex items-center mb-3">
              {renderStars(
                reviews.length > 0
                  ? Math.round(
                      reviews.reduce((acc, r) => acc + r.rating, 0) /
                        reviews.length
                    )
                  : 0
              )}
              <p className="text-gray-500 text-sm ml-2">
                {reviews.length > 0
                  ? `${reviews.length} review(s)`
                  : "No reviews yet"}
              </p>
            </div>

            <p className="text-2xl font-bold text-red-600 mb-1">
              Rs. {product.product_discounted_price}
            </p>
            {product.product_base_price > product.product_discounted_price && (
              <p className="text-gray-400 line-through text-sm mb-2">
                Rs. {product.product_base_price}
              </p>
            )}

            <p
              className={`mb-2 ${
                product.product_stock > 0 && product.product_stock < 4
                  ? "text-red-600"
                  : product.product_stock > 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {product.product_stock > 0
                ? `✔ In Stock (${product.product_stock} available)`
                : "✖ Out of Stock"}
            </p>

            <p className="mb-2">
              Ships In: <span className="font-semibold">3-8 Days</span>
            </p>
            <p className="mb-2">
              Warranty:{" "}
              <span className="font-semibold">2 Years Brand Warranty</span>
            </p>

            <button
              onClick={handleAddToCart}
              className="mt-4 w-full bg-primary hover:bg-[#bd470c] text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
              disabled={product.product_stock <= 0}
            >
              {product.product_stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              onClick={handleBuyNow}
              className="mt-4 w-full bg-primary hover:bg-[#bd470c] text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
              disabled={product.product_stock <= 0}
            >
              Buy Now
            </button>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">
                Product Highlights:
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {product.product_description
                  .split(". ")
                  .map(
                    (highlight, i) => highlight && <li key={i}>{highlight}</li>
                  )}
              </ul>
            </div>

            
          </div>
        </div>

        {/* ---------------- ICON CARDS ---------------- */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 border rounded shadow-sm">
            <FaTruck className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold text-sm">Fast Shipping</h4>
              <p className="text-xs text-gray-600">Shipped In 1-3 Days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded shadow-sm">
            <FaUndo className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold text-sm">Free Returns</h4>
              <p className="text-xs text-gray-600">Free 7 Days Return</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded shadow-sm">
            <FaMoneyBillAlt className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold text-sm">Cash on Delivery</h4>
              <p className="text-xs text-gray-600">COD Available</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded shadow-sm">
            <FaHeadset className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold text-sm">Support</h4>
              <p className="text-xs text-gray-600">Phone & Email</p>
            </div>
          </div>
        </div>

        {/* ---------------- TABS ---------------- */}
        <div className="mt-10">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 text-center py-2 font-medium ${
                activeTab === "description"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 text-center py-2 font-medium ${
                activeTab === "reviews"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600"
              }`}
            >
              Reviews
            </button>
          </div>

          <div className="mt-4 text-gray-700">
            {activeTab === "description" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Product Description
                </h2>
                <p>{product.product_description}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
                {reviewsLoading && (
                  <p className="text-gray-500">Loading reviews...</p>
                )}
                {reviewsError && <p className="text-red-500">{reviewsError}</p>}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, i) => (
                      <div key={i} className="border-b py-4">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">
                            {review.user_id?.username || "Anonymous"}
                          </p>
                          {renderStars(review.rating)}
                        </div>
                        <p className="mt-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}

                {user ? (
                  <form
                    className="mt-6 space-y-4"
                    onSubmit={handleReviewSubmit}
                  >
                    <div>
                      <label className="block font-semibold mb-1">
                        Your Rating
                      </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`cursor-pointer text-lg ${
                              star <= rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Your Review
                      </label>
                      <textarea
                        placeholder="Write your review..."
                        className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows="4"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                      disabled={reviewsLoading}
                    >
                      {reviewsLoading ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <p className="mt-4 text-gray-500">
                    Please{" "}
                    <a href="/login" className="text-red-600 hover:underline">
                      log in
                    </a>{" "}
                    to submit a review.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SingleProduct;
