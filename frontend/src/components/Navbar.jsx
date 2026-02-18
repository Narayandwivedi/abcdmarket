import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'

const WHATSAPP_URL = 'https://wa.me/917000484146'
const PHONE_URL = 'tel:+917000484146'

const WhatsAppIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const ContactQuickActions = ({ mobile = false }) => {
  const iconClass = mobile ? 'w-4 h-4' : 'w-5 h-5'
  const buttonPadding = mobile ? 'p-1.5' : 'p-2'

  return (
    <div className={`flex flex-col ${mobile ? '-ml-1 gap-2' : 'gap-2'}`}>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-green-500 hover:bg-green-600 text-white rounded-full ${buttonPadding} transition-all shadow-md hover:shadow-lg`}
        aria-label="Contact on WhatsApp"
      >
        <WhatsAppIcon className={iconClass} />
      </a>

      <a
        href={PHONE_URL}
        className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full ${buttonPadding} transition-all shadow-md hover:shadow-lg`}
        aria-label="Call us"
      >
        <PhoneIcon className={iconClass} />
      </a>
    </div>
  )
}

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
                  <img src="/cart.avif" alt="Cart" className="w-6 h-6 object-contain" />
                  <span>Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>

              <ContactQuickActions />
              
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
          <div className="md:hidden flex items-center gap-2">
            <ContactQuickActions mobile />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="-ml-0.5 text-slate-700 hover:text-emerald-600 focus:outline-none focus:text-emerald-600 p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link
              to="/cart"
              className="relative text-slate-700 hover:text-emerald-600 p-2 rounded-md transition-colors duration-200"
              aria-label="Cart"
            >
              <img src="/cart.avif" alt="Cart" className="h-6 w-6 object-contain" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow">
                  {getTotalItems()}
                </span>
              )}
            </Link>
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
