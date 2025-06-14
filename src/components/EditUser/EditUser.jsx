import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import slugify from "slugify";

const API_URL = "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api";

function EditUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFields, setEditingFields] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Validation Schema
  const validationSchema = Yup.object().shape({
    fName: Yup.string()
      .required("First name is required")
      .min(3, "First name is too short")
      .max(15, "First name is too long"),
    lName: Yup.string()
      .required("Last name is required")
      .min(3, "Last name is too short")
      .max(15, "Last name is too long"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\+20[0-9]{10}$/, "Phone number must be in format: +20XXXXXXXXXX")
      .test('is-valid-egyptian', 'Invalid Egyptian phone number', value => {
        if (!value) return true;
        const number = value.replace('+20', '');
        return /^01[0125][0-9]{8}$/.test(number);
      }),
    birthDate: Yup.date()
      .max(new Date(), "Birth date cannot be in the future"),
    governorate: Yup.string(),
    city: Yup.string(),
    street: Yup.string(),
    buildingNumber: Yup.string(),
    apartmentNumber: Yup.string(),
    gender: Yup.string()
      .oneOf(["male", "female"], "Invalid gender"),
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === "success") {
        setUser(response.data.user);
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch user data");
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
    console.log('handleSaveEdit called with values:', values);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to perform this action");
        navigate("/login");
        return;
      }

      // Compare current values with new values and only include changed fields
      const changedValues = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== user[key]) {
          changedValues[key] = values[key];
        }
      });

      console.log('Changed values:', changedValues);

      // Generate slug if name is changed
      if (changedValues.fName || changedValues.lName) {
        changedValues.slug = slugify(
          `${changedValues.fName || user.fName}-${changedValues.lName || user.lName}-${Date.now()}`,
          { lower: true, trim: true, remove: /[^\w-]+/g }
        ).replace(/--+/g, "-").replace(/^-+|-+$/g, "");
      }

      // Only proceed if there are actual changes
      if (Object.keys(changedValues).length === 0) {
        toast.info("No changes to save");
        setEditingFields({});
        return;
      }

      console.log('Making API call with data:', changedValues);
      const response = await axios.put(
        `${API_URL}/user/me`,
        changedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response:', response);

      if (response.data.status === "success") {
        toast.success("Profile updated successfully");
        setUser(response.data.user);
        setEditingFields({});
      }
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const errorMessage = error.response?.data?.message || "Failed to update profile";
        toast.error(errorMessage);
        if (errorMessage.includes("already exists")) {
          setFieldError("email", errorMessage);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600">User not found</div>
        </div>
      </div>
    );
  }

  const editableFields = [
    { key: "fName", label: "First Name" },
    { key: "lName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "birthDate", label: "Birth Date" },
    { key: "gender", label: "Gender" },
    { key: "governorate", label: "Governorate" },
    { key: "city", label: "City" },
    { key: "street", label: "Street" },
    { key: "buildingNumber", label: "Building Number" },
    { key: "apartmentNumber", label: "Apartment Number" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 pt-36">
      <div className="max-w-7xl mx-auto pt-20">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Edit Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your personal details below
            </p>
          </div>
          <Formik
            initialValues={user}
            validationSchema={validationSchema}
            onSubmit={handleSaveEdit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting, handleSubmit, values }) => (
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
                                type={key === "birthDate" ? "date" : "text"}
                                className={`flex-1 px-4 py-2 rounded-lg border-2 ${
                                  errors[key] && touched[key]
                                    ? "border-red-500"
                                    : "border-gray-200"
                                } bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 sm:text-sm`}
                                placeholder={`Enter ${label.toLowerCase()}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  console.log('Save button clicked for field:', key);
                                  console.log('Current form values:', values);
                                  handleSaveEdit(values, { 
                                    setSubmitting: () => {}, 
                                    setFieldError: () => {} 
                                  });
                                }}
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
                            <span>{key === 'birthDate' ? formatDate(user[key]) : user[key]}</span>
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
}

export default EditUser;
