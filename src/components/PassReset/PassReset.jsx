import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function PassReset() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("resetToken");
    if (!token) {
      toast.error("Reset token not found. Please request a new one.");
      navigate("/PassSend");
    }
    setResetToken(token);
  }, [navigate]);

  const initialValues = {
    newPassword: "",
  };

  const validationSchema = yup.object().shape({
    newPassword: yup
      .string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters")
      .max(12, "Password must not exceed 12 characters"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleResetPassword,
  });

  async function handleResetPassword(values) {
    if (!resetToken) {
      toast.error("Reset token not found. Please request a new one.");
      navigate("/PassSend");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/auth/reset-password",
        {
          resetToken,
          newPassword: values.newPassword,
        }
      );

      if (response.status === 200) {
        setSuccessMsg(true);
        toast.success("Password reset successfully!");
        localStorage.removeItem("resetToken"); // Clean up the token
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setErrorMsg("Failed to reset password. Please try again.");
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white-50 pt-35 pb-1">
      <form
        className="max-w-md mx-auto px-4 sm:px-8"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        {successMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
            Password reset successful! Redirecting to login...
          </div>
        )}
        {errorMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
            {errorMsg}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Reset Password
          </h2>

          {/* New Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
              placeholder=" "
            />
            <label
              htmlFor="newPassword"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              New Password
            </label>
            {formik.errors.newPassword && formik.touched.newPassword && (
              <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                {formik.errors.newPassword}
              </div>
            )}
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="text-white bg-rose-300 cursor-pointer hover:bg-rose-350 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
