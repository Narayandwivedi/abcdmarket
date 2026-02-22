import React from 'react'
import CategoryProductGrid from './CategoryProductGrid'

const superfoodProducts = [
  { id: 'demo-superfood-chia', name: 'Chia Seeds', unit: '250 g', price: 120, image: '/superfoods/chia%20seed.jpg' },
  { id: 'demo-superfood-quinoa', name: 'Quinoa', unit: '500 g', price: 210, image: '/superfoods/quinoa.avif' },
  { id: 'demo-superfood-flax', name: 'Flax Seeds', unit: '500 g', price: 95, image: '/superfoods/flax%20seed.webp' },
  { id: 'demo-superfood-pumpkin', name: 'Pumpkin Seeds', unit: '250 g', price: 165, image: '/superfoods/pumpkin%20seed.jpg' },
  { id: 'demo-superfood-oats', name: 'Rolled Oats', unit: '1 Kg', price: 140, image: '/superfoods/rolled%20oats.jpg' },
]

const SuperfoodsCategoryPage = () => {
  return (
    <CategoryProductGrid
      categoryName="Superfoods"
      subtitle="Power-packed superfoods for everyday nutrition."
      products={superfoodProducts}
    />
  )
}

export default SuperfoodsCategoryPage
