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

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // detect route change

  useEffect(() => {
    // show loader for 700ms when route changes
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]); // run effect every time the path changes

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/paymentMethod" element={<Cashout />} />
      <Route path="/Checkout" element={<Checkout />} />
      <Route path="/paymentMethods" element={<PaymentMethods />} />
      <Route path="/track-order/:id" element={<TrackOrder />} />
      <Route path="/deal/:id" element={<SingleDeal />} /> {/* New route */}
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/category/:categoryId" element={<CategoryProducts />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/deals" element={<AllDeals />} /> {/* New route */}
      <Route path="/Contact" element={<ContactPage />} />
      <Route path="/products" element={<AllProducts />} /> {/* New route */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      <Route path="/returnandrefund" element={<ReturnRefund />} />
      <Route path="/termsandconditions" element={<TermsAndCondition />} />
    </Routes>
  );
};

export default App;
