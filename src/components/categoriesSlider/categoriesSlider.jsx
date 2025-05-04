import axios from 'axios';
import React, {  useEffect, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from '@tanstack/react-query'



export default function CategoriesSlider() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 3,
    };
    // const [allcategories, setAllCategories] = useState(null)

    function getAllCategories() {
         axios.get('https://ecommerce.routemisr.com/api/v1/categories')
            
    }
    const { data, isError, error, isLoading, isFetching } = useQuery({
        queryKey: ['getAllCategories'],
        queryFn: getAllCategories 
    })

    // useEffect(function () {
    //     getAllCategories()
    // }, [])
    return (
        <>

            <Slider {...settings} autoplay>

            {data?.data.data.map( category =>
                <div key={category._id}>
                    <img className='w-full h-72' src={category.image} alt={category.name}/>
                    <h6>{category.name}</h6>
                </div>
             )}
            </Slider>
        </>

    );
}
