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

        // Use cached elements or query and cache them
        if (!layerCache.experience) layerCache.experience = document.getElementById('experience-layer');
        if (!layerCache.skills) layerCache.skills = document.getElementById('skills-layer');
        if (!layerCache.projects) layerCache.projects = document.getElementById('projects-layer');
        if (!layerCache.contact) layerCache.contact = document.getElementById('contact-layer');
        if (!layerCache.thankyou) layerCache.thankyou = document.getElementById('thankyou-layer');

        const { experience: experienceLayer, skills: skillsLayer, projects: projectsLayer, contact: contactLayer, thankyou: thankyouLayer } = layerCache;


        // About Section Layer Switching (5 partitions)
        // 0-20%: Experience
        // 20-40%: Skills
        // 40-60%: Projects
        // 60-80%: Contact
        // 80-100%: Thank You
        if (experienceLayer && skillsLayer && projectsLayer && contactLayer) {
            if (scrollPercentage >= 80) {
                // Thank you / final layer (may not exist yet)
                activeLayer = 'thankyou';
                experienceLayer.style.opacity = '0';
                experienceLayer.style.pointerEvents = 'none';
                skillsLayer.style.opacity = '0';
                skillsLayer.style.pointerEvents = 'none';
                projectsLayer.style.opacity = '0';
                projectsLayer.style.pointerEvents = 'none';
                contactLayer.style.opacity = '0';
                contactLayer.style.pointerEvents = 'none';
                if (thankyouLayer) {
                    thankyouLayer.style.opacity = '1';
                    thankyouLayer.style.pointerEvents = 'auto';
                }
            } else if (scrollPercentage >= 60) {
                // Contact Layer
                activeLayer = 'contact';
                experienceLayer.style.opacity = '0';
                experienceLayer.style.pointerEvents = 'none';
                skillsLayer.style.opacity = '0';
                skillsLayer.style.pointerEvents = 'none';
                projectsLayer.style.opacity = '0';
                projectsLayer.style.pointerEvents = 'none';
                contactLayer.style.opacity = '1';
                contactLayer.style.pointerEvents = 'auto';
                if (thankyouLayer) {
                    thankyouLayer.style.opacity = '0';
                    thankyouLayer.style.pointerEvents = 'none';
                }
            } else if (scrollPercentage >= 40) {
                // Projects Layer
                activeLayer = 'projects';
                experienceLayer.style.opacity = '0';
                experienceLayer.style.pointerEvents = 'none';
                skillsLayer.style.opacity = '0';
                skillsLayer.style.pointerEvents = 'none';
                // Quick appear: start with 0 -> 30% at 80ms, then full after split duration
                if ((window as any).__isNavigating) {
                    projectsLayer.style.opacity = '1';
                    projectsLayer.style.pointerEvents = 'auto';
                    (window as any).__projectsTimers = (window as any).__projectsTimers || {};
                    if ((window as any).__projectsTimers.q) clearTimeout((window as any).__projectsTimers.q);
                    if ((window as any).__projectsTimers.full) clearTimeout((window as any).__projectsTimers.full);
                } else {
                    projectsLayer.style.opacity = '0';
                    projectsLayer.style.pointerEvents = 'auto';
                    (window as any).__projectsTimers = (window as any).__projectsTimers || {};
                    // clear previous timers
                    if ((window as any).__projectsTimers.q) clearTimeout((window as any).__projectsTimers.q);
                    if ((window as any).__projectsTimers.full) clearTimeout((window as any).__projectsTimers.full);
                    // quick fade to 30% after 80ms
                    (window as any).__projectsTimers.q = setTimeout(() => {
                        projectsLayer.style.opacity = '0.3';
                    }, 80) as unknown as number;
                    // set to full opacity after split duration (match CSS split duration)
                    const afterFull = 800;
                    (window as any).__projectsTimers.full = setTimeout(() => {
                        projectsLayer.style.opacity = '1';
                    }, afterFull) as unknown as number;
                }
                contactLayer.style.opacity = '0';
                contactLayer.style.pointerEvents = 'none';
                if (thankyouLayer) {
                    thankyouLayer.style.opacity = '0';
                    thankyouLayer.style.pointerEvents = 'none';
                }
            } else if (scrollPercentage >= 20) {
                // Skills Layer
                activeLayer = 'skills';
                experienceLayer.style.opacity = '0';
                experienceLayer.style.pointerEvents = 'none';
                skillsLayer.style.opacity = '1';
                skillsLayer.style.pointerEvents = 'auto';
                projectsLayer.style.opacity = '0';
                projectsLayer.style.pointerEvents = 'none';
                contactLayer.style.opacity = '0';
                contactLayer.style.pointerEvents = 'none';
                if (thankyouLayer) {
                    thankyouLayer.style.opacity = '0';
                    thankyouLayer.style.pointerEvents = 'none';
                }
                animateSkillProgress(skillsLayer);
            } else {
                // Experience Layer
                activeLayer = 'experience';
                experienceLayer.style.opacity = '1';
                experienceLayer.style.pointerEvents = 'auto';
                skillsLayer.style.opacity = '0';
                skillsLayer.style.pointerEvents = 'none';
                projectsLayer.style.opacity = '0';
                projectsLayer.style.pointerEvents = 'none';
                contactLayer.style.opacity = '0';
                contactLayer.style.pointerEvents = 'none';
                if (thankyouLayer) {
                    thankyouLayer.style.opacity = '0';
                    thankyouLayer.style.pointerEvents = 'none';
                }
            }
        }
    }

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

export function handleAboutExitAnimation(force = false): void {
    const about = document.getElementById('about');
    const after = document.getElementById('after-about');
    if (!about || !after) return;

    const rect = about.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If we've scrolled past the About section (bottom moved above viewport)
    const passed = rect.bottom <= windowHeight * 0.15; // adjustable threshold

    const left = document.getElementById('about-left');
    const right = document.getElementById('about-right');

    // clear any existing timers to avoid duplicates
    const timers = (window as any).__aboutTimers || {};
    if (timers.step1) clearTimeout(timers.step1);
    if (timers.step2) clearTimeout(timers.step2);
    if (timers.reveal) clearTimeout(timers.reveal);

    const doSplitSequence = () => {
        // primary split -> push out
        left?.classList.add('about-split');
        right?.classList.add('about-split');
        // also apply background split class immediately
        const aboutBg = document.getElementById('about-bg');
        aboutBg?.classList.add('bg-split');

        const stepDuration = 800; // CSS duration for full split (ms)
        (window as any).__aboutTimers = {};

        // reveal overlay 30ms after split starts (user request)
        (window as any).__aboutTimers.reveal = setTimeout(() => {
            after.classList.add('revealed');
            // hide background slightly when overlay appears
            const aboutBg = document.getElementById('about-bg');
            aboutBg?.classList.add('bg-hidden');
        }, 30) as unknown as number;

        // still perform secondary push later (no longer gating the reveal)
        (window as any).__aboutTimers.step1 = setTimeout(() => {
            left?.classList.add('about-split-2');
            right?.classList.add('about-split-2');
        }, stepDuration) as unknown as number;
    };

    if (passed || force) {
        doSplitSequence();
    } else {
        // reset everything and cancel timers
        left?.classList.remove('about-split', 'about-split-2');
        right?.classList.remove('about-split', 'about-split-2');
        after.classList.remove('revealed');
        const aboutBg = document.getElementById('about-bg');
        aboutBg?.classList.remove('bg-split', 'bg-hidden');
        (window as any).__aboutTimers = {};
    }
}
