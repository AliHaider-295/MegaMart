import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../../admin/src/App";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const orderItems = Object.entries(cartItems).flatMap(([itemId, sizes]) =>
      Object.entries(sizes)
        .filter(([_, quantity]) => quantity > 0)
        .map(([size, quantity]) => {
          const product = products.find((product) => product._id === itemId);
          return product ? { ...product, size, quantity } : null;
        })
        .filter(Boolean)
    );

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
    };

    console.log("Order Data: ", orderData); // Log the orderData to ensure everything is correct

    try {
      if (method === "cod") {
        // Handling COD
        const response = await axios.post(
          `${backendUrl}/api/orders/place`,
          orderData,
          { headers: { token } }
        );
        console.log("COD Response:", response.data); // Log response to check if it's correct
        if (response.data.success) {
          setCartItems({});
          toast.success("Order placed successfully!");
          navigate("/orders");
        } else {
          toast.error(response.data.message || "Failed to place order.");
        }
      } else if (method === "stripe") {
        // Handling Stripe
        const responseStripe = await axios.post(
          `${backendUrl}/api/orders/stripe`,
          orderData,
          { headers: { token } }
        );
        console.log("Stripe Response: ", responseStripe.data); // Log the Stripe response for debugging

        if (responseStripe.data.success) {
          const { session_url } = responseStripe.data;
          if (session_url) {
            window.location.replace(session_url); // Redirect to Stripe checkout
          } else {
            toast.error("Stripe session URL not found.");
          }
        } else {
          toast.error(responseStripe.data.message || "Stripe payment failed.");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Error placing order. Please try again.");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Delivery Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title Text1="DELIVERY" Text2="INFORMATION" />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-2 px-2 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-2 px-2 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-2 px-2 w-full"
          type="email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-2 px-2 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-2 px-2 w-full"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-2 px-2 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-2 px-2 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-2 px-2 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-2 px-2 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>

      {/* Payment Method */}
      <div className="mt-8">
        <CartTotal />
        <div className="mt-12">
          <Title Text1="PAYMENT" Text2="METHOD" />
          <div className="flex flex-col lg:flex-row gap-3">
            {["stripe", "razorpay", "cod"].map((paymentMethod) => (
              <div
                key={paymentMethod}
                onClick={() => setMethod(paymentMethod)}
                className={`flex items-center gap-3 border border-gray-300 rounded p-3 px-4 cursor-pointer hover:shadow-md ${
                  method === paymentMethod ? "bg-green-100" : ""
                }`}
              >
                <p
                  className={`w-4 h-4 border border-gray-400 rounded-full ${
                    method === paymentMethod ? "bg-green-400" : ""
                  }`}
                ></p>
                {paymentMethod === "cod" ? (
                  <p className="text-gray-700 text-sm font-medium mx-4">
                    CASH ON DELIVERY
                  </p>
                ) : (
                  <img
                    className="h-6 mx-4"
                    src={
                      paymentMethod === "stripe"
                        ? assets.stripe_logo
                        : assets.razorpay_logo
                    }
                    alt={`${paymentMethod} Logo`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
