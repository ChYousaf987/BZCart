import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProductsByCategory } from "../features/products/productSlice";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader"; // 🔹 Import custom loader

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
      .get(`https://bzbackend.online/api/categories/category/${categoryId}`)
      .then((response) => setCategory(response.data))
      .catch(() => toast.error("Failed to fetch category details"));
  }, [dispatch, categoryId]);

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  if (relatedLoading) {
    return <Loader />; // 🔹 Use custom loader instead of PulseLoader
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
      <div className="md:w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12 font-cabin">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
          {category?.name || "Category"}{" "}
          <span className="text-primary">Products</span>
        </h2>

        {relatedProducts.length === 0 ? (
          <p className="text-gray-600 text-center">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            {relatedProducts.map((product) => {
              const discountPercent = getDiscountPercent(
                product.product_base_price,
                product.product_discounted_price
              );
              const rating = product.rating || 4;
              const categoryName = product.category?.name || "Unknown";

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
                >
                  {/* Discount Badge */}
                  {discountPercent !== null && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {discountPercent}% OFF
                    </div>
                  )}

                  {/* SOLD OUT Badge */}
                  {product.product_stock <= 0 && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      SOLD OUT
                    </span>
                  )}

                  {/* Product Image */}
                  <Link to={`/product/${product._id}`}>
                    <div className="p-4 h-48 flex items-center justify-center bg-gray-50">
                      <img
                        src={
                          product.product_images?.[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={product.product_name || "Product"}
                        className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="px-5 py-4 bg-orange-50">
                    <h3 className="font-semibold text-dark text-sm mb-1 line-clamp-1 hover:text-primary transition-colors duration-200">
                      {product.product_name || "Unknown Product"}
                    </h3>
                    <p className="text-dark/70 text-xs mb-2 capitalize">
                      {categoryName}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center text-yellow-500 text-sm mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(rating)
                              ? "fill-current"
                              : "fill-none stroke-current"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                      <span className="text-dark/70 text-xs ml-2">
                        ({rating})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 text-sm mb-1">
                      {product.product_discounted_price <
                        product.product_base_price && (
                        <span className="line-through text-gray-400">
                          Rs. {product.product_base_price}
                        </span>
                      )}
                      <span className="font-semibold text-dark text-lg">
                        Rs. {product.product_discounted_price || "N/A"}
                      </span>
                    </div>

                    {/* Save amount */}
                    {product.product_base_price >
                      product.product_discounted_price && (
                      <p className="text-green-600 text-xs">
                        Save - Rs.{" "}
                        {product.product_base_price -
                          product.product_discounted_price}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
