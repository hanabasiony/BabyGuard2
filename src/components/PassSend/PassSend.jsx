import axios from 'axios'
import React, { useContext, useState } from 'react'
import * as yup from 'yup';
import { phone } from 'fontawesome';
import { useFormik } from 'formik'
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FallingLines } from 'react-loader-spinner'
import { authContext } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';



export default function PassSend() {

    // async function sendPass(values){
    //     const data = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords')
    //     .then(function(succ){
    //         console.log(succ);

    //     })
    //     .catch(function(err){
    //         console.log(err);
    //     })
    // }

const [ loading, setLoading] = useState(false);

    const [erorrMsg, setErorrMsg] = useState(null)
    const [succMsg, setSuccMsg] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const navigate = useNavigate()

    let user = {
        email: ''
    }
    async function sendCode(values) {
        setLoading(true)
        // console.log(values);
        setIsClicked(true)
        const data = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', values)
            .then(function (succ) {

                console.log(succ);

                setLoading(false)
                // setuserToken(succ.data.token)

                // localStorage.setItem('tkn', succ.data.token)
                // congratulations msg
                setSuccMsg(true)

                setTimeout(() => {
                    navigate('./VerifyResetCode')
                }, 2000)

                // setIsClicked(false)


            }).catch(function (err) {
                console.log(err.response.data.message);
                // err.response.data.message
                // setErorrMsg(err.response.data.message)


                // setTimeout(() => {
                //     setErorrMsg(null)
                // }, 2000)

                // setIsClicked(false)

            })

    }

    const regFormik = useFormik({


        initialValues: user,


        onSubmit: sendCode,

        validationSchema:
            yup.object().shape(
                {
                    email: yup.string().email('invalid email'),
              


                }
            )
        ,


    })


    return (
        <>
            <div className="wrapper w-full bg-pink-50 py-70">
                <form className=' max-w-md mx-auto px-10 bg-pink-50 pb-10 ' onSubmit={regFormik.handleSubmit}>
                    <div className="relative z-0 w-full mb-5 group">
                        <input value={regFormik.values.email} onBlur={regFormik.handleBlur} onChange={regFormik.handleChange} type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
                        {regFormik.errors.email && regFormik.touched.email ? <div class="p-4  mt-2 mb-4 text-sm text-red-800 rounded-lg bg-blue-100 dark:bg-blue-100 text-center dark:text-red-400" role="alert">
                            {regFormik.errors.email}
                        </div> : ''}

                    </div>


                    <button type="submit" className="text-white bg-pink-400 hover:bg-pink-500 focus:ring-4 focus:outline-none focus:ring-pink-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-pink-400 dark:hover:bg-pink-500 dark:focus:ring-pink-500">{loading ? 'Loading' : 'Send Code'}</button>

                </form>
            </div>
        </>
    )


}
