import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const Review = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/api/products-reviews/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProduct(response.data.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:8000/api/products/${productId}/reviews`,
                {
                    rating: rating,
                    message: reviewText
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            toast.success('Review submitted successfully!');
            navigate('/my-orders');
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    if (loading) {
        return (
            <div className='pt-40 pb-20'>
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='pt-40 pb-20'>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow overflow-y-auto pt-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Write a Review</h2>
                
                {product && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h3 className="font-medium text-gray-800">{product.name}</h3>
                                <p className="text-sm text-gray-500">Price: EGP {product.price}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600">Rating:</p>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <Star
                                        className={`w-8 h-8 ${
                                            (hoverRating || rating) >= star
                                                ? 'fill-pink-500 text-pink-500'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Review Text */}
                    <div>
                        <label htmlFor="review" className="block text-gray-600 mb-2">
                            Your Review
                        </label>
                        <textarea
                            id="review"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            placeholder="Share your experience with this product..."
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-pink-500 cursor-pointer text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors duration-200"
                            disabled={!rating || !reviewText.trim()}
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Review;
