import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios'
import { FallingLines, Oval } from 'react-loader-spinner'
import LoaderScreen from '../loaderScreen/loaderScreen'
import SimpleSlider from '../homeSlider/homeSlider'
import CategoriesSlider from '../categoriesSlider/categoriesSlider'
import { useQuery } from '@tanstack/react-query'
import { CartContext } from '../../context/CartContext'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Star, StarHalf } from 'lucide-react'
import './home.css'

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsId, setProductsId] = useState([]);
    const [localProductQuantities, setLocalProductQuantities] = useState({});
    const { productQuantities, handleAddToCart, handleUpdateQuantity, loadingProducts, handleDeleteProduct } = useContext(CartContext);
    const [pendingCartProducts, setPendingCartProducts] = useState(
        JSON.parse(localStorage.getItem('productQuantitiesOfPendingCart') || '[]')
    );
    // const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Starting API call...');
                const token = localStorage.getItem('token');

                // Fetch pending cart data
                try {
                    const cartResponse = await axios.get('http://localhost:8000/api/carts/pending', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // If we have pending cart products, use them
                    if (cartResponse.data.data.products && cartResponse.data.data.products.length > 0) {
                        const pendingProducts = cartResponse.data.data.products.map(product => ({
                            id: product.productId,
                            quantity: product.quantity
                        }));

                        setProductsId(pendingProducts);
                        console.log('Set pending products:', pendingProducts);

                        // Initialize cart quantities in localStorage
                        const initialQuantities = {};
                        pendingProducts.forEach(product => {
                            initialQuantities[product.id] = product.quantity;
                        });
                        localStorage.setItem('productQuantities', JSON.stringify(initialQuantities));
                        setLocalProductQuantities(initialQuantities);
                    } else {
                        // Initialize empty quantities if no pending cart
                        setLocalProductQuantities({});
                        setProductsId([]);
                        localStorage.setItem('productQuantities', JSON.stringify({}));
                    }
                } catch (cartError) {
                    console.log('No pending cart found, initializing empty cart');
                    // Initialize empty quantities if no pending cart
                    setLocalProductQuantities({});
                    setProductsId([]);
                    localStorage.setItem('productQuantities', JSON.stringify({}));
                }

                // Fetch all products
                const response = await axios.get('http://localhost:8000/api/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setProducts(response.data.data);
                console.log('Fetched products:', response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, []);

    const handleQuantityUpdate = async (e, productId, change) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const cartId = localStorage.getItem('cartId');
            const currentQuantity = localProductQuantities[productId] || 0;
            const newQuantity = currentQuantity + change;

            if (newQuantity <= 0) {
                // If quantity would be 0 or negative, delete the product
                await handleDeleteProductWithUpdate(e, productId);
                return;
            }

            // Update the quantity in the cart
            await axios.patch(
                `http://localhost:8000/api/carts/${cartId}/products/${productId}`,
                { quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Update local state
            const newQuantities = { ...localProductQuantities };
            newQuantities[productId] = newQuantity;
            setLocalProductQuantities(newQuantities);
            localStorage.setItem('productQuantities', JSON.stringify(newQuantities));

            // Update pending cart products if they exist
            const updatedPendingProducts = pendingCartProducts.map(product =>
                product.productId === productId
                    ? { ...product, quantity: newQuantity }
                    : product
            );
            setPendingCartProducts(updatedPendingProducts);
            localStorage.setItem('productQuantitiesOfPendingCart', JSON.stringify(updatedPendingProducts));
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    const handleAddToCartWithCheck = async (e, productId) => {
        e.preventDefault();
        try {
            // Check if product is already in cart
            if (localProductQuantities[productId]) {
                // If product exists, update quantity instead
                await handleQuantityUpdate(e, productId, 1);
            } else {
                // If product doesn't exist, add it
                await handleAddToCart(e, productId);
                // Update local quantities
                const newQuantities = { ...localProductQuantities, [productId]: 1 };
                setLocalProductQuantities(newQuantities);
                localStorage.setItem('productQuantities', JSON.stringify(newQuantities));
            }
        } catch (error) {
            console.error('Error handling cart operation:', error);
            toast.error('Failed to update cart');
        }
    };

    const handleDeleteProductWithUpdate = async (e, productId) => {
        e.preventDefault();
        try {
            await handleDeleteProduct(e, productId);

            // Update local quantities
            const newQuantities = { ...localProductQuantities };
            delete newQuantities[productId];
            setLocalProductQuantities(newQuantities);
            localStorage.setItem('productQuantities', JSON.stringify(newQuantities));

            // Update productsId state
            setProductsId(prevProducts => prevProducts.filter(product => product.id !== productId));

            // Remove from pending cart products
            const updatedPendingProducts = pendingCartProducts.filter(
                product => product.productId !== productId
            );
            setPendingCartProducts(updatedPendingProducts);
            localStorage.setItem('productQuantitiesOfPendingCart', JSON.stringify(updatedPendingProducts));
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to remove product from cart');
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-current" />
            );
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push(
                <StarHalf key="half" className="w-4 h-4 text-yellow-400 fill-current" />
            );
        }

        // Add empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
            );
        }

        return stars;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Oval
                    height={80}
                    width={80}
                    color="#ec4899"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#f9a8d4"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
            </div>
        );
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error.message}</div>;
    }

    return (
        <>
            {/* <SimpleSlider /> */}
            {/* <CategoriesSlider /> */}
            <div className="wrapper py-40 px-10 mx-auto max-w-[1200px]">
                <div className='container mx-auto'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4  md:gap-6 mx-auto justify-items-center">
                        {products.map((product) => {
                            const currentQuantity = localProductQuantities[product._id] || 0;

                            return (
                                <Link
                                    to={`/productDetails/${product._id}`}
                                    key={product._id}
                                    className="bg-white pb-15 rounded-2xl relative shadow-md p-4 flex flex-col items-center text-center w-64 group  transition-all"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className='w-24 h-24 mb-4 object-cover'
                                    />
                                    <h3 className='text-lg font-semibold text-black-600 mb-1'>{product.name}</h3>
                                    <h2 className='text-black-600 text-sm mb-2'>{product.description}</h2>
                                    <p className='text-black-400 mb-2 font-semibold'>EGP: {product.price}</p>

                                    {/* Rating and Reviews Section */}
                                    <div className="flex flex-col items-center mb-3">
                                        <div className="flex items-center gap-1 mb-1">
                                            {renderStars(product.rating)}
                                            <span className="text-sm text-gray-600 ml-1">
                                                ({product.rating.toFixed(1)})
                                            </span>
                                        </div>
                                        {/* <div className="text-sm text-gray-500">
                                            {product.totalReviews} {product.totalReviews === 1 ? 'review' : 'reviews'}
                                        </div> */}
                                    </div>

                                    {/* Features Section */}
                                    {/* <div className="text-sm text-gray-600 mb-3">
                                        <p className="font-medium">Age: {product.requiredAge}</p>
                                        <div className="mt-1">
                                            {product.features.slice(0, 2).map((feature, index) => (
                                                <p key={index} className="text-xs">• {feature}</p>
                                            ))}
                                        </div>
                                    </div> */}

                                    {loadingProducts[product._id] ? (
                                        <div className="absolute bottom-3">
                                            <Oval
                                                height={30}
                                                width={30}
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
                                    ) : currentQuantity > 0 ? (
                                        <div className="flex items-center justify-center gap-2 absolute bottom-3">
                                            <button
                                                onClick={(e) => handleQuantityUpdate(e, product._id, -1)}
                                                className="bg-pink-400 hover:bg-pink-500 cursor-pointer text-white font-medium w-8 h-8 rounded-full flex items-center justify-center"
                                            >
                                                -
                                            </button>
                                            <span className="bg-pink-400 text-white font-medium px-3 py-1 rounded-full">
                                                {currentQuantity}
                                            </span>
                                            <button
                                                onClick={(e) => handleQuantityUpdate(e, product._id, 1)}
                                                className="bg-pink-400 hover:bg-pink-500 cursor-pointer text-white font-medium w-8 h-8 rounded-full flex items-center justify-center"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteProductWithUpdate(e, product._id)}
                                                className="bg-pink-400 hover:bg-pink-500 cursor-pointer text-white font-medium w-8 h-8 rounded-full flex items-center justify-center"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => handleAddToCartWithCheck(e, product._id)}
                                            className="bg-pink-400 absolute bottom-3 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-full cursor-pointer"
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
