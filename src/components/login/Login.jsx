import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { authContext } from "../../context/AuthContext";
import { useUserData } from "../GetUserData/GetUserData";

export default function Login() {
  const { setuserToken } = useContext(authContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const { fetchUserData } = useUserData();

  let user = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Minimum length is 6 characters")
      .max(12, "Maximum length is 12 characters"),
  });

  const formik = useFormik({
    initialValues: user,
    validationSchema,
    onSubmit: handleLogin,
  });

  async function handleLogin(values) {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/auth/login",
        values
      );
      const { token, role } = response.data;
      setSuccessMsg(true);
      setuserToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      console.log("Login API success:", response.data);
      if (role === "admin") {
        console.log("Navigating to /admin");
        navigate("/admin");
      } else {
        // Fetch user data for parent
        try {
          const userResponse = await axios.get(
            "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/user/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          localStorage.setItem("userData", JSON.stringify(userResponse.data));
          console.log("User data fetched:", userResponse.data);
        } catch (err) {
          console.error("Failed to fetch user data after login:", err);
        }
        // Check for pending cart
        try {
          const pendingCartRes = await axios.get(
            "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/pending",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Pending cart response:", pendingCartRes.data);

          // Store cart ID if it exists and is valid
          if (pendingCartRes.data?.data?.cart?._id) {
            console.log(
              "Pending cart ID found:",
              pendingCartRes.data.data.cart._id
            );
            const cartId = pendingCartRes.data.data.cart._id;
            if (cartId && typeof cartId === "string" && cartId !== "null") {
              localStorage.setItem("cartId", cartId);
              console.log("Cart ID stored in localStorage:", cartId);
            } else {
              localStorage.removeItem("cartId");
              console.log(
                "Invalid cart ID from pending cart, removed from localStorage"
              );
            }
          } else {
            // No pending cart, create a new one
            const userDataString = localStorage.getItem("userData");
            const userData = userDataString ? JSON.parse(userDataString) : null;
            if (userData && userData.user) {
              try {
                const cartRes = await axios.post(
                  "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts",
                  {
                    cart: {
                      governorate: userData.user.governorate || "Cairome",
                      city: userData.user.city || "1st Settlementme",
                      street: userData.user.street || "Main Streetme",
                      buildingNumber: userData.user.buildingNumber || 123123,
                      apartmentNumber: userData.user.apartmentNumber || 4545,
                      paymentType: "Cash",
                    },
                  },
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (cartRes.data?.data?._id) {
                  const cartId = cartRes.data.data._id;
                  if (
                    cartId &&
                    typeof cartId === "string" &&
                    cartId !== "null"
                  ) {
                    localStorage.setItem("cartId", cartId);
                    console.log(
                      "New cart created and ID stored in localStorage:",
                      cartId
                    );
                  } else {
                    localStorage.removeItem("cartId");
                    console.log(
                      "Invalid cart ID from new cart, removed from localStorage"
                    );
                  }
                } else {
                  console.log("Cart creation response:", cartRes.data);
                }
              } catch (cartCreateErr) {
                console.error("Error creating new cart:", cartCreateErr);
                // localStorage.removeItem('cartId');
              }
            } else {
              console.log("No user data found for cart creation");
              // localStorage.removeItem('cartId');
            }
          }
        } catch (cartErr) {
          console.error("Error checking/creating pending cart:", cartErr);
          // localStorage.removeItem('cartId');
        }
        console.log("Navigating to /products");
        navigate("/products");
      }
    } catch (error) {
      console.error("Login API error:", error);

      if (error.response) {
        if (error.response.data && error.response.data.errors) {
          // Handle validation errors with 'errors' object
          const errors = error.response.data.errors;
          for (const field in errors) {
            if (Array.isArray(errors[field])) {
              errors[field].forEach((err) => {
                if (err.msg) {
                  toast.error(`${field}: ${err.msg}`);
                }
              });
            } else if (errors[field] && typeof errors[field].msg === "string") {
              // Handle cases where error[field] is a single object, not an array
              toast.error(`${field}: ${errors[field].msg}`);
            } else {
              // Fallback for unexpected structure within 'errors'
              toast.error(`Error in ${field}`);
            }
          }
        } else if (
          error.response.status === 401 &&
          typeof error.response.data === "string" &&
          error.response.data
            .toLowerCase()
            .includes("invalid email or password")
        ) {
          // Handle specific 401 invalid credentials string
          toast.error("Invalid email or password");
        } else {
          // Handle other API errors with response data (e.g., simple message string)
          toast.error(
            error.response.data.message ||
              `Login failed: ${error.response.status}`
          );
        }
      } else {
        // Handle network errors or other issues without response
        toast.error("Login failed. Please check your connection.");
      }

      // Clear any form-specific error message display if you're using toast instead
      setErrorMsg(null);
    } finally {
      setLoading(false);
      console.log("Login process finished.");
    }
  }

  return (
    <div className="min-h-screen bg-white-50 pt-35 pb-1">
      <form
        className="max-w-md mx-auto px-4 sm:px-8"
        onSubmit={formik.handleSubmit}
        autoComplete="on"
      >
        {successMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
            Welcome back
          </div>
        )}
        {errorMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
            {errorMsg}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Login
          </h2>
          {/* Email */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
              placeholder=" "
              required
              autoComplete="email"
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
            {formik.errors.email && formik.touched.email && (
              <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                {formik.errors.email}
              </div>
            )}
          </div>
          {/* Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
              placeholder=" "
              required
              autoComplete="current-password"
            />
            <label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
            {formik.errors.password && formik.touched.password && (
              <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                {formik.errors.password}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="text-white bg-rose-300 cursor-pointer hover:bg-rose-350 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="flex flex-col w-full gap-2 mt-4">
            <Link
              to="/email-forgot-pass"
              className="text-sm text-center text-rose-300 hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              to="/reg"
              className="text-sm text-center text-rose-300 hover:underline"
            >
              Don't have an account?
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
