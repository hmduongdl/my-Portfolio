import React, { useState, useEffect, useRef } from 'react';
import { chatbotService, ChatbotQA } from '../../services/chatbotService';
import { profileService } from '../../services/profileService';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export const MascotChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [qaList, setQaList] = useState<ChatbotQA[]>(() => chatbotService.getCachedQAList() || []);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Xin chào! Mình là SP-Bot, trợ lý ảo của anh Hoàng Minh Dương. Mình ở đây để giúp bạn tìm hiểu nhanh về kinh nghiệm, học vấn và các dự án của anh Dương. Bạn muốn hỏi gì nào?'
    }
  ]);
  const [askedIds, setAskedIds] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [hotline, setHotline] = useState(() => profileService.getCachedProfile('vn')?.phone || '');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Q&A List on mount
  useEffect(() => {
    const loadQAList = () => {
      const cachedQAList = chatbotService.getCachedQAList();
      if (cachedQAList) setQaList(cachedQAList);

      chatbotService.getQAList()
      .then(data => setQaList(data))
      .catch(err => {
        console.error('Error fetching Q&As:', err);
        setQaList([]);
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: 'Không tải được danh sách câu hỏi từ database. Vui lòng kiểm tra kết nối hoặc dữ liệu chatbot trong admin.' }
        ]);
      });
    };

    loadQAList();

    window.addEventListener('chatbot-updated', loadQAList);
    return () => window.removeEventListener('chatbot-updated', loadQAList);
  }, []);

  useEffect(() => {
    const cachedProfile = profileService.getCachedProfile('vn');
    if (cachedProfile?.phone) setHotline(cachedProfile.phone);

    profileService.getProfile('vn')
      .then((profile) => setHotline(profile?.phone || ''))
      .catch((err) => {
        console.error('Error fetching hotline:', err);
        setHotline('');
      });
  }, []);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Hide initial greeting bubble after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  // Handle Mascot click
  const handleMascotClick = () => {
    setIsOpen(!isOpen);
    setShowBubble(false);
  };

  // Handle click on suggested question
  const handleQuestionSelect = (qa: ChatbotQA) => {
    if (isResponding) return;

    setIsResponding(true);
    // 1. Add User Message
    setMessages(prev => [...prev, { sender: 'user', text: qa.question }]);
    // 2. Add question to asked list
    setAskedIds(prev => [...prev, qa.id]);
    
    // 3. Trigger typing simulation
    setIsTyping(true);

    // Simulated thinking delay (1.2s)
    setTimeout(() => {
      setIsTyping(false);

      // 4. Start streaming response
      const fullAnswer = qa.answer;
      let streamedText = '';
      let charIndex = 0;

      // Add empty bot message that we will populate
      setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

      const streamInterval = setInterval(() => {
        if (charIndex < fullAnswer.length) {
          streamedText += fullAnswer[charIndex];
          setMessages(prev => {
            const copy = [...prev];
            if (copy[copy.length - 1]) {
              copy[copy.length - 1].text = streamedText;
            }
            return copy;
          });
          charIndex++;
        } else {
          clearInterval(streamInterval);
          setIsResponding(false); // Typing completed
        }
      }, 12); // Stream speed: 12ms per char
    }, 1000);
  };

  // Reset asked list to allow asking again
  const handleReset = () => {
    setAskedIds([]);
    setMessages(prev => [
      ...prev,
      { sender: 'user', text: 'Hỏi lại từ đầu' },
      { sender: 'bot', text: 'Đã thiết lập lại câu hỏi gợi ý. Bạn có thể hỏi lại các câu hỏi dưới đây!' }
    ]);
  };

  // Filter remaining suggestions (limit to 3)
  const remainingSuggestions = qaList
    .filter(item => !askedIds.includes(item.id))
    .slice(0, 3);
  const cleanHotline = hotline.replace(/^tel:/i, '').replace(/[^\d+]/g, '');

  return (
    <div className="fixed bottom-[45px] right-[45px] xl:right-[54px] z-[900] hidden md:flex flex-col items-end pointer-events-none select-none">
      
      {/* Speech bubble welcome notification */}
      {showBubble && !isOpen && (
        <div className="pointer-events-auto relative mb-3 w-[280px] xl:w-[340px] bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.5)] p-3.5 xl:p-4 rounded-2xl text-xs xl:text-sm text-zinc-300 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
            className="absolute top-2 right-2 text-zinc-500 hover:text-white transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div className="font-semibold text-white flex items-center gap-1">
            <span>🤖</span> Trợ lý ảo SP-Bot
          </div>
          <div className="leading-relaxed pr-3">
            Tôi ở đây để hỗ trợ bạn tìm hiểu về Hoàng Minh Dương và Song Phương. Cần hỗ trợ gì cứ click nhé!
          </div>
          {/* Arrow */}
          <div className="absolute right-6 xl:right-7 -bottom-1.5 w-3 h-3 bg-[#1e1e1e]/95 border-r border-b border-white/10 dark:border-white/5 rotate-45 z-[-1]" />
        </div>
      )}

      {/* Main Chatbox Window */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[350px] h-[480px] xl:w-[420px] xl:h-[580px] xl:text-[14px] bg-zinc-950/90 backdrop-blur-3xl border border-white/10 dark:border-white/5 shadow-[0_22px_70px_rgba(0,0,0,0.55)] rounded-3xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-300">
          
          {/* Chat Header */}
          <div className="px-4 xl:px-5 py-3 xl:py-4 flex items-center justify-between border-b border-white/10 bg-[#1e1e1e]/95">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 xl:w-11 xl:h-11 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-400/30 text-lg xl:text-2xl">
                🤖
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 xl:w-3 xl:h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] xl:text-[15px] font-bold text-white leading-tight">SP-Bot Assistant</span>
                <span className="text-[10px] xl:text-[12px] text-emerald-400 font-medium leading-tight">Trực tuyến</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-zinc-300 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Chat Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 xl:p-5 flex flex-col gap-3 xl:gap-4 bg-zinc-950/70">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                }`}
              >
                <div
                  className={`px-3.5 xl:px-4 py-2.5 xl:py-3 text-[13px] xl:text-[14px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.18)] rounded-2xl whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#007AFF] text-white rounded-tr-none'
                      : 'bg-[#2d2d2d] text-neutral-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Bouncing dots typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-[#2d2d2d] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 max-w-[64px] self-start shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Recommended suggestions Footer */}
          <div className="p-3 xl:p-4 border-t border-white/10 bg-[#1e1e1e]/95 flex flex-col gap-2 shrink-0">
            {remainingSuggestions.length > 0 ? (
              <>
                <div className="text-[10px] xl:text-[11px] font-semibold text-zinc-500 px-1 uppercase tracking-wider">
                  Gợi ý câu hỏi
                </div>
                <div className="flex flex-col gap-1.5">
                  {remainingSuggestions.map((qa) => (
                    <button
                      key={qa.id}
                      disabled={isResponding}
                      onClick={() => handleQuestionSelect(qa)}
                      className="w-full text-left px-3 xl:px-3.5 py-2 xl:py-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 text-xs xl:text-[13px] font-semibold rounded-xl border border-emerald-500/20 transition-all hover:translate-x-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer truncate"
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-1.5 py-1">
                <div className="text-center text-[11px] xl:text-xs text-zinc-500 mb-1">
                  Đã xem tất cả gợi ý.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    disabled={isResponding}
                    className="flex-1 py-2 bg-[#007AFF] hover:bg-[#0a84ff] text-white text-xs xl:text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    🔄 Hỏi lại từ đầu
                  </button>
                  <a
                    href={cleanHotline ? `tel:${cleanHotline}` : undefined}
                    aria-disabled={!cleanHotline}
                    onClick={(e) => {
                      if (!cleanHotline) e.preventDefault();
                    }}
                    className={`flex-1 py-2 text-zinc-300 text-xs xl:text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1 border border-white/10 ${cleanHotline ? 'bg-white/5 hover:bg-white/10' : 'bg-white/5 opacity-50 cursor-not-allowed'}`}
                  >
                    📞 Gọi Hotline
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mascot circular floating button */}
      <div 
        onClick={handleMascotClick}
        className="pointer-events-auto relative w-12 h-12 xl:w-14 xl:h-14 bg-[#1e1e1e]/95 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_14px_44px_rgba(0,0,0,0.55)] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping" style={{ animationDuration: '2s' }}></div>
        {/* Animated Glowing Ring */}
        <div className={`absolute inset-0.5 rounded-full border border-emerald-400/20 ${isOpen ? 'bg-emerald-500/20' : ''}`} />
        
        {/* Mascot Face Icon */}
        <span className="text-2xl xl:text-3xl drop-shadow-md transform hover:rotate-12 transition-transform">
          🤖
        </span>
      </div>

    </div>
  );
};
