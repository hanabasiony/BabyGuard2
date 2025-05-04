import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa6"
import logo from '../../assets/images/logo-new2.png'
export default function Fotter() {
  return (
    <>
      <footer className="bg-pink-50 text-gray-700 py-10">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <img src={logo} alt="Baby Care" className="w-50" />
            
            <p className="text-sm text-gray-500">Your trusted partner in baby care and parenting.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-pink-500">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              <li><a href="/home" className="hover:text-pink-400 transition">Products</a></li>
              <li><a href="/about" className="hover:text-pink-400 transition">About Us</a></li>
              <li><a href="/contact" className="hover:text-pink-400 transition">Contact</a></li>
              <li><a href="/faq" className="hover:text-pink-400 transition">FAQs</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-lg font-semibold text-pink-500">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-gray-500 mt-2">Get the latest baby care tips & offers.</p>
            <form className="mt-3 flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-l-lg border border-pink-300 focus:outline-none" 
              />
              <button className="bg-pink-400 text-white px-4 py-2 rounded-r-lg hover:bg-pink-500 transition">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Social Media Links */}
        <div className="mt-8 flex justify-center space-x-6 text-pink-400">
          <a href="#" className="text-xl hover:text-pink-500"><FaFacebookF /></a>
          <a href="#" className="text-xl hover:text-pink-500"><FaTwitter /></a>
          <a href="#" className="text-xl hover:text-pink-500"><FaInstagram /></a>
          <a href="#" className="text-xl hover:text-pink-500"><FaYoutube /></a>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © 2025 Baby Guard. All rights reserved.
        </p>
      </div>
    </footer>
    
    </>
  )
}
