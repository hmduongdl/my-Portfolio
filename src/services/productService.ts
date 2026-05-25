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
  glyph: string | null;
  status: string | null;
  visible?: boolean;
}

function parsePrice(raw: string | null): number {
  if (!raw) return 0;
  const n = parseInt(raw.replace(/\D/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function toProduct(raw: ApiProduct): Product {
  const oldPriceVal = raw.oldPrice !== undefined && raw.oldPrice !== null ? raw.oldPrice : raw.old_price;
  const imageUrlVal = raw.imageUrl !== undefined && raw.imageUrl !== null ? raw.imageUrl : raw.image_url;
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category as ProductCategory,
    price: parsePrice(raw.price),
    old_price: oldPriceVal ? parsePrice(oldPriceVal) : undefined,
    image_url: imageUrlVal ?? '',
    product_url: raw.link ?? '',
    glyph: raw.glyph ?? undefined,
    status: (raw.status as Product['status']) ?? null,
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
