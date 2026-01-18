import { renderNavigation } from '../components/Navigation';
import { renderHero } from '../components/Hero';
import { renderAbout } from '../components/About';
import { renderProjects } from '../components/Projects';
import { renderContact } from '../components/Contact';
import { renderThankYou } from '../components/ThankYou';
import { handleScrollReveal } from '../utils/scroll';
import { initNavigation } from '../utils/navigation';

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
                // We are in About section (height 200vh)
                // Sticky behavior means we stay pinned for some distance.
                // Calculate progress within About
                const aboutTop = aboutEl.offsetTop;
                const aboutHeight = aboutEl.offsetHeight;
                const progressInAbout = (currentScroll - aboutTop) / (aboutHeight - windowHeight);

                // Toggle internal layers based on progress
                const skillsLayer = document.getElementById('skills-layer');
                const experienceLayer = document.getElementById('experience-layer');

                if (skillsLayer && experienceLayer) {
                    // Switch to skills halfway through the sticky duration
                    if (progressInAbout > 0.5) {
                        activeLayer = 'skills';
                        if (getComputedStyle(skillsLayer).opacity === '0') {
                            skillsLayer.style.opacity = '1';
                            skillsLayer.style.pointerEvents = 'auto';
                            experienceLayer.style.opacity = '0';
                            experienceLayer.style.pointerEvents = 'none';
                            // Trigger skill animations
                            handleScrollReveal();
                        }
                    } else {
                        activeLayer = 'experience';
                        if (getComputedStyle(experienceLayer).opacity === '0') {
                            experienceLayer.style.opacity = '1';
                            experienceLayer.style.pointerEvents = 'auto';
                            skillsLayer.style.opacity = '0';
                            skillsLayer.style.pointerEvents = 'none';
                        }
                    }
                }
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
                targetEl = document.getElementById('about');

                // Toggle internal layers
                const exp = document.getElementById('experience-layer');
                const skl = document.getElementById('skills-layer');
                if (exp && skl) {
                    if (target === 'skills') {
                        skl.style.opacity = '1';
                        skl.style.pointerEvents = 'auto';
                        exp.style.opacity = '0';
                        exp.style.pointerEvents = 'none';
                    } else {
                        exp.style.opacity = '1';
                        exp.style.pointerEvents = 'auto';
                        skl.style.opacity = '0';
                        skl.style.pointerEvents = 'none';
                    }
                }
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
