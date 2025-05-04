import React, { useContext } from "react";
import { Star, Trash } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CartContext } from "../../context/CartContext";
import { Oval } from "react-loader-spinner";
import toast from "react-hot-toast";
import axios from 'axios';
import Categories from './../categories/categories';

export default function ProductDetails() {
    const { id } = useParams();
    const { productQuantities, handleAddToCart, handleUpdateQuantity, loadingProducts, handleDeleteProduct } = useContext(CartContext);

    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/products', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        }
    });

    // Find the specific product from the fetched products
    const product = products?.find(p => p._id === id);

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

    return (
        <div className="bg-whitea py-50">
            <div className="p-6 max-w-5xl mx-auto font-sans">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="rounded-xl w-[50%]"
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
                            ) : productQuantities[product._id] > 0 ? (
                                <div className="flex items-center justify-center gap-2">
                                    <button 
                                        onClick={(e) => handleUpdateQuantity(e, product._id, -1)}
                                        className="bg-pink-400 hover:bg-pink-500 cursor-pointer text-white font-medium w-8 h-8 rounded-full flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="bg-pink-400 text-white font-medium px-3 py-1 rounded-full">
                                        {productQuantities[product._id]}
                                    </span>
                                    <button 
                                        onClick={(e) => handleUpdateQuantity(e, product._id, 1)}
                                        className="bg-pink-400 hover:bg-pink-500 cursor-pointer text-white font-medium w-8 h-8 rounded-full flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeleteProduct(e, product._id)}
                                        className="bg-pink-400 hover:bg-pink-500 cursor-pointer text-white font-medium w-8 h-8 rounded-full flex items-center justify-center"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={(e) => handleAddToCart(e, product._id)}
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
                    <div className="flex space-x-6 border-b border-gray-200 mb-4">
                        <button className="pb-2 border-b-2 border-blue-500 text-blue-600 font-medium">Description</button>
                        <button className="pb-2 text-gray-500">Features</button>
                        <button className="pb-2 text-gray-500">Reviews</button>
                        <button className="pb-2 text-gray-500">Related Products</button>
                    </div>

                    <p className="text-gray-700 mb-6">
                        {product.description}
                    </p>

                    {/* Features & Reviews */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Features</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {product.features?.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li><span className="font-medium">Required Age:</span> {product.requiredAge}</li>
                                <li><span className="font-medium">Available Quantity:</span> {product.quantity}</li>
                                <li><span className="font-medium">Rating:</span> {product.rating || 0}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-4">Related Products</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {products?.filter(p => p._id !== product._id).slice(0, 4).map(relatedProduct => (
                                <div key={relatedProduct._id} className="border rounded-xl p-4 text-center">
                                    <p>{relatedProduct.name}</p>
                                    <p className="font-semibold">EGP {relatedProduct.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}