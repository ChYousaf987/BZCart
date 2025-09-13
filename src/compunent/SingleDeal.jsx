import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDealById } from "../features/deals/dealSlice";
// import { addToCart } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SingleDeal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentDeal, loading, error } = useSelector((state) => state.deals);
  const user = JSON.parse(localStorage.getItem("myUser") || "{}");
  const guestId = localStorage.getItem("guestId") || null;

  useEffect(() => {
    dispatch(fetchDealById(id))
      .unwrap()
      .catch(() => {
        toast.error("Failed to fetch deal");
      });
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!currentDeal.deal_images?.[0]) {
      toast.error("No image selected for the deal");
      return;
    }
    dispatch(
      addToCart({
        product_id: id, // Treat deal as a product for cart
        selected_image: currentDeal.deal_images[0],
        guestId: user._id ? null : guestId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart!");
        navigate("/cart");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to add to cart");
      });
  };

  const getDiscountPercent = (original, deal) => {
    if (!original || !deal || original <= 0) return null;
    return Math.round(((original - deal) / original) * 100);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Skeleton height={400} className="rounded-xl" />
        <Skeleton width={`60%`} height={30} className="mt-4" />
        <Skeleton width={`40%`} height={20} className="mt-2" />
        <Skeleton width={`80%`} height={100} className="mt-4" />
      </div>
    );
  }

  if (error || !currentDeal) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-red-600">
        {error || "Deal not found"}
      </div>
    );
  }

  const discountPercent = getDiscountPercent(
    currentDeal.original_price,
    currentDeal.deal_price
  );
  const rating = currentDeal.rating || 4;

  return (
    <div className="max-w-7xl mx-auto p-6 font-daraz">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <img
            src={
              currentDeal.deal_images?.[0] || "https://via.placeholder.com/300"
            }
            alt={currentDeal.deal_name}
            className="w-full h-96 object-contain rounded-xl"
            style={{ backgroundColor: currentDeal.bg_color || "#f3f4f6" }}
          />
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-dark mb-2">
            {currentDeal.deal_name}
          </h1>
          <p className="text-dark/70 text-sm mb-2 capitalize">
            {currentDeal.category?.name || "Unknown Category"}
          </p>
          <div className="flex items-center text-yellow-500 text-sm mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(rating)
                    ? "fill-current"
                    : "fill-none stroke-current"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span className="text-dark/70 text-xs ml-2">({rating})</span>
          </div>
          <p className="text-dark/80 mb-4">{currentDeal.deal_description}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold text-dark">
              Rs. {currentDeal.deal_price?.toFixed(2)}
            </span>
            {discountPercent !== null && (
              <span className="line-through text-gray-400">
                Rs. {currentDeal.original_price?.toFixed(2)}
              </span>
            )}
            {discountPercent !== null && (
              <span className="text-green-600 text-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <p className="text-sm text-dark/70 mb-4">
            Deal Code: {currentDeal.deal_code}
          </p>
          <p className="text-sm text-dark/70 mb-4">
            Expires: {new Date(currentDeal.deal_expiry).toLocaleDateString()}
          </p>
          <p className="text-sm text-dark/70 mb-4">
            Stock: {currentDeal.deal_stock || "N/A"}
          </p>
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleDeal;
