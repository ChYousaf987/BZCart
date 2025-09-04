import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./compunent/Home";
import Cart from "./compunent/Cart";
import Auth from "./compunent/Auth";
import Loader from "./compunent/Loader";
import E_Liquids from "./compunent/E_Liquids";
import Watch from "./compunent/Watch";
import Payment from "./compunent/Payment";
import SingleProduct from "./compunent/SingleProduct";
import CategoryProducts from "./compunent/CategoryProducts";

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // detect route change

  useEffect(() => {
    // show loader for 700ms when route changes
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 6000);
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
      <Route path="/eliquids" element={<E_Liquids />} />
      <Route path="/watch" element={<Watch />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/category/:categoryId" element={<CategoryProducts />} />
    </Routes>
  );
};

export default App;
