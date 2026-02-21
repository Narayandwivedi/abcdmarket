import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 sm:pt-5 sm:pb-6 lg:pt-7 lg:pb-7">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {/* Company Info */}
          <div className="md:col-span-2 mt-2">
            <div className="flex items-center justify-between sm:block">
              <div className="sm:mb-2.5">
                <Link to="/" className="inline-flex items-center">
                  <img
                    src="/abcdlogof.webp"
                    alt="ABCD Market Logo"
                    className="mt-2 sm:mt-0 w-30 h-[64px] object-cover block sm:h-40 sm:w-40 sm:object-contain"
                  />
                </Link>
              </div>

              <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer" aria-label="X">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.29 19.495h2.039L6.486 3.24H4.298l13.313 17.408Z" />
                </svg>
              </a>

              <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer" aria-label="LinkedIn">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer" aria-label="Facebook">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
                </svg>
              </a>

              <a href="#" className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer" aria-label="Instagram">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.224 2.162c3.204 0 3.584.012 4.849.07 1.17.054 1.805.249 2.227.413.56.217.96.477 1.382.896.419.42.677.819.896 1.381.164.422.36 1.057.413 2.227.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.054 1.17-.249 1.805-.413 2.227a3.81 3.81 0 0 1-.896 1.382 3.744 3.744 0 0 1-1.382.896c-.422.164-1.057.36-2.227.413-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.17-.054-1.805-.249-2.227-.413a3.81 3.81 0 0 1-1.382-.896 3.744 3.744 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.054-1.17.249-1.805.413-2.227.217-.56.477-.96.896-1.382a3.744 3.744 0 0 1 1.382-.896c.422-.164 1.057-.36 2.227-.413 1.265-.058 1.645-.07 4.849-.07zm0-2.162c-3.259 0-3.667.014-4.947.072-1.281.058-2.154.26-2.913.558a5.885 5.885 0 0 0-2.134 1.389 5.868 5.868 0 0 0-1.389 2.134c-.297.759-.5 1.632-.558 2.913-.058 1.281-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.281.26 2.154.558 2.913a5.885 5.885 0 0 0 1.389 2.134 5.868 5.868 0 0 0 2.134 1.389c.759.297 1.632.5 2.913.558 1.281.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.281-.058 2.154-.26 2.913-.558a5.885 5.885 0 0 0 2.134-1.389 5.868 5.868 0 0 0 1.389-2.134c.297-.759.5-1.632.558-2.913.058-1.281.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.281-.26-2.154-.558-2.913a5.885 5.885 0 0 0-1.389-2.134A5.868 5.868 0 0 0 19.86.63c-.759-.297-1.632-.5-2.913-.558C15.667.014 15.259 0 12 0z" />
                  <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </a>
              </div>
            </div>
          </div>

          {/* Quick Links + Contact Info in same row on mobile */}
          <div className="md:col-span-2 grid grid-cols-2 gap-2.5 sm:gap-3.5">
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5">Quick Links</h3>
              <ul className="space-y-0.5 sm:space-y-1">
                <li>
                  <Link to="/" className="text-xs sm:text-sm text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-xs sm:text-sm text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-xs sm:text-sm text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-xs sm:text-sm text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                    Blog
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-xs sm:text-sm text-gray-300 hover:text-cyan-300 transition-colors duration-200 cursor-pointer">
                    Services
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5">Contact Info</h3>
              <ul className="space-y-0.5 sm:space-y-1 text-gray-300">
                <li className="flex items-center space-x-1.5 sm:space-x-2">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm">Your Address Here</span>
                </li>
                <li className="flex items-center space-x-1.5 sm:space-x-2">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-xs sm:text-sm">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-1.5 sm:space-x-2">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-xs sm:text-sm">info@gchub.in</span>
                </li>
              </ul>

              <div className="mt-3 sm:mt-4">
                <a
                  href="#"
                  className="seller-blink-button inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold transition-transform duration-200 hover:scale-105"
                >
                  Sell on Abcd market
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-3 sm:mt-4 md:mt-5 pt-2.5 sm:pt-3 md:pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            (c) 2024 GC HUB. All rights reserved.
          </p>
          <div className="flex space-x-2 sm:space-x-4 mt-1.5 sm:mt-2.5 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-cyan-300 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-300 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-300 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
