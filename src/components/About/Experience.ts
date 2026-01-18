import { Experience } from '../../types';

export const renderExperience = (): string => {
  const experiences: Experience[] = [
    {
      role: 'Education',
      company: 'Da Lat University',
      period: 'Aug 2025 - 2029',
      description: 'Graduate from Dalat University with a Bachelor of Engineering in Information Technology.'
    },
    {
      role: 'Web Developer',
      company: '<a href="https://songphuong.vn" target="_blank" class="text-clean-accent hover:text-deep-accent">Song Phương Technology</a>',
      period: 'Mar 2025 - Present',
      description: 'Specializing in full-stack web development, graphic design, iterative product updates, and SEO optimization for high-performance digital experiences.'
    },
    {
      role: '2D Graphic Designer',
      company: 'Freelance',
      period: '',
      description: 'Conceptualized and executed creative 2D visual assets for digital and print media. Delivered branding materials, marketing collateral, and UI elements tailored to client requirements.'
    }
  ];

  return `
    <div class="h-full overflow-y-auto pr-2">
      <h2 class="text-2xl font-bold mb-4 flex items-center">
        <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
        Experience
      </h2>
      <div class="flex flex-col gap-4">
        ${experiences.map((exp) => `
          <div class="experience-card">
            <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2">
              <h3 class="text-xl font-bold">${exp.role}</h3>
              <span class="text-xs font-mono text-gray-500 mt-1 lg:mt-0 lg:ml-4 whitespace-nowrap">${exp.period}</span>
            </div>
            <p class="text-base text-clean-accent font-semibold mb-2">${exp.company}</p>
            <p class="text-sm text-gray-700 leading-relaxed text-justify">${exp.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};
