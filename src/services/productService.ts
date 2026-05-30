import type { Product, ProductCategory } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiProduct {
  id: number;
  name: string;
  category: string;
  price: string | null;
  oldPrice?: string | null;
  imageUrl?: string | null;
  link: string | null;
  glyph: string | null;
  status: string | null;
  visible?: boolean;
  color?: string | null;
  discount?: number | string | null;
}

function parsePrice(raw: string | number | null | undefined): number {
  if (raw === undefined || raw === null) return 0;
  if (typeof raw === 'number') return raw;
  const n = parseInt(raw.replace(/\D/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function parsePriceOrString(raw: string | number | null | undefined): number | string {
  if (raw === undefined || raw === null) return 0;
  if (typeof raw === 'number') return raw;
  const clean = raw.trim();
  const digits = clean.replace(/\D/g, '');
  if (digits === '') {
    return clean;
  }
  const n = parseInt(digits, 10);
  return isNaN(n) ? 0 : n;
}

function toProduct(raw: ApiProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category as ProductCategory,
    price: parsePriceOrString(raw.price),
    oldPrice: raw.oldPrice ? parsePrice(raw.oldPrice) : undefined,
    discount: raw.discount !== undefined && raw.discount !== null ? Number(raw.discount) : null,
    imageUrl: raw.imageUrl ?? '',
    link: raw.link || '',
    color: raw.color || '#3B82F6',
    glyph: raw.glyph || '📦',
    status: (raw.status as Product['status']) ?? null,
    visible: raw.visible === undefined ? true : raw.visible,
  };
}

const cache: Record<string, any> = {};
const pending: Record<string, Promise<any> | undefined> = {};

if (typeof window !== 'undefined') {
  window.addEventListener('products-updated', () => {
    delete cache.products_vn;
    delete cache.products_en;
    delete pending.products_vn;
    delete pending.products_en;
  });
}

export const productService = {
  async getProducts(lang: 'en' | 'vn' = 'vn'): Promise<Product[]> {
    const key = `products_${lang}`;
    if (cache[key]) return cache[key];
    if (pending[key]) return pending[key];

    pending[key] = fetch(`${API_BASE_URL}/products?lang=${lang}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiProduct[] = await response.json();
        const mapped = data.filter((r) => r.visible !== false).map(toProduct);
        cache[key] = mapped;
        return mapped;
      })
      .catch((error) => {
        console.error('Failed to fetch products from SQL DB:', error);
        throw error;
      })
      .finally(() => {
        delete pending[key];
      });

    return pending[key];
  },

  getCachedProducts(lang: 'en' | 'vn' = 'vn'): Product[] | null {
    return cache[`products_${lang}`] || null;
  },

  clearCache() {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
};
