# Portfolio macOS — Lộ trình phát triển

> **Trạng thái hiện tại**: Design system macOS đã được build hoàn chỉnh (Window, Dock, MenuBar, Wallpaper, iOS view). Vấn đề cốt lõi là toàn bộ nội dung vẫn là **placeholder data** (Aurora 14, Tsumugi Reader…) thay vì dữ liệu thực của Song Phương Technology và Hoàng Minh Dương.

---

## Tổng quan kiến trúc hiện tại

```
src/
├── apps/            ← 5 app window: Finder, About, Projects, Mail, Welcome
├── components/
│   ├── desktop/     ← Window, MenuBar, Dock, Wallpaper, TweaksPanel
│   └── mobile/      ← IOSView, IOSFrame, MobilePreview
├── store/           ← Zustand state (window management, tweaks)
├── styles/          ← Design tokens CSS variables
├── types/           ← TypeScript interfaces
└── hooks/           ← useWindowDragResize
```

**Những gì đã có sẵn (không cần làm lại):**
- ✅ macOS Window drag/resize 8 hướng
- ✅ Dock với icon magnification
- ✅ MenuBar với time/status
- ✅ Traffic lights (close/min/max)
- ✅ Vibrancy/frosted glass effects
- ✅ iOS mobile view
- ✅ Zustand state management
- ✅ Design token system (Tailwind + CSS variables)
- ✅ Window style switcher (Sonoma/BigSur/Monterey)

**Những gì cần làm:**
- ❌ Dữ liệu thực (cá nhân + sản phẩm)
- ❌ Ảnh thực (avatar, products)
- ❌ i18n EN/VN
- ❌ Social links thực
- ❌ Deploy config

---

## Data từ frontend cũ có thể tái sử dụng

### Sản phẩm thực (src/data/products.ts cũ — commit `e93b5a3`)
| Danh mục | Sản phẩm |
|---|---|
| PC Gaming | SP PC INTEL i5 12400F, SP PC INTEL i5 14400F RTX 5060 |
| Office PC | SP PC AMD 3200G |
| Laptop | Acer Aspire Lite 14 |
| VGA | Colorful iGame RTX 5060 TI Ultra W |
| Gaming Gear | Machenike L8 Pro mouse, Machenike G3 V2 gamepad |
| Bàn phím | Xiberia CZ98 Black Gradient |
| Loa | Thonet & Vander KUMPEL 2.0 |

### Thông tin cá nhân (translations cũ)
- **Tên**: Hoàng Minh Dương
- **Vai trò**: IT Student at Dalat University + Web Developer tại Song Phương Technology
- **Kinh nghiệm**:
  - Education: Da Lat University (Aug 2025 - 2029)
  - Web Developer: Song Phương Technology (Mar 2025 - hiện tại)
  - 2D Graphic Designer: Freelance
- **i18n**: Đã có EN/VN cho nav, about, experience, contact

---

## Phase 1 — Cá nhân hóa dữ liệu cơ bản

**Thời gian ước tính: 1–2 ngày**
**File chính: `src/apps/About.tsx`, `src/apps/index.tsx`**

### 1.1 Cập nhật About.tsx
- [ ] Thay "Song Phương Dev" → "Hoàng Minh Dương"
- [ ] Thay "Product Designer · Developer" → "Web Developer · IT Student"
- [ ] Thay "Song Phương Technology" → URL link đến songphuong.vn
- [ ] Thay avatar placeholder "SP" → dùng ảnh `public/images/profile/my-avatar.jpg`
- [ ] Cập nhật tech stack cho đúng với stack thực tế
- [ ] Thêm section "Experience" với 3 mốc từ dữ liệu cũ

```tsx
// Mẫu tech stack thực
const tech = [
  { k: 'Frontend', v: 'React · TypeScript · Tailwind · Vite' },
  { k: 'Backend', v: 'Node.js · PHP · MySQL' },
  { k: 'Design', v: 'Figma · Photoshop · Illustrator' },
  { k: 'Tools', v: 'Git · Vercel · VS Code' },
];
```

### 1.2 Cập nhật social links (src/apps/index.tsx)
- [ ] Điền URL GitHub thực
- [ ] Điền URL Facebook thực
- [ ] Điền email thực thay `hello@yourname.dev`
- [ ] Điền số điện thoại thực thay `+84`
- [ ] Điền link Zalo thực

### 1.3 Cập nhật Mail app (src/apps/Mail.tsx)
- [ ] Điền email thực vào trường `To:`
- [ ] Cập nhật prefill subject

---

## Phase 2 — Migration dữ liệu sản phẩm

**Thời gian ước tính: 2–3 ngày**
**File chính: `src/apps/Finder.tsx`, thêm `src/data/products.ts`**

### 2.1 Tạo data layer cho products

Tạo file `src/data/products.ts` mới với cấu trúc phù hợp macOS Finder:

```ts
export interface Product {
  id: number;
  name: string;
  category: 'PC Gaming' | 'Office PC' | 'Laptop' | 'VGA' | 'Gaming Gear' | 'Keyboard' | 'Audio';
  tag: string;          // "Hot", "New", "Sale", giá...
  price: string;
  oldPrice?: string;
  discount?: number;
  image: string;        // URL từ songphuong.vn hoặc local
  link: string;         // Link đến product page
  color: string;        // Accent color cho icon
  glyph: string;        // Emoji/symbol cho Finder icon
  status?: 'New' | 'Hot' | 'Sale' | null;
}
```

### 2.2 Map dữ liệu cũ vào Finder sidebar
```
Sidebar mới:
- All Products   → tất cả
- PC & Laptop    → PC Gaming + Office PC + Laptop
- Gaming Gear    → VGA + Gaming Gear + Keyboard
- Audio & More   → Loa + others
```

### 2.3 Cập nhật Finder.tsx
- [ ] Import products từ `src/data/products.ts`
- [ ] Cập nhật sidebar categories theo danh mục thực
- [ ] Thêm price hiển thị trong product card
- [ ] Thêm discount badge (Hot/New/Sale)
- [ ] Khi click product → mở tab mới tới `link` trên songphuong.vn
- [ ] Thêm Tags sidebar: Hot, New, Sale

### 2.4 Cập nhật product images
Ưu tiên theo thứ tự:
1. Dùng URL ảnh trực tiếp từ `https://songphuong.vn/Content/uploads/...` (nhanh nhất)
2. Download và lưu vào `public/products/` (tốt hơn về performance)
3. Dùng ảnh placeholder nếu chưa có

---

## Phase 3 — Cập nhật Projects (Dự án cá nhân)

**Thời gian ước tính: 1 ngày**
**File chính: `src/apps/Projects.tsx`**

### 3.1 Thay placeholder projects bằng dự án thực
- [ ] Xác định 4-6 dự án thực đã làm (web projects, tools, designs)
- [ ] Thêm trường `url` và `github` vào project interface
- [ ] Khi click card → link đến demo hoặc GitHub
- [ ] Cập nhật filter tags phù hợp với stack thực (React, PHP, Design...)
- [ ] Thêm screenshot/preview thực thay fake editor lines

```ts
// Mẫu project thực
const projects = [
  {
    name: 'Song Phương Portfolio',
    tech: 'react',
    desc: 'macOS-style portfolio cho Song Phương Technology',
    color: '#3B82C4',
    url: 'https://...', 
    github: 'https://github.com/...',
  },
  // ...
];
```

---

## Phase 4 — Tích hợp i18n (EN/VN)

**Thời gian ước tính: 2–3 ngày**
**Files: `src/i18n/`, `src/apps/*.tsx`, `src/components/desktop/MenuBar.tsx`**

### 4.1 Tạo hệ thống i18n

Tạo `src/i18n/translations.ts` — migrate từ dữ liệu cũ:

```ts
export type Lang = 'en' | 'vn';

export const t = {
  en: {
    nav: { about: 'About Me', products: 'Products', projects: 'Projects', contact: 'Contact' },
    about: { role: 'Web Developer · IT Student at Dalat University', ... },
    finder: { title: 'Song Phương — Products', allProducts: 'All Products', ... },
    // ...
  },
  vn: {
    nav: { about: 'Về tôi', products: 'Sản phẩm', projects: 'Dự án', contact: 'Liên hệ' },
    // ...
  }
};
```

### 4.2 Thêm lang state vào Zustand store
- [ ] Thêm `lang: Lang` vào `useOSStore`
- [ ] Thêm `setLang: (lang: Lang) => void`
- [ ] Persist lang preference vào localStorage

### 4.3 Thêm language toggle vào MenuBar
- [ ] Thêm button "EN | VN" vào status bar bên phải MenuBar
- [ ] Cập nhật active app name theo lang

### 4.4 Cập nhật từng app component
- [ ] About.tsx — role, specs labels
- [ ] Finder.tsx — sidebar labels, toolbar
- [ ] Projects.tsx — filter labels
- [ ] Mail.tsx — field labels, placeholder text
- [ ] Welcome.tsx — toàn bộ nội dung

---

## Phase 5 — Welcome app & UX polish

**Thời gian ước tính: 1 ngày**
**File chính: `src/apps/Welcome.tsx`**

### 5.1 Cập nhật Welcome content
- [ ] Thêm giới thiệu bằng tiếng Việt
- [ ] Cập nhật keyboard shortcuts hint
- [ ] Thêm link đến songphuong.vn
- [ ] Thêm thông tin liên hệ nhanh

### 5.2 Wallpaper & visual polish
- [ ] Kiểm tra Wallpaper gradient có hợp với brand màu không
- [ ] Cân nhắc thêm tùy chọn wallpaper (solid, gradient, image)
- [ ] Avatar trong About: dùng `public/images/profile/my-avatar.jpg` với `object-fit: cover`
- [ ] Logo Song Phương trong Dock: dùng `public/images/brand/songphuong-logo.png`

### 5.3 Mobile iOS view
- [ ] Cập nhật app icon cho Finder (sản phẩm)
- [ ] Cập nhật About widget với avatar thực
- [ ] Kiểm tra social apps mở đúng link

---

## Phase 6 — SEO & Production deploy

**Thời gian ước tính: 1 ngày**
**Files: `index.html`, `vite.config.ts`, hosting config**

### 6.1 Cập nhật index.html meta tags
```html
<!-- Thay các placeholder hiện tại -->
<title>Hoàng Minh Dương — Song Phương Technology</title>
<meta name="description" content="Portfolio của Hoàng Minh Dương, Web Developer tại Song Phương Technology." />
<meta property="og:image" content="/images/profile/my-avatar.jpg" />
<!-- Thêm canonical URL -->
```

### 6.2 Performance optimization
- [ ] Lazy load app components (React.lazy + Suspense)
- [ ] Tối ưu ảnh: convert sang WebP, thêm width/height
- [ ] Kiểm tra bundle size (`vite build --report`)
- [ ] Preconnect tới songphuong.vn CDN (product images)

### 6.3 Deploy
- [ ] Chọn hosting: Vercel (recommended) hoặc Netlify
- [ ] Cấu hình custom domain nếu có
- [ ] Test trên mobile thực (iOS Safari, Android Chrome)
- [ ] Test window drag trên touch screen

---

## Thứ tự ưu tiên thực hiện

```
Week 1:  Phase 1 → Phase 2 → Phase 3
         (Data + Products + Projects)

Week 2:  Phase 4 → Phase 5
         (i18n + Polish)

Week 3:  Phase 6
         (Deploy + SEO)
```

**Bắt đầu từ đâu?**

**→ `src/apps/About.tsx`** — dễ nhất, impact cao nhất, không có dependency.

Thay 8 dòng data là portfolio đã có "bộ mặt" thật. Từ đó tiếp tục sang Finder với data sản phẩm thật để thấy tổng thể.

---

## File cần đọc trước khi bắt đầu

| File | Mục đích |
|---|---|
| [src/apps/About.tsx](src/apps/About.tsx) | Thay data cá nhân |
| [src/apps/Finder.tsx](src/apps/Finder.tsx) | Thay product data |
| [src/apps/index.tsx](src/apps/index.tsx) | Thay social links |
| [src/apps/Projects.tsx](src/apps/Projects.tsx) | Thay project data |
| [src/store/useOSStore.ts](src/store/useOSStore.ts) | Thêm lang state |
| [public/images/profile/my-avatar.jpg](public/images/profile/my-avatar.jpg) | Ảnh avatar sẵn có |
| [public/images/brand/songphuong-logo.png](public/images/brand/songphuong-logo.png) | Logo sẵn có |

---

*Tài liệu này phản ánh trạng thái dự án tính đến ngày 20/05/2026.*
