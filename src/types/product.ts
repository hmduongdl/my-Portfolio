export type ProductCategory = 'PC Gaming' | 'Office PC' | 'Laptop' | 'VGA' | 'Gaming Gear' | 'Keyboard' | 'Audio';

export interface Product {
  id: string | number;
  name: string;
  category: ProductCategory;
  price: number;        // Giá bán thực tế nhận từ SQL
  old_price?: number;   // Giá gốc từ SQL để hiển thị giảm giá (nullable)
  image_url: string;    // URL ảnh sản phẩm
  product_url: string;  // Link dẫn tới chi tiết sản phẩm trên songphuong.vn
  glyph?: string;       // Icon emoji đại diện cho danh mục (nếu có)
  status?: 'New' | 'Hot' | 'Sale' | null;
}
