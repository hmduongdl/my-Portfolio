import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api';

interface AlbumRecord {
  id: string;
  name: string;
  description?: string | null;
  visible?: boolean | null;
  order_index?: number | string | null;
}

interface PhotoRecord {
  id?: number | string | null;
  album_id?: string | null;
  albumId?: string | null;
  title?: string | null;
  caption?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  alt_text?: string | null;
  altText?: string | null;
}

interface PhotoFormState {
  album_id: string;
  title: string;
  caption: string;
  alt_text: string;
  image_url: string;
}

interface PhotoDetailModalProps {
  photo: PhotoRecord | null;
  onClose: () => void;
  onSave: () => void;
}

function textValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function initialState(photo: PhotoRecord | null): PhotoFormState {
  return {
    album_id: textValue(photo?.album_id ?? photo?.albumId),
    title: textValue(photo?.title),
    caption: textValue(photo?.caption),
    alt_text: textValue(photo?.alt_text ?? photo?.altText),
    image_url: textValue(photo?.image_url ?? photo?.imageUrl),
  };
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({ photo, onClose, onSave }) => {
  const [albums, setAlbums] = useState<AlbumRecord[]>([]);
  const [form, setForm] = useState<PhotoFormState>(() => initialState(photo));
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(photo?.id);

  useEffect(() => {
    let active = true;

    async function loadAlbums() {
      setIsLoadingAlbums(true);
      try {
        const data = await api.get<AlbumRecord[]>('/admin/albums');
        if (!active) return;
        setAlbums(Array.isArray(data) ? data : []);
        setForm(prev => ({
          ...prev,
          album_id: prev.album_id || data[0]?.id || '',
        }));
      } catch (err) {
        console.error('Không thể tải danh sách album:', err);
        if (active) setError('Không thể tải danh sách album.');
      } finally {
        if (active) setIsLoadingAlbums(false);
      }
    }

    loadAlbums();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPreviewFailed(false);
  }, [form.image_url]);

  const selectedAlbumName = useMemo(() => {
    return albums.find(album => album.id === form.album_id)?.name || 'Chưa chọn album';
  }, [albums, form.album_id]);

  const updateForm = <K extends keyof PhotoFormState>(key: K, value: PhotoFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.album_id.trim()) {
      setError('Vui lòng chọn album chứa hình ảnh.');
      return;
    }

    if (!form.title.trim()) {
      setError('Tiêu đề hình ảnh là bắt buộc.');
      return;
    }

    if (!form.alt_text.trim()) {
      setError('Chuỗi mô tả thẻ ảnh là bắt buộc để tối ưu Google Images.');
      return;
    }

    if (!form.image_url.trim()) {
      setError('Đường dẫn URL hình ảnh là bắt buộc.');
      return;
    }

    const payload = {
      ...(photo?.id ? { id: photo.id } : {}),
      album_id: form.album_id.trim(),
      title: form.title.trim(),
      caption: form.caption.trim() || null,
      alt_text: form.alt_text.trim(),
      image_url: form.image_url.trim(),
    };

    setIsSaving(true);
    setError('');

    try {
      if (isEditing) {
        await api.put('/admin/photos', payload);
      } else {
        await api.post('/admin/photos', payload);
      }

      window.dispatchEvent(new Event('photos-updated'));
      onSave();
      onClose();
    } catch (err) {
      console.error('Không thể lưu hình ảnh:', err);
      setError(err instanceof Error ? err.message : 'Không thể lưu thay đổi hình ảnh.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[980px] flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h3 className="text-[16px] font-bold text-white">
              {isEditing ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh mới'}
            </h3>
            <p className="text-[12px] text-zinc-400">Siêu dữ liệu ảnh cho Album Trưng Bày</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Đóng biểu mẫu"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <section className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">Dữ liệu</h4>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-zinc-300">Thuộc Album nào</span>
                <select
                  value={form.album_id}
                  onChange={event => updateForm('album_id', event.target.value)}
                  disabled={isLoadingAlbums}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-[13px] text-white outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                >
                  <option value="">{isLoadingAlbums ? 'Đang tải album...' : 'Chọn album'}</option>
                  {albums.map(album => (
                    <option key={album.id} value={album.id}>{album.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-zinc-300">Tiêu đề hình ảnh</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={event => updateForm('title', event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-[13px] text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  placeholder="Cấu hình PC Gaming MSI cao cấp chuẩn Song Phương"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-zinc-300">Chú thích hình ảnh</span>
                <textarea
                  value={form.caption}
                  onChange={event => updateForm('caption', event.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-[13px] leading-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  placeholder="Viết chi tiết, chứa các từ khóa SEO dịch vụ."
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-zinc-300">Chuỗi mô tả thẻ ảnh</span>
                <textarea
                  value={form.alt_text}
                  onChange={event => updateForm('alt_text', event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-[13px] leading-5 text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  placeholder="Bắt buộc nhập, dùng để tối ưu thuật toán tìm kiếm Google Images."
                  required
                />
              </label>
            </section>

            <section className="space-y-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wide text-zinc-400">Hình ảnh & Preview</h4>

              <label className="block">
                <span className="mb-1 block text-[12px] font-semibold text-zinc-300">Đường dẫn URL hình ảnh</span>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={event => updateForm('image_url', event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-[13px] text-white outline-none transition placeholder:text-zinc-600 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                  placeholder="https://example.com/hinh-anh.jpg"
                />
              </label>

              <div className="rounded-xl border border-white/10 overflow-hidden aspect-video bg-zinc-900">
                {form.image_url.trim() && !previewFailed ? (
                  <img
                    src={form.image_url.trim()}
                    alt={form.alt_text.trim() || form.title.trim() || 'Ảnh xem trước'}
                    className="h-full w-full object-cover"
                    onError={() => setPreviewFailed(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-6 text-center text-[13px] text-zinc-500">
                    {previewFailed ? 'Không thể tải ảnh từ đường dẫn này.' : 'Dán đường dẫn hình ảnh để xem trước tức thì.'}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-3">
                <p className="text-[12px] font-semibold text-zinc-300">Album đang chọn</p>
                <p className="mt-1 text-[13px] text-white">{selectedAlbumName}</p>
              </div>
            </section>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-200">
              {error}
            </div>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            disabled={isSaving}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-sky-400 px-4 py-2 text-[13px] font-bold text-zinc-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </footer>
      </div>
    </div>
  );
};
