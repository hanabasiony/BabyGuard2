import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'
import { authContext } from './AuthContext'
import toast from 'react-hot-toast'

export const CartContext = createContext()

export default function CartContextProvider({ children }) {
    const [productQuantities, setProductQuantities] = useState({});
    const [loadingProducts, setLoadingProducts] = useState({});
    const [totalItems, setTotalItems] = useState(0);
    const { userToken } = useContext(authContext);

    // Function to fetch and update cart data
    const fetchAndUpdateCartData = async () => {
        if (!userToken) return;
        
        try {
            const response = await axios.get('http://localhost:8000/api/carts/pending', {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            if (response.data.data.products) {
                const newQuantities = {};
                let total = 0;
                response.data.data.products.forEach(product => {
                    newQuantities[product.productId] = product.quantity;
                    total += product.quantity;
                });
                setProductQuantities(newQuantities);
                setTotalItems(total);
                localStorage.setItem('productQuantities', JSON.stringify(newQuantities));
            } else {
                setProductQuantities({});
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    };

    // Fetch cart data on initial load and when token changes
    useEffect(() => {
        fetchAndUpdateCartData();
    }, [userToken]);

    // Function to reset cart state
    const resetCart = () => {
        setProductQuantities({});
        setLoadingProducts({});
        setTotalItems(0);
        localStorage.removeItem('productQuantities');
        localStorage.removeItem('cartId');
        localStorage.removeItem('cartDetails');
    };

    const createCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const userDataString = localStorage.getItem('userData');
            const userData = userDataString ? JSON.parse(userDataString) : null;

            if (!userData) {
                throw new Error('User data not found');
            }

            const response = await axios.post(
                'http://localhost:8000/api/carts',
                {
                    cart: {
                        governorate: userData.user.governorate || "Cairome",
                        city: userData.user.city || "1st Settlementme",
                        street: userData.user.street || "Main Streetme",
                        buildingNumber: userData.user.buildingNumber || 123123,
                        apartmentNumber: userData.user.apartmentNumber || 4545,
                        paymentType: "Cash"
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
            
            await axios.post(
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
            
            // Immediately fetch and update cart data
            await fetchAndUpdateCartData();
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
            const currentQuantity = productQuantities[productId] || 0;
            const newQuantity = currentQuantity + change;
            
            if (newQuantity < 0) return;

            if (newQuantity === 0) {
                await axios.delete(
                    `http://localhost:8000/api/carts/${cartId}/products/${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                toast.success('Product removed from cart');
            } else if (currentQuantity > 0) {
                await axios.patch(
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
                await axios.post(
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

            // Immediately fetch and update cart data
            await fetchAndUpdateCartData();

            // Show appropriate toast message based on the change
            if (change > 0) {
                toast.success(`Quantity increased to ${newQuantity}`);
            } else if (newQuantity > 0) {
                toast.success(`Quantity decreased to ${newQuantity}`);
            }
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

            // Immediately fetch and update cart data
            await fetchAndUpdateCartData();
            toast.success('Product removed from cart');
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to remove product from cart');
        } finally {
            setLoadingProducts(prev => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <CartContext.Provider value={{
            productQuantities,
            handleAddToCart,
            handleUpdateQuantity,
            loadingProducts,
            totalItems,
            resetCart,
            handleDeleteProduct
        }}>
            {children}
        </CartContext.Provider>
    )
}
