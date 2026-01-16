import { renderNavigation } from '../components/Navigation';
import { renderHero } from '../components/Hero';
import { renderAbout } from '../components/About';
import { renderProjects } from '../components/Projects';
import { renderContact } from '../components/Contact';
import { renderFooter } from '../components/Footer';
import { renderAfterAbout } from '../components/AfterAbout';
import { handleScrollReveal, handleLayerSwitching, handleAboutExitAnimation } from '../utils/scroll';
import { initializeScrollSnap } from '../utils/scrollSnap';

export class PortfolioController {
    private app: HTMLElement;
    private scrollStopTimer: number | undefined;
    private isSnapping = false;
    private rafPending = false; // RAF throttle flag
    private lastScrollY = 0; // Track scroll direction
    private isScrollingDown = true; // Default to down
    private cachedElements: {
        progressBar?: HTMLElement | null;
        progressBarHidden?: HTMLElement | null;
    } = {};

    constructor() {
        this.app = document.getElementById('app')!;
        this.render();
        this.addEventListeners();
    }

    private handleScrollStop(): void {
        const currentScrollY = window.scrollY;

        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercentage = Math.max(0, Math.min((currentScrollY / Math.max(1, scrollableHeight)) * 100, 100));

        // Define sections with milestones
        const sections = [
            { name: 'experience', milestone: 0 },
            { name: 'skills', milestone: 25 },
            { name: 'projects', milestone: 50 },
            { name: 'contact', milestone: 75 },
            { name: 'thankyou', milestone: 100 },
        ];

        // Calculate "raw" index
        const rawIdx = scrollPercentage / 25;
        let targetIdx = 0;

        if (this.isScrollingDown) {
            // Scrolling down: round UP to next milestone
            targetIdx = Math.ceil(rawIdx);
        } else {
            // Scrolling up: round DOWN
            targetIdx = Math.floor(rawIdx);
        }

        // Clamp logic
        targetIdx = Math.max(0, Math.min(targetIdx, sections.length - 1));

        const targetMilestone = sections[targetIdx].milestone;
        const targetScroll = (scrollableHeight * targetMilestone) / 100;

        // Start snapping
        this.isSnapping = true;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });

        // Wait for the smooth scroll to finish
        const wait = 900;
        setTimeout(() => {
            if (this.scrollStopTimer) clearTimeout(this.scrollStopTimer); // Clear any pending
            this.isSnapping = false;
            this.lastScrollY = window.scrollY; // Update last position after snap

            const activeLayer = handleLayerSwitching();
            this.updateActiveNav(activeLayer);

            // Update visible snapping progress to layer marker
            const v = document.getElementById('scroll-progress');
            if (v) {
                const map: Record<string, number> = { experience: 0, skills: 0.25, projects: 0.5, contact: 0.75, thankyou: 1 };
                const targetScale = map[activeLayer] ?? 0;
                v.style.transform = `scaleX(${targetScale})`;
            }
            handleAboutExitAnimation(activeLayer === 'projects' || activeLayer === 'contact' || activeLayer === 'thankyou');
        }, wait);
    }

    private render(): void {
        this.app.innerHTML = `
            <!-- Global Scroll Progress (overlays header) -->
            <div class="fixed top-0 left-0 w-full h-1 z-[9999]" style="pointer-events:none">
                <!-- Hidden, continuous progress (shows actual scroll progress) -->
                <div id="scroll-progress-hidden" class="absolute inset-0 h-full bg-gray-200" style="width:100%; transform:scaleX(0); transform-origin:left; opacity:0.7"></div>
                <!-- Visible, snapping progress (shows current layer) -->
                <div id="scroll-progress" class="absolute inset-0 h-full bg-clean-accent transition-all duration-150" style="width:100%; transform:scaleX(0); transform-origin:left"></div>
                <!-- Tick marks at 0%, 25%, 50%, 75%, 100% -->
                <div class="absolute inset-0 h-full flex justify-between">
                    <div class="w-px bg-gray-400 opacity-50"></div>
                    <div class="w-px bg-gray-400 opacity-50"></div>
                    <div class="w-px bg-gray-400 opacity-50"></div>
                    <div class="w-px bg-gray-400 opacity-50"></div>
                    <div class="w-px bg-gray-400 opacity-50"></div>
                </div>
            </div>

            ${renderNavigation()}
      ${renderHero()}
    ${renderAbout()}
    ${renderAfterAbout()}
    ${renderProjects()}
    ${renderContact()}
    ${renderFooter()}
    `;
    }

    private addEventListeners(): void {
        // Cache DOM elements
        const getProgressBar = () => {
            if (!this.cachedElements.progressBar) {
                this.cachedElements.progressBar = document.getElementById('scroll-progress');
            }
            return this.cachedElements.progressBar;
        };

        const getProgressBarHidden = () => {
            if (!this.cachedElements.progressBarHidden) {
                this.cachedElements.progressBarHidden = document.getElementById('scroll-progress-hidden');
            }
            return this.cachedElements.progressBarHidden;
        };

        // User Interaction Guard: Cancel snapping immediately if user interacts
        const cancelSnap = () => {
            if (this.scrollStopTimer) {
                window.clearTimeout(this.scrollStopTimer);
                this.scrollStopTimer = undefined;
            }
            // If we were snapping, stop attempting to enforce it
            if (this.isSnapping) {
                this.isSnapping = false;
            }
        };

        window.addEventListener('wheel', cancelSnap, { passive: true });
        window.addEventListener('touchstart', cancelSnap, { passive: true });
        window.addEventListener('keydown', cancelSnap, { passive: true });
        window.addEventListener('mousedown', cancelSnap, { passive: true });

        // Optimized scroll handler with RAF throttling
        const handleScroll = () => {
            if (this.rafPending) return;

            this.rafPending = true;
            requestAnimationFrame(() => {
                this.rafPending = false;

                // Update scroll direction
                const currentY = window.scrollY;
                this.isScrollingDown = currentY > this.lastScrollY;
                this.lastScrollY = currentY;

                // Update hidden progress bar (smooth tracking)
                const hiddenBar = getProgressBarHidden();
                if (hiddenBar) {
                    const documentHeight = document.documentElement.scrollHeight;
                    const windowHeight = window.innerHeight;
                    const scrollPercentage = Math.min(Math.max(currentY / (documentHeight - windowHeight), 0), 1);
                    // Use scaleX calculation (0 to 1)
                    hiddenBar.style.transform = `scaleX(${scrollPercentage})`;
                }

                // Only update layers and navigation when not snapping
                if (!this.isSnapping) {
                    const activeLayer = handleLayerSwitching();
                    this.updateActiveNav(activeLayer);

                    // Update visible progress bar (milestone-based)
                    const visibleBar = getProgressBar();
                    if (visibleBar) {
                        const map: Record<string, number> = {
                            experience: 0, skills: 0.25, projects: 0.5, contact: 0.75, thankyou: 1
                        };
                        const targetScale = map[activeLayer] ?? 0;
                        visibleBar.style.transform = `scaleX(${targetScale})`;
                    }

                    handleAboutExitAnimation(activeLayer === 'projects' || activeLayer === 'contact');
                }

                // Debounce scroll stop detection
                if (this.scrollStopTimer) window.clearTimeout(this.scrollStopTimer);
                this.scrollStopTimer = window.setTimeout(() => {
                    this.handleScrollStop();
                }, 500);
            });
        };

        // Add optimized scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial check
        handleScrollReveal();
        const initialActiveLayer = handleLayerSwitching();
        this.updateActiveNav(initialActiveLayer);
        // set visible progress to initial layer marker
        const v0 = document.getElementById('scroll-progress');
        if (v0) {
            const map: Record<string, number> = { experience: 0, skills: 0.25, projects: 0.5, contact: 0.75, thankyou: 1 };
            v0.style.transform = `scaleX(${map[initialActiveLayer] ?? 0})`;
        }
        handleAboutExitAnimation(initialActiveLayer === 'projects' || initialActiveLayer === 'contact');

        // Initialize scroll snap for smooth layer transitions
        initializeScrollSnap();

        // Handle nav link clicks to switch about layers
        (document.querySelectorAll('a.nav-link') as NodeListOf<HTMLAnchorElement>).forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                // signal that we are manually navigating (faster reveals)
                (window as any).__isNavigating = true;
                setTimeout(() => { (window as any).__isNavigating = false; }, 1500);

                const target = el.dataset.layer || 'experience';

                // Calculate target scroll position based on layer
                const documentHeight = document.documentElement.scrollHeight;
                const windowHeight = window.innerHeight;
                const scrollableHeight = documentHeight - windowHeight;

                let targetPercentage = 0;
                switch (target) {
                    case 'experience': targetPercentage = 0; break;
                    case 'skills': targetPercentage = 25; break;
                    case 'projects': targetPercentage = 50; break;
                    case 'contact': targetPercentage = 75; break;
                }

                const targetScroll = (scrollableHeight * targetPercentage) / 100;
                window.scrollTo({ top: targetScroll, behavior: 'auto' });
            });
        });

        // Handle obfuscated contact links (mailto/tel)
        (document.querySelectorAll('a[data-action="mailto"]') as NodeListOf<HTMLAnchorElement>).forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const user = el.dataset.user;
                const domain = el.dataset.domain;
                if (user && domain) {
                    window.location.href = `mailto:${user}@${domain}`;
                }
            });
        });

        (document.querySelectorAll('a[data-action="tel"]') as NodeListOf<HTMLAnchorElement>).forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const tel = el.dataset.tel;
                if (tel) {
                    window.location.href = `tel:${tel}`;
                }
            });
        });
    }

    private updateActiveNav(activeLayer: string): void {
        (document.querySelectorAll('a.nav-link') as NodeListOf<HTMLAnchorElement>).forEach((el) => {
            const layer = el.dataset.layer || 'experience';
            if (layer === activeLayer) {
                el.classList.add('text-clean-accent');
            } else {
                el.classList.remove('text-clean-accent');
            }
        });
    }
}
