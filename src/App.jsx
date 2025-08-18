import React from "react";
import Navbar from "./compunent/Navbar";
import Slider from "./compunent/Slider";
import ProductDeals from "./compunent/ProductDeals";
import TopCategories from "./compunent/TopCategories";
import Essential from "./compunent/Essential";
import PromoBanner from "./compunent/PromoBanner";
import Footer from "./compunent/Footer";


const App = () => {
  return (
    <>
      <div className="bg-[#f2efeb] w-[100%]">
        <Navbar />
        <Slider />
        <ProductDeals />
        <TopCategories />
        <Essential />
        <PromoBanner />
        <Footer />
      </div>
    </>
  );
};

export default App;
