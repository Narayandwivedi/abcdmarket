import React from 'react'
import CategoryProductGrid from './CategoryProductGrid'

const fruitProducts = [
  { id: 'demo-fruit-banana', name: 'Banana', unit: '1 Dozen', price: 45, image: '/fruits/banana.webp' },
  { id: 'demo-fruit-apple', name: 'Apple', unit: '1 Kg', price: 80, image: '/fruits/apple.webp' },
  { id: 'demo-fruit-orange', name: 'Orange', unit: '1 Kg', price: 65, image: '/fruits/orange.webp' },
  { id: 'demo-fruit-mango', name: 'Mango', unit: '1 Kg', price: 95, image: '/fruits/mango.webp' },
  { id: 'demo-fruit-grapes', name: 'Grapes', unit: '500 g', price: 70, image: '/fruits/grapes.webp' },
  { id: 'demo-fruit-papaya', name: 'Papaya', unit: '1 Pc', price: 40, image: '/fruits/papaya.jpg' },
]

const FruitsCategoryPage = () => {
  return (
    <CategoryProductGrid
      categoryName="Fruits"
      subtitle="Fresh fruits with quick demo deals."
      bannerText="Hot Deals"
      products={fruitProducts}
    />
  )
}

export default FruitsCategoryPage
