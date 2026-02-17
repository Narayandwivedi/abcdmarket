import React from 'react'
import HeroCarousel from '../components/HeroCarousel'
import SearchBar from '../components/SearchBar'
import TopDealsSection from '../components/TopDealsSection'
import ShopByCategorySection from '../components/ShopByCategorySection'

const Homepage = () => {
  return (
    <div>
      <SearchBar />
      <HeroCarousel />
      <TopDealsSection />
      <ShopByCategorySection />
    </div>
  )
}

export default Homepage
