import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { authContext } from './AuthContext'
import toast from 'react-hot-toast'

export const CartContext = createContext()

export default function CartContextProvider({ children }) {
    const [productQuantities, setProductQuantities] = useState(() => {
        const savedQuantities = localStorage.getItem('productQuantities');
        return savedQuantities ? JSON.parse(savedQuantities) : {};
    });
    const [loadingProducts, setLoadingProducts] = useState({});

    // Save quantities to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('productQuantities', JSON.stringify(productQuantities));
    }, [productQuantities]);

    // Function to reset cart state
    const resetCart = () => {
        setProductQuantities({});
        setLoadingProducts({});
        localStorage.removeItem('productQuantities');
        localStorage.removeItem('cartId');
        localStorage.removeItem('cartDetails');
    };

    const createCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8000/api/carts',
                {
                    cart: {
                        "governorate": "Cairo",
                        "city": "1st Settlement",
                        "street": "Main Street",
                        "buildingNumber": 123,
                        "apartmentNumber": 45,
                        "paymentType": "Cash"
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            localStorage.setItem('cartId', response.data.data._id);
            return response.data.data._id;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw error;
        }
    };

    const getOrCreateCart = async () => {
        let cartId = localStorage.getItem('cartId');
        if (!cartId) {
            cartId = await createCart();
        }
        return cartId;
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        try {
            setLoadingProducts(prev => ({ ...prev, [productId]: true }));
            const token = localStorage.getItem('token');
            const cartId = await getOrCreateCart();
            
            const response = await axios.post(
                `http://localhost:8000/api/carts/${cartId}/products`,
                {
                    productId: productId,
                    quantity: 1
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setProductQuantities(prev => ({
                ...prev,
                [productId]: (prev[productId] || 0) + 1
            }));

            console.log('Product added to cart:', response.data);
            toast.success('Product added to cart successfully!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Failed to add product to cart');
        } finally {
            setLoadingProducts(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleUpdateQuantity = async (e, productId, change) => {
        e.preventDefault();
        try {
            setLoadingProducts(prev => ({ ...prev, [productId]: true }));
            const token = localStorage.getItem('token');
            const cartId = await getOrCreateCart();
            const newQuantity = (productQuantities[productId] || 0) + change;
            
            if (newQuantity < 0) return;

            let response;
            if (newQuantity === 0) {
                response = await axios.delete(
                    `http://localhost:8000/api/carts/${cartId}/products/${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                toast.success('Product removed from cart');
            } else if (productQuantities[productId] > 0) {
                response = await axios.patch(
                    `http://localhost:8000/api/carts/${cartId}/products/${productId}`,
                    {
                        quantity: newQuantity
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            } else {
                response = await axios.post(
                    `http://localhost:8000/api/carts/${cartId}/products`,
                    {
                        productId: productId,
                        quantity: newQuantity
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
            
            setProductQuantities(prev => ({
                ...prev,
                [productId]: newQuantity
            }));

            // Show appropriate toast message based on the change
            if (change > 0) {
                toast.success(`Quantity increased to ${newQuantity}`);
            } else if (newQuantity > 0) {
                toast.success(`Quantity decreased to ${newQuantity}`);
            }

            console.log('Cart updated:', response.data);
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error('Failed to update cart quantity');
        } finally {
            setLoadingProducts(prev => ({ ...prev, [productId]: false }));
        }
    };

    const handleDeleteProduct = async (e, productId) => {
        e.preventDefault();
        try {
            setLoadingProducts(prev => ({ ...prev, [productId]: true }));
            const token = localStorage.getItem('token');
            const cartId = await getOrCreateCart();
            
            await axios.delete(
                `http://localhost:8000/api/carts/${cartId}/products/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update local state
            setProductQuantities(prev => {
                const newQuantities = { ...prev };
                delete newQuantities[productId];
                return newQuantities;
            });

            toast.success('Product removed from cart');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to remove product from cart');
        } finally {
            setLoadingProducts(prev => ({ ...prev, [productId]: false }));
        }
    };

    const getTotalItems = () => {
        return Object.values(productQuantities).reduce((total, quantity) => total + quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            productQuantities,
            handleAddToCart,
            handleUpdateQuantity,
            loadingProducts,
            totalItems: getTotalItems(),
            resetCart,
            handleDeleteProduct
        }}>
            {children}
        </CartContext.Provider>
    )
}
