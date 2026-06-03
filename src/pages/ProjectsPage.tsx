import React, { useEffect, useMemo, useState } from 'react';
import { SEOHead } from '../components/shared/SEOHead';

type ProjectCategory = 'web' | 'design' | 'tools';

interface SeoProject {
  id: string | number;
  name: string;
  category: ProjectCategory;
  tags: string[];
  desc?: string;
  desc_vn?: string;
  desc_en?: string;
  demoUrl?: string | null;
  githubUrl?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
}

const STATIC_PROJECTS: SeoProject[] = [
  {
    id: 'portfolio-macos',
    name: 'Song Phương macOS Portfolio',
    category: 'web',
    tags: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    desc_vn: 'Portfolio tương tác phong cách macOS, tích hợp hệ thống cửa sổ kéo-thả, Dock và thanh menu. Cá nhân xây dựng toàn bộ UI/UX & logic state cho Song Phương Technology.',
    desc_en: 'Interactive macOS-style portfolio with draggable windows, Dock, and menu bar. Personally designed the full UI/UX & state architecture for Song Phương Technology.',
    demo_url: 'https://songphuong.vn',
    github_url: 'https://github.com/hmduongdl',
  },
  {
    id: 'ecommerce-integration',
    name: 'E-Commerce System Integration',
    category: 'web',
    tags: ['Node.js', 'Express', 'SQL Server', 'RESTful API'],
    desc_vn: 'Hệ thống tích hợp thương mại điện tử với RESTful API, quản lý sản phẩm & đơn hàng, backend SQL Server. Cá nhân thiết kế kiến trúc API và tối ưu hóa query cho Song Phương Technology.',
    desc_en: 'Full-stack e-commerce integration with RESTful API, product & order management, and SQL Server backend. Personally designed API architecture and optimized queries for Song Phương Technology.',
    github_url: 'https://github.com/hmduongdl',
  },
  {
    id: 'brand-identity',
    name: 'Song Phương Brand Identity & Visual Assets',
    category: 'design',
    tags: ['Photoshop', 'Illustrator', 'Figma', '2D Design'],
    desc_vn: 'Bộ nhận diện thương hiệu đầy đủ: thiết kế logo, hệ màu, typography và tài sản kỹ thuật số/in ấn. Cá nhân thực hiện toàn bộ từ concept đến xuất file sản xuất cho Song Phương Technology.',
    desc_en: 'Comprehensive brand identity package: logo, color system, typography, and digital/print assets. Personally handled the full workflow from concept to production-ready files for Song Phương Technology.',
  },
  {
    id: 'auto-backup-tool',
    name: 'Auto Backup Tool & Database Syncer',
    category: 'tools',
    tags: ['Python', 'CronJob', 'SQL Shell'],
    desc_vn: 'Công cụ sao lưu tự động và đồng bộ cơ sở dữ liệu, chạy theo lịch với CronJob. Cá nhân viết script và thiết lập pipeline đồng bộ dev-production.',
    desc_en: 'Automated database backup and sync tool with scheduled CronJob execution and SQL Shell scripting. Personally wrote the scripts and set up the dev-production sync pipeline.',
    github_url: 'https://github.com/hmduongdl',
  },
];

const PROJECT_SECTIONS: Array<{ category: ProjectCategory; title: string; desc: string }> = [
  {
    category: 'web',
    title: 'Lập trình Web',
    desc: 'Các dự án frontend, backend, REST API và hệ thống portfolio tương tác.',
  },
  {
    category: 'design',
    title: 'Thiết kế đồ họa UI/UX',
    desc: 'Các dự án nhận diện thương hiệu, giao diện sản phẩm và tài sản thiết kế số.',
  },
  {
    category: 'tools',
    title: 'Công cụ hệ thống',
    desc: 'Các tiện ích tự động hóa, đồng bộ dữ liệu và công cụ hỗ trợ vận hành.',
  },
];

function getProjectDesc(project: SeoProject): string {
  return project.desc_vn || project.desc || project.desc_en || 'Thông tin mô tả dự án đang được cập nhật.';
}

function getProjectUrl(project: SeoProject, key: 'demo' | 'github'): string | null {
  if (key === 'demo') return project.demo_url || project.demoUrl || null;
  return project.github_url || project.githubUrl || null;
}

const ProjectCard: React.FC<{ project: SeoProject }> = ({ project }) => {
  const demoUrl = getProjectUrl(project, 'demo');
  const githubUrl = getProjectUrl(project, 'github');

  return (
    <article className="p-6 bg-zinc-900/50 rounded-xl border border-white/5">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{project.name}</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{getProjectDesc(project)}</p>
        </div>

        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label={`Công nghệ trong dự án ${project.name}`}>
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {(demoUrl || githubUrl) && (
          <div className="flex flex-wrap gap-3 pt-1">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                Live Demo
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<SeoProject[]>(STATIC_PROJECTS);

  useEffect(() => {
    let active = true;

    fetch('/api/projects?lang=vn')
      .then(async (response) => {
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
        const data: SeoProject[] = await response.json();
        if (active && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch((error) => {
        console.warn('Không thể tải dữ liệu dự án từ API, đang dùng dữ liệu tĩnh.', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const groupedProjects = useMemo(
    () =>
      PROJECT_SECTIONS.map((section) => ({
        ...section,
        projects: projects.filter((project) => project.category === section.category),
      })),
    [projects],
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8 lg:px-10">
      <SEOHead 
        title="Dự án & Portfolio — Hoàng Minh Dương | Song Phương Technology" 
        description="Khám phá danh sách tổng hợp các dự án lập trình ứng dụng React/Node.js và các giải pháp thiết kế phòng máy gaming center cao cấp của Song Phương."
      />
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-white/10 pb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Portfolio SEO</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Dự án & Portfolio — Hoàng Minh Dương | Song Phương Technology
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
            Danh sách dự án lập trình, thiết kế UI/UX và công cụ hệ thống được trình bày dạng nội dung tĩnh, rõ chữ và dễ thu thập dữ liệu cho công cụ tìm kiếm.
          </p>
        </header>

        <div className="mt-10 space-y-12">
          {groupedProjects.map((section) => (
            <section key={section.category} aria-labelledby={`projects-${section.category}`}>
              <div className="mb-5">
                <h2 id={`projects-${section.category}`} className="text-2xl font-semibold text-white">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{section.desc}</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {section.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
