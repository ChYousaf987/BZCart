import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { User, Mail, Phone, MapPin } from "lucide-react";

const TrackOrders = ({ orderData, formData, authUser }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!orderData) {
    return (
      <div className="py-6 px-4 text-center">
        <h3 className="text-2xl font-bold mb-5">Order Not Found</h3>
        <p className="text-gray-600">No order details available.</p>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      {/* Header */}
      <div className="flex items-center mb-6 justify-center">
        <h1 className="text-lg font-semibold text-center">
          Order Confirmation
        </h1>
      </div>

      {/* Stepper - Completed */}
      <div className="flex items-center justify-between mb-12 w-full max-w-2xl mx-auto">
        <div className="flex">
          <FaMapMarkerAlt size={25} className="text-green-500" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-green-500"></div>
            ))}
        </div>
        <div className="flex">
          <FaCreditCard size={25} className="text-green-500" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-5">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-full bg-green-500"></div>
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
          : `View Order #${orderData?._id?.slice(-6)}`}
      </button>
      {showDetails && orderData && (
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
    </div>
  );
};

export default TrackOrders;
