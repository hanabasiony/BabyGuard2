import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Define validation schema using yup
const vaccineValidationSchema = yup.object().shape({
    name: yup.string()
        .required("Name must be provided")
        .min(2, "Name must be between 2 and 100 characters")
        .max(100, "Name must be between 2 and 100 characters"),

    description: yup.string()
        .required("Description must be provided")
        .min(20, "Description must be between 20 and 1000 characters")
        .max(1000, "Description must be between 20 and 1000 characters"),

    requiredAge: yup.string()
        .required("Required age must be provided")
        .oneOf([
            "No specific age required",
            "3 months",
            "6 months",
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
        ], "'{value}' is not a valid age requirement. Please choose from the predefined age options."),

    price: yup.number()
        .required("Price must be provided")
        .min(0, "Price can't be negative")
        .typeError("Price must be a number"),

    provider: yup.string()
        .required("Provider must be provided"),
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
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token is missing. Please log in.');
                return;
            }

            const response = await axios.get('http://localhost:8000/api/provider', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.message === 'Providers fetched successfully') {
                setProviders(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching providers:', error);
            toast.error('Failed to fetch providers');
        } finally {
            setLoadingProviders(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            requiredAge: '',
            price: '',
            provider: '',
        },
        validationSchema: vaccineValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Authentication token is missing. Please log in.');
                    return;
                }

                const response = await axios.post(
                    'http://localhost:8000/api/vaccines/admin',
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 201) {
                    setSuccessMsg(true);
                    formik.resetForm();
                    
                    setTimeout(() => {
                        setSuccessMsg(false);
                        navigate('/admin/vaccinations');
                    }, 2000);
                }
            } catch (error) {
                console.error('Error adding vaccine:', error);
                if (error.response && error.response.data && error.response.data.errors) {
                    const apiErrors = error.response.data.errors;
                    const formikErrors = {};
                    for (const field in apiErrors) {
                        if (Array.isArray(apiErrors[field])) {
                            if (apiErrors[field].length > 0) {
                                formikErrors[field] = apiErrors[field][0].msg || apiErrors[field][0];
                            }
                        } else if (apiErrors[field] && typeof apiErrors[field].msg === 'string') {
                            formikErrors[field] = apiErrors[field].msg;
                        } else if (typeof apiErrors[field] === 'string') {
                            formikErrors[field] = apiErrors[field];
                        }
                    }
                    formik.setErrors(formikErrors);
                    setErrorMsg('Validation errors occurred.');
                } else if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                    setErrorMsg(error.response.data.message);
                } else if (error.response && typeof error.response.data === 'string') {
                    setErrorMsg(error.response.data);
                } else {
                    setErrorMsg(`Failed to add vaccine: ${error.response?.status || 'Unknown Error'}`);
                }
                
                setTimeout(() => {
                    setErrorMsg(null);
                }, 5000);
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-white-50 pt-24 pb-12">
            <form className="max-w-2xl mx-auto px-4 sm:px-8" onSubmit={formik.handleSubmit}>
                {successMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
                        Vaccine added successfully!
                    </div>
                )}

                {errorMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
                        {errorMsg}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Vaccine</h2>

                    {/* Provider Selection */}
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            id="provider"
                            name="provider"
                            value={formik.values.provider}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            disabled={loadingProviders}
                        >
                            <option value="">Select a Provider</option>
                            {providers.map((provider) => (
                                <option key={provider._id} value={provider._id}>
                                    {provider.name} - {provider.city}, {provider.governorate}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="provider" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Provider
                        </label>
                        {formik.errors.provider && formik.touched.provider && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.provider}
                            </div>
                        )}
                        {loadingProviders && (
                            <div className="p-4 mt-2 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50">
                                Loading providers...
                            </div>
                        )}
                    </div>

                    {/* Vaccine Name */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Vaccine Name
                        </label>
                        {formik.errors.name && formik.touched.name && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.name}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="relative z-0 w-full mb-5 group">
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="description" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Description
                        </label>
                        {formik.errors.description && formik.touched.description && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.description}
                            </div>
                        )}
                    </div>

                    {/* Required Age */}
                    <div className="relative z-0 w-full mb-5 group">
                        <select
                            id="requiredAge"
                            name="requiredAge"
                            value={formik.values.requiredAge}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        >
                            <option value="">Select Required Age</option>
                            <option value="No specific age required">No specific age required</option>
                            <option value="3 months">3 months</option>
                            <option value="6 months">6 months</option>
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
                        </select>
                        <label htmlFor="requiredAge" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Required Age
                        </label>
                        {formik.errors.requiredAge && formik.touched.requiredAge && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.requiredAge}
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            id="price"
                            name="price"
                            step="0.01"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="price" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Price (EGP)
                        </label>
                        {formik.errors.price && formik.touched.price && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.price}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading || loadingProviders}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding Vaccine...' : 'Add Vaccine'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
} 