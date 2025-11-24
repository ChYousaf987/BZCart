import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../features/products/productSlice";
import React, { Suspense, useEffect, useState, useMemo } from "react";
const Navbar = React.lazy(() => import("./Navbar"));
const Slider = React.lazy(() => import("./Slider"));
const ProductDeals = React.lazy(() => import("./ProductDeals"));
const TopCategories = React.lazy(() => import("./TopCategories"));
const TopBrands = React.lazy(() => import("./TopBrands"));
const PromoBanner = React.lazy(() => import("./PromoBanner"));
const Footer = React.lazy(() => import("./Footer"));
const LazyWrapper = React.lazy(() => import("./LazyWrapper"));
const NewArrival = React.lazy(() => import("./NewArrival"));
const BeatSeller = React.lazy(() => import("./BeatSeller"));
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { toSlug } from "../utils/slugify";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p className="text-center text-red-500">
          Something went wrong. Please try again.
        </p>
      );
    }
    return this.props.children;
  }
}

const Home = () => {
  const dispatch = useDispatch();
  const { products, sortedProducts, loading, error, searchTerm } = useSelector(
    (state) => state.products
  );
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  // Fetch products only if not already in store and not loading
  useEffect(() => {
    if (!products.length && !loading && !error) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length, loading, error]);

  return (
    <div className="relative font-daraz bg-white">
      <ErrorBoundary>
        <Suspense fallback={<Skeleton height={60} />}>
          <Navbar />
        </Suspense>

        {/* Product Skeletons on Initial Load */}
        {loading && !products.length && !searchTerm && (
          <div className="w-full px-2 md:px-0 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border p-3">
                    <Skeleton height={"50vh"} className="rounded-lg mb-3" />
                    <Skeleton width="80%" height={16} className="mb-2" />
                    <Skeleton width="60%" height={14} />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Search Results Section */}
        {searchTerm && (
          <div className="single-product md:w-[95%] mx-auto px-2 md:px-0 py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-500 mb-8">
              Search Results for{" "}
              <span className="text-[#f06621]">"{searchTerm}"</span>
            </h2>

            {/* Categories Section */}
            <div className="mb-12">
              <h3 className="text-lg md:text-xl font-bold text-gray-500 mb-4">
                Matching Categories
              </h3>
              {categoriesLoading ? (
                <div className="flex overflow-x-auto gap-6 sm:gap-10 snap-x snap-mandatory">
                  {Array(6)
                    .fill()
                    .map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center ml-4 sm:ml-0 text-center snap-start flex-shrink-0 w-24 sm:w-36"
                      >
                        <Skeleton circle={true} height={128} width={128} />
                        <Skeleton height={20} width={80} className="mt-3" />
                      </div>
                    ))}
                </div>
              ) : categoriesError ? (
                <p className="text-center w-full text-red-500">
                  {categoriesError}
                </p>
              ) : filteredCategories.length === 0 ? (
                <p className="text-center w-full text-gray-500">
                  No categories found starting with "{searchTerm}"
                </p>
              ) : (
                <div className="flex overflow-x-auto md:overflow-hidden gap-6 sm:gap-10 snap-x snap-mandatory scrollbar-hide">
                  {filteredCategories.map((category, index) => (
                    <Link
                      key={`${category._id}-${index}`}
                      to={`/${toSlug(category.name)}`}
                      state={{ scrollY: window.scrollY }}
                      className="flex flex-col items-center ml-4 sm:ml-0 text-center snap-start flex-shrink-0 w-24 sm:w-36"
                    >
                      <div className="w-32 h-32 mt-5 ml-8 md:ml-2 sm:w-36 sm:h-36 rounded-full border border-[#f06621] bg-[#fbf6f4] p-1 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
                        <img
                          src={
                            category.image || "https://via.placeholder.com/150"
                          }
                          alt={category.name || "Category"}
                          className="w-full h-full object-cover rounded-full"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-3 text-sm ml-8 md:ml-2 sm:text-base font-medium hover:text-[#f06621] transition">
                        {category.name || "Unknown Category"}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Products Section */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-gray-500 mb-4">
                Matching Products
              </h3>
              {loading && !products.length ? (
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
                <p className="text-center w-full text-red-500">{error}</p>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center w-full text-gray-500">
                  No products found starting with "{searchTerm}"
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <LazyWrapper key={product._id} height="320px">
                      <div className="snap-start flex-shrink-0">
                        <div className="group mb-3 bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                          {/* Discount Badge */}
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

                          {/* Product Image */}
                          <Link to={`/product/${toSlug(product.product_name)}`}>
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
                    </LazyWrapper>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Existing Homepage Components */}
        <Suspense fallback={<Skeleton height={300} />}>
          <LazyWrapper>
            <Slider />
          </LazyWrapper>
        </Suspense>
        <Suspense fallback={<Skeleton height={300} />}>
          <LazyWrapper>
            <TopCategories
              categories={categories}
              loading={categoriesLoading}
            />
          </LazyWrapper>
        </Suspense>
        <Suspense fallback={<Skeleton height={300} />}>
          <LazyWrapper>
            <BeatSeller />
          </LazyWrapper>
        </Suspense>
        <Suspense fallback={<Skeleton height={300} />}>
          <LazyWrapper>
            <NewArrival />
          </LazyWrapper>
        </Suspense>
        <Suspense fallback={<Skeleton height={300} />}>
          <LazyWrapper>
            <ProductDeals />
          </LazyWrapper>
        </Suspense>
        <Suspense fallback={<Skeleton height={300} />}>
          {/* <LazyWrapper> */}
          <TopBrands sortedProducts={sortedProducts} loading={loading} />
          {/* </LazyWrapper> */}
        </Suspense>
        <Suspense fallback={<Skeleton height={200} />}>
          <LazyWrapper>
            <PromoBanner />
          </LazyWrapper>
        </Suspense>
        <Suspense fallback={<Skeleton />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default Home;
