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
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        if (!userToken) return; // Don't load data if not logged in

        const storedCartDetails = localStorage.getItem('cartDetails');
        if (storedCartDetails) {
            setCartDetails(JSON.parse(storedCartDetails));
        }
    }, [userToken]);

    async function handleLogout() {
        try {
            const cartId = localStorage.getItem('cartId');
            const token = localStorage.getItem('token');

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

    useEffect(() => {
        if (!userToken) return; // Don't fetch user data if not logged in

        const token = localStorage.getItem('token');
        axios.get('http://localhost:8000/api/user/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            setUserData(res.data.user);
        })
        .catch((err) => {
            console.error('Error fetching user data:', err);
            toast.error('Failed to load user data');
        });
    }, [userToken]);

    if (!userToken) {
        return (
            <div className="min-h-screen pt-32 pb-30 px-4 max-w-[1300px] mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-6xl mx-auto">
                    <h2 className="text-2xl font-semibold text-pink-600 mb-8">Welcome to Baby Guard</h2>
                    <div className="space-y-4">
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
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-30 px-4 max-w-[1300px] mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* User Details Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-pink-600">Personal Information</h3>
                        {userData ? (
                            <div className="bg-white rounded-lg shadow-sm border border-pink-100 p-6">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                                        <span className="text-2xl text-pink-600">
                                            {userData.fName ? userData.fName.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{userData.fName}</h4>
                                        <p className="text-sm text-gray-500">{userData.email}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm font-medium text-gray-800">{userData.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Role</p>
                                            <p className="text-sm font-medium text-gray-800 capitalize">{userData.role}</p>
                                        </div>
                                    </div>

                                    {userData.phoneNumber && (
                                        <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm font-medium text-gray-800">{userData.phoneNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading user information...</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-pink-600">Additional Information</h3>
                        {userData && (
                            <div className="bg-white rounded-lg shadow-sm border border-pink-100 p-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {userData.birthDate && (
                                        <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <p className="text-xs text-gray-500">Birth Date</p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {new Date(userData.birthDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {userData?.governorate}, {userData?.city}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Address</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {userData?.street}, Building {userData?.buildingNumber}, Apt {userData?.apartmentNumber}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <div>
                                            <p className="text-xs text-gray-500">Payment Method</p>
                                            <p className="text-sm font-medium text-gray-800">{userData.paymentType}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
