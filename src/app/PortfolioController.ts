import { renderNavigation } from '../components/Navigation';
import { renderHero } from '../components/Hero';
import { renderAbout } from '../components/About';
import { renderProjects } from '../components/Projects';
import { renderContact } from '../components/Contact';
import { renderThankYou } from '../components/ThankYou';
import { handleScrollReveal } from '../utils/scroll';
import { initNavigation } from '../utils/navigation';
import { initAboutCarousel } from '../utils/aboutCarousel';

export class PortfolioController {
    private app: HTMLElement;

    constructor() {
        this.app = document.getElementById('app')!;
        this.render();
        this.addEventListeners();
    }

    private render(): void {
        this.app.innerHTML = `
            <!-- Global Scroll Progress -->
            <div class="fixed top-0 left-0 w-full h-1 z-[9999]" style="pointer-events:none">
                <div id="scroll-progress" class="absolute inset-0 h-full bg-clean-accent transition-transform duration-100 ease-out" style="width:100%; transform:scaleX(0); transform-origin:left"></div>
            </div>

            ${renderNavigation()}
            ${renderHero()}
            ${renderAbout()}
            ${renderProjects()}
            ${renderContact()}
            ${renderThankYou()}
        `;
    }

    private addEventListeners(): void {
        // Initialize About section carousel
        initAboutCarousel();

        // Handle scroll for progress bar and nav highlighting
        const progressBar = document.getElementById('scroll-progress');

        const updateActiveState = () => {
            const currentScroll = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            // 1. Update Progress Bar
            const scrollPercent = currentScroll / (docHeight - windowHeight);
            if (progressBar) {
                progressBar.style.transform = `scaleX(${Math.min(scrollPercent, 1)})`;
            }

            // 2. Determine Active Section
            let activeLayer = 'experience';

            const heroEl = document.getElementById('hero');
            const aboutEl = document.getElementById('about');
            const projectsEl = document.getElementById('projects');
            const contactEl = document.getElementById('contact');
            const thankyouEl = document.getElementById('thankyou');

            const navHeight = document.querySelector('nav')?.clientHeight || 0;
            // Use a smaller offset for active detection
            const offset = navHeight + 50;

            if (thankyouEl && currentScroll >= thankyouEl.offsetTop - offset - 300) {
                activeLayer = 'thankyou';
            } else if (contactEl && currentScroll >= contactEl.offsetTop - offset) {
                activeLayer = 'contact';
            } else if (projectsEl && currentScroll >= projectsEl.offsetTop - offset) {
                activeLayer = 'projects';
            } else if (aboutEl && currentScroll >= aboutEl.offsetTop - offset) {
                // In About section - auto-slide handles layer switching
                activeLayer = 'experience';
            } else if (heroEl && currentScroll < aboutEl?.offsetTop!) {
                activeLayer = 'experience'; // Default when at top
            }

            this.updateActiveNav(activeLayer);

            // Trigger reveals for standard sections
            handleScrollReveal();
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveState);
        }, { passive: true });

        // Initial update
        updateActiveState();

        // 3. Navigation Click Handler
        initNavigation((target) => {
            let targetEl: HTMLElement | null = null;

            if (target === 'experience' || target === 'skills') {
                // Both navigate to About section - auto-slide handles the rest
                targetEl = document.getElementById('about');
            } else if (target === 'projects') {
                targetEl = document.getElementById('projects');
            } else if (target === 'contact') {
                targetEl = document.getElementById('contact');
            }

            if (targetEl) {
                const nav = document.querySelector('nav');
                const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                // Scroll to element position relative to document
                const top = targetEl.offsetTop - navHeight;

                window.scrollTo({
                    top: Math.max(0, top),
                    behavior: 'smooth'
                });
            }
        });

        // Other handlers (mailto, etc.) can be preserved or re-added if essential custom logic existed. 
        // Re-adding the mailto/tel logic for completeness.
        (document.querySelectorAll('a[data-action="mailto"]') as NodeListOf<HTMLAnchorElement>).forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const user = el.dataset.user;
                const domain = el.dataset.domain;
                if (user && domain) window.location.href = `mailto:${user}@${domain}`;
            });
        });
    }

    private updateActiveNav(activeLayer: string): void {
        (document.querySelectorAll('a.nav-link') as NodeListOf<HTMLAnchorElement>).forEach((el) => {
            const layer = el.dataset.layer || 'experience';
            // Highlight projects/contact/experience/skills
            // If activeLayer is 'thankyou' (no nav item), maybe keep contact highlighted or nothing.
            // Requirement: "khi lướt tới section thank you vẫn cập nhật thanh load process đúng" -> Load process is handled above.

            if (layer === activeLayer) {
                el.classList.add('text-clean-accent');
            } else {
                el.classList.remove('text-clean-accent');
            }
        });
    }
}
