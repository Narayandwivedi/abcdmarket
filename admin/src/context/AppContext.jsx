import { useEffect, useState, createContext, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export const AppContextProvider = (props) => {
  const navigate = useNavigate()

  // Auth states
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    if (isCheckingAuth) return
   
    try {
      setIsCheckingAuth(true)
      setLoading(true)
      const response = await axios.get(`${BACKEND_URL}/api/admin/auth/me`, {
        withCredentials: true
      })
     
      if (response.data.isLoggedIn) {
        setIsAuthenticated(true)
        setUser(response.data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
      setIsCheckingAuth(false)
    }
  }, [isCheckingAuth])

  useEffect(() => {
    if (isAuthenticated === null && !user && !isCheckingAuth) {
      checkAuthStatus()
    }
  }, [isAuthenticated, user, checkAuthStatus, isCheckingAuth])

  // Login function
  const login = useCallback(async (loginData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/auth/login`, loginData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setIsAuthenticated(true)
        setUser(response.data.userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Login failed' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    }
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/admin/auth/logout`, {}, {
        withCredentials: true
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      navigate('/login')
    }
  }, [navigate])

  const value = useMemo(() => ({
    BACKEND_URL,
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  }), [
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus
  ])

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};