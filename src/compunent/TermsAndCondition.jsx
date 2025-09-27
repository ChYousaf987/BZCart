import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="relative font-daraz text-center py-16 md:py-24 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/30 opacity-50"></div>
        <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight animate-slideInLeft">
          Terms & Conditions
        </h1>
        <p className="relative mt-4 text-lg md:text-2xl font-medium opacity-90 animate-slideInRight">
          One Store, Endless Possibilities
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="relative grid gap-8">
          {/* Dispatch & Liability */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">Dispatch & Liability</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              We are not liable for courier delays, damages during transit, or factors beyond our reasonable control.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our responsibility ends once the product has been dispatched to the courier company.
            </p>
          </div>

          {/* Modifications */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">Modifications</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              We reserve the right to update, modify, or change these Terms & Conditions anytime without prior notice.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Continued use of our services after updates will be considered acceptance of the new Terms.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TermsAndConditions;