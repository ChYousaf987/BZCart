import React from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import ProductDeals from "./ProductDeals";
import TopCategories from "./TopCategories";
import TopBrands from "./TopBrands";
import Essential from "./Essential";
import PromoBanner from "./PromoBanner";
import Footer from "./Footer";

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
    <>
      <div className="relative font-daraz bg-[#]">
        <Navbar />
        <Slider />
        <TopCategories />
        <Essential />
        <ErrorBoundary>
          <ProductDeals />
        </ErrorBoundary>
        <TopBrands />
        <PromoBanner />
        <Footer />
      </div>
    </>
  );
};

export default Home;
