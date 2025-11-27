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
            <div
              className="px-4 py-6 md:py-10 md:px-12 
              flex flex-row items-center justify-between gap-4 md:gap-10"
            >
              {/* LEFT CONTENT */}
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
                  <button
                    className="bg-[#E68A42] hover:bg-[#d6762f] text-white 
                    px-5 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 
                    rounded-full text-sm sm:text-base md:text-lg 
                    font-semibold transition-all"
                  >
                    {large.buttonText}
                  </button>
                )}
              </div>

              {/* RIGHT IMAGE */}
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
        {/*     SMALL SIDE BANNERS          */}
        {/* =============================== */}

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-5">
          {side.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className=" rounded-2xl p-4 flex flex-row 
                  items-center justify-between gap-4 
                  shadow-sm hover:shadow-lg transition cursor-pointer"
              style={{ backgroundColor: item.bgColor || "#f3cd9f" }}
            >
              {/* TEXT */}
              <div className="">
                <h3
                  className="text-lg sm:text-xl md:text-3xl font-bold text-[#1A1A1A] leading-tight"
                  style={{ color: item.titleColor || "#1A1A1A" }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-xs sm:text-sm md:text-base mt-1 md:mt-4"
                  style={{ color: item.subtitleColor || "#555" }}
                >
                  {item.subtitle || "View Collection"}
                </p>
              </div>

              {/* IMAGE */}
              <img
                src={item.image}
                alt="banner"
                className="w-20 sm:w-24 md:w-32 -ml-2 object-contain drop-shadow-xl"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
