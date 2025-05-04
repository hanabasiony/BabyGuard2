import React from "react"
import Slider from "react-slick"
// import img4 from '../../assets/photo_2025-04-17_10-54-11.jpg'
// import img5 from "../../assets/photo_2025-04-17_10-54-11 (2).jpg"
// import img6 from "../../assets/photo_2025-04-17_15-08-14.jpg"
// import img7 from "../../assets/photo_2025-04-17_15-19-23.jpg"
// import img8 from "../../assets/photo_2025-04-17_15-19-24 (2).jpg"
// import img9 from "../../assets/photo_2025-04-17_15-19-24.jpg"
// import img10 from "../../assets/img10.jpg"
// import img11 from "../../assets/img11.jpg"


export default function Home() {
    return (
    
      <div className="min-h-screen ">
        {/* Hero Section */}
        <section className="container px-14 bg-gradient-to-r from-pink-50 to-blue-50  mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">Your Kid's Health is Your Wealth</h1>
            <p className="text-gray-600 max-w-md">
              Track your baby's growth, get expert tips, and ensure their healthy development with Baby Guard.
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center">
              Get Started <span className="ml-2">→</span>
            </button>
          </div>

          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center w-full">
  <div className="rounded-lg p-4 bg-transparent w-full max-w-md md-p4">
    <Slider
      dots={true}
      infinite={true}
      speed={500}
      slidesToShow={1}
      slidesToScroll={1}
      autoplay={true}
      autoplaySpeed={3000}
    >
      {[img10,img11].map((image,index) => (
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

        
        {/* Core Features */}
        <section className="container mx-auto px-12 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-pink-50 border-none rounded-lg shadow-sm p-6">
              <div className="bg-pink-200 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="text-pink-600">💉</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Vaccination Appointments</h3>
              <p className="text-gray-600 text-sm">Book hassle-free at-home vaccination appointments.</p>
            </div>
  
            <div className="bg-blue-50 border-none rounded-lg shadow-sm p-6">
              <div className="bg-blue-200 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600">🔔</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Vaccine Alerts</h3>
              <p className="text-gray-600 text-sm">Get real-time alerts for upcoming vaccinations.</p>
            </div>
  
            <div className="bg-pink-50 border-none rounded-lg shadow-sm p-6">
              <div className="bg-pink-200 w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <span className="text-pink-600">📚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Tips</h3>
              <p className="text-gray-600 text-sm">Access pregnancy and baby care tips from experts.</p>
            </div>
          </div>
        </section>
  
        {/* Pregnancy Tips */}
        <section className="container mx-auto px-14 py-12 bg-gradient-to-r from-pink-50 to-blue-50 ">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">Pregnancy Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg shadow-lg overflow-hidden">

<img
                src={img4}
                alt="First Trimester Nutrition"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">First Trimester Nutrition</h3>
                <p className="text-gray-600 text-sm">Essential nutrients for early pregnancy.</p>
                <div className="mt-4">
                  <button className="text-pink-500 p-0 hover:text-pink-600 text-sm font-medium">Read More</button>
                </div>
              </div>
            </div>
  
            <div className=" rounded-lg shadow-lg overflow-hidden">
              <img
                src={img5}
                alt="Safe Exercises"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Safe Exercises</h3>
                <p className="text-gray-600 text-sm">Stay active during pregnancy.</p>
                <div className="mt-4">
                  <button className="text-pink-500 p-0 hover:text-pink-600 text-sm font-medium">Read More</button>
                </div>
              </div>
            </div>
  
            <div className=" rounded-lg shadow-lg overflow-hidden">
              <img
                src={img6}
                alt="Month by Month Guide"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Month by Month Guide</h3>
                <p className="text-gray-600 text-sm">What to expect during pregnancy.</p>
                <div className="mt-4">
                  <button className="text-pink-500 p-0 hover:text-pink-600 text-sm font-medium">Read More</button>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Featured Products */}
        <section className="container mx-auto px-16 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">Featured Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-pink-50 border-none rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 text-2xl">🚼</div>
                <h3 className="font-medium text-center mb-2">Baby Stroller</h3>
                <p className="text-pink-500 font-semibold">$299</p>
              </div>
            </div>
  
            <div className="bg-blue-50 border-none rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 text-2xl">🍼</div>
                <h3 className="font-medium text-center mb-2">Feeding Bottle</h3>
                <p className="text-blue-500 font-semibold">$15</p>
              </div>
            </div>
  
            <div className="bg-pink-50 border-none rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 text-2xl">🧸</div>
                <h3 className="font-medium text-center mb-2">Educational Toys</h3>
                <p className="text-pink-500 font-semibold">$49</p>
              </div>
            </div>
  
            <div className="bg-blue-50 border-none rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 text-2xl">🛏</div>
                <h3 className="font-medium text-center mb-2">Baby Crib</h3>
                <p className="text-blue-500 font-semibold">$399</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Testimonials */}
        <section className="container mx-auto px-14 py-12 bg-gradient-to-r from-pink-50 to-blue-50">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">What Parents Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className=" rounded-lg shadow-lg bg-white">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                  <img
                    src={img7}
                    alt="Sarah Johnson"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-600 mb-4">
                  "Baby Guard has been a lifesaver! The vaccination reminders are so helpful."
                </p>
                <p className="font-semibold">Sarah Johnson</p>
              </div>
            </div>
  
            <div className=" bg-white rounded-lg shadow-lg">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                  <img
                    src={img8}
                    alt="Mike Peterson"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-600 mb-4">
                  "The pregnancy tips are incredibly detailed and helpful. Highly recommend!"
                </p>
                <p className="font-semibold">Mike Peterson</p>
              </div>
            </div>
  
            <div className=" bg-white rounded-lg shadow-lg">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                  <img
                    src={img9}
                    alt="Emma Roberts"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-600 mb-4">"I love the product recommendations and the easy-to-use interface!"</p>
                <p className="font-semibold">Emma Roberts</p>
              </div>
            </div>
          </div>
        </section>
  
       
      </div>
    )
  }