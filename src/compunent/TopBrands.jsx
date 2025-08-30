import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";

const TopBrands = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .then((data) => {
        console.log("TopBrands - Fetched products:", data);
      })
      .catch((err) => {
        console.error("TopBrands - Fetch error:", err);
      });
  }, [dispatch]);

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  // Split products into first row (5 items) and second row (remaining items)
  const firstRowProducts = products.slice(0, 5);
  const secondRowProducts = products.slice(5);

  return (
    <div className="md:w-[90%] mx-auto px-2 md:px-0 py-12">
      <div className="flex justify-between items-start md:items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-500 border-b-2 border-[#f06621] inline-block pb-1">
          Shop From
          <span className="text-[#f06621]"> Best Selling</span>
        </h2>
        <Link
          to="/products"
          className="text-[#f06621] font-medium text-sm hover:underline"
        >
          View All →
        </Link>
      </div>

      {loading ? (
        <p className="text-center w-full">Loading products...</p>
      ) : error ? (
        <p className="text-center w-full text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center w-full">No products found</p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* First Row: Up to 5 products */}
          <div className="flex flex-wrap md:flex-nowrap gap-6 sm:gap-8 snap-x snap-mandatory md:overflow-hidden">
            {firstRowProducts.map((product) => (
              <div
                key={product._id}
                className="snap-start w-[250px] flex-shrink-0"
              >
                <div className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  {getDiscountPercent(
                    product.product_base_price,
                    product.product_discounted_price
                  ) !== null && (
                    <div className="absolute top-2 right-2 bg-[#f06621] text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                      {getDiscountPercent(
                        product.product_base_price,
                        product.product_discounted_price
                      )}
                      % OFF
                    </div>
                  )}
                  <Link to={`/product/${product._id}`}>
                    <div className="p-4 h-48 flex items-center justify-center bg-[#fbf6f4]">
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
                    <div className="px-5 py-4 border-t bg-orange-50">
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
                  <div className="px-5 pb-4 bg-orange-50">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="line-through text-gray-400">
                        Rs. {product.product_base_price || "N/A"}
                      </span>
                      <span className="font-semibold text-black">
                        Rs. {product.product_discounted_price || "N/A"}
                      </span>
                    </div>
                    {product.product_base_price &&
                      product.product_discounted_price && (
                        <p className="text-green-600 text-xs mt-1">
                          Save - Rs.{" "}
                          {product.product_base_price -
                            product.product_discounted_price}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row: Remaining products (if any) */}
          {secondRowProducts.length > 0 && (
            <div className="flex flex-wrap md:flex-nowrap gap-6 sm:gap-8 snap-x snap-mandatory md:overflow-hidden">
              {secondRowProducts.map((product) => (
                <div
                  key={product._id}
                  className="snap-start w-[250px] flex-shrink-0"
                >
                  <div className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                    {getDiscountPercent(
                      product.product_base_price,
                      product.product_discounted_price
                    ) !== null && (
                      <div className="absolute top-2 right-2 bg-[#f06621] text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                        {getDiscountPercent(
                          product.product_base_price,
                          product.product_discounted_price
                        )}
                        % OFF
                      </div>
                    )}
                    <Link to={`/product/${product._id}`}>
                      <div className="p-4 h-48 flex items-center justify-center bg-[#fbf6f4]">
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
                      <div className="px-5 py-4 border-t bg-orange-50">
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
                    <div className="px-5 pb-4 bg-orange-50">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="line-through text-gray-400">
                          Rs. {product.product_base_price || "N/A"}
                        </span>
                        <span className="font-semibold text-black">
                          Rs. {product.product_discounted_price || "N/A"}
                        </span>
                      </div>
                      {product.product_base_price &&
                        product.product_discounted_price && (
                          <p className="text-green-600 text-xs mt-1">
                            Save - Rs.{" "}
                            {product.product_base_price -
                              product.product_discounted_price}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopBrands;
