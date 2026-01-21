# ⚡ Hoàng Minh Dương - Minimalist Design Portfolio

<div align="center">

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

**A high-performance, minimalist personal portfolio built with modern web technologies.**
Presenting experience, skills, and projects with a clean, dynamic user and developer experience.

[View Demo](https://sp-hoangminhduong.id.vn/)

</div>

---

## 🎨 Overview

This portfolio showcases a professional profile with a focus on minimalism and performance. It features a unique **layered scrolling interaction** where content flows dynamically over a sticky background, creating an immersive reading experience.

**New Feature: Internationalization (i18n)**
The portfolio now supports full **English (EN)** and **Vietnamese (VN)** language switching with instant content updates and persistent user preference.

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Core** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat-square&logo=postcss&logoColor=white) |
| **Tooling** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=flat-square&logo=npm&logoColor=white) |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |

## 📂 Project Structure

The project has been refactored for maintainability and scalability, now including a robust i18n system:

```bash
📦 Portfolio
├── 📂 public/              # Static assets (images, icons, flags)
├── 📂 src/                 # Source code
│   ├── 📂 app/             # Core application logic
│   │   └── PortfolioController.ts # Main controller (handles translations & events)
│   ├── 📂 components/      # UI Components (Navigation, About, Contact, etc.)
│   ├── 📂 i18n/            # Internationalization
│   │   └── translations.ts # English/Vietnamese dictionaries
│   ├── 📂 icons/           # SVG Icon definitions
│   ├── 📂 types/           # TS Interfaces & Types
│   ├── 📂 utils/           # Utility functions
│   │   ├── language.ts     # LanguageManager singleton
│   │   └── ...
│   ├── main.ts             # Entry point (Bootstrap)
│   └── style.css           # Global Tailwind directives
├── index.html              # Entry HTML
├── package.json            # Dependencies & Scripts
└── tailwind.config.js      # Tailwind configuration
```

## ✨ Key Features

-   **Bilingual Support**: Seamless toggle between English and Vietnamese with flag indicators (🇬🇧 / 🇻🇳).
-   **Dynamic Rendering**: Content updates instantly without page reloads using a custom `LanguageManager`.
-   **Responsive Design**: Mobile-first approach ensuring perfect display on all devices.
-   **Scroll Animations**: Smooth reveal effects and sticky navigation.
-   **Singleton Pattern**: Efficient state management for language and scroll events.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v16+)
-   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/hmduongdl/Minimalist-Design-Portfolio.git
    cd Minimalist-Design-Portfolio
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run development server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` to view it in the browser.

### Build for Production

```bash
npm run build
```

---

<div align="center">
  <sub>Designed and built with ❤️ by HMD.</sub>
</div>
