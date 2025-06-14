import React, { useContext, useEffect, useState } from "react";
import { Trash, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import LoaderScreen from "../loaderScreen/loaderScreen";
import toast from "react-hot-toast";
import axios from "axios";
import { Oval } from "react-loader-spinner";
// import { FallingLines, Oval } from 'react-loader-spinner'

const Cart = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [pendingCartProducts, setPendingCartProducts] = useState(
    JSON.parse(localStorage.getItem("productQuantitiesOfPendingCart") || "[]")
  );
  const [userData, setUserData] = useState(null);

  const {
    handleUpdateQuantity,
    loadingProducts,
    productQuantities,
    handleDeleteProduct,
    resetCart,
  } = useContext(CartContext);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  setIsAdmin(localStorage.getItem("role"));

  // Get user data from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data");
      });
  }, []);

  const updateCartStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      // Debug logging
      console.log("Current cart data:", cartData);
      console.log("Cart ID from data:", cartData?.cart?._id);
      console.log("Cart ID from localStorage:", localStorage.getItem("cartId"));

      // Try to get cart ID from both sources
      const cartId = localStorage.getItem("cartId")|| cartData?.cart?._id ;

      if (!cartId) {
        console.error("No valid cart ID found");
        toast.error("No active cart found");
        return false;
      }

      if (!userData) {
        console.error("No user data found");
        return false;
      }

      console.log("Using cart ID for status update:", cartId);

      const response = await axios.patch(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/status/${cartId}`,
        {
          status: "waiting for payment",
          address: {
            governorate: userData.user.governorate,
            city: userData.user.city,
            street: userData.user.street,
            buildingNumber: userData.user.buildingNumber,
            apartmentNumber: userData.user.apartmentNumber,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        console.log("Cart status updated successfully:", response.data.data);
        toast.success("Cart status updated");
        return true;
      } else {
        console.error("Invalid response format:", response.data);
        return false;
      }
    } catch (error) {
      console.error(
        "Error updating cart status:",
        error.response?.data || error.message
      );
      toast.error("Failed to update cart status");
      return false;
    }
  };


  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the cart has any products
      if (
        !response.data.data.products ||
        response.data.data.products.length === 0
      ) {
        setCartData(null);
        setLoading(false);
        return;
      } else {
        setCartData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      // toast.error('Failed to fetch cart data');
      setCartData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [productQuantities]);

  const handleQuantityChange = async (e, product, change) => {
    try {
      const token = localStorage.getItem("token");
      const cartId = localStorage.getItem("cartId");
      const currentQuantity = product.quantity || 0;
      const newQuantity = currentQuantity + change;

      if (newQuantity <= 0) {
        // If quantity would be 0 or negative, delete the product
        await handleDeleteProductWithUpdate(e, product.productId);
        return;
      }

      // Update the quantity in the cart
      const response = await axios.patch(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/${cartId}/products/${product.productId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Only update local state if the API call was successful
      if (response.status === 200) {
        // Update local state
        await fetchCartData();

        // Update pending cart products if they exist
        const updatedPendingProducts = pendingCartProducts.map((p) =>
          p.productId === product.productId
            ? { ...p, quantity: newQuantity }
            : p
        );
        setPendingCartProducts(updatedPendingProducts);
        localStorage.setItem(
          "productQuantitiesOfPendingCart",
          JSON.stringify(updatedPendingProducts)
        );

        // Update cart count in localStorage
        const totalCount = updatedPendingProducts.reduce(
          (total, p) => total + p.quantity,
          0
        );
        localStorage.setItem("cartCount", totalCount.toString());

        // Add toast message for quantity change
        if (change > 0) {
          toast.success(`Quantity increased to ${newQuantity}`);
        } else {
          toast.success(`Quantity decreased to ${newQuantity}`);
        }
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update quantity");
      }
    }
  };

  const handleDeleteProductWithUpdate = async (e, productId) => {
    try {
      await handleDeleteProduct(e, productId);
      await fetchCartData();

      // Remove from pending cart products
      const updatedPendingProducts = pendingCartProducts.filter(
        (product) => product.productId !== productId
      );
      setPendingCartProducts(updatedPendingProducts);
      localStorage.setItem(
        "productQuantitiesOfPendingCart",
        JSON.stringify(updatedPendingProducts)
      );

      // Update cart count in localStorage
      const totalCount = updatedPendingProducts.reduce(
        (total, p) => total + p.quantity,
        0
      );
      localStorage.setItem("cartCount", totalCount.toString());
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to remove product from cart");
    }
  };

  const handleOrderPlacement = async () => {
    if (!isAddressConfirmed) {
      toast.error("Please confirm your delivery address");
      return;
    }

    try {
      setLoadingPayment(true);

      // Debug logging
      console.log("Before status update - Cart data:", cartData);
      console.log("Before status update - Cart ID:", cartData?.cart?._id);

      // Update cart status
      const statusUpdated = await updateCartStatus();
      if (!statusUpdated) {
        throw new Error("Failed to update cart status");
      }

      // Clear old cart data
      localStorage.removeItem("productQuantitiesOfPendingCart");
      localStorage.removeItem("cartId");
      localStorage.removeItem("cartDetails");
      setPendingCartProducts([]);

      // Reset cart context
      resetCart();

      // Initialize new cart
      const token = localStorage.getItem("token");
      const userDataString = localStorage.getItem("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData) {
        const newCartResponse = await axios.post(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts",
          {
            cart: {
              governorate: userData.user.governorate,
              city: userData.user.city,
              street: userData.user.street,
              buildingNumber: userData.user.buildingNumber,
              apartmentNumber: userData.user.apartmentNumber,
              paymentType: "Cash",
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Store new cart data
        if (newCartResponse.data.data) {
          const newCartData = newCartResponse.data.data;
          console.log("New cart created:", newCartData);
          localStorage.setItem("cartId", newCartData._id);
          localStorage.setItem(
            "cartDetails",
            JSON.stringify({
              governorate: newCartData.governorate,
              city: newCartData.city,
              street: newCartData.street,
              buildingNumber: newCartData.buildingNumber,
              apartmentNumber: newCartData.apartmentNumber,
              paymentType: newCartData.paymentType,
              Online: newCartData.Online,
            })
          );

          // Initialize empty product quantities
          localStorage.setItem("productQuantities", JSON.stringify({}));
          localStorage.setItem(
            "productQuantitiesOfPendingCart",
            JSON.stringify([])
          );
        }
      }

      // Navigate to order confirmation
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setLoadingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Oval
          height={80}
          width={80}
          color="#fda4af"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#fecdd3"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }
  // console.log(userData);
  // console.log(userData.fName);

  if (!cartData || !cartData.products || cartData.products.length === 0) {
    return (
      <div className="max-w-5xl py-30 mx-auto p-6 bg-whitw min-h-screen">
        <div className="text-center">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-rose-400 hover:bg-rose-400 text-white font-medium py-2 px-6 rounded-full cursor-pointer transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const { cart, products } = cartData;

  return (
    <div className="max-w-5xl py-30 mx-auto p-6 bg-whitw min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-rose-400 font-semibold ">Cart items:</h1>
        <p className="text-rose-400 text-lg font-medium">
          Total: {cart.totalPrice} EGP + Delivery: 50 EGP
        </p>
      </div>

      {products.map((product) => (
        <div
          key={product.productId}
          className="flex items-center justify-between bg-white rounded-2xl shadow p-4 mb-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover border-2 border-rose-200"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                {product.name}
              </h3>
              <p className="text-rose-400 font-medium text-sm">
                Price: {product.price} EGP
              </p>
              <p className="text-gray-500 text-sm">
                Required Age: {product.requiredAge}
              </p>
              <button
                className="mt-2 flex items-center text-xs text-rose-400 cursor-pointer hover:underline"
                onClick={(e) =>
                  handleDeleteProductWithUpdate(e, product.productId)
                }
              >
                <Trash className="w-4 h-4 mr-1" /> Remove
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loadingProducts[product.productId] ? (
              <div className="flex justify-center">
                <Oval
                  height={20}
                  width={20}
                  color="#EC4899"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#EC4899"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />
              </div>
            ) : (
              <>
                <button
                  onClick={(e) =>{ handleQuantityChange(e, product, -1); toast.loading('Updating quantity',{duration: 2000}) } }
                  className="bg-rose-200 text-rose-500 px-2 py-1 cursor-pointer rounded-full hover:bg-rose-300"
                >
                  <Minus size={16} />
                </button>
                <span className="text-md font-semibold text-gray-700">
                  {product.quantity}
                </span>
                <button
                  onClick={(e) => {handleQuantityChange(e, product, 1) ; toast.loading('Updating quantity',{duration: 2000}) }}
                  className="bg-rose-200 cursor-pointer text-rose-500 px-2 py-1 rounded-full hover:bg-rose-300"
                >
                  <Plus size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* { isAdmin ? "" : <> */}
      {/* Address Section */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Delivery Address
        </h2>
        <div className="mb-4">
          {userData ? (
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-semibold">Name:</span>{" "}
                {userData.fName} {userData.lName}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Phone:</span>{" "}
                {userData.phoneNumber}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Governorate:</span>{" "}
                {userData.governorate}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">City:</span>{" "}
                {userData.city}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Street:</span>{" "}
                {userData.street}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Building:</span>{" "}
                {userData.buildingNumber}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Apartment:</span>{" "}
                {userData.apartmentNumber}
              </p>
            </div>
          ) : (
            <p className="text-red-500">
              Please update your address in your profile
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAddressConfirmed}
              onChange={(e) => setIsAddressConfirmed(e.target.checked)}
              className="w-4 h-4 text-rose-300 rounded focus:ring-rose-300"
            />
            <div className="flex gap-1">
              <span className="text-gray-700">
                I confirm this is my correct delivery address
              </span>
              <span
                className="text-rose-400 "
                onClick={(e) => {
                  e.preventDefault;
                  navigate("/edit-user");
                }}
              >
                {" "}
                Change address
              </span>
            </div>
          </label>
          {/* <button
                        onClick={() => navigate('/profile')}
                        className="text-rose-300 hover:text-rose-600 font-medium"
                    >
                        Change Addr
                    </button> */}
        </div>
      </div>

      {/* Payment Options */}
      <div className="mt-6 text-center flex flex-col gap-4 justify-between w-[60%] mx-auto">
        <button
          onClick={async () => {
            if (!isAddressConfirmed) {
              toast.error("Please confirm your delivery address");
              return;
            }
            try {
              const cartId = localStorage.getItem("cartId");
              const token = localStorage.getItem("token");

              if (!cartId) {
                toast.error("Cart ID not found. Please try again.");
                return;
              }

              if (!token) {
                toast.error("Please login first");
                navigate("/login");
                return;
              }

              // Update payment type to Online
              await axios.patch(
                `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/payment-type/${cartId}`,
                { paymentType: "Cash" },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log(
                "Successfully updated payment type from online to cash"
              );
              navigate("/payment");
            } catch (error) {
              console.error("Error updating payment type:", error);
              toast.error("Failed to update payment type. Please try again.");
            }
            handleOrderPlacement()
          }}
          className="bg-white-500 text-rose-300 px-6 py-3 bg-rose rounded-full shadow hover:text-white hover:bg-rose-400 cursor-pointer text-lg font-semibold transition-colors duration-200"
        >
          Place Order ( Cash )
        </button>

        <button
          onClick={async () => {
            if (!isAddressConfirmed) {
              toast.error("Please confirm your delivery address");
              return;
            }
            try {
              const cartId = localStorage.getItem("cartId");
              const token = localStorage.getItem("token");

              if (!cartId) {
                toast.error("Cart ID not found. Please try again.");
                return;
              }

              if (!token) {
                toast.error("Please login first");
                navigate("/login");
                return;
              }

              // Update payment type to Online
              const res = await axios.patch(
                `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/payment-type/${cartId}`,
                { paymentType: "Online" },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log(
                "Successfully updated payment type from Cash to Online"
              );
              console.log(res);
              
              navigate("/payment");
            } catch (error) {
              console.error("Error updating payment type:", error);
              toast.error("Failed to update payment type. Please try again.");
            }
          }}
          className="bg-rose-300 text-white px-6 py-3 rounded-full shadow hover:bg-rose-400 cursor-pointer text-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 w-full"
        >
          <span>Proceed to Payment ( Visa )</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
      {/* </> } */}
    </div>
  );
};

export default Cart;
