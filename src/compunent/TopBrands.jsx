import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toSlug } from "../utils/slugify";
import { fetchProducts } from "../features/products/productSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TopBrands = ({ sortedProducts, loading }) => {
  const dispatch = useDispatch();
  const { products = [], error } = useSelector((state) => state.products || {});
  const [visibleCount, setVisibleCount] = useState(8);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const loadMoreRef = useRef(null);
  // Track loaded images by product ID
  const [loadedImages, setLoadedImages] = useState({});

  // Handler for image load
  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (!products.length && !sortedProducts.length && !hasLoaded) {
      dispatch(fetchProducts());
      setHasLoaded(true);
    }
  }, [dispatch, products, sortedProducts, hasLoaded]);

  // Scroll restoration removed — behaviour intentionally disabled

  useEffect(() => {
    if (visibleCount >= sortedProducts.length || loading || error) return;
    if (!("IntersectionObserver" in window)) {
      setVisibleCount((prev) => Math.min(prev + 8, sortedProducts.length));
      return;
    }

    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 8, sortedProducts.length));
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, sortedProducts.length, loading, error]);

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  const isNewProduct = (createdAt) => {
    const now = new Date();
    const productDate = new Date(createdAt);
    return now - productDate < 24 * 60 * 60 * 1000;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-0 pb-7 mt-10 topbrands-scroll-container">
      <div className="flex justify-between items-start md:items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-500 border-b-2 border-[#f06621] inline-block pb-1">
          Explore From
          <span className="text-[#f06621]"> All Product</span>
        </h2>
        <Link
          to="/products"
          className="text-[#f06621] font-medium text-sm hover:underline"
        >
          View All →
        </Link>
      </div>

      {loading && !sortedProducts.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border p-3">
                <Skeleton height={290} className="rounded-lg mb-3" />
                <Skeleton width="80%" height={16} className="mb-2" />
                <Skeleton width="60%" height={14} />
              </div>
            ))}
        </div>
      ) : error ? (
        <p className="text-center w-full text-red-500">{error}</p>
      ) : sortedProducts.length === 0 ? (
        <p className="text-center w-full">No products found</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-6">
            {sortedProducts.slice(0, visibleCount).map((product) => {
              const isLoaded = loadedImages[product._id];
              return (
                <div key={product._id} className="snap-start flex-shrink-0 ">
                  <div className="group mb-3  bg-white rounded-2xl border border-primary shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
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

                    {/* NEW Badge */}
                    {isNewProduct(product.createdAt) && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-br-lg z-10">
                        NEW
                      </div>
                    )}

                    {/* Product Image */}
                    <Link
                      to={`/product/${toSlug(product.product_name)}`}
                      data-product-id={product._id}
                      data-product-name={product.product_name}
                      onClick={() => {
                        localStorage.setItem(
                          "clickedProduct",
                          toSlug(product.product_name)
                        );
                      }}
                    >
                      <div
                        id={`product-${toSlug(product.product_name)}`}
                        data-product-id={product._id}
                        data-product-name={product.product_name}
                        className=" md:h-48 flex items-center justify-center"
                        style={{
                          backgroundColor: product.bg_color || "#f3f4f6",
                          position: "relative",
                        }}
                      >
                        {/* Always render the image, but hide until loaded */}
                        <img
                          src={
                            product.product_images?.[0] ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product.product_name || "Product"}
                          loading="lazy"
                          className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                          onLoad={() => handleImageLoad(product._id)}
                          style={{
                            opacity: isLoaded ? 1 : 0,
                            transition: "opacity 0.3s",
                          }}
                        />
                        {/* Show skeleton overlay until image is loaded */}
                        {!isLoaded && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              zIndex: 2,
                              background: "white",
                            }}
                          >
                            <Skeleton
                              height={265}
                              className="rounded-lg h-full w-full"
                            />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="px-2 py-2 md:py-4 border-t bg--50">
                        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 hover:text-[#f06621] transition-colors duration-200">
                          {product.product_name || "Unknown Product"}
                        </h3>
                        {/* <div className="flex items-center text-yellow-400 text-sm mb-1">
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
                        </div> */}
                      </div>
                    </Link>

                    {/* Price Info */}
                    <div className="px-2 pb-4 bg-orange-">
                      <div className="flex items-center justify-start gap-3">
                        <span className="font-semibold text-black">
                          Rs. {product.product_discounted_price || "N/A"}
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="line-through text-gray-400 text-xs">
                            Rs. {product.product_base_price || "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* {product.product_base_price &&
                        product.product_discounted_price && (
                          <p className="text-green-600 text-xs mt-1">
                            Save - Rs.{" "}
                            {(
                              product.product_base_price -
                              product.product_discounted_price
                            ).toFixed(2)}
                          </p>
                        )} */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Infinite scroll trigger */}
          {visibleCount < sortedProducts.length && (
            <div ref={loadMoreRef} className="h-10"></div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(TopBrands);
