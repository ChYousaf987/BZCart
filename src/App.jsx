import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./compunent/Home";
import Cart from "./compunent/Cart";
import Auth from "./compunent/Auth";
import Loader from "./compunent/Loader";
import Payment from "./compunent/Payment";
import SingleProduct from "./compunent/SingleProduct";
import CategoryProducts from "./compunent/CategoryProducts";
import CategoriesPage from "./compunent/CategoriesPage";
import ContactPage from "./compunent/ContactPage";
import TrackOrder from "./compunent/TrackOrder";
import SingleDeal from "./compunent/SingleDeal";
import AllDeals from "./compunent/AllDeals";
import AllProducts from "./compunent/AllProducts";
import SearchPage from "./compunent/SearchPage";
import Cashout from "./compunent/Cashout";
import PaymentMethods from "./compunent/PaymentMethods";
import About from "./compunent/About";
import PrivacyPolicy from "./compunent/PrivacyPolicy";
import ReturnRefund from "./compunent/ReturnRefund";
import TermsAndCondition from "./compunent/TermsAndCondition";
import Checkout from "./compunent/Checkout";
import FAQS from "./compunent/FAQS";
import OrdersList from "./compunent/OrdersList";
import BottomNav from "./compunent/BottomNav";

const App = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [scrollPositions, setScrollPositions] = useState({});
  const scrollTimeoutRef = useRef(null);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );

  // Debounce scroll position updates
  const debounce = (func, wait) => {
    return (...args) => {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => func(...args), wait);
    };
  };

  // Save scroll position
  useEffect(() => {
    const saveScrollPosition = debounce(() => {
      setScrollPositions((prev) => ({
        ...prev,
        [location.pathname]: window.scrollY,
      }));
    }, 100);

    window.addEventListener("scroll", saveScrollPosition);
    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [location.pathname]);

  // Handle route change and restore scroll position
  useEffect(() => {
    // Only show loader if products are actually loading and no products are in store
    if (productsLoading && !products.length) {
      setLoading(true);
    } else {
      setLoading(false);
      // Restore scroll position, but force scroll to top for SingleProduct
      const scrollY = location.pathname.startsWith("/product/")
        ? 0
        : location.state?.scrollY || scrollPositions[location.pathname] || 0;
      window.scrollTo({ top: scrollY, behavior: "instant" });
    }
  }, [
    location.pathname,
    location.state,
    scrollPositions,
    productsLoading,
    products.length,
  ]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {![
        "/auth",
        "/checkout",
        "/Cashout",
        "/payment",
        "/paymentMethods",
        "/track-order",
        "/orders",
      ].some((path) => location.pathname.startsWith(path)) && <BottomNav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/Cashout" element={<Cashout />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/paymentMethods" element={<PaymentMethods />} />
        <Route path="/track-order/:id" element={<TrackOrder />} />
        <Route path="/orders" element={<OrdersList />} />
        <Route path="/deal/:id" element={<SingleDeal />} />
        <Route path="/product/:id" element={<SingleProduct />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/deals" element={<AllDeals />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/returnandrefund" element={<ReturnRefund />} />
        <Route path="/termsandconditions" element={<TermsAndCondition />} />
        <Route path="/faqs" element={<FAQS />} />
      </Routes>
    </>
  );
};

export default App;
