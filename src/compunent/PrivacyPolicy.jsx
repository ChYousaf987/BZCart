import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="relative text-center py-12 md:py-20 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
        <h1 className="relative text-5xl md:text-6xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="relative mt-4 text-lg md:text-xl opacity-90">
          One Store, Endless Possibilities
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto py-20 px-6">
        <div className="relative bg-white shadow-2xl rounded-3xl p-12 space-y-12">
          {/* Introduction */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At BZCART.STORE (based in Dinga, District Gujrat, Tehsil Kharian, Pakistan), we value your trust and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data while ensuring a secure and customer-friendly shopping experience.
            </p>
          </div>

          {/* Information We Collect */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">1. Information We Collect</h2>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>Basic details you provide when placing an order (name, phone number, delivery address, email).</li>
              <li>Optional details if you contact us via WhatsApp or email for support.</li>
              <li>We do not collect sensitive information like CNIC or card details through our website.</li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">2. How We Use Your Information</h2>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>To process and deliver your orders quickly and accurately.</li>
              <li>To keep you informed about your order status via WhatsApp, SMS, or email.</li>
              <li>To improve our services and ensure a smooth online shopping experience.</li>
              <li>To respond to queries, complaints, or support requests.</li>
            </ul>
          </div>

          {/* Data Security */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">3. Data Security</h2>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>Our website is fully Google-secured with SSL (green lock), ensuring safe browsing.</li>
              <li>Your personal information is protected and never shared with third parties.</li>
              <li>Customers have the right to request removal of their data once their order has been successfully delivered.</li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">4. Payment Methods</h2>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>On Website Orders: Currently, only Cash on Delivery (COD) is available.</li>
              <li>On WhatsApp Orders: Advance payments can be made via Easypaisa, JazzCash, or Bank Transfer.</li>
              <li>Customers who choose advance payment may receive a special discount, which will be decided by BZCART.STORE management.</li>
              <li>We do not save or misuse your payment details.</li>
            </ul>
          </div>

          {/* Customer Rights */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">5. Customer Rights</h2>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>Every customer has the right to a secure shopping experience, with no age restrictions.</li>
              <li>Customers may request data deletion after order delivery.</li>
              <li>Customers paying in advance may receive discounts, depending on promotions or management discretion.</li>
            </ul>
          </div>

          {/* Complaints & Support */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">6. Complaints & Support</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For any queries, complaints, or order-related issues, you can reach us at:
            </p>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>Official Email: <a href="mailto:info@bzcart.store" className="text-primary hover:underline">info@bzcart.store</a></li>
              <li>WhatsApp Support: <a href="https://wa.me/923297609190" className="text-primary hover:underline">https://wa.me/923297609190</a></li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
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