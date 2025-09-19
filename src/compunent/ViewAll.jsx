import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchProducts } from "../features/products/productSlice";
import Loader from "./Loader";

const ViewAll = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Function to calculate discount percentage
  const calculateDiscountPercentage = (basePrice, discountedPrice) => {
    if (!basePrice || !discountedPrice || basePrice <= 0) return 0;
    return Math.round(((basePrice - discountedPrice) / basePrice) * 100);
  };

  // Derive categories from products, assuming category is an object with a 'name' field
  const categories = [
    ...new Set(
      products.map(
        (product) =>
          product.category?.name || product.category || "Uncategorized"
      )
    ),
  ];

  // Group products by category name
  const groupedProducts = categories.reduce((acc, categoryName) => {
    acc[categoryName] = products.filter(
      (product) =>
        (product.category?.name || product.category || "Uncategorized") ===
        categoryName
    );
    return acc;
  }, {});

  return (
    <div className="md:w-[95%] mx-auto px-4 sm:px-0 py-12 font-cabin">
      {/* Section Title */}
      <h2 className="text-4xl font-extrabold text-dark mb-12 text-center">
        Our <span className="text-primary">Products</span>
      </h2>

      {/* Loading State */}
      {loading && <Loader />}

      {/* Error State */}
      {error && (
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Products by Category */}
      {!loading && !error && categories.length > 0
        ? categories.map((categoryName) => (
            <div key={categoryName} className="mb-12">
              <h3 className="text-2xl font-bold text-dark mb-6 capitalize">
                {categoryName}
                <div className="px-2 py-[1px] bg-primary w-24"></div>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-7">
                {groupedProducts[categoryName].map((item) => {
                  const discountPercentage = calculateDiscountPercentage(
                    item.product_base_price,
                    item.product_discounted_price
                  );

                  return (
                    <div
                      key={item._id}
                      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      {/* Image */}
                      <Link to={`/product/${item._id}`} className="relative">
                        <div
                          className="md:h-48 flex items-center justify-center"
                          style={{
                            backgroundColor: item.bg_color || "#f3f4f6",
                          }}
                        >
                          <img
                            src={item.product_images[0]}
                            alt={item.product_name}
                            className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        {discountPercentage > 0 && (
                          <span className="absolute top-2 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            -{discountPercentage}%
                          </span>
                        )}
                        <div className="px-2 py-2 md:py-4 border-t bg-orange-50">
                          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 hover:text-[#f06621] transition-colors duration-200">
                            {item.product_name || "Unknown Product"}
                          </h3>
                          <div className="flex items-center text-yellow-400 text-sm mb-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating || 4)
                                    ? "fill-current"
                                    : "fill-none stroke-current"
                                }`}
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                            <span className="text-gray-600 text-xs ml-2">
                              ({item.rating || 4})
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Price Info */}
                      <div className="px-2 pb-4 bg-orange-50">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="line-through text-gray-400">
                            Rs. {item.product_base_price || "N/A"}
                          </span>
                        </div>
                        <span className="font-semibold text-black">
                          Rs. {item.product_discounted_price || "N/A"}
                        </span>
                        {item.product_base_price &&
                          item.product_discounted_price && (
                            <p className="text-green-600 text-xs mt-1">
                              Save - Rs.{" "}
                              {(
                                item.product_base_price -
                                item.product_discounted_price
                              ).toFixed(2)}
                            </p>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        : !loading &&
          !error && <p className="text-center">No products found.</p>}
    </div>
  );
};

export default ViewAll;
