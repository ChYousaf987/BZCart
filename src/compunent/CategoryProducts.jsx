import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProductsByCategory } from "../features/products/productSlice";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const { relatedProducts, relatedLoading, relatedError } = useSelector(
    (state) => state.products
  );

  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      setLoadingSubs(true);
      try {
        // Get category details
        const response = await axios.get(
          `https://bzbackend.online/api/categories/category/${categoryId}`
        );
        setCategory(response.data);

        // 🔹 Fetch subcategories
        const subsResponse = await axios.get(
          `https://bzbackend.online/api/categories/categories`
        );

        const subs = subsResponse.data.filter(
          (cat) => cat.parent_category?._id === categoryId
        );
        setSubCategories(subs);

        // 🔹 If no subcategories found, show products instead
        if (subs.length === 0) {
          dispatch(fetchProductsByCategory(categoryId));
        }
      } catch (err) {
        toast.error("Failed to fetch category data");
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId, dispatch]);

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  if (loadingSubs || relatedLoading) {
    return <Loader />;
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
          <span className="text-primary">
            {subCategories.length > 0 ? "Subcategories" : "Products"}
          </span>
        </h2>

        {/* ✅ If subcategories exist, show them */}
        {subCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {subCategories.map((sub) => (
              <Link
                key={sub._id}
                to={`/category/${sub._id}`}
                className="flex flex-col items-center text-center"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#f06621] bg-[#fbf6f4] p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
                  <img
                    src={sub.image || "https://via.placeholder.com/150"}
                    alt={sub.name || "Subcategory"}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm sm:text-base font-medium hover:text-[#f06621] transition">
                  {sub.name || "Unknown Subcategory"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <>
            {/* ✅ If no subcategories, show products */}
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
                        <div
                          className="md:h-48 flex items-center justify-center"
                          style={{
                            backgroundColor: product.bg_color || "#f3f4f6",
                          }}
                        >
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

                        {/* Product Info */}
                        <div className="px-2 py-2 md:py-4 border-t bg-orange-50">
                          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 hover:text-[#f06621] transition-colors duration-200">
                            {product.product_name || "Unknown Product"}
                          </h3>
                          <div className="flex items-center text-yellow-400 text-sm mb-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 4)
                                    ? "fill-current"
                                    : "fill-none stroke-current"
                                }`}
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                            <span className="text-gray-600 text-xs ml-2">
                              ({product.rating || 4})
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Price Info */}
                      <div className="px-2 pb-4 bg-orange-50">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="line-through text-gray-400">
                            Rs. {product.product_base_price || "N/A"}
                          </span>
                        </div>
                        <span className="font-semibold text-black">
                          Rs. {product.product_discounted_price || "N/A"}
                        </span>
                        {product.product_base_price &&
                          product.product_discounted_price && (
                            <p className="text-green-600 text-xs mt-1">
                              Save - Rs.{" "}
                              {(
                                product.product_base_price -
                                product.product_discounted_price
                              ).toFixed(2)}
                            </p>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
