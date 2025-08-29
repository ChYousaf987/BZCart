import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 pb-6 px-6 md:px-12 lg:px-20">
      <div className="grid md:grid-cols-4 gap-10 border-b border-white/20 pb-10">
        {/* Contact Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
          <div className="flex items-start gap-2 mb-3 text-sm">
            <FaLocationDot className="text-primary mt-1" />
            <p>156-157, Block 3, BYJCHS, Bahadurabad Karachi, Pakistan</p>
          </div>
          <div className="flex items-start gap-2 mb-3 text-sm">
            <FaLocationDot className="text-primary mt-1" />
            <p>Safa Mall, Ziarat Line, Malir Cantonment Karachi, Pakistan</p>
          </div>
          <div className="flex items-start gap-2 mb-3 text-sm">
            <FaPhoneAlt className="text-primary mt-1" />
            <p>(021) 111-624-333</p>
          </div>
          <p className="text-sm mb-4">
            Customer Support: 7 Days a Week, 9:00am - 10:00pm
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-xl">
            <FaFacebookF className="cursor-pointer hover:text-primary" />
            <FaInstagram className="cursor-pointer hover:text-primary" />
            <FaTiktok className="cursor-pointer hover:text-primary" />
            <FaLinkedinIn className="cursor-pointer hover:text-primary" />
            <FaYoutube className="cursor-pointer hover:text-primary" />
          </div>
        </div>

        {/* Customer Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Contact Us and Location</li>
            <li>Delivery Info</li>
            <li>FAQs</li>
            <li>Naheed-Loyalty</li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Information</h3>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Return & Refund</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Subscribe our Newsletter
          </h3>
          <p className="text-sm mb-3">Get the latest offers and promotions!</p>
          <div className="flex mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 w-full rounded-l-lg text-black outline-none"
            />
            <button className="bg-primary px-4 py-2 rounded-r-lg font-medium">
              Subscribe
            </button>
          </div>

          {/* App Buttons */}
          <div className="flex gap-4">
            <img src="/googleplay.png" alt="Google Play" className="h-12" />
            <img src="/appstore.png" alt="App Store" className="h-12" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-sm">
        <p>Copyright © 2025 BZCart. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <img src="/hbl.png" alt="HBL" className="h-6" />
          <img src="/visa.png" alt="Visa" className="h-6" />
          <img src="/mastercard.png" alt="Mastercard" className="h-6" />
          <img src="/easypaisa.png" alt="Easypaisa" className="h-6" />
          <img src="/cod.png" alt="Cash on Delivery" className="h-6" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
