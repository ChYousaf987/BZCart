// src/components/TrackNow.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TrackNow = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!orderId) {
      toast.error("No order ID provided!", { position: "top-right" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `https://bzbackend.online/api/orders/order/${orderId}`
      );
      setOrderDetails(res.data);
      toast.success("Order details loaded!", { position: "top-right" });
    } catch (err) {
      toast.error("Failed to fetch order details", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-4">
      <button
        onClick={handleTrackOrder}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
      >
        {loading ? "Loading..." : "Track Now"}
      </button>

      {/* Show order details */}
      {orderDetails && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
          <h4 className="font-bold text-dark mb-2">Order Details</h4>
          <p>
            <strong>Order ID:</strong> {orderDetails._id}
          </p>
          <p>
            <strong>Name:</strong> {orderDetails.full_name}
          </p>
          <p>
            <strong>Email:</strong> {orderDetails.order_email}
          </p>
          <p>
            <strong>Phone:</strong> {orderDetails.phone_number}
          </p>
          <p>
            <strong>Address:</strong> {orderDetails.shipping_address}
          </p>
          <p>
            <strong>Total:</strong> Rs. {orderDetails.total_amount}
          </p>

          <h5 className="mt-2 font-semibold">Products:</h5>
          <ul className="list-disc ml-5 text-sm">
            {orderDetails.products?.map((p, idx) => (
              <li key={idx}>
                {p.quantity} x {p.product_id?.product_name || "Product"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackNow;
