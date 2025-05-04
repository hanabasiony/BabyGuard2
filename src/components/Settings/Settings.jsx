import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { authContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export default function Settings() {
    const { userToken, setuserToken } = useContext(authContext)
    const { resetCart } = useContext(CartContext)
    const navigate = useNavigate()
    const [cartDetails, setCartDetails] = useState(null)

    useEffect(() => {
        const storedCartDetails = localStorage.getItem('cartDetails');
        if (storedCartDetails) {
            setCartDetails(JSON.parse(storedCartDetails));
        }
    }, []);

    async function handleLogout() {
        try {
            const cartId = localStorage.getItem('cartId');
            const token = localStorage.getItem('token');

            // Delete cart from server if it exists
            if (cartId && token) {
                try {
                    const response = await axios.delete(
                        `http://localhost:8000/api/carts/${cartId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    
                    if (response.status !== 200) {
                        toast.error('Failed to delete cart. Please try again.');
                        return; // Prevent logout if cart deletion fails
                    }
                } catch (error) {
                    console.error('Error deleting cart:', error);
                    toast.error('Failed to delete cart. Please try again.');
                    return; // Prevent logout if cart deletion fails
                }
            }

            // Reset cart state and clear localStorage
            resetCart();

            // Clear remaining localStorage items
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('cartTimestamp');
            localStorage.removeItem('userData');

            // Reset context state
            setuserToken(null);
            setCartDetails(null);

            // Show success message
            toast.success('Logged out successfully');

            // Navigate to login page
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('An error occurred during logout');
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-30 px-4 max-w-[1200px] mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-pink-600 mb-8">Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Details Section */}
                    {cartDetails && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-pink-600">Your Details</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">Governorate</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.governorate}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">City</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.city}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">Street</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.street}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">Building Number</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.buildingNumber}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">Apartment Number</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.apartmentNumber}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">Payment Type</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.paymentType}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">Order Status</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.status}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-500 text-sm">Products Count</p>
                                    <p className="text-pink-600 font-medium">{cartDetails.productsCount}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-pink-600">Account Settings</h3>
                        <div className="space-y-4">
                            {userToken ? (
                                <>
                                    <NavLink 
                                        to="/UpdatePass" 
                                        className="block w-full cursor-pointer text-left px-4 py-3 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-pink-100"
                                    >
                                        Change Password
                                    </NavLink>
                                    <button 
                                        onClick={handleLogout}
                                        className="block w-full cursor-pointer text-left px-4 py-3 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-pink-100"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink 
                                        to="/login" 
                                        className="block w-full cursor-pointer text-left px-4 py-3 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-pink-100"
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink 
                                        to="/Reg" 
                                        className="block w-full cursor-pointer text-left px-4 py-3 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors border border-pink-100"
                                    >
                                        Register
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
