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
          ONE STORE, ENDLESS POSSIBILITIES
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto py-20 px-6">
        <div className="relative bg-white shadow-2xl rounded-3xl p-12 space-y-12">
          {/* Who We Are */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              BZCART.STORE, based in Dinga, District Gujrat, Tehsil Kharian, Pakistan, is the nation’s first professional multi-niche e-commerce platform. We are driven by a clear mission — to make online shopping in Pakistan reliable, modern, and customer-focused. More than just a marketplace, we are building a trusted brand created for our people, by our people.
            </p>
          </div>

          {/* What We Offer */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">What We Offer</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our store covers a wide range of categories designed to meet your everyday needs:
            </p>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside">
              <li>Men’s & Women’s Watches</li>
              <li>Skincare & Grooming</li>
              <li>Men’s & Women’s Fashion</li>
              <li>Babies & Toddlers’ Essentials</li>
              <li>Home & Kitchen Products</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              And this is only the beginning. With time, BZCART.STORE will continue expanding to bring even more variety, quality, and value — all in one trusted place.
            </p>
          </div>

          {/* Why Choose BZCART.STORE */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Why Choose BZCART.STORE?</h2>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside">
              <li>A professional online shopping experience built with international standards.</li>
              <li>A customer-first approach, where satisfaction and quality are never compromised.</li>
              <li>Products that cover every age, every lifestyle, and every household need.</li>
              <li>A proud Pakistani brand, designed to serve and grow with the people of Pakistan.</li>
            </ul>
          </div>

          {/* Our Vision */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We envision a future where Pakistan has its very own national-level e-commerce brand. A platform that brings trust, convenience, and endless possibilities into the lives of every Pakistani household. With dedication, honesty, and innovation, BZCART.STORE is on a journey to become that name.
            </p>
          </div>

          {/* A Note to Our Customers */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">A Note to Our Customers</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
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