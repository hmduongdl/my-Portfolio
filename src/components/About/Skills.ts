import { Skill } from '../../types';
import { getSkillIcon } from '../../icons';
import { languageManager } from '../../utils/language';

export const renderSkills = (): string => {
  const t = languageManager.getText('skills');
  const skills: Skill[] = [
    { name: 'TypeScript', description: '', percentage: 90, iconType: 'ts' },
    { name: 'Node.js', description: '', percentage: 80, iconType: 'node' },
    { name: 'Python', description: '', percentage: 70, iconType: 'python' },
    { name: 'Vite', description: '', percentage: 85, iconType: 'vite' },
    { name: 'Ant Design', description: '', percentage: 80, iconType: 'ant' },
    { name: 'Tailwind CSS', description: '', percentage: 85, iconType: 'tailwind' },
    { name: 'MongoDB', description: '', percentage: 75, iconType: 'mongodb' },
    { name: 'PHP', description: '', percentage: 65, iconType: 'php' },
    { name: 'Git', description: '', percentage: 85, iconType: 'git' },
    { name: 'Photoshop', description: '', percentage: 70, iconType: 'photoshop' },
  ];

  return `
    <div class="h-full overflow-y-auto pr-2">
      
      <!-- Languages -->
      <div class="section-reveal">
      <h2 class="text-2xl font-bold mb-4 flex items-center">
        <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
        ${t.languages_title}
      </h2>
      <div class="space-y-4 mb-8">
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">${t.vietnamese}</span>
            <span class="text-xs text-gray-500">${t.native}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-clean-accent h-2 rounded-full lang-bar-fill" data-percentage="100" style="width: 0%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">${t.english}</span>
            <span class="text-xs text-gray-500">${t.independent}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-clean-accent h-2 rounded-full lang-bar-fill" data-percentage="60" style="width: 0%"></div>
          </div>
        </div>
      </div>
      </div>

      <!-- Tech Stack -->
      <h2 class="text-2xl font-bold mb-4 flex items-center">
        <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
        ${t.tech_stack_title}
      </h2>
      
      <div class="section-reveal">
      <div class="grid grid-cols-2 gap-3">
        ${skills.map(skill => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;

    return `
          <div class="tech-card-glow group p-3 gap-3">
            <!-- Circular Progress (Smaller) -->
            <div class="relative w-12 h-12 flex-shrink-0">
              <!-- Glow (Subtle) -->
              <div class="absolute inset-0 bg-green-400 rounded-full blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <svg class="transform -rotate-90 w-12 h-12 relative z-10">
                <!-- Track (Light Gray) -->
                <circle cx="24" cy="24" r="${radius}" stroke="#e5e7eb" stroke-width="3" fill="none" />
                <!-- Progress -->
                <circle 
                  cx="24" 
                  cy="24" 
                  r="${radius}" 
                  stroke="#22c55e" 
                  stroke-width="3" 
                  fill="none" 
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${circumference}"
                  data-percentage="${skill.percentage}"
                  stroke-linecap="round"
                  class="progress-ring__circle"
                />
              </svg>
              
              <!-- Icon/Logo Center (Smaller) -->
              <div class="absolute inset-0 flex items-center justify-center text-green-600 z-20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  ${getSkillIcon(skill.iconType)}
                </svg>
              </div>
            </div>
            
            <!-- Text Info (No Description) -->
            <div class="flex-1 min-w-0 flex items-center">
              <h3 class="text-gray-900 font-bold text-sm truncate group-hover:text-green-600 transition-colors">${skill.name}</h3>
            </div>
          </div>
          `;
  }).join('')}
      </div>
    </div>
  </div>
  `;
};
