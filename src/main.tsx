import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import './styles/index.css';

const isAdmin = window.location.pathname.startsWith('/admin');
const AdminApp = React.lazy(() =>
  import('./admin/AdminApp').then((module) => ({ default: module.AdminApp }))
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? (
      <React.Suspense
        fallback={
          <div className="admin-dark h-screen w-screen bg-zinc-950" />
        }
      >
        <AdminApp />
      </React.Suspense>
    ) : (
      <AppRouter />
    )}
  </React.StrictMode>
);
