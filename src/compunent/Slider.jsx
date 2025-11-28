import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSlides } from "../features/slides/slideSlice";
import Loader from "./Loader";
const HeroSection = () => {
  const dispatch = useDispatch();
  const { slides, loading, error } = useSelector((state) => state.slides);
  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);
  if (loading) return <Loader />;
  if (error)
    return <div className="text-center text-red-500 text-xl">{error}</div>;
  // 👉 Sort Slides: large → medium → small
  const sortedSlides = [...slides].sort((a, b) => {
    const order = { large: 1, medium: 2, small: 3 };
    return order[a.size] - order[b.size];
  });

  const large = sortedSlides.find((s) => s.size === "large");
  const mediumBanners = sortedSlides
    .filter((s) => s.size !== "large")
    .slice(0, 4); // 4 medium banners

  const larges = sortedSlides.find((s) => s.size === "large");
  const side = sortedSlides.filter((s) => s.size !== "large").slice(0, 2);

  return (
    <div className="w-full flex justify-center py-5 px-4 font-sans">
      <div className="w-full max-w-7xl">
        {/* =============================== */}
        {/*     MAIN LARGE BANNER           */}
        {/* =============================== */}
        {large && (
          <a
            href={large.link}
            className=" text-white rounded-3xl overflow-hidden shadow-lg block"
            style={{ backgroundColor: large.bgColor || "#28a745" }}
          >
            <div className="px-4 py-6 md:py-10 md:px-12 flex flex-row items-center justify-between gap-4 md:gap-10">
              <div className="flex-1 space-y-2 md:space-y-6">
                <h1
                  className="text-2xl sm:text-2xl md:text-6xl font-extrabold leading-tight"
                  style={{ color: large.titleColor || "#ffffff" }}
                >
                  {large.title || "PREMIUM"} <br />
                </h1>
                <p className="text-sm sm:text-base md:text-2xl font-medium">
                  {large.subtitle || "MEN'S"} <br />
                </p>
                {large.buttonText && (
                  <button className="bg-[#E68A42] hover:bg-[#d6762f] text-white px-5 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all">
                    {large.buttonText}
                  </button>
                )}
              </div>
              <div className="flex justify-center flex-1">
                <img
                  src={large.image}
                  alt="banner"
                  className="w-40 sm:w-40 md:w-72 lg:w-96 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </a>
        )}

        {/* =============================== */}
        {/*     4 MEDIUM BANNERS            */}
        {/* =============================== */}
        <div className="grid grid-cols-2 gap-4 mt-3">
          {mediumBanners.map((item, index) => {
            // Automatically pick style based on index or predefined order
            if (index === 0)
              return (
                <a key={index} href={item.link}>
                  <div
                    className="rounded-xl px-2 shadow-sm py-1"
                    style={{ backgroundColor: item.bgColor || "#f3cd9f" }}
                  >
                    <div className="flex justify-center items-center">
                      <div>
                        <p
                          className="text-xl font-bold"
                          style={{ color: item.titleColor || "#f3cd9f" }}
                        >
                          {item.title}
                        </p>
                      </div>
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-20 h-20  -mr-2"
                      />
                    </div>
                    <button className="text-sm text-gray-600 mt-1">
                      {item.subtitle || "View Collection"}
                    </button>
                  </div>
                </a>
              );

            if (index === 1)
              return (
                <a key={index} href={item.link}>
                  <div
                    className="relative rounded-xl shadow-sm h-full flex items-start overflow-hidden"
                    style={{ backgroundColor: item.bgColor || "#f3cd9f" }}
                  >
                    {/* Background Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-45" // opacity here
                    />
                    {/* Content */}
                    <div className="relative p-2 rounded-md text-green-400 text-center m-auto flex flex-col items-center justify-center">
                      <p
                        className="text-lg font-bold"
                        style={{ color: item.titleColor || "#f3cd9f" }}
                      >
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p
                          className="text-sm mt-2"
                          style={{ color: item.titleColor || "#f3cd9f" }}
                        >
                          {item.subtitle}
                        </p>
                      )}
                      {item.buttonText && (
                        <button className="text-sm mt-2">
                          {item.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </a>
              );

            if (index === 2)
              return (
                <a key={index} href={item.link}>
                  <div
                    className=" rounded-xl px-2 shadow-sm py-1 h-full"
                    style={{ backgroundColor: item.bgColor || "#f3cd9f" }}
                  >
                    <div className="flex justify-center items-center">
                      <div>
                        <p
                          className="text-xl font-bold"
                          style={{ color: item.titleColor || "#f3d9f" }}
                        >
                          {item.title}
                        </p>
                      </div>
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-20 h-20 -mr-2 "
                      />
                    </div>
                    <button className="text-sm text-gray-600 mt-1">
                      {item.subtitle || "View Collection"}
                    </button>
                  </div>
                </a>
              );

            if (index === 3)
              return (
                <a key={index} href={item.link}>
                  <div
                    className=" text-white rounded-xl py-1 px-2 shadow-sm"
                    style={{ backgroundColor: item.bgColor || "#f3cd9f" }}
                  >
                    <div className="flex">
                      <div>
                        <p className="text-orange-400 font-bold mt-2 text-sm">
                          FLASH SALE
                        </p>
                        <p
                          className=" font-bold text-lg"
                          style={{ color: item.titleColor || "#f3cd9f" }}
                        >
                          {item.title}
                        </p>
                      </div>
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="w-16 h-20 mt- mx-auto"
                      />
                    </div>
                    <p
                      className="text-sm  mt-1"
                      style={{ color: item.titleColor || "#f3cd9f" }}
                    >
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      {item.bottomText}
                    </p>
                  </div>
                </a>
              );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
