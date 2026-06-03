import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Simple custom Vite plugin for prerendering static routes
function prerenderPlugin() {
  return {
    name: 'vite-plugin-prerender-custom',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const routes = ['/about', '/san-pham', '/du-an', '/album'];

      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.warn('prerenderPlugin: dist/index.html not found, skipping prerender.');
        return;
      }

      const indexHtml = fs.readFileSync(indexPath, 'utf-8');

      // Static content injection for SEO crawlers (so they see text immediately)
      const seoContents: Record<string, string> = {
        '/about': `
          <main class="min-h-screen bg-zinc-950 text-zinc-100">
            <article class="max-w-4xl mx-auto px-4 py-12">
              <header class="pt-16 sm:pt-20">
                <p class="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Giới thiệu cá nhân</p>
                <h1 class="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Hoàng Minh Dương (Dương Song Phương) — Lập trình viên Web tại Đà Lạt
                </h1>
                <p class="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
                  Tôi tập trung xây dựng giao diện web hiện đại, hệ thống quản trị nội dung và trải nghiệm số có cấu trúc rõ ràng cho Song Phương Technology.
                </p>
              </header>
              <div class="mt-12 space-y-12">
                <section>
                  <h2 class="text-2xl font-semibold text-white">Về bản thân tôi</h2>
                  <div class="mt-4 space-y-4 text-base leading-8 text-zinc-300">
                    <p>Hoàng Minh Dương, còn được biết đến với tên Dương Song Phương, là lập trình viên web đang làm việc tại Đà Lạt. Tôi quan tâm đến cách một sản phẩm số được thiết kế, vận hành và tối ưu để người dùng có thể sử dụng dễ dàng trong công việc hằng ngày.</p>
                  </div>
                </section>
              </div>
            </article>
          </main>
        `,
        '/san-pham': `
          <main class="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8 lg:px-10">
            <div class="mx-auto max-w-7xl">
              <header class="border-b border-white/10 pb-8">
                <p class="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Sản phẩm Song Phương</p>
                <h1 class="mt-4 max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Sản phẩm máy tính, PC Gaming, Laptop & Linh kiện
                </h1>
                <p class="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
                  Trang sản phẩm riêng cho Song Phương Technology, tách khỏi trang dự án để công cụ tìm kiếm thu thập đúng nội dung sản phẩm từ dữ liệu quản trị.
                </p>
              </header>
              <section class="mt-10">
                <h2 class="text-2xl font-semibold text-white">Danh mục sản phẩm máy tính Song Phương</h2>
                <p class="mt-3 max-w-3xl text-base leading-7 text-zinc-300">
                  PC Gaming, laptop, linh kiện máy tính và gaming gear được quản lý từ hệ thống admin.
                </p>
              </section>
            </div>
          </main>
        `,
        '/du-an': `
          <main class="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8 lg:px-10">
            <div class="mx-auto max-w-6xl">
              <header class="border-b border-white/10 pb-8">
                <p class="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Portfolio SEO</p>
                <h1 class="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Dự án & Portfolio — Hoàng Minh Dương | Song Phương Technology
                </h1>
                <p class="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
                  Danh sách dự án lập trình, thiết kế UI/UX và công cụ hệ thống được trình bày dạng nội dung tĩnh, rõ chữ và dễ thu thập dữ liệu cho công cụ tìm kiếm.
                </p>
              </header>
            </div>
          </main>
        `,
        '/album': `
          <main class="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8 lg:px-10">
            <div class="mx-auto max-w-7xl">
              <header class="border-b border-white/10 pb-8">
                <p class="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Album SEO Google Images</p>
                <h1 class="mt-4 max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Thư viện Hình ảnh & Album Trưng Bày — Song Phương Technology
                </h1>
                <p class="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
                  Bộ sưu tập hình ảnh được trình bày bằng cấu trúc HTML5 semantic, hiển thị trực tiếp tiêu đề, chú thích và alt text để hỗ trợ Google Images thu thập dữ liệu.
                </p>
              </header>
            </div>
          </main>
        `
      };

      for (const route of routes) {
        const routeDir = path.join(outDir, route.replace('/', ''));
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }

        let pageHtml = indexHtml;
        const seoText = seoContents[route];
        if (seoText && pageHtml.includes('<div id="root"></div>')) {
          pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${seoText}</div>`);
        }

        fs.writeFileSync(path.join(routeDir, 'index.html'), pageHtml, 'utf-8');
        console.log(`Prerendered: ${path.relative(outDir, path.join(routeDir, 'index.html'))}`);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), prerenderPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }

          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/@remix-run')) {
            return 'router';
          }

          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }

          if (id.includes('node_modules/zustand')) {
            return 'state';
          }
        },
      },
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
