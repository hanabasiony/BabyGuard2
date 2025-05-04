import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Logout() {
    const navigate = useNavigate();
    const { setuserToken } = useContext(authContext);
    const { resetCart } = useContext(CartContext);

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Get cart ID from localStorage
                const cartId = localStorage.getItem('cartId');
                const token = localStorage.getItem('token');

                // Delete cart from server if it exists
                if (cartId && token) {
                    try {
                        await axios.delete(
                            `http://localhost:8000/api/carts/${cartId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );
                    } catch (error) {
                        console.error('Error deleting cart:', error);
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

                // Show success message
                toast.success('Logged out successfully');

                // Navigate to login page
                navigate('/login');
            } catch (error) {
                console.error('Logout error:', error);
                toast.error('Error during logout');
            }
        };

        handleLogout();
    }, [navigate, resetCart, setuserToken]);

    return null; // This component doesn't render anything
}
