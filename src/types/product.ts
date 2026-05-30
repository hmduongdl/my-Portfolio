import type { ProductCategory } from '../constants/productCategories';

export type { ProductCategory } from '../constants/productCategories';
export { DEFAULT_PRODUCT_CATEGORY, PRODUCT_CATEGORIES, PRODUCT_CATEGORY_META } from '../constants/productCategories';

export interface Product {
  id: string | number;
  name: string;
  category: ProductCategory;
  price: number | string;   // Giá bán thực tế nhận từ SQL (hỗ trợ cả chuỗi như 'Liên hệ')
  oldPrice?: number;    // Chuyển từ old_price -> oldPrice
  imageUrl: string;     // Chuyển từ image_url -> imageUrl
  link: string;         // Chuyển từ product_url -> link
  glyph?: string;       // Icon emoji đại diện cho danh mục (nếu có)
  status?: 'New' | 'Hot' | 'Sale' | null;
  discount?: number | null;
  color?: string;
  visible?: boolean;
  updatedAt?: string;
}
