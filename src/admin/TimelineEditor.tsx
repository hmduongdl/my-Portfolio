import React, { useEffect, useRef, useState } from 'react';
import { api } from './api';

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────
interface TimelineItem {
  id: number;
  role_vn: string;
  role_en: string;
  company: string;
  company_url?: string;
  period_vn: string;
  period_en: string;
  desc_vn: string[];
  desc_en: string[];
  type: 'work' | 'education' | 'freelance';
  order_index: number;
}

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

const EMPTY_ITEM: Omit<TimelineItem, 'id'> = {
  role_vn: '', role_en: '', company: '', company_url: '',
  period_vn: '', period_en: '', desc_vn: [], desc_en: [],
  type: 'work', order_index: 0,
};

// ────────────────────────────────────────────────────────────────────────────
// Type badge config
// ────────────────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  work: {
    label: 'Work',
    labelVn: 'Làm việc',
    icon: 'work',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  education: {
    label: 'Education',
    labelVn: 'Học tập',
    icon: 'school',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  freelance: {
    label: 'Freelance',
    labelVn: 'Freelance',
    icon: 'laptop_mac',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Confirm Delete Dialog
// ────────────────────────────────────────────────────────────────────────────
interface ConfirmDeleteProps {
  item: TimelineItem;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}
const ConfirmDeleteDialog: React.FC<ConfirmDeleteProps> = ({ item, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in">
    <div className="bg-surface border border-outline-variant rounded-2xl w-full max-w-sm p-6 shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-error text-[24px]">delete_forever</span>
      </div>
      <h3 className="text-[16px] font-bold text-on-surface text-center mb-2">Xác nhận xóa</h3>
      <p className="text-[13px] text-on-surface-variant text-center mb-1">
        Bạn có chắc muốn xóa mốc lịch sử:
      </p>
      <p className="text-[13px] font-semibold text-on-surface text-center mb-1">
        "{item.role_vn || item.role_en}"
      </p>
      <p className="text-[12px] text-on-surface-variant text-center mb-6">
        tại <span className="text-primary">{item.company}</span>
      </p>
      <p className="text-[11px] text-error/80 text-center mb-5">
        ⚠ Hành động này không thể hoàn tác.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-surface-container-highest/30 text-on-surface font-semibold text-[13px] rounded-xl border border-outline-variant/50 hover:bg-surface-container-high transition-colors disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 px-4 py-2 bg-error text-on-error font-semibold text-[13px] rounded-xl hover:bg-error/90 transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {isDeleting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-on-error/40 border-t-on-error rounded-full animate-spin" />
              Đang xóa...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Xóa
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
// Description List Editor (reusable for VN/EN)
// ────────────────────────────────────────────────────────────────────────────
interface DescListEditorProps {
  label: string;
  items: string[];
  onChange: (updated: string[]) => void;
  placeholder: string;
}
const DescListEditor: React.FC<DescListEditorProps> = ({ label, items, onChange, placeholder }) => {
  const addItem = () => onChange([...items, '']);
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, val: string) => {
    const updated = [...items];
    updated[idx] = val;
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-on-surface-variant/60 bg-surface-container px-2 py-0.5 rounded-full">
          {items.length} dòng
        </span>
      </div>
      <div className="space-y-2">
        {items.map((desc, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-5 h-5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
            </div>
            <input
              type="text"
              value={desc}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder={placeholder}
              autoFocus={desc === '' && idx === items.length - 1}
              className="flex-1 bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/40"
            />
            <button
              type="button"
              onClick={() => removeItem(idx)}
              title="Xóa dòng này"
              className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/20 text-error transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-3 text-center text-[12px] text-on-surface-variant/50 border border-dashed border-outline-variant/30 rounded-lg">
            Chưa có mô tả. Nhấn "Thêm dòng" để bắt đầu.
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 flex items-center gap-1.5 text-primary text-[12px] font-semibold hover:text-primary/80 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">add_circle</span>
        Thêm dòng mới
      </button>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Form Field helpers
// ────────────────────────────────────────────────────────────────────────────
const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, children, className }) => (
  <div className={className}>
    <label className="text-[11px] font-semibold text-on-surface-variant mb-1.5 block">{label}</label>
    {children}
  </div>
);

const inputCls = 'w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-on-surface-variant/40';

// ────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────
export const TimelineEditor: React.FC = () => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<TimelineItem | Omit<TimelineItem, 'id'> | null>(null);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [deleteTarget, setDeleteTarget] = useState<TimelineItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'error' } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load data
  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await api.get<TimelineItem[]>('/admin/timeline');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showToast('Không thể tải dữ liệu timeline.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  // Toast helper
  const showToast = (msg: string, type: 'ok' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!editingItem) return;
    setStatus('saving');
    try {
      if ('id' in editingItem) {
        await api.put('/admin/timeline', editingItem);
        showToast(`Đã cập nhật mốc "${editingItem.role_vn || editingItem.role_en}"`, 'ok');
      } else {
        await api.post('/admin/timeline', editingItem);
        showToast('Đã thêm mốc mới thành công.', 'ok');
      }
      setStatus('ok');
      await loadTimeline();
      setEditingItem(null);
      window.dispatchEvent(new Event('timeline-updated'));
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e: any) {
      setStatus('error');
      showToast(`Lỗi: ${e.message || 'Không thể lưu.'}`, 'error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.del('/admin/timeline', { id: deleteTarget.id });
      await loadTimeline();
      window.dispatchEvent(new Event('timeline-updated'));
      showToast(`Đã xóa mốc "${deleteTarget.role_vn || deleteTarget.role_en}".`, 'ok');
      setDeleteTarget(null);
    } catch (e: any) {
      showToast(`Lỗi khi xóa: ${e.message || e}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (status !== 'saving') setEditingItem(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg border text-[13px] font-semibold backdrop-blur-md transition-all animate-bounce ${
          toast.type === 'ok'
            ? 'bg-white/90 dark:bg-zinc-800/90 border-black/5 dark:border-white/10 text-neutral-800 dark:text-neutral-200'
            : 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
        }`}>
          <span className={`font-bold ${toast.type === 'ok' ? 'text-green-500' : 'text-red-500'}`}>
            {toast.type === 'ok' ? '✓' : '✗'}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[14px] font-bold text-on-surface leading-snug">
            Timeline / Mốc lịch sử
          </h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            {items.length} mốc thời gian đã lưu
          </p>
        </div>
        <button
          onClick={() => setEditingItem({ ...EMPTY_ITEM, order_index: items.length })}
          className="bg-primary hover:bg-primary/90 text-on-primary px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Thêm mốc mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 flex flex-col items-center gap-3 text-on-surface-variant">
            <div className="w-6 h-6 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
            <span className="text-[13px]">Đang tải dữ liệu...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">history</span>
            </div>
            <p className="text-[14px] font-semibold text-on-surface mb-1">Chưa có mốc nào</p>
            <p className="text-[12px] text-on-surface-variant">Nhấn "Thêm mốc mới" để bắt đầu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant">
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider">Vai trò</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider">Đơn vị</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider">Khoảng thời gian</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider">Loại</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider text-center w-14">Order</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {items.map((item) => {
                  const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.work;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-surface-container-low/40 transition-colors group"
                    >
                      {/* Role */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-semibold text-on-surface leading-snug">
                            {item.role_vn || <span className="text-on-surface-variant italic">Chưa đặt</span>}
                          </span>
                          {item.role_en && item.role_en !== item.role_vn && (
                            <span className="text-[11px] text-on-surface-variant italic">{item.role_en}</span>
                          )}
                          {item.desc_vn?.length > 0 && (
                            <span className="text-[10px] text-on-surface-variant/60 mt-0.5">
                              {item.desc_vn.length} mô tả
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3">
                        {item.company_url ? (
                          <a
                            href={item.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-medium text-primary hover:underline flex items-center gap-0.5 w-fit"
                          >
                            {item.company}
                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </a>
                        ) : (
                          <span className="text-[13px] font-medium text-on-surface">{item.company}</span>
                        )}
                      </td>

                      {/* Period */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[12px] text-on-surface">{item.period_vn}</span>
                          {item.period_en && item.period_en !== item.period_vn && (
                            <span className="text-[11px] text-on-surface-variant italic">{item.period_en}</span>
                          )}
                        </div>
                      </td>

                      {/* Type badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className="material-symbols-outlined text-[13px]">{cfg.icon}</span>
                          {cfg.label}
                        </span>
                      </td>

                      {/* Order */}
                      <td className="px-4 py-3 text-center">
                        <span className="text-[12px] text-on-surface-variant font-mono">{item.order_index}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-error transition-colors"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit / Create Modal ────────────────────────────────────────────── */}
      {editingItem && (
        <div
          className="fixed inset-0 bg-on-surface/25 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div
            ref={modalRef}
            className="bg-surface border border-outline-variant rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-[0_24px_60px_rgba(0,0,0,0.18)] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 sticky top-0 bg-surface z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    {'id' in editingItem ? 'edit_note' : 'add_circle'}
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-on-surface">
                    {'id' in editingItem ? 'Chỉnh sửa mốc lịch sử' : 'Thêm mốc mới'}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    {'id' in editingItem
                      ? `ID #${(editingItem as TimelineItem).id} — ${editingItem.company || 'Chưa điền'}`
                      : 'Điền thông tin bên dưới để thêm mốc mới'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => status !== 'saving' && setEditingItem(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">

              {/* Basic Info Section */}
              <div>
                <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField label="Vai trò (VN) *">
                    <input
                      value={editingItem.role_vn}
                      onChange={e => setEditingItem({ ...editingItem, role_vn: e.target.value })}
                      placeholder="vd: Web Developer"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Vai trò (EN)">
                    <input
                      value={editingItem.role_en}
                      onChange={e => setEditingItem({ ...editingItem, role_en: e.target.value })}
                      placeholder="e.g. Web Developer"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Đơn vị / Company *">
                    <input
                      value={editingItem.company}
                      onChange={e => setEditingItem({ ...editingItem, company: e.target.value })}
                      placeholder="vd: Song Phương Technology"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="URL đơn vị (tùy chọn)">
                    <input
                      value={editingItem.company_url || ''}
                      onChange={e => setEditingItem({ ...editingItem, company_url: e.target.value })}
                      placeholder="https://..."
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Khoảng thời gian (VN) *">
                    <input
                      value={editingItem.period_vn}
                      onChange={e => setEditingItem({ ...editingItem, period_vn: e.target.value })}
                      placeholder="vd: Tháng 3, 2025 - Hiện tại"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Khoảng thời gian (EN)">
                    <input
                      value={editingItem.period_en}
                      onChange={e => setEditingItem({ ...editingItem, period_en: e.target.value })}
                      placeholder="e.g. Mar 2025 - Present"
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Loại / Type *">
                    <select
                      value={editingItem.type}
                      onChange={e => setEditingItem({ ...editingItem, type: e.target.value as any })}
                      className={inputCls}
                    >
                      <option value="work">💼 Work — Làm việc</option>
                      <option value="education">🎓 Education — Học tập</option>
                      <option value="freelance">💻 Freelance</option>
                    </select>
                  </FormField>
                  <FormField label="Order Index (thứ tự hiển thị)">
                    <input
                      type="number"
                      min={0}
                      value={editingItem.order_index}
                      onChange={e => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) || 0 })}
                      className={inputCls}
                    />
                  </FormField>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-t border-outline-variant/20 pt-5">
                <h4 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
                  Danh sách mô tả chi tiết
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-surface-container-lowest/60 border border-outline-variant/20 rounded-xl p-4">
                    <DescListEditor
                      label="🇻🇳 Mô tả tiếng Việt (desc_vn)"
                      items={editingItem.desc_vn || []}
                      onChange={updated => setEditingItem({ ...editingItem, desc_vn: updated })}
                      placeholder="Mô tả công việc hoặc học tập..."
                    />
                  </div>
                  <div className="bg-surface-container-lowest/60 border border-outline-variant/20 rounded-xl p-4">
                    <DescListEditor
                      label="🇺🇸 English Description (desc_en)"
                      items={editingItem.desc_en || []}
                      onChange={updated => setEditingItem({ ...editingItem, desc_en: updated })}
                      placeholder="Description of work or study..."
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-outline-variant/30 sticky bottom-0 bg-surface">
              <div className="text-[11px] text-on-surface-variant">
                {status === 'error' && (
                  <span className="text-error flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    Đã xảy ra lỗi khi lưu.
                  </span>
                )}
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setEditingItem(null)}
                  disabled={status === 'saving'}
                  className="px-5 py-2 bg-surface-container-highest/30 text-on-surface font-semibold text-[13px] rounded-xl hover:bg-surface-container-high transition-colors border border-outline-variant/50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={status === 'saving'}
                  className={`px-6 py-2 font-semibold text-[13px] rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center gap-1.5 ${
                    status === 'ok' ? 'bg-green-600 text-white' :
                    status === 'error' ? 'bg-error text-on-error' :
                    'bg-primary text-on-primary hover:bg-primary/90'
                  }`}
                >
                  {status === 'saving' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
                      Đang lưu...
                    </>
                  ) : status === 'ok' ? (
                    <>✓ Đã lưu</>
                  ) : status === 'error' ? (
                    <>✗ Thử lại</>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">
                        {'id' in editingItem ? 'save' : 'add'}
                      </span>
                      {'id' in editingItem ? 'Lưu thay đổi' : 'Thêm mốc mới'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete Dialog ─────────────────────────────────────────── */}
      {deleteTarget && (
        <ConfirmDeleteDialog
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
