import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo-new2.png'
import newLogo from '../../assets/images/new-logo.png'

export default function Fotter() {
  const navigate = useNavigate();

  const handleAboutUsClick = () => {
    navigate('/');
    // Add a small delay to ensure the page has loaded before scrolling
    setTimeout(() => {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="bg-gradient-to-b from-rose-50 to-blue-50 text-gray-700 pt-12 pb-8">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <img src={newLogo} alt="Baby Guard" className="w-40" />
            <p className="text-sm text-gray-600 leading-relaxed">
              Your trusted partner in baby care and parenting. We provide expert guidance and quality products for your little ones.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-rose-300 hover:text-rose-400 transition-colors">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="#" className="text-rose-300 hover:text-rose-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-rose-300 hover:text-rose-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-rose-300 hover:text-rose-400 transition-colors">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-rose-300 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleNavigation('/products')}
                  className="text-gray-600 hover:text-rose-300 transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
                  Products
                </button>
              </li>
              <li>
                <button 
                  onClick={handleAboutUsClick}
                  className="text-gray-600 hover:text-rose-300 transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contactUs')}
                  className="text-gray-600 hover:text-rose-300 transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/vacciens')}
                  className="text-gray-600 hover:text-rose-300 transition-colors flex items-center w-full text-left"
                >
                  <span className="w-2 h-2 bg-rose-300 rounded-full mr-2"></span>
                  Vaccines
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-rose-300 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <FaPhone className="text-rose-300 mr-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FaEnvelope className="text-rose-300 mr-3" />
                <span>info@babyguard.com</span>
              </li>
              <li className="flex items-start text-gray-600">
                <FaMapMarkerAlt className="text-rose-300 mr-3 mt-1" />
                <span>123 Baby Street, Parenting City, PC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-rose-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 Baby Guard. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <button 
                    // onClick={() => handleNavigation('/privacy')}
                    className="text-sm text-gray-600 hover:text-rose-300 transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    // onClick={() => handleNavigation('/terms')}
                    className="text-sm text-gray-600 hover:text-rose-300 transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    // onClick={() => handleNavigation('/cookies')}
                    className="text-sm text-gray-600 hover:text-rose-300 transition-colors"
                  >
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

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
