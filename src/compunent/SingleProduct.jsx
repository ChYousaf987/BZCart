import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaHeadset, FaMoneyBillAlt, FaTruck, FaUndo } from "react-icons/fa";
import {
  fetchProductById,
  fetchReviews,
  submitReview,
} from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error, reviews, reviewsLoading, reviewsError } =
    useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    console.log("SingleProduct useEffect - Fetching for ID:", id);
    const startTime = performance.now();
    Promise.all([
      dispatch(fetchProductById(id))
        .unwrap()
        .then((result) => {
          console.log("fetchProductById success:", result);
          return result;
        })
        .catch((err) => {
          console.error("fetchProductById error:", err);
          throw err;
        }),
      dispatch(fetchReviews(id))
        .unwrap()
        .then((result) => {
          console.log("fetchReviews success:", result);
          return result;
        })
        .catch((err) => {
          console.error("fetchReviews error:", err);
          throw err;
        }),
    ])
      .then(([productResult]) => {
        if (productResult?.product_images?.[0]) {
          setSelectedImage(productResult.product_images[0]);
        }
        console.log(
          "SingleProduct useEffect - Completed in",
          performance.now() - startTime,
          "ms"
        );
      })
      .catch((err) => {
        console.error("SingleProduct useEffect - Error:", err);
      });
  }, [dispatch, id]); // Removed product?.product_images from dependencies

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
    dispatch(
      submitReview({
        productId: id,
        reviewData: { comment: reviewText, rating: 5 },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Review submitted successfully!", {
          position: "top-right",
        });
        setReviewText("");
        dispatch(fetchReviews(id));
      })
      .catch((err) => {
        toast.error(err || "Failed to submit review", {
          position: "top-right",
        });
      });
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please log in to add items to cart", {
        position: "top-right",
      });
      return;
    }
    dispatch(
      addToCart({
        prod_id: id,
        selected_image: selectedImage || product.product_images[0],
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || "Product not found"}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-[95%] mx-auto md:px-0 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
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
                  loading="lazy" // Added lazy loading
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                src={
                  selectedImage ||
                  product.product_images?.[0] ||
                  "https://via.placeholder.com/500"
                }
                alt={product.product_name}
                className="w-full h-[500px] object-contain rounded-md border"
                loading="lazy" // Added lazy loading
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {product.product_name}
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              {reviews.length > 0
                ? `${reviews.length} review(s)`
                : "Be the first to review this product"}
            </p>
            <p className="text-2xl font-bold text-red-600 mb-2">
              Rs. {product.product_discounted_price}
            </p>
            {product.product_base_price > product.product_discounted_price && (
              <p className="text-gray-400 line-through text-sm mb-2">
                Rs. {product.product_base_price}
              </p>
            )}
            <p className="text-green-600 mb-2">✔ In Stock</p>
            <p className="mb-2">
              Ships In: <span className="font-semibold">1-3 Days</span>
            </p>
            <p className="mb-2">
              Warranty:{" "}
              <span className="font-semibold">2 Years Brand Warranty</span>
            </p>
            <p className="mb-2">
              Delivery Area: <span className="font-semibold">Nationwide</span>
            </p>
            <p className="mb-6">
              Shipped By: <span className="font-semibold">Naheed</span>
            </p>
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
            <button
              onClick={handleAddToCart}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            <FaTruck className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold">Fast Shipping</h4>
              <p className="text-sm text-gray-600">Shipped In 1-3 Days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            <FaUndo className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold">Free Returns</h4>
              <p className="text-sm text-gray-600">Free 7 Days Return</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            <FaMoneyBillAlt className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold">Payment On Delivery</h4>
              <p className="text-sm text-gray-600">Cash On Delivery Option</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            <FaHeadset className="text-red-600 text-xl" />
            <div>
              <h4 className="font-semibold">Customer Support</h4>
              <p className="text-sm text-gray-600">Phone and Email</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-2 font-medium ${
                activeTab === "description"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-2 font-medium ${
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
                {reviewsLoading && <p>Loading reviews...</p>}
                {reviewsError && <p className="text-red-500">{reviewsError}</p>}
                {reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <div key={i} className="border-b py-2">
                      <p className="font-semibold">
                        {review.user_id?.username || "Anonymous"}
                      </p>
                      <p>{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        Rating: {review.rating}/5
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
                {user && (
                  <form
                    className="mt-4 space-y-3"
                    onSubmit={handleReviewSubmit}
                  >
                    <textarea
                      placeholder="Write your review..."
                      className="w-full border rounded-md p-3"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    ></textarea>
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Submit Review
                    </button>
                  </form>
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
