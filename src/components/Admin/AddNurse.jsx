import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  fName: yup
    .string()
    .required("First name must be specified")
    .min(3, "First name is too short")
    .max(15, "First name is too long"),
  lName: yup
    .string()
    .required("Last name must be specified")
    .min(3, "Last name is too short")
    .max(15, "Last name is too long"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email is invalid"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Phone number must be 11 digits"),
  hospital: yup
    .string()
    .required("Hospital name must be provided")
    .trim(),
});

export default function AddNurse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/provider",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setProviders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error("Failed to fetch providers");
    }
  };

  const formik = useFormik({
    initialValues: {
      fName: "",
      lName: "",
      email: "",
      phone: "",
      hospital: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token is missing. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/nurse",
          {
            ...values,
            hospitalName: values.hospital
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          toast.success("Nurse added successfully");
          navigate("/admin/manage-nurses");
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error adding nurse:", error);
        if (error.response && error.response.data && error.response.data.errors) {
          const apiErrors = error.response.data.errors;
          const formikErrors = {};
          for (const field in apiErrors) {
            if (Array.isArray(apiErrors[field])) {
              if (apiErrors[field].length > 0) {
                formikErrors[field] = apiErrors[field][0].msg || apiErrors[field][0];
              }
            } else if (apiErrors[field] && typeof apiErrors[field].msg === "string") {
              formikErrors[field] = apiErrors[field].msg;
            } else if (typeof apiErrors[field] === "string") {
              formikErrors[field] = apiErrors[field];
            }
          }
          formik.setErrors(formikErrors);
          toast.error("Validation errors occurred.");
        } else if (error.response && error.response.data && typeof error.response.data.message === "string") {
          toast.error(error.response.data.message);
        } else if (error.response && typeof error.response.data === "string") {
          toast.error(error.response.data);
        } else {
          toast.error(`Failed to add nurse: ${error.response?.status || "Unknown Error"}`);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Nurse
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to add a new nurse.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="fName"
                  name="fName"
                  {...formik.getFieldProps("fName")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.fName && formik.errors.fName
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                  placeholder="Enter first name"
                />
                {formik.touched.fName && formik.errors.fName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.fName}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="lName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lName"
                  name="lName"
                  {...formik.getFieldProps("lName")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.lName && formik.errors.lName
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                  placeholder="Enter last name"
                />
                {formik.touched.lName && formik.errors.lName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.lName}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  {...formik.getFieldProps("email")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                  placeholder="Enter email address"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  {...formik.getFieldProps("phone")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                  placeholder="Enter phone number (11 digits)"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Hospital Selection */}
            <div>
              <label
                htmlFor="hospital"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Provider Name
              </label>
              <select
                id="hospital"
                name="hospital"
                {...formik.getFieldProps("hospital")}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.hospital && formik.errors.hospital
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
              >
                <option value="">Select a provider</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider.name}>
                    {provider.name}
                  </option>
                ))}
              </select>
              {formik.touched.hospital && formik.errors.hospital && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.hospital}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/manage-nurses")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-400 hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400"
              >
                {formik.isSubmitting ? "Adding..." : "Add Nurse"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 