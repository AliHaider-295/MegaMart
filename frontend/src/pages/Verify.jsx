import React, { useContext, useEffect, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
  const [searchParams] = useSearchParams(); // Removed unused setSearchParams
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = useCallback(async () => {
    try {
      if (!token) {
        toast.error("User is not logged in");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/orders/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.result) {
        setCartItems({});
        toast.success("Payment verified successfully!");
        navigate("/orders");
      } else {
        toast.error("Payment validation failed. Redirecting to cart...");
        navigate("/cart");
      }
    } catch (error) {
      console.error("Payment validation error:", error);

      // Handle error response from the server
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during payment verification.";
      toast.error(errorMessage);

      // Optional: Redirect user back to the cart
      navigate("/cart");
    }
  }, [token, success, orderId, backendUrl, setCartItems, navigate]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  return <div>{/* Optional: Add a loader or message here */}</div>;
};

export default Verify;
