import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
// import { h2 } from 'fontawesome'

export default function Categories() {

    function getAllCategories() {
        return axios.get('https://ecommerce.routemisr.com/api/v1/categories')
    }

    const { data, isError, error, isLoading, isFetching } = useQuery({
        queryKey: ['getAllCategories'],
        queryFn: getAllCategories 
    })
    console.log(data);
    console.log(isError);
    console.log(error);
    console.log(isLoading);
    console.log(isFetching);


    
    
  return (
    <div className='container mx-auto p-5 bg-amber-400'>

        <div className="grid md:grid-cols-3 lg:grid-cols-5">

            {data?.data.data.map( category =>
                <div key={category._id}>
                    <img src={category.image} alt={category.name} />
                    <h2>{category.name}</h2>
                </div>
             )}

        </div>
        
    </div>



  )
}
