import React from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import ProductDeals from "./ProductDeals";
import TopCategories from "./TopCategories";
import TopBrands from "./TopBrands";
import Essential from "./Essential";
import PromoBanner from "./PromoBanner";
import Footer from "./Footer";
import LazyWrapper from "./LazyWrapper";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p className="text-center text-red-500">
          Something went wrong. Please try again.
        </p>
      );
    }
    return this.props.children;
  }
}

const Home = () => {
  return (
    <div className="relative font-daraz bg-[#]">
      <Navbar />
      <Slider />

      <LazyWrapper>
        <TopCategories />
      </LazyWrapper>

      <LazyWrapper>
        <Essential />
      </LazyWrapper>

        <LazyWrapper>
          <ProductDeals />
        </LazyWrapper>

      <LazyWrapper>
        <TopBrands />
      </LazyWrapper>

      <PromoBanner />
      <Footer />
    </div>
  );
};

export default Home;
