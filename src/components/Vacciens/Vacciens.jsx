import axios from "axios";
import React, { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import SimpleSlider from "../homeSlider/homeSlider";
import CategoriesSlider from "../categoriesSlider/categoriesSlider";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import img from "../../assets/images/photo_2025-06-07_14-32-19.jpg";



export default function Vacciens() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccines",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );
      console.log("Vaccines data:", response.data);
      setVaccines(response.data.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      toast.error("Failed to load vaccines");
    } finally {
      setLoading(false);
    }
  };
  // console.log('here');/

  // Add this function to filter vaccines
  const filteredVaccines = vaccines.filter(
    (vaccine) =>
      vaccine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vaccine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Oval
          height={80}
          width={80}
          color="#fda4af"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#fb7185"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <>
      {/* <SimpleSlider />

            <CategoriesSlider /> */}
      <div className="wrapper py-40 px-25 mx-auto">
        <div className="container mx-auto">
          <h2 className="text-4xl mb-4  text-rose-300">
            Our Featured Vaccines:
          </h2>
          {/* Search Bar */}
          <div className="mb-8  mx-auto">
            <input
              type="text"
              placeholder="Search vaccines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mx-auto justify-items-center">
            {filteredVaccines.map((vaccine) => (
              <div
                key={vaccine._id}
                className="bg-white rounded-2xl shadow-md p-4 flex flex-col w-full py-15"
              >
                <img
                  src={img}
                  alt={vaccine.name}
                  className="w-full h-70 mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-2">{vaccine.name}</h3>
                <p className="text-black-400 mb-3 font-semibold">
                  {vaccine.price} EGP
                </p>
                {/* <div className="flex gap-1">
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                    <i class="fa-solid fa-star text-amber-300">  </i>
                                </div> */}
                                <p className='mt-2'>{vaccine.description}</p>
                                <p className='mt-2 text-gray-600'>Required Age: {vaccine.requiredAge}</p>
                                <div className='w-full flex justify-end'>
                                    <button 
                                        onClick={() => {
                                            const token = localStorage.getItem('token');
                                            if (!token) {
                                                toast.error('Please login first to book vaccine appointments');
                                                return;
                                            }
                                            navigate(`/VaccineReservation/${vaccine._id}`);
                                        }} 
                                        className="bg-rose-300 mt-7 hover:bg-rose-400 text-white font-medium py-2 px-4 rounded-full cursor-pointer w-[100%]"
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