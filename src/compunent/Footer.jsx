import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";

const Footer = () => {
  const [open, setOpen] = useState(null);

  const toggleSection = (section) => {
    setOpen(open === section ? null : section);
  };

  return (
    <footer className="bg-black text-white pt-10 pb-6 mb-[65px] md:mb-0 px-6 md:px-12 lg:px-20">
      <div className="grid md:grid-cols-4 gap-4 md:gap-10  border-b border-white/20 md:pb-10">
        {/* Contact Details */}
        <div>
          <button className="w-full flex justify-between items-center md:block text-left font-semibold mb-4">
            Contact Details
          </button>

          <div className="text-xs md:text-sm space-y-3 ">
            <div className="flex items-start gap-2">
              <FaLocationDot className="text-primary mt-1" />
              <p>Dinga, Tehsil Kharian District Gujrat, Punjab –Pakistan</p>
            </div>
            <div className="flex items-start gap-2">
              <FaPhoneAlt className="text-primary mt-1" />
              <a href="tel:03297609190" className="hover:underline">
                03297609190
              </a>
            </div>

            <div className="flex items-start gap-2">
              <FaEnvelope className="text-primary mt-1" />
              <a href="mailto:info@bzcart.store" className="hover:underline">
                info@bzcart.store
              </a>
            </div>

            <p>Customer Support: 7 Days a Week, 9:00am - 10:00pm</p>

            {/* Social Icons */}
            <div className="hidden md:flex gap-4 text-xl ">
              <a
                target="_blank"
                href="https://www.facebook.com/share/1D4cs4MYZy/"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <FaFacebookF />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/bzcart"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#E4405F]/30 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@bzcart.store"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-700/30  hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-[#FF0000]/30 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Customer Services */}
        <div>
          <button
            onClick={() => toggleSection("services")}
            className="w-full flex justify-between items-center md:block text-left text-sm font-semibold mb-4"
          >
            Customer Services
            <IoIosArrowDown
              className={`md:hidden transition-transform ${
                open === "services" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`space-y-2 text-sm md:block ${
              open === "services" ? "block" : "hidden"
            }`}
          >
            <li>Contact Us and Location</li>
            <li>Delivery Info</li>
            <li>FAQs</li>
            <li>BZCart-Loyalty</li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <button
            onClick={() => toggleSection("info")}
            className="w-full flex justify-between items-center md:block text-left text-sm font-semibold mb-4"
          >
            Information
            <IoIosArrowDown
              className={`md:hidden transition-transform ${
                open === "info" ? "rotate-180" : ""
              }`}
            />
          </button>
          <ul
            className={`space-y-2 text-sm md:block ${
              open === "info" ? "block" : "hidden"
            }`}
          >
             <li>
            <Link to="/about" className="hover:text-primary">About Us</Link>
          </li>
          <li>
            <Link to="/returnandrefund" className="hover:text-primary">Return & Refund</Link>
          </li>
          <li>
            <Link to="/privacypolicy" className="hover:text-primary">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/termsandconditions" className="hover:text-primary">Terms & Conditions</Link>
          </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <button
            onClick={() => toggleSection("newsletter")}
            className="w-full flex justify-between items-center md:block text-left text-sm font-semibold mb-4"
          >
            Subscribe our Newsletter
            <IoIosArrowDown
              className={`md:hidden transition-transform ${
                open === "newsletter" ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`md:block ${open === "newsletter" ? "block" : "hidden"}`}
          >
            <p className="text-sm mb-3">
              Get the latest offers and promotions!
            </p>
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
          <div className="flex my-6 md:hidden items-center justify-center gap-6 text-xl">
            <a
              target="_blank"
              href="https://www.facebook.com/share/1D4cs4MYZy/"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaFacebookF />
            </a>
            <a
              target="_blank"
              href="https://www.instagram.com/bzcart"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#E4405F]/30 text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@bzcart.store"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-700/30  hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaTiktok />
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#FF0000]/30 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <FaYoutube />
            </a>
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
