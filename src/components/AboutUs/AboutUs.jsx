import { Heart, Syringe, BookOpen, ShoppingBag, Home } from "lucide-react"
import motherPhoto from '../../assets/images/contactPhoto.png'

import dev1 from '../../assets/images/dev1.png'
import dev2 from '../../assets/images/dev 2.png'
import dev3 from '../../assets/images/dev3.png'


export default function BabyGuard() {
    return (
        <div className="max-w-6xl mx-auto p-6 font-sans py-25 ">
            {/* Who We Are Section */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
                <div className="md:w-1/2 mt-10">
                    <h2 className="text-3xl font-bold text-blue-700 mb-3">Who We Are</h2>
                    <p className="text-blue-800/80 text-2xl">
                        Dedicated to caring for your
                        <br />
                        baby's health & happiness
                    </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    {/* <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-pink-100 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="80" fill="#FFF0F5" />
                <path
                  d="M80,30 C100,30 115,50 115,75 C115,100 100,120 80,120 C60,120 45,100 45,75 C45,50 60,30 80,30"
                  fill="#A52A2A"
                />
                <path d="M65,70 C70,65 90,65 95,70 C95,90 90,100 80,100 C70,100 65,90 65,70" fill="#FFC0CB" />
                <circle cx="70" cy="60" r="3" fill="#000" />
                <circle cx="90" cy="60" r="3" fill="#000" />
                <path d="M75,70 C80,75 85,70 85,70" stroke="#000" strokeWidth="1" fill="none" />
                <path d="M60,80 C65,85 75,90 80,90 C85,90 95,85 100,80" fill="#FFC0CB" />
              </svg>
              <div className="absolute bottom-0 right-0">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="30" fill="#ADD8E6" />
                  <circle cx="35" cy="35" r="2" fill="#000" />
                  <circle cx="45" cy="35" r="2" fill="#000" />
                  <path d="M35,45 C38,48 42,48 45,45" stroke="#000" strokeWidth="1" fill="none" />
                </svg>
              </div>
            </div>
          </div> */}
                    <img src={motherPhoto} className="w-80" alt="" />
                </div>
            </section>

            {/* Our Mission & What We Offer Sections */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
                {/* Our Mission */}
                <section>
                    <h2 className="text-3xl font-bold text-blue-700 ">Our Mission</h2>
                    <div className="w-full flex justify-center items-center">
                        <Heart className="text-pink-400 w-12 h-12" />
                    </div>
                    <div className="flex items-start gap-4">

                        <p className="text-gray-700">
                            At Baby Guard, our mission is to help parents protect their newborns by offering timely vaccination
                            reminders, trusted baby caretips, and easy access to baby products and medical services—all in one safe
                            and simple platform.
                        </p>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="md:ms-30">
                    <h2 className="text-3xl font-bold text-blue-700 mb-6">What We Offer</h2>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                                <img src={dev1} alt="" />
                            </div>
                            <p className="text-center text-sm font-medium">Sarah</p>
                            <p className="text-center text-xs text-gray-500">Developer</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                <img src={dev2} alt="" />
                            </div>
                            <p className="text-center text-sm font-medium">Ahmed</p>
                            <p className="text-center text-xs text-gray-500">Designer</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                                <img src={dev3} alt="" />
                            </div>
                            <p className="text-center text-sm font-medium">Fatima</p>
                            <p className="text-center text-xs text-gray-500">Manager</p>
                        </div>
                    </div>
                </section>
            </div>


            <h2 className="text-3xl font-bold text-blue-700 mb-8">Meet the Team</h2>

            {/* Meet the Team Section */}
            <section className="mb-16 flex flex-col md:flex-row ">

                <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <Syringe className="text-blue-500 w-6 h-6" />
                        </div>
                        <p className="text-center text-sm font-medium">
                            Vaccine Tracking
                            <br />& Reminders
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <BookOpen className="text-blue-500 w-6 h-6" />
                        </div>
                        <p className="text-center text-sm font-medium">
                            Pregnancy
                            <br />& Baby Tips
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <ShoppingBag className="text-blue-500 w-6 h-6" />
                        </div>
                        <p className="text-center text-sm font-medium">
                            Baby Product
                            <br />
                            Recommendations
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <Home className="text-blue-500 w-6 h-6" />
                        </div>
                        <p className="text-center text-sm font-medium">
                            Request Home
                            <br />
                            Vaccination Service
                        </p>
                    </div>
                </div>

                {/* Testimonials */}
                {/* <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 items-center flex gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-blue-800">Baby Guard made my parenting journey so much easier!</p>
                            <p className="text-blue-600 text-sm mt-1">Nora A.</p>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 items-center flex gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-blue-800">I love the vaccination reminders. Very useful!</p>
                        </div>
                    </div>
                </div> */}

<div className="bg-blue-50 p-6 rounded-xl max-w-md mx-auto">
      <div className="space-y-4">
        {/* First Testimonial */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-200 rounded-full p-3 flex items-center justify-center min-w-12 h-12">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-navy-800 font-medium text-base">Baby Guard made my parenting journey so much easier!</p>
            <p className="text-blue-700 mt-1">Mona A.</p>
          </div>
        </div>

        {/* Second Testimonial */}
        <div className="flex items-start gap-3">
          <div className="bg-blue-200 rounded-full p-3 flex items-center justify-center min-w-12 h-12">
            {/* Empty circle for the second testimonial */}
          </div>
          <div>
            <p className="text-navy-800 font-medium text-base">I love the vaccination reminders. Very useful!</p>
            <p className="text-blue-700 mt-1">Karim M.</p>
          </div>
        </div>
      </div>
    </div>
            </section>
        </div>
    )
}