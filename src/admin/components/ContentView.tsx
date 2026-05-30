import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Package, Code2, Edit2, Trash2, Plus } from 'lucide-react';
import { ProjectModal as ProjectDetailModal, type Project } from './ProjectModal';
import { ProductDetailModal } from './ProductDetailModal';

export const ContentView: React.FC = () => {
  const [activeContentTab, setActiveContentTab] = useState<'projects' | 'products'>('projects');
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectSaveStatus, setProjectSaveStatus] = useState<'idle' | 'saving' | 'ok' | 'error'>('idle');

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Load functions
  const loadProjects = async () => {
    try {
      const data = await api.get<Project[]>('/admin/projects');
      const parsedData = (data ?? []).map(p => ({
        ...p,
        tags: Array.isArray(p.tags) ? p.tags : [],
        tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : (typeof p.tech_stack === 'string' ? JSON.parse(p.tech_stack || '[]') : []),
        features_vn: Array.isArray(p.features_vn) ? p.features_vn : (typeof p.features_vn === 'string' ? JSON.parse(p.features_vn || '[]') : []),
        features_en: Array.isArray(p.features_en) ? p.features_en : (typeof p.features_en === 'string' ? JSON.parse(p.features_en || '[]') : []),
        design_details_vn: typeof p.design_details_vn === 'string' ? JSON.parse(p.design_details_vn || '{}') : (p.design_details_vn || {}),
        design_details_en: typeof p.design_details_en === 'string' ? JSON.parse(p.design_details_en || '{}') : (p.design_details_en || {}),
        tool_details_vn: typeof p.tool_details_vn === 'string' ? JSON.parse(p.tool_details_vn || '{}') : (p.tool_details_vn || {}),
        tool_details_en: typeof p.tool_details_en === 'string' ? JSON.parse(p.tool_details_en || '{}') : (p.tool_details_en || {}),
      }));
      setProjects(parsedData);
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.get<any[]>('/admin/products');
      setProducts(data ?? []);
    } catch (e) {
      console.error('Failed to load products:', e);
    }
  };

  useEffect(() => {
    loadProjects();
    loadProducts();
  }, []);

  // Project Handlers
  const handleAddProject = () => {
    const newProj: Project = {
      id: '',
      name: '',
      category: 'web',
      project_type: 'code',
      color: '#2563EB',
      tags: [],
      desc_vn: '',
      desc_en: '',
      demo_url: '',
      github_url: '',
      order_index: projects.length + 1,
      visible: true,
      duration_vn: '',
      duration_en: '',
      role_vn: '',
      role_en: '',
      status: 'live',
      type_vn: '',
      type_en: '',
      achievement_vn: '',
      achievement_en: '',
      tech_stack: [],
      features_vn: [],
      features_en: [],
      design_details_vn: {},
      design_details_en: {},
      tool_details_vn: {},
      tool_details_en: {},
    };
    setIsNewProject(true);
    setSelectedProject(newProj);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (p: Project) => {
    setIsNewProject(false);
    setSelectedProject({ ...p });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;
    if (!selectedProject.id || selectedProject.id.trim() === '') {
      alert('Vui lòng nhập mã ID duy nhất (Slug)');
      return;
    }
    if (!selectedProject.name || selectedProject.name.trim() === '') {
      alert('Vui lòng nhập tên dự án');
      return;
    }

    setProjectSaveStatus('saving');
    try {
      if (isNewProject) {
        await api.post('/admin/projects', selectedProject);
      } else {
        await api.put('/admin/projects', selectedProject);
      }
      setProjectSaveStatus('ok');
      setIsProjectModalOpen(false);
      setSelectedProject(null);
      await loadProjects();
      window.dispatchEvent(new Event('projects-updated'));
      setTimeout(() => setProjectSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save project:', err);
      setProjectSaveStatus('error');
      alert(`Lưu thất bại: ${String(err)}`);
      setTimeout(() => setProjectSaveStatus('idle'), 3000);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    try {
      await api.del('/admin/projects', { id });
      setIsProjectModalOpen(false);
      setSelectedProject(null);
      await loadProjects();
      window.dispatchEvent(new Event('projects-updated'));
    } catch (e) {
      console.error('Failed to delete project:', e);
      alert('Xóa dự án thất bại');
    }
  };

  const handleToggleProjectVisible = async (p: Project) => {
    const updatedVisible = p.visible === false ? true : false;
    
    // Optimistic UI update
    setProjects(prev => prev.map(item => item.id === p.id ? { ...item, visible: updatedVisible } : item));
    
    try {
      await api.put('/admin/projects', {
        ...p,
        visible: updatedVisible
      });
      window.dispatchEvent(new Event('projects-updated'));
    } catch (err) {
      console.error('Failed to toggle project visibility:', err);
      // Revert
      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, visible: p.visible !== false } : item));
      alert(`Không thể cập nhật trạng thái hiển thị: ${String(err)}`);
    }
  };

  // Product Handlers
  const handleAddProduct = () => {
    setSelectedProduct(null); // null means new product in ProductDetailModal
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (p: any) => {
    setSelectedProduct({ ...p });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: any) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await api.del('/admin/products', { id });
      await loadProducts();
      window.dispatchEvent(new Event('products-updated'));
    } catch (e) {
      console.error('Failed to delete product:', e);
      alert('Xóa sản phẩm thất bại');
    }
  };

  const handleToggleProductVisible = async (p: any) => {
    const updatedVisible = !p.visible;
    
    // Optimistic UI update
    setProducts(prev => prev.map(item => item.id === p.id ? { ...item, visible: updatedVisible } : item));
    
    try {
      await api.put('/admin/products', {
        ...p,
        visible: updatedVisible
      });
      window.dispatchEvent(new Event('products-updated'));
    } catch (err) {
      console.error('Failed to toggle product visibility:', err);
      // Revert
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, visible: p.visible } : item));
      alert(`Không thể cập nhật trạng thái hiển thị: ${String(err)}`);
    }
  };

  // Helper toggle UI
  const Toggle = ({ checked, onClick }: { checked: boolean; onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-[#30D158]' : 'bg-zinc-700'}`}
    >
      <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'}`} />
    </div>
  );

  return (
    <div className="h-full flex flex-col relative bg-zinc-950 text-white font-sans">
      {/* Top Tab Bar Wrapper */}
      <div className="bg-zinc-900 border-b border-white/5 p-2 flex space-x-2 rounded-t-2xl">
        <button 
          onClick={() => setActiveContentTab('projects')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all ${
            activeContentTab === 'projects' 
              ? 'bg-white/10 text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
        >
          Dự án cá nhân
        </button>
        <button 
          onClick={() => setActiveContentTab('products')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all ${
            activeContentTab === 'products' 
              ? 'bg-white/10 text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
        >
          Sản phẩm cấu hình PC
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeContentTab === 'projects' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-bold">Quản lý Dự án cá nhân</h3>
                <p className="text-zinc-400 text-xs mt-1">Xem, thêm, sửa đổi hoặc xóa các dự án hiển thị trên trang chủ.</p>
              </div>
              <button
                onClick={handleAddProject}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950/20 active:scale-95 transition-all"
              >
                <Plus size={16} />
                Thêm dự án
              </button>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
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
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">id: {p.id}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">
                        <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 text-[11px] font-medium border border-white/5">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <Toggle 
                          checked={p.visible !== false} 
                          onClick={() => handleToggleProjectVisible(p)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditProject(p)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(p.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Xóa"
                          >
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
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-bold">Sản phẩm cấu hình PC</h3>
                <p className="text-zinc-400 text-xs mt-1">Danh sách sản phẩm phần cứng hiển thị trên cấu hình PC.</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-950/20 active:scale-95 transition-all"
              >
                <Plus size={16} />
                Thêm sản phẩm
              </button>
            </div>

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
                        <div className="font-medium text-white">{p.price ? (typeof p.price === 'number' ? p.price.toLocaleString() + 'đ' : p.price) : 'Liên hệ'}</div>
                        {p.old_price && <div className="text-zinc-500 line-through text-[11px]">{typeof p.old_price === 'number' ? p.old_price.toLocaleString() + 'đ' : p.old_price}</div>}
                      </td>
                      <td className="p-4">
                        <Toggle 
                          checked={p.visible !== false} 
                          onClick={() => handleToggleProductVisible(p)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditProduct(p)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Xóa"
                          >
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
        )}
      </div>

      {/* Project Editor Modal */}
      {isProjectModalOpen && selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isNewProject={isNewProject}
          saveStatus={projectSaveStatus}
          onChange={setSelectedProject}
          onClose={() => {
            setIsProjectModalOpen(false);
            setSelectedProject(null);
          }}
          onSave={handleSaveProject}
          onDelete={handleDeleteProject}
        />
      )}

      {/* Product Editor Modal */}
      {isProductModalOpen && (
        <ProductDetailModal
          key={selectedProduct ? `product-${selectedProduct.id ?? selectedProduct.name ?? 'editing'}` : 'product-new'}
          product={selectedProduct}
          onClose={() => {
            setIsProductModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={loadProducts}
        />
      )}
    </div>
  );
};
