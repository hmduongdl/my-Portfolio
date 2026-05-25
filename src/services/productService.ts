import type { Product, ProductCategory } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiProduct {
  id: number;
  name: string;
  category: string;
  price: string | null;
  oldPrice?: string | null;
  old_price?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  link: string | null;
  product_url?: string | null;
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

function toProduct(raw: ApiProduct): Product {
  const oldPriceVal = raw.old_price !== undefined && raw.old_price !== null ? raw.old_price : raw.oldPrice;
  const imageUrlVal = raw.image_url !== undefined && raw.image_url !== null ? raw.image_url : raw.imageUrl;
  
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category as ProductCategory,
    price: parsePrice(raw.price),
    oldPrice: oldPriceVal ? parsePrice(oldPriceVal) : undefined,
    discount: raw.discount !== undefined && raw.discount !== null ? Number(raw.discount) : null,
    imageUrl: imageUrlVal ?? '',
    link: raw.link || raw.product_url || '',
    color: raw.color || '#3B82F6',
    glyph: raw.glyph || '📦',
    status: (raw.status as Product['status']) ?? null,
    visible: raw.visible === undefined ? true : raw.visible,
  };
}

export const productService = {
  async getProducts(lang: 'en' | 'vn' = 'vn'): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products?lang=${lang}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: ApiProduct[] = await response.json();
      return data.filter((r) => r.visible !== false).map(toProduct);
    } catch (error) {
      console.error('Failed to fetch products from SQL DB:', error);
      throw error;
    }
  },
};
