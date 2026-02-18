import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const MobileBottomNav = () => {
  const location = useLocation()
  const { getTotalItems } = useCart()

  const navItems = [
    {
      path: '/',
      name: 'Home',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/cart',
      name: 'Cart',
      icon: (
        <img src="/cart.avif" alt="Cart" className="w-5 h-5 object-contain" />
      ),
      badge: getTotalItems()
    },
    {
      path: '/account',
      name: 'Account',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex justify-around items-center py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors duration-200 relative ${
                isActive 
                  ? 'text-cyan-500 bg-cyan-50' 
                  : 'text-gray-600 hover:text-cyan-500 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MobileBottomNav
