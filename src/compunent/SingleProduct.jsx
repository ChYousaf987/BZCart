import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Footer from "./Footer";
import {
  FaHeadset,
  FaMoneyBillAlt,
  FaTruck,
  FaUndo,
  FaStar,
  FaAngleDown,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import {
  fetchProductById,
  fetchReviews,
  submitReview,
  clearCurrentProduct, // ← Now we use this
} from "../features/products/productSlice";
import { addToCart, fetchCart } from "../features/cart/cartSlice";
import { v4 as uuidv4 } from "uuid";
import Loader from "./Loader";
import Slider from "react-slick";
import { fromSlug, toSlug } from "../utils/slugify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SingleProduct = () => {
  const navigate = useNavigate();
  const { productName } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error, reviews, reviewsLoading } = useSelector(
    (state) => state.products
  );
  const { user, userLoading, token } = useSelector((state) => state.auth);

  // Local state
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  // Add these lines with your other useState hooks
  const [openDesc, setOpenDesc] = useState(false);
  const [openShip, setOpenShip] = useState(false);
  const [openCare, setOpenCare] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  // Critical: Track if we're currently resolving the product
  const [resolvingProduct, setResolvingProduct] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);

  const mainSliderRef = useRef(null);
  const WHATSAPP_NUMBER = "923297609190";

  const [guestId] = useState(() => {
    const stored = localStorage.getItem("guestId");
    if (stored) return stored;
    const newId = `guest_${uuidv4()}`;
    localStorage.setItem("guestId", newId);
    return newId;
  });

  const hasFetchedCart = useRef(false);

  // ─────────────────────────────────────
  // 1. Reset everything when productName changes
  // ─────────────────────────────────────
  useEffect(() => {
    dispatch(clearCurrentProduct()); // ← This clears old product instantly
    setResolvingProduct(true);
    setProductNotFound(false);
    setSelectedImage("");
    setSelectedSize("");
    setActiveSlide(0);
    hasFetchedCart.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [productName, dispatch]);

  // ─────────────────────────────────────
  // 2. Resolve slug → ID → fetch product
  // ─────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const resolveAndFetchProduct = async () => {
      if (!mounted) return;

      setResolvingProduct(true);
      setProductNotFound(false);

      try {
        const res = await fetch(
          "https://bzbackend.online/api/products/products"
        );
        const allProducts = await res.json();

        const normalize = (str) =>
          String(str)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]/g, "")
            .replace(/\-+/g, "-");

        const target = normalize(productName);
        const decoded = fromSlug(productName);

        const foundProduct = allProducts.find((p) => {
          const nameNorm = normalize(p.product_name);
          const nameLower = p.product_name.toLowerCase();
          return (
            nameNorm === target ||
            nameLower === decoded.toLowerCase() ||
            nameLower === productName.toLowerCase()
          );
        });

        if (!foundProduct) {
          if (mounted) {
            setProductNotFound(true);
            toast.error("Product not found");
          }
          return;
        }

        // Fetch the full product
        await dispatch(fetchProductById(foundProduct._id)).unwrap();
        await dispatch(fetchReviews(foundProduct._id)).unwrap();

        if (mounted) setResolvingProduct(false);
      } catch (err) {
        console.error("Error resolving product:", err);
        if (mounted) {
          setProductNotFound(true);
          toast.error("Failed to load product");
        }
      } finally {
        if (mounted) setResolvingProduct(false);
      }
    };

    resolveAndFetchProduct();

    return () => {
      mounted = false;
    };
  }, [productName, dispatch]);

  // ─────────────────────────────────────
  // 3. Set default image & size after load
  // ─────────────────────────────────────
  useEffect(() => {
    if (product && product.product_images?.[0]) {
      setSelectedImage((prev) => prev || product.product_images[0]);
    }
    if (product?.sizes?.length > 0 && !selectedSize) {
      const available = product.sizes.find((s) => s.stock > 0);
      if (available) setSelectedSize(available.size);
    }
  }, [product, selectedSize]);

  // ─────────────────────────────────────
  // 4. Fetch cart once resolved
  // ─────────────────────────────────────
  useEffect(() => {
    if (
      !hasFetchedCart.current &&
      !userLoading &&
      product &&
      (user || guestId)
    ) {
      hasFetchedCart.current = true;
      dispatch(fetchCart({ guestId: user ? undefined : guestId }));
    }
  }, [user, userLoading, guestId, product, dispatch]);

  // ─────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please log in to submit a review");
    if (!reviewText.trim()) return toast.error("Please write a review");

    dispatch(
      submitReview({
        productId: product._id,
        reviewData: { comment: reviewText, rating },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Review submitted!");
        setReviewText("");
        setRating(5);
      })
      .catch((err) => toast.error(err || "Failed to submit review"));
  };

  const handleAddToCart = () => {
    if (
      !product ||
      !selectedImage ||
      (product.sizes?.length > 0 && !selectedSize)
    )
      return toast.error("Please complete selection");

    const sizeStock =
      product.sizes?.find((s) => s.size === selectedSize)?.stock || 0;
    if (product.sizes?.length > 0 && sizeStock <= 0)
      return toast.error("Selected size is out of stock");

    dispatch(
      addToCart({
        cartData: {
          product_id: product._id,
          selected_image: selectedImage,
          selected_size: selectedSize || null,
          guestId: user ? undefined : guestId,
        },
        userId: user?._id,
        token,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
        dispatch(fetchCart({ guestId: user ? undefined : guestId }));
      })
      .catch((err) => toast.error(err || "Failed to add to cart"));
  };

  const handleBuyNow = () => {
    if (
      !product ||
      !selectedImage ||
      (product.sizes?.length > 0 && !selectedSize)
    )
      return toast.error("Please complete selection");

    const buyNowProduct = {
      _id: product._id,
      product_name: product.product_name,
      product_discounted_price: product.product_discounted_price,
      selected_image: selectedImage,
      selected_size: selectedSize || null,
      shipping: product.shipping || 0,
    };

    navigate("/Cashout", {
      state: { buyNowProduct, guestId: user ? undefined : guestId },
    });
  };

  const handleOrderOnWhatsapp = () => {
    const url = `${window.location.origin}/product/${toSlug(
      product.product_name
    )}`;
    const msg = encodeURIComponent(
      `Hello! I want to order:\n\nProduct: ${
        product.product_name
      }\nPrice: Rs. ${product.product_discounted_price}\n${
        selectedSize ? `Size: ${selectedSize}\n` : ""
      }Link: ${url}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  const renderStars = (r) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          className={`text-lg ${s <= r ? "text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );

  // ─────────────────────────────────────
  // Render Logic
  // ─────────────────────────────────────
  if (resolvingProduct || loading) {
    return <Loader />;
  }

  if (productNotFound || error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl mb-4">
          {error || "Product not found"}
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-[#f06621] font-medium hover:underline flex items-center gap-2 mx-auto"
        >
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
      <div className="md:w-[95%] mx-auto md:px-0 px-4 py-2 font-darazs">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          {/* 📱 Mobile View Images */}
          <div className="md:hidden relative flex flex-col items-center">
            {/* Main Slider */}
            <Slider
              ref={mainSliderRef}
              dots={false}
              infinite={false}
              speed={400}
              slidesToShow={1}
              slidesToScroll={1}
              arrows={false}
              afterChange={(index) => setActiveSlide(index)}
              className="w-full mb-3"
            >
              {product.product_images?.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    alt={`${product.product_name} image ${i}`}
                    className="w-full max-h-[300px] object-contain rounded-md border bg-gray-50"
                  />
                </div>
              ))}
            </Slider>

            {/* Thumbnail Row */}
            <div className="flex h-20 gap-3 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 px-2 w-full">
              {product.product_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.product_name} thumbnail ${i}`}
                  onClick={() => mainSliderRef.current?.slickGoTo(i)}
                  className={`h-16 w-16 mt-1 object-contain rounded-md border flex-shrink-0 cursor-pointer transition-transform duration-200 ${
                    activeSlide === i
                      ? "border-red-600 scale-105 shadow-md"
                      : "border-gray-300 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:flex gap-4">
            <div className="flex flex-col gap-3 w-20">
              {product.product_images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 border rounded-md cursor-pointer ${
                    selectedImage === img ? "border-red-600" : ""
                  }`}
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                src={product.product_images?.[0]}
                alt={product.product_name}
                className="w-full h-[450px] object-contain"
              />
            </div>
          </div>

          <div className="mt-2 md:mt-0  text-gray-800">
            <div className="space-y-1">
              {/* 🏷️ Product Name & Brand */}
              <div>
                <h2 className="text-2xl md:text-4xl font- text-gray-900 leading-tight tracking-tight">
                  {product.product_name}
                </h2>
                <p className="text-sm md:text-base text-gray-500 mt-1">
                  Brand:{" "}
                  <span className="font-semibold text-gray-900">
                    {product.brand_name}
                  </span>
                </p>
              </div>

              {/* ⭐ Rating + Reviews */}
              <div className="flex items-center ">
                {renderStars(product.rating || 0)}
                <p className="text-gray-500 text-sm ml-2 font-medium">
                  {reviews.length > 0
                    ? `${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                    : "No reviews yet"}
                </p>
              </div>

              {/* 💰 Pricing */}
              <div>
                <div className="flex items-end gap-3">
                  <p className="text-2xl font-bold text-gradient bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">
                    Rs. {product.product_discounted_price}
                  </p>
                  {product.product_base_price >
                    product.product_discounted_price && (
                    <p className="text-gray-400 mb-0.5 line-through text-sm font-medium">
                      Rs. {product.product_base_price}
                    </p>
                  )}
                </div>
                {product.product_base_price >
                  product.product_discounted_price && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    Save Rs.{" "}
                    {product.product_base_price -
                      product.product_discounted_price}
                  </span>
                )}
              </div>

              {/* 📏 Size Selection or Stock */}
              {product.sizes?.length > 0 ? (
                <div>
                  <label className="block text-gray-800 font-semibold mb-3 text-sm sm:text-base uppercase tracking-wide">
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
                          className={`relative px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border group 
                  ${
                    isOutOfStock
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : isSelected
                      ? "bg-gradient-to-r from-orange-500 to-orange-700 text-white shadow-md scale-105"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:border-orange-400 hover:shadow-sm hover:scale-105"
                  }`}
                        >
                          {size.size}
                          {isOutOfStock && (
                            <span className="absolute -top-2 -right-2 bg-gray-400 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm">
                              ✖
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
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
              <div className="space-y-1 text-[15px]">
                <p className="flex items-center gap-2 mt-2">
                  <span className="text-gray-600 font-medium">
                    🚚 Shipping:
                  </span>
                  <span className="font-semibold text-gray-700">
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
                    <span className="font-semibold text-gray-700">
                      {product.warranty}
                    </span>
                  </p>
                )}

                <p className="flex items-center gap-2">
                  <span className="text-gray-600 font-medium">
                    💳 Payment Methods:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {product.payment?.join(", ")}
                  </span>
                </p>
              </div>
            </div>

            {/* 🛒 Add to Cart / Buy Now Buttons */}
            <div className="mt-6 space-y-4">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-sm font-semibold shadow-lg border-2 border-orange-600 transition-all duration-300 ${
                  product.sizes?.length > 0
                    ? !selectedSize ||
                      product.sizes.find((s) => s.size === selectedSize)
                        ?.stock <= 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg--500 hover:shadow-lg hover:scale-[1.02]"
                    : product.product_stock > 0
                    ? "  hover:shadow-lg hover:scale-[1.02]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={
                  product.sizes?.length > 0
                    ? !selectedSize ||
                      product.sizes.find((s) => s.size === selectedSize)
                        ?.stock <= 0
                    : product.product_stock <= 0
                }
              >
                ADD TO CART
              </button>

              <div className="">
                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className={`w-full py-3 rounded-sm font-semibold border border-orange-800 bg-primary shadow-lg hover:shadow[inset_0_3px_6px_rgba(0,0,0,0.08),_0_3px_6px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all duration-300 ${
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                        ? "bg-gray-500 text-gray-400 cursor-not-allowed shadow-none"
                        : ""
                      : product.product_stock > 0
                      ? "bg-primary hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                      : product.product_stock <= 0
                  }
                >
                  BUY IT NOW
                </button>

                {/* 💬 WhatsApp */}
                <button
                  onClick={handleOrderOnWhatsapp}
                  className={`w-full flex items-center bg-primary justify-center gap-2 py-3 rounded-sm mt-3 font-semibold border border-orange-800 text- shadow-lg transition-all duration-300 ${
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primary hover:shadow-lg hover:scale-[1.02]"
                      : product.product_stock > 0
                      ? "bg-primary hover:shadow-lg hover:scale-[1.02]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  disabled={
                    product.sizes?.length > 0
                      ? !selectedSize ||
                        product.sizes.find((s) => s.size === selectedSize)
                          ?.stock <= 0
                      : product.product_stock <= 0
                  }
                >
                  WHATSAPP
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.04 2c-5.52 0-10 4.47-10 9.99 0 1.76.46 3.46 1.34 4.97L2 22l5.19-1.36c1.45.79 3.08 1.2 4.85 1.2 5.53 0 10-4.48 10-10s-4.47-9.84-10-9.84zm.04 18.03c-1.54 0-3.02-.41-4.3-1.2l-.31-.19-3.07.8.82-3.02-.2-.31c-.84-1.33-1.28-2.86-1.28-4.41 0-4.53 3.7-8.23 8.23-8.23 2.19 0 4.25.85 5.79 2.39 1.55 1.55 2.4 3.61 2.4 5.79-.01 4.53-3.7 8.38-8.28 8.38zm4.67-6.23c-.26-.13-1.54-.76-1.78-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.27-.77-.68-1.28-1.52-1.43-1.78-.15-.26-.02-.41.11-.54.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.39-.8-1.9-.21-.51-.42-.44-.58-.45-.15-.01-.32-.01-.49-.01-.17 0-.45.07-.69.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.8 2.75 4.35 3.86.61.27 1.09.43 1.46.55.61.19 1.17.16 1.61.1.49-.07 1.54-.63 1.76-1.23.22-.61.22-1.13.15-1.23-.06-.1-.24-.16-.5-.29z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 🚚 Icons Section
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <FaTruck className="text-orange-600 text-xl" />
                <div>
                  <h4 className="font-semibold text-sm">Fast Shipping</h4>
                  <p className="text-xs text-gray-500">Shipped In 1–3 Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <FaUndo className="text-orange-600 text-xl" />
                <div>
                  <h4 className="font-semibold text-sm">Free Returns</h4>
                  <p className="text-xs text-gray-500">7 Days Return</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <FaMoneyBillAlt className="text-orange-600 text-xl" />
                <div>
                  <h4 className="font-semibold text-sm">Cash on Delivery</h4>
                  <p className="text-xs text-gray-500">COD Available</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                <FaHeadset className="text-orange-600 text-xl" />
                <div>
                  <h4 className="font-semibold text-sm">Customer Support</h4>
                  <p className="text-xs text-gray-500">Phone & Email</p>
                </div>
              </div>
            </div> */}
            {/* ==================== NEW COLLAPSIBLE ACCORDION SECTION (Clean & Working) ==================== */}
            <div className="mt-10 md:w-[95%] mx-auto px-4 md:px-0 font-darazs">
              {/* WhatsApp Big Button */}

              <div className="">
                {/* DESCRIPTION */}
                <div className="border border-gray-200  overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenDesc(!openDesc)}
                    className="w-full px-6 py-4 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      DESCRIPTION
                    </span>
                    <span
                      className={`text-xl transition-transform duration-300 ${
                        openDesc ? "rotate-180" : ""
                      }`}
                    >
                      <FaAngleDown />
                    </span>
                  </button>
                  {openDesc && (
                    <div className="px-6 py-5 bg-gray-50 text-gray-600 text-sm leading-relaxed space-y-4">
                      <p className="whitespace-pre-line">
                        {product.product_description ||
                          "No description available."}
                      </p>

                      {product.highlights && product.highlights.length > 0 && (
                        <div>
                          <p className="font-bold text-gray-800 mb-2">
                            Highlights:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {product.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {product.warranty && (
                        <p>
                          <strong>Warranty:</strong> {product.warranty}
                        </p>
                      )}

                      {product.sizes?.length > 0 && (
                        <div>
                          <p className="font-bold text-gray-800 mb-3">
                            Available Sizes:
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {product.sizes.map((s) => (
                              <span
                                key={s.size}
                                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                                  s.stock > 0
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-red-100 text-red-700 border-red-300 line-through"
                                }`}
                              >
                                {s.size}{" "}
                                {s.stock > 0
                                  ? `(${s.stock} left)`
                                  : "(Out of stock)"}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Highlights */}
                <div className="border border-gray-200  overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenNote(!openNote)}
                    className="w-full px-6 py-4 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      Product Highlights
                    </span>
                    <span
                      className={`text-xl transition-transform duration-300 ${
                        openNote ? "rotate-180" : ""
                      }`}
                    >
                      <FaAngleDown />
                    </span>
                  </button>
                  {openNote && (
                    <div className="px-6 py-5 bg-gray-50 text-gray-600 text-sm italic">
                      <h3 className="text-md font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Product Highlights
                      </h3>
                      <ul className="list-disc list-inside text-gray-500 text-sm leading-relaxed space-y-1">
                        {product.highlights.map((h, idx) => (
                          <li key={idx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {/* SHIPPING INFORMATION */}
                <div className="border border-gray-200  overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenShip(!openShip)}
                    className="w-full px-6 py-4 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      SHIPPING INFORMATION
                    </span>
                    <span
                      className={`text-xl transition-transform duration-300 ${
                        openShip ? "rotate-180" : ""
                      }`}
                    >
                      <FaAngleDown />
                    </span>
                  </button>
                  {openShip && (
                    <div className="px-6 py-5 bg-gray-50 text-gray-600 text-sm space-y-2">
                      <p>• Delivery within 3–7 business days</p>
                      <p>• Cash on Delivery (COD) available nationwide</p>
                      <p>• Tracking number provided after dispatch</p>
                      {product.shipping > 0 ? (
                        <p>
                          • Shipping charges:{" "}
                          <strong>Rs. {product.shipping}</strong>
                        </p>
                      ) : (
                        <p className="text-green-600 font-bold">
                          Free Shipping
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {/* CARE INSTRUCTION */}
                <div className="border border-gray-200  overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setOpenCare(!openCare)}
                    className="w-full px-6 py-4 text-left font-bold text-gray-800 bg-white hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <span className="uppercase tracking-wider text-sm md:text-base">
                      CARE INSTRUCTION
                    </span>
                    <span
                      className={`text-xl transition-transform duration-300 ${
                        openCare ? "rotate-180" : ""
                      }`}
                    >
                      <FaAngleDown />
                    </span>
                  </button>
                  {openCare && (
                    <div className="px-6 py-5 bg-gray-50 text-gray-600 text-sm">
                      <ul className="list-disc list-inside space-y-2">
                        <li>Machine wash cold</li>
                        <li>Do not bleach</li>
                        <li>Tumble dry low</li>
                        <li>Iron on low heat if needed</li>
                        <li>Wash with similar colors</li>
                      </ul>
                    </div>
                  )}
                </div>
                {/* NOTE */}
              </div>
              {/* Share Buttons */}
              <div className="flex justify-center gap-8 mt-10 pb-8">
                <button className="flex items-center gap-2 text-gray-600 hover:text-[#1877f2] transition">
                  <FaFacebook size={22} />
                  <span className="text-sm font-medium">Share</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-[#1da1f2] transition">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.36 8.52 8.52 0 0 1-2.71.96 4.25 4.25 0 0 0-7.23 3.87 12.06 12.06 0 0 1-8.76-4.44 4.25 4.25 0 0 0 1.31 5.67c-.64-.02-1.24-.2-1.77-.49v.05a4.25 4.25 0 0 0 3.41 4.17c-.66.18-1.36.2-2.06.08a4.25 4.25 0 0 0 3.97 2.95 8.52 8.52 0 0 1-5.29 1.82c-.34 0-.68-.02-1.02-.06a12.04 12.04 0 0 0 6.52 1.91c7.82 0 12.1-6.48 12.1-12.1 0-.09-.02-.14-.03a8.62 8.62 0 0 0 2.11-2.19z" />
                  </svg>
                  <span className="text-sm font-medium">Share</span>
                </button>

                <button className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition">
                  <FaInstagram size={22} />
                  <span className="text-sm font-medium">Pin it</span>
                </button>
              </div>
            </div>
            {/* ==================== END OF ACCORDION SECTION ==================== */}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 font-semibold transition-colors duration-300 ${
                activeTab === "reviews"
                  ? "border-b-2 border-red-600 text-gray-700"
                  : "text-gray-600 hover:text-red-500"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* 🌟 Description Section */}

          {activeTab === "reviews" && (
            <div className="mt-4">
              {user && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-2">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    {/* ⭐ Star Rating */}
                    <div className="mb-3">
                      <label className="block text-gray-700 mb-1">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={
                              star <= (hoverRating || rating)
                                ? "#facc15"
                                : "none"
                            } // yellow fill
                            stroke="#f59e0b"
                            strokeWidth="2"
                            className="w-7 h-7 cursor-pointer transition-transform transform hover:scale-110"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.89a1 1 0 00-1.176 0l-3.976 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.078 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.518-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                      {rating > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Selected: {rating} star{rating > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>

                    {/* 📝 Review Textarea */}
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

                    {/* 🚀 Submit Button */}
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition duration-300"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}

              {/* 🧭 Reviews List */}
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
