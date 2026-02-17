import React from 'react'
import { Link } from 'react-router-dom'
import {
  Apple,
  Carrot,
  Wheat,
  Milk,
  Croissant,
  CookingPot,
  Coffee,
  Leaf,
  Package,
  Fish,
  Gem,
  Coins,
  Building2,
  House,
  Smartphone,
  Shirt,
  ArrowRight,
} from 'lucide-react'

const categories = [
  { name: 'Fruits', query: 'fruits', icon: Apple, gradient: 'from-red-500 to-orange-500' },
  { name: 'Vegetables', query: 'vegetables', icon: Carrot, gradient: 'from-green-500 to-emerald-600' },
  { name: 'Grains', query: 'grains', icon: Wheat, gradient: 'from-amber-500 to-yellow-600' },
  { name: 'Dairy', query: 'dairy', icon: Milk, gradient: 'from-cyan-500 to-blue-600' },
  { name: 'Bakery', query: 'bakery', icon: Croissant, gradient: 'from-orange-500 to-amber-600' },
  { name: 'Spices', query: 'spices', icon: CookingPot, gradient: 'from-rose-500 to-red-600' },
  { name: 'Beverages', query: 'beverages', icon: Coffee, gradient: 'from-indigo-500 to-purple-600' },
  { name: 'Dry Fruits', query: 'dry fruits', icon: Leaf, gradient: 'from-lime-500 to-green-600' },
  { name: 'Packaged Goods', query: 'packaged goods', icon: Package, gradient: 'from-slate-500 to-gray-700' },
  { name: 'Meat & Fish', query: 'fish', icon: Fish, gradient: 'from-sky-500 to-cyan-600' },
  { name: 'Jewallary', query: 'jewallary', icon: Gem, gradient: 'from-fuchsia-500 to-pink-600' },
  { name: 'Gold', query: 'gold', icon: Coins, gradient: 'from-yellow-500 to-orange-500' },
  { name: 'Properties', query: 'properties', icon: Building2, gradient: 'from-blue-600 to-indigo-700' },
  { name: 'Home Essentials', query: 'home essentials', icon: House, gradient: 'from-teal-500 to-cyan-600' },
  { name: 'Electronics', query: 'electronics', icon: Smartphone, gradient: 'from-violet-500 to-purple-700' },
  { name: 'Fashion', query: 'fashion', icon: Shirt, gradient: 'from-pink-500 to-rose-600' },
]

const ShopByCategorySection = () => {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Shop By <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore popular categories from daily needs to premium assets.
          </p>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.name}
                to={`/search?q=${encodeURIComponent(category.query)}`}
                className="group rounded-xl border border-gray-200 bg-white p-2.5 sm:p-3 md:p-4 shadow-sm hover:shadow-lg hover:border-cyan-300 transition-all duration-300"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${category.gradient} text-white flex items-center justify-center shadow-md mb-2`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </div>

                <h3 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-sm mb-1.5 leading-tight line-clamp-2">{category.name}</h3>

                <div className="inline-flex items-center text-cyan-700 font-semibold text-[10px] sm:text-xs md:text-sm group-hover:translate-x-1 transition-transform duration-200">
                  <span className="hidden sm:inline">Explore</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 sm:ml-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategorySection
