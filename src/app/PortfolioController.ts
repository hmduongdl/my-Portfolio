import { renderNavigation } from '../components/Navigation';
import { renderHero } from '../components/Hero';
import { renderAbout, initAbout } from '../components/About';
import { renderProjects } from '../components/Projects';
import { renderProductShowcase, initProductShowcase } from '../components/ProductShowcase';
import { renderContact, initContact } from '../components/Contact';
import { renderFooter, initFooter } from '../components/Footer';
import { handleScrollReveal } from '../utils/scroll';
import { initNavigation } from '../utils/navigation';
import { initAboutCarousel } from '../utils/aboutCarousel';
import { renderStickySocialButton, initStickySocialButton } from '../components/StickySocialButton';
import { languageManager } from '../utils/language';

export class PortfolioController {
    private app: HTMLElement;

    constructor() {
        this.app = document.getElementById('app')!;

        // Initial render
        this.render();
        this.initGlobalListeners();
        this.attachDOMListeners();

        // Subscribe to language changes
        languageManager.subscribe(() => {
            // Save scroll position
            const scrollPos = window.scrollY;

            // Re-render
            this.render();
            this.attachDOMListeners();

            // Restore scroll position
            window.scrollTo(0, scrollPos);
        });
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
            ${renderProductShowcase()}
            ${renderProjects()}
            ${renderContact()}
            ${renderFooter()}
            ${renderStickySocialButton()}
        `;
    }

    private initGlobalListeners(): void {
        // Handle scroll for progress bar and nav highlighting
        // We define the function here once to avoid closure issues if we were adding/removing, 
        // but for global "permanent" listener it's fine.

        const updateActiveState = () => {
            // Re-query elements on every frame/check since DOM might have changed
            const progressBar = document.getElementById('scroll-progress');
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
            const footerEl = document.getElementById('footer');

            const navHeight = document.querySelector('nav')?.clientHeight || 0;
            // Use a smaller offset for active detection
            const offset = navHeight + 50;

            if (footerEl && currentScroll >= footerEl.offsetTop - offset - 300) {
                activeLayer = 'footer';
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
    }

    private attachDOMListeners(): void {
        // Clean up previous listeners if any (though for simple button clicks this might be overkill 
        // if we are replacing the whole DOM, but strict frameworks do it. 
        // Here, replacing innerHTML removes old elements and their listeners automatically from DOM tree.)
        // So we just need to attach new ones.

        // Initialize About section carousel
        initAboutCarousel();
        initAbout();

        // Initialize Sticky Social Button
        initStickySocialButton();

        // Initialize Contact Section Buttons
        initContact();

        // Initialize Footer Navigation
        initFooter();

        // Language Switcher Logic
        const langBtn = document.getElementById('lang-switch');
        if (langBtn) {
            langBtn.addEventListener('click', () => {
                languageManager.toggleLanguage();
            });
        }

        // Initialize Product Showcase Carousel
        initProductShowcase();

        // Navigation Click Handler
        initNavigation((target) => {
            let targetEl: HTMLElement | null = null;

            if (target === 'experience' || target === 'skills') {
                targetEl = document.getElementById('about');
            } else if (target === 'projects') {
                targetEl = document.getElementById('projects');
            } else if (target === 'contact') {
                targetEl = document.getElementById('contact');
            }

            if (targetEl) {
                const nav = document.querySelector('nav');
                const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                const top = targetEl.offsetTop - navHeight;

                window.scrollTo({
                    top: Math.max(0, top),
                    behavior: 'smooth'
                });
            }
        });

        // Mailto Handlers
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
