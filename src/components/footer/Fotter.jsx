import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa6"
import logo from '../../assets/images/logo-new2.png'

export default function Fotter() {
  return (
    <footer className="bg-gradient-to-b from-pink-50 to-white text-gray-700 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <img src={logo} alt="Baby Care" className="w-40 h-auto" />
            <p className="text-sm text-gray-600 leading-relaxed">
              Your trusted partner in baby care and parenting. We provide the best care solutions for your little ones.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-500 border-b-2 border-pink-200 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/home" className="text-gray-600 hover:text-pink-500 transition duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-300 rounded-full mr-2"></span>
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-pink-500 transition duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-300 rounded-full mr-2"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-pink-500 transition duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-300 rounded-full mr-2"></span>
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-pink-500 transition duration-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-pink-300 rounded-full mr-2"></span>
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-500 border-b-2 border-pink-200 pb-2 inline-block">
              Newsletter
            </h3>
            <p className="text-sm text-gray-600">
              Subscribe to get the latest baby care tips & exclusive offers.
            </p>
            <form className="mt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-2.5 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition duration-300 flex-grow" 
                />
                <button className="bg-pink-500 text-white px-6 py-2.5 rounded-lg hover:bg-pink-600 transition duration-300 font-medium">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-pink-100 my-8"></div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-pink-500 transition duration-300 transform hover:scale-110">
              <FaFacebookF className="text-xl" />
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition duration-300 transform hover:scale-110">
              <FaTwitter className="text-xl" />
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition duration-300 transform hover:scale-110">
              <FaInstagram className="text-xl" />
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition duration-300 transform hover:scale-110">
              <FaYoutube className="text-xl" />
            </a>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © 2025 Baby Guard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
