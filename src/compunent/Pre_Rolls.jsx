import React, { useState } from "react";
import Navbar from "./Navbar";
import ViewList from "./ViewList";
import EdiblesMenu from "./ViewList";
import Pre_RollsMenu from "./Pre_RollsMenu";

const Pre_Rolls = () => {
  return (
    <div className="relative min-h-screen">
      {/* Page Content */}
      <div className="relative z-20">
        <Navbar />

        <div className="pt-10 pb-20 px-4 sm:px-8 lg:px-16 w-full max-w-8xl mx-auto">
          {/* Page Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 drop-shadow-lg animate-fade-in-up">
              Explore Flower & Pre-Rolls
            </h1>
          </div>

          {/* Product List Container */}
          <div className=" rounded-2xl p-6 sm:p-10 ">
            <Pre_RollsMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pre_Rolls;
