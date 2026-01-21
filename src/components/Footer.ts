import { languageManager } from '../utils/language';

export const renderFooter = (): string => {
    const t = languageManager.getText('footer');
    const methods = t.contact_methods;

    return `
    <footer id="footer" class="bg-[#1a4d3e] text-white py-6">
        <div class="container-custom">
            <!-- Top Section: 3 Columns -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10">
                
                <!-- Column 1: Info -->
                <div class="space-y-4">
                    <h2 class="text-xl md:text-2xl font-bold font-serif">Hoàng Minh Dương</h2>
                    <p class="text-gray-300 leading-relaxed text-sm md:text-base">
                        ${t.description}
                    </p>
                </div>

                <!-- Column 2: Navigation -->
                <div class="md:pl-8">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 font-sans">${t.navigation_title}</h3>
                    <ul class="space-y-3 font-medium text-sm">
                        <li>
                            <a href="#about" class="footer-nav-link text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block" data-target="about">
                                ${t.nav.about}
                            </a>
                        </li>
                        <li>
                            <a href="#projects" class="footer-nav-link text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block" data-target="projects">
                                ${t.nav.projects}
                            </a>
                        </li>
                        <li>
                            <a href="#contact" class="footer-nav-link text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block" data-target="contact">
                                ${t.nav.contact}
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- Column 3: Contact -->
                <div class="md:pl-6">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 font-sans">${t.contact_title}</h3>
                    <ul class="space-y-3 font-medium text-sm">
                        <li>
                            <a href="mailto:hoanglong.workdl@gmail.com" class="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                                ${methods.email}
                            </a>
                        </li>
                        <li>
                            <a href="tel:+84911818016" class="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                                ${methods.phone}
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/hmduongdl" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                                ${methods.github}
                            </a>
                        </li>
                        <li>
                            <a href="https://www.facebook.com/hmd.stewiclez" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                                ${methods.facebook}
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </footer>
    `;
};

export const initFooter = (): void => {
    const footerNavLinks = document.querySelectorAll('.footer-nav-link');

    footerNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const target = (link as HTMLElement).dataset.target;
            if (!target) return;

            const targetEl = document.getElementById(target);
            if (!targetEl) return;

            const nav = document.querySelector('nav');
            const navHeight = nav ? nav.getBoundingClientRect().height : 0;
            const top = targetEl.offsetTop - navHeight;

            window.scrollTo({
                top: Math.max(0, top),
                behavior: 'smooth'
            });
        });
    });
};
