import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShippingFast, FaHeadset, FaShieldAlt, FaUndo } from "react-icons/fa";
import { fetchSlides } from "../features/slides/slideSlice";
import Loader from "./Loader";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { slides, loading, error } = useSelector((state) => state.slides);

  useEffect(() => {
    dispatch(fetchSlides()).then(() => {
      console.log("Fetched slides:", slides); // Debug: Log slides after fetch
    });
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl">{error}</div>;
  }

  // Sort slides to ensure large banner comes first, then medium, then small
  const sortedSlides = [...slides].sort((a, b) => {
    if (a.size === "large") return -1;
    if (b.size === "large") return 1;
    if (a.size === "medium" && b.size === "small") return -1;
    if (b.size === "medium" && a.size === "small") return 1;
    return 0;
  });

  // Extract large, medium, and small slides
  const largeSlide = sortedSlides.find((slide) => slide.size === "large");
  const mediumSlides = sortedSlides
    .filter((slide) => slide.size === "medium")
    .slice(0, 2); // Up to 2 medium slides
  const smallSlides = sortedSlides
    .filter((slide) => slide.size === "small")
    .slice(0, 2); // Up to 2 small slides

  // Combine medium and small slides, limiting to exactly 3 banners
  const sideBanners = [...mediumSlides, ...smallSlides].slice(0, 3);

  // Debug: Log slides to verify inclusion
  console.log("Large slide:", largeSlide);
  console.log("Medium slides:", mediumSlides);
  console.log("Small slides:", smallSlides);
  console.log("Side banners:", sideBanners);

  return (
    <div className="font-sans bg-white">
      {/* 🔹 Hero & Promo Banners */}
      <div className="grid grid-cols-1 w-[95%] mx-auto md:grid-cols-[2fr_1fr] gap-6 px-2 md:px-0 pb-10 mt-3">
        {/* Left: Main Hero (Large Banner) */}
        {largeSlide && (
          <a
            href={largeSlide.link}
            className="bg-primary rounded-2xl flex items-center p-8 text-white bg-cover bg-center w-[800px] h-[560px]"
            style={{
              backgroundImage: largeSlide.image
                ? `url(${largeSlide.image})`
                : "url('/image.jpg')", // Fallback to default image
              backgroundColor: largeSlide.bgColor || "#28a745", // Fallback color
              backgroundRepeat: "no-repeat", // Prevent image repeating
              backgroundSize: "cover", // Ensure image covers container
              backgroundPosition: "center", // Center the image
            }}
          >
            <div className="max-w-md space-y-4">
              {largeSlide.title && (
                <h2
                  className="text-3xl md:text-5xl font-bold leading-snug"
                  style={{ color: largeSlide.titleColor || "#ffffff" }}
                >
                  {largeSlide.title}
                </h2>
              )}
              {largeSlide.subtitle && (
                <h2
                  className="text-xl font-bold leading-snug"
                  style={{ color: largeSlide.subtitleColor || "#ffffff" }}
                >
                  {largeSlide.subtitle}
                </h2>
              )}
              {largeSlide.subtitle?.includes("shipping") && (
                <p
                  className="text-sm text-gray-100"
                  style={{ color: largeSlide.subtitleColor || "#ffffff" }}
                >
                  {largeSlide.subtitle}
                </p>
              )}
              {largeSlide.buttonText && (
                <a
                  href={largeSlide.link || "/products"}
                  className="mt-4 inline-block px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
                  style={{
                    backgroundColor: largeSlide.buttonBgColor || "#ffffff",
                    color: largeSlide.buttonTextColor || "#28a745",
                  }}
                >
                  {largeSlide.buttonText}
                </a>
              )}
            </div>
          </a>
        )}

        {/* Right: Promo Boxes (Medium and Small Banners) */}
        <div className="space-y-6 flex flex-col">
          {sideBanners.length > 0 ? (
            sideBanners.map((slide, index) => (
              <a
                href={slide.link}
                key={index}
                className="rounded-lg p-6 relative flex flex-col justify-center bg-contain bg-center w-full max-w-[407px] h-[170px] bg-gray-100"
                style={{
                  backgroundImage: slide.image
                    ? `url(${slide.image})`
                    : index === 0
                    ? "url('/image-2.jpg')"
                    : index === 1
                    ? "url('/image-1.jpg')"
                    : "url('/image-3.jpg')", // Fallback to default images
                  backgroundColor: slide.bgColor || "#f4f4f4", // Consistent fallback color
                  backgroundRepeat: "no-repeat", // Prevent image repeating
                  aspectRatio: "480/280", // Maintain proportions
                }}
              >
                <div className="relative z-10 text-start">
                  {slide.title && (
                    <h3
                      className="text-sm uppercase"
                      style={{ color: slide.titleColor || "#000000" }}
                    >
                      {slide.title}
                    </h3>
                  )}
                  {slide.subtitle && (
                    <p
                      className="text-xl font-bold"
                      style={{ color: slide.subtitleColor || "#000000" }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  {!slide.subtitle && (
                    <p
                      className="text-xl font-bold hidden"
                      style={{ color: slide.subtitleColor || "#000000" }}
                    >
                      Special Offer
                    </p>
                  )}
                  <div className="flex-1" />
                  {slide.buttonText && (
                    <a
                      href={slide.link || "/products"}
                      className="mt-3 px-4 py-1 rounded-full font-semibold text-sm hover:bg-gray-100"
                      style={{
                        backgroundColor: slide.buttonBgColor || "transparent",
                        color: slide.buttonTextColor || "#28a745",
                      }}
                    >
                      {slide.buttonText} →
                    </a>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="text-center text-gray-500 w-full max-w-[480px] h-[840px] flex items-center justify-center">
              No side banners available
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2 md:px-0 w-[95%] mx-auto pb-10">
        {/* Free Shipping */}
        <div className="flex items-center gap-3">
          <FaShippingFast className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Free Shipping</h4>
            <p className="text-xs text-gray-500">
              Free shipping on all your order
            </p>
          </div>
        </div>

        {/* Customer Support */}
        <div className="flex items-center gap-3">
          <FaHeadset className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Customer Support 24/7</h4>
            <p className="text-xs text-gray-500">Instant access to Support</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">100% Secure Payment</h4>
            <p className="text-xs text-gray-500">
              We ensure your money is safe
            </p>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="flex items-center gap-3">
          <FaUndo className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Money-Back Guarantee</h4>
            <p className="text-xs text-gray-500">
              30 Days Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;