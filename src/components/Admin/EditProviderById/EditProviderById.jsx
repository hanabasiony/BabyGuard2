import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import slugify from "slugify";

const EditProviderById = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFields, setEditingFields] = useState({});

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Provider name required")
      .min(2, "Provider name must be at least 2 characters")
      .max(100, "Provider name must be at most 100 characters"),
    phone: Yup.string()
      .required("Phone number required")
      .matches(
        /^(\+20|0)?1[0125][0-9]{8}$/,
        "Invalid phone number, only accept EG and SA phone numbers"
      ),
    city: Yup.string().required("City must have a value"),
    governorate: Yup.string().required("Governorate must have a value"),
    district: Yup.string().required("District must have a value"),
    workHours: Yup.string()
      .required("Work hours must have a value")
      .min(2, "Work hours must be at least 2 characters")
      .max(20, "Work hours must be at most 20 characters"),
  });

  useEffect(() => {
    fetchProviderData();
  }, [providerId]);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/provider",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Providers fetched successfully") {
        const foundProvider = response.data.data.find(
          (provider) => provider._id === providerId
        );
        if (foundProvider) {
          setProvider(foundProvider);
        } else {
          toast.error("Provider not found");
        }
      } else {
        toast.error("Failed to fetch provider data");
      }
    } catch (error) {
      console.error("Error fetching provider:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch provider data"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (field) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleCancelEdit = (field) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const handleSaveEdit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to perform this action");
        navigate("/login");
        return;
      }

      const updateData = { ...values };
      if (values.name) {
        updateData.slug = slugify(values.name, { lower: true });
      }

      const response = await axios.put(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/provider/${providerId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data) {
        toast.success("Provider data updated successfully");
        setProvider(response.data.data);
        setEditingFields({});
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to update provider data";
        toast.error(errorMessage);
        if (errorMessage.includes("already exists")) {
          setFieldError("name", errorMessage);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">Provider not found</div>
        </div>
      </div>
    );
  }

  const editableFields = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "governorate", label: "Governorate" },
    { key: "city", label: "City" },
    { key: "district", label: "District" },
    { key: "workHours", label: "Working Hours" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Edit Provider Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update provider details below
            </p>
          </div>
          <Formik
            initialValues={provider}
            validationSchema={validationSchema}
            onSubmit={handleSaveEdit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="border-t border-gray-200">
                <dl>
                  {editableFields.map(({ key, label }) => (
                    <div
                      key={key}
                      className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                    >
                      <dt className="text-sm font-medium text-gray-500">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {editingFields[key] ? (
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <Field
                                name={key}
                                type="text"
                                className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                                  errors[key] && touched[key]
                                    ? "border-red-500"
                                    : "border-gray-200"
                                } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 sm:text-sm`}
                                placeholder={`Enter ${label.toLowerCase()}`}
                              />
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelEdit(key)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Cancel
                              </button>
                            </div>
                            {errors[key] && touched[key] && (
                              <p className="text-sm text-red-600">
                                {errors[key]}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span>{provider[key]}</span>
                            <button
                              type="button"
                              onClick={() => handleEditClick(key)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditProviderById;
