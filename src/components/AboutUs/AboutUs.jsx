import React from 'react'
import img1 from '../../assets/images/IMG_3224.JPG'
import img2 from '../../assets/images/IMG_3225.JPG'
import img3 from '../../assets/images/IMG_3223.JPG'

export default function AboutUs() {
    return (
        <section className="mx-auto px-14 py-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12">About Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg shadow-lg overflow-hidden transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                    <img
                        src={img1}
                        alt="Our Mission"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                        <p className="text-gray-600 text-sm">
                            To provide comprehensive support and guidance for parents, ensuring the health and well-being of their children through expert care and innovative solutions.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg shadow-lg overflow-hidden transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                    <img
                        src={img2}
                        alt="Our Vision"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
                        <p className="text-gray-600 text-sm">
                            To be the leading platform in child healthcare, offering accessible, reliable, and personalized services that empower parents in their journey of raising healthy children.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg shadow-lg overflow-hidden transform-gpu transition-all duration-700 ease-out hover:scale-103 hover:shadow-md">
                    <img
                        src={img3}
                        alt="Our Values"
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                        <h3 className="font-semibold text-lg mb-2">Our Values</h3>
                        <p className="text-gray-600 text-sm">
                            We are committed to excellence, innovation, and compassion in everything we do, putting the health and safety of children at the forefront of our services.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}