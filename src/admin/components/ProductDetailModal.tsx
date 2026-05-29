import React, { useMemo, useState } from 'react';
import { api } from '../api';

type ProductStatus = 'New' | 'Hot' | 'Sale';
type PriceMode = 'contact' | 'number';

interface ProductRecord {
  id?: number | string;
  name?: string | null;
  category?: string | null;
  tag?: string | null;
  price?: string | number | null;
  old_price?: string | number | null;
  oldPrice?: string | number | null;
  discount?: number | string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  link?: string | null;
  color?: string | null;
  glyph?: string | null;
  status?: ProductStatus | string | null;
  visible?: boolean | null;
  order_index?: number | string | null;
  orderIndex?: number | string | null;
}

interface ProductDetailModalProps {
  product: ProductRecord | null;
  onClose: () => void;
  onSave: () => void;
}

interface ProductFormState {
  name: string;
  category: string;
  glyph: string;
  status: ProductStatus | '';
  order_index: number;
  visible: boolean;
  priceMode: PriceMode;
  price: string;
  old_price: string;
  image_url: string;
  link: string;
}

const CATEGORIES = ['PC Gaming', 'Office PC', 'Laptop', 'VGA', 'Gaming Gear', 'Keyboard', 'Audio'];
const STATUSES: Array<ProductStatus | ''> = ['', 'New', 'Hot', 'Sale'];
const GLYPHS = ['🖥', '💻', '⌨', '🎧', '🎮', '🧩', '⚡', '📦'];

function valueToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function parseNumber(value: string): number | null {
  const normalized = value.replace(/[^\d.-]/g, '');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function initialState(product: ProductRecord | null): ProductFormState {
  const rawPrice = valueToString(product?.price);
  const isContactPrice = !product || rawPrice.trim().toLowerCase() === 'liên hệ';

  return {
    name: valueToString(product?.name),
    category: valueToString(product?.category) || 'PC Gaming',
    glyph: valueToString(product?.glyph) || '🖥',
    status: (product?.status === 'New' || product?.status === 'Hot' || product?.status === 'Sale') ? product.status : '',
    order_index: Number(product?.order_index ?? product?.orderIndex ?? 0) || 0,
    visible: product?.visible !== false,
    priceMode: isContactPrice ? 'contact' : 'number',
    price: isContactPrice ? '' : rawPrice,
    old_price: valueToString(product?.old_price ?? product?.oldPrice),
    image_url: valueToString(product?.image_url ?? product?.imageUrl),
    link: valueToString(product?.link),
  };
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState<ProductFormState>(() => initialState(product));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const currentPrice = useMemo(() => parseNumber(form.price), [form.price]);
  const oldPrice = useMemo(() => parseNumber(form.old_price), [form.old_price]);
  const discount = useMemo(() => {
    if (form.priceMode !== 'number' || currentPrice === null || oldPrice === null) return null;
    if (oldPrice <= currentPrice || currentPrice <= 0) return null;
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  }, [currentPrice, form.priceMode, oldPrice]);

  const updateForm = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Tên sản phẩm là bắt buộc.');
      return;
    }

    if (!form.category.trim()) {
      setError('Danh mục là bắt buộc.');
      return;
    }

    if (form.priceMode === 'number' && currentPrice === null) {
      setError('Vui lòng nhập giá bán hiện tại hợp lệ.');
      return;
    }

    const payload = {
      ...(product?.id ? { id: product.id } : {}),
      name: form.name.trim(),
      category: form.category,
      tag: null,
      price: form.priceMode === 'contact' ? 'Liên hệ' : String(currentPrice),
      old_price: form.priceMode === 'contact' ? null : (oldPrice !== null ? String(oldPrice) : null),
      discount,
      image_url: form.image_url.trim() || null,
      link: form.link.trim() || null,
      color: '#3B82F6',
      glyph: form.glyph.trim() || '🖥',
      status: form.status || null,
      override_name: null,
      override_price: null,
      override_image_url: null,
      override_status: null,
      override_tag: null,
      visible: form.visible,
      order_index: form.order_index,
    };

    setIsSaving(true);
    setError('');

    try {
      if (product?.id) {
        await api.put('/admin/products', payload);
      } else {
        await api.post('/admin/products', payload);
      }

      window.dispatchEvent(new Event('products-updated'));
      onSave();
      onClose();
    } catch (err) {
      console.error('Failed to save product:', err);
      setError(err instanceof Error ? err.message : 'Không thể lưu sản phẩm.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/30 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-[900px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-outline-variant/60 px-6">
          <div>
            <h3 className="text-[16px] font-bold text-on-surface">
              {product?.id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
            </h3>
            <p className="text-[12px] text-on-surface-variant">Song Phương Technology Product Finder</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
            aria-label="Đóng modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <section className="space-y-4 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wide text-on-surface-variant">Thông tin cơ bản</h4>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Tên sản phẩm</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={event => updateForm('name', event.target.value)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="SP PC Gaming i5 RTX 4060"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Danh mục</span>
                <select
                  value={form.category}
                  onChange={event => updateForm('category', event.target.value)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <div>
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Emoji đại diện</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.glyph}
                    onChange={event => updateForm('glyph', event.target.value)}
                    className="h-10 w-16 rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 text-center text-[20px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                    aria-label="Emoji đại diện"
                  />
                  <div className="flex flex-wrap gap-1">
                    {GLYPHS.map(glyph => (
                      <button
                        key={glyph}
                        type="button"
                        onClick={() => updateForm('glyph', glyph)}
                        className={`h-10 w-10 rounded-lg border text-[18px] transition ${
                          form.glyph === glyph
                            ? 'border-primary bg-primary/10'
                            : 'border-outline-variant/50 bg-surface-container-low hover:bg-surface-container-high'
                        }`}
                      >
                        {glyph}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Trạng thái nhãn</span>
                <select
                  value={form.status}
                  onChange={event => updateForm('status', event.target.value as ProductStatus | '')}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {STATUSES.map(status => (
                    <option key={status || 'none'} value={status}>{status || 'Không có'}</option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-[1fr_auto] items-end gap-4">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Thứ tự hiển thị</span>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={event => updateForm('order_index', Number(event.target.value) || 0)}
                    className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => updateForm('visible', !form.visible)}
                  className="mb-[1px] flex h-10 items-center gap-2 rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 text-[12px] font-semibold text-on-surface"
                >
                  <span className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${form.visible ? 'bg-[#30D158]' : 'bg-[#B8B8B8]'}`}>
                    <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.visible ? 'translate-x-4' : 'translate-x-0'}`} />
                  </span>
                  Hiển thị lên Finder
                </button>
              </div>
            </section>

            <section className="space-y-4 rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wide text-on-surface-variant">Giá bán & Liên kết</h4>

              <div>
                <span className="mb-2 block text-[12px] font-semibold text-on-surface-variant">Cơ chế chọn giá</span>
                <div className="grid grid-cols-2 rounded-lg border border-outline-variant/60 bg-surface-container-low p-1">
                  {(['contact', 'number'] as PriceMode[]).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => updateForm('priceMode', mode)}
                      className={`rounded-md px-3 py-1.5 text-[12px] font-bold transition ${
                        form.priceMode === mode ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {mode === 'contact' ? 'Liên hệ' : 'Nhập giá số'}
                    </button>
                  ))}
                </div>
              </div>

              {form.priceMode === 'contact' ? (
                <div className="rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-[13px] font-semibold text-on-surface-variant">
                  price = "Liên hệ"
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Giá bán hiện tại</span>
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={event => updateForm('price', event.target.value)}
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="15390000"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Giá bán cũ</span>
                    <input
                      type="number"
                      min="0"
                      value={form.old_price}
                      onChange={event => updateForm('old_price', event.target.value)}
                      className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="16390000"
                    />
                  </label>

                  <div className="min-h-6 rounded-md bg-surface-container-low px-3 py-1.5 text-[12px] font-semibold text-on-surface-variant">
                    {discount ? `Discount tự động: ${discount}%` : 'Discount sẽ hiển thị khi old_price > price.'}
                  </div>
                </div>
              )}

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Đường dẫn ảnh sản phẩm</span>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={event => updateForm('image_url', event.target.value)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="https://songphuong.vn/..."
                />
              </label>

              {form.image_url.trim() && (
                <div className="flex h-28 items-center justify-center rounded-lg border border-outline-variant/50 bg-white p-2">
                  <img
                    src={form.image_url}
                    alt="Product preview"
                    className="max-h-full max-w-full object-contain"
                    onError={event => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-on-surface-variant">Đường dẫn chi tiết sản phẩm</span>
                <input
                  type="url"
                  value={form.link}
                  onChange={event => updateForm('link', event.target.value)}
                  className="w-full rounded-lg border border-outline-variant/60 bg-surface-container-low px-3 py-2 text-[13px] text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="https://songphuong.vn/..."
                />
              </label>
            </section>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>

        <footer className="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-outline-variant/60 bg-surface/95 px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-outline-variant/60 bg-surface-container-lowest px-5 py-2 text-[13px] font-semibold text-on-surface-variant transition hover:bg-surface-container-high"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-primary px-5 py-2 text-[13px] font-bold text-on-primary shadow-md shadow-primary/20 transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProductDetailModal;
