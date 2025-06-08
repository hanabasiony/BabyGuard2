import axios from 'axios'
import React, { useContext, useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authContext } from '../../context/AuthContext';

export default function PassSend() {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const navigate = useNavigate();

    let user = {
        email: ''
    }



    async function sendCode(values) {
        setLoading(true);
        try {
            const response = await axios.post(
                'https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/auth/forgot-password',
                {
                    email: values.email
                }
            );
            console.log("Reset code response:", response);
            setSuccessMsg(true);
            toast.success("Reset code sent successfully!");
            
            setTimeout(() => {
                navigate('./VerifyResetCode');
            }, 2000);
        } catch (error) {
            console.error("Error sending reset code:", error);
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                for (const field in errors) {
                    if (Array.isArray(errors[field])) {
                        errors[field].forEach((err) => {
                            if (err.msg) {
                                toast.error(`${field}: ${err.msg}`);
                            }
                        });
                    } else if (errors[field] && typeof errors[field].msg === "string") {
                        toast.error(`${field}: ${errors[field].msg}`);
                    } else {
                        toast.error(`Error in ${field}`);
                    }
                }
            } else {
                toast.error(error.response?.data?.message || "Failed to send reset code");
            }
        } finally {
            setLoading(false);
        }
    }

    const regFormik = useFormik({
        initialValues: user,
        onSubmit: sendCode,
        validationSchema: yup.object().shape({
            email: yup.string().email('Invalid email').required('Email is required'),
        })
    });

    return (
        <div className="min-h-screen bg-white-50 pt-35 pb-1">
            <form
                className="max-w-md mx-auto px-4 sm:px-8"
                onSubmit={regFormik.handleSubmit}
                autoComplete="on"
            >
                {successMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
                        Reset code sent successfully!
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Reset Password
                    </h2>
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={regFormik.values.email}
                            onChange={regFormik.handleChange}
                            onBlur={regFormik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-sky-400 peer"
                            placeholder=" "
                            required
                            autoComplete="email"
                        />
                        <label
                            htmlFor="email"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-sky-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Email address
                        </label>
                        {regFormik.errors.email && regFormik.touched.email && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                                {regFormik.errors.email}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="text-white bg-rose-300 cursor-pointer hover:bg-rose-350 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Code"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
