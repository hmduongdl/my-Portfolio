export const PRODUCT_CATEGORIES = [
  'PC Gaming',
  'Office PC',
  'Laptop',
  'Linh kiện máy tính',
  'Gaming Gear',
  'Keyboard',
  'Audio',
  'Other',
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const PRODUCT_CATEGORY_META: Record<ProductCategory, { icon: string; color: string; labelVn: string }> = {
  'PC Gaming': { icon: '🖥', color: '#3B82F6', labelVn: 'PC Gaming cấu hình cao' },
  'Office PC': { icon: '▦', color: '#6B7280', labelVn: 'Máy tính văn phòng' },
  Laptop: { icon: '💻', color: '#8B5CF6', labelVn: 'Laptop' },
  'Linh kiện máy tính': { icon: '▤', color: '#10B981', labelVn: 'Linh kiện máy tính' },
  'Gaming Gear': { icon: '🎮', color: '#F59E0B', labelVn: 'Gaming Gear' },
  Keyboard: { icon: '⌨', color: '#EC4899', labelVn: 'Bàn phím' },
  Audio: { icon: '🎧', color: '#06B6D4', labelVn: 'Thiết bị âm thanh' },
  Other: { icon: '📦', color: '#64748B', labelVn: 'Khác' },
};

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = 'PC Gaming';

const LEGACY_PRODUCT_CATEGORY_ALIASES: Record<string, ProductCategory> = {
  VGA: 'Linh kiện máy tính',
  'Computer Components': 'Linh kiện máy tính',
};

export function normalizeProductCategory(value: string | null | undefined): ProductCategory {
  if (!value) return DEFAULT_PRODUCT_CATEGORY;
  if (PRODUCT_CATEGORIES.includes(value as ProductCategory)) return value as ProductCategory;
  return LEGACY_PRODUCT_CATEGORY_ALIASES[value] ?? DEFAULT_PRODUCT_CATEGORY;
}
