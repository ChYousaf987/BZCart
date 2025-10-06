// Updated TrackOrders.jsx - Show only the specific order after placement, with option to view all
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchMyOrders } from "../features/order/orderSlice";
import { ArrowLeft } from "lucide-react";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaList,
} from "react-icons/fa";
import { User, Mail, Phone, MapPin } from "lucide-react";

const TrackOrders = ({
  orderData: propOrderData,
  setOrderData,
  formData,
  authUser,
  guestId,
  onBackToCheckout,
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [localOrderData, setLocalOrderData] = useState(propOrderData);
  const [loading, setLoading] = useState(false);
  const [viewAllOrders, setViewAllOrders] = useState(false); // New state to toggle between single order and all orders
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders: reduxOrders, loading: reduxLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (propOrderData) {
      setLocalOrderData(propOrderData);
      setViewAllOrders(false); // Default to single order view after placement
    }
  }, [propOrderData]);

  const fetchOrder = async () => {
    setLoading(true);
    const lastOrderId = localStorage.getItem("lastOrderId");
    let order = null;

    if (lastOrderId && !viewAllOrders) {
      try {
        const response = await axios.get(
          `http://localhost:3003/api/orders/order/${lastOrderId}`
        );
        order = response.data;
      } catch (err) {
        console.error("Failed to fetch order by ID:", err);
        toast.error("Failed to fetch recent order", { position: "top-right" });
      }
    } else {
      // Fetch all orders
      const action = await dispatch(fetchMyOrders({ guestId }));
      if (action.payload && action.payload.length > 0) {
        setViewAllOrders(true);
        // For all orders view, don't set single orderData, show list
      } else {
        toast.info("No orders found", { position: "top-right" });
      }
    }

    if (order && !viewAllOrders) {
      setLocalOrderData(order);
      if (setOrderData) setOrderData(order);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!propOrderData) {
      fetchOrder();
    }
  }, [propOrderData, guestId, dispatch, viewAllOrders]);

  const orderData = localOrderData;

  if (loading || reduxLoading) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">Loading Order...</h3>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!orderData && !viewAllOrders && reduxOrders.length === 0) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">No Orders Found</h3>
        <p className="text-gray-600">
          Start shopping to place your first order!
        </p>
        <button
          onClick={onBackToCheckout}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Back to Checkout
        </button>
      </div>
    );
  }

  // Single Order View
  if (!viewAllOrders && orderData) {
    const originalSubtotal =
      orderData.original_amount - orderData.shipping_amount;
    const discountAmount = orderData.discount_applied
      ? originalSubtotal * 0.1
      : 0;

    return (
      <div className="py-6 px-4">
        <div className="flex items-center mb-6 justify-center">
          <h1 className="text-lg font-semibold text-center">
            Order Confirmation
          </h1>
        </div>

        <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
          <div className="flex">
            <FaMapMarkerAlt size={25} className="text-green-500" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-5">
            {Array(4)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-1 rounded-full bg-green-500"
                ></div>
              ))}
          </div>
          <div className="flex">
            <FaCreditCard size={25} className="text-green-500" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-5">
            {Array(4)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-1 rounded-full bg-green-500"
                ></div>
              ))}
          </div>
          <div className="flex">
            <FaCheckCircle size={25} className="text-green-500" />
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors mb-3"
        >
          {showDetails
            ? "Hide Order Details"
            : `View Order #${orderData._id?.slice(-6)}`}
        </button>
        {showDetails && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <h4 className="font-bold text-dark mb-3 border-b pb-2">
              Order Confirmation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-right">
                #{orderData._id?.slice(-6)}
              </span>
              <span className="text-gray-600">Name:</span>
              <span className="text-right">{orderData.full_name}</span>
              <span className="text-gray-600">Email:</span>
              <span className="text-right">{orderData.order_email}</span>
              <span className="text-gray-600">Phone:</span>
              <span className="text-right">{orderData.phone_number}</span>
              <span className="text-gray-600">Address:</span>
              <span className="text-right">{orderData.shipping_address}</span>
              {orderData.discount_code && (
                <>
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-green-600 text-right font-medium">
                    10% OFF - {orderData.discount_code}
                  </span>
                </>
              )}
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-right">Rs. {originalSubtotal}</span>
              <span className="text-gray-600">Shipping:</span>
              <span className="text-right">
                Rs. {orderData.shipping_amount}
              </span>
              <span className="text-gray-600">Total:</span>
              <span className="text-right font-bold text-lg text-primary">
                Rs. {orderData.total_amount}
              </span>
            </div>
            <div className="">
              If you have any question please contact on WhatsApp number{" "}
              <a
                href={`https://wa.me/923297609190?text=Hello%20I%20want%20to%20know%20more%20about%20my%20order%20%23${orderData._id?.slice(
                  -6
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold underline"
              >
                03297609190
              </a>
            </div>
            <div className="mt-3 pt-2 border-t text-center text-sm text-gray-600">
              <p>Order Status: {orderData.status}</p>
              <p className="text-xs mt-1">
                You'll receive a confirmation email shortly
              </p>
            </div>
          </div>
        )}

        {/* Button to view all orders or back to checkout */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onBackToCheckout}
            className="flex-1 py-2 bg-primary text-white rounded-lg font-semibold"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => setViewAllOrders(true)}
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <FaList /> View All Orders
          </button>
        </div>
      </div>
    );
  }

  // All Orders View
  if (viewAllOrders) {
    return (
      <div className="py-6 px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setViewAllOrders(false)}
            className="text-gray-500 hover:text-black transition mr-2"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">
            My Orders
          </h1>
        </div>

        {reduxOrders.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600">No orders found.</p>
            <button
              onClick={onBackToCheckout}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Back to Checkout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reduxOrders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-50 p-4 rounded-lg border"
                onClick={() => {
                  setLocalOrderData(order);
                  setViewAllOrders(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </span>
                  <span className="text-sm text-gray-600">{order.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Total: Rs. {order.total_amount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default TrackOrders;
