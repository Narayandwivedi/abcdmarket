import React from 'react'

const formatDate = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const SettingsPage = ({ sellerProfile, onLogout, authLoading }) => {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Seller Settings</h2>
        <p className="mt-1 text-sm text-slate-600">
          Profile details for your seller account.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{sellerProfile.name}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{sellerProfile.email}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mobile</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{sellerProfile.mobile}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">State</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{sellerProfile.state}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">District</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{sellerProfile.district}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Joined</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{formatDate(sellerProfile.createdAt)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-red-800">Session</h3>
        <p className="mt-1 text-sm text-red-700">
          Logout from this device when you are done managing products.
        </p>
        <button
          type="button"
          onClick={onLogout}
          disabled={authLoading}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {authLoading ? 'Please wait...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
