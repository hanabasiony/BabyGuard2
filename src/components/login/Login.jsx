import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { authContext } from '../../context/AuthContext'
import { useUserData } from '../GetUserData/GetUserData'

export default function Login() {
    const { setuserToken } = useContext(authContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(false)
    const { fetchUserData } = useUserData()

    let user = {
        email: '',
        password: '',
    }

    const validationSchema = yup.object().shape({
        email: yup.string().email('Invalid email'),
        password: yup.string()
            .required('Password is required')
            .min(6, 'Minimum length is 6 characters')
            .max(12, 'Maximum length is 12 characters')
    })

    const formik = useFormik({
        initialValues: user,
        validationSchema,
        onSubmit: handleLogin
    })

    async function handleLogin(values) {
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', values)
            const { token, role } = response.data
            setSuccessMsg(true)
            setuserToken(token)
            localStorage.setItem('token', token)
            localStorage.setItem('role', role)
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/products');
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Login failed')
            setTimeout(() => setErrorMsg(null), 2000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white-50 pt-35 pb-1">
            <form className="max-w-md mx-auto px-4 sm:px-8" onSubmit={formik.handleSubmit}>
                {successMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
                        Welcome back
                    </div>
                )}
                {errorMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
                        {errorMsg}
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Login</h2>
                    {/* Email */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Email address
                        </label>
                        {formik.errors.email && formik.touched.email && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.email}
                            </div>
                        )}
                    </div>
                    {/* Password */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Password
                        </label>
                        {formik.errors.password && formik.touched.password && (
                            <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50">
                                {formik.errors.password}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            className="text-white bg-pink-400 cursor-pointer hover:bg-pink-500 focus:ring-4 focus:outline-none focus:ring-pink-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                    <div className="flex flex-col w-full gap-2 mt-4">
                        <Link to='/PassSend' className='text-sm text-center text-pink-500 hover:underline'>Forgot password?</Link>
                        <Link to='/reg' className='text-sm text-center text-pink-500 hover:underline'>Don't have an account?</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}


