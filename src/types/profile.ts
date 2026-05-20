export interface TechItem {
  name: string;
  category: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  desc: string[];
  type: 'work' | 'education' | 'freelance';
}

export interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  email: string;
  phone: string;
  github: string;
  facebook: string;
  zalo: string;
  songphuongUrl: string;
}
