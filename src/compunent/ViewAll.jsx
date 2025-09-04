import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchProducts } from "../features/products/productSlice";

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
    <div className="mx-auto md:px-2 py-12 font-cabin">
      {/* Section Title */}
      <h2 className="text-4xl font-extrabold text-dark mb-12 text-center">
        Our <span className="text-primary">Products</span>
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center">
          <p className="text-lg text-gray-500">Loading products...</p>
        </div>
      )}

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
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                          style={{
                            backgroundColor: item.bg_color || "#f3f4f6",
                          }}
                        >
                          <img
                            src={item.product_images[0]}
                            alt={item.product_name}
                            className="h-48 md:h-64 w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        {discountPercentage > 0 && (
                          <span className="absolute top-2 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            -{discountPercentage}%
                          </span>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 p-2 md:p-5 flex flex-col justify-between">
                        <div>
                          <h6 className="font-semibold text-lg text-dark group-hover:text-primary transition-colors duration-200">
                            {item.product_name}
                          </h6>
                          <p className="text-dark/60 text-sm mt-1 line-clamp-2">
                            {item.product_description}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(item.rating || 0)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.951-.69l1.286-3.967z" />
                              </svg>
                            ))}
                            <span className="text-xs text-dark/50 ml-1">
                              {item.rating || 0}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-2 md:mt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                              Rs. {item.product_base_price}
                            </span>
                            <span className="text-primary font-semibold md:font-bold md:text-xl">
                              Rs. {item.product_discounted_price}
                            </span>
                          </div>
                        </div>
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
