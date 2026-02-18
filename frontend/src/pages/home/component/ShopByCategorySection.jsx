import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
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
import { AppContext } from '../../../context/AppContext'

const demoCategories = [
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
  {
    name: 'Shopping Voucher',
    query: 'shopping voucher',
    icon: Package,
    gradient: 'from-cyan-500 to-blue-600',
    image: '/voucher.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[98%] sm:h-[98%] lg:w-[90%] lg:h-[90%]',
  },
  {
    name: 'Sweets',
    query: 'sweets',
    icon: Croissant,
    gradient: 'from-pink-500 to-rose-600',
    image: '/sweets.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'Home Appliances',
    query: 'home appliances',
    icon: House,
    gradient: 'from-cyan-500 to-teal-600',
    image: '/homeapplainces.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'Hardware',
    query: 'hardware',
    icon: Package,
    gradient: 'from-indigo-500 to-blue-700',
    image: '/hardware.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'Plywood',
    query: 'plywood',
    icon: Package,
    gradient: 'from-amber-600 to-orange-700',
    image: '/plywood.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
  {
    name: 'School',
    query: 'school',
    icon: Building2,
    gradient: 'from-sky-500 to-blue-700',
    image: '/school.avif',
    imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
  },
]

const resolveCategoryImageUrl = (backendUrl, imageUrl) => {
  if (!imageUrl) return ''
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl
  if (imageUrl.startsWith('/uploads')) {
    return `${backendUrl}${imageUrl}`
  }
  return imageUrl
}

const getFallbackIcon = (name = '') => {
  const normalized = String(name).toLowerCase()

  if (normalized.includes('vegetable')) return Carrot
  if (normalized.includes('bakery')) return Croissant
  if (normalized.includes('spice')) return CookingPot
  if (normalized.includes('dry')) return Leaf
  if (normalized.includes('fish') || normalized.includes('meat')) return Fish
  if (normalized.includes('gold')) return Coins
  if (normalized.includes('jew')) return Gem
  if (normalized.includes('propert')) return Building2
  if (normalized.includes('home')) return House
  if (normalized.includes('electronic') || normalized.includes('mobile') || normalized.includes('phone')) return Smartphone
  if (normalized.includes('fashion')) return Shirt
  if (normalized.includes('fruit')) return Apple
  return Package
}

const getCategoryDestination = (category) => {
  const redirectUrl = String(category.redirectUrl || '').trim()
  if (redirectUrl) {
    if (/^https?:\/\//i.test(redirectUrl)) return redirectUrl
    if (redirectUrl.startsWith('/')) return redirectUrl
    return `/search?q=${encodeURIComponent(redirectUrl)}`
  }

  const query = String(category.query || category.name || '').trim()
  return `/search?q=${encodeURIComponent(query)}`
}

const ShopByCategorySection = () => {
  const { BACKEND_URL } = useContext(AppContext)
  const [backendCategories, setBackendCategories] = useState([])

  useEffect(() => {
    let isMounted = true

    const fetchShopCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/shop-categories?limit=60`)
        const categoryList = Array.isArray(response.data?.data) ? response.data.data : []

        if (!isMounted) return

        const mappedCategories = categoryList.map((category, index) => ({
          _id: category._id || `shop-category-${index}`,
          name: category.name || `Category ${index + 1}`,
          query: category.name || '',
          redirectUrl: category.redirectUrl || '',
          image: resolveCategoryImageUrl(BACKEND_URL, category.imageUrl),
          icon: getFallbackIcon(category.name),
          gradient: 'from-slate-500 to-gray-700',
          imageClassName: 'w-[100%] h-[100%] sm:w-[96%] sm:h-[96%] lg:w-[86%] lg:h-[86%]',
        }))

        setBackendCategories(mappedCategories)
      } catch (error) {
        if (isMounted) {
          setBackendCategories([])
        }
      }
    }

    fetchShopCategories()

    return () => {
      isMounted = false
    }
  }, [BACKEND_URL])

  const displayCategories = useMemo(() => {
    const sourceCategories = backendCategories.length > 0 ? backendCategories : demoCategories
    return sourceCategories.filter((category) => Boolean(category.image))
  }, [backendCategories])

  return (
    <section className="bg-gradient-to-b from-white via-white to-cyan-50/70 pt-2 pb-8 md:py-10">
      <div className="max-w-[86rem] mx-auto px-1 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-4 md:gap-5">
          {displayCategories.map((category, index) => {
            const Icon = category.icon
            const iconLabel = category.name === 'Properties' ? 'Property' : category.name
            const normalizedCategoryName = String(category.name || '').toLowerCase()
            const isFoodMachine = normalizedCategoryName.includes('food machine')
            const isShoppingVoucher = normalizedCategoryName.includes('shopping voucher') || normalizedCategoryName.includes('shoppingvoucher')
            const stripLabel = isFoodMachine ? 'Food Machines' : isShoppingVoucher ? 'Shop Voucher' : category.name
            const mobileImageScaleClass = isShoppingVoucher
              ? 'scale-[1.16] sm:scale-100'
              : isFoodMachine
                ? 'scale-[1.15] sm:scale-100'
                : 'scale-[1.12] sm:scale-100'
            const destination = getCategoryDestination(category)
            const isExternal = /^https?:\/\//i.test(destination)
            const cardClassName = `group aspect-square rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center ${
              category.image
                ? 'border-0 sm:border border-transparent sm:border-slate-200/80 bg-transparent sm:bg-white p-0 sm:p-2.5 md:p-3 shadow-none sm:shadow-[0_6px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 sm:hover:shadow-[0_10px_24px_rgba(14,116,144,0.18)]'
                : 'border border-slate-200/80 bg-white p-1.5 sm:p-2.5 md:p-3 shadow-[0_6px_16px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(14,116,144,0.18)]'
            }`

            const cardContent = (
              <div className={`w-full h-full relative rounded-xl overflow-hidden ${category.image ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-red-100 border-0 sm:border border-orange-100' : `bg-gradient-to-br ${category.gradient} text-white`} flex items-center justify-center`}>
                {category.image ? (
                  <>
                    <img
                      src={category.image}
                      alt={category.name}
                      className={`${category.imageClassName || 'w-[100%] h-[100%] sm:w-[90%] sm:h-[90%] lg:w-[76%] lg:h-[76%]'} ${mobileImageScaleClass} object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.2)]`}
                    />
                    <div className="absolute inset-x-0 bottom-0 sm:hidden bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 px-0.5 py-[1px] text-center">
                      <span
                        className="inline-block max-w-[96%] truncate whitespace-nowrap text-[11px] font-black leading-[0.98] tracking-[-0.02em] scale-y-[1.08] text-amber-900"
                        style={{ fontFamily: '"Bahnschrift Condensed","Roboto Condensed","Arial Narrow","Helvetica Neue Condensed","Liberation Sans Narrow",sans-serif' }}
                      >
                        {stripLabel}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Icon className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 mb-3 sm:mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]" />
                    <span className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 max-w-[88%] truncate rounded-full bg-white/90 px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-semibold text-slate-800 shadow">
                      {iconLabel}
                    </span>
                  </>
                )}
              </div>
            )

            if (isExternal) {
              return (
                <a
                  key={category._id || `${category.name}-${index}`}
                  href={destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                  aria-label={category.name}
                  title={category.name}
                >
                  {cardContent}
                </a>
              )
            }

            return (
              <Link
                key={category._id || `${category.name}-${index}`}
                to={destination}
                className={cardClassName}
                aria-label={category.name}
                title={category.name}
              >
                {cardContent}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ShopByCategorySection
