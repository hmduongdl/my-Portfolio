import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center h-full text-zinc-500">
      <LayoutDashboard size={48} className="mb-4 opacity-20" />
      <h2 className="text-xl font-semibold text-zinc-300">Dashboard</h2>
      <p className="mt-2 text-sm">Tính năng tổng quan đang được phát triển...</p>
    </div>
  );
};
