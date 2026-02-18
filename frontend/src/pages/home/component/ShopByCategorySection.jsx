import React from 'react'
import { Link } from 'react-router-dom'
import {
  Apple,
  Carrot,
  Croissant,
  CookingPot,
  Leaf,
  Package,
  Fish,
  Gem,
  Coins,
  Building2,
  House,
  Smartphone,
  Shirt,
} from 'lucide-react'

const categories = [
  { name: 'Fruits', query: 'fruits', icon: Apple, gradient: 'from-red-500 to-orange-500', image: '/fruit1.avif' },
  {
    name: 'Super Fruits',
    query: 'super fruits',
    icon: Apple,
    gradient: 'from-pink-500 to-rose-600',
    image: '/superfoods.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'Vegetables',
    query: 'vegetables',
    icon: Carrot,
    gradient: 'from-green-500 to-emerald-600',
    image: '/veg.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'Food Machine',
    query: 'food machine',
    icon: CookingPot,
    gradient: 'from-amber-500 to-yellow-600',
    image: '/foodmachine.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'Grocery',
    query: 'grocery',
    icon: Package,
    gradient: 'from-emerald-500 to-green-600',
    image: '/grocery.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'Dryfruits',
    query: 'dry fruits',
    icon: Leaf,
    gradient: 'from-lime-500 to-green-600',
    image: '/dryfruits.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  { name: 'Bakery', query: 'bakery', icon: Croissant, gradient: 'from-orange-500 to-amber-600' },
  { name: 'Spices', query: 'spices', icon: CookingPot, gradient: 'from-rose-500 to-red-600' },
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
    <section className="bg-gradient-to-b from-white via-white to-cyan-50/70 pt-2 pb-8 md:py-10">
      <div className="max-w-[86rem] mx-auto px-1.5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-5">
          {categories.map((category) => {
            const Icon = category.icon
            const iconLabel = category.name === 'Properties' ? 'Property' : category.name
            return (
              <Link
                key={category.name}
                to={`/search?q=${encodeURIComponent(category.query)}`}
                className={`group aspect-square rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center ${
                  category.image
                    ? 'border-0 sm:border border-transparent sm:border-slate-200/80 bg-transparent sm:bg-white p-0 sm:p-2.5 md:p-3 shadow-none sm:shadow-[0_6px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 sm:hover:shadow-[0_10px_24px_rgba(14,116,144,0.18)]'
                    : 'border border-slate-200/80 bg-white p-1.5 sm:p-2.5 md:p-3 shadow-[0_6px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(14,116,144,0.18)]'
                }`}
                aria-label={category.name}
                title={category.name}
              >
                <div className={`w-full h-full relative rounded-xl overflow-hidden ${category.image ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-red-100 border-0 sm:border border-orange-100' : `bg-gradient-to-br ${category.gradient} text-white`} flex items-center justify-center`}>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className={`${category.imageClassName || 'w-[100%] h-[100%] sm:w-[90%] sm:h-[90%] lg:w-[76%] lg:h-[76%]'} object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.2)]`}
                    />
                  ) : (
                    <>
                      <Icon className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 mb-3 sm:mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]" />
                      <span className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 max-w-[88%] truncate rounded-full bg-white/90 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-semibold text-slate-800 shadow">
                        {iconLabel}
                      </span>
                    </>
                  )}
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
