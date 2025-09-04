import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShippingFast, FaHeadset, FaShieldAlt, FaUndo } from "react-icons/fa";
import { fetchSlides } from "../features/slides/slideSlice";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { slides, loading, error } = useSelector((state) => state.slides);

  useEffect(() => {
    dispatch(fetchSlides()).then(() => {
      console.log("Fetched slides:", slides); // Debug: Log slides after fetch
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl">{error}</div>;
  }

  // Sort slides to ensure large banner comes first, then medium
  const sortedSlides = [...slides].sort((a, b) => {
    if (a.size === "large") return -1;
    if (b.size === "large") return 1;
    return 0;
  });

  // Extract large and medium slides
  const largeSlide = sortedSlides.find((slide) => slide.size === "large");
  const mediumSlides = sortedSlides
    .filter((slide) => slide.size === "medium")
    .slice(0, 2);

  console.log("Large Slide:", largeSlide); // Debug: Log large slide
  console.log("Medium Slides:", mediumSlides); // Debug: Log medium slides

  return (
    <div className="font-sans bg-white">
      {/* 🔹 Hero & Promo Banners */}
      <div className="grid grid-cols-1 w-[95%] mx-auto md:grid-cols-3 gap-6 px-2 md:px-0 pb-10 mt-3">
        {/* Left: Main Hero (Large Banner) */}
        {largeSlide && (
          <div
            className="md:col-span-2 bg-primary rounded-2xl flex items-center p-8 text-white bg-cover bg-center min-h-[400px] md:min-h-[500px]"
            style={{
              backgroundImage: largeSlide.image
                ? `url(${largeSlide.image})`
                : "url('/image.jpg')", // Fallback to default image
              backgroundColor: largeSlide.bgColor || "#28a745", // Fallback color
            }}
          >
            <div className="max-w-md space-y-4">
              {largeSlide.title && (
                <h2 className="text-3xl md:text-5xl font-bold leading-snug">
                  {largeSlide.title}
                </h2>
              )}
              {largeSlide.title && (
                <h2 className="text-xl  font-bold leading-snug">
                  {largeSlide.subtitle}
                </h2>
              )}
              
              {largeSlide.subtitle?.includes("shipping") && (
                <p className="text-sm text-gray-100">{largeSlide.subtitle}</p>
              )}
              {largeSlide.buttonText && (
                <a
                  href={largeSlide.link || "/products"}
                  className="mt-4 inline-block bg-white text-primary px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
                >
                  {largeSlide.buttonText}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Right: Promo Boxes (Medium Banners) */}
        <div className="space-y-6 flex flex-col">
          {mediumSlides.map((slide, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 relative flex-1 flex flex-col justify-center min-h-[200px] md:min-h-[240px] bg-cover bg-right ${
                index === 1 ? "bg-primary text-white" : "bg-gray-100"
              }`}
              style={{
                backgroundImage: slide.image
                  ? `url(${slide.image})`
                  : index === 0
                  ? "url('/image-2.jpg')"
                  : "url('/image-1.jpg')", // Fallback to default images
                backgroundColor:
                  slide.bgColor || (index === 0 ? "#f4f4f4" : "#28a745"), // Fallback colors
              }}
            >
              {index === 1 && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl"></div>
              )}
              <div
                className={`relative z-10 ${
                  index === 1 ? "text-center" : "text-start"
                }`}
              >
                {slide.title && (
                  <h3 className="text-sm uppercase">{slide.title}</h3>
                )}
                {index === 0 ? (
                  <>
                    {slide.subtitle && (
                      <p className="text-3xl font-bold text-primary">
                        {slide.subtitle}
                      </p>
                    )}
                    {!slide.subtitle && (
                      <p className="text-3xl font-bold text-primary hidden">
                        75% OFF
                      </p>
                    )}
                    
                    {slide.buttonText && (
                      <a
                        href={slide.link || "/products"}
                        className="mt-3 block text-primary font-semibold text-sm hover:underline"
                      >
                        {slide.buttonText} →
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    {slide.subtitle && (
                      <p className="text-xl font-bold">{slide.subtitle}</p>
                    )}
                    {!slide.subtitle && (
                      <p className="text-xl font-bold hidden">
                        Special Products
                      </p>
                    )}
                    {slide.buttonText && (
                      <a
                        href={slide.link || "/products"}
                        className="mt-3 text-primary bg-white px-4 py-1 rounded-full font-semibold text-sm hover:bg-gray-100"
                      >
                        {slide.buttonText} →
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
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
