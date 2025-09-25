import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="relative text-center py-12 md:py-20 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
        <h1 className="relative text-5xl md:text-6xl font-extrabold tracking-tight">
          About Us
        </h1>
        <p className="relative mt-4 text-lg md:text-xl opacity-90">
          Learn more about who we are, what we do, and how we can help you grow.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto py-20 px-6">
        <div className="relative bg-white shadow-2xl rounded-3xl p-12 space-y-12">
          {/* About Content */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We are not liable for courier delays, damages during transit, or factors beyond our reasonable
              control.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our responsibility ends once the product has been dispatched to the courier company.
            </p>
          </div>

          {/* Modifications */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Modifications</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to update, modify, or change these Terms & Conditions anytime without prior
              notice.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Continued use of our services after updates will be considered acceptance of the new Terms.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;