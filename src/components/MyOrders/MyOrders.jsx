import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Star, Package, MapPin, CreditCard, Clock } from 'lucide-react';

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
            console.log(response.data.data);
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
            case 'waiting for payment':
                return 'bg-blue-100 text-blue-800';
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
        <div className="min-h-screen pt-32 pb-12 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Package className="h-16 w-16 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
                        <Link 
                            to="/"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
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

                                    {/* Products Section */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Products</h4>
                                        <div className="space-y-4">
                                            {order.products && order.products.map((product) => (
                                                <div key={product._id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <h5 className="font-medium text-gray-800">{product.name}</h5>
                                                                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                                                                <p className="text-sm text-gray-500">Price: ${product.price}</p>
                                                            </div>
                                                            <Link
                                                                to={`/write-review/${order._id}/${product._id}`}
                                                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                                                            >
                                                                <Star className="h-4 w-4 mr-1" />
                                                                Review
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                                                    <p className="mt-1 text-sm text-gray-800">
                                                        {order.street}, Building {order.buildingNumber}, Apt {order.apartmentNumber}
                                                    </p>
                                                    <p className="text-sm text-gray-800">
                                                        {order.city}, {order.governorate}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                                                    <p className="mt-1 text-sm text-gray-800">{order.paymentType}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
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
                                            </div>
                                            <div className="flex items-start space-x-3">
                                                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                                                    <p className="mt-1 text-sm text-gray-800">{formatDate(order.updatedAt)}</p>
                                                </div>
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
