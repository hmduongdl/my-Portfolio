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
