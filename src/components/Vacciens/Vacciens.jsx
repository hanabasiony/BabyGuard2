import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FallingLines } from 'react-loader-spinner'
import LoaderScreen from '../loaderScreen/loaderScreen'
import { Link, useNavigate } from 'react-router-dom'
import SimpleSlider from '../homeSlider/homeSlider'
import CategoriesSlider from '../categoriesSlider/categoriesSlider'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export default function Vacciens() {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        fetchVaccines();
    }, []);

    const fetchVaccines = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/api/vaccines', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Vaccines data:', response.data);
            setVaccines(response.data.data);
        } catch (error) {
            console.error('Error fetching vaccines:', error);
            toast.error('Failed to load vaccines');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoaderScreen />;
    }

    return (
        <>
            {/* <SimpleSlider />

            <CategoriesSlider /> */}
            <div className="wrapper py-40 px-25 mx-auto">
                <div className='container mx-auto'>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 md:gap-6 mx-auto justify-items-center">
                        {vaccines.map((vaccine) => (
                            <div key={vaccine._id} className="bg-white rounded-2xl shadow-md p-4 flex flex-col w-full py-15">
                                {/* <img 
                                    src={vaccine.image} 
                                    alt={vaccine.name} 
                                    className='w-34 h-34 mb-4 object-cover'
                                /> */}
                                <h3 className='text-xl font-bold mb-2'>{vaccine.name}</h3>
                                <p className='text-black-400 mb-3 font-semibold'>{vaccine.price} EGP</p>
                                {/* <div className="flex gap-1">
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                </div> */}
                                <p className='mt-2'>{vaccine.description}</p>
                                <p className='mt-2 text-gray-600'>Required Age: {vaccine.requiredAge} months</p>
                                <div className='w-full flex justify-center'>
                                    <button 
                                        onClick={() => navigate(`/VaccinationForm/${vaccine._id}`)} 
                                        className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-full cursor-pointer w-[50%]"
                                    >
                                        Book now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}