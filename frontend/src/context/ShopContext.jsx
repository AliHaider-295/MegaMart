import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    // Initialize cartItems from localStorage
    const savedCart = localStorage.getItem("cartItems");

    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Save cartItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product size");
      return;
    }

    // Safely clone the cartItems object
    const cartData = structuredClone(cartItems || {});

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1; // Increment the size count
      } else {
        cartData[itemId][size] = 1; // Add size to the item
      }
    } else {
      cartData[itemId] = { [size]: 1 }; // Initialize with the size
    }

    setCartItems(cartData);
    console.log(cartItems);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;

    if (cartItems && typeof cartItems === "object") {
      for (const itemId in cartItems) {
        const sizes = cartItems[itemId];
        if (sizes && typeof sizes === "object") {
          for (const size in sizes) {
            totalCount += sizes[size] || 0;
          }
        }
      }
    }

    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const getCartAmount = () => {
    try {
      let totalAmount = 0;

      // Loop through cart items
      for (const itemId in cartItems) {
        const sizes = cartItems[itemId]; // Sizes for the product
        const product = products.find((product) => product._id === itemId);

        // Ensure the product exists before accessing its properties
        if (product) {
          for (const size in sizes) {
            totalAmount += sizes[size] * (product.price || 0); // Default to 0 if price is missing
          }
        } else {
          console.error(
            `Product with ID ${itemId} not found in products array.`
          );
        }
      }

      return totalAmount;
    } catch (error) {
      console.error("Error calculating total amount:", error);
      return 0; // Default to 0 if an error occurs
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (userToken) => {
    try {
      const response = await axios.get(backendUrl + "/api/cart/get", {
        headers: { token: userToken },
      });

      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
    if (token) {
      getUserCart(token);
    }
  }, [token]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    cart,
    setCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
