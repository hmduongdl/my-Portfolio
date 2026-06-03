import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const AlbumPage = React.lazy(() => import('./pages/AlbumPage'));

const PageFallback: React.FC = () => (
  <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
    <span className="text-sm text-zinc-400">Đang tải nội dung...</span>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/san-pham" element={<ProductsPage />} />
          <Route path="/du-an" element={<ProjectsPage />} />
          <Route path="/album" element={<AlbumPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
