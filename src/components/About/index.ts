import { renderExperience } from './Experience';
import { renderSkills } from './Skills';
import { renderStats } from './Stats';
import { languageManager } from '../../utils/language';

// About Section Component

export const renderAbout = (): string => {
  const t = languageManager.getText('about');

  return `
    <!-- About Section -->
    <section id="about" class="relative overflow-x-hidden bg-gray-100">
      
      <div class="relative pt-[80px] pb-[10px] md:pt-[62px] md:pb-[10px]">
        <!-- Background Image with Blur (Desktop only) -->
        <div class="absolute inset-x-0 top-0 -z-10 hidden md:block overflow-hidden" style="height: 100%;">
          <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/profile-background.jpg'); filter: blur(10px); transform: scale(1.2); height: 100%;"></div>
          <div class="absolute inset-0 bg-white/80" style="height: 100%;"></div>
        </div>
        
        <div class="container-custom relative z-10 w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-24 items-stretch">
            <!-- Left Column: Avatar and About Me -->
            <div id="about-left" class="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg relative h-full flex flex-col transition-transform duration-700 overflow-hidden">
              <!-- Avatar with Signature Overlay -->
              <div class="relative w-full max-w-[256px] mx-auto overflow-visible md:overflow-visible" style="margin-bottom: 43px; margin-top: 0;">
                <!-- Avatar -->
                <div class="w-full aspect-square max-w-[256px] rounded-full border-4 border-gray-900 overflow-hidden bg-gray-200 mx-auto">
                  <img src="/img/my-avatar.jpg" alt="Profile Avatar" class="w-full h-full object-cover">
                </div>
                
                <!-- Signature positioned at bottom of avatar --> 
                <div class="absolute left-1/2 block" style="bottom: -5.5rem; width: 300px; transform: translateX(-50%);">
                  <img src="/img/signature.png" alt="Signature" class="w-full h-auto object-contain drop-shadow-lg">
                </div>
              </div>

              <!-- Social Icons: Vertical, Left of Avatar (Desktop only) -->
              <div class="absolute left-5 top-[50px] flex flex-col gap-3 z-20 hidden md:flex">
                <a href="https://www.facebook.com/hmd.stewiclez" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1877F2] hover:text-[#1877F2] transition-all duration-300 bg-white" aria-label="Facebook">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://github.com/hmduongdl" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black hover:text-black transition-all duration-300 bg-white" aria-label="GitHub">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="mailto:hoanglong.workdl@gmail.com" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#EA4335] hover:text-[#EA4335] transition-all duration-300 bg-white" aria-label="Email">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </a>
                <a href="javascript:void(0)" id="about-phone-btn" class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#34A853] hover:text-[#34A853] transition-all duration-300 bg-white" aria-label="Phone">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </a>
              </div>

              <!-- Name and Title -->
              <div class="text-center mb-4">
                <h1 class="text-3xl font-bold mb-1">Hoàng Minh Dương</h1>
              </div>

              <!-- About Me Section -->
              <div class="flex-1 mb-4">
                <h2 class="text-xl font-bold mb-3 flex items-center">
                  <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
                  ${t.title}
                </h2>
                <p class="text-gray-700 leading-relaxed text-justify">
                  ${t.role}
                </p>
              </div>

              <!-- Stats displayed at the bottom -->
              ${renderStats()}
            </div>

            <!-- Right Column: Auto-sliding Content (Experience / Skills) -->
            <div id="about-right" class="relative flex flex-col h-auto md:h-full">
              <!-- Slide Container with horizontal overflow -->
              <div class="relative overflow-hidden flex-1 min-h-[400px] md:min-h-0">
                <div class="flex transition-transform duration-700 ease-in-out h-full" id="carousel-track">
                  <!-- Experience Slide -->
                  <div class="w-full flex-shrink-0 h-full">
                    ${renderExperience()}
                  </div>
                  <!-- Skills Slide -->
                  <div class="w-full flex-shrink-0 h-full">
                    ${renderSkills()}
                  </div>
                </div>
              </div>
              
              <!-- Slide Dots: Horizontal bottom on mobile, Vertical center on desktop -->
              <div class="flex md:hidden justify-center gap-2 py-3 bg-gradient-to-t from-white/95 to-transparent backdrop-blur-sm mt-2">
                <button class="slide-dot active w-2.5 h-2.5 rounded-full bg-clean-accent transition-all duration-300 hover:scale-125" data-slide="0" aria-label="Go to Experience"></button>
                <button class="slide-dot w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300 hover:scale-125" data-slide="1" aria-label="Go to Skills"></button>
              </div>
              
              <!-- Vertical Dots (Desktop only) - Outside column, 10px away -->
              <div class="hidden md:flex absolute -right-[20px] top-1/2 transform -translate-y-1/2 flex-col gap-3 z-20">
                <button class="slide-dot active w-2.5 h-2.5 rounded-full bg-clean-accent transition-all duration-300 hover:scale-125" data-slide="0" aria-label="Go to Experience"></button>
                <button class="slide-dot w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-gray-400 transition-all duration-300 hover:scale-125" data-slide="1" aria-label="Go to Skills"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  `;
};

export const initAbout = (): void => {
  const btnPhone = document.getElementById('about-phone-btn');
  if (btnPhone) {
    btnPhone.addEventListener('click', (e) => {
      e.preventDefault();
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.getBoundingClientRect().height : 0;
        const top = contactEl.offsetTop - navHeight;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth'
        });
      }
    });
  }
};
