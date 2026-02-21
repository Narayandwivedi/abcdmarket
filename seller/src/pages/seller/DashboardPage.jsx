import React, { useMemo } from 'react'

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)

const DashboardPage = ({ sellerProfile, products, onGoToProducts }) => {
  const summary = useMemo(() => {
    const totalProducts = products.length
    const inStockProducts = products.filter((item) => Number(item.stockQuantity) > 0).length
    const outOfStockProducts = totalProducts - inStockProducts
    const totalValue = products.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      totalValue,
    }
  }, [products])

  const recentProducts = products.slice(0, 5)

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Welcome, {sellerProfile.name}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Track product activity and manage your catalog from this dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Products</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{summary.totalProducts}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">In Stock</p>
          <p className="mt-2 text-2xl font-black text-emerald-800">{summary.inStockProducts}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Out Of Stock</p>
          <p className="mt-2 text-2xl font-black text-amber-800">{summary.outOfStockProducts}</p>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Price Sum</p>
          <p className="mt-2 text-xl font-black text-cyan-900">{formatCurrency(summary.totalValue)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Products</h3>
          <button
            type="button"
            onClick={onGoToProducts}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
          >
            Manage Products
          </button>
        </div>

        {recentProducts.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No products listed yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {recentProducts.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <p className="truncate pr-2 text-sm font-medium text-slate-800">{item.seoTitle}</p>
                <p className="text-xs font-semibold text-slate-600">{formatCurrency(item.price)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
