import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProductPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(false);
    const navigate = useNavigate();

    const initialValues = {
        name: '',
        price: '',
        description: [''],
        quantity: '',
        image: null,
        features: [''],
        requiredAge: ''
    };

    const validationSchema = yup.object().shape({
        name: yup.string()
            .required("Product name is required")
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),
        price: yup.number()
            .required("Price is required")
            .positive("Price must be positive")
            .min(0, "Price must be positive"),
        description: yup.array()
            .of(yup.string()
                .min(3, "Description must be at least 3 characters")
                .max(250, "Description must not exceed 250 characters"))
            .min(1, "At least one description is required")
            .max(10, "Maximum 10 descriptions allowed"),
        quantity: yup.number()
            .required("Quantity is required")
            .integer("Quantity must be a whole number")
            .min(0, "Quantity must be positive"),
        requiredAge: yup.string()
            .required("Required age is required")
            .min(5, "Required age must be at least 5 characters")
            .max(30, "Required age must not exceed 30 characters"),
        image: yup.mixed()
            .required("Product image is required")
            .test("fileSize", "File size is too large", (value) => {
                if (!value) return true;
                return value.size <= 5000000; // 5MB
            })
            .test("fileType", "Unsupported file type", (value) => {
                if (!value) return true;
                return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
            }),
        features: yup.array()
            .of(yup.string()
                .min(3, "Feature must be at least 3 characters")
                .max(250, "Feature must not exceed 250 characters"))
            .min(1, "At least one feature is required")
            .max(10, "Maximum 10 features allowed")
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('price', values.price);
                formData.append('quantity', values.quantity);
                formData.append('requiredAge', values.requiredAge);
                formData.append('image', values.image);
                
                // Append each description individually to maintain array structure
                values.description.forEach((desc, index) => {
                    formData.append(`description[${index}]`, desc);
                });
                
                // Append each feature individually to maintain array structure
                values.features.forEach((feature, index) => {
                    formData.append(`features[${index}]`, feature);
                });

                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:8000/api/products/admin/add', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 201) {
                    setSuccessMsg(true);
                    formik.resetForm();
                    console.log('Product added successfully');
                    
                    setTimeout(() => {
                        setSuccessMsg(false);
                        navigate('/admin/product-store');
                    }, 2000);
                }
            } catch (error) {
                setErrorMsg(error.response?.data?.message || "Failed to add product. Please try again.");
                setTimeout(() => {
                    setErrorMsg(null);
                }, 5000);
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    });

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formik.values.features];
        newFeatures[index] = value;
        formik.setFieldValue('features', newFeatures);
    };

    const handleDescriptionChange = (index, value) => {
        const newDescriptions = [...formik.values.description];
        newDescriptions[index] = value;
        formik.setFieldValue('description', newDescriptions);
    };

    const addFeature = () => {
        if (formik.values.features.length < 10) {
            formik.setFieldValue('features', [...formik.values.features, '']);
        }
    };

    const addDescription = () => {
        if (formik.values.description.length < 10) {
            formik.setFieldValue('description', [...formik.values.description, '']);
        }
    };

    const removeFeature = (index) => {
        const newFeatures = formik.values.features.filter((_, i) => i !== index);
        formik.setFieldValue('features', newFeatures);
    };

    const removeDescription = (index) => {
        const newDescriptions = formik.values.description.filter((_, i) => i !== index);
        formik.setFieldValue('description', newDescriptions);
    };

    return (
        <div className="min-h-screen bg-white-50 pt-24 pb-12">
            <form className="max-w-2xl mx-auto px-4 sm:px-8" onSubmit={formik.handleSubmit}>
                {successMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
                        Product added successfully!
                    </div>
                )}

                {errorMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
                        {errorMsg}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Product</h2>

                    {/* Product Name */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Product Name
                        </label>
                        {formik.errors.name && formik.touched.name && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.name}
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="price" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Price
                        </label>
                        {formik.errors.price && formik.touched.price && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.price}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        {formik.values.description.map((desc, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={desc}
                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    className="flex-1 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder="Enter description"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeDescription(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {formik.errors.description && formik.touched.description && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.description}
                            </div>
                        )}
                        {formik.values.description.length < 10 && (
                            <button
                                type="button"
                                onClick={addDescription}
                                className="mt-2 text-rose-500 hover:text-rose-600"
                            >
                                Add Description
                            </button>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            name="quantity"
                            id="quantity"
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="quantity" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Quantity
                        </label>
                        {formik.errors.quantity && formik.touched.quantity && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.quantity}
                            </div>
                        )}
                    </div>

                    {/* Required Age */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="requiredAge"
                            id="requiredAge"
                            value={formik.values.requiredAge}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="requiredAge" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Required Age
                        </label>
                        {formik.errors.requiredAge && formik.touched.requiredAge && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.requiredAge}
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="file"
                            name="image"
                            id="image"
                            onChange={(event) => {
                                formik.setFieldValue("image", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        />
                        <label htmlFor="image" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Product Image
                        </label>
                        {formik.errors.image && formik.touched.image && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.image}
                            </div>
                        )}
                    </div>

                    {/* Features */}
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                        {formik.values.features.map((feature, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    className="flex-1 block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder="Enter feature"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {formik.errors.features && formik.touched.features && (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.features}
                            </div>
                        )}
                        {formik.values.features.length < 10 && (
                            <button
                                type="button"
                                onClick={addFeature}
                                className="mt-2 text-rose-500 hover:text-rose-600"
                            >
                                Add Feature
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-rose-300 text-white px-6 py-2 rounded-lg hover:bg-rose-400 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage; 