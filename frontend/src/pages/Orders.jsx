import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  // Function to load orders from the API
  const loadOrderData = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/orders/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      } else {
        setError("Failed to fetch orders. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while loading your orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Call loadOrderData when token changes
  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Handle Track Order button click
  const handleTrackOrderClick = async () => {
    setIsTracking(true); // Set tracking state to true
    await loadOrderData(); // Reload order data
    setIsTracking(false); // Set tracking state back to false after load
  };

  if (loading) {
    return <div className="text-center mt-10">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title Text1={<span className="mr-2">MY</span>} Text2="ORDERS" />
      </div>
      <div>
        {orderData.length === 0 ? (
          <div className="text-center mt-10">No orders found.</div>
        ) : (
          orderData.map((item, index) => (
            <div
              key={item.id || index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={item.image[0]}
                  alt={item.name}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p className="text-lg">
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size || "M"}</p>
                  </div>
                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-2">
                    Payment Method:{" "}
                    <span className="text-gray-400">
                      {item.paymentMethod || "Not specified"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.status.trim() === "Ready to ship"
                        ? "bg-green-500"
                        : "bg-green-500"
                    }`}
                  ></span>

                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={handleTrackOrderClick}
                  className="border px-4 py-2 text-sm font-medium rounded"
                  disabled={!token || isTracking}
                >
                  {isTracking ? "Tracking..." : "Track Order"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
