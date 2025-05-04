import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Review = () => {
    const navigate = useNavigate();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create review object
        const review = {
            text: reviewText,
            rating: rating,
            date: new Date().toISOString()
        };

        // Here you would typically send this to your backend
        console.log('Review submitted:', review);
        
        // Show success message
        toast.success('Review submitted successfully!');
        
        // Navigate back or to another page
        // navigate(-1);
    };

    return (
        <div className='pt-40 pb-20'>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow overflow-y-auto  pt-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Write a Review</h2>
            
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
