import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import slugify from "slugify";

// Validation Schema
const validationSchema = Yup.object().shape({
  fName: Yup.string()
    .min(3, "First name is too short")
    .max(15, "First name is too long"),
  lName: Yup.string()
    .min(3, "Last name is too short")
    .max(15, "Last name is too long"),
  email: Yup.string()
    .email("Email is invalid"),
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
  password: Yup.string()
    .min(6, "Password must be at least 6 characters"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function EditUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFields, setEditingFields] = useState({});

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

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setUser(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to fetch user data");
        console.error("Error fetching user:", error);
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

  const handleSaveEdit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to perform this action");
        navigate("/login");
        return;
      }

      // Only include changed fields in the request
      const changedValues = {};
      Object.keys(values).forEach(key => {
        if (values[key] !== user[key]) {
          changedValues[key] = values[key];
        }
      });

      // Generate slug if both fName and lName are being updated
      if (changedValues.fName && changedValues.lName) {
        changedValues.slug = slugify(
          `${changedValues.fName}-${changedValues.lName}-${Date.now()}`,
          {
            lower: true,
            trim: true,
            remove: /[^\w-]+/g,
          }
        )
          .replace(/--+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      const response = await axios.put(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/user/me",
        changedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Profile updated successfully");
        setUser(response.data.user);
        setEditingFields({});
        resetForm({ values: response.data.user });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          toast.error(`${field}: ${errors[field].msg}`);
        });
      } else {
        toast.error("Failed to update profile");
        console.error("Error updating user:", error);
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
    { key: "fName", label: "First Name", type: "text" },
    { key: "lName", label: "Last Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phoneNumber", label: "Phone Number", type: "tel" },
    { key: "birthDate", label: "Birth Date", type: "date" },
    { key: "gender", label: "Gender", type: "select", options: ["male", "female"] },
    { key: "governorate", label: "Governorate", type: "text" },
    { key: "city", label: "City", type: "text" },
    { key: "street", label: "Street", type: "text" },
    { key: "buildingNumber", label: "Building Number", type: "text" },
    { key: "apartmentNumber", label: "Apartment Number", type: "text" },
    // { key: "password", label: "Password", type: "password" },
    // { key: "passwordConfirm", label: "Confirm Password", type: "password" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 py-20">
      <div className="max-w-7xl mx-auto mt-30">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update your personal information
              </p>
            </div>
            <button
              onClick={() => navigate("/settings")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Back to Settings
            </button>
          </div>
          <Formik
            initialValues={user}
            validationSchema={validationSchema}
            onSubmit={handleSaveEdit}
            enableReinitialize
          >
            {({ isSubmitting, dirty }) => (
              <Form>
                <div className="border-t border-gray-200">
                  <dl>
                    {editableFields.map(({ key, label, type, options }) => (
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
                              {type === "select" ? (
                                <Field
                                  as="select"
                                  name={key}
                                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-colors duration-200 sm:text-sm"
                                >
                                  <option value="">Select {label}</option>
                                  {options.map(option => (
                                    <option key={option} value={option}>
                                      {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                  ))}
                                </Field>
                              ) : (
                                <Field
                                  type={type}
                                  name={key}
                                  className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 transition-colors duration-200 sm:text-sm"
                                  placeholder={`Enter ${label.toLowerCase()}`}
                                />
                              )}
                              <ErrorMessage
                                name={key}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                              <div className="flex space-x-2">
                                <button
                                  type="submit"
                                  disabled={isSubmitting || !dirty}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-rose-400 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                                >
                                  {isSubmitting ? "Saving..." : "Save"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCancelEdit(key)}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <span>{user[key]}</span>
                              <button
                                type="button"
                                onClick={() => handleEditClick(key)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-rose-700 bg-rose-100 hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
