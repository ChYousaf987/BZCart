import React, { useState } from "react";
import Navbar from "./Navbar";

const SingleProduct = () => {
  const product = {
    id: 1,
    name: "Premium Smart Watch",
    price: 149.99,
    description:
      "A stylish and feature-rich smartwatch with fitness tracking, notifications, and long battery life.",
    image:
      "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?auto=format&fit=crop&w=600&q=80",
    colors: ["Black", "Silver", "Rose Gold"],
  };

  const reviews = [
    {
      id: 1,
      name: "Ali",
      rating: 5,
      comment: "Amazing watch! Battery lasts forever.",
    },
    {
      id: 2,
      name: "Sara",
      rating: 4,
      comment: "Great design, but strap could be better.",
    },
  ];

  const relatedProducts = [
    {
      id: 2,
      name: "Wireless Earbuds",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      name: "Fitness Tracker",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552261c5a?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <Navbar />
      <div className="md:w-[95%] mx-auto px-2 md:px-0 bg- font-cabin">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-2 mx-auto bg-slate-50 p-6 rounded-2xl shadow">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-2xl shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-dark mb-2">
              {product.name}
            </h1>
            <p className="text-primary text-2xl font-semibold mb-4">
              ${product.price}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-4">
              <h3 className="font-medium mb-2 text-dark">Choose Color:</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded-lg border ${
                      selectedColor === color
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-gray-300 text-dark"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-light rounded-lg text-dark"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 bg-light rounded-lg text-dark"
              >
                +
              </button>
            </div>

            <div className="flex gap-4">
              <button className="bg-primary hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow">
                Add to Cart
              </button>
              <button className="bg-dark hover:bg-gray-800 text-white px-5 py-2 rounded-lg shadow">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className=" mx-auto mt-12">
          <h2 className="text-2xl font-bold text-dark mb-4">
            Customer Reviews
          </h2>
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-white rounded-xl shadow">
                <p className="font-semibold text-primary">{rev.name}</p>
                <p className="text-yellow-500">{"⭐".repeat(rev.rating)}</p>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className=" mx-auto mt-12">
          <h2 className="text-2xl font-bold text-dark mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-semibold text-dark">{item.name}</h3>
                <p className="text-primary font-bold mb-2">${item.price}</p>
                <button className="bg-dark text-white px-4 py-2 rounded-lg w-full hover:bg-gray-800">
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
