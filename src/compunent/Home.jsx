import React from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import ProductDeals from "./ProductDeals";
import TopCategories from "./TopCategories";
import TopBrands from "./TopBrands";
import Essential from "./Essential";
import PromoBanner from "./PromoBanner";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <div className="relative bg-[#FCF7F8]">
        <Navbar />
        <Slider />
        <ProductDeals />
        <TopCategories />
        <Essential />
        <TopBrands />
        <PromoBanner />
        <Footer />
      </div>
    </>
  );
};

export default Home;
