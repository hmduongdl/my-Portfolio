import React, { useEffect, useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { profileService, ProfileData, TimelineItem } from '../services/profileService';
import { techStack } from '../data/profileData';

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
  const language = useOSStore((s) => s.language);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const initials = profile?.name?.charAt(0).toUpperCase() ?? 'S';

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, timelineData] = await Promise.all([
        profileService.getProfile(language),
        profileService.getTimeline(language),
      ]);

      if (!profileData || !profileData.name) {
        throw new Error('Không nhận được dữ liệu hồ sơ');
      }
      if (!Array.isArray(timelineData) || timelineData.length === 0) {
        throw new Error('Không nhận được dữ liệu timeline');
      }

      setProfile(profileData);
      setTimeline(timelineData);
    } catch (err: unknown) {
      setProfile(null);
      setTimeline([]);
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  const ErrorPane: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-ink-3">
      <div className="text-3xl">⚠️</div>
      <div className="text-sm text-red-500">{error}</div>
      <button
        onClick={loadProfile}
        className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[12px] font-medium hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
      >
        Thử lại
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 px-10 py-7 select-text overflow-y-auto">
        <div className="flex flex-col items-center gap-3 w-full max-w-[440px]">
          <div className="w-[100px] h-[100px] rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-48 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-32 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="w-36 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        <div className="w-full max-w-[440px] space-y-3">
          <div className="h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center gap-6 px-10 py-7 select-text overflow-y-auto">
        <ErrorPane />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-10 py-7 select-text overflow-y-auto">

      {/* ── Header: Avatar + Name + Title + Company badge ── */}
      <div className="flex flex-col items-center gap-3">
        {avatarError || !profile.avatar ? (
          <div
            className="w-[100px] h-[100px] rounded-full shadow-md border border-gray-200/50 flex items-center justify-center select-none"
            style={{ background: 'linear-gradient(135deg, #c8c6c1 0%, #a8a5a0 100%)' }}
            aria-label={profile.name}
          >
            <span className="text-[38px] font-semibold text-white/80 leading-none">{initials}</span>
          </div>
        ) : (
          <img
            src={profile.avatar}
            alt={profile.name}
            onError={() => setAvatarError(true)}
            className="w-[100px] h-[100px] object-cover rounded-full shadow-md aspect-square border border-gray-200/50"
          />
        )}
        <div className="text-center">
          <div className="text-[21px] font-semibold tracking-tight text-ink leading-tight">
            {profile.name}
          </div>
          <div className="text-[13px] text-ink-3 mt-[3px]">{profile.title}</div>
          <a
            href={profile.songphuong_url}
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
              className={`flex items-baseline gap-4 py-2.5 text-[13px] ${i < techStack.length - 1 ? 'border-b border-rule' : ''}`}
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
          {timeline.map((item, i) => (
            <div key={`${item.role}-${i}`} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0 pt-[3px]">
                <div
                  className={`w-[11px] h-[11px] rounded-full border-2 bg-white shrink-0 ${dotAccent[item.type]}`}
                />
                {i < timeline.length - 1 && (
                  <div className="w-px flex-1 bg-rule mt-1 mb-0.5 min-h-[20px]" />
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
