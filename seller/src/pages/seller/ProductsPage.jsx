import React from 'react'

const ProductsPage = ({
  categoryOptions,
  subCategories,
  productForm,
  onProductFieldChange,
  onAddProduct,
  addLoading,
  products,
  productsLoading,
  onRefreshProducts,
  priceDrafts,
  onPriceDraftChange,
  onUpdatePrice,
  onDeleteProduct,
  actionLoading,
  toLabel,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Add Product</h2>
        <p className="mt-1 text-sm text-slate-600">Create a new product for your catalog.</p>

        <form className="mt-4 space-y-3" onSubmit={onAddProduct}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Product Title *</label>
            <input
              type="text"
              value={productForm.seoTitle}
              onChange={(event) => onProductFieldChange('seoTitle', event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description *</label>
            <textarea
              value={productForm.description}
              onChange={(event) => onProductFieldChange('description', event.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Category *</label>
              <select
                value={productForm.category}
                onChange={(event) => onProductFieldChange('category', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Sub Category *</label>
              <select
                value={productForm.subCategory}
                onChange={(event) => onProductFieldChange('subCategory', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              >
                {subCategories.map((item) => (
                  <option key={item} value={item}>
                    {toLabel(item)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Brand *</label>
              <input
                type="text"
                value={productForm.brand}
                onChange={(event) => onProductFieldChange('brand', event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Model</label>
              <input
                type="text"
                value={productForm.model}
                onChange={(event) => onProductFieldChange('model', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Price *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.price}
                onChange={(event) => onProductFieldChange('price', event.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Original Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={productForm.originalPrice}
                onChange={(event) => onProductFieldChange('originalPrice', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
              <input
                type="number"
                min="0"
                value={productForm.stockQuantity}
                onChange={(event) => onProductFieldChange('stockQuantity', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={addLoading}
            className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {addLoading ? 'Adding product...' : 'Add Product'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Products</h2>
          <button
            type="button"
            onClick={onRefreshProducts}
            disabled={productsLoading}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
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
                <div key={product._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-slate-900">{product.seoTitle}</h3>
                    <p className="text-xs text-slate-500">
                      {toLabel(product.category)} / {toLabel(product.subCategory)} / {product.brand}
                    </p>
                    <p className="text-xs text-slate-500">
                      Current price: {product.price}{' '}
                      {product.originalPrice ? `(Original: ${product.originalPrice})` : ''}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.price}
                      onChange={(event) => onPriceDraftChange(product._id, 'price', event.target.value)}
                      placeholder="New price"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={draft.originalPrice}
                      onChange={(event) =>
                        onPriceDraftChange(product._id, 'originalPrice', event.target.value)
                      }
                      placeholder="Original price"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdatePrice(product._id)}
                      disabled={updating || deleting}
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updating ? 'Updating...' : 'Update Price'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteProduct(product._id)}
                    disabled={updating || deleting}
                    className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deleting ? 'Deleting...' : 'Delete Product'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsPage
