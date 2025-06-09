import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import img4 from "../../assets/images/preg.jpg";
import img5 from "../../assets/images/recommended food.jpg";
import img6 from "../../assets/images/preg3.jpg";
import img7 from "../../assets/images/IMG_3220.JPG";
import img8 from "../../assets/images/IMG_3222.JPG";
import img9 from "../../assets/images/IMG_3226.JPG";
import img10 from "../../assets/images/IMG_3219.JPG";
import img11 from "../../assets/images/IMG_3218.JPG";
import AboutUs from "../AboutUs/AboutUs";

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/products"
        );
        // Take only the first 4 products
        setFeaturedProducts(response.data.data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r pt-40 from-rose-50 to-blue-50 mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6 ml-8 mr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                Your Kid's Health is Your Wealth
              </h1>
              <p className="text-gray-600 max-w-md">
                Track your baby's growth, get expert tips, and ensure their healthy
                development with Baby Guard.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-rose-300 hover:bg-rose-400 cursor-pointer text-white px-6 py-2 rounded-full flex items-center"
              >
                Get Started <span className="ml-2">→</span>
              </button>
            </div>

            <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center w-full">
              <div className="rounded-lg p-4 bg-transparent w-full max-w-md md-p4 mt-6">
                <Slider
                  dots={true}
                  infinite={true}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  autoplay={true}
                  autoplaySpeed={3000}
                >
                  {[img10, img11].map((image, index) => (
                    <div key={index}>
                      <img
                        src={image || "/placeholder.svg"}
                        className="rounded-lg w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </section>

          {/* Vaccine Reminder Banner */}
          <div className="bg-gradient-to-r from-rose-50 to-blue-50 py-4">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 text-lg">🔔</span>
                  <p className="text-gray-800 text-center font-medium">
                    Once you register your child, we will send you vaccine reminders
                    to make sure that you remember
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Features */}
          <section className="mx-auto px-12 py-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12 mt-10">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-rose-50 border-none rounded-lg shadow-sm p-6 transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <div className="bg-rose-200 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-rose-600">💉</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Vaccination Appointments
                </h3>
                <p className="text-gray-600 text-sm">
                  Book home vaccination appointments.
                </p>
              </div>

              <div className="bg-blue-50 border-none rounded-lg shadow-sm p-6 transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <div className="bg-blue-200 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">🌿</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Natural Products</h3>
                <p className="text-gray-600 text-sm">
                We offer herbs and natural products to help mother
                </p>
              </div>

              <div className="bg-rose-50 border-none rounded-lg shadow-sm p-6 transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <div className="bg-rose-200 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-rose-600">📚</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Expert Tips</h3>
                <p className="text-gray-600 text-sm">
                  Access pregnancy tips from experts.
                </p>
              </div>
            </div>
          </section>

          {/* Pregnancy Tips */}
          <section className=" mx-auto px-14 py-12 bg-gradient-to-r from-rose-50 to-blue-50 ">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">
              Pregnancy Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg shadow-lg overflow-hidden transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <img
                  src={img4}
                  alt="Trimesters Nutrition"
                  className="w-full h-48 object-fill"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Trimesters advices
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Essential advices for pregnancy.
                  </p>
                </div>
              </div>

              <div className="rounded-lg shadow-lg overflow-hidden transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <img
                  src={img5}
                  alt="Recommended Food"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Recommeded Food</h3>
                  <p className="text-gray-600 text-sm">
                    Food recommendation during pregnancy.
                  </p>
                </div>
              </div>

              <div className="rounded-lg shadow-lg overflow-hidden transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <img
                  src={img6}
                  alt="Week by Week Guide"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Week by Week Guide
                  </h3>
                  <p className="text-gray-600 text-sm">
                    What to expect during pregnancy.
                  </p>
                </div>
              </div>
            </div>
          </section>

      {/* Featured Products */}
      <section className="mx-auto px-16 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-4 text-center">Loading products...</div>
          ) : (
            featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-rose-50 border-none rounded-lg shadow-sm p-6 transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover mb-4 rounded-full"
                  />
                  <h3 className="font-medium text-center mb-2">
                    {product.name}
                  </h3>
                  <p className="text-pink-500 font-semibold">
                    EGP {product.price}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

          {/* Testimonials */}
          <section className="mx-auto px-14 py-12 bg-gradient-to-r from-rose-50 to-blue-50">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">
              What Parents Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg shadow-lg bg-white transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-rose-200 flex items-center justify-center mb-4">
                    <span className="text-rose-500 text-xl font-semibold">AM</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Baby Guard has been a lifesaver! The vaccination reminders are
                    so helpful."
                  </p>
                  <p className="font-semibold">Aya Mohamed</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                    <span className="text-blue-400 text-xl font-semibold">ZA</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The pregnancy tips are incredibly detailed and helpful. Highly
                    recommend!"
                  </p>
                  <p className="font-semibold">Zahra Ahmed</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center mb-4">
                    <span className="text-pink-500 text-xl font-semibold">ME</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "I love the product recommendations and the easy-to-use
                    interface!"
                  </p>
                  <p className="font-semibold">Mona El-Sayed</p>
                </div>
              </div>
            </div>
          </section>

          <div id="about-section">
            <AboutUs />
          </div>
        </>
      )}
    </div>
  );
}
