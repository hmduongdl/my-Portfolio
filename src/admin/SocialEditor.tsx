import React, { useEffect, useState } from 'react';
import { api } from './api';

interface SocialLink {
  id: number;
  platform: string;
  label: string;
  url: string;
  visible: boolean;
  order_index: number;
}

const ICONS: Record<string, string> = {
  github: '⛓', facebook: '📘', gmail: '📧', phone: '📞', zalo: '💬',
};

const Toggle: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    title={on ? 'Đang hiện — nhấn để ẩn' : 'Đang ẩn — nhấn để hiện'}
    className={`relative inline-flex w-10 h-5.5 rounded-full transition-colors shrink-0 ${on ? 'bg-blue-600' : 'bg-gray-700'}`}
    style={{ height: '22px' }}
  >
    <span
      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-150 ${on ? 'left-[22px]' : 'left-0.5'}`}
    />
  </button>
);

export const SocialEditor: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    api.get<SocialLink[]>('/social')
      .then((d) => setLinks(d ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const update = (id: number, patch: Partial<SocialLink>) =>
    setLinks((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const save = async (link: SocialLink) => {
    setSaving((s) => ({ ...s, [link.id]: true }));
    setErrors((e) => ({ ...e, [link.id]: '' }));
    try {
      await api.put(`/social/${link.id}`, {
        url: link.url,
        visible: link.visible,
        order_index: link.order_index,
      });
      setSaved((s) => ({ ...s, [link.id]: true }));
      setTimeout(() => setSaved((s) => ({ ...s, [link.id]: false })), 1500);
    } catch (err) {
      setErrors((e) => ({ ...e, [link.id]: String(err) }));
    } finally {
      setSaving((s) => ({ ...s, [link.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        Đang tải...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Social Links</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Toggle hiển thị/ẩn và cập nhật URL cho từng mạng xã hội
        </p>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className={`bg-gray-900 border rounded-xl p-4 transition-all ${
              link.visible ? 'border-gray-800' : 'border-gray-800/40 opacity-55'
            }`}
          >
            {/* Header row */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl w-7 text-center select-none">
                {ICONS[link.platform] ?? '🔗'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{link.label}</p>
                <p className="text-xs text-gray-600 capitalize">{link.platform}</p>
              </div>
              {/* Toggle */}
              <Toggle
                on={link.visible}
                onChange={(v) => update(link.id, { visible: v })}
              />
              <span className={`text-xs w-10 shrink-0 ${link.visible ? 'text-blue-400' : 'text-gray-600'}`}>
                {link.visible ? 'Hiện' : 'Ẩn'}
              </span>
            </div>

            {/* URL row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={link.url}
                onChange={(e) => update(link.id, { url: e.target.value })}
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-blue-500 transition-colors"
                placeholder="https:// hoặc mailto: hoặc tel:"
              />
              <button
                onClick={() => save(link)}
                disabled={saving[link.id]}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  saved[link.id]
                    ? 'bg-green-600'
                    : saving[link.id]
                    ? 'bg-gray-700 opacity-60'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {saved[link.id] ? '✓' : saving[link.id] ? '...' : 'Lưu'}
              </button>
            </div>

            {errors[link.id] && (
              <p className="text-red-400 text-xs mt-1.5">{errors[link.id]}</p>
            )}
          </div>
        ))}
      </div>

      <p className="text-gray-700 text-xs mt-6">
        Lưu ý: Toggle ẩn/hiện cũng cần nhấn Lưu để có hiệu lực.
      </p>
    </div>
  );
};
