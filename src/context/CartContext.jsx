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

            console.log('Pending cart response:', response.data);

            // Store cart ID if it exists and is valid
            if (response.data?.data?.cart?._id) {
                const cartId = response.data.data.cart._id;
                if (cartId && typeof cartId === 'string' && cartId !== 'null') {
                    localStorage.setItem('cartId', cartId);
                    console.log('Cart ID stored in localStorage:', cartId);
                } else {
                    localStorage.removeItem('cartId');
                    console.log('Invalid cart ID from pending cart, removed from localStorage');
                }
            }

            if (response.data.data.cart.products) {
                const newQuantities = {};
                let total = 0;
                response.data.data.cart.products.forEach(product => {
                    newQuantities[product.productId] = product.quantity;
                    total += product.quantity;
                });
                setProductQuantities(newQuantities);
                setTotalItems(total);
                localStorage.setItem('productQuantities', JSON.stringify(newQuantities));
                
                // Store the total products count
                const productsCount = response.data.data.cart.productsCount || total;
                localStorage.setItem('cartProductsCount', productsCount);
                console.log('Updated cart products count:', productsCount);
            } else {
                setProductQuantities({});
                setTotalItems(0);
                localStorage.setItem('productQuantities', JSON.stringify({}));
                localStorage.setItem('cartProductsCount', '0');
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
            localStorage.removeItem('cartId');
            localStorage.setItem('cartProductsCount', '0');
            console.log('Error fetching cart, reset cart count to 0');
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
        console.log('Retrieved cartId from localStorage:', cartId);

        // Validate cart ID
        if (!cartId || cartId === 'null' || cartId === 'undefined' || typeof cartId !== 'string') {
            console.log('Invalid cartId found, creating new cart');
            try {
                cartId = await createCart();
                console.log('New cart created with ID:', cartId);
            } catch (error) {
                console.error('Error creating new cart:', error);
                throw error;
            }
        } else {
            console.log('Using existing cartId:', cartId);
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
            
            // Immediately fetch and update cart data
            await fetchAndUpdateCartData();
            toast.success('Product added to cart successfully!');
            return response;
        } catch (error) {
            console.error('Error adding product to cart:', error);
            if (error.response?.data?.errors?.productId?.msg === 'Product is out of stock') {
                toast.error('Sorry, this product is out of stock');
            } else {
                toast.error('Failed to add product to cart');
            }
            throw error; // Re-throw the error to be handled by the component
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
                const response = await axios.patch(
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
                if (response.status === 200) {
                    if (change > 0) {
                        toast.success(`Quantity increased to ${newQuantity}`);
                    } else {
                        toast.success(`Quantity decreased to ${newQuantity}`);
                    }
                }
            } else {
                const response = await axios.post(
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
                if (response.status === 201) {
                    toast.success('Product added to cart successfully!');
                }
            }

            // Immediately fetch and update cart data
            await fetchAndUpdateCartData();
        } catch (error) {
            console.error('Error updating cart:', error);
            if (error.response?.data?.errors?.productId?.msg === 'Product is out of stock') {
                toast.error('Sorry, this product is out of stock');
            } else {
                toast.error('Failed to update cart quantity');
            }
            throw error;
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
