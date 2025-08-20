import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./compunent/Home";
import Cart from "./compunent/Cart";
import Auth from "./compunent/Auth";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/cart" element={<Cart />} />
      {/* Add more routes here */}
    </Routes>
  );
};

export default App;
