const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ProfileData {
    name: string;
    title: string;
    bio: string;
    email: string;
    github: string;
    facebook: string;
    songphuong_url: string;
    avatar?: string;
}

export interface TimelineItem {
    role: string;
    company: string;
    company_url?: string;
    period: string;
    desc: string[];
    type: 'work' | 'education' | 'freelance';
}

export const profileService = {
    async getProfile(lang: 'en' | 'vn' = 'vn'): Promise<ProfileData> {
        const res = await fetch(`${API_BASE_URL}/profile?lang=${lang}`);
        if (!res.ok) throw new Error('Failed to fetch SQL profile');
        return res.json();
    },

    async getTimeline(lang: 'en' | 'vn' = 'vn'): Promise<TimelineItem[]> {
        const res = await fetch(`${API_BASE_URL}/timeline?lang=${lang}`);
        if (!res.ok) throw new Error('Failed to fetch SQL timeline');
        return res.json();
    },
};
