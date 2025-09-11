import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";

const Essential = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .then((data) => {
      })
      .catch((err) => {
      });
  }, [dispatch]);

  // Find the second category dynamically (name and ID)
  const secondCategory = useMemo(() => {
    if (products.length === 0) return { name: "", id: "" };
    // Get unique categories
    const uniqueCategories = [
      ...new Set(
        products
          .map((item) =>
            JSON.stringify({
              name: item.category?.name,
              id: item.category?._id || item.category,
            })
          )
          .filter(Boolean)
      ),
    ].map((str) => JSON.parse(str));
    // Select the second category (index 1)
    const category = uniqueCategories[1] || { name: "", id: "" };
    return category;
  }, [products]);

  // Filter products for the second category
  const filteredProducts = useMemo(() => {
    if (!secondCategory.name) return [];
    return products.filter((item) => {
      const categoryName = item.category?.name || "";
      return categoryName.toLowerCase() === secondCategory.name.toLowerCase();
    });
  }, [products, secondCategory]);

  return (
    <div className="md:w-[95%] mx-auto px-2 md:px-0 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold border-b-2 text-gray-500 border-[#f06621] inline-block pb-1">
          Shop From{" "}
          <span className="text-[#f06621]">
            {secondCategory.name || "Essentials"}
          </span>
        </h2>
        <Link
          to={
            secondCategory.id ? `/category/${secondCategory.id}` : "/products"
          }
          className="text-[#f06621] text-sm sm:text-base font-semibold hover:underline transition"
        >
          View All →
        </Link>
      </div>

      {/* Responsive Grid / Scrollable Row */}
      {filteredProducts.length === 0 ? (
        <p className="text-center w-full">
          No products found for {secondCategory.name || "any category"}
        </p>
      ) : (
        <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 pb-4 snap-x snap-mandatory scrollbar-hide">
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

export default Essential;
