import React, { useContext, useEffect, useState } from "react";
import { Star, Trash } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CartContext } from "../../context/CartContext";
import { Oval } from "react-loader-spinner";
import toast from "react-hot-toast";
import axios from 'axios';
import Categories from './../categories/categories';

export default function ProductDetails() {
    const { id } = useParams();
    const { productQuantities, handleAddToCart, handleUpdateQuantity, loadingProducts, handleDeleteProduct } = useContext(CartContext);
    const [localProductQuantities, setLocalProductQuantities] = useState({});
    const [ isAdmin , setIsAdmin ] = useState( false )
    

    const role = localStorage.getItem('role')
    if(role === 'admin'){
        setIsAdmin(true)
    }

    // Fetch pending cart data on component mount
    useEffect(() => {
        const fetchPendingCart = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/carts/pending', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.data.products && response.data.data.products.length > 0) {
                    const pendingProducts = {};
                    response.data.data.products.forEach(product => {
                        pendingProducts[product.productId] = product.quantity;
                    });
                    setLocalProductQuantities(pendingProducts);
                }
            } catch (error) {
                console.error('Error fetching pending cart:', error);
            }
        };

        fetchPendingCart();
    }, []);

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/products', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data.data);
            return response.data.data;
            
            
        }
    });

    // Find the specific product from the fetched products
    const product = products?.find(p => p._id === id);

    const handleQuantityUpdate = async (e, productId, change) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const cartId = localStorage.getItem('cartId');
            const currentQuantity = localProductQuantities[productId] || 0;
            const newQuantity = currentQuantity + change;

            if (newQuantity <= 0) {
                // Use the same deletion logic as handleDeleteProductWithUpdate
                await handleDeleteProduct(e, productId);
                
                // Update local quantities by removing the deleted product
                setLocalProductQuantities(prev => {
                    const newQuantities = { ...prev };
                    delete newQuantities[productId];
                    return newQuantities;
                });

                return;
            }

            await axios.patch(
                `http://localhost:8000/api/carts/${cartId}/products/${productId}`,
                { quantity: newQuantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLocalProductQuantities(prev => ({
                ...prev,
                [productId]: newQuantity
            }));

            // Add toast message for quantity change
            if (change > 0) {
                toast.success(`Quantity increased to ${newQuantity}`);
            } else {
                toast.success(`Quantity decreased to ${newQuantity}`);
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        }
    };

    const handleDeleteProductWithUpdate = async (e, productId) => {
        e.preventDefault();
        try {
            await handleDeleteProduct(e, productId);
            
            // Update local quantities by removing the deleted product
            setLocalProductQuantities(prev => {
                const newQuantities = { ...prev };
                delete newQuantities[productId];
                return newQuantities;
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to remove product from cart');
        }
    };

    const handleAddToCartWithUpdate = async (e, productId) => {
        e.preventDefault();
        try {
            await handleAddToCart(e, productId);
            
            // Update local quantities by adding the new product
            setLocalProductQuantities(prev => ({
                ...prev,
                [productId]: 1
            }));
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Failed to add product to cart');
        }
    };

    if (isLoading) {
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

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">Product not found</div>;
    }

    // Function to render stars based on rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={18}
                    fill={i <= rating ? "currentColor" : "none"}
                    className={i <= rating ? "text-yellow-400" : "text-gray-300"}
                />
            );
        }
        return stars;
    };

    const currentQuantity = localProductQuantities[product._id] || 0;

    return (
        <div className="bg-whitea py-20">
            <div className="p-6 max-w-5xl mx-auto font-sans">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="rounded-xl w-[100%]"
                        />
                        <div className="flex gap-2">
                            {/* Additional images can be added here */}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-2xl font-semibold">{product.name}</h1>
                        <p className="text-sm text-gray-600 mb-2">Required Age: {product.requiredAge}</p>
                        <p className="text-xl font-bold mb-2">EGP {product.price}</p>
                        <div className="flex items-center mb-4">
                            <div className="flex">
                                {renderStars(product.rating || 0)}
                            </div>
                            <span className="text-gray-500 ml-2">({product.rating || 0})</span>
                        </div>
                        <p className="text-gray-700 mb-4">
                            {product.description}
                        </p>

                        <div className="flex items-center space-x-3 mb-4">
                            {loadingProducts[product._id] ? (
                                <div className="flex justify-center">
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
                                <div className="flex items-center justify-center gap-2">
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
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={(e) => handleAddToCartWithUpdate(e, product._id)}
                                    className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-full cursor-pointer"
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>

                        <p className="text-sm text-gray-500">Free delivery for orders above EGP 300</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-10">
                  

                    {/* Description & Reviews Section */}
                    <div className="mt-10 space-y-8">
                        {/* Description */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                {product.features?.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Product Details */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center">
                                    <span className="font-medium w-32">Required Age:</span>
                                    <span>{product.requiredAge}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="font-medium w-32">Available Quantity:</span>
                                    <span>{product.quantity}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="font-medium w-32">Rating:</span>
                                    <div className="flex items-center">
                                        {renderStars(product.rating || 0)}
                                        <span className="ml-2 text-gray-600">({product.rating || 0})</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                            <div className="space-y-6">
                                {product.reviews.map((review) => (
                                    <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="font-medium text-gray-900">{review.user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                                {isAdmin && (
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm('Are you sure you want to delete this review?')) {
                                                                try {
                                                                    const token = localStorage.getItem('token');
                                                                    await axios.delete(
                                                                        `http://localhost:8000/api/products-reviews/${review._id}`,
                                                                        {
                                                                            headers: {
                                                                                Authorization: `Bearer ${token}`
                                                                            }
                                                                        }
                                                                    );
                                                                    toast.success('Review deleted successfully!');
                                                                    // Refresh the page to update reviews
                                                                    window.location.reload();
                                                                } catch (error) {
                                                                    console.error('Error deleting review:', error);
                                                                    toast.error('Failed to delete review');
                                                                }
                                                            }
                                                        }}
                                                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mt-2">{review.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {/* <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-4">Related Products</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {products?.filter(p => p._id !== product._id).slice(0, 4).map(relatedProduct => (
                                <div key={relatedProduct._id} className="border rounded-xl p-4 text-center">
                                    <p>{relatedProduct.name}</p>
                                    <p className="font-semibold">EGP {relatedProduct.price}</p>
                                </div>
                            ))}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}