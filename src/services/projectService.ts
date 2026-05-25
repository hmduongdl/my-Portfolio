import type { Project } from '../types/project';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiProject {
  id: string;
  name: string;
  category: string;
  color: string;
  tags: string[];
  description: string;
  demoUrl?: string | null;
  demo_url?: string | null;
  githubUrl?: string | null;
  github_url?: string | null;
}

function toProject(raw: ApiProject): Project {
  const demoUrlVal = raw.demoUrl !== undefined ? raw.demoUrl : raw.demo_url;
  const githubUrlVal = raw.githubUrl !== undefined ? raw.githubUrl : raw.github_url;
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category as Project['category'],
    color: raw.color,
    tags: raw.tags,
    desc: raw.description,
    demoUrl: demoUrlVal ?? undefined,
    githubUrl: githubUrlVal ?? undefined,
  };
}

export const projectService = {
  async getProjects(lang: 'en' | 'vn' = 'vn'): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects?lang=${lang}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data: ApiProject[] = await response.json();
    return data.map(toProject);
  },
};
