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
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [activeSub, setActiveSub] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoadingSubs(true);
      try {
        const { data: cat } = await axios.get(
          `https://bzbackend.online/api/categories/category/${categoryId}`
        );
        setCategory(cat);

        const { data: allCats } = await axios.get(
          `https://bzbackend.online/api/categories/categories`
        );
        const subs = allCats.filter(
          (cat) => cat.parent_category?._id === categoryId
        );
        setSubCategories(subs);

        const { data: catProducts } = await axios.get(
          `https://bzbackend.online/api/products/category/${categoryId}`
        );

        let allProducts = [...catProducts];

        if (subs.length > 0) {
          const subProductsPromises = subs.map((sub) =>
            axios.get(
              `https://bzbackend.online/api/products/category/${sub._id}`
            )
          );
          const subProductsResponses = await Promise.all(subProductsPromises);
          const subProducts = subProductsResponses.flatMap((res) => res.data);

          // 🧹 Remove duplicate products by _id
          const combined = [...allProducts, ...subProducts];
          const uniqueProducts = Array.from(
            new Map(combined.map((p) => [p._id, p])).values()
          );

          allProducts = uniqueProducts;
        }

        setCategoryProducts(allProducts);

      } catch (err) {
        toast.error("Failed to fetch category or products");
      } finally {
        setLoadingSubs(false);
      }
    };

    fetchCategoryData();
  }, [categoryId]);

  const handleSubcategoryClick = async (subId) => {
    setActiveSub(subId);
    setLoadingSubs(true);
    try {
      const { data } = await axios.get(
        `https://bzbackend.online/api/products/category/${subId}`
      );
      setCategoryProducts(data);
    } catch (err) {
      toast.error("Failed to fetch subcategory products");
    } finally {
      setLoadingSubs(false);
    }
  };

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  if (loadingSubs || relatedLoading) return <Loader />;
  if (relatedError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{relatedError}</p>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar />
      <Toaster position="top-right" />
      <div className="px-4 sm:px-6 lg:px-8 py-6 font-cabin">
        <div className="flex gap-4">
          {/* 🟢 Left Vertical Subcategories Sidebar */}
          {subCategories.length > 0 && (
            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide min-h-[50vh] max-h-[70vh] w-[70px] sm:w-[120px]">
              {subCategories.map((sub) => {
                const isActive = activeSub === sub._id;
                return (
                  <button
                    key={sub._id}
                    onClick={() => handleSubcategoryClick(sub._id)}
                    className={`relative flex flex-col items-center transition-all duration-300 ${
                      isActive ? "scale-110" : "hover:scale-105"
                    }`}
                  >
                    <div
                      className={`relative w-16 h-16 rounded-full p-[2px] shadow-md transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-tr from-orange-500 via-red-400 to-yellow-400 shadow-lg ring-4 ring-orange-300/40"
                          : "bg-[#fbf6f4] border border-gray-300 hover:border-orange-300"
                      }`}
                    >
                      {/* ✅ Animated glow for active */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/30 to-yellow-400/20 blur-md animate-pulse"></div>
                      )}

                      {/* 🖼️ Subcategory image */}
                      <img
                        src={sub.image || "https://via.placeholder.com/100"}
                        alt={sub.name}
                        className="w-full h-full object-cover rounded-full relative z-10"
                        loading="lazy"
                      />

                      {/* ✅ Checkmark for active */}
                      {isActive && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="bg-white/80 backdrop-blur-sm w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                              stroke="#f97316"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    <p
                      className={`mt-2 text-xs font-semibold leading-tight text-center transition-colors duration-300 ${
                        isActive
                          ? "text-orange-600"
                          : "text-gray-700 hover:text-[#f06621]"
                      }`}
                    >
                      {sub.name}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* 🛍️ Right Products Grid */}
          <div className="flex-1">
            {categoryProducts.length === 0 ? (
              <p className="text-gray-600 text-center">
                No products found in this category.
              </p>
            ) : (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5"
                key={activeSub || "main"}
              >
                {categoryProducts.map((product) => {
                  const discountPercent = getDiscountPercent(
                    product.product_base_price,
                    product.product_discounted_price
                  );
                  return (
                    <div
                      key={product._id}
                      className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
                    >
                      {discountPercent !== null && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {discountPercent}% OFF
                        </div>
                      )}
                      {product.product_stock <= 0 && (
                        <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          SOLD OUT
                        </span>
                      )}
                      <Link to={`/product/${product._id}`}>
                        <div
                          className="h-36 flex items-center justify-center bg-gray-50"
                          style={{
                            backgroundColor: product.bg_color || "#f3f4f6",
                          }}
                        >
                          <img
                            src={
                              product.product_images?.[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={product.product_name}
                            className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="px-2 py-3 border-t ">
                          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 hover:text-[#f06621] transition-colors duration-200">
                            {product.product_name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="line-through text-gray-400">
                              Rs. {product.product_base_price}
                            </span>
                            <span className="font-semibold text-black">
                              Rs. {product.product_discounted_price}
                            </span>
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
      </div>
      <Footer />
    </div>
  );
};

export default CategoryProducts;
