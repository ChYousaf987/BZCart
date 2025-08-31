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
            <p>DINGA TEHSIL KHARIAN DISTRICT GUJRAT, PAKISTAN</p>
          </div>

          <div className="flex items-start gap-2 mb-3 text-sm">
            <FaPhoneAlt className="text-primary mt-1" />
            <p>03297609190</p>
          </div>
          <p className="text-sm mb-4">
            Customer Support: 7 Days a Week, 9:00am - 10:00pm
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-xl">
            <a
              target="_blank"
              href="https://www.facebook.com/share/1D4cs4MYZy/"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="cursor-pointer text-[#1877F2] hover:opacity-80" />{" "}
              {/* Facebook Blue */}
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/bzcart?igsh=MWt1YjBraXZ3bzM1aw=="
              rel="noopener noreferrer"
            >
              <FaInstagram className="cursor-pointer text-[#E4405F] hover:opacity-80" />{" "}
              {/* Instagram Pink */}
            </a>
            <a
              href="https://www.tiktok.com/@bzcart.store?_t=ZS-8zKrLYlIXVR&_r=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok className="cursor-pointer  hover:opacity-80" />{" "}
              {/* TikTok Black */}
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="cursor-pointer text-[#FF0000] hover:opacity-80" />{" "}
              {/* YouTube Red */}
            </a>
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center pt-6 text-sm">
        <p>Copyright © 2025 BZCart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
