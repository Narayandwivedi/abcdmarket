import React from 'react'
import { useNavigate } from 'react-router-dom'

const ComingSoonCategoryPage = ({ categoryName = 'Category' }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-cyan-100 bg-white shadow-xl p-8 sm:p-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {categoryName}
          </h1>
          <p className="mt-4 text-xl font-bold text-cyan-700 animate-pulse">Coming Soon</p>
          <p className="mt-2 text-slate-600">
            We are preparing this category for you. Please check back shortly.
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-8 inline-flex items-center rounded-lg bg-cyan-600 px-5 py-2.5 text-white font-semibold hover:bg-cyan-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonCategoryPage
