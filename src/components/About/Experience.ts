import { languageManager } from '../../utils/language';
import { Experience } from '../../types';

export const renderExperience = (): string => {
  const t = languageManager.getText('experience');
  const experiences: Experience[] = t.items;

  return `
    <div class="h-full overflow-y-auto pr-2">
      <h2 class="text-2xl font-bold mb-4 flex items-center">
        <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
        ${t.title}
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
