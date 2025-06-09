import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as yup from "yup";

// Define validation schema using yup
const vaccineValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name must be provided")
    .min(2, "Name must be between 2 and 100 characters")
    .max(100, "Name must be between 2 and 100 characters"),

  description: yup
    .string()
    .required("Description must be provided")
    .min(20, "Description must be between 20 and 1000 characters")
    .max(1000, "Description must be between 20 and 1000 characters"),

  requiredAge: yup
    .string()
    .required("Required age must be provided")
    .oneOf(
      [
        "No specific age required",
        "24 hours",
        "6 weeks",
        "10 weeks",
        "14 weeks",
        "2 months",
        "3 months",
        "4 months",
        "6 months",
        "8 months",
        "9 months",
        "1 year",
        "1 year and 3 months",
        "1 year and 6 months",
        "1 year and 9 months",
        "2 years",
        "2 years and 3 months",
        "2 years and 6 months",
        "2 years and 9 months",
        "3 years",
        "3 years and 3 months",
        "3 years and 6 months",
        "3 years and 9 months",
        "4 years",
        "9 years",
        "9 years and 3 months"
      ],
      "'{value}' is not a valid age requirement. Please choose from the predefined age options."
    ),

  price: yup
    .number()
    .required("Price must be provided")
    .min(0, "Price can't be negative")
    .typeError("Price must be a number"),

  provider: yup
    .string()
    .required("Provider must be provided")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid provider ID format"),
});

export default function AddVaccine() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in.");
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

      if (response.data.message === "Providers fetched successfully") {
        setProviders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error("Failed to fetch providers");
    } finally {
      setLoadingProviders(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      requiredAge: "",
      price: "",
      provider: "",
    },
    validationSchema: vaccineValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token is missing. Please log in.");
          return;
        }

        const response = await axios.post(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccines/admin",
          {
            name: values.name,
            description: values.description,
            requiredAge: values.requiredAge,
            price: Number(values.price),
            provider: values.provider
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          setSuccessMsg(true);
          formik.resetForm();

          setTimeout(() => {
            setSuccessMsg(false);
            navigate("/admin/vaccinations");
          }, 2000);
        }
      } catch (error) {
        console.error("Error adding vaccine:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const apiErrors = error.response.data.errors;
          const formikErrors = {};
          for (const field in apiErrors) {
            if (Array.isArray(apiErrors[field])) {
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
          setErrorMsg("Validation errors occurred.");
        } else if (
          error.response &&
          error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          setErrorMsg(error.response.data.message);
        } else if (error.response && typeof error.response.data === "string") {
          setErrorMsg(error.response.data);
        } else {
          setErrorMsg(
            `Failed to add vaccine: ${
              error.response?.status || "Unknown Error"
            }`
          );
        }

        setTimeout(() => {
          setErrorMsg(null);
        }, 5000);
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
              Add New Vaccine
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the details below to add a new vaccine.
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Provider Selection */}
            <div>
              <label
                htmlFor="provider"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Provider
              </label>
              <select
                id="provider"
                name="provider"
                value={formik.values.provider}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.provider && formik.errors.provider
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                disabled={loadingProviders}
              >
                <option value="">Select a Provider</option>
                {providers.map((provider) => (
                  <option key={provider._id} value={provider._id}>
                    {provider.name} - {provider.city}, {provider.governorate}
                  </option>
                ))}
              </select>
              {formik.touched.provider && formik.errors.provider && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.provider}
                </div>
              )}
              {loadingProviders && (
                <div className="text-blue-500 text-xs mt-1">
                  Loading providers...
                </div>
              )}
            </div>

            {/* Vaccine Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vaccine Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                placeholder="Enter vaccine name"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                placeholder="Enter vaccine description"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.description}
                </div>
              )}
            </div>

            {/* Required Age */}
            <div>
              <label
                htmlFor="requiredAge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Required Age
              </label>
              <select
                id="requiredAge"
                name="requiredAge"
                value={formik.values.requiredAge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.requiredAge && formik.errors.requiredAge
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
              >
                <option value="">Select Required Age</option>
                <option value="No specific age required">No specific age required</option>
                <option value="24 hours">24 hours</option>
                <option value="6 weeks">6 weeks</option>
                <option value="10 weeks">10 weeks</option>
                <option value="14 weeks">14 weeks</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="4 months">4 months</option>
                <option value="6 months">6 months</option>
                <option value="8 months">8 months</option>
                <option value="9 months">9 months</option>
                <option value="1 year">1 year</option>
                <option value="1 year and 3 months">1 year and 3 months</option>
                <option value="1 year and 6 months">1 year and 6 months</option>
                <option value="1 year and 9 months">1 year and 9 months</option>
                <option value="2 years">2 years</option>
                <option value="2 years and 3 months">2 years and 3 months</option>
                <option value="2 years and 6 months">2 years and 6 months</option>
                <option value="2 years and 9 months">2 years and 9 months</option>
                <option value="3 years">3 years</option>
                <option value="3 years and 3 months">3 years and 3 months</option>
                <option value="3 years and 6 months">3 years and 6 months</option>
                <option value="3 years and 9 months">3 years and 9 months</option>
                <option value="4 years">4 years</option>
                <option value="9 years">9 years</option>
                <option value="9 years and 3 months">9 years and 3 months</option>
              </select>
              {formik.touched.requiredAge && formik.errors.requiredAge && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.requiredAge}
                </div>
              )}
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (EGP)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md ${
                  formik.touched.price && formik.errors.price
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400`}
                placeholder="Enter price"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.price}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/vaccinations")}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingProviders}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-400 hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400"
              >
                {loading ? "Adding..." : "Add Vaccine"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
