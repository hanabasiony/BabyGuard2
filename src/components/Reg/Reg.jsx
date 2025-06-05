import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import values from './../../../node_modules/lodash-es/values';
import includes from './../../../node_modules/lodash-es/includes';
import * as yup from 'yup';
import { phone } from 'fontawesome';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Circles } from 'react-loader-spinner'
import { authContext } from '../../context/AuthContext';


export default function Reg() {

    const [erorrMsg, setErorrMsg] = useState(null)
    const [succMsg, setSuccMsg] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [loading, setLoading] = useState(false)

    const { setuserToken } = useContext(authContext)

    const navigate = useNavigate()

    let user = {

        fName: '',
        lName: '',
        email: '',
        nationalIdNumer:  '',
        birthDate: '',
        password: '',
        passwordConfirm: '',
        phoneNumber: '',
        governorate: '',
        city: '',
        street: '',
        buildingNumber: '',
        apartmentNumber: '',
        gender: '',
        
       



    }
  


    async function regestirUser(values) {

        
        // console.log(values);
        setLoading(true)
        setIsClicked(true)
        
        // Format the birthDate to YYYY-MM-DD
        const formattedValues = {
            ...values,
            birthDate: new Date(values.birthDate).toISOString().split('T')[0]
        };

        const data = await axios.post('http://localhost:8000/api/auth/signup', formattedValues)
            .then(function (succ) {
              

                setLoading(false)
                console.log(succ.data.message);
                console.log(succ.data.token);

                // congratulations msg
                setSuccMsg(true)

                // setuserToken(succ.data.token)
                // localStorage.setItem('tkn', succ.data.token)

                setTimeout(() => {
                    navigate('/login')
                }, 2000)

                setIsClicked(false)


            }).catch(function (err) {
              
                console.log(err);

                setTimeout(() => {
                    setErorrMsg(null)
                }, 3000)
                setLoading(false)
                setIsClicked(false)
                // setErorrMsg(err.response.data.errors.phoneNumber)

                if (err.response && err.response.data && err.response.data.errors) {
                    const errorData = err.response.data.errors;
                    const firstKey = Object.keys(errorData)[0];
                    setErorrMsg(errorData[firstKey].msg);
                } 
            })

    }

    const regFormik = useFormik({
        initialValues: user,
        onSubmit: regestirUser,


        validationSchema:
            yup.object().shape(
                {
        

                    fName: yup.string().required("name is required").min(3, "minimum must be 3 characters").max(12, "maximum must be 12 values"),
                    lName: yup.string().required("name is required").min(3, "minimum must be 3 characters").max(12, "maximum must be 12 values"),
                    email: yup.string().email('invalid email'),
                    nationalIdNumer: yup.string().required('national id is req').min(14).max(14),
                    birthDate: yup.date()
                        .required("Birth date is required")
                        .max(new Date(), "Birth date cannot be in the future")
                        .min(new Date(1900, 0, 1), "Birth date must be after 1900"),
                    password: yup.string().required('password is required').min(6),
                    passwordConfirm: yup.string().required('password is required').oneOf([yup.ref('password'), 'passwords dont match']),
                    phoneNumber: yup.string().required('phone number is req').matches(/^01[0-2,5]{1}[0-9]{8}$/, 'must be EGP number'),
                    governorate: yup.string().required("governorate is required"),
                    city: yup.string().required("city is required"),
                    street: yup.string().required("street is required"),
                    buildingNumber: yup.string().required("building number is required").max(3, "maximum must be 3 values"),
                    apartmentNumber: yup.string().required("apartment number number is required"),
                    gender: yup.string().required("Gender is required").oneOf(["male", "female"], "Gender must be either 'male' or 'female'"),
                    // profileImg: yup.string()


                }
            )
        ,


    })
    return (
        <div className="min-h-screen bg-white-50 pt-24 pb-12">
            <form className="max-w-md mx-auto px-4 sm:px-8" onSubmit={regFormik.handleSubmit}>
                {succMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-green-800 rounded-lg text-center bg-green-50 z-50">
                        Congratulations
                    </div>
                )}
                {erorrMsg && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 p-4 mb-4 text-red-800 rounded-lg text-center bg-red-50 z-50">
                        {erorrMsg}
                    </div>
                )}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Register</h2>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.fName} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="text" name="fName" id="fName" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="fName" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                        {regFormik.errors.fName && regFormik.touched.fName ? <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.fName}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.lName} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="text" name="lName" id="lName" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="lName" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                        {regFormik.errors.lName && regFormik.touched.lName ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.lName}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.email} onBlur={regFormik.handleBlur} onChange={regFormik.handleChange} type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                        {regFormik.errors.email && regFormik.touched.email ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.email}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.nationalIdNumer} onBlur={regFormik.handleBlur} onChange={regFormik.handleChange} type="text" name="nationalIdNumer" id="nationalIdNumer" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="nationalIdNumer" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">National ID Number</label>
                        {regFormik.errors.nationalIdNumer && regFormik.touched.nationalIdNumer ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.nationalIdNumer}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.birthDate} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="date" name="birthDate" id="birthDate" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="birthDate" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Birth Date</label>
                        {regFormik.errors.birthDate && regFormik.touched.birthDate ? (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.birthDate}</div>
                        ) : null}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.password} onBlur={regFormik.handleBlur} onChange={regFormik.handleChange} type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                        {regFormik.errors.password && regFormik.touched.password ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.password}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.passwordConfirm} onBlur={regFormik.handleBlur} onChange={regFormik.handleChange} type="password" name="passwordConfirm" id="passwordConfirm" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="passwordConfirm" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                        {regFormik.errors.passwordConfirm && regFormik.touched.passwordConfirm ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.passwordConfirm}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.phoneNumber} onBlur={regFormik.handleBlur} onChange={regFormik.handleChange} type="text" name="phoneNumber" id="phoneNumber" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="phoneNumber" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Phone Number</label>
                        {regFormik.errors.phoneNumber && regFormik.touched.phoneNumber ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.phoneNumber}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.governorate} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="text" name="governorate" id="governorate" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="governorate" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Governorate</label>
                        {regFormik.errors.governorate && regFormik.touched.governorate ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.governorate}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.city} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="text" name="city" id="city" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="city" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>
                        {regFormik.errors.city && regFormik.touched.city ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.city}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.street} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="text" name="street" id="street" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="street" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Street</label>
                        {regFormik.errors.street && regFormik.touched.street ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.street}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.buildingNumber} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="text" name="buildingNumber" id="buildingNumber" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="buildingNumber" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Building Number</label>
                        {regFormik.errors.buildingNumber && regFormik.touched.buildingNumber ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.buildingNumber}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.apartmentNumber} onChange={regFormik.handleChange} onBlur={regFormik.handleBlur} type="text" name="apartmentNumber" id="apartmentNumber" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="apartmentNumber" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Apartment Number</label>
                        {regFormik.errors.apartmentNumber && regFormik.touched.apartmentNumber ? <div className="p-4 mt-2 mb-4 text-center text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.apartmentNumber}</div> : ''}
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    value="male"
                                    onChange={regFormik.handleChange}
                                    onBlur={regFormik.handleBlur}
                                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500"
                                />
                                <label htmlFor="male" className="ml-2 text-sm font-medium text-gray-900">Male</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    value="female"
                                    onChange={regFormik.handleChange}
                                    onBlur={regFormik.handleBlur}
                                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500"
                                />
                                <label htmlFor="female" className="ml-2 text-sm font-medium text-gray-900">Female</label>
                            </div>
                        </div>
                        {regFormik.errors.gender && regFormik.touched.gender ? (
                            <div className="p-4 mt-2 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{regFormik.errors.gender}</div>
                        ) : ''}
                    </div>
                    <div className='flex justify-between w-full items-center mt-4'>
                        <button type="submit" className="text-white  bg-pink-400 cursor-pointer hover:bg-pink-500 focus:ring-4 focus:outline-none focus:ring-pink-500 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">{loading ? 'Loading..' : 'Register'}</button>
                        <Link to='/login' className='text-sm text-pink-500   hover:underline'>Have an account?</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
