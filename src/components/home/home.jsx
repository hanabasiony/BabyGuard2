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
import { Trash2 } from 'lucide-react'
import './home.css'

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { productQuantities, handleAddToCart, handleUpdateQuantity, loadingProducts, handleDeleteProduct } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Starting API call...'); 
                const token = localStorage.getItem('token');
               
                const response = await axios.get('http://localhost:8000/api/products', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data.data);
                console.log(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <LoaderScreen />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <>
            {/* <SimpleSlider />

            <CategoriesSlider /> */}
            <div className="wrapper py-40 px-10 mx-auto max-w-[1200px]">
                <div className='container mx-auto'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4  md:gap-6 mx-auto justify-items-center">
                        {products.map((product) => (
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
                                <h3 className='text-lg font-semibold text-blue-600 mb-1'>{product.name}</h3>
                                <h2 className='text-blue-600'>{product.description}</h2>
                                <p className='text-blue-400 mb-3 font-semibold'>EGP: {product.price}</p>

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
                                ) : productQuantities[product._id] > 0 ? (
                                    <div className="flex items-center justify-center gap-2 absolute bottom-3">
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
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={(e) => handleAddToCart(e, product._id)} 
                                        className="bg-pink-400 absolute bottom-3 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-full cursor-pointer"
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
