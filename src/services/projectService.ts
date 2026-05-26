import type { Project } from '../types/project';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiProject {
  id: string;
  name: string;
  category: string;
  color: string;
  tags: string[];
  desc: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
}

function toProject(raw: ApiProject): Project {
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category as Project['category'],
    color: raw.color,
    tags: raw.tags,
    desc: raw.desc,
    demoUrl: raw.demoUrl ?? undefined,
    githubUrl: raw.githubUrl ?? undefined,
  };
}

const cache: Record<string, any> = {};

if (typeof window !== 'undefined') {
  window.addEventListener('projects-updated', () => {
    delete cache.projects_vn;
    delete cache.projects_en;
  });
}

export const projectService = {
  async getProjects(lang: 'en' | 'vn' = 'vn'): Promise<Project[]> {
    const key = `projects_${lang}`;
    if (cache[key]) return cache[key];
    const response = await fetch(`${API_BASE_URL}/projects?lang=${lang}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data: ApiProject[] = await response.json();
    const mapped = data.map(toProject);
    cache[key] = mapped;
    return mapped;
  },

  clearCache() {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
};
