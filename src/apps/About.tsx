import React, { useState } from 'react';
import { profileVN, techStack, experience } from '../data/profileData';

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
  const [avatarError, setAvatarError] = useState(false);
  const initials = profileVN.name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-6 px-10 py-7 select-text overflow-y-auto">

      {/* ── Header: Avatar + Name + Title + Company badge ── */}
      <div className="flex flex-col items-center gap-3">
        {avatarError ? (
          <div
            className="w-[100px] h-[100px] rounded-full shadow-md border border-gray-200/50 flex items-center justify-center select-none"
            style={{ background: 'linear-gradient(135deg, #c8c6c1 0%, #a8a5a0 100%)' }}
            aria-label={profileVN.name}
          >
            <span className="text-[38px] font-semibold text-white/80 leading-none">{initials}</span>
          </div>
        ) : (
          <img
            src={profileVN.avatar}
            alt={profileVN.name}
            onError={() => setAvatarError(true)}
            className="w-[100px] h-[100px] object-cover rounded-full shadow-md aspect-square border border-gray-200/50"
          />
        )}
        <div className="text-center">
          <div className="text-[21px] font-semibold tracking-tight text-ink leading-tight">
            {profileVN.name}
          </div>
          <div className="text-[13px] text-ink-3 mt-[3px]">{profileVN.title}</div>
          <a
            href={profileVN.songphuongUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-[3px] rounded-full bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 transition-colors duration-120"
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
        </div>
      </div>

      {/* ── Tech Stack ── */}
      <div className="w-full max-w-[440px]">
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
          Tech Stack
        </div>
        <div className="bg-paper-2 rounded-lg border border-rule px-4 py-0.5">
          {techStack.map((item, i) => (
            <div
              key={item.category}
              className={`flex items-baseline gap-4 py-2.5 text-[13px] ${
                i < techStack.length - 1 ? 'border-b border-rule' : ''
              }`}
            >
              <span className="text-ink-3 shrink-0 w-[72px]">{item.category}</span>
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
          {experience.map((item, i) => (
            <div key={i} className="flex gap-3">
              {/* Dot + connector line */}
              <div className="flex flex-col items-center shrink-0 pt-[3px]">
                <div
                  className={`w-[11px] h-[11px] rounded-full border-2 bg-white shrink-0 ${dotAccent[item.type]}`}
                />
                {i < experience.length - 1 && (
                  <div className="w-px flex-1 bg-rule mt-1 mb-0.5 min-h-[20px]" />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${i < experience.length - 1 ? 'pb-5' : 'pb-1'}`}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 leading-snug">
                  <span className="text-[13px] font-semibold text-ink">{item.role}</span>
                  {item.companyUrl ? (
                    <a
                      href={item.companyUrl}
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
                <div className="text-[11px] text-ink-4 mt-[2px] mb-2">{item.period}</div>
                <ul className="flex flex-col gap-[3px]">
                  {item.desc.map((d, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-[12px] text-ink-3 leading-[1.45]">
                      <span className="mt-[3px] text-[7px] text-ink-4 shrink-0">▸</span>
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
