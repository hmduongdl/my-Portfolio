import React, { useEffect, useMemo, useState } from 'react';
import { SEOHead } from '../components/shared/SEOHead';
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_META } from '../constants/productCategories';
import { productService } from '../services/productService';
import type { Product, ProductCategory } from '../types/product';

function formatPrice(price: Product['price']): string {
  if (typeof price === 'string') {
    const clean = price.trim();
    return clean && clean !== '0' ? clean : 'Liên hệ';
  }

  if (!Number.isFinite(price) || price <= 0) return 'Liên hệ';
  return `${new Intl.NumberFormat('vi-VN').format(price)} đ`;
}

function getProductUrl(product: Product): string {
  return product.link || `https://songphuong.vn/?s=${encodeURIComponent(product.name)}`;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <article className="overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50">
    <a href={getProductUrl(product)} target="_blank" rel="noopener noreferrer" className="block">
      <div className="aspect-square bg-white p-4">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center rounded-lg text-5xl text-white"
            style={{ backgroundColor: product.color || PRODUCT_CATEGORY_META[product.category]?.color }}
          >
            {product.glyph || PRODUCT_CATEGORY_META[product.category]?.icon || '📦'}
          </div>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-300">
            {PRODUCT_CATEGORY_META[product.category]?.labelVn || product.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-snug text-white">{product.name}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-emerald-300">{formatPrice(product.price)}</span>
          {product.status && (
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-zinc-300">
              {product.status}
            </span>
          )}
        </div>
      </div>
    </a>
  </article>
);

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    productService.getProducts('vn')
      .then((data) => {
        if (!active) return;
        setProducts(data);
        setLoadError(null);
      })
      .catch((error) => {
        console.error('Không thể tải dữ liệu sản phẩm từ API.', error);
        if (active) setLoadError('Không thể tải dữ liệu sản phẩm từ database.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const groupedProducts = useMemo(
    () =>
      PRODUCT_CATEGORIES.map((category) => ({
        category,
        products: products.filter((product) => product.category === category),
      })).filter((section) => section.products.length > 0),
    [products],
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8 lg:px-10">
      <SEOHead
        title="Sản phẩm máy tính Song Phương — PC Gaming, Laptop, Linh kiện"
        description="Danh sách sản phẩm máy tính, PC Gaming, laptop, linh kiện và gaming gear tại Song Phương Technology, được lấy từ dữ liệu quản trị sản phẩm."
      />
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Sản phẩm Song Phương</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Sản phẩm máy tính, PC Gaming, Laptop & Linh kiện
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
            Trang sản phẩm riêng cho Song Phương Technology, tách khỏi trang dự án để tránh trùng URL SEO và giúp công cụ tìm kiếm thu thập đúng nội dung sản phẩm.
          </p>
        </header>

        <div className="mt-10 space-y-12">
          {isLoading && (
            <p className="text-sm text-zinc-400">Đang tải dữ liệu sản phẩm...</p>
          )}

          {!isLoading && loadError && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && products.length === 0 && (
            <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
              Chưa có sản phẩm nào được bật hiển thị trong admin.
            </p>
          )}

          {groupedProducts.map((section) => (
            <section key={section.category} aria-labelledby={`products-${section.category}`}>
              <div className="mb-5">
                <h2 id={`products-${section.category}`} className="text-2xl font-semibold text-white">
                  {PRODUCT_CATEGORY_META[section.category as ProductCategory]?.labelVn || section.category}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {section.products.length} sản phẩm trong danh mục {section.category}.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
