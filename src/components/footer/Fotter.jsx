import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo-new2.png'
import newLogo from '../../assets/images/very-final-logo.png'

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
                <span>+20 109 500 0213</span>
              </li>
              <li className="flex items-center text-gray-600">
                <FaEnvelope className="text-rose-300 mr-3" />
                <span>info@babyguard.com</span>
              </li>
              <li className="flex items-start text-gray-600">
                <FaMapMarkerAlt className="text-rose-300 mr-3 mt-1" />
                <span>Cairo, Egypt</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-rose-100">
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-600">
              © 2025 Baby Guard. All rights reserved.
            </p>

          </div>
        </div>
      </div>
    </footer>
  )
}
