import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="relative font-daraz text-center py-16 md:py-24 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/30 opacity-50"></div>
        <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight animate-slideInLeft">
          About Us
        </h1>
        <p className="relative mt-4 text-lg md:text-2xl font-medium opacity-90 animate-slideInRight">
          ONE STORE, ENDLESS POSSIBILITIES
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="relative grid gap-8">
          {/* Who We Are */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              BZCART.STORE, based in Dinga, District Gujrat, Tehsil Kharian, Pakistan, is the nation’s first professional multi-niche e-commerce platform. We are driven by a clear mission — to make online shopping in Pakistan reliable, modern, and customer-focused. More than just a marketplace, we are building a trusted brand created for our people, by our people.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">What We Offer</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Our store covers a wide range of categories designed to meet your everyday needs:
            </p>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">Men’s & Women’s Watches</li>
              <li className="hover:text-primary transition-colors">Skincare & Grooming</li>
              <li className="hover:text-primary transition-colors">Men’s & Women’s Fashion</li>
              <li className="hover:text-primary transition-colors">Babies & Toddlers’ Essentials</li>
              <li className="hover:text-primary transition-colors">Home & Kitchen Products</li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-lg mt-6">
              And this is only the beginning. With time, BZCART.STORE will continue expanding to bring even more variety, quality, and value — all in one trusted place.
            </p>
          </div>

          {/* Why Choose BZCART.STORE */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">Why Choose BZCART.STORE?</h2>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">A professional online shopping experience built with international standards.</li>
              <li className="hover:text-primary transition-colors">A customer-first approach, where satisfaction and quality are never compromised.</li>
              <li className="hover:text-primary transition-colors">Products that cover every age, every lifestyle, and every household need.</li>
              <li className="hover:text-primary transition-colors">A proud Pakistani brand, designed to serve and grow with the people of Pakistan.</li>
            </ul>
          </div>

          {/* Our Vision */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              We envision a future where Pakistan has its very own national-level e-commerce brand. A platform that brings trust, convenience, and endless possibilities into the lives of every Pakistani household. With dedication, honesty, and innovation, BZCART.STORE is on a journey to become that name.
            </p>
          </div>

          {/* A Note to Our Customers */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">A Note to Our Customers</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              At BZCART.STORE, our commitment goes beyond selling products. We are here to create trust, build relationships, and deliver convenience with every order. Together, with your support, In Sha Allah, we will continue to grow and shape a future where online shopping is simple, professional, and proudly Pakistani.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;