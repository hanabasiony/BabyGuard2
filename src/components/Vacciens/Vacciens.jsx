import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FallingLines } from 'react-loader-spinner'
import LoaderScreen from '../loaderScreen/loaderScreen'
import SimpleSlider from '../homeSlider/homeSlider'
import CategoriesSlider from '../categoriesSlider/categoriesSlider'
import { useQuery } from '@tanstack/react-query'

export default function Vacciens() {

    // function getAllVacciens() {
    //     return axios.get('https://ecommerce.routemisr.com/api/v1/products')
    // }

    // const { data, isError, error, isLoading, isFetching } = useQuery({
    //     queryKey: ['getAllVacciens'],
    //     queryFn: getAllVacciens
    // })

    // console.log('data', data);
    // console.log('isError', isError);
    // console.log('error', error);
    // console.log('isLoading', isLoading);
    // console.log('isFetching', isFetching);


    // if (isLoading) {
    //     return <LoaderScreen />
    // }
    // if (isError) {
    //     return <div>{isError}</div>
    // }


    return (
        <>
            {/* <SimpleSlider />

            <CategoriesSlider /> */}
            <div className="wrapper py-40  px-25 mx-auto ">
                <div className='container mx-auto '>

                    <div className="grid grid-cols-1  gap-4 md:gap-6 mx-auto justify-items-center">

                       <div  className="bg-white rounded-2xl shadow-md p-4 flex flex-col  w-full py-15">
                            <img src='' alt='img title' className=' w-34 h-34 mb-4' />
                          



                            <p className='text-black-400 mb-3 font-semibold'>EGP </p>
                           <div className="flex gap-1">
                            <i class="fa-solid fa-star text-amber-300">  </i>
                            <i class="fa-solid fa-star text-amber-300">  </i>
                            <i class="fa-solid fa-star text-amber-300">  </i>
                            <i class="fa-solid fa-star text-amber-300">  </i>
                           </div>

                            <p className='mt-2'>Safe BPA-free bottle for new born</p>

                            <div className='w-full flex justify-center'>
                                <button class="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-full cursor-pointer w-[50%] ">
                                    Book now
                                </button>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </>

    )
}