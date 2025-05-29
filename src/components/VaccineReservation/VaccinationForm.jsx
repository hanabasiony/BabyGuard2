"use client"
import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Calendar } from "./Calendar"
import nurseimg from "../../assets/images/a nurse.jpg"

// Form validation schema using Yup
const VaccinationSchema = Yup.object().shape({
  babyName: Yup.string().required("Baby's name is required"),
  dateOfBirth: Yup.date().max(new Date(), "Date of birth cannot be in the future").required("Date of birth is required"),
  vaccinationType: Yup.string().required("Please select a vaccination type"),
  governorate: Yup.string().required("Governorate is required"),
  city: Yup.string().required("City is required"),
  street: Yup.string().required("Street is required"),
  buildingNumber: Yup.string().required("Building number is required"),
  apartmentNumber: Yup.string().required("Apartment number is required"),
  phoneNumber: Yup.string().matches(/^[0-9()+\-\s]+$/, "Invalid phone number format").required("Phone number is required"),
  notes: Yup.string(),
  appointmentDate: Yup.string().required("Please select an appointment date"),
})

export default function VaccinationForm() {
  // State to control calendar visibility
  const [showCalendar, setShowCalendar] = useState(false)

  // State to track form submission status
  const [submissionStatus, setSubmissionStatus] = useState({
    isSubmitting: false,
    success: false,
    error: null,
  })

  // State to store children fetched from API
  const [children, setChildren] = useState([])
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [childrenError, setChildrenError] = useState(null)

  // State to store vaccines fetched from API
  const [vaccines, setVaccines] = useState([])
  const [loadingVaccines, setLoadingVaccines] = useState(true)
  const [vaccinesError, setVaccinesError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setChildrenError("No authentication token found");
      setLoadingChildren(false);
      return;
    }
    // Fetch children from API
    axios.get("http://localhost:8000/api/child/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setChildren(
          Array.isArray(response.data.data) ? response.data.data : []
        );
        console.log("Children API response:", response.data);
        setLoadingChildren(false);
      })
      .catch((error) => {
        setChildrenError("Failed to load children list");
        setLoadingChildren(false);
      });
  }, []);


  useEffect(() => {
    // Fetch vaccines from API
    axios.get("http://localhost:8000/api/vaccines", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((response) => {
        setVaccines(Array.isArray(response.data) ? response.data : []);
        setLoadingVaccines(false);
      })
      .catch((error) => {
        setVaccinesError("Failed to load vaccines list");
        setLoadingVaccines(false);
      });
  }, []);

  // Initial form values
  const initialValues = {
    babyName: "",
    dateOfBirth: "",
    vaccinationType: "",
    governorate: "",
    city: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    phoneNumber: "",
    notes: "",
    appointmentDate: null,
  }

  /**
   * Handle form submission
   * @param {Object} values - Form values
   * @param {Object} formikBag - Formik helpers
   */
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmissionStatus({ isSubmitting: true, success: false, error: null });
    const requestBody = {
      childId: values.babyName,
      vaccineId: values.vaccinationType,
      vaccinationDate: values.appointmentDate,
      phoneNumber: values.phoneNumber,
      governorate: values.governorate,
      city: values.city,
      street: values.street,
      buildingNumber: values.buildingNumber,
      apartmentNumber: values.apartmentNumber,
      notes: values.notes,
    };
    axios.post("http://localhost:8000/api/vaccine-requests", requestBody, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        setSubmissionStatus({ isSubmitting: false, success: true, error: null });
        alert("Appointment reserved successfully!");
        resetForm();
      })
      .catch((error) => {
        setSubmissionStatus({
          isSubmitting: false,
          success: false,
          error: error.response?.data?.message || error.message,
        });
        alert(`Failed to reserve appointment: ${error.response?.data?.message || error.message}`);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-10">
      {/* Header Section */}
      <div className="relative">
        <div className="px-6 py-8 md:px-10 md:py-12 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0 md:mr-8 max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Book a Vaccination for Your Baby</h1>
              <p className="text-lg text-gray-600">Schedule a home nurse visit or clinic appointment with ease.</p>
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
      <Formik initialValues={initialValues} validationSchema={VaccinationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="px-6 pb-8 md:px-10 md:pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Baby's Name Field */}
              <div>
                <label htmlFor="babyName" className="block text-lg font-medium text-gray-900 mb-2">
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
                      errors.babyName && touched.babyName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white`}
                  >
                    <option value="" disabled>Select your baby</option>
                    {Array.isArray(children) && children.map((child) => (
                      <option key={child._id || child.id} value={child._id || child.id}>{child.name || child.fullName || "Unnamed"}</option>
                    ))}
                  </Field>
                )}
                <ErrorMessage name="babyName" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Date of Birth Field */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-lg font-medium text-gray-900 mb-2">
                  Date of Birth
                </label>
                <Field
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className={`w-full px-4 py-3 border ${
                    errors.dateOfBirth && touched.dateOfBirth ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
                <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Vaccination Type Field */}
              <div>
                <label htmlFor="vaccinationType" className="block text-lg font-medium text-gray-900 mb-2">
                  Vaccination Type
                </label>
                <Field
                  as="select"
                  id="vaccinationType"
                  name="vaccinationType"
                  className={`w-full px-4 py-3 border ${
                    errors.vaccinationType && touched.vaccinationType ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none bg-white`}
                >
                  <option value="" disabled>Select a vaccine type</option>
                  {Array.isArray(vaccines) && vaccines.map((vaccine) => (
                    <option key={vaccine._id || vaccine.id} value={vaccine._id || vaccine.id}>{vaccine.name || vaccine.title}</option>
                  ))}
                </Field>
                <ErrorMessage name="vaccinationType" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Governorate */}
              <div>
                <label htmlFor="governorate" className="block text-lg font-medium text-gray-900 mb-2">Governorate</label>
                <Field type="text" id="governorate" name="governorate" className={`w-full px-4 py-3 border ${errors.governorate && touched.governorate ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                <ErrorMessage name="governorate" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-lg font-medium text-gray-900 mb-2">City</label>
                <Field type="text" id="city" name="city" className={`w-full px-4 py-3 border ${errors.city && touched.city ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                <ErrorMessage name="city" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Street */}
              <div>
                <label htmlFor="street" className="block text-lg font-medium text-gray-900 mb-2">Street</label>
                <Field type="text" id="street" name="street" className={`w-full px-4 py-3 border ${errors.street && touched.street ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                <ErrorMessage name="street" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Building Number */}
              <div>
                <label htmlFor="buildingNumber" className="block text-lg font-medium text-gray-900 mb-2">Building Number</label>
                <Field type="text" id="buildingNumber" name="buildingNumber" className={`w-full px-4 py-3 border ${errors.buildingNumber && touched.buildingNumber ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                <ErrorMessage name="buildingNumber" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Apartment Number */}
              <div>
                <label htmlFor="apartmentNumber" className="block text-lg font-medium text-gray-900 mb-2">Apartment Number</label>
                <Field type="text" id="apartmentNumber" name="apartmentNumber" className={`w-full px-4 py-3 border ${errors.apartmentNumber && touched.apartmentNumber ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                <ErrorMessage name="apartmentNumber" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-lg font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <Field
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+20 10X XXX XXXX"
                  className={`w-full px-4 py-3 border ${
                    errors.phoneNumber && touched.phoneNumber ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500`}
                />
                <ErrorMessage name="phoneNumber" component="div" className="text-red-500 mt-1 text-sm" />
              </div>

              {/* Appointment Date Field */}
              <div>
                <p className="block text-lg font-medium text-gray-900 mb-2">Preferred Date & Time</p>
                <div className="relative">
                  {/* Date selection button */}
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`w-full px-4 py-3 border ${
                      !values.appointmentDate ? "border-gray-300" : "border-gray-300"
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
                          setFieldValue("appointmentDate", date)
                          setShowCalendar(false)
                        }}
                      />
                    </div>
                  )}
                </div>
                {!values.appointmentDate && touched.appointmentDate && (
                  <div className="text-red-500 mt-1 text-sm">Please select an appointment date</div>
                )}
              </div>

              {/* Notes Field */}
              <div>
                <label htmlFor="notes" className="block text-lg font-medium text-gray-900 mb-2">
                  Notes (Optional)
                </label>
                <Field
                  as="textarea"
                  id="notes"
                  name="notes"
                  placeholder="Any special requirements or information"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting || submissionStatus.isSubmitting}
                className={`w-full md:w-auto px-6 py-4 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-md transition duration-200 text-lg ${
                  isSubmitting || submissionStatus.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting || submissionStatus.isSubmitting ? "Reserving..." : "Reserve Appointment"}
              </button>
            </div>

            {/* Error message */}
            {submissionStatus.error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">Error: {submissionStatus.error}</div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

