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
import { ShoppingCart, Settings } from "lucide-react";
import { CartContext } from "../../context/CartContext";
import axios from "axios";

import newLogo from "../../assets/images/very-final-logo.png";

export default function Navbar() {
  const { userToken, setuserToken } = useContext(authContext);
  const { totalItems, productQuantities } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
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
  return (
    <>
      <nav className="bg-white shadow pe-7 shadow-rose-300 px-2 fixed py-1 w-full">
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
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white py-4">
            <ul className="flex flex-col items-center space-y-4">
              <li>
                <NavLink
                  to="/products"
                  className="text-gray-600 hover:text-rose-300"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/categories"
                  className="text-gray-600 hover:text-rose-300"
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className="text-gray-600 hover:text-rose-300"
                  onClick={() => setIsOpen(false)}
                >
                  Pergnancy tips
                </NavLink>
              </li>
              {/* <li><NavLink to="/" className="text-gray-600 hover:text-pink-400" onClick={() => setIsOpen(false)}>Contant us</NavLink></li> */}
              {/* <li><NavLink to="/aboutUs" className="text-gray-600 hover:text-pink-400" onClick={() => setIsOpen(false)}>About us</NavLink></li> */}

              {userToken && (
                <ul>
                  <li>
                    <NavLink
                      to="/cart"
                      className="text-gray-600 hover:text-rose-300 relative"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingCart className="w-6 h-6 text-rose-300" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-rose-300 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settings"
                      className="text-gray-600 hover:text-rose-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-6 h-6 text-rose-300" />
                    </NavLink>
                  </li>
                  <li>
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
                  </li>
                </ul>
              )}

              <li>
                <NavLink
                  to="/settings"
                  className="text-rose-300 hover:text-rose-300"
                >
                  <i className="fa-solid fa-user"></i>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
}
