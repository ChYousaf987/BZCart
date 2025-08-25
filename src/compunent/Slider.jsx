import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomSlider = () => {
  const slides = [
    {
      id: 1,
      image:
        "https://www.bzcart.store/cdn/shop/files/Picsart_25-08-08_14-04-01-708.jpg?v=1754649898",
    },
    {
      id: 2,
      image:
        "https://www.bzcart.store/cdn/shop/files/Picsart_25-08-07_13-18-41-350.jpg?v=1754557538",
    },
    {
      id: 3,
      image:
        "https://www.bzcart.store/cdn/shop/files/Picsart_25-07-30_18-44-30-234.jpg?v=1753884532",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // 🔹 enable autoplay
    autoplaySpeed: 2500, // 4 seconds
    arrows: false, // show next/prev arrows
    pauseOnHover: false, // 🔹 stop auto when hover
  };

  return (
    <div className="relative md:w-[100%] mx-auto md:p-6 md:pb-10 bg-[#FCF7F8] ">
      <div className="md:w-[98%] md:h-[70vh] mx-auto px-2 md:px-0 md:rounded-3xl overflow-hidden">
        <Slider {...settings}>
          {slides.map((slide) => (
            <div key={slide.id} className="relative ">
              {/* Background */}
              {slide.image && (
                <img
                  src={slide.image}
                  alt="Slide background"
                  className=" inset-0 object-cover md:w-full h-[30vh] md:h-full"
                />
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CustomSlider;
