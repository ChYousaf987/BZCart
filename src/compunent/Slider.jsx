import React, { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const Slider = () => {
  // Dummy static slides (frontend only)
  const slides = [
    {
      id: 1,
      title: "Watches Collection",
      subtitle: "Up to 50% off on selected items",
      buttonText: "Shop Now",
      link: "/shop/summer",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      background: "/images/bg1.jpg",
    },
    {
      id: 2,
      title: "Woman Purse",
      subtitle: "Trendy fashion just for you",
      buttonText: "Discover",
      link: "/shop/new",
      image:
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      background: "/images/bg3.jpg",
    },
    {
      id: 3,
      title: "Men Collection",
      subtitle: "Latest gadgets at unbeatable prices",
      buttonText: "Explore Deals",
      link: "/shop/electronics",
      image:
        "https://static.vecteezy.com/system/resources/previews/053/366/782/non_2x/collection-of-full-body-a-business-suit-mock-up-isolated-on-a-transparency-background-png.png",
      background: "/images/bg2.jpg",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("next");

  // Inject CSS animations dynamically
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .animate-slide-in-right {
        animation: slideInRight 0.5s ease-out forwards;
      }
      .animate-slide-in-left {
        animation: slideInLeft 0.5s ease-out forwards;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const handleSlideChange = (newIndex) => {
    setDirection(newIndex > current ? "next" : "prev");
    setCurrent(newIndex);
  };

  const animationClass =
    direction === "next" ? "animate-slide-in-right" : "animate-slide-in-left";

  return (
    <div className="relative md:mt-2 bg-dark md:w-[90%] md:max-w-7xl mx-auto px-4 py-6 z-10 shadow-2xl md:rounded-xl overflow-hidden font-montserrat">
      {/* Background Image */}
      {slides[current].background && (
        <img
          src={slides[current].background}
          alt="Slide background"
          className={`absolute inset-0 w-full h-full object-cover z-0 ${animationClass}`}
        />
      )}

      {/* Overlay */}
      {slides[current].background && (
        <div className="absolute inset-0 bg-black/30 z-5"></div>
      )}

      {/* Decorative Circles */}
      <div className="absolute -top-32 right-32 w-80 h-80 bg-gray-200/5 rounded-full z-10"></div>
      <div className="absolute -top-40 right-24 w-96 h-96 rounded-full border-2 border-gray-200/5 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 rounded-xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div
            key={current}
            className="flex-1 flex flex-col sm:flex-row md:px-10 justify-between items-center gap-4 sm:gap-8"
          >
            {/* Image */}
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className={`order-1 sm:order-2 h-40 sm:h-56 lg:h-72 object-contain ${animationClass} z-20`}
            />

            {/* Text */}
            <div
              className={`order-2 sm:order-1 text-white max-w-md text-center px-6 sm:text-left ${animationClass} z-20`}
            >
              <p className="text-sm sm:text-lg">{slides[current].subtitle}</p>
              <h2 className="text-2xl sm:text-4xl font-bold py-1 mb-6 sm:py-2">
                {slides[current].title}
              </h2>
              <Link
                to={slides[current].link}
                className="bg-primary text-white px-4 py-2 rounded-full text-sm sm:text-base hover:bg-primary/90 transition duration-300 z-20"
              >
                {slides[current].buttonText}
              </Link>
            </div>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={() =>
            handleSlideChange(current === 0 ? slides.length - 1 : current - 1)
          }
          aria-label="Previous slide"
          className="absolute z-30 left-2 sm:left-2 md:-left-2 top-1/2 transform -translate-y-1/2 bg-white/90 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
        >
          <IoIosArrowBack className="text-primary text-xl" />
        </button>
        <button
          onClick={() =>
            handleSlideChange(current === slides.length - 1 ? 0 : current + 1)
          }
          aria-label="Next slide"
          className="absolute z-30 right-2 sm:right-2 md:-right-2 top-1/2 transform -translate-y-1/2 bg-white/90 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
        >
          <IoIosArrowForward className="text-primary text-xl" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2 z-30 relative">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 w-2 sm:w-3 sm:h-2 rounded-full ${
              index === current ? "bg-primary w-6 sm:w-6" : "bg-gray-400"
            } transition-all duration-300 cursor-pointer`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
