import React from 'react'
import { Link } from 'react-router-dom'

const LaptopHero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-6 md:py-12 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full blur-3xl"></div>
      
      {/* Gaming particles effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-1000"></div>
      </div>
      
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-3">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                Unleash Your 
                <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Gaming Potential
                </span>
              </h1>
            </div>

            {/* Gaming Features */}
            <div className="grid grid-cols-2 gap-2 px-3 mb-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-white text-xs">RTX Graphics</h3>
                  <p className="text-gray-400 text-xs">Ray tracing ready</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-white text-xs">144Hz Display</h3>
                  <p className="text-gray-400 text-xs">Ultra smooth</p>
                </div>
              </div>
            </div>

            {/* Laptop Image */}
            <div className="relative flex justify-center">
              <div className="relative max-w-xs w-full">
                <div className="relative bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 rounded-xl p-3 shadow-lg border border-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl"></div>
                  
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 blur-lg"></div>
                  
                  <img 
                    src="/lapfinal.webp" 
                    alt="Gaming Laptop with RGB Keyboard" 
                    className="w-full h-auto object-contain relative z-20 max-h-36 mx-auto drop-shadow-lg"
                  />
                </div>

                {/* Background orbs */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 justify-center pb-3 px-3">
              <Link 
                to="/laptops" 
                className="group bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 text-white font-bold text-sm py-2.5 px-6 rounded-xl hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center cursor-pointer flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="mr-2">💻</span>
                Shop Gaming Laptops
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              
              <Link 
                to="/laptop-comparison" 
                className="group bg-slate-800 text-gray-200 font-semibold text-sm py-2.5 px-6 rounded-xl border-2 border-gray-600 hover:border-purple-400 hover:bg-slate-700 transition-all duration-300 text-center cursor-pointer flex items-center justify-center"
              >
                <span className="mr-2">⚖️</span>
                Compare Models
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                  Unleash Your
                  <span className="block bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Gaming Potential
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Experience next-level gaming with RGB-powered laptops featuring cutting-edge graphics, blazing-fast displays, and pro-grade performance.
                </p>
              </div>

              {/* Gaming Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-bold text-white text-sm">RTX Graphics</h3>
                    <p className="text-gray-400 text-xs">Ray tracing ready performance</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-bold text-white text-sm">144Hz Display</h3>
                    <p className="text-gray-400 text-xs">Ultra-smooth gaming</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center lg:items-start space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-bold text-white text-sm">RGB Keyboard</h3>
                    <p className="text-gray-400 text-xs">Customizable lighting</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link 
                  to="/laptops" 
                  className="group bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center cursor-pointer flex items-center justify-center"
                >
                  <span className="mr-2">💻</span>
                  Shop Gaming Laptops
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <Link 
                  to="/laptop-comparison" 
                  className="group bg-slate-800 text-gray-200 font-semibold py-3 px-6 rounded-xl border-2 border-gray-600 hover:border-purple-400 hover:bg-slate-700 transition-all duration-300 text-center cursor-pointer flex items-center justify-center"
                >
                  <span className="mr-2">⚖️</span>
                  Compare Models
                </Link>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative max-w-md w-full">
                {/* Main Laptop Container */}
                <div className="relative bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-gray-700 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-blue-500/10 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl"></div>
                  
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 via-cyan-400/20 to-blue-400/20 blur-xl"></div>
                  
                  <img 
                    src="/lapfinal.webp" 
                    alt="Gaming Laptop with RGB Keyboard" 
                    className="w-full h-auto object-contain relative z-20 max-h-64 mx-auto drop-shadow-xl transition-all duration-700 hover:scale-105 hover:drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]"
                  />

                </div>

                {/* Enhanced Animated Background Elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LaptopHero
