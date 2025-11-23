import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaShippingFast, FaHeadset, FaShieldAlt, FaUndo } from "react-icons/fa";
import { fetchSlides } from "../features/slides/slideSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HeroSection = () => {
  const dispatch = useDispatch();
  const { slides, loading, error } = useSelector((state) => state.slides);

  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);

  // 🔹 SHOW SKELETON WHEN LOADING
  if (loading) {
    return (
      <div className="font-sans bg-white">
        {/* Skeleton Layout Same Grid */}
        <div className="grid grid-cols-1 w-[95%] mx-auto md:grid-cols-[2fr_1fr] gap-2 md:gap-6 pb-8 mt-3">
          {/* Large Banner Skeleton */}
          <div className="rounded-2xl overflow-hidden">
            <Skeleton height={500} className="md:h-[650px] rounded-2xl" />
          </div>

          {/* Side Banners Skeleton */}
          <div className="space-y-3 md:space-y-6 flex flex-col">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                height={165}
                className="md:min-h-[200px] rounded-2xl"
              />
            ))}
          </div>
        </div>

        {/* Features Row Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2 md:px-0 w-[95%] mx-auto pb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton width={50} height={50} circle />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🔹 Error message
  if (error) {
    return <div className="text-center text-red-500 text-xl">{error}</div>;
  }

  // 🔹 Normal SLIDES Rendering
  const sortedSlides = [...slides].sort((a, b) => {
    if (a.size === "large") return -1;
    if (b.size === "large") return 1;
    if (a.size === "medium" && b.size === "small") return -1;
    if (b.size === "medium" && a.size === "small") return 1;
    return 0;
  });

  const largeSlide = sortedSlides.find((slide) => slide.size === "large");
  const mediumSlides = sortedSlides
    .filter((slide) => slide.size === "medium")
    .slice(0, 2);
  const smallSlides = sortedSlides
    .filter((slide) => slide.size === "small")
    .slice(0, 2);
  const sideBanners = [...mediumSlides, ...smallSlides].slice(0, 3);

  return (
    <div className="font-sans bg-white">
      {/* Hero Banners */}
      <div className="grid grid-cols-1 w-[95%] mx-auto md:grid-cols-[2fr_1fr] gap-2 md:gap-6 pb-8 mt-3">
        {/* LEFT – Large Banner */}
        {largeSlide && (
          <a
            href={largeSlide.link}
            className="bg-primary rounded-2xl flex items-center p-8 text-white bg-cover bg-center h-[500px] md:h-[650px]"
            style={{
              backgroundImage: `url(${largeSlide.image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-md space-y-4">
              <h2
                className="text-3xl md:text-5xl font-bold leading-snug"
                style={{ color: largeSlide.titleColor }}
              >
                {largeSlide.title}
              </h2>
              <p
                className="text-xl font-bold"
                style={{ color: largeSlide.subtitleColor }}
              >
                {largeSlide.subtitle}
              </p>
            </div>
          </a>
        )}

        {/* RIGHT – Side Banners */}
        <div className="space-y-3 md:space-y-6 flex flex-col">
          {sideBanners.map((slide, index) => (
            <a
              key={index}
              href={slide.link}
              className="rounded-2xl relative flex flex-col justify-center bg-cover bg-center w-full h-[165px] md:min-h-[200px]"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
              }}
            >
              <div className="relative z-10 p-4">
                <h3 className="text-sm uppercase">{slide.title}</h3>
                <p className="text-xl font-bold">{slide.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2 md:px-0 w-[95%] mx-auto pb-10">
        <div className="flex items-center gap-3">
          <FaShippingFast className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Free Shipping</h4>
            <p className="text-xs text-gray-500">
              Free shipping on all your order
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FaHeadset className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">Customer Support 24/7</h4>
            <p className="text-xs text-gray-500">Instant access to Support</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FaShieldAlt className="text-primary text-3xl" />
          <div>
            <h4 className="font-semibold">100% Secure Payment</h4>
            <p className="text-xs text-gray-500">
              We ensure your money is safe
            </p>
          </div>
        </div>

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
