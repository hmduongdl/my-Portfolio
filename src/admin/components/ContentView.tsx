import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Package, Code2, Edit2, Trash2 } from 'lucide-react';

const ProjectsManager = () => {
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    api.get<any[]>('/admin/projects').then(setProjects).catch(console.error);
  }, []);

  return (
    <div className="p-6 pt-2">
      <h3 className="text-white text-lg font-bold mb-6">Quản lý Dự án cá nhân</h3>
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-black/20 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold border-b border-white/5">
            <tr>
              <th className="p-4">Dự án</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10" style={{ backgroundColor: `${p.color || '#fff'}20` }}>
                    <Code2 size={16} style={{ color: p.color || '#fff' }} />
                  </div>
                  {p.name}
                </td>
                <td className="p-4 text-zinc-400">{p.category}</td>
                <td className="p-4">
                  {p.visible !== false ? (
                    <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[11px] font-semibold border border-green-500/20">Hiển thị</span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-400 text-[11px] font-semibold border border-zinc-500/20">Đã ẩn</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">Chưa có dự án nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductsManager = () => {
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    api.get<any[]>('/admin/products').then(setProducts).catch(console.error);
  }, []);

  const Toggle = ({ checked }: { checked: boolean }) => (
    <div className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-white' : 'bg-zinc-700'}`}>
      <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'}`} />
    </div>
  );

  return (
    <div className="p-6 pt-2">
      <h3 className="text-white text-lg font-bold mb-6">Sản phẩm cấu hình PC</h3>
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-black/20 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold border-b border-white/5">
            <tr>
              <th className="p-4">Sản phẩm</th>
              <th className="p-4">Giá tiền</th>
              <th className="p-4">Hiển thị</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={20} className="text-zinc-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-[14px]">{p.name}</div>
                    <div className="text-zinc-500 text-[11px] uppercase tracking-wider mt-0.5">{p.category}</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-white">{p.price ? p.price.toLocaleString() + 'đ' : 'Liên hệ'}</div>
                  {p.old_price && <div className="text-zinc-500 line-through text-[11px]">{p.old_price.toLocaleString()}đ</div>}
                </td>
                <td className="p-4">
                  <Toggle checked={p.visible !== false} />
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">Chưa có sản phẩm nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ContentView: React.FC = () => {
  const [activeContentTab, setActiveContentTab] = useState<'projects' | 'products'>('projects');

  return (
    <div className="h-full flex flex-col relative bg-zinc-950">
      {/* Top Tab Bar */}
      <div className="p-6 pb-4">
        <div className="bg-zinc-900 border-b border-white/5 p-1.5 flex space-x-2 rounded-t-2xl">
          <button 
            onClick={() => setActiveContentTab('projects')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all ${activeContentTab === 'projects' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
          >
            Dự án cá nhân
          </button>
          <button 
            onClick={() => setActiveContentTab('products')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all ${activeContentTab === 'products' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
          >
            Sản phẩm cấu hình PC
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeContentTab === 'projects' ? <ProjectsManager /> : <ProductsManager />}
      </div>
    </div>
  );
};
