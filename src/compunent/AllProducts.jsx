import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const AllProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const location = useLocation();

  // Extract query parameter to determine filter
  const query = new URLSearchParams(location.search);
  const filter = query.get("filter");

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .catch(() => {});
  }, [dispatch]);

  // Restore scroll position on mount
  useEffect(() => {
    const savedScroll = localStorage.getItem("allProductsScroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
    }
  }, [filter]); // Restore when filter changes

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      localStorage.setItem("allProductsScroll", window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    let list = products;

    // Apply filters if any
    if (filter === "new-arrivals") {
      list = list.filter((item) => item.isNewArrival === true);
    } else if (filter === "best-sellers") {
      list = list.filter((item) => item.isBestSeller === true);
    }

    // Sort by latest first (newest at top)
    return [...list].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [products, filter]);

  return (
    <>
      <Navbar />
      <div className="md:w-[95%] mx-auto px-2 md:px-0 py-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {filter === "new-arrivals"
            ? "New Arrivals"
            : filter === "best-sellers"
            ? "Best Sellers"
            : "All Products"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border p-3">
                  <Skeleton height={150} className="rounded-lg mb-3" />
                  <Skeleton width="80%" height={16} className="mb-2" />
                  <Skeleton width="60%" height={14} />
                </div>
              ))}
          </div>
        ) : error ? (
          <p className="text-center w-full text-red-600">Error: {error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center w-full text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="snap-start flex-shrink-0">
                <div className="group mb-3 bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  {/* Discount Badge */}
                  {product.product_base_price &&
                    product.product_discounted_price && (
                      <div className="absolute top-2 right-2 bg-[#f06621] text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                        {Math.round(
                          ((product.product_base_price -
                            product.product_discounted_price) /
                            product.product_base_price) *
                            100
                        )}
                        % OFF
                      </div>
                    )}

                  {/* NEW Badge */}
                  {new Date() - new Date(product.createdAt) <
                    24 * 60 * 60 * 1000 && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-br-lg z-10">
                      NEW
                    </div>
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
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
