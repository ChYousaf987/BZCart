import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProductsByCategory } from "../features/products/productSlice";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Loader from "./Loader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const [hasScrolled, setHasScrolled] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const loadMoreRef = useRef(null);

  // Handle image load
  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Restore scroll position on mount
  useLayoutEffect(() => {
    // Disable browser's automatic scroll restoration
    window.history.scrollRestoration = "manual";

    // Scroll to clicked product if available, else restore saved scroll
    const clickedProduct = localStorage.getItem("clickedProduct");
    if (clickedProduct && !hasScrolled) {
      const productIndex = categoryProducts.findIndex(
        (product) => product._id === clickedProduct
      );
      if (productIndex !== -1 && categoryProducts.length > 0) {
        setShouldScroll(true);
        setHasScrolled(true);
      }
    } else {
      const savedScroll = localStorage.getItem("categoryProductsScroll");
      if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll, 10));
      }
    }
  }, [categoryProducts.length, hasScrolled]);

  // Handle scrolling after component update
  useEffect(() => {
    if (shouldScroll) {
      const clickedProduct = localStorage.getItem("clickedProduct");
      if (clickedProduct) {
        const element = document.getElementById(`product-${clickedProduct}`);
        if (element) {
          // Scroll instantly to product (no animation)
          element.scrollIntoView({ behavior: "auto", block: "center" });
          // Mobile adjustment: center the product in viewport instantly
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            setTimeout(() => {
              const rect = element.getBoundingClientRect();
              const scrollY =
                window.scrollY +
                rect.top -
                window.innerHeight / 2 +
                rect.height / 2;
              window.scrollTo({ top: scrollY, behavior: "auto" });
            }, 0);
          }
        }
        localStorage.removeItem("clickedProduct");
        setShouldScroll(false);
      }
    }
  }, [categoryProducts, shouldScroll]);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem("categoryProductsScroll", window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        // Check for saved subcategory
        const savedSubcategory = localStorage.getItem("activeSubcategory");

        // If there's a saved subcategory that belongs to current category
        if (
          savedSubcategory &&
          subs.some((sub) => sub._id === savedSubcategory)
        ) {
          setActiveSub(savedSubcategory);
          const { data: subProducts } = await axios.get(
            `https://bzbackend.online/api/products/category/${savedSubcategory}`
          );
          setCategoryProducts(subProducts);
        } else {
          // If no saved subcategory or invalid, load main category products
          const { data: catProducts } = await axios.get(
            `https://bzbackend.online/api/products/category/${categoryId}`
          );
          let allProducts = [...catProducts];
          if (subs.length > 0) {
            const subProductsResponses = await Promise.all(
              subs.map((sub) =>
                axios.get(
                  `https://bzbackend.online/api/products/category/${sub._id}`
                )
              )
            );
            const subProducts = subProductsResponses.flatMap((r) => r.data);
            const unique = Array.from(
              new Map(
                [...allProducts, ...subProducts].map((p) => [p._id, p])
              ).values()
            );
            allProducts = unique;
          }
          setCategoryProducts(allProducts);
          // Clear saved subcategory if we're loading main category
          localStorage.removeItem("activeSubcategory");
        }
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
    if (subId) {
      localStorage.setItem("activeSubcategory", subId); // Save active subcategory
    } else {
      localStorage.removeItem("activeSubcategory"); // Remove when showing all products
    }
    setLoadingSubs(true);
    try {
      if (subId) {
        const { data } = await axios.get(
          `https://bzbackend.online/api/products/category/${subId}`
        );
        setCategoryProducts(data);
      } else {
        // Load all products for the main category and its subcategories
        const { data: catProducts } = await axios.get(
          `https://bzbackend.online/api/products/category/${categoryId}`
        );
        let allProducts = [...catProducts];
        if (subCategories.length > 0) {
          const subProductsResponses = await Promise.all(
            subCategories.map((sub) =>
              axios.get(
                `https://bzbackend.online/api/products/category/${sub._id}`
              )
            )
          );
          const subProducts = subProductsResponses.flatMap((r) => r.data);
          const unique = Array.from(
            new Map(
              [...allProducts, ...subProducts].map((p) => [p._id, p])
            ).values()
          );
          allProducts = unique;
        }
        setCategoryProducts(allProducts);
      }
    } catch (err) {
      toast.error("Failed to fetch subcategory products");
    } finally {
      setLoadingSubs(false);
    }
  };

  const getDiscountPercent = (base, discounted) =>
    base && discounted && base > 0
      ? Math.round(((base - discounted) / base) * 100)
      : null;

  if (loadingSubs || relatedLoading) return <Loader />;
  if (relatedError)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200">
        <p className="text-red-600 font-semibold text-lg">{relatedError}</p>
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h min-h-screen">
      <Navbar />
      <Toaster position="top-right" />

      <div className="px-3 sm:px-8 lg:px-12 py-6 font-daraz">
        <div className="flex gap-2 mx-auto relative">
          {/* 🧭 Subcategories Sidebar */}
          {subCategories.length > 0 && (
            <div className="w-20 sm:w-28 flex-shrink-0 relative">
              <div className="sticky top-24 space-y-5 overflow-y-hidden hover:overflow-y-auto scrollbar-hide transition-all duration-700 ease-in-out">
                {/* All Products Option */}
                <button
                  onClick={() => {
                    setActiveSub(null);
                    localStorage.removeItem("activeSubcategory");
                    handleSubcategoryClick(null);
                  }}
                  className={`relative mt-3 flex flex-col items-center group transition-all duration-500 ${
                    !activeSub ? "scale-110" : "hover:scale-105"
                  }`}
                >
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden transition-all duration-700 ${
                      !activeSub
                        ? "bg-gradient-to-tr from-orange-400 via-pink-500 to-red-400 p-[3px] shadow-[0_0_25px_6px_rgba(255,120,60,0.4)]"
                        : "bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px]"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                      <div
                        className={`w-full h-full rounded-2xl flex items-center justify-center bg-gradient-to-r from-orange-100 to-pink-100 transition-all duration-700 ${
                          !activeSub
                            ? "scale-125 blur-[0.5px]"
                            : "group-hover:scale-105"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </div>
                      {!activeSub && (
                        <>
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-400/30 via-pink-500/20 to-yellow-400/20 blur-lg animate-pulse"></div>
                          <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-md rounded-full p-1 shadow-lg flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-orange-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="absolute bottom-1 right-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] px-2 py-[2px] rounded-full shadow-lg font-semibold">
                            Selected
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <p
                    className={`mt-2 text-xs sm:text-sm font-bold text-center tracking-wide transition-all duration-500 ${
                      !activeSub
                        ? "text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text drop-shadow-[0_2px_6px_rgba(249,115,22,0.4)]"
                        : "text-gray-600 hover:text-orange-500"
                    }`}
                  >
                    All Products
                  </p>
                </button>

                {/* Subcategories List */}
                {subCategories.map((sub) => {
                  const isActive = activeSub === sub._id;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => handleSubcategoryClick(sub._id)}
                      className={`relative mt-3 flex flex-col items-center group transition-all duration-500 ${
                        isActive ? "scale-110" : "hover:scale-105"
                      }`}
                    >
                      <div
                        className={`relative w-16  h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden transition-all duration-700 ${
                          isActive
                            ? "bg-gradient-to-tr from-orange-400 via-pink-500 to-red-400 p-[3px] shadow-[0_0_25px_6px_rgba(255,120,60,0.4)]"
                            : "bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px]"
                        }`}
                      >
                        <div className="relative w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                          <img
                            src={sub.image || "https://via.placeholder.com/100"}
                            alt={sub.name}
                            className={`w-full h-full object-cover rounded-2xl transition-all duration-700 ${
                              isActive
                                ? "scale-125 blur-[0.5px]"
                                : "group-hover:scale-105"
                            }`}
                            loading="lazy"
                          />
                          {isActive && (
                            <>
                              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-400/30 via-pink-500/20 to-yellow-400/20 blur-lg animate-pulse"></div>
                              <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-md rounded-full p-1 shadow-lg flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-orange-500"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div className="absolute bottom-1 right-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] px-2 py-[2px] rounded-full shadow-lg font-semibold">
                                Selected
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <p
                        className={`mt-2 text-xs sm:text-sm font-bold text-center tracking-wide transition-all duration-500 ${
                          isActive
                            ? "text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text drop-shadow-[0_2px_6px_rgba(249,115,22,0.4)]"
                            : "text-gray-600 hover:text-orange-500"
                        }`}
                      >
                        {sub.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* 🧍‍♂️ Vertical Divider */}
              <div className="absolute top-0 -right-[2%] h-full w-[1px] bg-primary rounded-full shadow-sm"></div>
            </div>
          )}

          {/* 🛍️ Product Grid */}
          <div className="flex-1 ">
            {categoryProducts.length === 0 ? (
              <p className="text-gray-500 text-center text-lg font-medium animate-fade-in">
                No products found in this category.
              </p>
            ) : (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
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
                      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:-translate-y-1"
                    >
                      {discountPercent !== null && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                          {discountPercent}% OFF
                        </div>
                      )}
                      {product.product_stock <= 0 && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                          SOLD OUT
                        </span>
                      )}
                      <Link
                        to={`/product/${product._id}`}
                        className="block"
                        onClick={() =>
                          localStorage.setItem("clickedProduct", product._id)
                        }
                      >
                        <div
                          id={`product-${product._id}`}
                          className="h-44 sm:h-52 flex items-center justify-center bg-gray-50 transition-transform duration-500 group-hover:scale-105"
                          style={{
                            backgroundColor: product.bg_color || "#fafafa",
                            position: "relative",
                          }}
                        >
                          <img
                            src={
                              product.product_images?.[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={product.product_name}
                            className="object-contain max-h-full w-full transition-all duration-500 group-hover:scale-110"
                            onLoad={() => handleImageLoad(product._id)}
                            style={{
                              opacity: loadedImages[product._id] ? 1 : 0,
                              transition: "opacity 0.3s",
                            }}
                          />
                          {!loadedImages[product._id] && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                zIndex: 2,
                                background: "white",
                              }}
                            >
                              <Skeleton
                                height="100%"
                                className="rounded-lg h-full w-full"
                              />
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 line-clamp-2 hover:text-orange-500 transition-colors duration-300">
                            {product.product_name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm">
                            {product.product_base_price && (
                              <span className="line-through text-gray-400 text-xs">
                                Rs. {product.product_base_price}
                              </span>
                            )}
                            <span className="font-bold text-gray-900">
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
