"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function OTPInput() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [activeIndex, setActiveIndex] = useState(0)
  const [timer, setTimer] = useState(30)
  const [isResendDisabled, setIsResendDisabled] = useState(true)
  const inputRefs = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    // Start timer when component mounts
    startTimer();

    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(30);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input if value is entered
    if (value && index < 5) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    }

    // Move to next input on arrow right
    if (e.key === "ArrowRight" && index < 5) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    // Move to previous input on arrow left
    if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleFocus = (index) => {
    setActiveIndex(index)
  }

  const handleSubmit = async () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      try {
        const token = localStorage.getItem('token');
        const cartId = localStorage.getItem('cartId'); // Get cartId from localStorage

        if (!cartId) {
          toast.error("Cart ID not found. Please try again.");
          return;
        }

        const response = await axios.post("http://localhost:8000/api/payment/verify-otp", 
          {
            cartId: cartId,
            code: otpValue
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          toast.success("OTP verified successfully!");
          // You can add navigation here if needed
          // navigate('/success');
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        if (error.response?.status === 401) {
          toast.error("Unauthorized. Please login again.");
          // Optionally redirect to login page
          // navigate('/login');
        } else {
          toast.error(error.response?.data?.message || "Failed to verify OTP");
        }
      }
    } else {
      toast.error("Please enter all 6 digits");
    }
  }

  const handleResendOTP = async () => {
    try {
      const token = localStorage.getItem('token');
      const cartId = localStorage.getItem('cartId');

      if (!cartId) {
        toast.error("Cart ID not found. Please try again.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8000/api/payment/resend-otp/${cartId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("OTP resent successfully!");
        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        setActiveIndex(0);
        inputRefs.current[0]?.focus();
        // Start the timer again after successful resend
        startTimer();
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        // Optionally redirect to login page
        // navigate('/login');
      } else if (error.response?.status === 429) {
        toast.error("Too many requests. Please wait before trying again.");
      } else if (error.response?.status === 400) {
        toast.error("Please wait at least 30 seconds before requesting a new OTP.");
      } else {
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      }
    }
  };

  const handleDeleteOTP = async () => {
    try {
      const token = localStorage.getItem('token');
      const cartId = localStorage.getItem('cartId');

      if (!cartId) {
        toast.error("Cart ID not found. Please try again.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8000/api/payment/cancel/${cartId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Payment cancelled successfully!");
        // Clear cartId from localStorage
        localStorage.removeItem('cartId');
        // Navigate back to home or previous page
        navigate('/');
      }
    } catch (error) {
      console.error("Error cancelling payment:", error);
      
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        // Optionally redirect to login page
        // navigate('/login');
      } else if (error.response?.status === 429) {
        toast.error("Too many requests. Please wait before trying again.");
      } else if (error.response?.status === 400) {
        toast.error("Cannot cancel payment. Cart status is not 'Pending'.");
      } else if (error.response?.status === 404) {
        toast.error("Cart not found.");
      } else {
        toast.error(error.response?.data?.message || "Failed to cancel payment");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">OTP Verification</h1>
          <p className="text-gray-500 text-lg">Enter the one-time password sent to your phone.</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <div key={index} className="relative">
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => handleFocus(index)}
                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-md transition-all duration-200 ${
                  activeIndex === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                } focus:outline-none focus:border-blue-500 focus:bg-blue-50`}
              />
              {activeIndex === index && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-500 animate-pulse pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 mb-4"
        >
          Verify OTP
        </button>

        <div className="flex justify-between items-center text-sm text-gray-600">
            <button 
                onClick={handleResendOTP} 
                disabled={isResendDisabled}
                className={`font-medium ${
                  isResendDisabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-blue-600 hover:underline'
                }`}
            >
                {isResendDisabled ? `Resend OTP (${timer}s)` : 'Resend OTP'}
            </button>
            <button 
                onClick={handleDeleteOTP} 
                className="font-medium text-red-600 hover:underline"
            >
                Cancel
            </button>
        </div>

      </div>
    </div>
  )
}
