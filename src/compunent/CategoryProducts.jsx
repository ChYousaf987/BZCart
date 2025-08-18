import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProductsByCategory } from "../features/products/productSlice";
import { PulseLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const { relatedProducts, relatedLoading, relatedError } = useSelector(
    (state) => state.products
  );
  const [category, setCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchProductsByCategory(categoryId));
    // Fetch category details
    axios
      .get(
        `https://api.cloudandroots.com/api/categories/category/${categoryId}`
      )
      .then((response) => setCategory(response.data))
      .catch(() => toast.error("Failed to fetch category details"));
  }, [dispatch, categoryId]);

  if (relatedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <PulseLoader color="#2563eb" />
      </div>
    );
  }

  if (relatedError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{relatedError}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar />
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {category?.name || "Category"} Products
        </h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-600">No products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <div className="aspect-square bg-gray-50 relative flex items-center justify-center p-4">
                  <img
                    src={
                      product.product_images?.[0] ||
                      "https://via.placeholder.com/150"
                    }
                    alt={product.product_name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.product_stock <= 0 && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      SOLD OUT
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-bold group-hover:text-indigo-600 line-clamp-2 mb-2">
                    {product.product_name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-900 font-bold">
                        Rs. {product.product_discounted_price}
                      </span>
                      {product.product_discounted_price <
                        product.product_base_price && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          Rs. {product.product_base_price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">
                        {(product.rating || 4).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
