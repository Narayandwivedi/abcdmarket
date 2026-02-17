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

  return (
    <nav className="bg-slate-100 shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[80px]">
          {/* Enhanced Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img
                  src="/abcdlogof.webp"
                  alt="ABCD Market Logo"
                  className="h-40 w-40 sm:h-38 sm:w-38 object-contain"
                />
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/pc-build" 
                className="text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                PC Build
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/laptops" 
                className="text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Laptop
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/pc-parts" 
                className="text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                PC Parts
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/computer-accessories" 
                className="text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Computer Accessories
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/contact" 
                className="text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
              >
                Contact Us
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="/cart" 
                className="text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group cursor-pointer"
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
                    className="flex items-center space-x-2 text-slate-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer"
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
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
                      <Link
                        to="/my-orders"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 0h6" />
                        </svg>
                        My Orders
                      </Link>
                      <Link
                        to="/manage-addresses"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
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
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Info
                      </Link>
                      <Link
                        to="/customer-support"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all duration-200"
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
              className="text-slate-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600 p-2 cursor-pointer"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-100 rounded-b-lg border border-slate-200 border-t-0">
              <Link
                to="/"
                className="text-slate-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/pc-build"
                className="text-slate-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                PC Build
              </Link>
              <Link
                to="/laptops"
                className="text-slate-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Laptop
              </Link>
              <Link
                to="/pc-parts"
                className="text-slate-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                PC Parts
              </Link>
              <Link
                to="/computer-accessories"
                className="text-slate-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Computer Accessories
              </Link>
              <Link
                to="/contact"
                className="text-slate-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Link>
              {/* Mobile Login Button */}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 cursor-pointer"
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
