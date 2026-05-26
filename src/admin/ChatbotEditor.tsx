import React, { useState, useEffect, useRef } from 'react';
import { api } from './api';
import { ChatbotQA } from '../services/chatbotService';

type SaveStatus = 'idle' | 'saving' | 'ok' | 'error';

const EMPTY_ITEM: Omit<ChatbotQA, 'id'> = {
  question: '',
  answer: '',
  order_index: 0,
};

export const ChatbotEditor: React.FC = () => {
  const [items, setItems] = useState<ChatbotQA[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ChatbotQA | Omit<ChatbotQA, 'id'> | null>(null);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [deleteTarget, setDeleteTarget] = useState<ChatbotQA | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'error' } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load data
  const loadChatbot = async () => {
    setLoading(true);
    try {
      const data = await api.get<ChatbotQA[]>('/admin/chatbot');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      showToast('Không thể tải dữ liệu chatbot.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatbot();
  }, []);

  // Toast helper
  const showToast = (msg: string, type: 'ok' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (!editingItem) return;
    if (!editingItem.question || !editingItem.answer) {
      showToast('Vui lòng điền đầy đủ câu hỏi và câu trả lời.', 'error');
      return;
    }
    setStatus('saving');
    try {
      if ('id' in editingItem) {
        await api.put('/admin/chatbot', editingItem);
        showToast(`Đã cập nhật câu hỏi "${editingItem.question.slice(0, 30)}..."`, 'ok');
      } else {
        await api.post('/admin/chatbot', editingItem);
        showToast('Đã thêm câu hỏi gợi ý mới thành công.', 'ok');
      }
      setStatus('ok');
      await loadChatbot();
      setEditingItem(null);
      window.dispatchEvent(new Event('chatbot-updated'));
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
      await api.del('/admin/chatbot', { id: deleteTarget.id });
      showToast('Đã xóa thành công.', 'ok');
      setDeleteTarget(null);
      await loadChatbot();
      window.dispatchEvent(new Event('chatbot-updated'));
    } catch (e: any) {
      showToast(`Lỗi: ${e.message || 'Không thể xóa.'}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (status !== 'saving') setEditingItem(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[14px] font-bold text-on-surface leading-snug">
            Cấu hình Trợ lý ảo (Chatbot)
          </h2>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            {items.length} câu hỏi và câu trả lời gợi ý đã cấu hình
          </p>
        </div>
        <button
          onClick={() => setEditingItem({ ...EMPTY_ITEM, order_index: items.length + 1 })}
          className="bg-primary hover:bg-primary/90 text-on-primary px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Thêm câu hỏi
        </button>
      </div>

      {/* Grid or Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 flex flex-col items-center gap-3 text-on-surface-variant">
            <div className="w-6 h-6 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
            <span className="text-[13px]">Đang tải dữ liệu...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[28px]">chat</span>
            </div>
            <p className="text-[14px] font-semibold text-on-surface mb-1">Chưa có câu hỏi chatbot nào</p>
            <p className="text-[12px] text-on-surface-variant">Nhấn "Thêm câu hỏi" để bắt đầu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant">
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider w-12 text-center">STT</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider w-[35%]">Câu hỏi</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider">Câu trả lời</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider text-center w-14">Order</th>
                  <th className="px-4 py-3 font-semibold text-[11px] text-on-surface-variant uppercase tracking-wider text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-4 py-3 text-[12px] text-on-surface-variant text-center">{index + 1}</td>
                    <td className="px-4 py-3 text-[12px] font-medium text-on-surface leading-normal">{item.question}</td>
                    <td className="px-4 py-3 text-[12px] text-on-surface-variant leading-relaxed max-w-[400px] truncate">{item.answer}</td>
                    <td className="px-4 py-3 text-[12px] text-on-surface-variant text-center">{item.order_index}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="w-7 h-7 rounded-lg hover:bg-neutral-500/10 text-on-surface-variant flex items-center justify-center cursor-pointer transition-colors"
                          title="Sửa"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="w-7 h-7 rounded-lg hover:bg-red-500/10 text-red-500 flex items-center justify-center cursor-pointer transition-colors"
                          title="Xóa"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
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
        <div 
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            ref={modalRef}
            className="w-full max-w-[550px] bg-white dark:bg-zinc-900 border border-outline-variant rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-on-surface">
                {'id' in editingItem ? 'Chỉnh sửa câu hỏi & trả lời' : 'Thêm câu hỏi gợi ý mới'}
              </h3>
              <button 
                onClick={() => setEditingItem(null)}
                className="text-on-surface-variant hover:text-on-surface w-7 h-7 rounded-full hover:bg-surface-container flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Câu hỏi gợi ý</label>
                <input 
                  type="text" 
                  value={editingItem.question}
                  onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                  placeholder="Ví dụ: Hoàng Minh Dương đang làm việc ở đâu?"
                  className="w-full border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-[12px] text-on-surface outline-none transition-all"
                />
              </div>

              {/* Answer */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Câu trả lời tương ứng</label>
                <textarea 
                  value={editingItem.answer}
                  onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                  placeholder="Nhập nội dung câu trả lời chi tiết..."
                  rows={6}
                  className="w-full border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-[12px] text-on-surface outline-none transition-all resize-y"
                />
              </div>

              {/* Order Index */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Thứ tự hiển thị (Order Index)</label>
                <input 
                  type="number" 
                  value={editingItem.order_index}
                  onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value, 10) || 0 })}
                  className="w-32 border border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-2 text-[12px] text-on-surface outline-none transition-all"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-outline-variant bg-surface-container/30 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border border-outline-variant hover:bg-surface-container text-on-surface-variant rounded-xl text-[12px] font-semibold transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={status === 'saving'}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary rounded-xl text-[12px] font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                {status === 'saving' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu cấu hình'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[400px] bg-white dark:bg-zinc-900 border border-outline-variant rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-500">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <h3 className="text-[13px] font-bold text-on-surface">Xác nhận xóa câu hỏi gợi ý</h3>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này sẽ xóa vĩnh viễn cấu hình câu hỏi và câu trả lời trong cơ sở dữ liệu.
              </p>
              <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/50 text-[11px] italic text-on-surface-variant truncate">
                "{deleteTarget.question}"
              </div>
            </div>
            <div className="px-5 py-3 border-t border-outline-variant bg-surface-container/30 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-outline-variant hover:bg-surface-container text-on-surface-variant rounded-xl text-[12px] font-semibold transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-[12px] font-semibold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
