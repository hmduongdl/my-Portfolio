import { languageManager } from '../utils/language';

export const renderProjects = (): string => {
    const t = languageManager.getText('projects');

    return `
            <section id="projects" class="section relative z-50 bg-slate-50">
                <div class="container-custom">
                <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-serif tracking-tight text-center">
                    ${t.title}
                </h2>

                    <div class="projects-grid">
                        <article class="project-card flex flex-col h-full">
                            <div class="project-image w-full h-44 bg-gray-100 rounded-md overflow-hidden mb-4 flex items-center justify-center">
                                <!-- SVG placeholder -->
                                <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-40">
                                    <rect width="160" height="100" rx="8" fill="#E5E7EB"/>
                                    <path d="M10 80L60 20L110 60L150 10" stroke="#9CA3AF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold mb-2">Project Alpha</h3>
                            <p class="text-sm text-gray-600 mb-4">A short description that explains the purpose and tech used for Project Alpha.</p>
                            <div class="mt-auto">
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <span class="tech-tag">TypeScript</span>
                                    <span class="tech-tag">Vite</span>
                                    <span class="tech-tag">Tailwind</span>
                                </div>
                                <div class="flex gap-3">
                                    <a href="#" class="px-3 py-2 bg-clean-accent text-white rounded-md text-sm hover:opacity-90">${t.viewLive}</a>
                                    <a href="#" class="px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50">${t.viewSource}</a>
                                </div>
                            </div>
                        </article>

                        <article class="project-card flex flex-col h-full">
                            <div class="project-image w-full h-44 bg-gray-100 rounded-md overflow-hidden mb-4 flex items-center justify-center">
                                <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-40">
                                    <rect width="160" height="100" rx="8" fill="#E5E7EB"/>
                                    <circle cx="40" cy="40" r="20" stroke="#9CA3AF" stroke-width="3"/>
                                    <circle cx="100" cy="60" r="18" stroke="#9CA3AF" stroke-width="3"/>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold mb-2">Project Beta</h3>
                            <p class="text-sm text-gray-600 mb-4">Brief summary of Project Beta with highlights and challenges solved.</p>
                            <div class="mt-auto">
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <span class="tech-tag">React</span>
                                    <span class="tech-tag">Node</span>
                                </div>
                                <div class="flex gap-3">
                                    <a href="#" class="px-3 py-2 bg-clean-accent text-white rounded-md text-sm hover:opacity-90">${t.viewLive}</a>
                                    <a href="#" class="px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50">${t.viewSource}</a>
                                </div>
                            </div>
                        </article>

                        <article class="project-card flex flex-col h-full">
                            <div class="project-image w-full h-44 bg-gray-100 rounded-md overflow-hidden mb-4 flex items-center justify-center">
                                <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="opacity-40">
                                    <rect width="160" height="100" rx="8" fill="#E5E7EB"/>
                                    <path d="M20 80H140V20" stroke="#9CA3AF" stroke-width="3" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold mb-2">Project Gamma</h3>
                            <p class="text-sm text-gray-600 mb-4">Short description for Project Gamma.</p>
                            <div class="mt-auto">
                                <div class="flex flex-wrap gap-2 mb-4">
                                    <span class="tech-tag">Svelte</span>
                                    <span class="tech-tag">Go</span>
                                </div>
                                <div class="flex gap-3">
                                    <a href="#" class="px-3 py-2 bg-clean-accent text-white rounded-md text-sm hover:opacity-90">${t.viewLive}</a>
                                    <a href="#" class="px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50">${t.viewSource}</a>
                                </div>
                            </div>
                        </article>

                        <!-- Duplicate a few to fill grid -->
                        <article class="project-card">Project Delta — brief description.</article>
                        <article class="project-card">Project Epsilon — brief description.</article>
                        <article class="project-card">Project Zeta — brief description.</article>
                    </div>
                </div>
            </section>
        `;
};
