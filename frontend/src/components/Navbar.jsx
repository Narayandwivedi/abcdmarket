import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  // State Management
  const [isOpen, setIsOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { isAuthenticated, user, logout } = useContext(AppContext) || {}
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Emerald Tech Logo Component
  const EmeraldTechLogo = () => (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <defs>
        {/* Emerald Tech Gradient */}
        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
        </linearGradient>
      </defs>
      
      {/* Outer diamond */}
      <path d="M28,8 L40,20 L28,48 L16,20 Z" 
        stroke="url(#emeraldGradient)" 
        strokeWidth="2" 
        fill="none" 
        opacity="0.9"
        transform="scale(1.05)"
        transformOrigin="28 28" />
      
      {/* Inner diamond fill */}
      <path d="M28,12 L36,20 L28,40 L20,20 Z" 
        fill="url(#emeraldGradient)" 
        opacity="0.3"
        transform="scale(1.05)"
        transformOrigin="28 28" />
      
      {/* Center section */}
      <path d="M20,20 L36,20 L32,28 L24,28 Z" 
        fill="url(#emeraldGradient)" 
        opacity="0.7"
        transform="scale(1.05)"
        transformOrigin="28 28" />
      
      {/* Gaming controller in center */}
      <g transform="translate(28, 24) scale(1.05)">
        <rect x="-6" y="-2" width="12" height="4" rx="2" 
          fill="#fff" 
          opacity="0.9"/>
        <rect x="-4" y="-0.5" width="2" height="1" 
          fill="#10b981"/>
        <rect x="2" y="-0.5" width="2" height="1" 
          fill="#3b82f6"/>
        <circle cx="-3" cy="0" r="0.5" fill="#10b981" opacity="0.8"/>
        <circle cx="3" cy="0" r="0.5" fill="#3b82f6" opacity="0.8"/>
      </g>
      
      {/* Sparkle effects */}
      <circle cx="28" cy="20" r="1" fill="#fff" opacity="0.8" transform="scale(1.05)" transformOrigin="28 28" />
      <circle cx="20" cy="20" r="0.8" fill="#10b981" opacity="0.6" transform="scale(1.05)" transformOrigin="28 28" />
      <circle cx="36" cy="20" r="0.8" fill="#3b82f6" opacity="0.6" transform="scale(1.05)" transformOrigin="28 28" />
      
      {/* Tech lines */}
      <path d="M28,12 L28,8 M20,20 L16,20 M36,20 L40,20" 
        stroke="url(#emeraldGradient)" 
        strokeWidth="1" 
        opacity="0.8"
        transform="scale(1.05)"
        transformOrigin="28 28" />
    </svg>
  )

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-0 group">
              <div className="relative">
                <EmeraldTechLogo />
              </div>
              
              {/* Enhanced Typography */}
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                    GC
                  </span>
                  <span className="text-xl sm:text-2xl md:text-3xl font-black text-white ml-1 tracking-tight">
                    HUB
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-medium text-gray-300 ml-1 -mb-1">
                    .in
                  </span>
                </div>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">
                  Gamers & Creators
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/pc-build" 
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                PC Build
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/laptops" 
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Laptop
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/pc-parts" 
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                PC Parts
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/computer-accessories" 
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Computer Accessories
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Contact Us
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/cart" 
                className="text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L8 13m0 0L5.6 5M8 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M8 13H6m6 8a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <span>Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>
              
              {/* Login Button - Show when not authenticated */}
              {!isAuthenticated && (
                <Link 
                  to="/login" 
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  <span>Login</span>
                </Link>
              )}

              {/* User Profile Dropdown - Show when authenticated */}
              {isAuthenticated && user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 text-white hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden md:block">{user.fullName}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-1 z-50 backdrop-blur-sm bg-opacity-95">
                      <Link
                        to="/my-orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 hover:text-white transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 0h6" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        to="/manage-addresses"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 hover:text-white transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Manage Addresses
                      </Link>
                      <Link
                        to="/profile-info"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 hover:text-white transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Info
                      </Link>
                      <Link
                        to="/customer-support"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-blue-600 hover:text-white transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Customer Support
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-emerald-400 focus:outline-none focus:text-emerald-400 p-2 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-b-lg">
              <Link
                to="/"
                className="text-white hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/pc-build"
                className="text-white hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                PC Build
              </Link>
              <Link
                to="/laptops"
                className="text-white hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Laptop
              </Link>
              <Link
                to="/pc-parts"
                className="text-white hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                PC Parts
              </Link>
              <Link
                to="/computer-accessories"
                className="text-white hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Computer Accessories
              </Link>
              <Link
                to="/contact"
                className="text-white hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
              {/* Mobile Login Button */}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="text-white hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar