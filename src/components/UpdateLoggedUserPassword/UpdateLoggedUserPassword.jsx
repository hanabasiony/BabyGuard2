import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as yup from "yup";

export default function UpdateLoggedUserPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Define validation schema using yup
  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .required("New password is required")
      .min(8, "New password must be at least 8 characters") // Recommended minimum length
      .max(20, "New password cannot exceed 20 characters"), // Recommended maximum length
    passwordConfirm: yup
      .string()
      .required("Confirm new password is required")
      .oneOf([yup.ref("newPassword"), null], "New passwords must match"), // Must match newPassword
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(false);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.put(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/auth/updatePassword",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Password update successful:", response.data);
        setSuccessMsg(true);
        toast.success("Password updated successfully!");
        // Optionally reset form or navigate
        // formik.resetForm();
        // navigate('/settings');
      } catch (error) {
        console.error("Password update API error:", error);
        if (error.response) {
          if (error.response.data && error.response.data.errors) {
            // Handle validation errors from API with 'errors' object
            const apiErrors = error.response.data.errors;
            // Assuming API errors match field names, update formik errors
            const formikErrors = {};
            for (const field in apiErrors) {
              if (Array.isArray(apiErrors[field])) {
                // Take the first message for simplicity in formik
                if (apiErrors[field].length > 0) {
                  formikErrors[field] =
                    apiErrors[field][0].msg || apiErrors[field][0];
                }
              } else if (
                apiErrors[field] &&
                typeof apiErrors[field].msg === "string"
              ) {
                formikErrors[field] = apiErrors[field].msg;
              } else if (typeof apiErrors[field] === "string") {
                formikErrors[field] = apiErrors[field];
              }
            }
            formik.setErrors(formikErrors);
            // Also display a generic error toast for API validation failures
            toast.error("Validation errors occurred.");
          } else if (
            error.response.data &&
            typeof error.response.data.message === "string"
          ) {
            // Handle other API errors with a simple message string
            toast.error(error.response.data.message);
            setErrorMsg(error.response.data.message); // Set for potential form-level display
          } else if (typeof error.response.data === "string") {
            // Handle cases where response data is just a string (like the 401 login error)
            toast.error(error.response.data);
            setErrorMsg(error.response.data); // Set for potential form-level display
          } else {
            // Fallback for unexpected API response structure
            toast.error(`Password update failed: ${error.response.status}`);
            setErrorMsg(`Password update failed: ${error.response.status}`); // Set for potential form-level display
          }
        } else {
          // Handle network errors or other issues without response
          toast.error("Password update failed. Please check your connection.");
          setErrorMsg("Password update failed. Please check your connection."); // Set for potential form-level display
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white-50 pt-35 pb-1">
      <form
        className="max-w-md mx-auto px-4 sm:px-8"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        {successMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
            Password updated successfully!
          </div>
        )}
        {errorMsg && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
            {errorMsg}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Update Password
          </h2>

          {/* Old Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              {...formik.getFieldProps("oldPassword")}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              autoComplete="current-password"
            />
            <label
              htmlFor="oldPassword"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Current Password
            </label>
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <div className="p-2 mt-2 text-center text-xs text-red-800 rounded-lg bg-red-50">
                {formik.errors.oldPassword}
              </div>
            )}
          </div>

          {/* New Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              {...formik.getFieldProps("newPassword")}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              autoComplete="new-password"
            />
            <label
              htmlFor="newPassword"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              New Password
            </label>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="p-2 mt-2 text-center text-xs text-red-800 rounded-lg bg-red-50">
                {formik.errors.newPassword}
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              {...formik.getFieldProps("passwordConfirm")}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
              autoComplete="new-password"
            />
            <label
              htmlFor="passwordConfirm"
              className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm New Password
            </label>
            {formik.touched.passwordConfirm &&
              formik.errors.passwordConfirm && (
                <div className="p-2 mt-2 text-center text-xs text-red-800 rounded-lg bg-red-50">
                  {formik.errors.passwordConfirm}
                </div>
              )}
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="text-white bg-rose-300 cursor-pointer hover:bg-rose-350 focus:ring-4 focus:outline-none focus:ring-rose-350 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
