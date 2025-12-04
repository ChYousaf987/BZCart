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
    <div className="w-full flex justify-center py-4 px-2 font-sans">
      <div className="w-full max-w-7xl">
        {/* =============================== */}
        {/*     MAIN LARGE BANNER           */}
        {/* =============================== */}
        {large && (
          <a
            href={large.link}
            className="block rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={large.image}
              alt="banner"
              className="w-full h-auto object-cover"
            />
          </a>
        )}

        {/* =============================== */}
        {/*     4 MEDIUM BANNERS            */}
        {/* =============================== */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {mediumBanners.map((item, index) => {
            // Automatically pick style based on index or predefined order
            if (index === 0)
              return (
                <a key={index} href={item.link}>
                  <div className=" h-full rounded-xl shadow-sm flex items-start overflow-hidden">
                    {/* Background Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className=" inset-0 w-full h-full object-cover " // opacity here
                    />
                  </div>
                </a>
              );

            if (index === 1)
              return (
                <a key={index} href={item.link}>
                  <div className=" h-full rounded-xl shadow-sm flex items-start overflow-hidden">
                    {/* Background Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className=" inset-0 w-full h-full object-cover " // opacity here
                    />
                  </div>
                </a>
              );

            if (index === 2)
              return (
                <a key={index} href={item.link}>
                  <div className=" h-full rounded-xl shadow-sm flex items-start overflow-hidden">
                    {/* Background Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className=" inset-0 w-full h-full object-cover " // opacity here
                    />
                    {/* Content */}
                    {/* <div className="relative p-2 rounded-md text-green-400 text-center m-auto flex flex-col items-center justify-center">
                      <p
                        className=" text-xl md:text-5xl  font-bold"
                        style={{ color: item.titleColor || "#f3cd9f" }}
                      >
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p
                          className="text-sm mt-2 md:text-lg md:font-medium md:mt-5"
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
                    </div> */}
                  </div>
                </a>
              );

            if (index === 3)
              return (
                <a key={index} href={item.link}>
                  <div className=" h-full rounded-xl shadow-sm flex items-start overflow-hidden">
                    {/* Background Image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className=" inset-0 w-full h-full object-cover " // opacity here
                    />
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
