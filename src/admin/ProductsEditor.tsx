import React, { useEffect, useState } from 'react';
import { api } from './api';

interface Product {
  id: number;
  name: string;
  category: string;
  tag: string | null;
  price: string | null;
  old_price: string | null;
  discount: number | null;
  image_url: string | null;
  link: string | null;
  color: string;
  glyph: string;
  status: string | null;
  override_name: string | null;
  override_price: string | null;
  override_image_url: string | null;
  override_status: string | null;
  override_tag: string | null;
  visible: boolean;
  order_index: number;
}

const CATEGORIES = ['PC Gaming', 'Office PC', 'Laptop', 'VGA', 'Gaming Gear', 'Keyboard', 'Audio', 'Other'];
const STATUSES = ['', 'New', 'Hot', 'Sale'];

const EMPTY_FORM: Omit<Product, 'id'> = {
  name: '',
  category: 'PC Gaming',
  tag: null,
  price: null,
  old_price: null,
  discount: null,
  image_url: null,
  link: null,
  color: '#3B82F6',
  glyph: '📦',
  status: null,
  override_name: null,
  override_price: null,
  override_image_url: null,
  override_status: null,
  override_tag: null,
  visible: true,
  order_index: 0,
};

type ActionStatus = 'idle' | 'saving' | 'saved' | 'error';

export const ProductsEditor: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | Omit<Product, 'id'> | null>(null);
  const [status, setStatus] = useState<ActionStatus>('idle');
  const [actionMessage, setActionMessage] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Fetch all products from our secure admin endpoint
      const data = await api.get<Product[]>('/admin/products');
      setProducts(data ?? []);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const showStatus = (type: ActionStatus, msg: string) => {
    setStatus(type);
    setActionMessage(msg);
    if (type === 'saved' || type === 'error') {
      setTimeout(() => {
        setStatus('idle');
        setActionMessage('');
      }, 2500);
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name || !editingProduct.category) {
      showStatus('error', 'Name and category are required');
      return;
    }

    showStatus('saving', 'Saving changes...');
    try {
      if ('id' in editingProduct) {
        // Update product via admin endpoint
        await api.put('/admin/products', editingProduct);
      } else {
        // Create product via admin endpoint
        await api.post('/admin/products', editingProduct);
      }
      showStatus('saved', '✓ Saved successfully');
      setEditingProduct(null);
      await loadProducts();
    } catch (err) {
      console.error(err);
      showStatus('error', `✗ Failed: ${String(err)}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    showStatus('saving', 'Deleting product...');
    try {
      await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ id })
      });
      showStatus('saved', '✓ Deleted successfully');
      await loadProducts();
    } catch (err) {
      console.error(err);
      showStatus('error', `✗ Delete failed: ${String(err)}`);
    }
  };

  const handleToggleVisible = async (p: Product) => {
    const updatedVisible = !p.visible;
    
    // Optimistic UI update
    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, visible: updatedVisible } : item));
    
    try {
      await api.put('/admin/products', {
        ...p,
        visible: updatedVisible
      });
    } catch (err) {
      console.error(err);
      // Revert on failure
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, visible: p.visible } : item));
      alert(`Failed to update visibility: ${String(err)}`);
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(query) || (p.override_name && p.override_name.toLowerCase().includes(query));
    const catMatch = p.category.toLowerCase().includes(query);
    return nameMatch || catMatch;
  });

  const getResolvedPrice = (p: Product) => {
    return p.override_price ?? p.price ?? '—';
  };

  const getResolvedStatus = (p: Product) => {
    return p.override_status ?? p.status;
  };

  return (
    <div className="p-window-padding space-y-6">
      
      {/* Header Actions Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-[19px] font-bold text-on-surface">Inventory</h2>
          <p className="text-[13px] text-on-surface-variant">Manage your catalog of high-performance tech products.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative w-64 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 group-focus-within:text-primary transition-colors text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-md py-1 pl-9 pr-3 text-[13px] text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>

          <button
            onClick={() => setEditingProduct({ ...EMPTY_FORM, order_index: products.length })}
            className="bg-primary hover:bg-primary-container text-on-primary px-4 py-1.5 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Product
          </button>
        </div>
      </div>

      {/* Main Inventory Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2.5 text-on-surface-variant text-[13px]">
            <div className="w-4 h-4 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
            Loading products catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-[13px]">
            {searchQuery ? 'No products matches your search.' : 'No products found. Click "Add Product" to get started.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="px-6 py-3 font-section-header text-section-header text-on-surface-variant w-[80px]">Image</th>
                  <th className="px-6 py-3 font-section-header text-section-header text-on-surface-variant">Name</th>
                  <th className="px-6 py-3 font-section-header text-section-header text-on-surface-variant">Category</th>
                  <th className="px-6 py-3 font-section-header text-section-header text-on-surface-variant">Price</th>
                  <th className="px-6 py-3 font-section-header text-section-header text-on-surface-variant">Status</th>
                  <th className="px-6 py-3 font-section-header text-section-header text-on-surface-variant w-[100px] text-center">Visible</th>
                  <th className="px-6 py-3 font-section-header text-section-header text-on-surface-variant text-right w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredProducts.map((p) => {
                  const resolvedImage = p.override_image_url ?? p.image_url;
                  const resolvedStatus = getResolvedStatus(p);
                  const resolvedPrice = getResolvedPrice(p);

                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-outline-variant/50 bg-white p-1 flex items-center justify-center shrink-0">
                          {resolvedImage ? (
                            <img className="w-full h-full object-contain" src={resolvedImage} alt={p.name} />
                          ) : (
                            <span className="text-[20px]">{p.glyph || '📦'}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col min-w-0 max-w-[280px]">
                          <span className="font-body-bold text-body-bold text-on-surface truncate">
                            {p.override_name ?? p.name}
                          </span>
                          {p.override_name && (
                            <span className="text-[11px] text-orange-500 font-medium truncate flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">edit_note</span>
                              Base: {p.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-body text-body text-on-surface-variant">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <span className="font-body text-body text-on-surface font-medium">
                            {resolvedPrice}
                          </span>
                          {p.override_price && (
                            <span className="text-[10px] text-orange-500 font-medium flex items-center gap-0.5">
                              Base: {p.price}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        {resolvedStatus ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            resolvedStatus === 'Hot' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            resolvedStatus === 'New' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {resolvedStatus}
                          </span>
                        ) : (
                          <span className="text-on-surface-variant/40">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleVisible(p)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                            p.visible ? 'bg-[#30D158]' : 'bg-[#E3E3E3] dark:bg-surface-container-highest'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              p.visible ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-error transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Action Status Bar */}
      {status !== 'idle' && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface border border-outline-variant rounded-xl p-3 shadow-mac-md flex items-center gap-3 animate-fade-in">
          {status === 'saving' && (
            <div className="w-4 h-4 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
          )}
          <span className={`text-[13px] font-semibold ${
            status === 'saved' ? 'text-green-600' :
            status === 'error' ? 'text-error' :
            'text-on-surface'
          }`}>
            {actionMessage}
          </span>
        </div>
      )}

      {/* Redesigned macOS-style Modal Popup */}
      {editingProduct && (
        <div className="fixed inset-0 bg-on-surface/25 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-outline-variant rounded-xl w-full max-w-[700px] h-[640px] shadow-[0_20px_50px_rgba(0,0,0,0.2),_0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col relative overflow-hidden">
            
            {/* Modal Titlebar */}
            <header className="flex justify-between items-center w-full px-6 h-12 bg-surface border-b border-outline-variant/60 shrink-0">
              <h3 className="font-window-title text-window-title text-on-surface">
                {'id' in editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setEditingProduct(null)} 
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">close</span>
              </button>
            </header>

            {/* Scrollable Modal Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-24">
              
              {/* Basic Information Section */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Basic Information</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm divide-y divide-outline-variant/30 overflow-hidden">
                  
                  {/* Name */}
                  <div className="flex items-center px-4 py-3 gap-4">
                    <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Product Name *</label>
                    <input 
                      type="text"
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      placeholder="e.g. SP PC INTEL i5 12400F"
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="flex items-center px-4 py-3 gap-4">
                    <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Category *</label>
                    <select 
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 cursor-pointer appearance-none outline-none"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <span className="material-symbols-outlined text-outline-variant text-[18px] pointer-events-none pr-1">unfold_more</span>
                  </div>

                  {/* Price & Old Price */}
                  <div className="flex divide-x divide-outline-variant/30">
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Base Price</label>
                      <input 
                        type="text"
                        value={editingProduct.price ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value || null })}
                        placeholder="e.g. 15.390.000"
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                      />
                    </div>
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-20 text-[13px] font-semibold text-on-surface shrink-0">Old Price</label>
                      <input 
                        type="text"
                        value={editingProduct.old_price ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, old_price: e.target.value || null })}
                        placeholder="e.g. 16.399.000"
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                      />
                    </div>
                  </div>

                  {/* Discount & Status */}
                  <div className="flex divide-x divide-outline-variant/30">
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Discount (%)</label>
                      <input 
                        type="number"
                        value={editingProduct.discount ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, discount: e.target.value ? Number(e.target.value) : null })}
                        placeholder="e.g. 6"
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                      />
                    </div>
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-20 text-[13px] font-semibold text-on-surface shrink-0">Status</label>
                      <select 
                        value={editingProduct.status ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, status: e.target.value || null })}
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 cursor-pointer appearance-none outline-none"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s || '— None —'}</option>)}
                      </select>
                      <span className="material-symbols-outlined text-outline-variant text-[18px] pointer-events-none pr-1">unfold_more</span>
                    </div>
                  </div>

                  {/* Tag & Glyph */}
                  <div className="flex divide-x divide-outline-variant/30">
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Tag</label>
                      <input 
                        type="text"
                        value={editingProduct.tag ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, tag: e.target.value || null })}
                        placeholder="e.g. Sales"
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                      />
                    </div>
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-20 text-[13px] font-semibold text-on-surface shrink-0">Glyph Icon</label>
                      <input 
                        type="text"
                        value={editingProduct.glyph}
                        onChange={e => setEditingProduct({ ...editingProduct, glyph: e.target.value })}
                        placeholder="e.g. 🖥"
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 outline-none"
                      />
                    </div>
                  </div>

                  {/* Accent Color & Order Index */}
                  <div className="flex divide-x divide-outline-variant/30">
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Accent Color</label>
                      <div className="flex items-center gap-2 flex-1">
                        <input 
                          type="color"
                          value={editingProduct.color}
                          onChange={e => setEditingProduct({ ...editingProduct, color: e.target.value })}
                          className="w-6 h-6 rounded border border-outline-variant/40 overflow-hidden cursor-pointer shrink-0 bg-transparent"
                        />
                        <input 
                          type="text"
                          value={editingProduct.color}
                          onChange={e => setEditingProduct({ ...editingProduct, color: e.target.value })}
                          className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 font-mono outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-20 text-[13px] font-semibold text-on-surface shrink-0">Order Index</label>
                      <input 
                        type="number"
                        value={editingProduct.order_index}
                        onChange={e => setEditingProduct({ ...editingProduct, order_index: Number(e.target.value) || 0 })}
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 outline-none"
                      />
                    </div>
                  </div>

                  {/* Link */}
                  <div className="flex items-center px-4 py-3 gap-4">
                    <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Product Link</label>
                    <input 
                      type="text"
                      value={editingProduct.link ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, link: e.target.value || null })}
                      placeholder="e.g. https://songphuong.vn/product/..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                    />
                  </div>

                </div>
              </div>

              {/* Product Visuals */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Product Visuals</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm divide-y divide-outline-variant/30 overflow-hidden">
                  <div className="flex items-center px-4 py-3 gap-4">
                    <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Image URL</label>
                    <input 
                      type="text"
                      value={editingProduct.image_url ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value || null })}
                      placeholder="e.g. https://songphuong.vn/Content/uploads/..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none font-mono"
                    />
                  </div>
                  {editingProduct.image_url && (
                    <div className="p-4 flex justify-center bg-surface-container-low/30">
                      <img src={editingProduct.image_url} alt="Base Preview" className="max-h-24 object-contain rounded-lg border border-outline-variant/40 bg-white p-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Overrides Section */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-orange-600 px-1 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">edit_note</span>
                  Overrides (Optional)
                </h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm divide-y divide-outline-variant/30 overflow-hidden">
                  
                  {/* Override Name */}
                  <div className="flex items-center px-4 py-3 gap-4">
                    <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Override Name</label>
                    <input 
                      type="text"
                      value={editingProduct.override_name ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, override_name: e.target.value || null })}
                      placeholder="Ghi đè tên hiển thị"
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                    />
                  </div>

                  {/* Override Price & Override Status */}
                  <div className="flex divide-x divide-outline-variant/30">
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Override Price</label>
                      <input 
                        type="text"
                        value={editingProduct.override_price ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, override_price: e.target.value || null })}
                        placeholder="Ghi đè giá hiển thị"
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                      />
                    </div>
                    <div className="flex items-center px-4 py-3 gap-4 flex-1">
                      <label className="w-20 text-[13px] font-semibold text-on-surface shrink-0">Override Status</label>
                      <select 
                        value={editingProduct.override_status ?? ''}
                        onChange={e => setEditingProduct({ ...editingProduct, override_status: e.target.value || null })}
                        className="w-full bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 cursor-pointer appearance-none outline-none"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s || '— None —'}</option>)}
                      </select>
                      <span className="material-symbols-outlined text-outline-variant text-[18px] pointer-events-none pr-1">unfold_more</span>
                    </div>
                  </div>

                  {/* Override Tag */}
                  <div className="flex items-center px-4 py-3 gap-4">
                    <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Override Tag</label>
                    <input 
                      type="text"
                      value={editingProduct.override_tag ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, override_tag: e.target.value || null })}
                      placeholder="Ghi đè tag hiển thị"
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none"
                    />
                  </div>

                  {/* Override Image URL */}
                  <div className="flex items-center px-4 py-3 gap-4">
                    <label className="w-28 text-[13px] font-semibold text-on-surface shrink-0">Override Image</label>
                    <input 
                      type="text"
                      value={editingProduct.override_image_url ?? ''}
                      onChange={e => setEditingProduct({ ...editingProduct, override_image_url: e.target.value || null })}
                      placeholder="Ghi đè URL ảnh"
                      className="flex-1 bg-transparent border-none focus:ring-0 text-[13px] text-on-surface p-0 placeholder:text-outline-variant/50 outline-none font-mono"
                    />
                  </div>
                  {editingProduct.override_image_url && (
                    <div className="p-4 flex justify-center bg-surface-container-low/30">
                      <img src={editingProduct.override_image_url} alt="Override Preview" className="max-h-24 object-contain rounded-lg border border-outline-variant/40 bg-white p-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Display Switch Section */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-on-surface-variant px-1 uppercase tracking-wider">Availability & Visibility</h4>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-on-surface">Visible on Homepage</span>
                    <span className="text-[11px] text-on-surface-variant">Toggle whether this product is displayed in the Finder app catalog.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, visible: !editingProduct.visible })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      editingProduct.visible ? 'bg-[#30D158]' : 'bg-[#E3E3E3] dark:bg-surface-container-highest'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        editingProduct.visible ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Sticky Footer Actions */}
            <footer className="absolute bottom-0 right-0 w-full h-16 bg-surface/90 backdrop-blur-md border-t border-outline-variant/60 px-6 flex items-center justify-end gap-3 z-30">
              <button 
                onClick={() => setEditingProduct(null)} 
                className="px-5 py-1.5 font-semibold text-[13px] text-on-surface-variant hover:bg-surface-container-high rounded-md transition-colors border border-outline-variant/50 bg-surface-container-lowest"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={status === 'saving'}
                className="px-5 py-1.5 font-bold text-[13px] text-on-primary bg-primary hover:bg-primary-container active:scale-95 rounded-md shadow-md shadow-primary/20 transition-all disabled:opacity-50"
              >
                {status === 'saving' ? 'Saving...' : 'Save Changes'}
              </button>
            </footer>

          </div>
        </div>
      )}

      {/* CSS Animation keyframe for modal fade-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
      
    </div>
  );
};
