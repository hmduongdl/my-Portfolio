import { renderExperience } from './Experience';
import { renderSkills } from './Skills';
import { renderProjectsLayer } from './ProjectsLayer';
import { renderContactLayer } from './ContactLayer';

export const renderAbout = (): string => {
  return `
    <!-- About Section: 200vh height to allow scrolling "through" the content -->
    <section id="about" class="relative" style="height: 200vh;">
      
      <!-- Sticky Container: Keeps content visible while scrolling the parent section -->
      <div class="sticky top-0 h-screen flex items-start overflow-hidden pt-[46px] md:pt-[54px]">
      
        <!-- Background Image with Blur (Absolute to sticky container) -->
        <div id="about-bg" class="absolute inset-0 -z-10">
          <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/profile-background.jpg'); filter: blur(8px); transform: scale(1.1);"></div>
          <div class="absolute inset-0 bg-white/80"></div>
        </div>
        
        <div class="container-custom relative z-10 w-full">
          <div class="grid md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-stretch">
            <!-- Left Column: Avatar and About Me -->
            <div id="about-left" class="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:px-8 md:py-6 shadow-lg relative h-full flex flex-col transition-transform duration-700">
              <!-- Avatar with Signature Overlay -->
              <div class="relative w-auto mx-auto overflow-visible" style="width: 256px; margin-bottom: 43px; margin-top: 0;">
                <!-- Avatar -->
                <div class="w-64 h-64 rounded-full border-4 border-gray-900 overflow-hidden bg-gray-200">
                  <img src="/img/my-avatar.jpg" alt="Profile Avatar" class="w-full h-full object-cover">
                </div>
                
                <!-- Signature positioned at bottom of avatar --> 
                <div class="absolute left-1/2" style="bottom: -5.5rem; width: 300px; transform: translateX(-50%);">
                  <img src="/img/signature.png" alt="Signature" class="w-full h-auto object-contain drop-shadow-lg">
                </div>
              </div>

              <!-- Name and Title -->
              <div class="text-center mb-6">
                <h1 class="text-3xl font-bold mb-1">Hoàng Minh Dương</h1>
              </div>
              
              <!-- About Me Title -->
              <h2 class="text-2xl font-bold mb-4 flex items-center">
                <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
                About Me
              </h2> 
              
              <!-- Description -->
              <p class="text-gray-700 leading-relaxed mb-6 text-justify">
                IT Student at Dalat University and Song Phương Techology, specializing in modern web development and solving real-world technical challenges.
              </p>

              <!-- Social Links -->
              <div class="flex gap-4 justify-center mt-3 pb-1">
                 <a href="https://www.facebook.com/hmd.stewiclez" target="_blank" class="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 hover:scale-110 flex items-center justify-center transition-all group">
                  <svg class="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://github.com/hmduongdl" target="_blank" class="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all group">
                  <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" data-action="mailto" data-user="hoanglong.workdl" data-domain="gmail.com" class="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 hover:scale-110 flex items-center justify-center transition-all group" role="button">
                  <svg class="w-5 h-5 text-gray-600 group-hover:text-red-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
                <a href="#" data-action="tel" data-tel="+84911818016" class="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 hover:scale-110 flex items-center justify-center transition-all group" role="button">
                  <svg class="w-5 h-5 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </a>
              </div>
              
            </div>

            <!-- Right Column: Layered Content (Experience / Tech Stack) -->
            <div id="about-right" class="grid grid-cols-1 transition-transform duration-700">
              ${renderExperience()}
              ${renderSkills()}
              ${renderProjectsLayer()}
              ${renderContactLayer()}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};
