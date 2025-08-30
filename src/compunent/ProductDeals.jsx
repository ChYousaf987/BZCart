import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { fetchProducts } from "../features/products/productSlice";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Next Arrow
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-5 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition"
  >
    <IoIosArrowForward size={20} />
  </button>
);

// Custom Prev Arrow
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-5 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition"
  >
    <IoIosArrowBack size={20} />
  </button>
);

const ProductDeals = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts())
      .unwrap()
      .then((data) => {
        console.log("ProductDeals - Fetched products:", data);
      })
      .catch((err) => {
        console.error("ProductDeals - Fetch error:", err);
      });
  }, [dispatch]);

  // Find the first category dynamically
  const firstCategory = useMemo(() => {
    if (products.length === 0) return "";
    const categoryName = products[0]?.category?.name || "";
    console.log("ProductDeals - First category:", categoryName);
    return categoryName;
  }, [products]);

  // Filter products for the first category
  const filteredProducts = useMemo(() => {
    if (!firstCategory) return [];
    return products.filter((item) => {
      const categoryName = item.category?.name || "";
      const matchesCategory =
        categoryName.toLowerCase() === firstCategory.toLowerCase();
      console.log(
        `Product ${item.product_name || item._id}: Category`,
        categoryName,
        `Matches ${firstCategory}:`,
        matchesCategory
      );
      return matchesCategory;
    });
  }, [products, firstCategory]);

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  // react-slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: Math.min(filteredProducts.length, 5),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(filteredProducts.length, 3) },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="md:w-[95%] mx-auto px-2 md:px-0 py-12 relative">
      <div className="flex justify-between items-start md:items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-dark border-b-2 border-primary inline-block pb-1">
          <span className="text-primary">
            {firstCategory ? `${firstCategory} Deals` : "Popular Categories"}
          </span>
        </h2>
        <Link
          to="/eliquids"
          className="text-primary font-medium text-sm hover:underline"
        >
          View All →
        </Link>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center w-full">
          No products found for {firstCategory || "any category"}
        </p>
      ) : (
        <Slider {...settings}>
          {filteredProducts.map((product, index) => {
            const discountPercent = getDiscountPercent(
              product.product_base_price,
              product.product_discounted_price
            );
            const rating = product.rating || 4;
            const categoryName = product.category?.name || "Unknown";

            return (
              <div key={`${product._id}-${index}`} className="px-2">
                <div className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  {discountPercent !== null && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                      {discountPercent}% OFF
                    </div>
                  )}
                  <Link to={`/product/${product._id}`}>
                    <div className="p-4 h-48 flex items-center justify-center bg-light">
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
                    <div className="px-5 py-4 border-t bg-primary/5">
                      <h3 className="font-semibold text-dark text-sm mb-1 line-clamp-1 hover:text-primary transition-colors duration-200">
                        {product.product_name || "Unknown Product"}
                      </h3>
                      <p className="text-dark/70 text-xs mb-1 capitalize">
                        {categoryName}
                      </p>
                      <div className="flex items-center text-yellow-500 text-sm mb-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(rating)
                                ? "fill-current"
                                : "fill-none stroke-current"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                        <span className="text-dark/70 text-xs ml-2">
                          ({rating})
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="px-5 pb-4 bg-primary/5">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="line-through text-gray-400">
                        Rs. {product.product_base_price || "N/A"}
                      </span>
                      <span className="font-semibold text-dark">
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
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default React.memo(ProductDeals);
