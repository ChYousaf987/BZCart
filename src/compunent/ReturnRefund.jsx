import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ReturnRefund = () => {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="relative font-daraz text-center py-16 md:py-24 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/30 opacity-50"></div>
        <h1 className="relative text-5xl md:text-7xl font-extrabold tracking-tight animate-slideInLeft">
          Return & Refund Policy
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
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">Our Commitment to Your Satisfaction</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              At BZCART.STORE (based in Dinga, District Gujrat, Tehsil Kharian, Pakistan), customer satisfaction is our top priority. We aim to provide a smooth and reliable shopping experience. This Return & Refund Policy clearly explains the conditions under which products can be returned, replaced, or refunded.
            </p>
          </div>

          {/* Return & Replacement Conditions */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">Return & Replacement Conditions</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Customers may file a return or replacement request within 3 days of receiving the product. A valid reason must be provided for the return request. To verify the issue, customers may be required to submit proof such as pictures or videos.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Returns will only be accepted under the following conditions:
            </p>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">Broken, damaged, or defective product on delivery.</li>
              <li className="hover:text-primary transition-colors">Wrong product received.</li>
              <li className="hover:text-primary transition-colors">Expired product.</li>
              <li className="hover:text-primary transition-colors">Product mistakenly delivered in an opened or used condition.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-lg mt-6">
              No return or replacement request will be accepted after 3 days of delivery.
            </p>
          </div>

          {/* Replacement Policy */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">Replacement Policy (Preferred)</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Replacement is our first priority for resolving complaints. A replacement will be provided if:
            </p>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">The same product is available in stock.</li>
              <li className="hover:text-primary transition-colors">The product defect or issue is verified through valid proof.</li>
              <li className="hover:text-primary transition-colors">An incorrect product was delivered.</li>
            </ul>
          </div>

          {/* Refund Policy */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">Refund Policy (Secondary Option)</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Refunds will only be provided in cases where replacement is not possible, such as:
            </p>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">If the product is out of stock.</li>
              <li className="hover:text-primary transition-colors">If the issue cannot be resolved with a replacement.</li>
              <li className="hover:text-primary transition-colors">If the order was prepaid and the required product is unavailable.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-lg mt-6">
              Refunds will be processed within 3–4 working days through Easypaisa, JazzCash, or Bank Transfer. Delivery charges may not be refunded unless the mistake is on our side.
            </p>
          </div>

          {/* How to Request a Return */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInLeft">How to Request a Return</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              To request a return, replacement, or refund, customers must contact us immediately after receiving the product through one of the following channels:
            </p>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li>WhatsApp: <a href="https://wa.me/923297609190" className="text-primary hover:text-accent transition-colors">https://wa.me/923297609190</a></li>
              <li>Email: <a href="mailto:info@bzcart.store" className="text-primary hover:text-accent transition-colors">info@bzcart.store</a></li>
            </ul>
            <p className="text-gray-700 leading-relaxed text-lg mt-6">
              The request must include the Order ID, product details, and reason for return. Our support team will verify the complaint and guide the customer through the process.
            </p>
          </div>

          {/* Important Notes */}
          <div className="bg-white shadow-xl rounded-3xl p-10 transform transition-transform hover:scale-105 hover:shadow-2xl animate-slideInRight">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 animate-slideInRight">Important Notes</h2>
            <ul className="text-gray-700 leading-relaxed text-lg list-disc list-inside space-y-2">
              <li className="hover:text-primary transition-colors">Customers are strongly advised to check their order upon delivery and raise any concerns immediately.</li>
              <li className="hover:text-primary transition-colors">Complaints submitted after the 3-day period will not be entertained.</li>
              <li className="hover:text-primary transition-colors">Our team ensures fast action on valid complaints, but in case of any delay, customers may directly escalate the issue via <a href="mailto:info@bzcart.store" className="text-primary hover:text-accent transition-colors">info@bzcart.store</a>.</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReturnRefund;