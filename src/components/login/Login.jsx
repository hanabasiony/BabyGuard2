import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { FallingLines, Circles } from 'react-loader-spinner'
import { authContext } from '../../context/AuthContext'
import CartInitialization from '../CartInitialization/CartInitialization'

export default function Login() {
    const { setuserToken, userToken } = useContext(authContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [successMsg, setSuccessMsg] = useState(false)

    let user = {
        email: '',
        password: '',
    }

    let cart = {
        "cart": {
            "governorate": "Cairo",
            "city": "1st Settlement",
            "street": "Main Street",
            "buildingNumber": 123,
            "apartmentNumber": 45,
            "paymentType": "Cash"
        }
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
            console.log('Attempting login with values:', values)
            
            const response = await axios.post('http://localhost:8000/api/auth/login', values)
            console.log('Login response:', response.data)
            
            const { token, role } = response.data

            setSuccessMsg(true)
            setuserToken(token)
            localStorage.setItem('token', token)
            localStorage.setItem('role', role)

            // Initialize cart
            try {
                const cartResponse = await axios.post(
                    'http://localhost:8000/api/carts', 
                    cart,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                console.log('Cart initialized successfully:', cartResponse.data)
                
                // Store cart data in localStorage
                const cartData = cartResponse.data.data;
                localStorage.setItem('cartId', cartData._id);
                localStorage.setItem('cartDetails', JSON.stringify({
                    cartId: cartData._id,
                    governorate: cartData.governorate,
                    city: cartData.city,
                    street: cartData.street,
                    buildingNumber: cartData.buildingNumber,
                    apartmentNumber: cartData.apartmentNumber,
                    paymentType: cartData.paymentType,
                    Online: cartData.Online
                }));
                
                console.log('Cart data stored in localStorage')
            } catch (error) {
                console.error('Cart initialization error:', error)
                // If cart already exists, try to fetch it
                try {
                    const existingCart = await axios.get(
                        'http://localhost:8000/api/carts',
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    )
                    console.log('Existing cart found:', existingCart.data)
                    
                    // Store existing cart data
                    const cartData = existingCart.data;
                    localStorage.setItem('cartId', cartData._id);
                    localStorage.setItem('cartDetails', JSON.stringify({
                        governorate: cartData.governorate,
                        city: cartData.city,
                        street: cartData.street,
                        buildingNumber: cartData.buildingNumber,
                        apartmentNumber: cartData.apartmentNumber,
                        paymentType: cartData.paymentType,
                        Online: cartData.Online
                    }));
                    
                    console.log('Existing cart data stored in localStorage')
                } catch (fetchError) {
                    console.error('Error fetching existing cart:', fetchError)
                }
            }

            // Navigate based on role
            console.log('Current role:', role)

            // navigate('/home')
            if (role == 'parent') {
                console.log('Navigating to products')
                navigate('/products')
            } else {
                console.log('Navigating to admin panel')
                navigate('/adminPannel')
            }
            
            
        } catch (error) {
            console.error('Login error:', error)
            console.error('Error response:', error.response)
            setErrorMsg(error.response?.data?.message || 'Login failed')
            setTimeout(() => setErrorMsg(null), 2000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="wrapper   bg-pink-50 py-70  ">
            <form 
                className="max-w-md mx-auto px-8" 
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Form submitted');
                    formik.handleSubmit(e);
                }}
            >
                {successMsg ?
                    <div className="absolute top-25 p-4 mb-4 mt-10   left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-800 rounded-lg text-center bg-green-50 ">
                        welcome back
                    </div>
                    : null}

                {errorMsg ?
                    <div className="absolute top-25 p-4 mb-4 mt-10 text-red-800 rounded-lg text-center bg-red-50  left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        {errorMsg}
                    </div>
                    : null}

                <div className="relative z-0 w-full mb-5 group">
                    <input value={formik.values.email} onBlur={formik.handleBlur} onChange={formik.handleChange} type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                    {formik.errors.email && formik.touched.email ? <div class="p-4  mt-2 mb-4 text-sm text-red-800 rounded-lg bg-blue-100 dark:bg-blue-100 text-center dark:text-red-400 text-center" role="alert">
                        {formik.errors.email}
                    </div> : ''}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input value={formik.values.password} onBlur={formik.handleBlur} onChange={formik.handleChange} type="text" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"> password</label>
                    {formik.errors.password && formik.touched.password ? <div class="p-4  mt-2 mb-4 text-sm text-red-800 rounded-lg bg-blue-100 dark:bg-blue-100 text-center dark:text-red-400 text-center" role="alert">
                        {formik.errors.password}
                    </div> : ''}
                </div>

                <div className='flex justify-center items-center ' >
                    <button type="submit" className="text-white bg-pink-200 cursor-pointer hover:bg-pink-200 focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-pink-400 dark:hover:bg-pink-500 dark:focus:ring-pink-500" disabled={loading}>{loading ? 'Loading..' : 'Login'}</button>
                    <Link to='/PassSend' className='text-sm text-center w-full  hover:text-blue-500'> Forgot password ? </Link>
                    <Link to='/reg' className='text-sm text-center w-full  hover:text-blue-500'> Don't have an account ? </Link>
                </div>
            </form>
        </div>
    )
}


