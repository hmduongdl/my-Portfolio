import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Plus, Edit2, Trash2, Image, Loader2, FolderHeart, Info } from 'lucide-react';

interface Album {
  id: string;
  name: string;
  description: string;
  order_index: number;
  visible: boolean;
}

interface Photo {
  id: number | string; // number for database, string like temp_... for client
  album_id: string;
  title: string;
  caption: string;
  image_url: string;
  alt_text: string;
}

interface GalleryManagerViewProps {
  onDirtyChange?: (isDirty: boolean) => void;
}

export const GalleryManagerView: React.FC<GalleryManagerViewProps> = ({ onDirtyChange }) => {
  const [internalTab, setInternalTab] = useState<'albums' | 'photos'>('albums');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [originalAlbums, setOriginalAlbums] = useState<Album[]>([]);
  const [originalPhotos, setOriginalPhotos] = useState<Photo[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Track deletions locally
  const [deletedAlbumIds, setDeletedAlbumIds] = useState<string[]>([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<(number | string)[]>([]);

  // Editing state
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  
  // Form error
  const [validationError, setValidationError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedAlbums = await api.get<Album[]>('/admin/albums');
      const fetchedPhotos = await api.get<Photo[]>('/admin/photos');
      setAlbums(fetchedAlbums || []);
      setOriginalAlbums(fetchedAlbums ? JSON.parse(JSON.stringify(fetchedAlbums)) : []);
      setPhotos(fetchedPhotos || []);
      setOriginalPhotos(fetchedPhotos ? JSON.parse(JSON.stringify(fetchedPhotos)) : []);
      
      // Reset deletion queues and dirty state
      setDeletedAlbumIds([]);
      setDeletedPhotoIds([]);
      onDirtyChange?.(false);
    } catch (e) {
      console.error('Failed to load gallery data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute dirty status by checking if items are modified, added, or deleted
  const isDirty = 
    JSON.stringify(albums) !== JSON.stringify(originalAlbums) ||
    JSON.stringify(photos) !== JSON.stringify(originalPhotos) ||
    deletedAlbumIds.length > 0 ||
    deletedPhotoIds.length > 0;

  // Let parent know when dirty status changes
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty]);

  // Handle global save event from bottom action bar
  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      // 1. Process Photo deletions
      for (const id of deletedPhotoIds) {
        if (typeof id === 'number' || !id.toString().startsWith('temp_')) {
          await api.del('/admin/photos', { id });
        }
      }

      // 2. Process Album deletions
      for (const id of deletedAlbumIds) {
        await api.del('/admin/albums', { id });
      }

      // 3. Process Album additions/updates
      for (const alb of albums) {
        const isNew = !originalAlbums.some(o => o.id === alb.id);
        if (isNew) {
          await api.post('/admin/albums', alb);
        } else {
          // Check if modified
          const orig = originalAlbums.find(o => o.id === alb.id);
          if (JSON.stringify(orig) !== JSON.stringify(alb)) {
            await api.put('/admin/albums', alb);
          }
        }
      }

      // 4. Process Photo additions/updates
      for (const pho of photos) {
        const isNew = pho.id.toString().startsWith('temp_');
        if (isNew) {
          // Send photo payload without the temporary ID
          const payload = {
            album_id: pho.album_id,
            title: pho.title,
            caption: pho.caption,
            image_url: pho.image_url,
            alt_text: pho.alt_text
          };
          await api.post('/admin/photos', payload);
        } else {
          // Check if modified
          const orig = originalPhotos.find(o => o.id === pho.id);
          if (JSON.stringify(orig) !== JSON.stringify(pho)) {
            await api.put('/admin/photos', pho);
          }
        }
      }

      // Reload
      await loadData();
      alert('Đã lưu tất cả thay đổi của Album và Hình ảnh thành công!');
    } catch (e: any) {
      console.error(e);
      alert(`Lỗi khi lưu dữ liệu album: ${e.message || String(e)}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleSaveRequest = (event: Event) => {
      if (isSaving) return;
      const savePromise = handleGlobalSave();
      (event as CustomEvent<{ promises: Promise<unknown>[] }>).detail?.promises.push(savePromise);
    };

    window.addEventListener('global-save-triggered', handleSaveRequest);
    return () => window.removeEventListener('global-save-triggered', handleSaveRequest);
  }, [albums, photos, deletedAlbumIds, deletedPhotoIds, originalAlbums, originalPhotos, isSaving]);

  // Tab 1 (Album) operations
  const handleAddAlbum = () => {
    setEditingAlbum({
      id: '',
      name: '',
      description: '',
      order_index: albums.length + 1,
      visible: true
    });
    setEditingPhoto(null);
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleEditAlbum = (alb: Album) => {
    setEditingAlbum({ ...alb });
    setEditingPhoto(null);
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleDeleteAlbum = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa album này? Mọi hình ảnh trong album cũng sẽ bị xóa.')) return;
    setAlbums(prev => prev.filter(a => a.id !== id));
    if (!deletedAlbumIds.includes(id)) {
      setDeletedAlbumIds(prev => [...prev, id]);
    }
    // Also remove its photos locally
    setPhotos(prev => prev.filter(p => p.album_id !== id));
  };

  const handleSaveAlbumForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;

    const id = editingAlbum.id.trim();
    const name = editingAlbum.name.trim();

    if (!id) {
      setValidationError('Vui lòng nhập Mã Album (Slug).');
      return;
    }
    if (!name) {
      setValidationError('Vui lòng nhập Tên album.');
      return;
    }

    const isNew = !originalAlbums.some(o => o.id === id) && !albums.some(a => a.id === id && a.id !== editingAlbum.id);
    const isEditingExisting = albums.some(a => a.id === editingAlbum.id);

    if (!isEditingExisting && !isNew) {
      setValidationError('Mã Album này đã tồn tại, vui lòng nhập mã khác.');
      return;
    }

    if (isEditingExisting) {
      // Update
      setAlbums(prev => prev.map(a => a.id === editingAlbum.id ? editingAlbum : a));
    } else {
      // Add
      setAlbums(prev => [...prev, editingAlbum]);
    }

    setIsModalOpen(false);
    setEditingAlbum(null);
  };

  // Tab 2 (Photo) operations
  const handleAddPhoto = () => {
    if (albums.length === 0) {
      alert('Vui lòng tạo ít nhất một album trước khi thêm hình ảnh.');
      return;
    }
    setEditingPhoto({
      id: `temp_${Date.now()}`,
      album_id: albums[0].id,
      title: '',
      caption: '',
      image_url: '',
      alt_text: ''
    });
    setEditingAlbum(null);
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleEditPhoto = (pho: Photo) => {
    setEditingPhoto({ ...pho });
    setEditingAlbum(null);
    setValidationError('');
    setIsModalOpen(true);
  };

  const handleDeletePhoto = (id: number | string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) return;
    setPhotos(prev => prev.filter(p => p.id !== id));
    if (!id.toString().startsWith('temp_')) {
      setDeletedPhotoIds(prev => [...prev, id]);
    }
  };

  const handleSavePhotoForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    if (!editingPhoto.album_id) {
      setValidationError('Vui lòng chọn Album.');
      return;
    }
    if (!editingPhoto.title.trim()) {
      setValidationError('Vui lòng nhập Tiêu đề ảnh.');
      return;
    }
    if (!editingPhoto.image_url.trim()) {
      setValidationError('Vui lòng nhập Đường dẫn hình ảnh.');
      return;
    }
    if (!editingPhoto.alt_text.trim()) {
      setValidationError('Vui lòng nhập Thuộc tính Alt.');
      return;
    }

    const isEditingExisting = photos.some(p => p.id === editingPhoto.id);

    if (isEditingExisting) {
      setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? editingPhoto : p));
    } else {
      setPhotos(prev => [...prev, editingPhoto]);
    }

    setIsModalOpen(false);
    setEditingPhoto(null);
  };

  const Toggle = ({ checked, onClick }: { checked: boolean; onClick?: () => void }) => (
    <div 
      onClick={onClick}
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-[#30D158]' : 'bg-zinc-700'}`}
    >
      <div className={`w-4 h-4 rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'}`} />
    </div>
  );

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-3 text-zinc-400 min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="text-[13px]">Đang tải dữ liệu thư viện ảnh...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-zinc-950 text-white font-sans">
      
      {/* Top Internal Tab Bar */}
      <div className="bg-zinc-900 border border-white/5 p-2 flex space-x-2 rounded-2xl mb-6">
        <button 
          onClick={() => setInternalTab('albums')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
            internalTab === 'albums' 
              ? 'bg-white/10 text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
        >
          <FolderHeart size={16} />
          Cấu hình danh mục Album
        </button>
        <button 
          onClick={() => setInternalTab('photos')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
            internalTab === 'photos' 
              ? 'bg-white/10 text-white shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}
        >
          <Image size={16} />
          Kho lưu trữ hình ảnh
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1">
        {internalTab === 'albums' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white text-lg font-bold">Danh mục Album ảnh</h3>
                <p className="text-zinc-400 text-xs mt-1">Quản lý các nhóm danh mục hiển thị công khai trên ứng dụng Album.</p>
              </div>
              <button
                onClick={handleAddAlbum}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Plus size={16} />
                Thêm mới
              </button>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-black/20 text-zinc-500 uppercase tracking-wider text-[11px] font-semibold border-b border-white/5">
                  <tr>
                    <th className="p-4">Mã Album (Slug)</th>
                    <th className="p-4">Tên Album</th>
                    <th className="p-4">Mô tả</th>
                    <th className="p-4">Thứ tự</th>
                    <th className="p-4">Hiển thị</th>
                    <th className="p-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {albums.map(alb => (
                    <tr key={alb.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-mono font-semibold text-blue-400">{alb.id}</td>
                      <td className="p-4 font-semibold text-white">{alb.name}</td>
                      <td className="p-4 text-zinc-400 max-w-xs truncate">{alb.description || '—'}</td>
                      <td className="p-4 text-zinc-400">{alb.order_index}</td>
                      <td className="p-4">
                        <Toggle 
                          checked={alb.visible} 
                          onClick={() => {
                            setAlbums(prev => prev.map(a => a.id === alb.id ? { ...a, visible: !a.visible } : a));
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditAlbum(alb)}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Edit2 size={12} />
                            Sửa
                          </button>
                          <button 
                            onClick={() => handleDeleteAlbum(alb.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-red-500/25 text-red-500/80 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {albums.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-500">
                        Chưa có album nào. Vui lòng bấm nút "Thêm mới" để tạo.
                      </td>
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
                <h3 className="text-white text-lg font-bold">Kho lưu trữ hình ảnh</h3>
                <p className="text-zinc-400 text-xs mt-1">Quản lý toàn bộ danh sách hình ảnh được trưng bày trong các album.</p>
              </div>
              <button
                onClick={handleAddPhoto}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Plus size={16} />
                Thêm mới
              </button>
            </div>

            {/* Lưới danh sách hình ảnh */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {photos.map(pho => {
                const alb = albums.find(a => a.id === pho.album_id);
                return (
                  <div key={pho.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-white/10 hover:bg-zinc-900/80 transition-all shadow-md">
                    <div>
                      {/* Image Thumbnail */}
                      <div className="aspect-video w-full bg-zinc-950 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                        {pho.image_url ? (
                          <img 
                            src={pho.image_url} 
                            alt={pho.alt_text} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-zinc-700" />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-blue-400 border border-blue-500/20 font-medium">
                          {alb?.name || pho.album_id}
                        </span>
                      </div>
                      
                      {/* Info Content */}
                      <div className="p-4 space-y-2">
                        <h4 className="text-[13px] font-bold text-white line-clamp-1">{pho.title}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 h-8 leading-snug">{pho.caption || 'Chưa có chú thích'}</p>
                        
                        <div className="flex items-center gap-1 border-t border-white/5 pt-2 mt-2">
                          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Alt:</span>
                          <span className="text-[11px] text-zinc-400 font-mono truncate" title={pho.alt_text}>
                            {pho.alt_text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 flex gap-2">
                      <button 
                        onClick={() => handleEditPhoto(pho)}
                        className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-1"
                      >
                        <Edit2 size={11} />
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDeletePhoto(pho.id)}
                        className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all flex items-center justify-center gap-1"
                      >
                        <Trash2 size={11} />
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}

              {photos.length === 0 && (
                <div className="col-span-full bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-center text-zinc-500 text-sm">
                  Chưa có hình ảnh nào trong kho lưu trữ. Vui lòng thêm hình ảnh mới.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-black/10">
              <h4 className="text-[14px] font-bold text-white">
                {editingAlbum 
                  ? (originalAlbums.some(o => o.id === editingAlbum.id) ? 'Sửa thông tin Album' : 'Thêm Album mới') 
                  : (editingPhoto?.id.toString().startsWith('temp_') ? 'Thêm hình ảnh mới' : 'Sửa thông tin hình ảnh')
                }
              </h4>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAlbum(null);
                  setEditingPhoto(null);
                }} 
                className="text-zinc-400 hover:text-white transition-colors font-bold text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Form Content */}
            <form 
              onSubmit={editingAlbum ? handleSaveAlbumForm : handleSavePhotoForm} 
              className="p-5 space-y-4 text-[13px]"
              onChange={() => {
                // Trigger global isDirty when typing inside the form fields
                onDirtyChange?.(true);
                const mainEl = document.querySelector('main');
                if (mainEl) {
                  mainEl.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }}
              onKeyUp={() => {
                onDirtyChange?.(true);
                const mainEl = document.querySelector('main');
                if (mainEl) {
                  mainEl.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }}
            >
              {validationError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2">
                  <Info size={14} className="shrink-0" />
                  <span className="text-xs font-medium">{validationError}</span>
                </div>
              )}

              {/* ALBUM FORM FIELDS */}
              {editingAlbum && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Mã Album (Slug ID)
                    </label>
                    <input 
                      type="text"
                      disabled={originalAlbums.some(o => o.id === editingAlbum.id)}
                      value={editingAlbum.id}
                      onChange={e => setEditingAlbum(prev => prev ? { ...prev, id: e.target.value } : null)}
                      placeholder="Ví dụ: thien-nhien"
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Định dạng URL viết liền, không dấu, không khoảng trắng (chỉ nhập khi tạo mới).</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Tên Album
                    </label>
                    <input 
                      type="text"
                      value={editingAlbum.name}
                      onChange={e => setEditingAlbum(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="Ví dụ: Thiên nhiên"
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Mô tả chi tiết
                    </label>
                    <textarea 
                      rows={3}
                      value={editingAlbum.description}
                      onChange={e => setEditingAlbum(prev => prev ? { ...prev, description: e.target.value } : null)}
                      placeholder="Mô tả tóm tắt nội dung các ảnh trong album..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Thứ tự sắp xếp
                      </label>
                      <input 
                        type="number"
                        value={editingAlbum.order_index}
                        onChange={e => setEditingAlbum(prev => prev ? { ...prev, order_index: parseInt(e.target.value) || 0 } : null)}
                        placeholder="0"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Trạng thái hiển thị
                      </label>
                      <div className="pt-1.5">
                        <Toggle 
                          checked={editingAlbum.visible} 
                          onClick={() => setEditingAlbum(prev => prev ? { ...prev, visible: !prev.visible } : null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PHOTO FORM FIELDS */}
              {editingPhoto && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Chọn Album chứa
                    </label>
                    <select
                      value={editingPhoto.album_id}
                      onChange={e => setEditingPhoto(prev => prev ? { ...prev, album_id: e.target.value } : null)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 transition-all appearance-none"
                    >
                      {albums.map(a => (
                        <option key={a.id} value={a.id} className="bg-zinc-800 text-white">
                          {a.name} ({a.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Tiêu đề hình ảnh
                    </label>
                    <input 
                      type="text"
                      value={editingPhoto.title}
                      onChange={e => setEditingPhoto(prev => prev ? { ...prev, title: e.target.value } : null)}
                      placeholder="Ví dụ: Hoàng hôn trên đỉnh Langbiang"
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Chú thích ảnh (Caption)
                    </label>
                    <input 
                      type="text"
                      value={editingPhoto.caption}
                      onChange={e => setEditingPhoto(prev => prev ? { ...prev, caption: e.target.value } : null)}
                      placeholder="Ví dụ: Chụp vào một buổi chiều tháng 5 rực nắng..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Đường dẫn hình ảnh (Image URL)
                    </label>
                    <input 
                      type="text"
                      value={editingPhoto.image_url}
                      onChange={e => setEditingPhoto(prev => prev ? { ...prev, image_url: e.target.value } : null)}
                      placeholder="Nhập link ảnh (https://...)"
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                      Thuộc tính Alt (Mô tả SEO cho ảnh)
                    </label>
                    <input 
                      type="text"
                      value={editingPhoto.alt_text}
                      onChange={e => setEditingPhoto(prev => prev ? { ...prev, alt_text: e.target.value } : null)}
                      placeholder="Ví dụ: Anh chup dinh nui Langbiang trong suong chieu Da Lat"
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-white/30 placeholder:text-zinc-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-white/5 flex justify-end gap-3 bg-black/5 -mx-5 -mb-5 p-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAlbum(null);
                    setEditingPhoto(null);
                  }}
                  className="px-4 py-2 rounded-lg font-medium border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
