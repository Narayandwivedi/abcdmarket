import React from 'react'
import { useParams } from 'react-router-dom'
import FruitsCategoryPage from './categories/FruitsCategoryPage'
import VegetablesCategoryPage from './categories/VegetablesCategoryPage'
import GroceryCategoryPage from './categories/GroceryCategoryPage'
import SuperfoodsCategoryPage from './categories/SuperfoodsCategoryPage'
import ComingSoonCategoryPage from './categories/ComingSoonCategoryPage'

const normalizeCategorySlug = (value = '') =>
  decodeURIComponent(String(value))
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatCategoryLabel = (value = '') =>
  decodeURIComponent(String(value))
    .replace(/-/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase()) || 'Category'

const fruitSlugs = new Set(['fruit', 'fruits'])
const vegetableSlugs = new Set(['vegetable', 'vegetables', 'veggies'])
const grocerySlugs = new Set(['grocery', 'groceries'])
const superfoodSlugs = new Set([
  'superfood',
  'superfoods',
  'super-fruit',
  'super-fruits',
  'superfruit',
  'superfruits',
])

const CategoryResults = () => {
  const { categorySlug = '' } = useParams()
  const normalizedSlug = normalizeCategorySlug(categorySlug)

  if (fruitSlugs.has(normalizedSlug)) {
    return <FruitsCategoryPage />
  }

  if (vegetableSlugs.has(normalizedSlug)) {
    return <VegetablesCategoryPage />
  }

  if (grocerySlugs.has(normalizedSlug)) {
    return <GroceryCategoryPage />
  }

  if (superfoodSlugs.has(normalizedSlug)) {
    return <SuperfoodsCategoryPage />
  }

  return <ComingSoonCategoryPage categoryName={formatCategoryLabel(categorySlug)} />
}

export default CategoryResults
