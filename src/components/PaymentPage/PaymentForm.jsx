import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  })

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
          ...prev,
          [field]: ''
      }));
    }
  }

  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    // Add spaces every 4 digits
    const matches = v.match(/\d{1,16}/g) // Allow less than 16 digits for partial input
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    handleInputChange("cardNumber", formatted)
  }

  const months = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12"
  ]; // Use numeric months for easier date validation

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => (currentYear + i).toString());

  const validateForm = () => {
      const newErrors = {};

      // Cardholder Name Validation
      if (!formData.cardholderName.trim()) {
          newErrors.cardholderName = 'Cardholder Name is required';
      }

      // Card Number Validation
      const cleanedCardNumber = formData.cardNumber.replace(/\s/g, '');
      if (!cleanedCardNumber) {
          newErrors.cardNumber = 'Card Number is required';
      } else if (!/^\d{16}$/.test(cleanedCardNumber)) {
          newErrors.cardNumber = 'Card Number must be 16 digits';
      }

      // Expiry Date Validation
      if (!formData.expiryMonth) {
          newErrors.expiryMonth = 'Month is required';
      }
      if (!formData.expiryYear) {
          newErrors.expiryYear = 'Year is required';
      }

      if (formData.expiryMonth && formData.expiryYear) {
        const expiryDate = new Date(parseInt(formData.expiryYear), parseInt(formData.expiryMonth) - 1, 1);
        const today = new Date();
        if (expiryDate < today) {
          newErrors.expiryYear = newErrors.expiryMonth = 'Expiry date is in the past';
        }
      }

      // CVV Validation
      if (!formData.cvv.trim()) {
          newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
          newErrors.cvv = 'CVV must be 3 or 4 digits';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      if (validateForm()) {
          try {
              setIsLoading(true);
              const cartId = localStorage.getItem('cartId');
              const token = localStorage.getItem('token');
              
              if (!cartId) {
                  alert('Cart ID not found. Please try again.');
                  return;
              }

              if (!token) {
                  alert('Authentication token is missing. Please log in again.');
                  return;
              }

              // Make API call to send OTP
              const response = await axios.get(`http://localhost:8000/api/payment/send-otp/${cartId}`, {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              });

              if (response.status === 201) {
                  // Navigate to OTP page after successful API call
                  navigate('/otp');
                  console.log('send otp res',response);
                  
              } else {
                  alert('Unexpected response from server. Please try again.');
              }
          } catch (error) {
              console.error('Error processing payment(otp):', error);
              if (error.response) {
                  // Handle specific error responses
                  switch (error.response.status) {
                      case 401:
                          alert('Authentication failed. Please log in again.');
                          break;
                      case 404:
                          alert('Cart not found. Please try again.');
                          break;
                      default:
                          alert(error.response.data.message || 'Failed to process payment. Please try again.');
                  }
              } else {
                  alert('Network error. Please check your connection and try again.');
              }
          } finally {
              setIsLoading(false);
          }
      } else {
          console.log('Form has errors. Please fix them.');
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
          <div className="text-blue-600 text-3xl font-bold italic">VISA</div> {/* Placeholder for VISA icon */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Cardholder's Name */}
            <div>
              <label htmlFor="cardholder-name" className="block text-sm font-medium text-gray-700">Cardholder Name</label>
              <input
                type="text"
                id="cardholder-name"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm`}
              />
              {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
            </div>

            {/* Card Number */}
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                id="card-number"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                maxLength="19"
                className={`mt-1 block w-full px-3 py-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm tracking-wide`}
                placeholder="e.g., 4111 2222 3333 4444"
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label htmlFor="expiry-month" className="block text-sm font-medium text-gray-700">Month</label>
                <select
                  id="expiry-month"
                  value={formData.expiryMonth}
                  onChange={(e) => handleInputChange("expiryMonth", e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.expiryMonth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm appearance-none cursor-pointer`}
                >
                   <option value="" disabled>MM</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
              </div>
              <div className="col-span-1">
                <label htmlFor="expiry-year" className="block text-sm font-medium text-gray-700">Year</label>
                <select
                   id="expiry-year"
                  value={formData.expiryYear}
                  onChange={(e) => handleInputChange("expiryYear", e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.expiryYear ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm appearance-none cursor-pointer`}
                >
                  <option value="" disabled>YY</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                 {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
              </div>
              <div className="col-span-1">
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength="4"
                  className={`mt-1 block w-full px-3 py-2 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm`}
                  placeholder="123"
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            {/* Pay Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex  cursor-pointer justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? 'bg-rose-300 cursor-not-allowed' 
                    : 'bg-rose-300 hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Pay Securely'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
