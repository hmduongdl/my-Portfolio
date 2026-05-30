const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ProfileData {
    id: number;
    name: string;
    title: string;
    titleEn?: string;
    titleVn?: string;
    bio: string;
    bioEn?: string;
    bioVn?: string;
    avatarUrl?: string;
    email: string;
    phone?: string;
    githubUrl: string;
    facebookUrl: string;
    zaloUrl?: string;
    songphuongUrl: string;
}

export interface TimelineItem {
    id: number;
    role: string;
    company: string;
    companyUrl?: string;
    period: string;
    desc: string[];
    type: 'work' | 'education' | 'freelance';
}

const cache: Record<string, any> = {};
const pending: Record<string, Promise<any> | undefined> = {};

function preloadImage(src?: string) {
    if (!src || typeof window === 'undefined') return;
    const img = new Image();
    img.src = src;
}

if (typeof window !== 'undefined') {
    window.addEventListener('profile-updated', () => {
        delete cache.profile_vn;
        delete cache.profile_en;
        delete pending.profile_vn;
        delete pending.profile_en;
    });
    window.addEventListener('timeline-updated', () => {
        delete cache.timeline_vn;
        delete cache.timeline_en;
        delete pending.timeline_vn;
        delete pending.timeline_en;
    });
}

export const profileService = {
    async getProfile(lang: 'en' | 'vn' = 'vn'): Promise<ProfileData> {
        const key = `profile_${lang}`;
        if (cache[key]) return cache[key];
        if (pending[key]) return pending[key];

        pending[key] = fetch(`${API_BASE_URL}/profile?lang=${lang}`, { cache: 'no-store' })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch SQL profile');
                const data = await res.json();
                cache[key] = data;
                preloadImage(data.avatarUrl);
                return data;
            })
            .finally(() => {
                delete pending[key];
            });

        return pending[key];
    },

    getCachedProfile(lang: 'en' | 'vn' = 'vn'): ProfileData | null {
        return cache[`profile_${lang}`] || null;
    },

    async getTimeline(lang: 'en' | 'vn' = 'vn'): Promise<TimelineItem[]> {
        const key = `timeline_${lang}`;
        if (cache[key]) return cache[key];
        if (pending[key]) return pending[key];

        pending[key] = fetch(`${API_BASE_URL}/timeline?lang=${lang}`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch SQL timeline');
                const data = await res.json();
                cache[key] = data;
                return data;
            })
            .finally(() => {
                delete pending[key];
            });

        return pending[key];
    },

    getCachedTimeline(lang: 'en' | 'vn' = 'vn'): TimelineItem[] | null {
        return cache[`timeline_${lang}`] || null;
    },

    clearCache() {
        Object.keys(cache).forEach(k => delete cache[k]);
    }
};
