import img2 from "../../assets/images/img1payment.jpeg";
import img3 from "../../assets/images/img2payment.jpeg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setCartData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    navigate("/PaymentForm");
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!cartData || !cartData.products || cartData.products.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center py-35 bg-white">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm p-8">
        <h2 className="text-4xl font-bold text-rose-300 text-center mb-12">
          Checkout
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Order Summary */}
          <div>
            <h3 className="text-2xl font-semibold text-rose-300 mb-6">
              Order Summary
            </h3>

            <div className="space-y-4 mb-8">
              {cartData.products.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100"
                >
                  <div className="bg-gray-100 rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-gray-600">EGP {product.price}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{product.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  EGP {cartData.cart.totalPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">EGP 0</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-rose-300">Total</span>
              <span className="text-xl font-bold text-rose-300">
                EGP {cartData.cart.totalPrice}
              </span>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-96 bg-rose-300 hover:bg-rose-400 cursor-pointer text-white font-medium py-4 px-6 rounded-full transition duration-300 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
