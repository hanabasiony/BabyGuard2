import React, { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const Review = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate review text length
    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters long");
      return;
    }
    console.log("hajfk");

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/products-reviews/${productId}`,
        {
          message: reviewText,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Review submitted successfully!");
        // navigate('/my-orders');
      }
    } catch (error) {
      console.error("Error submitting review:hena", error);
      console.log();

      toast.error(
        error.response?.data?.errors[""].msg || "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    const text = e.target.value;
    setReviewText(text);
    if (text.trim().length < 10) {
      setError("Review must be at least 10 characters long");
    } else {
      setError("");
    }
  };

  return (
    <div className="pt-40 pb-20">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow overflow-y-auto pt-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Write a Review
        </h2>

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
                        ? "fill-pink-500 text-pink-500"
                        : "text-gray-300"
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
              onChange={handleReviewChange}
              className={`w-full h-32 p-3 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
              placeholder="Share your experience with this product... (minimum 10 characters)"
              required
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={
                !rating ||
                !reviewText.trim() ||
                loading ||
                reviewText.trim().length < 10
              }
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
