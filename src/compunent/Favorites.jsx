// src/compunent/Favorites.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toSlug } from "../utils/slugify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please login to view your wishlist");
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await axios.get("http://localhost:3003/api/favorites/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data);
      } catch (err) {
        setError("Failed to load wishlist. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token]);

  const removeFromFavorites = async (productId) => {
    try {
      await axios.post(
        "http://localhost:3003/api/favorites/remove", // ← Fixed
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(favorites.filter((f) => f.product_id._id !== productId));
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 text-center">
        <p className="text-xl text-gray-600">
          Please login to see your wishlist
        </p>
        <Link
          to="/auth"
          className="mt-4 inline-block px-6 py-3 bg-orange-500 text-white rounded-lg"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Wishlist ❤️
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(10)
              .fill()
              .map((_, i) => (
                <Skeleton key={i} height={300} className="rounded-lg" />
              ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-xl">{error}</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 mb-6">
              Your wishlist is empty
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-orange-500 text-white text-lg rounded-lg hover:bg-orange-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favorites.map((item) => {
              const product = item.product_id;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition relative group"
                >
                  <button
                    onClick={() => removeFromFavorites(product._id)}
                    className="absolute top-3 right-3 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="red"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.5 12.572l-7.5 7.428-7.5-7.428m0 0A7.5 7.5 0 1112 4.5a7.5 7.5 0 017.5 8.072z"
                      />
                    </svg>
                  </button>

                  <Link to={`/product/${toSlug(product.product_name)}`}>
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={
                          item.selected_image ||
                          product.product_images?.[0] ||
                          "https://placehold.co/300x300"
                        }
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {product.product_name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-orange-500">
                            ৳{product.product_discounted_price}
                          </p>
                          {product.product_base_price >
                            product.product_discounted_price && (
                            <p className="text-xs text-gray-500 line-through">
                              ৳{product.product_base_price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
