import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddChild = () => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(false);
    const navigate = useNavigate();

    const initialValues = {
        name: '',
        birthDate: '',
        gender: '',
        bloodType: 'A+',
        ssn: '',
        birthCertificate: null
    };
    const token = localStorage.getItem('token');
    
    const validationSchema = yup.object().shape({
        name: yup.string()
            .required("Child's name is required")
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name must not exceed 50 characters"),
        birthDate: yup.date()
            .required("Date of birth is required")
            .max(new Date(), "Date of birth cannot be in the future"),
        gender: yup.string()
            .required("Gender is required")
            .oneOf(["male", "female"], "Gender must be either 'male' or 'female'"),
        bloodType: yup.string()
            .required("Blood type is required")
            .oneOf(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-","i dont know"], "Please select a valid blood type"),
        ssn: yup.string()
            .required("Social security number is required")
            .matches(/^\d{14}$/, "Social security number must be exactly 14 digits"),
        birthCertificate: yup.mixed()
            .required("Birth certificate is required")
            .test("fileSize", "File size is too large", (value) => {
                if (!value) return true;
                return value.size <= 5000000; // 5MB
            })
            .test("fileType", "Unsupported file type", (value) => {
                if (!value) return true;
                return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
            })
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: 
        //  async (values) => {
        //     console.log(values);
        // }
        
        async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();
                Object.keys(values).forEach(key => {
                    formData.append(key, values[key]);
                });
                console.log(formData);

                const response = await axios.post('http://localhost:8000/api/child', formData,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSuccessMsg(true);
                setLoading(false);
                formik.resetForm();
                console.log(response);
                navigate('/childProfile');
                

                setTimeout(() => {
                    setSuccessMsg(false);
                }, 5000);
            } catch (error) {
                setLoading(false);
                if (error.response?.data?.errors) {
                    const errorData = error.response.data.errors;
                    const firstKey = Object.keys(errorData)[0];
                    setErrorMsg(errorData[firstKey].msg);
                }
                console.log(error);
                

                setTimeout(() => {
                    setErrorMsg(null);
                }, 5000);
            }
        }
    });

    return (
        <div className="min-h-screen bg-white-50 pt-24 pb-12">
            <form className="max-w-md mx-auto px-4 sm:px-8" onSubmit={formik.handleSubmit}>
                {successMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
                        Child added successfully!
                    </div>
                )}

                {errorMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
                        {errorMsg}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Child</h2>

                    {/* Child's Name */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Child's Name
                        </label>
                        {formik.errors.name && formik.touched.name && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-50 dark:text-red-400">
                                {formik.errors.name}
                            </div>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="date"
                            name="birthDate"
                            id="birthDate"
                            value={formik.values.birthDate}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="birthDate" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Date of Birth
                        </label>
                        {formik.errors.birthDate && formik.touched.birthDate && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-50 dark:text-red-400">
                                {formik.errors.birthDate}
                            </div>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="relative z-0 w-full mb-5 group">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    value="male"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500"
                                />
                                <label htmlFor="male" className="ml-2 text-sm font-medium text-gray-900">Male</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    value="female"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500"
                                />
                                <label htmlFor="female" className="ml-2 text-sm font-medium text-gray-900">Female</label>
                            </div>
                        </div>
                        {formik.errors.gender && formik.touched.gender && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-50 dark:text-red-400">
                                {formik.errors.gender}
                            </div>
                        )}
                    </div>

                    {/* Blood Type */}
                    {/* Removed blood type input as it's now hardcoded */}
                    {/*
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            name="bloodType"
                            id="bloodType"
                            value={formik.values.bloodType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="i dont know"> i dont know</option>
                        </select>
                        <label htmlFor="bloodType" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Blood Type
                        </label>
                        {formik.errors.bloodType && formik.touched.bloodType && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-50 dark:text-red-400">
                                {formik.errors.bloodType}
                            </div>
                        )}
                    </div>
                     */}


                    {/* Social Security Number */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="ssn"
                            id="ssn"
                            value={formik.values.ssn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="ssn" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Social Security Number
                        </label>
                        {formik.errors.ssn && formik.touched.ssn && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-50 dark:text-red-400">
                                {formik.errors.ssn}
                            </div>
                        )}
                    </div>

                    {/* Birth Certificate */}
                    <div className="relative z-0 w-full mb-5 group">
                        <div className='flex justify-center items-center w-full'>
                            <label htmlFor="birthCertificate" className="w-1/2 mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                                Birth Certificate
                            </label>
                            <input
                                type="file"
                                name="birthCertificate"
                                id="birthCertificate"
                                onChange={(event) => {
                                    formik.setFieldValue("birthCertificate", event.currentTarget.files[0]);
                                }}
                                onBlur={formik.handleBlur}
                                className="w-1/2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-white-700 p-1 dark:border-gray-600 dark:placeholder-gray-400"
                                accept="image/*"
                            />
                        </div>
                        {formik.errors.birthCertificate && formik.touched.birthCertificate && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-50 dark:text-red-400">
                                {formik.errors.birthCertificate}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="text-white bg-pink-400 cursor-pointer hover:bg-pink-500 focus:ring-4 focus:outline-none focus:ring-pink-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-pink-400 dark:hover:bg-pink-500 dark:focus:ring-pink-500"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Child'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddChild;
