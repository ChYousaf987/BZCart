import React from "react";
import { Link } from "react-router-dom";

const TopBrands = () => {
  // Dummy products (replace with your own data)
  const products = [
    {
      _id: "1",
      product_name: "Mango E-Liquid",
      product_base_price: 2500,
      product_discounted_price: 1999,
      product_images: [
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      ],
      product_catagory: ["e-liquid"],
      rating: 4.5,
    },
    {
      _id: "2",
      product_name: "Strawberry Ice E-Liquid",
      product_base_price: 2800,
      product_discounted_price: 2200,
      product_images: [
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      ],
      product_catagory: ["e-liquid"],
      rating: 4.2,
    },
    {
      _id: "3",
      product_name: "Blueberry Blast",
      product_base_price: 2000,
      product_discounted_price: 1800,
      product_images: [
        "https://static.vecteezy.com/system/resources/previews/053/366/782/non_2x/collection-of-full-body-a-business-suit-mock-up-isolated-on-a-transparency-background-png.png",
      ],
      product_catagory: ["e-liquid"],
      rating: 4,
    },
    {
      _id: "1",
      product_name: "Mango E-Liquid",
      product_base_price: 2500,
      product_discounted_price: 1999,
      product_images: [
        "https://api.ecom.longines.com/media/catalog/product/w/a/watch-collection-longines-primaluna-moonphase-l8-126-5-71-7-ed61b2-thumbnail.png?w=2560",
      ],
      product_catagory: ["e-liquid"],
      rating: 4.5,
    },
    {
      _id: "2",
      product_name: "Strawberry Ice E-Liquid",
      product_base_price: 2800,
      product_discounted_price: 2200,
      product_images: [
        "https://png.pngtree.com/png-vector/20240727/ourmid/pngtree-leather-purses-fashion-in-transparent-background-png-image_13247885.png",
      ],
      product_catagory: ["e-liquid"],
      rating: 4.2,
    },
    {
      _id: "3",
      product_name: "Blueberry Blast",
      product_base_price: 2000,
      product_discounted_price: 1800,
      product_images: [
        "https://static.vecteezy.com/system/resources/previews/053/366/782/non_2x/collection-of-full-body-a-business-suit-mock-up-isolated-on-a-transparency-background-png.png",
      ],
      product_catagory: ["e-liquid"],
      rating: 4,
    },
  ];

  const eliquidProducts = products.filter((item) =>
    item.product_catagory?.some((cat) => cat.toLowerCase().includes("e-liquid"))
  );

  const getDiscountPercent = (base, discounted) => {
    if (!base || !discounted || base <= 0) return null;
    return Math.round(((base - discounted) / base) * 100);
  };

  return (
    <div className="md:w-[90%] mx-auto px-2 md:px-0 py-12 ">
      <div className="flex justify-between items-start md:items-center mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-gray-500 border-b-2 border-[#f06621] inline-block pb-1">
          Shop From
          <span className="text-[#f06621]"> Best Selling</span>
        </h2>
        <Link
          to="/eliquids"
          className="text-[#f06621] font-medium text-sm hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 sm:gap-8 pb-4 snap-x snap-mandatory scrollbar-hide">
        {eliquidProducts.length === 0 ? (
          <p className="text-center w-full">No E-Liquids found</p>
        ) : (
          eliquidProducts.map((product) => {
            const discountPercent = getDiscountPercent(
              product.product_base_price,
              product.product_discounted_price
            );
            const rating = product.rating || 4;

            return (
              <div key={product._id} className="snap-start min-w-[250px]">
                <div className="group bg-white rounded-2xl border shadow-md hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
                  {discountPercent !== null && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-bl-lg z-10">
                      {discountPercent}% OFF
                    </div>
                  )}
                  <Link to={`/product/${product._id}`}>
                    <div className="p-4 h-48 flex items-center justify-center bg-[#fbf6f4]">
                      <img
                        src={
                          product.product_images[0] ||
                          "https://via.placeholder.com/150"
                        }
                        alt={product.product_name}
                        className="object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-5 py-4 border-t bg-orange-50">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1 hover:text-[#f06621] transition-colors duration-200">
                        {product.product_name}
                      </h3>

                      {/* Rating Stars */}
                      <div className="flex items-center text-yellow-400 text-sm mb-1">
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
                        <span className="text-gray-600 text-xs ml-2">
                          ({rating})
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
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopBrands;
