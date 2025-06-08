import React, { useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const VerifyResetCode = () => {
    console.log('VerifyResetCode component rendered');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(false);
    const navigate = useNavigate();
    const { email } = useParams();
    console.log('Email from params:', email);

    const initialValues = {
        otp: ''
    };
    console.log('Initial form values:', initialValues);

    const validationSchema = yup.object().shape({
        otp: yup
            .string()
            .required("OTP is required")
            .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleVerifyResetCode
    });

    async function handleVerifyResetCode(values) {
        console.log('handleVerifyResetCode called with values:', values);
        setLoading(true);
        try {
            console.log('Sending verification request with:', { email, otp: values.otp });
            const response = await axios.post(
                'https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/auth/verify-otp',
                {
                    email,
                    otp: values.otp
                }
            );
            console.log('Verification response:', response);

            console.log('Setting reset token in localStorage:', response.data.data.resetToken);
            localStorage.setItem('resetToken', response.data.data.resetToken);
            setSuccessMsg(true);
            toast.success("Code verified successfully!");
            console.log('Redirecting to password change page...');
            setTimeout(() => {
                navigate('/email-forgot-pass/verify-OTP/ForgotPassChangePage');
            }, 2000);

        } catch (error) {
            console.error("Verification error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            const errorMessage = error.response?.data?.message || "Failed to verify code";
            setErrorMsg(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
            console.log('Verification process completed');
        }
    }

    console.log('Current form state:', {
        values: formik.values,
        errors: formik.errors,
        touched: formik.touched,
        loading,
        errorMsg,
        successMsg
    });

    return (
        <div className="min-h-screen bg-white-50 pt-35 pb-1">
            <form
                className="max-w-md mx-auto px-4 sm:px-8"
                onSubmit={formik.handleSubmit}
                autoComplete="off"
            >
                {successMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
                        Code verified successfully! Redirecting...
                    </div>
                )}
                {errorMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
                        {errorMsg}
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Verify Reset Code
                    </h2>

                    {/* Email */}
                    {/* <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="email"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Email address
                        </label>
                        {formik.errors.email && formik.touched.email && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.email}
                            </div>
                        )}
                    </div> */}

                    {/* OTP */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            name="otp"
                            id="otp"
                            value={formik.values.otp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
                            placeholder=" "
                            maxLength="6"
                            required
                        />
                        <label
                            htmlFor="otp"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Verification Code
                        </label>
                        {formik.errors.otp && formik.touched.otp && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.otp}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="text-white bg-rose-300 cursor-pointer hover:bg-rose-350 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default VerifyResetCode;
