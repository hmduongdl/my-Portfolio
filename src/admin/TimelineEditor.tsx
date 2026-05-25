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

const Divider = () => <div className="h-[1px] bg-outline-variant/30 mx-[12px]" />;

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
      const data = await api.get<TimelineItem[]>('/timeline');
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
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[13px] leading-[20px] font-bold text-on-surface-variant">Timeline Management</h2>
        <button
          onClick={() => setEditingItem({ ...EMPTY_ITEM, order_index: items.length })}
          className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors"
        >
          + Add New
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-4 text-on-surface-variant text-[13px]">Loading timeline...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-on-surface-variant text-[13px]">No timeline items found.</div>
        ) : (
          <div className="flex flex-col">
            {items.map((item, i) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center justify-between p-[12px] hover:bg-surface-container-low transition-colors">
                  <div>
                    <h3 className="text-[13px] font-semibold text-on-surface">{item.role_vn || item.role_en} <span className="text-on-surface-variant font-normal">at {item.company}</span></h3>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{item.period_vn || item.period_en} • {item.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this timeline item?')) {
                          fetch('/api/admin/timeline', {
                             method: 'DELETE',
                             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
                             body: JSON.stringify({ id: item.id })
                          }).then(() => loadTimeline());
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
                {i < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
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

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Description List (VN) - Valid JSON Array</label>
                <textarea rows={3} value={JSON.stringify(editingItem.desc_vn, null, 2)} onChange={e => {
                  try { setEditingItem({...editingItem, desc_vn: JSON.parse(e.target.value)}); } catch { /* Ignore until valid JSON */ }
                }} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] font-mono outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none shadow-inner" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-on-surface-variant mb-1 block">Description List (EN) - Valid JSON Array</label>
                <textarea rows={3} value={JSON.stringify(editingItem.desc_en, null, 2)} onChange={e => {
                  try { setEditingItem({...editingItem, desc_en: JSON.parse(e.target.value)}); } catch { /* Ignore until valid JSON */ }
                }} className="w-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-lg px-3 py-2 text-[13px] font-mono outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none shadow-inner" />
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
