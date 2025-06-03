import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';
import { useFormik } from 'formik';

const yourValidationSchema = yup.object().shape({
    name: yup.string()
        .required("Provider name required")
        .min(2, "Provider name must be at least 2 characters")
        .max(100, "Provider name must be at most 100 characters"),

    phone: yup.string()
        .required("Phone number required")
        // Note: yup doesn't have built-in country-specific validation like express-validator.
        // This regex is a basic example; more robust phone validation might require a library
        // or relying heavily on backend validation.
        .matches(/^\+?[0-9]{10,}$/, "Invalid phone number format"), // Basic check for digits and length

    city: yup.string()
        .required("city must have a value"), // Changed from notEmpty to required

    governorate: yup.string()
        .required("gov must have a value"), // Changed from notEmpty to required

    district: yup.string()
        .required("district must have a value"), // Changed from notEmpty to required

    workHours: yup.string()
        .required("work hours must have a value")
        .min(2, "work hours must be at least 2 characters")
        .max(20, "work hours must be at most 20 characters"), // Using 20 based on your text description
});

export default function AddProvider() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Initialize formik
    const formik = useFormik({
        initialValues: {
            name: '',
            phone: '',
            city: '',
            governorate: '',
            district: '',
            workHours: ''
        },
        validationSchema: yourValidationSchema,
        onSubmit: async (values) => {
            setLoading(true);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Authentication token is missing. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await axios.post(
                    'http://localhost:8000/api/provider/admin/add',
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 201) {
                    toast.success('Provider added successfully');
                    navigate('/admin/providers');
                    console.log(response.data);
                }
            } catch (error) {
                console.error('Error adding provider:', error);
                if (error.response && error.response.data && error.response.data.errors) {
                    const apiErrors = error.response.data.errors;
                    const formikErrors = {};
                    for (const field in apiErrors) {
                        if (Array.isArray(apiErrors[field])) {
                            if (apiErrors[field].length > 0) {
                                formikErrors[field] = apiErrors[field][0].msg || apiErrors[field][0];
                            }
                        } else if (apiErrors[field] && typeof apiErrors[field].msg === 'string'){
                            formikErrors[field] = apiErrors[field].msg;
                        } else if (typeof apiErrors[field] === 'string') {
                            formikErrors[field] = apiErrors[field];
                        }
                    }
                    formik.setErrors(formikErrors);
                    toast.error('Validation errors occurred.');
                } else if (error.response && error.response.data && typeof error.response.data.message === 'string') {
                    toast.error(error.response.data.message);
                } else if (error.response && typeof error.response.data === 'string') {
                    toast.error(error.response.data);
                } else {
                    toast.error(`Failed to add provider: ${error.response?.status || 'Unknown Error'}`);
                }
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Add New Provider</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Fill in the details below to add a new healthcare provider.
                        </p>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        {/* Provider Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Provider Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                {...formik.getFieldProps('name')}
                                className={`w-full px-3 py-2 border rounded-md ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500`}
                                placeholder="e.g., Health Ministry"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                {...formik.getFieldProps('phone')}
                                className={`w-full px-3 py-2 border rounded-md ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500`}
                                placeholder="e.g., +201012345678"
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                            )}
                        </div>

                        {/* Location Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="governorate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Governorate
                                </label>
                                <input
                                    type="text"
                                    id="governorate"
                                    name="governorate"
                                    {...formik.getFieldProps('governorate')}
                                    className={`w-full px-3 py-2 border rounded-md ${formik.touched.governorate && formik.errors.governorate ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500`}
                                    placeholder="e.g., Cairo"
                                />
                                {formik.touched.governorate && formik.errors.governorate && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.governorate}</div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    {...formik.getFieldProps('city')}
                                    className={`w-full px-3 py-2 border rounded-md ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500`}
                                    placeholder="e.g., Cairo"
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.city}</div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                    District
                                </label>
                                <input
                                    type="text"
                                    id="district"
                                    name="district"
                                    {...formik.getFieldProps('district')}
                                    className={`w-full px-3 py-2 border rounded-md ${formik.touched.district && formik.errors.district ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500`}
                                    placeholder="e.g., Nasr City"
                                />
                                {formik.touched.district && formik.errors.district && (
                                    <div className="text-red-500 text-xs mt-1">{formik.errors.district}</div>
                                )}
                            </div>
                        </div>

                        {/* Work Hours */}
                        <div>
                            <label htmlFor="workHours" className="block text-sm font-medium text-gray-700 mb-1">
                                Work Hours
                            </label>
                            <input
                                type="text"
                                id="workHours"
                                name="workHours"
                                {...formik.getFieldProps('workHours')}
                                className={`w-full px-3 py-2 border rounded-md ${formik.touched.workHours && formik.errors.workHours ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500`}
                                placeholder="e.g., 9 AM to 5 PM"
                            />
                            {formik.touched.workHours && formik.errors.workHours && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.workHours}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/providers')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                {formik.isSubmitting ? 'Adding...' : 'Add Provider'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 