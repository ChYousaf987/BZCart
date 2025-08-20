import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Watches Collection",
      subtitle: "Up to 50% off on selected items",
      buttonText: "Shop Now",
      link: "/shop/summer",
      image:
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      background:
        "https://img.freepik.com/premium-photo/realstic-dark-rough-grunge-paper-overlay-texturee_435219-1929.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      id: 2,
      title: "Woman Purse",
      subtitle: "Trendy fashion just for you",
      buttonText: "Discover",
      link: "/shop/new",
      image:
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      background:
        "https://t4.ftcdn.net/jpg/13/65/88/15/360_F_1365881525_OK6k5Z4CAnu3cGMtkmZxIFuO39nlO2nW.jpg",
    },
    {
      id: 3,
      title: "Men Collection",
      subtitle: "Latest gadgets at unbeatable prices",
      buttonText: "Explore Deals",
      link: "/shop/electronics",
      image:
        "https://static.vecteezy.com/system/resources/previews/053/366/782/non_2x/collection-of-full-body-a-business-suit-mock-up-isolated-on-a-transparency-background-png.png",
      background:
        "https://t4.ftcdn.net/jpg/03/92/25/09/360_F_392250914_2Od8jNRBPgpMu8W29vCh4hiu5EUXbgGU.jpg",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // 🔹 enable autoplay
    autoplaySpeed: 1500, // 4 seconds
    arrows: false, // show next/prev arrows
    pauseOnHover: false, // 🔹 stop auto when hover
  };

  return (
    <div className="relative md:mt-2 bg-dark md:w-[90%] md:max-w-7xl mx-auto px-2 py-6 shadow-2xl md:rounded-xl overflow-hidden font-montserrat">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            {/* Background */}
            {slide.background && (
              <img
                src={slide.background}
                alt="Slide background"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 z-0"></div>

            {/* Content */}
            <div className="relative flex flex-col-reverse sm:flex-row items-center justify-between z-10 px-9 md:pl-24 py-10 gap-6">
              {/* Image */}
              <div className="text-white max-w-md text-center sm:text-left">
                <p className="text-sm sm:text-lg">{slide.subtitle}</p>
                <h2 className="text-2xl sm:text-4xl font-bold py-2 mb-6">
                  {slide.title}
                </h2>
                <Link
                  to={slide.link}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm sm:text-base hover:bg-primary/90 transition duration-300"
                >
                  {slide.buttonText}
                </Link>
              </div>
              <img
                src={slide.image}
                alt={slide.title}
                className="h-40 sm:h-56 lg:h-72 object-contain"
              />

              {/* Text */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CustomSlider;
