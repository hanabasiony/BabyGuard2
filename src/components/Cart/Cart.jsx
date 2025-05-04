import React, { useContext, useEffect, useState } from 'react';
import { Trash, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import LoaderScreen from '../loaderScreen/loaderScreen';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';

const Cart = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
    const { handleUpdateQuantity, loadingProducts, productQuantities, handleDeleteProduct } = useContext(CartContext);

    const fetchCartData = async () => {
        try {
            const cartId = localStorage.getItem('cartId');
            const token = localStorage.getItem('token');

            if (!cartId) {
                setCartData(null);
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:8000/api/carts/${cartId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Check if the cart has any products
            if (!response.data.data.products || response.data.data.products.length === 0) {
                setCartData(null);
                setLoading(false);
                return;
            } else {
                setCartData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to fetch cart data');
            setCartData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, [productQuantities]);

    const handleQuantityChange = async (e, productId, change) => {
        try {
            await handleUpdateQuantity(e, productId, change);
            await fetchCartData();
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    if (loading) {
        return <LoaderScreen />;
    }

    if (!cartData || !cartData.products || cartData.products.length === 0) {
        return (
            <div className="max-w-5xl py-30 mx-auto p-6 bg-whitw min-h-screen">
                <div className="text-center">
                    <div className="mb-8">
                        <svg
                            className="mx-auto h-24 w-24 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-6 rounded-full cursor-pointer transition-colors duration-200"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const { cart, products } = cartData;
    const cartDetails = JSON.parse(localStorage.getItem('cartDetails') || '{}');
    const address = cartDetails.address || 'No address provided';
    // console.log(cartDetails.paymentType);

    return (
        <div className="max-w-5xl py-30 mx-auto p-6 bg-whitw min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Cart items:</h1>
                <p className="text-pink-500 text-lg font-medium">
                    Total: {cart.totalPrice} EGP
                </p>
            </div>

            {products.map((product) => (
                <div
                    key={product.productId}
                    className="flex items-center justify-between bg-white rounded-2xl shadow p-4 mb-4"
                >
                    <div className="flex items-center gap-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-xl object-cover border-2 border-pink-200"
                        />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">{product.name}</h3>
                            <p className="text-pink-500 font-medium text-sm">Price: {product.price} EGP</p>
                            <button
                                className="mt-2 flex items-center text-xs text-pink-400 cursor-pointer hover:underline"
                                onClick={(e) => handleDeleteProduct(e, product.productId)}
                            >
                                <Trash className="w-4 h-4 mr-1" /> Remove
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {loadingProducts[product.productId] ? (
                            <div className="flex justify-center">
                                <Oval
                                    height={20}
                                    width={20}
                                    color="#EC4899"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    ariaLabel='oval-loading'
                                    secondaryColor="#EC4899"
                                    strokeWidth={4}
                                    strokeWidthSecondary={4}
                                />
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => handleQuantityChange(e, product.productId, -1)}
                                    className="bg-pink-200 text-pink-800 px-2 py-1 cursor-pointer rounded-full hover:bg-pink-300"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="text-md font-semibold text-gray-700">{product.quantity}</span>
                                <button
                                    onClick={(e) => handleQuantityChange(e, product.productId, 1)}
                                    className="bg-pink-200 cursor-pointer text-pink-800 px-2 py-1 rounded-full hover:bg-pink-300"
                                >
                                    <Plus size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}

            {/* Address Section */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Delivery Address</h2>
                <div className="mb-4">
                    <p className="text-gray-600">
                        <span className='font-semibold'>governorate: {cartDetails.governorate},</span><br />
                        <span className='font-semibold'>city: {cartDetails.city}</span><br />
                        <span className='font-semibold'>street: {cartDetails.street}, Building {cartDetails.buildingNumber}, Apartment {cartDetails.apartmentNumber}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isAddressConfirmed}
                            onChange={(e) => setIsAddressConfirmed(e.target.checked)}
                            className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                        />
                        <span className="text-gray-700">I confirm this is my correct delivery address</span>
                    </label>
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-pink-500 hover:text-pink-600 font-medium"
                    >
                        Change Address
                    </button>
                </div>
            </div>

            {/* Payment Options */}
            <div className="mt-6 text-center flex flex-col gap-4 justify-between w-[60%] mx-auto">
                <button
                    onClick={() => {
                        if (!isAddressConfirmed) {
                            toast.error('Please confirm your delivery address');
                            return;
                        }else{
                            toast.success('order successfully placed!');
                        }
                        // Handle cash payment submission
                        // navigate('/order-confirmation');
                    }}
                    className="bg-white-500 text-pink-500 px-6 py-3 rounded-full shadow hover:text-white hover:bg-pink-500 cursor-pointer text-lg font-semibold transition-colors duration-200"
                >
                    Place Order (Cash)
                </button>



                <button
                    onClick={() => {
                    //     if (!isAddressConfirmed) {
                    //         toast.error('Please confirm your delivery address');
                    //         return;
                    //     }
                        navigate('/payment');
                    // }}
                    }}
                    className="bg-pink-500 text-white px-6 py-3 rounded-full shadow hover:bg-pink-600 cursor-pointer text-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 w-full"
                >
                    <span>Proceed to Payment</span>
                    <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M14 5l7 7m0 0l-7 7m7-7H3" 
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Cart;