import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NewArrival = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .catch(() => {});
  }, [dispatch]);

  // Filter products where isNewArrival is true
  const filteredProducts = useMemo(() => {
    return products.filter((item) => item.isNewArrival === true);
  }, [products]);

  return (
    <div className="md:w-[95%] mx-auto px-2 md:px-0 pt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold border-b-2 text-gray-500 border-[#f06621] inline-block pb-1">
          Shop From{" "}
          <span className="text-[#f06621]">
            {loading ? <Skeleton width={100} /> : "New Arrivals"}
          </span>
        </h2>
        {loading ? (
          <Skeleton width={70} height={20} />
        ) : (
          <Link
            to="/products?filter=new-arrivals"
            className="text-[#f06621] text-sm sm:text-base font-semibold hover:underline transition"
          >
            View All →
          </Link>
        )}
      </div>

      {/* Product Grid / Scrollable Row */}
      {loading ? (
        <div className="flex overflow-x-auto gap-6 sm:gap-10 snap-x snap-mandatory">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-transparent"
              >
                <Skeleton height={144} width={144} className="rounded-3xl" />
                <Skeleton width={100} height={20} className="mt-3" />
                <Skeleton width={60} height={18} />
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-center w-full text-red-600">Error: {error}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center w-full">No new arrival products found</p>
      ) : (
        <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 snap-x snap-mandatory scrollbar-hide">
          {filteredProducts.map((product, index) => (
            <Link
              to={`/product/${product._id}`}
              key={`${product._id}-${index}`}
              className="flex flex-col items-center text-center bg-transparent"
            >
              <div
                className="w-36 h-36 lg:w-40 lg:h-40 rounded-3xl border border-[#f06621] mt-2 p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105"
                style={{ backgroundColor: product.bg_color || "#fbf6f4" }}
              >
                <img
                  src={
                    product.product_images?.[0] ||
                    "https://via.placeholder.com/150"
                  }
                  alt={product.product_name || "Product"}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-xs sm:text-sm font-medium hover:text-[#f06621] transition">
                {product.product_name || "Unknown Product"}
              </p>
              <p className="text-xs sm:text-sm md:text-base font-bold hover:text-[#f06621] transition">
                {product.product_discounted_price && product.product_base_price
                  ? `Up to ${Math.round(
                      ((product.product_base_price -
                        product.product_discounted_price) /
                        product.product_base_price) *
                        100
                    )}% off`
                  : "No discount"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrival;
