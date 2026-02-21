import React from 'react'
import CategoryProductGrid from './CategoryProductGrid'

const groceryProducts = [
  { id: 'demo-grocery-mustard-oil', name: 'Mustard Oil', unit: '1 L', price: 180, image: '/grocery.avif' },
  { id: 'demo-grocery-rice-1kg', name: 'Rice', unit: '1 Kg', price: 58, image: '/grocery.avif' },
  { id: 'demo-grocery-rice-5kg', name: 'Rice', unit: '5 Kg', price: 275, image: '/grocery.avif' },
  { id: 'demo-grocery-atta', name: 'Wheat Flour (Atta)', unit: '5 Kg', price: 245, image: '/grocery.avif' },
  { id: 'demo-grocery-toor-dal', name: 'Toor Dal', unit: '1 Kg', price: 145, image: '/grocery.avif' },
  { id: 'demo-grocery-sugar', name: 'Sugar', unit: '1 Kg', price: 48, image: '/grocery.avif' },
]

const GroceryCategoryPage = () => {
  return (
    <CategoryProductGrid
      categoryName="Grocery"
      subtitle="Essential grocery products with demo offers."
      products={groceryProducts}
    />
  )
}

export default GroceryCategoryPage
