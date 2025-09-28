import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import Slider from "react-slick";


const SingleProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error, reviews, reviewsLoading, reviewsError } =
    useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [selectedImage, setSelectedImage] = useState("");
  const WHATSAPP_NUMBER = "923297609190"; // Pakistan example
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
    if (reviewText.length < 3 || reviewText.length > 500) {
      toast.error("Review must be between 3 and 500 characters", {
        position: "top-right",
      });
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
    if (!product?._id) {
      toast.error("Product ID is missing", { position: "top-right" });
      return;
    }
    if (!selectedImage) {
      toast.error("Please select an image", { position: "top-right" });
      return;
    }

    dispatch(
      addToCart({
        product_id: product._id,
        selected_image: selectedImage,
        guestId: user ? undefined : guestId,
      })
    )
      .unwrap()
      .then(() => {
        
        // Fetch the updated cart to ensure consistency
        dispatch(fetchCart({ guestId: user ? undefined : guestId }));
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
    const buyNowProduct = {
      _id: product._id,
      product_name: product.product_name,
      product_discounted_price: product.product_discounted_price,
      quantity: 1,
      selected_image: selectedImage || product.product_images[0],
    };

    navigate("/paymentMethod", {
      state: {
        buyNowProduct,
        guestId: user ? undefined : guestId,
      },
    });
  };

  const handleOrderOnWhatsapp = () => {
    const productUrl = `${window.location.origin}/product/${id}`;
    const message =
      `Hello! I want to order this product.\n\n` +
      `🛒 Product: ${product.product_name}\n` +
      `💰 Price: Rs. ${product.product_discounted_price}\n` +
      `🔗 Product Link: ${productUrl}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black/50 p-2 rounded-full"
      onClick={onClick}
    >
      ❯
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 cursor-pointer text-white bg-black/50 p-2 rounded-full"
      onClick={onClick}
    >
      ❮
    </div>
  );

  <Slider
    dots={true}
    infinite={true}
    speed={500}
    slidesToShow={1}
    slidesToScroll={1}
    arrows={true} // enable arrows
    nextArrow={<NextArrow />}
    prevArrow={<PrevArrow />}
  >
    {product.product_images?.map((img, i) => (
      <div key={i}>
        <img
          src={img}
          alt={`${product.product_name} image ${i}`}
          className="max-h-[450px] object-contain rounded-md border bg-gray-50 w-full"
        />
      </div>
    ))}
  </Slider>;
  


  return (
    <>
      <Navbar />
      <div className="w-[95%] mx-auto md:px-0 p-4">
        {/* ---------------- IMAGES + INFO ---------------- */}
        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* Mobile: Big image with thumbnails below */}

          {/* Mobile: Slider for product images */}
          <div className="md:hidden relative">
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={true} // enable arrows
              nextArrow={<NextArrow />}
              prevArrow={<PrevArrow />}
            >
              {product.product_images?.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    alt={`${product.product_name} image ${i}`}
                    className="max-h-[450px] object-contain rounded-md border bg-gray-50 w-full"
                  />
                </div>
              ))}
            </Slider>
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

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddToCart}
                className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 disabled:bg-gray-400"
                disabled={product.product_stock <= 0}
              >
                {product.product_stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 disabled:bg-gray-400"
                disabled={product.product_stock <= 0}
              >
                Buy Now
              </button>
            </div>

            <button
              onClick={handleOrderOnWhatsapp}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b954] text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 disabled:bg-gray-400"
              disabled={product.product_stock <= 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.04 2c-5.52 0-10 4.47-10 9.99 0 1.76.46 3.46 1.34 4.97L2 22l5.19-1.36c1.45.79 3.08 1.2 4.85 1.2 5.53 0 10-4.48 10-10s-4.47-9.84-10-9.84zm.04 18.03c-1.54 0-3.02-.41-4.3-1.2l-.31-.19-3.07.8.82-3.02-.2-.31c-.84-1.33-1.28-2.86-1.28-4.41 0-4.53 3.7-8.23 8.23-8.23 2.19 0 4.25.85 5.79 2.39 1.55 1.55 2.4 3.61 2.4 5.79-.01 4.53-3.7 8.38-8.28 8.38zm4.67-6.23c-.26-.13-1.54-.76-1.78-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.27-.77-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.41.11-.54.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.39-.8-1.9-.21-.51-.42-.44-.58-.45-.15-.01-.32-.01-.49-.01-.17 0-.45.07-.69.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.8 2.75 4.35 3.86.61.27 1.09.43 1.46.55.61.19 1.17.16 1.61.1.49-.07 1.54-.63 1.76-1.23.22-.61.22-1.13.15-1.23-.06-.1-.24-.16-.5-.29z" />
              </svg>
              Order on WhatsApp
            </button>

            <div className="mb-6 mt-3">
              <h3 className="font-semibold text-lg mb-2">
                Product Highlights:
              </h3>
              <p className="whitespace-pre-line text-gray-700">
                {product.product_description}
              </p>
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
                <p className="whitespace-pre-line text-gray-700">
                  {product.product_description}
                </p>
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
                          {renderStars(review.rating || 0)}
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
                        maxLength={500}
                      />
                      <p className="text-sm text-gray-500">
                        {reviewText.length}/500 characters
                      </p>
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
                    <Link to="/login" className="text-red-600 hover:underline">
                      log in
                    </Link>{" "}
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
