import React, { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'
import { AppContext } from './AppContext'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const productId = action.payload._id || action.payload.id
      const existingItem = state.items.find((item) => {
        const itemId = item._id || item.id
        return itemId === productId
      })

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) => {
            const itemId = item._id || item.id
            return itemId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          })
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => {
          const itemId = item._id || item.id
          return itemId !== action.payload
        })
      }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map((item) => {
            const itemId = item._id || item.id
            return itemId === action.payload.id
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          })
          .filter((item) => item.quantity > 0)
      }

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      }

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      }

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

const initialState = {
  items: [],
  loading: false,
  error: null
}

const isDemoProductId = (value) => String(value || '').startsWith('demo-')
const isDemoProduct = (product = {}) => Boolean(product.isDemo) || isDemoProductId(product._id || product.id)
const isObjectIdLike = (value) => /^[a-f\d]{24}$/i.test(String(value || ''))

const getCartItemId = (item = {}) => item._id || item.id

const safeParseJson = (value, fallback = []) => {
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const normalizeBackendCartItems = (backendCart = []) => {
  if (!Array.isArray(backendCart)) return []

  return backendCart
    .map((item) => {
      if (!item) return null

      if (item.isDemo) {
        const demoId = String(item.demoProductId || '').trim()
        if (!demoId) return null

        const demoImage = item.demoImageUrl || '/fruits.avif'

        return {
          id: demoId,
          _id: demoId,
          isDemo: true,
          name: item.demoProductName || 'Demo Product',
          brand: item.demoProductBrand || 'Demo',
          category: 'Demo',
          price: Number(item.demoProductPrice) || 0,
          imageUrl: demoImage,
          images: [demoImage],
          quantity: Number(item.quantity) || 1,
          addedAt: item.addedAt,
        }
      }

      if (!item.product) return null

      return {
        ...item.product,
        quantity: Number(item.quantity) || 1,
        addedAt: item.addedAt,
      }
    })
    .filter(Boolean)
}

const buildSyncItem = (item = {}) => {
  const rawId = getCartItemId(item)
  const productId = String(rawId || '').trim()
  if (!productId) return null

  const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1))

  if (isDemoProduct(item)) {
    const productPrice = Number(item.price)
    if (!Number.isFinite(productPrice) || productPrice <= 0) return null

    return {
      productId,
      quantity,
      isDemo: true,
      productName: item.name || item.seoTitle || 'Demo Product',
      productBrand: item.brand || item.category || 'Demo',
      productPrice,
      imageUrl:
        item.imageUrl ||
        item.image ||
        (Array.isArray(item.images) ? item.images[0] : '') ||
        ''
    }
  }

  if (!isObjectIdLike(productId)) return null

  return {
    productId,
    quantity
  }
}

const buildAddPayload = (product = {}) => {
  const productId = String(product._id || product.id || '').trim()
  if (!productId) return null

  const payload = {
    productId,
    quantity: 1
  }

  if (isDemoProduct(product)) {
    payload.isDemo = true
    payload.productName = product.name || product.seoTitle || 'Demo Product'
    payload.productBrand = product.brand || product.category || 'Demo'
    payload.productPrice = Number(product.price) || 0
    payload.imageUrl =
      product.imageUrl ||
      product.image ||
      (Array.isArray(product.images) ? product.images[0] : '') ||
      ''
  }

  return payload
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { user, isAuthenticated, BACKEND_URL } = useContext(AppContext)

  // Load cart from localStorage or backend on mount/auth change
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated && user) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true })

          const response = await axios.get(`${BACKEND_URL}/api/cart`, {
            withCredentials: true
          })

          if (response.data.success) {
            const normalizedItems = normalizeBackendCartItems(response.data.cart)
            dispatch({ type: 'LOAD_CART', payload: normalizedItems })
          }
        } catch (error) {
          console.error('Failed to load cart from backend:', error)
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }

        return
      }

      if (isAuthenticated === false) {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const parsedCart = safeParseJson(savedCart, [])
          dispatch({ type: 'LOAD_CART', payload: parsedCart })
        }
      }
    }

    loadCart()
  }, [isAuthenticated, user, BACKEND_URL])

  // Save to localStorage only for guest users
  useEffect(() => {
    if (isAuthenticated === false) {
      localStorage.setItem('cart', JSON.stringify(state.items))
    }
  }, [state.items, isAuthenticated])

  // Sync guest local cart to backend on login (includes demo + real products)
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (!(isAuthenticated && user)) return

      const savedCart = localStorage.getItem('cart')
      if (!savedCart) return

      const localCartItems = safeParseJson(savedCart, [])
      const syncableItems = localCartItems
        .map(buildSyncItem)
        .filter(Boolean)

      if (syncableItems.length === 0) {
        localStorage.removeItem('cart')
        return
      }

      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/cart/sync`,
          { localCart: syncableItems },
          { withCredentials: true }
        )

        if (response.data.success) {
          const normalizedItems = normalizeBackendCartItems(response.data.cart)
          dispatch({ type: 'LOAD_CART', payload: normalizedItems })
          localStorage.removeItem('cart')
        }
      } catch (error) {
        console.error('Failed to sync cart:', error)
      }
    }

    syncCartOnLogin()
  }, [isAuthenticated, user, BACKEND_URL])

  const addToCart = async (product) => {
    const productId = product._id || product.id

    if (!productId) {
      console.error('Product missing id field:', product)
      return
    }

    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        const payload = buildAddPayload(product)
        if (!payload) throw new Error('Invalid product payload')

        const response = await axios.post(`${BACKEND_URL}/api/cart/add`, payload, {
          withCredentials: true
        })

        if (response.data.success) {
          const normalizedItems = normalizeBackendCartItems(response.data.cart)
          dispatch({ type: 'LOAD_CART', payload: normalizedItems })
        }
      } catch (error) {
        console.error('Failed to add to cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }

      return
    }

    // Guest user - save to localStorage via reducer
    dispatch({ type: 'ADD_TO_CART', payload: product })
  }

  const removeFromCart = async (productId) => {
    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        const response = await axios.delete(`${BACKEND_URL}/api/cart/remove/${productId}`, {
          withCredentials: true
        })

        if (response.data.success) {
          const normalizedItems = normalizeBackendCartItems(response.data.cart)
          dispatch({ type: 'LOAD_CART', payload: normalizedItems })
        }
      } catch (error) {
        console.error('Failed to remove from cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }

      return
    }

    // Guest user - remove via reducer
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId })
  }

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        const response = await axios.put(`${BACKEND_URL}/api/cart/update/${productId}`, {
          quantity
        }, {
          withCredentials: true
        })

        if (response.data.success) {
          const normalizedItems = normalizeBackendCartItems(response.data.cart)
          dispatch({ type: 'LOAD_CART', payload: normalizedItems })
        }
      } catch (error) {
        console.error('Failed to update cart quantity:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }

      return
    }

    // Guest user - update via reducer
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = async () => {
    if (isAuthenticated && user) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const response = await axios.delete(`${BACKEND_URL}/api/cart/clear`, {
          withCredentials: true
        })

        if (response.data.success) {
          dispatch({ type: 'CLEAR_CART' })
        }
      } catch (error) {
        console.error('Failed to clear cart:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }

      return
    }

    // Guest user - clear via reducer
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
