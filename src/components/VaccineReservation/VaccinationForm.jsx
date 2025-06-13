"use client";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Calendar } from "./Calendar";
import nurseimg from "../../assets/images/a nurse.jpg";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Form validation schema using Yup
const VaccinationSchema = Yup.object().shape({
  babyName: Yup.string().required("Baby's name is required"),
  appointmentDate: Yup.string().required("Please select an appointment date"),
});

export default function VaccinationForm() {
  const navigate = useNavigate();

  const { vaccineId } = useParams(); // Get vaccine ID from URL
  const [showCalendar, setShowCalendar] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    isSubmitting: false,
    success: false,
    error: null,
  });
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [childrenError, setChildrenError] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedChildBirthDate, setSelectedChildBirthDate] = useState("");
  const [showConfirmAddressError, setShowConfirmAddressError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setChildrenError("No authentication token found");
      setLoadingChildren(false);
      return;
    }
    // Fetch children from API
    axios
      .get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/child/me",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        const childrenData = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setChildren(childrenData);
        console.log("Children API response:", response.data);
        setLoadingChildren(false);
      })
      .catch((error) => {
        setChildrenError("Failed to load children list");
        setLoadingChildren(false);
      });
  }, []);

  useEffect(() => {
    // Fetch selected vaccine details
    if (vaccineId) {
      axios
        .get(
          `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccines/${vaccineId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          setSelectedVaccine(response.data.data);
        })
        .catch((error) => {
          console.error("Failed to load vaccine details:", error);
        });
    }
  }, [vaccineId]);

  useEffect(() => {
    // Get user data from API instead of localStorage
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/user/me",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.status === "success") {
          setUserData(response.data.user);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Initial form values
  const initialValues = {
    babyName: "",
    appointmentDate: null,
    confirmAddress: false,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmissionStatus({ isSubmitting: true, success: false, error: null });
    const requestBody = {
      childId: values.babyName,
      vaccineId: vaccineId, // Use the vaccine ID from URL params
      vaccinationDate: values.appointmentDate,
      phoneNumber: userData?.phoneNumber, // Include phone number from userData
      governorate: userData?.governorate, // Include governorate from userData
      city: userData?.city, // Include city from userData
      street: userData?.street, // Include street from userData
      buildingNumber: userData?.buildingNumber, // Include buildingNumber from userData
      apartmentNumber: userData?.apartmentNumber, // Include apartmentNumber from userData
    };
    axios
      .post(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccine-requests",
        requestBody,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        setSubmissionStatus({
          isSubmitting: false,
          success: true,
          error: null,
        });
        toast.success(
          response.data.message || "Appointment reserved successfully!"
        );
        resetForm();
        console.log(response);
        navigate("/childProfile");
      })
      .catch((error) => {
        setSubmissionStatus({
          isSubmitting: false,
          success: false,
          error: error.response?.data?.message || error.message,
        });
        console.log(error);
        toast.error(
          `Failed to reserve appointment: ${
            error.response?.data?.message || error.message
          }`
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-10">
      {/* Header Section */}
      <div className="relative">
        <div className="px-6 py-8 md:px-10 md:py-12 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0 md:mr-8 max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Book a Vaccination for Your Baby
              </h1>
              <p className="text-lg text-gray-600">
                Schedule a home nurse visit or clinic appointment with ease.
              </p>
              
              {selectedVaccine && (
                <div className="mt-4 p-4 bg-pink-50 rounded-lg">
                  <h3 className="font-semibold text-pink-700">
                    Selected Vaccine:
                  </h3>
                  <p className="text-gray-700">{selectedVaccine.name}</p>
                  <p className="text-gray-600">
                    Price: {selectedVaccine.price} EGP
                  </p>
                  <p className="text-gray-600">
                    Required Age: {selectedVaccine.requiredAge} months
                  </p>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 hidden md:block">
              <div className="relative">
                <img
                  src={nurseimg}
                  alt="Nurse with baby illustration"
                  className="h-56 w-56 object-contain rounded-full "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <Formik
        initialValues={initialValues}
        validationSchema={VaccinationSchema}
        onSubmit={async (values, actions) => {
          if (!values.confirmAddress) {
            setShowConfirmAddressError(true);
            actions.setSubmitting(false);
            return;
          }

          setShowConfirmAddressError(false);
          await handleSubmit(values, actions);
        }}
        enableReinitialize
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="px-6 pb-8 md:px-10 md:pb-12">
            {children.length === 0 && !loadingChildren && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  <span className="font-semibold">Note:</span> You need to register a child before booking a vaccination appointment. You can do this from your child profile page.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Baby's Name Field */}
              <div>
                <label
                  htmlFor="babyName"
                  className="block text-lg font-medium text-gray-900 mb-2"
                >
                  Baby's Name
                </label>
                {loadingChildren ? (
                  <div className="text-gray-500">Loading children...</div>
                ) : childrenError ? (
                  <div className="text-red-500">{childrenError}</div>
                ) : (
                  <Field
                    as="select"
                    id="babyName"
                    name="babyName"
                    className={`w-full px-4 py-3 border ${
                      errors.babyName && touched.babyName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white`}
                    onChange={(e) => {
                      setFieldValue("babyName", e.target.value);
                      const selectedChild = children.find(
                        (child) => (child._id || child.id) === e.target.value
                      );
                      if (selectedChild && selectedChild.birthDate) {
                        // Format the date to YYYY-MM-DD for the input type="date"
                        const date = new Date(selectedChild.birthDate);
                        const formattedDate = date.toISOString().split("T")[0];
                        setSelectedChildBirthDate(formattedDate);
                      } else {
                        setSelectedChildBirthDate("");
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select your baby
                    </option>
                    {Array.isArray(children) &&
                      children.map((child) => (
                        <option
                          key={child._id || child.id}
                          value={child._id || child.id}
                        >
                          {child.name || child.fullName || "Unnamed"}
                        </option>
                      ))}
                  </Field>
                )}
                <ErrorMessage
                  name="babyName"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              {/* Date of Birth Field */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-lg font-medium text-gray-900 mb-2"
                >
                  Date of Birth
                </label>
                <Field
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={selectedChildBirthDate} // Use the state variable for value
                  readOnly // Make the field read-only
                  className={`w-full px-4 py-3 border ${
                    errors.dateOfBirth && touched.dateOfBirth
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-100 cursor-not-allowed`}
                />
                {/* Removed ErrorMessage for dateOfBirth as it's now read-only */}
              </div>

              {/* Appointment Date Field */}
              <div>
                <p className="block text-lg font-medium text-gray-900 mb-2">
                  Preferred Date
                </p>
                <div className="relative">
                  {/* Date selection button */}
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`w-full px-4 py-3 border ${
                      !values.appointmentDate
                        ? "border-gray-300"
                        : "border-gray-300"
                    } rounded-md text-left focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white`}
                  >
                    {values.appointmentDate
                      ? values.appointmentDate
                      : "Select a date"}
                  </button>

                  {/* Calendar popup */}
                  {showCalendar && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                      <Calendar
                        onSelectDate={(date) => {
                          setFieldValue("appointmentDate", date);
                          setShowCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                {!values.appointmentDate && touched.appointmentDate && (
                  <div className="text-red-500 mt-1 text-sm">
                    Please select an appointment date
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Address and Phone Number Section */}
            {userData && (
              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm w-full ">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Delivery Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Governorate:</strong>{" "}
                    {userData.governorate || "Not set"}
                  </p>
                  <p>
                    <strong>City:</strong> {userData.city || "Not set"}
                  </p>
                  <p>
                    <strong>Street:</strong> {userData.street || "Not set"},{" "}
                    <strong>Building:</strong>{" "}
                    {userData.buildingNumber || "Not set"},{" "}
                    <strong>Apartment:</strong>{" "}
                    {userData.apartmentNumber || "Not set"}
                  </p>
                  <p>
                    <strong>Phone Number:</strong>{" "}
                    {userData.phoneNumber || "Not set"}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="confirmAddress"
                      name="confirmAddress"
                      checked={values.confirmAddress}
                      onChange={(e) => {
                        setFieldValue("confirmAddress", e.target.checked);
                        if (e.target.checked) {
                          setShowConfirmAddressError(false);
                        }
                      }}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="confirmAddress"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      I confirm this is my correct delivery address and phone
                      number.
                    </label>
                    {showConfirmAddressError && (
                      <span className="text-red-500 text-sm ml-2 p-1">
                        *delivery information must be confirmed*
                      </span>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => navigate("/edit-user")}
                    className="text-rose-500 hover:text-rose-600 text-sm font-medium flex items-center"
                  >
                    Change Address <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting || submissionStatus.isSubmitting}
                className={`w-full md:w-auto px-6 py-4 bg-rose-300 hover:bg-rose-400 text-white font-medium rounded-md transition duration-200 text-lg ${
                  isSubmitting || submissionStatus.isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting || submissionStatus.isSubmitting
                  ? "Reserving..."
                  : "Reserve Appointment"}
              </button>
            </div>

            {/* Error message */}
            {submissionStatus.error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                Error: {submissionStatus.error}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
