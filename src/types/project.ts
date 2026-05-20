export type ProjectCategory = 'web' | 'design' | 'tools';

export interface Project {
  id: string | number;
  name: string;
  category: ProjectCategory;
  tags: string[];
  desc: string;
  detailDesc?: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  color: string;
}
