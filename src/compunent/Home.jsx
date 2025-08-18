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
     

      <div className="relative ">
        <Navbar />
        <Slider />
        <ProductDeals />
        <TopCategories />
        <TopBrands />
        <Essential />
        <PromoBanner />
        <Footer />
      </div>
    </>
  );
};

export default Home;
