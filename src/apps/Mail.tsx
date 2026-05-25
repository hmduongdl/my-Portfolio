import React, { useState } from 'react';

export const MailApp: React.FC = () => {
  const [from, setFrom] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSend = () => {
    const e: Record<string, string> = {};
    if (!from || !/^\S+@\S+\.\S+$/.test(from)) e.from = 'Enter a valid email';
    if (!subject.trim()) e.subject = 'Subject required';
    if (!body.trim()) e.body = 'Message required';
    
    setErrors(e);
    
    if (Object.keys(e).length === 0) {
      const mailto = `mailto:hoanglong.workdl@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject}`)}&body=${encodeURIComponent(`From: ${from}\n\n${body}`)}`;
      window.open(mailto, '_blank');
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
      <div className="flex gap-1.5 px-3.5 py-2 border-b border-rule bg-paper-2 select-none flex-shrink-0">
        <button
          onClick={handleSend}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md border border-rule-strong bg-white hover:bg-paper-2 text-[13px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer transition-colors duration-120"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          Send
        </button>
        
        <button className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md border border-rule-strong bg-white hover:bg-paper-2 text-[13px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer transition-colors duration-120">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
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
      <div className="px-3.5 py-1 border-b border-rule grid grid-cols-[60px_1fr] items-center">
        <div className="text-xs text-ink-3">To:</div>
        <div className="py-1.5 text-[13px] font-medium text-ink">hoanglong.workdl@gmail.com</div>
        
        <div className="text-xs text-ink-3 border-t border-rule py-2">From:</div>
        <input
          placeholder="your.email@example.com"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border-none outline-none py-1.5 text-[13px] font-sans border-t border-rule bg-transparent w-full"
          style={{ color: errors.from ? 'var(--error)' : 'var(--ink)' }}
        />
        
        <div className="text-xs text-ink-3 border-t border-rule py-2">Subject:</div>
        <input
          placeholder="What's this about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border-none outline-none py-1.5 text-[13px] font-semibold border-t border-rule bg-transparent w-full"
          style={{ color: errors.subject ? 'var(--error)' : 'var(--ink)' }}
        />
      </div>

      {/* Editor Body */}
      <textarea
        placeholder="Write your message…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="flex-1 border-none outline-none p-[18px] text-[14px] font-sans resize-none bg-transparent leading-relaxed"
        style={{ color: errors.body ? 'var(--error)' : 'var(--ink)' }}
      />
    </div>
  );
};
