export function handleScrollReveal(): void {
    const reveals = document.querySelectorAll('.section-reveal');
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        const inView = elementTop < windowHeight - elementVisible;

        if (inView) {
            if (!reveal.classList.contains('active')) {
                reveal.classList.add('active');
                animateSkillProgress(reveal);
            }
        } else {
            if (reveal.classList.contains('active')) {
                reveal.classList.remove('active');
                resetSkillProgress(reveal);
            }
        }
    });
}

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
        // eslint-disable-next-line no-console
        console.warn('animateSkillProgress error', e);
    }
}

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
        // eslint-disable-next-line no-console
        console.warn('resetSkillProgress error', e);
    }
}

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

// Cache object for layer elements
const layerCache: {
    experience?: HTMLElement | null;
    skills?: HTMLElement | null;
    projects?: HTMLElement | null;
    contact?: HTMLElement | null;
    thankyou?: HTMLElement | null;
} = {};

export function handleLayerSwitching(): string {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    let activeLayer = 'experience';

    // Ensure we have enough scrollable area
    if (documentHeight > windowHeight) {
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

        // Determine active layer based on percentage
        if (scrollPercentage >= 80) {
            activeLayer = 'thankyou';
        } else if (scrollPercentage >= 60) {
            activeLayer = 'contact';
        } else if (scrollPercentage >= 40) {
            activeLayer = 'projects';
        } else if (scrollPercentage >= 20) {
            activeLayer = 'skills'; 
        } else {
            activeLayer = 'experience';
        }

        // Manage About Card Internal Layers (Experience vs Skills)
        if (!layerCache.experience) layerCache.experience = document.getElementById('experience-layer');
        if (!layerCache.skills) layerCache.skills = document.getElementById('skills-layer');

        const { experience: experienceLayer, skills: skillsLayer } = layerCache;
        if (experienceLayer && skillsLayer) {
            if (activeLayer === 'experience') {
                experienceLayer.style.opacity = '1';
                experienceLayer.style.pointerEvents = 'auto';
                skillsLayer.style.opacity = '0';
                skillsLayer.style.pointerEvents = 'none';
            } else if (activeLayer === 'skills') {
                skillsLayer.style.opacity = '1';
                skillsLayer.style.pointerEvents = 'auto';
                experienceLayer.style.opacity = '0';
                experienceLayer.style.pointerEvents = 'none';
                animateSkillProgress(skillsLayer);
            } else {
                // For projects, contact, thankyou: Hide both internal layers
                experienceLayer.style.opacity = '0';
                experienceLayer.style.pointerEvents = 'none';
                skillsLayer.style.opacity = '0';
                skillsLayer.style.pointerEvents = 'none';
            }
        }

        // Thank You layer logic (if exists separate)
        if (!layerCache.thankyou) layerCache.thankyou = document.getElementById('thankyou-layer');
        if (layerCache.thankyou) {
            if (activeLayer === 'thankyou') {
                layerCache.thankyou.style.opacity = '1';
                layerCache.thankyou.style.pointerEvents = 'auto';
            } else {
                layerCache.thankyou.style.opacity = '0';
                layerCache.thankyou.style.pointerEvents = 'none';
            }
        }
    }

    // Trigger snapping logic to ensure smooth transitions
    snapToLayerIfClose();

    return activeLayer;
}

/**
 * Snap to layer only if close to a milestone, with 20/80 rule:
 * - Each section is divided into 20% (first part) and 80% (latter part)
 * - Only snap forward to next section if in the latter 80% of current section
 * - Otherwise, stay in current section
 */
export function snapToLayerIfClose(): string | null {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = documentHeight - windowHeight;
    if (scrollableHeight <= 0) return null;

    const scrollPercentage = (scrollTop / scrollableHeight) * 100;

    // Define layer boundaries (each section spans 25%)
    const sections = [
        { name: 'experience', start: 0, end: 20, milestone: 0 },
        { name: 'skills', start: 20, end: 40, milestone: 25 },
        { name: 'projects', start: 40, end: 60, milestone: 50 },
        { name: 'contact', start: 60, end: 80, milestone: 75 },
        { name: 'thankyou', start: 80, end: 100, milestone: 100 },
    ];

    // Find current section
    const currentSection = sections.find(s => scrollPercentage >= s.start && scrollPercentage < s.end) || sections[sections.length - 1];

    // Calculate position within current section (0-100%)
    const sectionRange = currentSection.end - currentSection.start;
    const positionInSection = ((scrollPercentage - currentSection.start) / sectionRange) * 100;

    // 20/80 rule: only allow forward snap if in latter 80% of section
    if (positionInSection >= 80) {
        // In latter 80%, allow snap to next section
        const currentIdx = sections.indexOf(currentSection);
        const nextSection = sections[currentIdx + 1];
        if (nextSection) {
            const targetScroll = (scrollableHeight * nextSection.milestone) / 100;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
            return nextSection.name;
        }
    } else if (positionInSection <= 20) {
        // In first 20%, snap back to current milestone
        const targetScroll = (scrollableHeight * currentSection.milestone) / 100;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        return currentSection.name;
    }

    return null;
}



export function handleAboutExitAnimation(_force = false): void {
    // Split animation removed: ensure any split-related classes are cleared.
    const left = document.getElementById('about-left');
    const right = document.getElementById('about-right');
    const aboutBg = document.getElementById('about-bg');

    // No split classes to remove anymore; ensure no-op
    left?.classList.remove('about-split', 'about-split-2');
    right?.classList.remove('about-split', 'about-split-2');
    aboutBg?.classList.remove('bg-split');
    // Do not add or trigger any split animation; keep existing visibility state.
}
