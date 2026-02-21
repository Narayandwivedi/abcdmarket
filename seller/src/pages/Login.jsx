import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const toLabel = (value = '') =>
  String(value)
    .split('-')
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(' ')

const initialLoginData = { emailOrMobile: '', password: '' }
const initialSignupData = { name: '', mobile: '', email: '', state: '', district: '', password: '' }
const getInitialProductData = () => ({
  seoTitle: '',
  description: '',
  category: 'pc-parts',
  subCategory: 'graphics-card',
  brand: '',
  model: '',
  price: '',
  originalPrice: '',
  stockQuantity: '0',
})

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [sellerProfile, setSellerProfile] = useState(null)
  const [loginData, setLoginData] = useState(initialLoginData)
  const [signupData, setSignupData] = useState(initialSignupData)

  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState(getInitialProductData)
  const [priceDrafts, setPriceDrafts] = useState({})

  const [authLoading, setAuthLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const subCategories = useMemo(() => CATEGORY_CONFIG[productForm.category]?.subCategories || [], [productForm.category])

  const clearFeedback = () => {
    setMessage('')
    setError('')
  }

  const syncDrafts = (items) => {
    const drafts = {}
    items.forEach((item) => {
      drafts[item._id] = {
        price: item.price !== undefined && item.price !== null ? String(item.price) : '',
        originalPrice: item.originalPrice !== undefined && item.originalPrice !== null ? String(item.originalPrice) : '',
      }
    })
    setPriceDrafts(drafts)
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
      syncDrafts(items)
    } catch (err) {
      setError(err.message || 'Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/me`, { method: 'GET', credentials: 'include' })
      const data = await response.json()
      if (response.ok && data.success) {
        setSellerProfile(data.sellerData)
        await loadMyProducts()
      }
    } catch (err) {
      // no-op
    }
  }

  useEffect(() => {
    checkSession()
  }, [])

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
      setMessage(data.message || 'Login successful')
      await loadMyProducts()
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
      setMessage(data.message || 'Seller account created successfully')
      await loadMyProducts()
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
      setMessage(data.message || 'Logged out successfully')
    } catch (err) {
      setError(err.message || 'Logout failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleProductFieldChange = (field, value) => {
    if (field === 'category') {
      const firstSubCategory = CATEGORY_CONFIG[value]?.subCategories?.[0] || ''
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

    if (!payload.seoTitle || !payload.description || !payload.category || !payload.subCategory || !payload.brand) {
      setError('Please fill all required product fields')
      return
    }
    if (Number.isNaN(payload.price) || payload.price < 0) {
      setError('Please enter a valid price')
      return
    }
    if (Number.isNaN(payload.stockQuantity) || payload.stockQuantity < 0) {
      setError('Please enter a valid stock quantity')
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
      setProductForm(getInitialProductData())
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
      if (draft.originalPrice === '') payload.originalPrice = ''
      else {
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
            <p className="mt-1 text-sm text-slate-600">Login first to access seller dashboard.</p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            <button type="button" onClick={() => { clearFeedback(); setActiveTab('login') }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
              Login
            </button>
            <button type="button" onClick={() => { clearFeedback(); setActiveTab('signup') }} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
              Signup
            </button>
          </div>

          {activeTab === 'login' ? (
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email or Mobile</label>
                <input type="text" value={loginData.emailOrMobile} onChange={(e) => setLoginData((prev) => ({ ...prev, emailOrMobile: e.target.value }))} placeholder="Enter email or mobile" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input type="password" value={loginData.password} onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))} placeholder="Enter password" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <button type="submit" disabled={authLoading} className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
                {authLoading ? 'Please wait...' : 'Login as Seller'}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignupSubmit}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input type="text" value={signupData.name} onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Enter your full name" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mobile</label>
                <input type="tel" value={signupData.mobile} onChange={(e) => setSignupData((prev) => ({ ...prev, mobile: e.target.value }))} placeholder="Enter 10-digit mobile" required pattern="[6-9]{1}[0-9]{9}" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={signupData.email} onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))} placeholder="Enter email address" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
                  <input type="text" value={signupData.state} onChange={(e) => setSignupData((prev) => ({ ...prev, state: e.target.value }))} placeholder="State" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">District</label>
                  <input type="text" value={signupData.district} onChange={(e) => setSignupData((prev) => ({ ...prev, district: e.target.value }))} placeholder="District" required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input type="password" value={signupData.password} onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))} placeholder="Enter password" required minLength={6} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-wide text-cyan-700">ABCDMARKET SELLER PANEL</p>
              <h1 className="mt-1 text-2xl font-black text-slate-900">Seller Dashboard</h1>
              <p className="mt-1 text-sm text-slate-600">Logged in as {sellerProfile.name} ({sellerProfile.email})</p>
            </div>
            <button type="button" onClick={handleLogout} disabled={authLoading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
              {authLoading ? 'Please wait...' : 'Logout'}
            </button>
          </div>
          <div className="mt-4">{renderFeedback()}</div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
          <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Add Product</h2>
            <p className="mt-1 text-sm text-slate-600">Only logged-in sellers can create products.</p>

            <form className="mt-4 space-y-3" onSubmit={handleAddProduct}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Product Title *</label>
                <input type="text" value={productForm.seoTitle} onChange={(e) => handleProductFieldChange('seoTitle', e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description *</label>
                <textarea value={productForm.description} onChange={(e) => handleProductFieldChange('description', e.target.value)} required rows={3} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category *</label>
                  <select value={productForm.category} onChange={(e) => handleProductFieldChange('category', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Sub Category *</label>
                  <select value={productForm.subCategory} onChange={(e) => handleProductFieldChange('subCategory', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100">
                    {subCategories.map((item) => (
                      <option key={item} value={item}>{toLabel(item)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Brand *</label>
                  <input type="text" value={productForm.brand} onChange={(e) => handleProductFieldChange('brand', e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Model</label>
                  <input type="text" value={productForm.model} onChange={(e) => handleProductFieldChange('model', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Price *</label>
                  <input type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => handleProductFieldChange('price', e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Original Price</label>
                  <input type="number" min="0" step="0.01" value={productForm.originalPrice} onChange={(e) => handleProductFieldChange('originalPrice', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
                  <input type="number" min="0" value={productForm.stockQuantity} onChange={(e) => handleProductFieldChange('stockQuantity', e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                </div>
              </div>
              <button type="submit" disabled={addLoading} className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
                {addLoading ? 'Adding product...' : 'Add Product'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">My Products</h2>
              <button type="button" onClick={loadMyProducts} disabled={productsLoading} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
                {productsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            {productsLoading ? (
              <p className="mt-4 text-sm text-slate-600">Loading your products...</p>
            ) : products.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">No products listed yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {products.map((product) => {
                  const draft = priceDrafts[product._id] || { price: '', originalPrice: '' }
                  const updating = actionLoading === `price-${product._id}`
                  const deleting = actionLoading === `delete-${product._id}`

                  return (
                    <div key={product._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold text-slate-900">{product.seoTitle}</h3>
                        <p className="text-xs text-slate-500">{toLabel(product.category)} / {toLabel(product.subCategory)} / {product.brand}</p>
                        <p className="text-xs text-slate-500">Current price: {product.price} {product.originalPrice ? `(Original: ${product.originalPrice})` : ''}</p>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input type="number" min="0" step="0.01" value={draft.price} onChange={(e) => handlePriceDraftChange(product._id, 'price', e.target.value)} placeholder="New price" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                        <input type="number" min="0" step="0.01" value={draft.originalPrice} onChange={(e) => handlePriceDraftChange(product._id, 'originalPrice', e.target.value)} placeholder="Original price" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100" />
                        <button type="button" onClick={() => handleUpdatePrice(product._id)} disabled={updating || deleting} className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
                          {updating ? 'Updating...' : 'Update Price'}
                        </button>
                      </div>

                      <button type="button" onClick={() => handleDeleteProduct(product._id)} disabled={updating || deleting} className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {deleting ? 'Deleting...' : 'Delete Product'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
