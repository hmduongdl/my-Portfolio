/**
 * Scroll Utilities
 * Handles scroll-based animations and progress tracking
 */

/**
 * Handles scroll reveal animations for sections
 * Triggers skill progress animations when elements enter viewport
 */
export function handleScrollReveal(): void {
    const reveals = document.querySelectorAll('.section-reveal') as NodeListOf<HTMLElement>;
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        const inView = elementTop < windowHeight - elementVisible;
        const el = reveal as any;

        if (inView) {
            // Cancel any pending reset if user scrolls back quickly
            if (el._resetTimeout) {
                clearTimeout(el._resetTimeout);
                el._resetTimeout = null;
            }

            if (!reveal.classList.contains('active')) {
                reveal.classList.add('active');
                // Mark as animated to prevent future resets
                reveal.setAttribute('data-animated', 'true');
                animateSkillProgress(reveal);
            }
        } else {
            // Only reset if element hasn't been animated yet
            const hasBeenAnimated = reveal.getAttribute('data-animated') === 'true';

            if (reveal.classList.contains('active') && !hasBeenAnimated) {
                // Determine if we should start a delayed reset
                if (!el._resetTimeout) {
                    el._resetTimeout = setTimeout(() => {
                        reveal.classList.remove('active');
                        // Only reset if necessary
                        if (reveal.dataset.reset !== 'false') {
                            resetSkillProgress(reveal);
                        }
                        el._resetTimeout = null;
                    }, 500); // ms delay before resetting to prevent jitter
                }
            }
        }
    });
}

/**
 * Animates skill progress bars and circular progress rings
 * @param container - Element containing skill progress elements
 */
export function animateSkillProgress(container: Element): void {
    try {
        // Animate language bars
        const langFills = container.querySelectorAll<HTMLElement>('.lang-bar-fill');
        langFills.forEach((el) => {
            const pct = Number(el.dataset.percentage) || 0;
            // small delay for nicer effect
            setTimeout(() => {
                el.style.width = `${pct}%`;
            }, 100);
        });

        // Animate circular progress rings
        const circles = container.querySelectorAll<SVGCircleElement>('.progress-ring__circle');
        circles.forEach((circle) => {
            const dashArray = Number(circle.getAttribute('stroke-dasharray')) || 0;
            const pct = Number(circle.getAttribute('data-percentage')) || 0;
            const offset = dashArray - (pct / 100) * dashArray;
            // trigger transition
            setTimeout(() => {
                circle.style.strokeDashoffset = String(offset);
            }, 100);
        });
    } catch (e) {
        // silent fail to avoid breaking scroll handler
        console.warn('animateSkillProgress error', e);
    }
}

/**
 * Resets skill progress animations
 * @param container - Element containing skill progress elements
 */
export function resetSkillProgress(container: Element): void {
    try {
        // Reset language bars
        const langFills = container.querySelectorAll<HTMLElement>('.lang-bar-fill');
        langFills.forEach((el) => {
            el.style.width = '0%';
        });

        // Reset circular progress rings to full offset
        const circles = container.querySelectorAll<SVGCircleElement>('.progress-ring__circle');
        circles.forEach((circle) => {
            const dashArray = Number(circle.getAttribute('stroke-dasharray')) || 0;
            // set to full (hidden)
            circle.style.strokeDashoffset = String(dashArray);
        });
    } catch (e) {
        console.warn('resetSkillProgress error', e);
    }
}

/**
 * Updates scroll progress bar width based on scroll position
 * @param progressBarId - ID of the progress bar element
 */
export function updateScrollProgress(progressBarId: string): void {
    const scrollTop = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

    const progressBar = document.getElementById(progressBarId);
    if (progressBar) {
        progressBar.style.width = `${scrollPercentage}%`;
    }
}
