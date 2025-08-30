import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";

const TopCategories = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .then((data) => {
        console.log("TopCategories - Fetched products:", data);
      })
      .catch((err) => {
        console.error("TopCategories - Fetch error:", err);
      });
  }, [dispatch]);

  // Find the third category dynamically
  const thirdCategory = useMemo(() => {
    if (products.length === 0) return "";
    // Get unique categories
    const uniqueCategories = [
      ...new Set(products.map((item) => item.category?.name).filter(Boolean)),
    ];
    // Select the third category (index 2), or fallback to empty string
    return uniqueCategories[2] || "";
  }, [products]);

  // Filter products for the third category
  const filteredProducts = useMemo(() => {
    if (!thirdCategory) return [];
    return products.filter((item) => {
      const categoryName = item.category?.name || "";
      return categoryName.toLowerCase() === thirdCategory.toLowerCase();
    });
  }, [products, thirdCategory]);

  return (
    <div className="md:w-[95%] mx-auto px-2 md:px-0 py-12">
      {/* Header */}
      <div className="flex justify-between items-start md:items-center mb-8">
        <h2 className="text-lg md:text-2xl font-bold border-b-2 text-gray-500 border-[#f06621] inline-block pb-1">
          Shop From{" "}
          <span className="text-[#f06621]">
            {thirdCategory || "Top Categories"}
          </span>
        </h2>
        <Link
          to="/products"
          className="text-[#f06621] text-sm sm:text-base font-semibold hover:underline transition"
        >
          View All →
        </Link>
      </div>

      {/* Scrollable Products */}
      {filteredProducts.length === 0 ? (
        <p className="text-center w-full">
          No products found for {thirdCategory || "any category"}
        </p>
      ) : (
        <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 pb-4 snap-x snap-mandatory scrollbar-hide">
          {filteredProducts.map((product, index) => (
            <div
              key={`${product._id}-${index}`}
              className="flex flex-col items-center text-center snap-start flex-shrink-0 w-24 sm:w-36"
            >
              <div className="w-24 h-24 mt-5 sm:w-36 sm:h-36 rounded-full border border-[#f06621] bg-[#fbf6f4] p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
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
              <p className="mt-3 text-sm sm:text-base font-medium hover:text-[#f06621] transition">
                {product.product_name || "Unknown Product"}
              </p>
              <p className="text-xs sm:text-sm font-bold hover:text-[#f06621] transition">
                {product.product_discounted_price && product.product_base_price
                  ? `Up to ${Math.round(
                      ((product.product_base_price -
                        product.product_discounted_price) /
                        product.product_base_price) *
                        100
                    )}% off`
                  : "No discount"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopCategories;
