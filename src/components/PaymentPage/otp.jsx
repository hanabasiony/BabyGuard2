"use client"

import { useState, useRef, useEffect } from "react"

export default function OTPInput() {
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
      alert(`OTP Submitted: ${otpValue}`)
    } else {
      alert("Please enter all 6 digits")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">OTP Input</h1>
          <p className="text-gray-500 text-lg">Enter your one-time password</p>
        </div>

        <div className="flex justify-center gap-3 mb-8">
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
                className={`w-16 h-16 text-center text-2xl font-semibold border-2 rounded-lg transition-all duration-200 ${
                  activeIndex === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                } focus:outline-none focus:border-blue-500 focus:bg-blue-50`}
              />
              {activeIndex === index && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 animate-pulse pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-pink-400 hover:bg-pink-500 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
