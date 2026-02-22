import React from 'react'
import CategoryProductGrid from './CategoryProductGrid'

const vegetableProducts = [
  { id: 'demo-veg-onion', name: 'Onion', unit: '1 Kg', price: 35, image: '/vegetables/onion.jpg' },
  { id: 'demo-veg-potato', name: 'Potato', unit: '1 Kg', price: 28, image: '/vegetables/potato.jpg' },
  { id: 'demo-veg-tomato', name: 'Tomato', unit: '1 Kg', price: 32, image: '/vegetables/tomamto.webp' },
  { id: 'demo-veg-cauliflower', name: 'Cauliflower', unit: '1 Pc', price: 45, image: '/vegetables/cauliflower.jpg' },
  { id: 'demo-veg-ladyfinger', name: 'Lady Finger', unit: '500 g', price: 30, image: '/vegetables/lady%20finger.jpg' },
  { id: 'demo-veg-spinach', name: 'Spinach', unit: '1 Bunch', price: 20, image: '/vegetables/spinach.jpg' },
]

const VegetablesCategoryPage = () => {
  return (
    <CategoryProductGrid
      categoryName="Vegetables"
      subtitle="Daily fresh vegetables at demo prices."
      products={vegetableProducts}
    />
  )
}

export default VegetablesCategoryPage
