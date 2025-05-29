import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/carts/my-orders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'waiting for cash payment':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-8">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
                                            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                                                <p className="mt-1 text-sm text-gray-800">
                                                    {order.street}, Building {order.buildingNumber}, Apt {order.apartmentNumber}
                                                </p>
                                                <p className="text-sm text-gray-800">
                                                    {order.city}, {order.governorate}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                                                <p className="mt-1 text-sm text-gray-800">{order.paymentType}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Order Summary</h4>
                                                <div className="mt-2 flex justify-between">
                                                    <span className="text-sm text-gray-600">Items</span>
                                                    <span className="text-sm font-medium text-gray-800">{order.productsCount}</span>
                                                </div>
                                                <div className="mt-1 flex justify-between">
                                                    <span className="text-sm text-gray-600">Total</span>
                                                    <span className="text-sm font-medium text-gray-800">${order.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                                                <p className="mt-1 text-sm text-gray-800">{formatDate(order.updatedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
