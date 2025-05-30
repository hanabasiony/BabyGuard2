// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function OTPVerification() {
//     const [otp, setOtp] = useState(['', '', '', '', '', '']);
//     const [timer, setTimer] = useState(60);
//     const [isResendDisabled, setIsResendDisabled] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         let interval;
//         if (timer > 0) {
//             interval = setInterval(() => {
//                 setTimer((prev) => prev - 1);
//             }, 1000);
//         } else {
//             setIsResendDisabled(false);
//         }
//         return () => clearInterval(interval);
//     }, [timer]);

//     const handleChange = (element, index) => {
//         if (isNaN(element.value)) return false;

//         setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

//         // Focus next input
//         if (element.nextSibling) {
//             element.nextSibling.focus();
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const otpValue = otp.join('');
        
//         try {
//             // Here you would make your API call to verify the OTP
//             // const response = await verifyOTP(otpValue);
            
//             // For now, we'll just simulate a successful verification
//             console.log('OTP submitted:', otpValue);
            
//             // Navigate to success page or dashboard
//             // navigate('/success');
//         } catch (error) {
//             console.error('OTP verification failed:', error);
//         }
//     };

//     const handleResendOTP = async () => {
//         try {
//             // Here you would make your API call to resend OTP
//             // await resendOTP();
            
//             setTimer(60);
//             setIsResendDisabled(true);
//             setOtp(['', '', '', '', '', '']);
//         } catch (error) {
//             console.error('Failed to resend OTP:', error);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-pink-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-sm">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-bold text-blue-800">
//                         Verify Your Order
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Please enter the 6-digit code sent to your email
//                     </p>
//                 </div>

//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     <div className="flex justify-center space-x-2">
//                         {otp.map((data, index) => (
//                             <input
//                                 key={index}
//                                 type="text"
//                                 maxLength="1"
//                                 value={data}
//                                 onChange={(e) => handleChange(e.target, index)}
//                                 onFocus={(e) => e.target.select()}
//                                 className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
//                             />
//                         ))}
//                     </div>

//                     <div className="text-center">
//                         <p className="text-sm text-gray-600">
//                             Didn't receive the code?{' '}
//                             <button
//                                 type="button"
//                                 onClick={handleResendOTP}
//                                 disabled={isResendDisabled}
//                                 className={`font-medium ${
//                                     isResendDisabled
//                                         ? 'text-gray-400 cursor-not-allowed'
//                                         : 'text-blue-600 hover:text-blue-500'
//                                 }`}
//                             >
//                                 {isResendDisabled
//                                     ? `Resend in ${timer}s`
//                                     : 'Resend Code'}
//                             </button>
//                         </p>
//                     </div>

//                     <div>
//                         <button
//                             type="submit"
//                             className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
//                         >
//                             Verify & Place Order
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// } 