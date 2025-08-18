import React from "react";
import { FaWhatsapp, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-[#343535] text-white px-6 py-8 overflow-hidden">
      <div className="hidden md:flex absolute -top-24 -right-20 w-80 borde h-80 brand.colors rounded-full bg-[#404040]"></div>
      <div className="hidden md:flex absolute -top-32 -right-28 w-96 borde h-96 brand.colors rounded-full border border-gray-500"></div>
      <div className="max-w-7xl  mx-auto hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 ">
        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
          <div className="flex items-start gap-3 mb-4">
            <FaWhatsapp className="text-xl mt-1" />
            <div>
              <p className="font-medium">Whats App</p>
              <p className="text-sm">000000000000000</p>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-6">
            <FaPhone className="text-xl mt-1" />
            <div>
              <p className="font-medium">Call Us</p>
              <p className="text-sm">000000000000000</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold">Download App</h3>
        </div>

        {/* Most Popular Categories */}
        <div>
          <h3 className="text-lg font-semibold border-b-2 border-white inline-block mb-6">
            Most Popular Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li>• Staples</li>
            <li>• Beverages</li>
            <li>• Personal Care</li>
            <li>• Home Care</li>
            <li>• Baby Care</li>
            <li>• Vegetables & Fruits</li>
            
          </ul>
        </div>

        {/* Customer Services */}
        <div>
          <h3 className="text-lg font-semibold border-b-2 border-white inline-block mb-6">
            Customer Services
          </h3>
          <ul className="space-y-2 text-sm">
            <li>• About Us</li>
            <li>• Terms & Conditions</li>
            <li>• FAQ</li>
            <li>• Privacy Policy</li>
            <li>• E-waste Policy</li>
            <li>• Cancellation & Return Policy</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl z-50 md:hidden mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 ">
        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
          <div className="flex items-start gap-3 mb-4">
            <FaWhatsapp className="text-xl mt-1" />
            <div>
              <p className="font-medium">Whats App</p>
              <p className="text-sm">000000000000000</p>
            </div>
          </div>
          <div className="flex items-start gap-3 mb-6">
            <FaPhone className="text-xl mt-1" />
            <div>
              <p className="font-medium">Call Us</p>
              <p className="text-sm">000000000000000</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold">Download App</h3>
        </div>

        <div className="flex gap-9">
          {/* Most Popular Categories */}
          <div>
            <h3 className="text-lg font-semibold border-b-2 border-white inline-block mb-6">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• Staples</li>
              <li>• Beverages</li>
              <li>• Personal Care</li>
              <li>• Home Care</li>
              <li>• Baby Care</li>
              <li>• Vegetables & Fruits</li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="text-lg font-semibold border-b-2 border-white inline-block mb-6">
              Customer Services
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• About Us</li>
              <li>• Terms & Conditions</li>
              <li>• FAQ</li>
              <li>• Privacy Policy</li>
              <li>• E-waste Policy</li>
              <li>• Cancellation</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
