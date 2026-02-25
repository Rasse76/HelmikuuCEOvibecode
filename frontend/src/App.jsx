import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { playQtyIncrease, playQtyDecrease, playProductAdded, playProductUpdated, playProductDeleted, playError } from './sounds'

const API = '/api'

const CATEGORIES = ['Distance Driver', 'Fairway Driver', 'Mid-Range', 'Putter', 'Disc Bag', 'Accessories and baskets']

const CATEGORY_IMAGES = {
  'Distance Driver': '/images/distance-driver.svg',
  'Fairway Driver': '/images/fairway-driver.svg',
  'Mid-Range': '/images/mid-range.svg',
  'Putter': '/images/putter.svg',
  'Disc Bag': '/images/disc-bag.svg',
  'Accessories and baskets': '/images/accessories.svg',
}

function qtyClass(q) {
  if (q === 0) return 'low'
  if (q <= 5) return 'warn'
  return 'ok'
}

// ── Toast system ──────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([])
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])
  return { toasts, add }
}

// ── Product Form Modal ────────────────────────────────────────────────────────
function ProductModal({ product, onSave, onClose }) {
  const editing = !!product?.id
  const [form, setForm] = useState({
    name: product?.name || '',
    category: product?.category || CATEGORIES[0],
    price: product?.price ?? '',
    quantity: product?.quantity ?? '',
    sku: product?.sku || '',
    description: product?.description || '',
    image_url: product?.image_url || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.sku.trim()) e.sku = 'Required'
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0) e.price = 'Enter a valid price'
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0) e.quantity = 'Enter a valid quantity'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setSaving(true)
    await onSave({ ...form, price: Number(form.price), quantity: Number(form.quantity) })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{editing ? '✏️ Edit Product' : '➕ Add Product'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="form-grid">
          <div className="form-group full">
            <label className="form-label">Product Name</label>
            <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Innova Aviar" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">SKU</label>
            <input className="form-input" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. DG-021" />
            {errors.sku && <span className="form-error">{errors.sku}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Price (€)</label>
            <input className="form-input" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
            {errors.price && <span className="form-error">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" type="number" min="0" step="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="0" />
            {errors.quantity && <span className="form-error">{errors.quantity}</span>}
          </div>
          <div className="form-group full">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Flight numbers, specs, notes…" />
          </div>
          <div className="form-group full">
            <label className="form-label">Image URL</label>
            <input className="form-input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://… or /images/putter.svg" />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Save Product'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ product, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false)
  const go = async () => { setDeleting(true); await onConfirm(); setDeleting(false) }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <span className="modal-title">🗑️ Delete Product</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="confirm-msg">Are you sure you want to remove <strong>{product.name}</strong> from the inventory? This cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-delete" onClick={go} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onEdit, onDelete, onQtyChange }) {
  const q = product.quantity
  const [localQty, setLocalQty] = useState(q)
  const [saving, setSaving] = useState(false)
  const [imgError, setImgError] = useState(false)

  const imgSrc = product.image_url || CATEGORY_IMAGES[product.category] || null

  useEffect(() => setLocalQty(product.quantity), [product.quantity])

  const change = async (delta) => {
    const next = Math.max(0, localQty + delta)
    setLocalQty(next)
    setSaving(true)
    if (delta > 0) playQtyIncrease()
    else if (delta < 0 && next !== localQty) playQtyDecrease()
    await onQtyChange(product.id, next)
    setSaving(false)
  }

  const catClass = `card-cat cat-${product.category}`

  return (
    <div className="product-card">
      {imgSrc && !imgError && (
        <div className="card-img-wrap">
          <img
            className="card-img"
            src={imgSrc}
            alt={product.name}
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="card-header">
        <span className="card-name">{product.name}</span>
        <span className={catClass}>{product.category}</span>
      </div>
      <p className="card-desc">{product.description || <em>No description</em>}</p>
      <span className="card-sku">{product.sku}</span>

      <div className="qty-row">
        <span className="qty-label">Stock</span>
        <div className="qty-ctrl">
          <button className="qty-btn" onClick={() => change(-1)} disabled={saving || localQty === 0}>−</button>
          <span className={`qty-val ${qtyClass(localQty)}`}>{localQty}</span>
          <button className="qty-btn" onClick={() => change(1)} disabled={saving}>+</button>
        </div>
      </div>

      <div className="card-footer">
        <span className="card-price">€{Number(product.price).toFixed(2)}</span>
        <div className="card-actions">
          <button className="btn-icon edit" title="Edit" onClick={() => onEdit(product)}>✏️</button>
          <button className="btn-icon danger" title="Delete" onClick={() => onDelete(product)}>🗑️</button>
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'category'
  const [editProduct, setEditProduct] = useState(null)  // null=closed, {}=new, product=edit
  const [deleteProduct, setDeleteProduct] = useState(null)
  const { toasts, add: toast } = useToasts()

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (activeCat !== 'All') params.set('category', activeCat)
      const res = await fetch(`${API}/products?${params}`)
      const data = await res.json()
      setProducts(data)
    } catch {
      toast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }, [search, activeCat])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`)
      setCategories(await res.json())
    } catch {}
  }

  useEffect(() => { fetchCategories() }, [])
  useEffect(() => { setLoading(true); fetchProducts() }, [fetchProducts])

  const saveProduct = async (form) => {
    try {
      const url = editProduct?.id ? `${API}/products/${editProduct.id}` : `${API}/products`
      const method = editProduct?.id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) {
        const err = await res.json()
        playError()
        toast(err.error || 'Save failed', 'error')
        return
      }
      if (editProduct?.id) { playProductUpdated() } else { playProductAdded() }
      toast(editProduct?.id ? 'Product updated ✓' : 'Product added ✓', 'success')
      setEditProduct(null)
      fetchProducts()
      fetchCategories()
    } catch {
      playError()
      toast('Network error', 'error')
    }
  }

  const deleteProductFn = async () => {
    try {
      const res = await fetch(`${API}/products/${deleteProduct.id}`, { method: 'DELETE' })
      if (!res.ok) { playError(); toast('Delete failed', 'error'); return }
      playProductDeleted()
      toast('Product removed', 'info')
      setDeleteProduct(null)
      fetchProducts()
      fetchCategories()
    } catch {
      playError()
      toast('Network error', 'error')
    }
  }

  const updateQty = async (id, quantity) => {
    try {
      const res = await fetch(`${API}/products/${id}/quantity`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity })
      })
      if (!res.ok) { playError(); toast('Failed to update quantity', 'error') }
    } catch {
      playError()
      toast('Network error', 'error')
    }
  }

  const totalProducts = products.length
  const totalStock = products.reduce((s, p) => s + p.quantity, 0)
  const lowStock = products.filter(p => p.quantity <= 5).length

  // Organize products by category
  const groupedByCategory = () => {
    const groups = {}
    categories.forEach(cat => { groups[cat] = [] })
    products.forEach(product => {
      if (groups[product.category]) {
        groups[product.category].push(product)
      }
    })
    return groups
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <span className="header-logo">🥏</span>
          <div>
            <div className="header-title">DiscGolf Pro Shop</div>
            <div className="header-subtitle">Inventory Management</div>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge"><div className="num">{totalProducts}</div><div className="lbl">Products</div></div>
          <div className="stat-badge"><div className="num">{totalStock}</div><div className="lbl">In Stock</div></div>
          {lowStock > 0 && <div className="stat-badge" style={{ borderColor: 'rgba(234,179,8,0.4)', background: 'rgba(234,179,8,0.08)' }}>
            <div className="num" style={{ color: 'var(--yellow)' }}>{lowStock}</div>
            <div className="lbl">Low Stock</div>
          </div>}
        </div>
      </header>

      <main className="main">
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search by name or SKU…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} title="Grid view" onClick={() => setViewMode('grid')}>⊞ Grid</button>
            <button className={`view-btn ${viewMode === 'category' ? 'active' : ''}`} title="Category view" onClick={() => setViewMode('category')}>📑 Categories</button>
          </div>
          <button className="btn-add" onClick={() => setEditProduct({})}>＋ Add Product</button>
        </div>

        {viewMode === 'grid' && (
          <>
            <div className="cat-pills">
              {['All', ...categories].map(cat => (
                <button key={cat} className={`cat-pill ${activeCat === cat ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>{cat}</button>
              ))}
            </div>

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🥏</div>
                <h3>No products found</h3>
                <p>{search || activeCat !== 'All' ? 'Try adjusting your filters.' : 'Add your first product to get started.'}</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} onEdit={setEditProduct} onDelete={setDeleteProduct} onQtyChange={updateQty} />
                ))}
              </div>
            )}
          </>
        )}

        {viewMode === 'category' && (
          <>
            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : (
              <div className="categories-view">
                {categories.map(cat => {
                  const catProducts = search 
                    ? groupedByCategory()[cat]?.filter(p => 
                        p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.sku.toLowerCase().includes(search.toLowerCase())
                      ) || []
                    : groupedByCategory()[cat] || []
                  
                  if (catProducts.length === 0) return null
                  
                  return (
                    <div key={cat} className="category-section">
                      <div className="category-header">
                        <span className="category-icon">{CATEGORY_IMAGES[cat] ? '📁' : '🏷️'}</span>
                        <h2 className="category-title">{cat}</h2>
                        <span className="category-count">{catProducts.length} items</span>
                      </div>
                      <div className="products-grid">
                        {catProducts.map(p => (
                          <ProductCard key={p.id} product={p} onEdit={setEditProduct} onDelete={setDeleteProduct} onQtyChange={updateQty} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {editProduct !== null && (
        <ProductModal product={editProduct} onSave={saveProduct} onClose={() => setEditProduct(null)} />
      )}
      {deleteProduct && (
        <DeleteModal product={deleteProduct} onConfirm={deleteProductFn} onClose={() => setDeleteProduct(null)} />
      )}

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  )
}
