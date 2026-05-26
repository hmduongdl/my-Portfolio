import React, { useEffect, useState } from 'react';
import { api } from './api';

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
  type: 'work', order_index: 0
};

export const TimelineEditor: React.FC = () => {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<TimelineItem | Omit<TimelineItem, 'id'> | null>(null);
  const [status, setStatus] = useState<SaveStatus>('idle');

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    setLoading(true);
    try {
      const data = await api.get<TimelineItem[]>('/admin/timeline');
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setStatus('saving');
    try {
      if ('id' in editingItem) {
        await api.put('/admin/timeline', editingItem);
      } else {
        await api.post('/admin/timeline', editingItem);
      }
      setStatus('ok');
      await loadTimeline();
      setEditingItem(null);
      window.dispatchEvent(new Event('timeline-updated'));
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[14px] leading-[22px] font-bold text-on-surface">Timeline Management / Quản lý mốc thời gian</h2>
        <button
          onClick={() => setEditingItem({ ...EMPTY_ITEM, order_index: items.length })}
          className="bg-primary hover:bg-primary-container text-on-primary px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Thêm mốc mới
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 text-on-surface-variant text-[13px] flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
            Đang tải dữ liệu...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant text-[13px]">
            Chưa có mốc thời gian nào. Hãy thêm mốc mới để bắt đầu.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="px-4 py-3 font-semibold text-[12px] text-on-surface-variant">Vai trò / Role</th>
                  <th className="px-4 py-3 font-semibold text-[12px] text-on-surface-variant">Đơn vị / Company</th>
                  <th className="px-4 py-3 font-semibold text-[12px] text-on-surface-variant">Khoảng thời gian / Period</th>
                  <th className="px-4 py-3 font-semibold text-[12px] text-on-surface-variant">Loại / Type</th>
                  <th className="px-4 py-3 font-semibold text-[12px] text-on-surface-variant text-center w-[60px]">Sắp xếp</th>
                  <th className="px-4 py-3 font-semibold text-[12px] text-on-surface-variant text-right w-[110px]">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-on-surface">{item.role_vn || 'Chưa đặt'}</span>
                        <span className="text-[11px] text-on-surface-variant italic">{item.role_en}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        {item.company_url ? (
                          <a 
                            href={item.company_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[13px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                          >
                            {item.company}
                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </a>
                        ) : (
                          <span className="text-[13px] font-semibold text-on-surface">{item.company}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-[12px] text-on-surface">{item.period_vn}</span>
                        <span className="text-[11px] text-on-surface-variant italic">{item.period_en}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        item.type === 'work' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        item.type === 'education' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        {item.type === 'work' ? 'Work' : item.type === 'education' ? 'Education' : 'Freelance'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-[12px] text-on-surface-variant">
                      {item.order_index}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-primary transition-colors"
                          title="Sửa / Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(`Bạn có chắc chắn muốn xóa mốc "${item.role_vn || item.role_en}" tại ${item.company}?`)) {
                              try {
                                await api.del('/admin/timeline', { id: item.id });
                                await loadTimeline();
                                window.dispatchEvent(new Event('timeline-updated'));
                              } catch (e: any) {
                                alert(`Lỗi khi xóa: ${e.message || e}`);
                              }
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-error transition-colors"
                          title="Xóa / Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-outline-variant rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col">
            
            <h3 className="text-[19px] font-bold text-on-surface mb-6">
              {'id' in editingItem ? 'Edit Timeline Item' : 'New Timeline Item'}
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Role (VN)</label>
                <input value={editingItem.role_vn} onChange={e => setEditingItem({...editingItem, role_vn: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Role (EN)</label>
                <input value={editingItem.role_en} onChange={e => setEditingItem({...editingItem, role_en: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Company</label>
                <input value={editingItem.company} onChange={e => setEditingItem({...editingItem, company: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Company URL</label>
                <input value={editingItem.company_url || ''} onChange={e => setEditingItem({...editingItem, company_url: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Period (VN)</label>
                <input value={editingItem.period_vn} onChange={e => setEditingItem({...editingItem, period_vn: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Period (EN)</label>
                <input value={editingItem.period_en} onChange={e => setEditingItem({...editingItem, period_en: e.target.value})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Type</label>
                <select value={editingItem.type} onChange={e => setEditingItem({...editingItem, type: e.target.value as any})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all">
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Order Index</label>
                <input type="number" value={editingItem.order_index} onChange={e => setEditingItem({...editingItem, order_index: parseInt(e.target.value) || 0})} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
              </div>
            </div>

            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 border border-outline-variant/20 p-4 rounded-xl bg-surface-container-lowest/50">
              <div>
                <label className="text-[11px] font-bold text-on-surface-variant mb-2 block uppercase tracking-wider">Description List (VN) / Mô tả tiếng Việt</label>
                <div className="space-y-2">
                  {(editingItem.desc_vn || []).map((desc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[13px] text-on-surface-variant shrink-0">•</span>
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) => {
                          const updated = [...(editingItem.desc_vn || [])];
                          updated[idx] = e.target.value;
                          setEditingItem({ ...editingItem, desc_vn: updated });
                        }}
                        placeholder="Mô tả công việc hoặc học tập..."
                        className="flex-1 bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingItem.desc_vn || []).filter((_, i) => i !== idx);
                          setEditingItem({ ...editingItem, desc_vn: updated });
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-error transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(editingItem.desc_vn || []), ''];
                      setEditingItem({ ...editingItem, desc_vn: updated });
                    }}
                    className="flex items-center gap-1.5 text-primary text-[12px] font-semibold hover:text-primary-container transition-colors mt-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add line / Thêm dòng mới</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-4">
                <label className="text-[11px] font-bold text-on-surface-variant mb-2 block uppercase tracking-wider">Description List (EN) / Mô tả tiếng Anh</label>
                <div className="space-y-2">
                  {(editingItem.desc_en || []).map((desc, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-[13px] text-on-surface-variant shrink-0">•</span>
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) => {
                          const updated = [...(editingItem.desc_en || [])];
                          updated[idx] = e.target.value;
                          setEditingItem({ ...editingItem, desc_en: updated });
                        }}
                        placeholder="Description of job or study..."
                        className="flex-1 bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingItem.desc_en || []).filter((_, i) => i !== idx);
                          setEditingItem({ ...editingItem, desc_en: updated });
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-error transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(editingItem.desc_en || []), ''];
                      setEditingItem({ ...editingItem, desc_en: updated });
                    }}
                    className="flex items-center gap-1.5 text-primary text-[12px] font-semibold hover:text-primary-container transition-colors mt-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add line / Thêm dòng mới</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button 
                onClick={() => setEditingItem(null)} 
                className="px-6 py-1.5 bg-surface-container-highest/30 text-on-surface font-semibold text-[13px] rounded-lg hover:bg-surface-container-highest transition-colors border border-outline-variant/50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={status === 'saving'}
                className={`px-6 py-1.5 font-semibold text-[13px] rounded-lg transition-all active:scale-95 shadow-sm disabled:opacity-50 ${
                  status === 'ok' ? 'bg-green-600 text-white' :
                  status === 'error' ? 'bg-error text-on-error' :
                  'bg-primary text-on-primary hover:bg-primary-container'
                }`}
              >
                {status === 'saving' ? 'Saving...' : 
                 status === 'ok' ? '✓ Saved' :
                 status === 'error' ? '✗ Error' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
