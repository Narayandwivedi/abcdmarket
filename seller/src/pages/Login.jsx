import { useEffect, useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const initialLoginData = {
  emailOrMobile: '',
  password: '',
}

const initialSignupData = {
  name: '',
  mobile: '',
  email: '',
  state: '',
  district: '',
  password: '',
}

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sellerProfile, setSellerProfile] = useState(null)
  const [loginData, setLoginData] = useState(initialLoginData)
  const [signupData, setSignupData] = useState(initialSignupData)

  const clearFeedback = () => {
    setError('')
    setMessage('')
  }

  const checkExistingSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/me`, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setSellerProfile(data.sellerData)
      }
    } catch (sessionError) {
      // Ignore initial session check failures in UI.
    }
  }

  useEffect(() => {
    checkExistingSession()
  }, [])

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Seller login failed')
      }

      setSellerProfile(data.sellerData)
      setMessage(data.message || 'Login successful')
      setLoginData(initialLoginData)
    } catch (requestError) {
      setError(requestError.message || 'Seller login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(signupData),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Seller signup failed')
      }

      setSellerProfile(data.sellerData)
      setMessage(data.message || 'Seller account created successfully')
      setSignupData(initialSignupData)
    } catch (requestError) {
      setError(requestError.message || 'Seller signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    clearFeedback()
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/seller-auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Logout failed')
      }
      setSellerProfile(null)
      setMessage(data.message || 'Logged out successfully')
    } catch (requestError) {
      setError(requestError.message || 'Logout failed')
    } finally {
      setLoading(false)
    }
  }

  const renderFeedback = () => (
    <>
      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </>
  )

  if (sellerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100 px-4 py-8 sm:py-14">
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold tracking-wide text-cyan-700">ABCDMARKET SELLER PORTAL</p>
            <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">Welcome, {sellerProfile.name}</h1>
            <p className="mt-2 text-sm text-slate-600">Your seller session is active.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <p><span className="font-semibold text-slate-800">Email:</span> {sellerProfile.email}</p>
            <p><span className="font-semibold text-slate-800">Mobile:</span> {sellerProfile.mobile}</p>
            <p><span className="font-semibold text-slate-800">State:</span> {sellerProfile.state}</p>
            <p><span className="font-semibold text-slate-800">District:</span> {sellerProfile.district}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'Logout'}
            </button>
          </div>

          <div className="mt-4">{renderFeedback()}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-cyan-100 px-4 py-8 sm:py-14">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/60 bg-white/90 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-7">
        <div className="mb-5">
          <p className="text-sm font-semibold tracking-wide text-cyan-700">ABCDMARKET SELLER PORTAL</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Seller Login / Signup</h1>
          <p className="mt-1 text-sm text-slate-600">Create a seller account or login to continue.</p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              clearFeedback()
              setActiveTab('login')
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              activeTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              clearFeedback()
              setActiveTab('signup')
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              activeTab === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
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
                onChange={(event) =>
                  setLoginData((prev) => ({ ...prev, emailOrMobile: event.target.value }))
                }
                placeholder="Enter email or mobile"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(event) =>
                  setLoginData((prev) => ({ ...prev, password: event.target.value }))
                }
                placeholder="Enter password"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'Login as Seller'}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSignupSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={signupData.name}
                onChange={(event) => setSignupData((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mobile</label>
              <input
                type="tel"
                value={signupData.mobile}
                onChange={(event) => setSignupData((prev) => ({ ...prev, mobile: event.target.value }))}
                placeholder="Enter 10-digit mobile"
                required
                pattern="[6-9]{1}[0-9]{9}"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={signupData.email}
                onChange={(event) => setSignupData((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Enter email address"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">State</label>
                <input
                  type="text"
                  value={signupData.state}
                  onChange={(event) => setSignupData((prev) => ({ ...prev, state: event.target.value }))}
                  placeholder="State"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">District</label>
                <input
                  type="text"
                  value={signupData.district}
                  onChange={(event) => setSignupData((prev) => ({ ...prev, district: event.target.value }))}
                  placeholder="District"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={signupData.password}
                onChange={(event) => setSignupData((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Enter password"
                required
                minLength={6}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : 'Signup as Seller'}
            </button>
          </form>
        )}

        <div className="mt-4">{renderFeedback()}</div>
      </div>
    </div>
  )
}

export default Login
