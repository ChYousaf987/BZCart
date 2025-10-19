  import React, { useState, useEffect, useRef } from "react";
  import { Link, useParams, useNavigate } from "react-router-dom";
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
  import { addToCart, fetchCart } from "../features/cart/cartSlice";
  import { v4 as uuidv4 } from "uuid";
  import Loader from "./Loader";
  import Slider from "react-slick";
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";

  const SingleProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading, error, reviews, reviewsLoading, reviewsError } =
      useSelector((state) => state.products);
    const { user, userLoading, userSuccess, userError, token } = useSelector(
      (state) => state.auth
    );
    const [activeTab, setActiveTab] = useState("description");
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const WHATSAPP_NUMBER = "923297609190";
    const [guestId] = useState(() => {
      const storedGuestId = localStorage.getItem("guestId");
      if (!storedGuestId) {
        const newGuestId = `guest_${uuidv4()}`;
        localStorage.setItem("guestId", newGuestId);
        console.log("SingleProduct - Generated new guestId:", newGuestId);
        return newGuestId;
      }
      return storedGuestId;
    });
    const hasFetchedCart = useRef(false);

    useEffect(() => {
      console.log("SingleProduct - Initializing with:", {
        userId: user?._id,
        guestId,
        userLoading,
        userSuccess,
        userError,
        token,
      });

      // Check if product is already in Redux store
      if (!product || product._id !== id) {
        dispatch(fetchProductById(id))
          .unwrap()
          .then((productData) => {
            if (productData?.product_images?.[0]) {
              setSelectedImage(productData.product_images[0]);
            }
            if (productData?.sizes?.length > 0) {
              const availableSize = productData.sizes.find(
                (size) => size.stock > 0
              );
              setSelectedSize(availableSize ? availableSize.size : "");
              console.log(
                "SingleProduct - Initial selected size:",
                availableSize ? availableSize.size : "None"
              );
            }
          })
          .catch((err) => {
            console.error("SingleProduct - Error loading product:", err);
            toast.error(err || "Failed to load product", {
              position: "top-right",
            });
          });

        dispatch(fetchReviews(id))
          .unwrap()
          .catch((err) => {
            console.error("SingleProduct - Error loading reviews:", err);
            toast.error(err || "Failed to load reviews", {
              position: "top-right",
            });
          });
      } else {
        // Use existing product data
        if (product.product_images?.[0] && !selectedImage) {
          setSelectedImage(product.product_images[0]);
        }
        if (product.sizes?.length > 0 && !selectedSize) {
          const availableSize = product.sizes.find((size) => size.stock > 0);
          setSelectedSize(availableSize ? availableSize.size : "");
          console.log(
            "SingleProduct - Using existing selected size:",
            availableSize ? availableSize.size : "None"
          );
        }
      }

      if (!hasFetchedCart.current && !userLoading) {
        if (!user && !guestId) {
          console.error("SingleProduct - Neither user nor guestId available");
          toast.error("Unable to load cart: No user or guest ID", {
            position: "top-right",
          });
          return;
        }

        hasFetchedCart.current = true;
        console.log("SingleProduct - Fetching cart with:", {
          guestId: user ? undefined : guestId,
        });
        dispatch(fetchCart({ guestId: user ? undefined : guestId }))
          .unwrap()
          .catch((err) => {
            console.error("SingleProduct - Error fetching cart:", err);
            toast.error(err || "Failed to load cart", { position: "top-right" });
          });
      } else if (userLoading) {
        console.log("SingleProduct - Waiting for auth to resolve");
      }
    }, [dispatch, id, guestId, user, userLoading, token, product]);

    // Scroll to top when component mounts
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

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
          reviewData: { user_id: user._id, comment: reviewText, rating },
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
          console.error("SingleProduct - Error submitting review:", err);
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
      if (product.sizes?.length > 0 && !selectedSize) {
        console.error("SingleProduct - Missing selected_size for Add to Cart");
        toast.error("Please select a size", { position: "top-right" });
        return;
      }
      if (
        product.sizes?.length > 0 &&
        product.sizes.find((s) => s.size === selectedSize)?.stock <= 0
      ) {
        toast.error(`Size ${selectedSize} is out of stock`, {
          position: "top-right",
        });
        return;
      }
      if (userLoading) {
        console.error("SingleProduct - Auth not resolved for addToCart");
        toast.error("Please wait, authentication is still loading", {
          position: "top-right",
        });
        return;
      }

      const cartData = {
        product_id: product._id,
        selected_image: selectedImage,
        guestId: user && token ? undefined : guestId,
        selected_size: selectedSize || null,
      };

      console.log("SingleProduct - Adding to cart:", {
        cartData,
        userId: user?._id,
        token,
      });

      dispatch(addToCart({ cartData, userId: user?._id, token }))
        .unwrap()
        .then(() => {
          dispatch(fetchCart({ guestId: user && token ? undefined : guestId }));
          toast.success("Added to cart!", { position: "top-right" });
        })
        .catch((err) => {
          console.error("SingleProduct - addToCart error:", err);
          toast.error(err || "Failed to add to cart", { position: "top-right" });
        });
    };

    const handleBuyNow = () => {
      if (!product?._id) {
        toast.error("Product ID is missing", { position: "top-right" });
        return;
      }
      if (!selectedImage) {
        toast.error("Please select an image", { position: "top-right" });
        return;
      }
      if (product.sizes?.length > 0 && !selectedSize) {
        console.error("SingleProduct - Missing selected_size for Buy Now");
        toast.error("Please select a size", { position: "top-right" });
        return;
      }
      if (
        product.sizes?.length > 0 &&
        product.sizes.find((s) => s.size === selectedSize)?.stock <= 0
      ) {
        toast.error(`Size ${selectedSize} is out of stock`, {
          position: "top-right",
        });
        return;
      }
      if (userLoading) {
        console.error("SingleProduct - Auth not resolved for Buy Now");
        toast.error("Please wait, authentication is still loading", {
          position: "top-right",
        });
        return;
      }

      const buyNowProduct = {
        _id: product._id,
        product_id: product,
        product_name: product.product_name,
        product_discounted_price: product.product_discounted_price,
        quantity: 1,
        selected_image: selectedImage || product.product_images[0],
        sizes: product.sizes,
        selected_size: selectedSize || null,
        product_stock: product.product_stock,
        shipping: product.shipping || 0,
      };

      console.log(
        "SingleProduct - Buy Now product:",
        JSON.stringify(buyNowProduct, null, 2)
      );

      navigate("/Cashout", {
        state: { buyNowProduct, guestId: user && token ? undefined : guestId },
      });
    };

    const handleOrderOnWhatsapp = () => {
      const productUrl = `${window.location.origin}/product/${id}`;
      const message =
        `Hello! I want to order this product.\n\n` +
        `🛒 Product: ${product.product_name}\n` +
        `💰 Price: Rs. ${product.product_discounted_price}\n` +
        (selectedSize ? `📏 Size: ${selectedSize}\n` : "") +
        `🔗 Product Link: ${productUrl}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    };

    const handleBack = () => {
      navigate("/");
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

    // Handle loading and error states
    if (loading && (!product || product._id !== id)) {
      return <Loader />;
    }

    if (error || !product || product._id !== id) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500">{error || "Product not found"}</p>
          <button
            onClick={handleBack}
            className="mt-4 text-[#f06621] font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
        </div>
      );
    }

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

    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };

    return (
      <>
        <Navbar />
        <div className="md:w-[95%] mx-auto md:px-0 p-2">
          

          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="md:hidden relative">
              {product.product_images?.length > 1 ? (
                <Slider {...sliderSettings}>
                  {product.product_images.map((img, i) => (
                    <div key={i}>
                      <img
                        src={img}
                        alt={`${product.product_name} image ${i}`}
                        className="max-h-[450px] object-contain rounded-md border bg-gray-50 w-full"
                      />
                    </div>
                  ))}
                </Slider>
              ) : (
                <img
                  src={
                    product.product_images?.[0] ||
                    "https://via.placeholder.com/500"
                  }
                  alt={product.product_name}
                  className="max-h-[450px] object-contain rounded-md border bg-gray-50 w-full"
                />
              )}
            </div>

            <div className="hidden md:flex gap-4">
              <div className="flex flex-col gap-3 w-20">
                {product.product_images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${product.product_name} thumbnail ${i}`}
                    className={`w-20 h-20 border rounded-md cursor-pointer hover:border-red-600 ${
                      selectedImage === img ? "border-red-600" : ""
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

            <div className="mt-4 md:mt-0">
              <div className="space-y-4">
                {/* 🏷️ Product Name & Brand */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                    {product.product_name}
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base">
                    Brand:{" "}
                    <span className="font-medium text-gray-700">
                      {product.brand_name}
                    </span>
                  </p>
                </div>

                {/* ⭐ Rating + Reviews */}
                <div className="flex items-center mb-2">
                  {renderStars(product.rating || 0)}
                  <p className="text-gray-500 text-sm ml-2">
                    {reviews.length > 0
                      ? `${reviews.length} review${
                          reviews.length > 1 ? "s" : ""
                        }`
                      : "No reviews yet"}
                  </p>
                </div>

                {/* 💰 Pricing */}
                <div className="mb-3">
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
                      Rs. {product.product_discounted_price}
                    </p>
                    {product.product_base_price >
                      product.product_discounted_price && (
                      <p className="text-gray-400 line-through text-sm">
                        Rs. {product.product_base_price}
                      </p>
                    )}
                  </div>
                  {product.product_base_price >
                    product.product_discounted_price && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Save Rs.{" "}
                      {product.product_base_price -
                        product.product_discounted_price}
                    </span>
                  )}
                </div>

                {/* 📏 Size Selection or Stock */}
                {product.sizes?.length > 0 ? (
                  <div className="mb-5">
                    <label className="block text-gray-800 font-semibold mb-3 text-sm sm:text-base">
                      Select Size
                    </label>

                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize === size.size;
                        const isOutOfStock = size.stock === 0;
                        return (
                          <button
                            key={size.size}
                            onClick={() =>
                              !isOutOfStock && setSelectedSize(size.size)
                            }
                            disabled={isOutOfStock}
                            className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border group 
                ${
                  isOutOfStock
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : isSelected
                    ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white border-transparent shadow-lg shadow-orange-300 scale-105"
                    : "bg-white border-gray-300 text-gray-700 hover:border-pink-400 hover:shadow-md hover:scale-105"
                }`}
                          >
                            {size.size}

                            {/* ✅ Stylish status badges */}
                            {!isOutOfStock && (
                              <span
                                className={`absolute -top-2 -right-2 text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm transition-all
                    ${
                      isSelected
                        ? "bg-white text-pink-500 group-hover:bg-pink-50"
                        : "bg-green-500 text-white"
                    }`}
                              >
                                {isSelected ? "✓" : "✓"}
                              </span>
                            )}

                            {isOutOfStock && (
                              <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
                                ✖
                              </span>
                            )}

                            {/* 🩶 Subtle animated ring for selected */}
                            {isSelected && (
                              <span className="absolute inset-0 rounded-full border-2 border-pink-300 animate-pulse"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    {product.product_stock > 0 ? (
                      <div
                        className={`flex items-center gap-2 text-sm font-semibold ${
                          product.product_stock < 4
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        <span className="text-lg">
                          {product.product_stock < 4 ? "⚠️" : "✔️"}
                        </span>
                        {product.product_stock < 4
                          ? `Only ${product.product_stock} left in stock!`
                          : `In Stock (${product.product_stock} available)`}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                        <span className="text-lg">❌</span>
                        Out of Stock
                      </div>
                    )}
                  </div>
                )}

                {/* 🚚 Shipping, Warranty, Payment */}
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">
                      🚚 Shipping:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {product.shipping === 0
                        ? "Free"
                        : `Rs. ${product.shipping}`}
                    </span>
                  </p>

                  {product.warranty && (
                    <p className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">
                        🛡️ Warranty:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {product.warranty}
                      </span>
                    </p>
                  )}

                  <p className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">
                      💳 Payment Methods:
                    </span>
                    <span className="font-semibold text-gray-800">
                      {product.payment?.join(", ")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 disabled:bg-gray-400"
                  disabled={
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                      : product.product_stock <= 0
                  }
                >
                  {product.sizes?.length > 0
                    ? selectedSize &&
                      product.sizes.find((s) => s.size === selectedSize)
                        ?.stock > 0
                      ? "Add to Cart"
                      : "Out of Stock"
                    : product.product_stock > 0
                    ? "Add to Cart"
                    : "Out of Stock"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-1/2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 disabled:bg-gray-400"
                  disabled={
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                      : product.product_stock <= 0
                  }
                >
                  Buy Now
                </button>
              </div>

              <button
                onClick={handleOrderOnWhatsapp}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b954] text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 disabled:bg-gray-400"
                disabled={
                  product.sizes?.length > 0
                    ? !selectedSize ||
                      product.sizes.find((s) => s.size === selectedSize)
                        ?.stock <= 0
                    : product.product_stock <= 0
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.04 2c-5.52 0-10 4.47-10 9.99 0 1.76.46 3.46 1.34 4.97L2 22l5.19-1.36c1.45.79 3.08 1.2 4.85 1.2 5.53 0 10-4.48 10-10s-4.47-9.84-10-9.84zm.04 18.03c-1.54 0-3.02-.41-4.3-1.2l-.31-.19-3.07.8.82-3.02-.2-.31c-.84-1.33-1.28-2.86-1.28-4.41 0-4.53 3.7-8.23 8.23-8.23 2.19 0 4.25.85 5.79 2.39 1.55 1.55 2.4 3.61 2.4 5.79-.01 4.53-3.7 8.38-8.28 8.38zm4.67-6.23c-.26-.13-1.54-.76-1.78-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.27-.77-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.41.11-.54.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.39-.8-1.9-.21-.51-.42-.44-.58-.45-.15-.01-.32-.01-.49-.01-.17 0-.45.07-.69.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.8 2.75 4.35 3.86.61.27 1.09.43 1.46.55.61.19 1.17.16 1.61.1.49-.07 1.54-.63 1.76-1.23.22-.61.22-1.13.15-1.23-.06-.1-.24-.16-.50-.29z" />
                </svg>
                Order on WhatsApp
              </button>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
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
              <div className="mt-8">
                {product.highlights && product.highlights.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-md font-semibold text-gray-700 mb-1">
                      Product Highlights:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {product.highlights.map((h, idx) => (
                        <li key={idx}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex border-b">
              <button
                className={`py-2 px-4 font-semibold transition-colors duration-300 ${
                  activeTab === "description"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-red-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-2 px-4 font-semibold transition-colors duration-300 ${
                  activeTab === "reviews"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-600 hover:text-red-500"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            {/* 🌟 Description Section */}
            {activeTab === "description" && (
              <div className="relative mt-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div
                  className="p-4 text-gray-700 whitespace-pre-line scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 break-words"
                  style={{
                    scrollBehavior: "smooth",
                    wordBreak: "break-word", // ✅ ensures long words/links wrap properly
                  }}
                >
                  <p className="leading-relaxed break-words">
                    {product.product_description || "No description available."}
                  </p>

                  {product.warranty && (
                    <p className="mt-2 break-words">
                      <strong className="text-gray-800">Warranty:</strong>{" "}
                      {product.warranty}
                    </p>
                  )}

                  {product.sizes?.length > 0 && (
                    <div className="mt-2 break-words">
                      <p className="text-gray-700 font-medium mb-1">
                        Available Sizes & Stock:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {product.sizes.map((size) => (
                          <li key={size.size} className="break-words">
                            {size.size}:{" "}
                            <span
                              className={
                                size.stock === 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              {size.stock} available
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* ✨ Fade effect at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="mt-4">
                {user && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold text-lg mb-2">
                      Write a Review
                    </h3>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                          Rating
                        </label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                              {star} Star{star > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                          Your Review
                        </label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                          rows="4"
                          placeholder="Write your review here..."
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}

                {reviewsLoading ? (
                  <Loader />
                ) : reviewsError ? (
                  <p className="text-red-500">{reviewsError}</p>
                ) : reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="p-4 border rounded-md bg-white shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {review.user_id?.username || "Anonymous"}
                            </p>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  };

  export default SingleProduct;
