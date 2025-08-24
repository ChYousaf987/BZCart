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
      background: "",
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
    <div className="relative md:mt-2 rounded-lg md:w-[95%] h-[70vh] bg-cover mx-auto px-2 py-6 shadow-2xl md:rounded-xl overflow-hidden font-montserrat">
      <img
        src="https://www.bzcart.store/cdn/shop/files/Picsart_25-07-30_18-44-30-234.jpg?v=1753884532"
        className="rounded-lg "
        width="100%"
        alt=""
      />
    </div>
  );
};

export default CustomSlider;
