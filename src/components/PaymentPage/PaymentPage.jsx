import img2 from "../../assets/images/img1payment.jpeg"
import img3 from "../../assets/images/img2payment.jpeg"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"

export default function PaymentPage(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        parentName: '',
        address: '',
        city: '',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8000/api/carts/pending', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data && response.data.data) {
                setCartData(response.data.data);
                // Pre-fill form with user data if available
                const userData = JSON.parse(localStorage.getItem('userData'));
                if (userData && userData.user) {
                    setFormData(prev => ({
                        ...prev,
                        parentName: `${userData.user.fName} ${userData.user.lName}`,
                        address: userData.user.street,
                        city: userData.user.city,
                        phone: userData.user.phoneNumber,
                        email: userData.user.email
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to fetch cart data');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Checkbox validation
        if (!isAddressConfirmed) {
            newErrors.addressConfirmation = 'Please confirm your delivery address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear error when user starts typing
        if (errors[id]) {
            setErrors(prev => ({
                ...prev,
                [id]: ''
            }));
        }
    };

    const handleCheckboxChange = (e) => {
        setIsAddressConfirmed(e.target.checked);
        // Clear error when checkbox is checked
        if (errors.addressConfirmation && e.target.checked) {
             setErrors(prev => ({
                ...prev,
                addressConfirmation: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (validateForm()) {
            // Here you would typically handle the form submission
            console.log('Form submitted:', formData);
            // Navigate to Payment Form page
            navigate('/PaymentForm');
        } else {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-pink-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!cartData || !cartData.products || cartData.products.length === 0) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-pink-50">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
      <div className="min-h-screen flex justify-center items-center py-35 bg-pink-50">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm p-8">
          <h2 className="text-4xl font-bold text-blue-800 text-center mb-12">Checkout</h2>
  
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Delivery Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-blue-800 mb-4">Delivery Information</h3>
  
                <div className="space-y-2">
                  <label htmlFor="parentName" className="block text-gray-700 font-medium">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    id="parentName"
                    value={formData.parentName}
                    disabled={true}
                    className={`w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed`}
                  />
                </div>
  
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-gray-700 font-medium">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    disabled={true}
                    className={`w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed`}
                  />
                </div>
  
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-gray-700 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={formData.city}
                      disabled={true}
                      className={`w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed`}
                    />
                  </div>
                </div>
  
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-gray-700 font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    disabled={true}
                    className={`w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed`}
                  />
                </div>
  
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-gray-700 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    disabled={true}
                    className={`w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed`}
                  />
                </div>

                {/* Address Confirmation Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="addressConfirmation"
                        checked={isAddressConfirmed}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="addressConfirmation" className="ml-2 block text-sm text-gray-900">
                        I confirm the delivery information is correct.
                    </label>
                </div>
                 {errors.addressConfirmation && <p className="text-red-500 text-sm mt-2">{errors.addressConfirmation}</p>}

              </div>
  
              {/* Order Summary */}
              <div>
                <h3 className="text-2xl font-semibold text-blue-800 mb-6">Order Summary</h3>
  
                <div className="space-y-4 mb-8">
                  {cartData.products.map((product) => (
                    <div key={product.productId} className="flex items-center gap-4 pb-4 border-b border-gray-100">
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
                    <span className="font-medium">EGP {cartData.cart.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">EGP 0</span>
                  </div>
                </div>
  
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-blue-800">Total</span>
                  <span className="text-xl font-bold text-blue-800">EGP {cartData.cart.totalPrice}</span>
                </div>
  
                <button 
                  type="submit"
                  disabled={isSubmitting || !isAddressConfirmed}
                  className={`w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-4 px-6 rounded-full transition duration-300 ${isSubmitting || !isAddressConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
}