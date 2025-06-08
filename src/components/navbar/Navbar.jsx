import React, { useState, useContext, useEffect } from "react";
// import logo from '../../assets/images/freshcart-logo.svg'
import logobaby from "../../assets/images/logo-new2.png";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./navbar.css";
import Login from "./../login/Login";
import Reg from "../Reg/Reg";
// import Btn from './btn';
import { authContext } from "../../context/AuthContext";
import Home from "./../home/home";
import { ShoppingCart, Settings, X } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import axios from "axios";

import newLogo from "../../assets/images/very-final-logo.png";

export default function Navbar() {
  const { userToken, setuserToken } = useContext(authContext);
  const { totalItems, productQuantities } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserData(userData);
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role == "admin") {
      setIsAdmin(true);
    }
  }, []);

  // Update cart count whenever productQuantities changes
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data.products) {
          const totalCount = response.data.data.products.reduce(
            (total, product) => total + product.quantity,
            0
          );
          setCartCount(totalCount);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [productQuantities]); // Re-fetch when productQuantities changes

  async function handleLogout() {
    try {
      // First try to delete the cart
      const cartId = localStorage.getItem("cartId");

      if (cartId) {
        setLoading(true);
        try {
          const response = await axios.delete(
            `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/${cartId}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (response.status === 200) {
            // Only proceed with logout if cart is successfully deleted
            localStorage.removeItem("cartId");
            localStorage.removeItem("cartDetails");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setuserToken(null);
            navigate("/login");
            console.log("cart deleted", response);
          } else {
            throw new Error("Failed to delete cart");
          }
        } catch (cartError) {
          console.error("Cart deletion error:", cartError);

          // Handle specific error cases
          if (cartError.response) {
            const errorMessage =
              cartError.response.data?.message || "Failed to delete cart";

            if (cartError.response.status === 404) {
              setErrorMessage("Cart not found. Please try again.");
            } else if (cartError.response.status === 400) {
              setErrorMessage(errorMessage);
            } else if (cartError.response.status === 401) {
              setErrorMessage("Session expired. Please login again.");
            } else {
              setErrorMessage("Cannot logout: " + errorMessage);
            }
          } else {
            setErrorMessage("Network error. Please check your connection.");
          }

          setTimeout(() => setErrorMessage(""), 3000);
          return; // Prevent logout on any cart deletion error
        }
      } else {
        // If no cart exists, allow logout
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setuserToken(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  }
  console.log(userData);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow pe-7 shadow-rose-300 px-2 fixed py-1 w-full z-50">
        <div className="container mx-auto flex items-center justify-between max-w-[1200px]">
          {/* Left Side: Logo & Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={newLogo} alt="Baby Guard" className="w-30" />
              {/* <h1 className="text-pink-300 text-xl font-bold">Baby Guard</h1> */}
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center space-x-6">
            {userToken ? (
              <li>
                <NavLink
                  to="/childProfile"
                  className="hover:text-rose-300 text-rose-300 font-semibold"
                >
                  Child profile
                </NavLink>
              </li>
            ) : (
              ""
            )}
            <li>
              <NavLink
                to="/products"
                className="hover:text-rose-300 text-rose-300 font-semibold"
              >
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vacciens"
                className="hover:text-rose-300 text-rose-300 font-semibold"
              >
                Vaccines
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pregnancyTips"
                className="hover:text-rose-300 text-rose-300 font-semibold"
              >
                Pregnancy tips
              </NavLink>
            </li>

            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className="hover:text-rose-300 text-rose-300 font-semibold"
                >
                  Admin dashboard
                </NavLink>
              </li>
            )}
            {/* <li>
              <NavLink to="/contactUs" className=" hover:text-pink-600     text-pink-400 font-semibold">
                Contact us
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink to="/aboutUs" className=" hover:text-pink-600     text-pink-400 font-semibold">
                About us
              </NavLink>
            </li> */}
          </ul>

          {/* Right Side: Socials & Buttons */}
          <div className="hidden md:flex items-end space-x-5">
            <ul className="flex items-center space-x-5">
              {userToken ? (
                <>
                  <span className="text-rose-300 font-medium">
                    Hello, {userData?.user?.fName || (isAdmin ? "Admin" : "User")}
                  </span>
                  {isAdmin ? (
                    ""
                  ) : (
                    <li>
                      <NavLink
                        to="/settings"
                        className="text-rose-300 hover:text-rose-300"
                      >
                        <Settings className="w-6 h-6" />
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink to="/cart" className="relative">
                      <ShoppingCart className="w-6 h-6 text-rose-300" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-rose-300 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/myOrders" className="relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-rose-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/user-page" className="relative">
                      <i className="fa-solid fa-user text-rose-300"></i>
                    </NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to="/settings"
                    className="text-rose-300 hover:text-rose-300"
                  >
                    <i className="fa-solid fa-user"></i>
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-rose-300"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white/80 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-50 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
              <img src={newLogo} alt="Baby Guard" className="w-24" />
              <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {userToken && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-medium">
                  Hello, {userData?.user?.fName || (isAdmin ? "Admin" : "User")}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-gray-500 text-sm font-semibold px-4 mb-2">MAIN MENU</h3>
              <ul className="space-y-1">
                {userToken && (
                  <li>
                    <NavLink
                      to="/childProfile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                      onClick={closeSidebar}
                    >
                      <i className="fa-solid fa-child mr-3"></i>
                      Child profile
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/products"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                    onClick={closeSidebar}
                  >
                    <i className="fa-solid fa-box mr-3"></i>
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/vacciens"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                    onClick={closeSidebar}
                  >
                    <i className="fa-solid fa-syringe mr-3"></i>
                    Vacciens
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pregnancyTips"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                    onClick={closeSidebar}
                  >
                    <i className="fa-solid fa-baby mr-3"></i>
                    Pregnancy tips
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink
                      to="/admin"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                      onClick={closeSidebar}
                    >
                      <i className="fa-solid fa-gauge-high mr-3"></i>
                      Admin dashboard
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>

            {userToken && (
              <div className="mt-8 space-y-2">
                <h3 className="text-gray-500 text-sm font-semibold px-4 mb-2">USER MENU</h3>
                <ul className="space-y-1">
                  <li>
                    <NavLink
                      to="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                      onClick={closeSidebar}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      Settings
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/cart"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg relative"
                      onClick={closeSidebar}
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Cart
                      {cartCount > 0 && (
                        <span className="absolute right-4 bg-rose-300 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/myOrders"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                      onClick={closeSidebar}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      My Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user-page"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                      onClick={closeSidebar}
                    >
                      <i className="fa-solid fa-user mr-3"></i>
                      Profile
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}

            {!userToken && (
              <div className="mt-8 space-y-2">
                <h3 className="text-gray-500 text-sm font-semibold px-4 mb-2">ACCOUNT</h3>
                <ul className="space-y-1">
                  <li>
                    <NavLink
                      to="/login"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                      onClick={closeSidebar}
                    >
                      <i className="fa-solid fa-right-to-bracket mr-3"></i>
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/reg"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-rose-300 rounded-lg"
                      onClick={closeSidebar}
                    >
                      <i className="fa-solid fa-user-plus mr-3"></i>
                      Register
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={closeSidebar}
          ></div>
        )}
      </nav>
      <Outlet />
    </>
  );
}

