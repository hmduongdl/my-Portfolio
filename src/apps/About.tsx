import React from 'react';
import { useOSStore } from '../store/useOSStore';
import { techStack, profileVN, timelineVN } from '../data/profileData';
import { ImageWithFallback } from '../components/desktop/ImageWithFallback';

const typeAccent: Record<string, string> = {
  work: 'border-primary text-primary',
  education: 'border-[#7A8C5C] text-[#7A8C5C]',
  freelance: 'border-[#C99A2E] text-[#C99A2E]',
};

const dotAccent: Record<string, string> = {
  work: 'border-primary',
  education: 'border-[#7A8C5C]',
  freelance: 'border-[#C99A2E]',
};

export const AboutApp: React.FC = () => {
  const language = useOSStore((state) => state.language);

  // Currently using static VN data. In the future, this can be toggled via language.
  const profile = language === 'vn' ? profileVN : profileVN;
  const timeline = language === 'vn' ? timelineVN : timelineVN;

  return (
    <div className="flex flex-col items-center gap-6 px-10 py-7 select-text overflow-y-auto w-full h-full">

      {/* ── Header: Avatar + Name + Title + Company badge ── */}
      <div className="flex flex-col items-center gap-3">
        <ImageWithFallback
          src="/my-avatar.jpg"
          alt={profile.name}
          fallbackText={profile.name}
          className="w-[100px] h-[100px] object-cover rounded-full shadow-md aspect-square border border-gray-200/50"
        />
        <div className="text-center">
          <div className="text-[21px] font-semibold tracking-tight text-ink leading-tight">
            {profile.name}
          </div>
          <div className="text-[13px] text-ink-3 mt-[3px] font-medium backdrop-blur-sm">
            {profile.title}
          </div>
          {profile.songphuong_url && (
            <a
              href={profile.songphuong_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-[3px] rounded-full bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 transition-colors duration-120 shadow-sm"
            >
              Song Phương Technology
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path
                  d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="w-full max-w-[440px]">
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          Tech Stack
        </div>
        <div className="bg-paper-2/80 backdrop-blur-md rounded-lg border border-rule px-4 py-0.5 shadow-sm">
          {techStack.map((item, i) => (
            <div
              key={item.category}
              className={`flex items-baseline gap-4 py-2.5 text-[13px] ${i < techStack.length - 1 ? 'border-b border-rule' : ''}`}
            >
              <span className="text-ink-3 shrink-0 w-[72px] font-medium">{item.category}</span>
              <span className="text-ink font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Experience & Education Timeline ── */}
      <div className="w-full max-w-[440px]">
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-3">
          Experience &amp; Education
        </div>

        <div className="flex flex-col">
          {timeline.map((item, i) => (
            <div key={`${item.role}-${i}`} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0 pt-[3px]">
                <div
                  className={`w-[11px] h-[11px] rounded-full border-[2.5px] bg-paper shrink-0 shadow-sm ${dotAccent[item.type]}`}
                />
                {i < timeline.length - 1 && (
                  <div className="w-px flex-1 border-l-[1.5px] border-dashed border-rule mt-1 mb-0.5 min-h-[20px]" />
                )}
              </div>

              <div className={`flex-1 ${i < timeline.length - 1 ? 'pb-5' : 'pb-1'}`}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-snug">
                  <span className="text-[13px] font-semibold text-ink">{item.role}</span>
                  {item.company_url ? (
                    <a
                      href={item.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[12px] font-medium hover:underline underline-offset-2 ${typeAccent[item.type].split(' ')[1]}`}
                    >
                      {item.company}
                    </a>
                  ) : (
                    <span className={`text-[12px] font-medium ${typeAccent[item.type].split(' ')[1]}`}>
                      {item.company}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-ink-4 mt-[2px] mb-2 font-medium opacity-80">{item.period}</div>
                <ul className="flex flex-col gap-[4px]">
                  {item.desc.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-[12.5px] text-ink-3 leading-[1.5]">
                      <span className="mt-[6px] w-[3px] h-[3px] rounded-full bg-ink-4 shrink-0"></span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
