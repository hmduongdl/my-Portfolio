import type { Product, ProductCategory } from '../types/product';

interface ProductRow {
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
  visible: boolean;
  order_index: number;
}

function parsePrice(raw: string | null): number {
  if (!raw) return 0;
  const n = parseInt(raw.replace(/\D/g, ''), 10);
  return isNaN(n) ? 0 : n;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category as ProductCategory,
    price: parsePrice(row.price),
    old_price: row.old_price ? parsePrice(row.old_price) : undefined,
    image_url: row.image_url ?? '',
    product_url: row.link ?? '',
    glyph: row.glyph || undefined,
    status: (row.status as Product['status']) ?? null,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const rows: ProductRow[] = await res.json();
  return rows.filter((r) => r.visible).map(rowToProduct);
}
