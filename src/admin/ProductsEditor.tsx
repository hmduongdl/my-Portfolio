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
  name: '', category: 'PC Gaming', tag: null, price: null, old_price: null,
  discount: null, image_url: null, link: null, color: '#3B82F6', glyph: '📦',
  status: null, override_name: null, override_price: null, override_image_url: null,
  override_status: null, override_tag: null, visible: true, order_index: 0,
};

const Input: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; mono?: boolean; type?: string;
}> = ({ label, value, onChange, placeholder, mono, type = 'text' }) => (
  <div>
    <label className="text-xs text-gray-500 block mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors ${mono ? 'font-mono' : ''}`}
    />
  </div>
);

const Select: React.FC<{
  label: string; value: string; onChange: (v: string) => void; options: string[];
}> = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-xs text-gray-500 block mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
    >
      {options.map((o) => <option key={o} value={o}>{o || '— None —'}</option>)}
    </select>
  </div>
);

export const ProductsEditor: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.get<Product[]>('/products')
      .then((d) => setProducts(d ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openEdit = (p: Product) => {
    setIsNew(false);
    setEditId(p.id);
    setForm({ ...p });
  };

  const openNew = () => {
    setIsNew(true);
    setEditId(null);
    setForm({ ...EMPTY_FORM });
  };

  const closeModal = () => { setEditId(null); setIsNew(false); };

  const setF = (k: keyof typeof form) => (v: string | boolean | number | null) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.category) return;
    setSaving(true);
    try {
      if (isNew) {
        await api.post('/products', form);
      } else {
        await api.put(`/products/${editId}`, form);
      }
      closeModal();
      load();
    } catch (err) {
      alert(`Lỗi: ${String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xoá sản phẩm này?')) return;
    setDeleteId(id);
    try {
      await api.del(`/products/${id}`);
      setProducts((ps) => ps.filter((p) => p.id !== id));
    } catch (err) {
      alert(`Lỗi: ${String(err)}`);
    } finally {
      setDeleteId(null);
    }
  };

  const showModal = isNew || editId !== null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} sản phẩm · Hỗ trợ override giá, ảnh, tên
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 2v12M2 8h12"/>
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-8">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          Đang tải...
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Sản phẩm', 'Danh mục', 'Giá', 'Status', 'Hiển thị', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-600">
                      Chưa có sản phẩm. Nhấn "Thêm sản phẩm" để bắt đầu.
                    </td>
                  </tr>
                ) : products.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        {p.image_url && (
                          <img
                            src={p.override_image_url ?? p.image_url}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover bg-gray-800 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate max-w-[200px]">
                            {p.override_name ?? p.name}
                          </p>
                          {p.override_name && (
                            <p className="text-xs text-orange-400 truncate max-w-[200px]">
                              ↳ override: {p.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="text-white">{p.override_price ?? p.price ?? '—'}</span>
                      {p.override_price && (
                        <span className="text-xs text-orange-400 block">↳ override</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {(p.override_status ?? p.status) ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          (p.override_status ?? p.status) === 'Hot' ? 'bg-red-900/50 text-red-400' :
                          (p.override_status ?? p.status) === 'New' ? 'bg-green-900/50 text-green-400' :
                          'bg-yellow-900/50 text-yellow-400'
                        }`}>
                          {p.override_status ?? p.status}
                        </span>
                      ) : <span className="text-gray-700">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${p.visible ? 'text-green-400' : 'text-gray-600'}`}>
                        {p.visible ? '● Hiện' : '○ Ẩn'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-md transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleteId === p.id}
                          className="px-2.5 py-1 bg-red-900/40 hover:bg-red-900/70 text-red-400 text-xs rounded-md transition-colors disabled:opacity-40"
                        >
                          Xoá
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">
                {isNew ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 2l12 12M14 2L2 14"/>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Base data */}
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dữ liệu gốc</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Input label="Tên sản phẩm *" value={form.name} onChange={setF('name')} />
                </div>
                <Select label="Danh mục *" value={form.category} onChange={setF('category')} options={CATEGORIES} />
                <Select label="Status" value={form.status ?? ''} onChange={(v) => setF('status')(v || null)} options={STATUSES} />
                <Input label="Giá" value={form.price ?? ''} onChange={(v) => setF('price')(v || null)} placeholder="VD: 12.990.000đ" />
                <Input label="Giá gốc" value={form.old_price ?? ''} onChange={(v) => setF('old_price')(v || null)} placeholder="VD: 14.990.000đ" />
                <Input label="Tag" value={form.tag ?? ''} onChange={(v) => setF('tag')(v || null)} placeholder="Hot, New, Sale..." />
                <Input label="Glyph (emoji icon)" value={form.glyph} onChange={setF('glyph')} placeholder="📦" />
                <div className="col-span-2">
                  <Input label="URL ảnh" value={form.image_url ?? ''} onChange={(v) => setF('image_url')(v || null)} mono placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <Input label="Link sản phẩm" value={form.link ?? ''} onChange={(v) => setF('link')(v || null)} mono placeholder="https://songphuong.vn/..." />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setF('color')(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer"
                  />
                  <label className="text-xs text-gray-500">Accent color</label>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-500">Hiển thị</label>
                  <button
                    type="button"
                    onClick={() => setF('visible')(!form.visible)}
                    className={`relative w-10 rounded-full transition-colors ${form.visible ? 'bg-blue-600' : 'bg-gray-700'}`}
                    style={{ height: '22px' }}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.visible ? 'left-[22px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Override section */}
              <div className="border-t border-gray-800 pt-4">
                <p className="text-xs text-orange-400 font-medium uppercase tracking-wider mb-3">
                  Override (ghi đè — để trống = dùng giá trị gốc)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Input label="Tên override" value={form.override_name ?? ''} onChange={(v) => setF('override_name')(v || null)} />
                  </div>
                  <Input label="Giá override" value={form.override_price ?? ''} onChange={(v) => setF('override_price')(v || null)} />
                  <Select label="Status override" value={form.override_status ?? ''} onChange={(v) => setF('override_status')(v || null)} options={STATUSES} />
                  <div className="col-span-2">
                    <Input label="URL ảnh override" value={form.override_image_url ?? ''} onChange={(v) => setF('override_image_url')(v || null)} mono />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-800">
              <button onClick={closeModal} className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.category}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {saving ? 'Đang lưu...' : isNew ? 'Thêm sản phẩm' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
