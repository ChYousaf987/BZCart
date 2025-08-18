import React from "react";
import Navbar from "./compunent/Navbar";
import Slider from "./compunent/Slider";
import ProductDeals from "./compunent/ProductDeals";
import TopCategories from "./compunent/TopCategories";
import Essential from "./compunent/Essential";
import PromoBanner from "./compunent/PromoBanner";
import Footer from "./compunent/Footer";
import TopBrands from "./compunent/TopBrands";


const App = () => {
  return (
    <>
      <div className="bg-[#f2efeb] w-[100%] font-serif">
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

export default App;
