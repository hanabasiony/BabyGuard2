"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function OTPInput() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

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

  const handleSubmit = () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      console.log(`OTP Submitted: ${otpValue}`)
      toast.success("OTP submitted successfully!");
      // Handle OTP verification here
      // If verification is successful, navigate
      // navigate('/success'); // Example navigation
    } else {
      toast.error("Please enter all 6 digits");
    }
  }

  const handleResendOTP = () => {
    // Handle resend OTP logic here (e.g., make an API call)
    console.log("Resending OTP...");
    toast.success("OTP resent!");
    // Clear OTP inputs
    setOtp(["", "", "", "", "", ""]);
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
    // You would typically make an API call here to request a new OTP
  };

  const handleDeleteOTP = () => {
    // Handle delete/cancel OTP process here
    console.log("Deleting OTP process...");
    toast("OTP process cancelled.");
    // Example: Navigate back to a previous page or home
    navigate('/'); // Example navigation
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
                className={`font-medium text-blue-600 hover:underline`}
            >
                Resend OTP
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
