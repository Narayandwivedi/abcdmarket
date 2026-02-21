
import { useEffect, useMemo, useState } from 'react'
import DashboardPage from './seller/DashboardPage'
import ProductsPage from './seller/ProductsPage'
import SettingsPage from './seller/SettingsPage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const SELLER_SECTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'products', label: 'Products' },
  { key: 'settings', label: 'Settings' },
]

const toLabel = (value = '') =>
  String(value)
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(' ')

const normalizeValue = (value = '') => String(value || '').trim()

const initialLoginData = { emailOrMobile: '', password: '' }
const initialSignupData = { name: '', mobile: '', email: '', state: '', district: '', password: '' }

const getInitialProductData = (category = '', subCategory = '') => ({
  seoTitle: '',
  description: '',
  category,
  subCategory,
  brand: '',
  model: '',
  price: '',
  originalPrice: '',
  stockQuantity: '0',
})

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [sellerProfile, setSellerProfile] = useState(null)
  const [loginData, setLoginData] = useState(initialLoginData)
  const [signupData, setSignupData] = useState(initialSignupData)

  const [products, setProducts] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [subCategoryMap, setSubCategoryMap] = useState({})
  const [productForm, setProductForm] = useState(getInitialProductData)
  const [priceDrafts, setPriceDrafts] = useState({})

  const [authLoading, setAuthLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const subCategories = useMemo(
    () => subCategoryMap[productForm.category] || [],
    [subCategoryMap, productForm.category]
  )

  const clearFeedback = () => {
    setMessage('')
    setError('')
  }

  const syncPriceDrafts = (items) => {
    const drafts = {}
    items.forEach((item) => {
      drafts[item._id] = {
        price: item.price !== undefined && item.price !== null ? String(item.price) : '',
        originalPrice: item.originalPrice !== undefined && item.originalPrice !== null ? String(item.originalPrice) : '',
      }
    })
    setPriceDrafts(drafts)
  }

  const fetchCatalogData = async (endpoints, fallbackMessage) => {
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          credentials: 'include',
        })
        const data = await response.json()
        if (response.ok && data.success) {
          return data
        }
      } catch (err) {
        // Try next endpoint fallback.
      }
    }

    throw new Error(fallbackMessage)
  }

  const loadCategoryTaxonomy = async ({ showError = false } = {}) => {
    try {
      const [categoryPayload, subCategoryPayload] = await Promise.all([
        fetchCatalogData(
          ['/api/shop-categories/admin', '/api/shop-categories?limit=200'],
          'Failed to load categories'
        ),
        fetchCatalogData(
          ['/api/sub-categories/admin', '/api/sub-categories?limit=500'],
          'Failed to load sub categories'
        ),
      ])

      const categories = Array.isArray(categoryPayload?.data) ? categoryPayload.data : []
      const subCategoriesFromApi = Array.isArray(subCategoryPayload?.data) ? subCategoryPayload.data : []

      const categoryIdToNameMap = new Map()
      const nextCategoryOptions = []
      const seenCategoryNames = new Set()

      categories.forEach((category) => {
        const categoryId = normalizeValue(category?._id)
        const categoryName = normalizeValue(category?.name)

        if (categoryId && categoryName) {
          categoryIdToNameMap.set(categoryId, categoryName)
        }

        if (!categoryName) return

        const key = categoryName.toLowerCase()
        if (seenCategoryNames.has(key)) return
        seenCategoryNames.add(key)
        nextCategoryOptions.push({
          value: categoryName,
          label: categoryName,
        })
      })

      const nextSubCategoryMap = {}
      nextCategoryOptions.forEach((option) => {
        nextSubCategoryMap[option.value] = []
      })

      subCategoriesFromApi.forEach((subCategory) => {
        const subCategoryName = normalizeValue(subCategory?.name)
        if (!subCategoryName) return

        let categoryName = ''
        if (subCategory?.category && typeof subCategory.category === 'object') {
          categoryName =
            normalizeValue(subCategory.category.name) ||
            categoryIdToNameMap.get(normalizeValue(subCategory.category._id)) ||
            ''
        } else {
          categoryName = categoryIdToNameMap.get(normalizeValue(subCategory?.category)) || ''
        }

        if (!categoryName) return

        if (!nextSubCategoryMap[categoryName]) {
          nextSubCategoryMap[categoryName] = []
        }

        const alreadyExists = nextSubCategoryMap[categoryName].some(
          (name) => name.toLowerCase() === subCategoryName.toLowerCase()
        )

        if (!alreadyExists) {
          nextSubCategoryMap[categoryName].push(subCategoryName)
        }
      })

      Object.keys(nextSubCategoryMap).forEach((categoryName) => {
        nextSubCategoryMap[categoryName].sort((firstName, secondName) =>
          firstName.localeCompare(secondName)
        )
      })

      setCategoryOptions(nextCategoryOptions)
      setSubCategoryMap(nextSubCategoryMap)

      setProductForm((prev) => {
        const defaultCategory = nextCategoryOptions[0]?.value || ''
        const selectedCategory = nextCategoryOptions.some(
          (option) => option.value === prev.category
        )
          ? prev.category
          : defaultCategory

        const categorySubCategories = nextSubCategoryMap[selectedCategory] || []
        const selectedSubCategory = categorySubCategories.includes(prev.subCategory)
          ? prev.subCategory
          : categorySubCategories[0] || ''

        if (
          prev.category === selectedCategory &&
          prev.subCategory === selectedSubCategory
        ) {
          return prev
        }

        return {
          ...prev,
          category: selectedCategory,
          subCategory: selectedSubCategory,
        }
      })
    } catch (err) {
      if (showError) {
        setError(err.message || 'Failed to load categories')
      }
    }
  }

  const loadMyProducts = async () => {
    setProductsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/seller/my?limit=200`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load products')

      const items = Array.isArray(data.data) ? data.data : []
      setProducts(items)
      syncPriceDrafts(items)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/me`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setSellerProfile(data.sellerData)
        setActiveSection('dashboard')
        await Promise.all([
          loadMyProducts(),
          loadCategoryTaxonomy({ showError: true }),
        ])
      }
    } catch (err) {
      // no-op
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [activeSection])

  useEffect(() => {
    if (!sellerProfile || activeSection !== 'products') return
    loadCategoryTaxonomy({ showError: true })
  }, [sellerProfile, activeSection])

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()
    setAuthLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Seller login failed')

      setSellerProfile(data.sellerData)
      setLoginData(initialLoginData)
      setActiveSection('dashboard')
      setMessage(data.message || 'Login successful')
      await Promise.all([
        loadMyProducts(),
        loadCategoryTaxonomy({ showError: true }),
      ])
    } catch (err) {
      setError(err.message || 'Seller login failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignupSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()
    setAuthLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signupData),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Seller signup failed')

      setSellerProfile(data.sellerData)
      setSignupData(initialSignupData)
      setActiveSection('dashboard')
      setMessage(data.message || 'Seller account created successfully')
      await Promise.all([
        loadMyProducts(),
        loadCategoryTaxonomy({ showError: true }),
      ])
    } catch (err) {
      setError(err.message || 'Seller signup failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    clearFeedback()
    setAuthLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Logout failed')

      setSellerProfile(null)
      setProducts([])
      setPriceDrafts({})
      setCategoryOptions([])
      setSubCategoryMap({})
      setProductForm(getInitialProductData())
      setActiveSection('dashboard')
      setMessage(data.message || 'Logged out successfully')
    } catch (err) {
      setError(err.message || 'Logout failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleProductFieldChange = (field, value) => {
    if (field === 'category') {
      const firstSubCategory = subCategoryMap[value]?.[0] || ''
      setProductForm((prev) => ({ ...prev, category: value, subCategory: firstSubCategory }))
      return
    }
    setProductForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddProduct = async (event) => {
    event.preventDefault()
    clearFeedback()

    const payload = {
      seoTitle: String(productForm.seoTitle || '').trim(),
      description: String(productForm.description || '').trim(),
      category: productForm.category,
      subCategory: productForm.subCategory,
      brand: String(productForm.brand || '').trim(),
      model: String(productForm.model || '').trim(),
      price: Number(productForm.price),
      stockQuantity: Number(productForm.stockQuantity || 0),
    }

    if (!payload.seoTitle || !payload.description || !payload.category || !payload.brand) {
      setError('Please fill all required product fields')
      return
    }
    if (Number.isNaN(payload.price) || payload.price < 0) {
      setError('Please enter a valid price')
      return
    }

    if (productForm.originalPrice !== '') {
      const original = Number(productForm.originalPrice)
      if (Number.isNaN(original) || original < 0) {
        setError('Please enter a valid original price')
        return
      }
      payload.originalPrice = original
    }

    if (!payload.model) delete payload.model

    setAddLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to add product')

      setMessage('Product added successfully')
      const defaultCategory = categoryOptions[0]?.value || ''
      const defaultSubCategory = subCategoryMap[defaultCategory]?.[0] || ''
      setProductForm(getInitialProductData(defaultCategory, defaultSubCategory))
      await loadMyProducts()
    } catch (err) {
      setError(err.message || 'Failed to add product')
    } finally {
      setAddLoading(false)
    }
  }

  const handlePriceDraftChange = (productId, key, value) => {
    setPriceDrafts((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [key]: value,
      },
    }))
  }

  const handleUpdatePrice = async (productId) => {
    clearFeedback()
    const draft = priceDrafts[productId] || {}
    const price = Number(draft.price)
    if (Number.isNaN(price) || price < 0) {
      setError('Enter a valid price before updating')
      return
    }

    const payload = { price }
    if (draft.originalPrice !== undefined) {
      if (draft.originalPrice === '') {
        payload.originalPrice = ''
      } else {
        const original = Number(draft.originalPrice)
        if (Number.isNaN(original) || original < 0) {
          setError('Enter a valid original price')
          return
        }
        payload.originalPrice = original
      }
    }

    setActionLoading(`price-${productId}`)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/seller/${productId}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to update price')

      setMessage('Price updated successfully')
      await loadMyProducts()
    } catch (err) {
      setError(err.message || 'Failed to update price')
    } finally {
      setActionLoading('')
    }
  }

  const handleDeleteProduct = async (productId) => {
    clearFeedback()
    if (!window.confirm('Delete this product?')) return

    setActionLoading(`delete-${productId}`)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/seller/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.message || 'Failed to delete product')

      setMessage('Product deleted successfully')
      await loadMyProducts()
    } catch (err) {
      setError(err.message || 'Failed to delete product')
    } finally {
      setActionLoading('')
    }
  }

  const renderFeedback = () => (
    <>
      {message && <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
    </>
  )

  if (!sellerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100 px-4 py-8 sm:py-14">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/60 bg-white/90 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-7">
          <div className="mb-5">
            <p className="text-sm font-semibold tracking-wide text-cyan-700">ABCDMARKET SELLER PANEL</p>
            <h1 className="mt-1 text-2xl font-black text-slate-900">Seller Login / Signup</h1>
            <p className="mt-1 text-sm text-slate-600">Login first to access seller pages.</p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { clearFeedback(); setActiveTab('login') }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { clearFeedback(); setActiveTab('signup') }}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Signup
            </button>
          </div>

          {activeTab === 'login' ? (
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email or Mobile</label>
                <input
                  type="text"
                  value={loginData.emailOrMobile}
                  onChange={(event) => setLoginData((prev) => ({ ...prev, emailOrMobile: event.target.value }))}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(event) => setLoginData((prev) => ({ ...prev, password: event.target.value }))}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <button type="submit" disabled={authLoading} className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
                {authLoading ? 'Please wait...' : 'Login as Seller'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input type="text" value={signupData.name} onChange={(event) => setSignupData((prev) => ({ ...prev, name: event.target.value }))} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mobile</label>
                <input type="tel" value={signupData.mobile} onChange={(event) => setSignupData((prev) => ({ ...prev, mobile: event.target.value }))} required pattern="[6-9]{1}[0-9]{9}" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={signupData.email} onChange={(event) => setSignupData((prev) => ({ ...prev, email: event.target.value }))} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="text" value={signupData.state} onChange={(event) => setSignupData((prev) => ({ ...prev, state: event.target.value }))} placeholder="State" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                <input type="text" value={signupData.district} onChange={(event) => setSignupData((prev) => ({ ...prev, district: event.target.value }))} placeholder="District" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input type="password" value={signupData.password} onChange={(event) => setSignupData((prev) => ({ ...prev, password: event.target.value }))} required minLength={6} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <button type="submit" disabled={authLoading} className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
                {authLoading ? 'Please wait...' : 'Signup as Seller'}
              </button>
            </form>
          )}

          <div className="mt-4">{renderFeedback()}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white/60 bg-white/95 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-md lg:flex">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Seller Panel</p>
        <h2 className="mt-1 text-lg font-black text-slate-900">ABCDMARKET</h2>
        <p className="mt-1 truncate text-xs text-slate-600">{sellerProfile.email}</p>

        <div className="mt-4 space-y-2">
          {SELLER_SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeSection === section.key
                  ? 'bg-gradient-to-r from-orange-500 to-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={authLoading}
          className="mt-auto w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {authLoading ? 'Please wait...' : 'Logout'}
        </button>
      </aside>

      <div className="sticky top-0 z-40 border-b border-white/60 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Seller Panel</p>
            <h2 className="mt-1 text-lg font-black text-slate-900">ABCDMARKET</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle seller menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
          >
            {isMobileMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {SELLER_SECTIONS.map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => {
                  setActiveSection(section.key)
                  setIsMobileMenuOpen(false)
                }}
                className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                  activeSection === section.key
                    ? 'bg-gradient-to-r from-orange-500 to-cyan-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <main className="space-y-4 px-4 pb-6 pt-4 sm:px-6 lg:ml-64 lg:px-8 lg:py-8">

        {renderFeedback()}
        {activeSection === 'dashboard' && (
          <DashboardPage sellerProfile={sellerProfile} products={products} onGoToProducts={() => setActiveSection('products')} />
        )}
        {activeSection === 'products' && (
          <ProductsPage
            categoryOptions={categoryOptions}
            subCategories={subCategories}
            productForm={productForm}
            onProductFieldChange={handleProductFieldChange}
            onAddProduct={handleAddProduct}
            addLoading={addLoading}
            products={products}
            productsLoading={productsLoading}
            onRefreshProducts={loadMyProducts}
            priceDrafts={priceDrafts}
            onPriceDraftChange={handlePriceDraftChange}
            onUpdatePrice={handleUpdatePrice}
            onDeleteProduct={handleDeleteProduct}
            actionLoading={actionLoading}
            toLabel={toLabel}
          />
        )}
        {activeSection === 'settings' && (
          <SettingsPage sellerProfile={sellerProfile} onLogout={handleLogout} authLoading={authLoading} />
        )}
      </main>
    </div>
  )
}

export default Login
