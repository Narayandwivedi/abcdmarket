import React from 'react'
import SearchBar from '../../components/SearchBar'
import HeroSection from './component/HeroSection'
import TopDealsSection from './component/TopDealsSection'
import ShopByCategorySection from './component/ShopByCategorySection'

const Home = () => {
  return (
    <div>
      <SearchBar />
      <HeroSection />
      {/* <TopDealsSection /> */}
      <ShopByCategorySection />
    </div>
  )
}

export default Home
