import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContextProvider } from './context/AppContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import Homepage from './pages/Homepage'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Pcbuild from './pages/Pcbuild'
import Pcparts from './pages/Pcparts'
import ComputerAccessories from './pages/ComputerAccessories'
import GraphicsCard from './pages/Pc parts/GraphicsCard'
import Processor from './pages/Pc parts/Processor'
import Memory from './pages/Pc parts/Memory'
import Motherboard from './pages/Pc parts/Motherboard'
import Storage from './pages/Pc parts/Storage'
import ProductDetail from './pages/ProductDetail'
import Mouse from './pages/Computer Accessories/Mouse'
import Keyboard from './pages/Computer Accessories/Keyboard'
import Headset from './pages/Computer Accessories/Headset'
import Webcam from './pages/Computer Accessories/Webcam'
import GamingChair from './pages/Computer Accessories/GamingChair'
import LaptopBag from './pages/Computer Accessories/LaptopBag'
import CustomPcBuild from './pages/CustomPcBuild'
import Laptops from './pages/Laptops'
import SearchResults from './pages/SearchResults'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import ManageAddresses from './pages/ManageAddresses'
import ProfileInfo from './pages/ProfileInfo'
import CustomerSupport from './pages/CustomerSupport'
import Account from './pages/Account'
import ProtectedRoute from './components/ProtectedRoute'
import BlogsPage from './pages/blog/BlogsPage'
import BlogDetailPage from './pages/blog/BlogDetailPage'

const AppContent = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <div className="pb-20 md:pb-0">
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/manage-addresses" element={<ProtectedRoute><ManageAddresses /></ProtectedRoute>} />
        <Route path="/profile-info" element={<ProtectedRoute><ProfileInfo /></ProtectedRoute>} />
        <Route path="/customer-support" element={<ProtectedRoute><CustomerSupport /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pc-build" element={<Pcbuild />} />
        <Route path="/pc-build/custom-build" element={<CustomPcBuild />} />
        <Route path="/pc-parts" element={<Pcparts />} />
        <Route path="/computer-accessories" element={<ComputerAccessories />} />
        <Route path="/laptops" element={<Laptops />} />
        <Route path="/blog" element={<BlogsPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/pc-parts/graphics-card" element={<GraphicsCard />} />
        <Route path="/pc-parts/processors" element={<Processor />} />
        <Route path="/pc-parts/memory" element={<Memory />} />
        <Route path="/pc-parts/motherboards" element={<Motherboard />} />
        <Route path="/pc-parts/storage" element={<Storage />} />
        <Route path="/pc-parts/monitors" element={<div>Monitors page coming soon</div>} />
        
        {/* Computer Accessories Routes */}
        <Route path="/computer-accessories/mouse" element={<Mouse />} />
        <Route path="/computer-accessories/keyboard" element={<Keyboard />} />
        <Route path="/computer-accessories/headset" element={<Headset />} />
        <Route path="/computer-accessories/webcam" element={<Webcam />} />
        <Route path="/computer-accessories/gaming-chair" element={<GamingChair />} />
        <Route path="/computer-accessories/laptop-bag" element={<LaptopBag />} />
        
        {/* Hierarchical product routes - PC Parts */}
        <Route path="/pc-parts/graphics-card/product/:id" element={<ProductDetail />} />
        <Route path="/pc-parts/processors/product/:id" element={<ProductDetail />} />
        <Route path="/pc-parts/memory/product/:id" element={<ProductDetail />} />
        <Route path="/pc-parts/motherboards/product/:id" element={<ProductDetail />} />
        <Route path="/pc-parts/storage/product/:id" element={<ProductDetail />} />
        <Route path="/pc-parts/monitors/product/:id" element={<ProductDetail />} />
        
        {/* Hierarchical product routes - Computer Accessories */}
        <Route path="/computer-accessories/mouse/product/:id" element={<ProductDetail />} />
        <Route path="/computer-accessories/keyboard/product/:id" element={<ProductDetail />} />
        <Route path="/computer-accessories/headset/product/:id" element={<ProductDetail />} />
        <Route path="/computer-accessories/webcam/product/:id" element={<ProductDetail />} />
        <Route path="/computer-accessories/gaming-chair/product/:id" element={<ProductDetail />} />
        <Route path="/computer-accessories/laptop-bag/product/:id" element={<ProductDetail />} />
        
        {/* Laptop routes */}
        <Route path="/laptops/gaming-laptop/product/:id" element={<ProductDetail />} />
        <Route path="/laptops/office-laptop/product/:id" element={<ProductDetail />} />
        
        {/* Legacy redirects for backward compatibility */}
        <Route path="/graphics-cards" element={<GraphicsCard />} />
        <Route path="/cpu" element={<Processor />} />
        <Route path="/ram" element={<Memory />} />
        <Route path="/motherboards" element={<Motherboard />} />
        <Route path="/ssd" element={<Storage />} />
        <Route path="/monitors" element={<div>Monitors page coming soon</div>} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      {!isLoginPage && <Footer />}
      {!isLoginPage && <MobileBottomNav />}
      <ToastContainer
        position="top-right"
        autoClose={600}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <AppContextProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AppContextProvider>
    </Router>
  )
}

export default App
