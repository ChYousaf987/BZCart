import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="relative font-daraz text-center py-16 md:py-24 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/30 opacity-50"></div>
        <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight animate-slideInLeft">
          Privacy Policy
        </h1>
        <p className="relative mt-4 text-lg md:text-2xl font-medium opacity-90 animate-slideInRight">
          One Store, Endless Possibilities
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="relative grid gap-8">
          {/* Introduction */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">Our Commitment to Your Privacy</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              At BZCART.STORE (based in Dinga, District Gujrat, Tehsil Kharian, Pakistan), we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data while ensuring a secure and customer-friendly shopping experience.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">1. Information We Collect</h2>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">Basic details you provide when placing an order (name, phone number, delivery address, email).</li>
              <li className="hover:text-primary transition-colors">Optional details if you contact us via WhatsApp or email for support.</li>
              <li className="hover:text-primary transition-colors">We do not collect sensitive information like CNIC or card details through our website.</li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">2. How We Use Your Information</h2>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">To process and deliver your orders quickly and accurately.</li>
              <li className="hover:text-primary transition-colors">To keep you informed about your order status via WhatsApp, SMS, or email.</li>
              <li className="hover:text-primary transition-colors">To improve our services and ensure a smooth online shopping experience.</li>
              <li className="hover:text-primary transition-colors">To respond to queries, complaints, or support requests.</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">3. Data Security</h2>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">Our website is fully Google-secured with SSL (green lock), ensuring safe browsing.</li>
              <li className="hover:text-primary transition-colors">Your personal information is protected and never shared with third parties.</li>
              <li className="hover:text-primary transition-colors">Customers have the right to request removal of their data once their order has been successfully delivered.</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">4. Payment Methods</h2>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">On Website Orders: Currently, only Cash on Delivery (COD) is available.</li>
              <li className="hover:text-primary transition-colors">On WhatsApp Orders: Advance payments can be made via Easypaisa, JazzCash, or Bank Transfer.</li>
              <li className="hover:text-primary transition-colors">Customers who choose advance payment may receive a special discount, which will be decided by BZCART.STORE management.</li>
              <li className="hover:text-primary transition-colors">We do not save or misuse your payment details.</li>
            </ul>
          </div>

          {/* Customer Rights */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">5. Customer Rights</h2>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">Every customer has the right to a secure shopping experience, with no age restrictions.</li>
              <li className="hover:text-primary transition-colors">Customers may request data deletion after order delivery.</li>
              <li className="hover:text-primary transition-colors">Customers paying in advance may receive discounts, depending on promotions or management discretion.</li>
            </ul>
          </div>

          {/* Complaints & Support */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">6. Complaints & Support</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              For any queries, complaints, or order-related issues, you can reach us at:
            </p>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li>Official Email: <a href="mailto:info@bzcart.store" className="text-primary hover:text-accent transition-colors">info@bzcart.store</a></li>
              <li>WhatsApp Support: <a href="https://wa.me/923297609190" className="text-primary hover:text-accent transition-colors">https://wa.me/923297609190</a></li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-lg mt-6">
              Our dedicated support team ensures instant action. If your issue is not resolved promptly, you may escalate via our official email.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;