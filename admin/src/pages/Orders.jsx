import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/orders/list");
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + "/api/orders/status", {
        orderId,
        status: event.target.value,
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Page</h3>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center border bg-gray-100 p-4 rounded-md shadow-sm"
            key={index}
          >
            {/* Order Icon */}
            <div className="flex-shrink-0 w-16 h-16">
              <img
                src={assets.parcel_icon}
                alt="Order Icon"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Order Items */}
            <div className="flex-1 sm:ml-4">
              <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
              <div>
                {order.items.map((item, itemIndex) => (
                  <p
                    key={itemIndex}
                    className="text-sm text-gray-600 leading-5"
                  >
                    {item.name} x {item.quantity}{" "}
                    <span className="text-gray-500">({item.size})</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Order Address */}
            <div className="flex-1 sm:ml-4">
              <h4 className="font-semibold text-gray-700 mb-2">Shipping</h4>
              <p className="text-sm text-gray-600">
                {order.address?.firstName} {order.address?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {order.address?.street}, {order.address?.city}
              </p>
              <p className="text-sm text-gray-600">
                {order.address?.state}, {order.address?.country} -{" "}
                {order.address?.zipcode}
              </p>
              <p className="text-sm text-gray-600">
                Phone: {order.address?.phone}
              </p>
            </div>

            {/* Order Summary */}
            <div className="flex-1 sm:ml-4">
              <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
              <p className="text-sm text-gray-600">
                Items: {order.items.length}
              </p>
              <p className="text-sm text-gray-600">
                Payment:{" "}
                {order.paymentMethod === "COD"
                  ? "Cash on Delivery"
                  : order.payment
                  ? "Done"
                  : "Pending"}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(order.date).toLocaleDateString()}
              </p>
            </div>

            {/* Order Amount and Status */}
            <div className="flex-1 sm:ml-4 flex flex-col justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-700">Amount</h4>
                <p className="text-lg font-bold text-gray-800">
                  {currency}
                  {order.amount}
                </p>
              </div>
              <div className="mt-2">
                <select
                  value={order.status}
                  onChange={(event) => statusHandler(event, order._id)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
