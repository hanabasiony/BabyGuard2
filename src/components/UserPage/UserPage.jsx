import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/AuthContext';

export default function UserPage() {
    const { userToken, setuserToken } = useContext(authContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userData')
        localStorage.removeItem('cartId')

        setuserToken(null);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-30" >
            <div className="max-w-2xl mx-auto">
                <div className="">
                    <h2 className="text-2xl font-bold text-rose-300 mb-6 text-left">
                        Account Settings
                    </h2>

                    {userToken ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/change-password')}
                                className="w-full text-left px-4 py-3 border border-rose-200 text-rose-400 rounded-md text-base font-normal bg-white hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
                            >
                                Change Password
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 border border-rose-200 text-rose-400 rounded-md text-base font-normal bg-white hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full text-left px-4 py-3 border border-rose-200 text-rose-600 rounded-md text-base font-normal bg-white hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => navigate('/register')}
                                className="w-full text-left px-4 py-3 border border-rose-200 text-rose-600 rounded-md text-base font-normal bg-white hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
                            >
                                Register
                            </button>

                            <button
                                onClick={() => navigate('/forgot-password')}
                                className="w-full text-left px-4 py-3 border border-rose-200 text-rose-600 rounded-md text-base font-normal bg-white hover:bg-rose-50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-200"
                            >
                                Forgot Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 