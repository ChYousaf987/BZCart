import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ReturnRefund = () => {
  return (
    <>
      <Navbar />

      {/* Header Section */}
      <div className="relative text-center py-12 md:py-20 px-4 bg-gradient-to-r from-primary to-dark text-white overflow-hidden">
        <h1 className="relative text-5xl md:text-6xl font-extrabold tracking-tight">
          Return & Refund Policy
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
            <h2 className="text-3xl font-bold text-dark mb-4">Our Commitment to Your Satisfaction</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              At BZCART.STORE (based in Dinga, District Gujrat, Tehsil Kharian, Pakistan), customer satisfaction is our top priority. We aim to provide a smooth and reliable shopping experience. This Return & Refund Policy clearly explains the conditions under which products can be returned, replaced, or refunded.
            </p>
          </div>

          {/* Return & Replacement Conditions */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Return & Replacement Conditions</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Customers may file a return or replacement request within 3 days of receiving the product. A valid reason must be provided for the return request. To verify the issue, customers may be required to submit proof such as pictures or videos.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Returns will only be accepted under the following conditions:
            </p>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>Broken, damaged, or defective product on delivery.</li>
              <li>Wrong product received.</li>
              <li>Expired product.</li>
              <li>Product mistakenly delivered in an opened or used condition.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              No return or replacement request will be accepted after 3 days of delivery.
            </p>
          </div>

          {/* Replacement Policy */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Replacement Policy (Preferred)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Replacement is our first priority for resolving complaints. A replacement will be provided if:
            </p>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>The same product is available in stock.</li>
              <li>The product defect or issue is verified through valid proof.</li>
              <li>An incorrect product was delivered.</li>
            </ul>
          </div>

          {/* Refund Policy */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Refund Policy (Secondary Option)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Refunds will only be provided in cases where replacement is not possible, such as:
            </p>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>If the product is out of stock.</li>
              <li>If the issue cannot be resolved with a replacement.</li>
              <li>If the order was prepaid and the required product is unavailable.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Refunds will be processed within 3–4 working days through Easypaisa, JazzCash, or Bank Transfer. Delivery charges may not be refunded unless the mistake is on our side.
            </p>
          </div>

          {/* How to Request a Return */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">How to Request a Return</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              To request a return, replacement, or refund, customers must contact us immediately after receiving the product through one of the following channels:
            </p>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>WhatsApp: <a href="https://wa.me/923297609190" className="text-primary hover:underline">https://wa.me/923297609190</a></li>
              <li>Email: <a href="mailto:info@bzcart.store" className="text-primary hover:underline">info@bzcart.store</a></li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The request must include the Order ID, product details, and reason for return. Our support team will verify the complaint and guide the customer through the process.
            </p>
          </div>

          {/* Important Notes */}
          <div>
            <h2 className="text-3xl font-bold text-dark mb-4">Important Notes</h2>
            <ul className="text-gray-700 leading-relaxed list-disc list-inside mb-6">
              <li>Customers are strongly advised to check their order upon delivery and raise any concerns immediately.</li>
              <li>Complaints submitted after the 3-day period will not be entertained.</li>
              <li>Our team ensures fast action on valid complaints, but in case of any delay, customers may directly escalate the issue via <a href="mailto:info@bzcart.store" className="text-primary hover:underline">info@bzcart.store</a>.</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ReturnRefund;