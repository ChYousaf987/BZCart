import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const [isPop, setIsPop] = useState(false);
  const location = useLocation(); // detect route change

  // Detect back/forward navigation (POP) via popstate
  useEffect(() => {
    const handlePopState = () => {
      setIsPop(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Loader logic: Skip on back navigation, show brief loader on forward
  useEffect(() => {
    if (isPop) {
      // Instant transition on back/forward (no loader)
      setLoading(false);
      setIsPop(false); // Reset flag
    } else {
      // Brief loader on push/replace (e.g., clicking a link)
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isPop]);

  // Scroll restoration: Save on scroll, restore per pathname (preserves on back)
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scrollY-${location.pathname}`, window.pageYOffset.toString());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Restore saved scroll (or 0 for new visits)
    const savedScrollY = sessionStorage.getItem(`scrollY-${location.pathname}`);
    if (savedScrollY !== null) {
      // Use setTimeout to ensure DOM is ready after loader
      setTimeout(() => window.scrollTo(0, parseInt(savedScrollY)), 0);
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Conditionally show BottomNav */}
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