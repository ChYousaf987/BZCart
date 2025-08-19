import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./compunent/Home";
import Cart from "./compunent/Cart";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      {/* Add more routes here */}
    </Routes>
  );
};

export default App;
