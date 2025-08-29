import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaHeadset, FaMoneyBillAlt, FaTruck, FaUndo } from "react-icons/fa";

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <>
      <Navbar />
      <div className="w-[95%] mx-auto md:px-0 p-6">
        {/* Product Detail Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Images */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-3 w-20">
              {[
                "https://media.gq-magazine.co.uk/photos/68752b6717016f093f9b4206/16:9/w_1280,c_limit/new%20Best-watch-brands-hp.jpeg%20copy.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVi4IMm_5OnJx9EHwR-7vnWm2tsOF-YKlj0U2FUwM0tz-2RQP9878LHRw-j83gM32GRus&usqp=CAU",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFcPaXitrb70e5DjFt6r4cQBYVDhJbOxjJhkbnM0gDPhmBVAlO4FZokagUAKioueErnjw&usqp=CAU",
              ].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="thumbnail"
                  className="w-20 h-20 border rounded-md cursor-pointer hover:border-primary"
                />
              ))}
            </div>
            <div className="flex-1">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUoZnwdLPCdMo9P22x1tYmxLmGPZJR3O6eRA&s"
                alt="main"
                className="w-full h-[500px] object-contain rounded-md border"
              />
            </div>
          </div>

          {/* Right Product Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {" "}
              Philips Multigroom Series 3000 All-In-One Trimmer, 9-Piece,
              MG3747/13{" "}
            </h2>{" "}
            <p className="text-gray-500 text-sm mb-4">
              {" "}
              Be the first to review this product{" "}
            </p>{" "}
            <p className="text-2xl font-bold text-red-600 mb-2">
              Rs. 15,000
            </p>{" "}
            <p className="text-green-600 mb-2">✔ In Stock</p>{" "}
            <p className="mb-2">
              {" "}
              Ships In: <span className="font-semibold">1-3 Days</span>{" "}
            </p>{" "}
            <p className="mb-2">
              {" "}
              Warranty:{" "}
              <span className="font-semibold">2 Years Brand Warranty</span>{" "}
            </p>{" "}
            <p className="mb-2">
              {" "}
              Delivery Area: <span className="font-semibold">
                Nationwide
              </span>{" "}
            </p>{" "}
            <p className="mb-2">
              {" "}
              Country of Origin:{" "}
              <span className="font-semibold">Indonesia</span>{" "}
            </p>{" "}
            <p className="mb-6">
              {" "}
              Shipped By: <span className="font-semibold">Naheed</span>{" "}
            </p>{" "}
            {/* Highlights */}{" "}
            <div className="mb-6">
              {" "}
              <h3 className="font-semibold text-lg mb-2">
                Product Highlights:
              </h3>{" "}
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {" "}
                <li>
                  {" "}
                  Includes nine attachments for beard, hair, and precision
                  detailing{" "}
                </li>{" "}
                <li>
                  {" "}
                  Self-sharpening blades for long-lasting sharpness and
                  skin-friendly grooming{" "}
                </li>{" "}
                <li>
                  Up to 60 minutes of cordless runtime on a single charge
                </li>{" "}
                <li>Durable, water-resistant design for easy cleaning</li>{" "}
              </ul>{" "}
            </div>
            <button className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium">
              Add to Cart
            </button>
          </div>
        </div>
        {/* Right Sidebar - Features */}{" "}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {" "}
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            {" "}
            <FaTruck className="text-red-600 text-xl" />{" "}
            <div>
              {" "}
              <h4 className="font-semibold">Fast Shipping</h4>{" "}
              <p className="text-sm text-gray-600">Shipped In 1-3 Days</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            {" "}
            <FaUndo className="text-red-600 text-xl" />{" "}
            <div>
              {" "}
              <h4 className="font-semibold">Free Returns</h4>{" "}
              <p className="text-sm text-gray-600">Free 7 Days Return</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            {" "}
            <FaMoneyBillAlt className="text-red-600 text-xl" />{" "}
            <div>
              {" "}
              <h4 className="font-semibold">Payment On Delivery</h4>{" "}
              <p className="text-sm text-gray-600">Cash On Delivery Option</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex items-center gap-3 p-4 border rounded shadow-sm">
            {" "}
            <FaHeadset className="text-red-600 text-xl" />{" "}
            <div>
              {" "}
              <h4 className="font-semibold">Customer Support</h4>{" "}
              <p className="text-sm text-gray-600">Phone and Email</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>
        {/* Tabs Section */}
        <div className="mt-10">
          {/* Tab Buttons */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-2 font-medium ${
                activeTab === "description"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-2 font-medium ${
                activeTab === "reviews"
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600"
              }`}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4 text-gray-700">
            {activeTab === "description" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Product Description
                </h2>
                <p>
                  Includes nine attachments for beard, hair, and precision
                  detailing. Self-sharpening blades for long-lasting sharpness
                  and skin-friendly grooming. Up to 60 minutes of cordless
                  runtime on a single charge. Durable, water-resistant design
                  for easy cleaning.
                </p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this product!
                </p>
                <form className="mt-4 space-y-3">
                  <textarea
                    placeholder="Write your review..."
                    className="w-full border rounded-md p-3"
                  ></textarea>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
