import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../features/order/orderSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const OrdersList = ({ guestId: propGuestId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  // Initialize guestId
  const guestId =
    propGuestId || localStorage.getItem("guestId") || `guest_${Date.now()}`;

  useEffect(() => {
    if (!localStorage.getItem("guestId")) {
      localStorage.setItem("guestId", guestId);
    }

    console.log("OrdersList - Fetching orders with:", {
      guestId,
      userId: user?._id,
    });

    // Fetch orders
    dispatch(fetchMyOrders({ guestId }))
      .unwrap()
      .then((data) => {
        console.log("OrdersList - Fetched orders:", data);
      })
      .catch((err) => {
        console.error("OrdersList - fetchMyOrders error:", err);
        toast.error(err || "Failed to fetch orders", { position: "top-right" });
      });
  }, [dispatch, guestId, user]);

  const handleRefresh = () => {
    dispatch(fetchMyOrders({ guestId }))
      .unwrap()
      .then((data) => {
        console.log("OrdersList - Refreshed orders:", data);
        toast.success("Orders refreshed", { position: "top-right" });
      })
      .catch((err) => {
        console.error("OrdersList - Refresh error:", err);
        toast.error(err || "Failed to refresh orders", {
          position: "top-right",
        });
      });
  };

  if (loading) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">Loading Orders...</h3>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">Error Loading Orders</h3>
        <p className="text-red-500">{error}</p>
        <div className="flex gap-4 mt-4 justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <RefreshCw size={18} /> Retry
          </button>
          <button
            onClick={() => navigate("/Checkout")}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Go to Checkout
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">No Orders Found</h3>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
        <div className="flex gap-4 mt-4 justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <RefreshCw size={18} /> Refresh
          </button>
          <button
            onClick={() => navigate("/Checkout")}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Go to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-6 px-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate("/")} className="mr-2">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-semibold flex-1">My Orders</h1>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-50 p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/track-order/${order._id}`)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-base">
                  Order #{order._id.slice(-6)}
                </span>
                <span className="text-sm text-gray-600 capitalize">
                  {order.status}
                </span>
              </div>
              <p className="text-sm mt-1">Total: Rs. {order.total_amount}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-2 text-sm">
                <p>Items: {order.products.length}</p>
                <p>Email: {order.order_email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrdersList;
