import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { profileService } from '../services/profileService';
import { profileVN } from '../data/profileData';

export const MailApp: React.FC = () => {
  const [from, setFrom] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const language = useOSStore((state) => state.language);
  const [recipientEmail, setRecipientEmail] = useState<string>(profileVN.email);

  useEffect(() => {
    const loadProfile = () => {
      profileService.getProfile(language)
        .then((p) => {
          if (p && p.email) setRecipientEmail(p.email);
        })
        .catch(() => {});
    };

    loadProfile();

    window.addEventListener('profile-updated', loadProfile);
    return () => {
      window.removeEventListener('profile-updated', loadProfile);
    };
  }, [language]);

  const handleSend = () => {
    const e: Record<string, string> = {};
    if (!from || !/^\S+@\S+\.\S+$/.test(from)) e.from = 'Enter a valid email';
    if (!subject.trim()) e.subject = 'Subject required';
    if (!body.trim()) e.body = 'Message required';
    
    setErrors(e);
    
    if (Object.keys(e).length === 0) {
      const mailto = `mailto:${recipientEmail}?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject}`)}&body=${encodeURIComponent(`From: ${from}\n\n${body}`)}`;
      window.location.href = mailto;
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFrom('');
        setSubject('');
        setBody('');
      }, 2400);
    }
  };

  return (
    <div className="flex flex-col h-full select-text bg-paper">
      {/* Mail Toolbar */}
      <div className="bg-neutral-100/80 dark:bg-zinc-800/80 border-b border-black/5 dark:border-white/5 p-2 flex items-center space-x-2 backdrop-blur-md select-none flex-shrink-0">
        <button
          onClick={handleSend}
          className="bg-[#007AFF] hover:bg-[#0063CC] text-white rounded-md px-3 py-1 flex items-center space-x-1.5 text-xs font-medium transition-colors cursor-pointer border-none"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          <span>Send</span>
        </button>
        
        <button className="bg-transparent hover:bg-neutral-200/50 dark:hover:bg-zinc-700/50 text-ink-2 rounded-md p-1.5 w-7 h-7 flex items-center justify-center transition-colors cursor-pointer border-none">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        
        <div className="flex-1" />
        
        {sent && (
          <div className="text-[12px] text-success flex items-center gap-1.5 font-medium animate-pulse">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Message sent
          </div>
        )}
      </div>

      {/* Header Fields */}
      <div className="px-4 flex flex-col bg-paper flex-shrink-0">
        <div className="flex items-center border-b border-neutral-200/10 dark:border-white/5 py-1.5 gap-2">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 w-16 shrink-0">To:</span>
          <span className="text-[13px] font-medium text-ink">{recipientEmail}</span>
        </div>
        <div className="flex items-center border-b border-neutral-200/10 dark:border-white/5 py-1.5 gap-2">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 w-16 shrink-0">From:</span>
          <input
            placeholder="your.email@example.com"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border-none outline-none bg-transparent w-full text-[13px] font-sans text-ink placeholder:text-neutral-400/50"
            style={{ color: errors.from ? 'var(--error)' : 'var(--ink)' }}
          />
        </div>
        <div className="flex items-center border-b border-neutral-200/10 dark:border-white/5 py-1.5 gap-2">
          <span className="text-xs text-neutral-400 dark:text-neutral-500 w-16 shrink-0">Subject:</span>
          <input
            placeholder="What's this about?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border-none outline-none bg-transparent w-full text-[13px] font-semibold text-ink placeholder:text-neutral-400/50"
            style={{ color: errors.subject ? 'var(--error)' : 'var(--ink)' }}
          />
        </div>
      </div>

      {/* Editor Body */}
      <textarea
        placeholder="Write your message…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-4 rounded-b-xl w-full flex-grow resize-none outline-none border-none text-sm leading-relaxed"
        style={{ color: errors.body ? 'var(--error)' : 'var(--ink)' }}
      />
    </div>
  );
};
