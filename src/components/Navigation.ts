import { languageManager } from '../utils/language';

export const renderNavigation = (): string => {
  const t = languageManager.getText('nav');
  const currentLang = languageManager.getLanguage();

  // Styling for active language - Custom flag approach now used below


  return `
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-[60] border-b border-gray-100">
      <div class="container-custom py-2">
        <div class="grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center">
          
          <!-- Logo (Left) -->
          <div class="flex justify-start">
            <a href="#" class="text-xl font-semibold tracking-tight">HMD</a>
          </div>

          <!-- Navigation Links (Center) -->
          <div class="flex justify-center">
            <ul class="flex gap-3 md:gap-8">
              <li><a href="#" data-layer="experience" id="nav-about" class="nav-link link-hover text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">${t.about}</a></li>
              <li><a href="#" data-layer="projects" id="nav-projects" class="nav-link link-hover text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">${t.projects}</a></li>
              <li><a href="#" data-layer="contact" id="nav-contact" class="nav-link link-hover text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">${t.contact}</a></li>
            </ul>
          </div>

          <!-- Language Switcher (Right) -->
          <div class="flex justify-end">
            <button id="lang-switch" class="group flex items-center p-1 rounded-full border border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer shadow-sm min-w-[80px] justify-between" aria-label="Switch Language">
              
              <!-- EN Option -->
              <div class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${currentLang === 'en' ? 'shadow-md border border-gray-100 scale-105' : 'bg-transparent'}"
                   style="${currentLang === 'en' ? "background-image: url('/flags/uk.png'); background-size: cover; background-position: center;" : ''}">
                <span class="${currentLang === 'en' ? 'hidden' : 'text-xs font-bold text-gray-400 group-hover:text-gray-600'}">EN</span>
              </div>

              <!-- Separator (only if needed, but spacing handles it) -->
              
              <!-- VN Option -->
              <div class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${currentLang === 'vn' ? 'shadow-md border border-gray-100 scale-105' : 'bg-transparent'}"
                   style="${currentLang === 'vn' ? "background-image: url('/flags/vietnam.png'); background-size: cover; background-position: center;" : ''}">
                <span class="${currentLang === 'vn' ? 'hidden' : 'text-xs font-bold text-gray-400 group-hover:text-gray-600'}">VN</span>
              </div>

            </button>
          </div>

        </div>
      </div>
      <!-- Scroll Progress Bar removed from nav; moved to top-level for overlay -->
    </nav>
  `;
};
