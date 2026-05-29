import React, { useState } from 'react';
import { ProjectsEditor } from './ProjectsEditor';
import { ProductsEditor } from './ProductsEditor';

export const ContentEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'products'>('projects');

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center gap-4 border-b border-white/10 px-6 shrink-0 h-14 bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-md">
        <button
          onClick={() => setActiveTab('projects')}
          className={`h-full flex items-center px-2 border-b-2 text-[13px] font-semibold transition-colors ${
            activeTab === 'projects'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Dự án
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`h-full flex items-center px-2 border-b-2 text-[13px] font-semibold transition-colors ${
            activeTab === 'products'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Sản phẩm
        </button>
      </div>

      <div className="flex-1 overflow-y-auto relative">
        {activeTab === 'projects' && <ProjectsEditor />}
        {activeTab === 'products' && <ProductsEditor />}
      </div>
    </div>
  );
};
