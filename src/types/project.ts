export type ProjectCategory = 'web' | 'design' | 'tools';

export interface DesignDetails {
  client?: string;
  deliverables?: string[];
  tools?: string[];
  beforeAfter?: { beforeImg: string; afterImg: string; caption?: string };
  gallery?: { url: string; caption?: string; type: 'image' | 'palette' | 'typography' }[];
  brief?: string;
  process?: { step: string; desc: string }[];
  outcome?: string;
}

export interface ToolDetails {
  version?: string;
  platforms?: string[];
  terminalDemo?: {
    command: string;
    output: { type: 'success' | 'error' | 'info'; text: string }[];
  };
  installCmd?: string;
  usageCmds?: { cmd: string; desc: string }[];
  screenshots?: { url: string; caption?: string }[];
  whyBuilt?: string;
  howItWorks?: { step: string; desc: string }[];
}

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
  duration?: string;
  role?: string;
  status?: string;
  type?: string;
  achievement?: string;
  techStack?: any;
  features?: any;
  designDetails?: DesignDetails;
  design_details_vn?: DesignDetails;
  design_details_en?: DesignDetails;
  toolDetails?: ToolDetails;
  tool_details_vn?: ToolDetails;
  tool_details_en?: ToolDetails;
}
