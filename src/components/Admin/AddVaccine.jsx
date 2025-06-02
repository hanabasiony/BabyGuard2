import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AddVaccine() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        requiredAge: '',
        price: '',
        provider: '60d21b4667d0d8992e610c85',
        providerName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8000/api/vaccines/admin',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                toast.success('Vaccine added successfully');
                navigate('/admin/vaccines');
            }
        } catch (error) {
            console.error('Error adding vaccine:', error);
            toast.error(error.response?.data?.message || 'Failed to add vaccine');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Add New Vaccine</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Fill in the details below to add a new vaccine to the system.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Provider Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                                    Provider ID
                                </label>
                                <input
                                    type="text"
                                    id="provider"
                                    name="provider"
                                    required
                                    value={formData.provider}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                    placeholder="Enter provider ID"
                                />
                            </div>
                            <div>
                                <label htmlFor="providerName" className="block text-sm font-medium text-gray-700">
                                    Provider Name
                                </label>
                                <input
                                    type="text"
                                    id="providerName"
                                    name="providerName"
                                    required
                                    value={formData.providerName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                    placeholder="Enter provider name"
                                />
                            </div>
                        </div>

                        {/* Vaccine Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Vaccine Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                placeholder="e.g., Polio Vaccine"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                placeholder="Enter vaccine description..."
                            />
                        </div>

                        {/* Required Age */}
                        <div>
                            <label htmlFor="requiredAge" className="block text-sm font-medium text-gray-700">
                                Required Age
                            </label>
                            <input
                                type="text"
                                id="requiredAge"
                                name="requiredAge"
                                required
                                value={formData.requiredAge}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                placeholder="e.g., 6 months"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Price (EGP)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                required
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                                placeholder="e.g., 49.99"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/vaccines')}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding...' : 'Add Vaccine'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 