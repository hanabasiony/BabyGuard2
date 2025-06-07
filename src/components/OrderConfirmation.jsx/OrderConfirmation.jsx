import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { CartContext } from '../../context/CartContext';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const orderId = localStorage.getItem('cartId');
    const cartDetails = JSON.parse(localStorage.getItem('cartDetails') || '{}');
    const cartData = JSON.parse(localStorage.getItem('cartData') || '{}');
    const { totalItems } = useContext(CartContext);

    // Calculate total price from products
    const calculateTotalPrice = () => {
        if (!cartData.products) return 0;
        return cartData.products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    };



    const totalPrice = calculateTotalPrice();

    return (
        <div className="max-w-5xl py-30 mx-auto p-6 bg-white min-h-screen">
            <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
                <p className="text-gray-600">Thank you for your purchase</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Order Information</h3>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Order Number:</span> {orderId}</p>
                        <p className="text-gray-600 mb-1"><span className="font-medium">Payment Method:</span> Cash on Delivery</p>
                        <p className="text-gray-600"><span className="font-medium">Total Amount:</span> {totalPrice} EGP</p>
                        <p className="text-gray-600"><span className="font-medium">Status: </span> Waiting for cash payment EGP</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">Delivery Address</h3>
                        <p className="text-gray-600">
                            {cartDetails.governorate}, {cartDetails.city}<br />
                            {cartDetails.street}, Building {cartDetails.buildingNumber}, Apartment {cartDetails.apartmentNumber}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ordered Products</h2>
                <div className="space-y-4">
                    {cartData.products?.map((product) => (
                        <div key={product.productId} className="flex items-center justify-between bg-white p-4 rounded-xl">
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                                    <p className="text-gray-600">Quantity: {product.quantity}</p>
                                    <p className="text-gray-600">Price per item: {product.price} EGP</p>
                                </div>
                            </div>
                            <p className="text-gray-800 font-medium">{(product.price * product.quantity)} EGP</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={() => navigate('/products')}
                    className="bg-rose-300 cursor-pointer  text-white px-8 py-3 rounded-full hover:bg-rose-400 transition-colors duration-200 font-medium"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation; 