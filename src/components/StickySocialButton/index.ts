
import './sticky-social.css';

export const renderStickySocialButton = (): string => {
    return `
    <div id="sticky-social-container">
        <!-- Panel -->
        <div id="sticky-social-panel">
            <a href="javascript:void(0)" id="sticky-phone-btn" class="sticky-social-item phone" aria-label="Call">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            </a>
            <a href="mailto:hoanglong.workdl@gmail.com" class="sticky-social-item email" aria-label="Email">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </a>
            <a href="https://github.com/hmduongdl" target="_blank" rel="noopener noreferrer" class="sticky-social-item github" aria-label="GitHub">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.facebook.com/hmd.stewiclez" target="_blank" rel="noopener noreferrer" class="sticky-social-item facebook" aria-label="Facebook">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
        </div>

        <!-- Button -->
        <button id="sticky-social-toggle" aria-label="Open social contacts">
            <!-- Icon Closed (Chat) -->
            <svg class="w-6 h-6 icon-closed transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <!-- Icon Open (Chevron Down) -->
            <svg class="w-6 h-6 icon-open absolute opacity-0 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        </button>
        <!-- Back To Top Button -->
        <button id="back-to-top" aria-label="Back to Top">
            <svg class="w-[35px] h-[35px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m18 15-6-6-6 6"/>
            </svg>
        </button>
    </div>
  `;
};

export const initStickySocialButton = (): void => {
    // 1. Mobile Social Toggle Logic
    const toggle = document.getElementById('sticky-social-toggle');
    const panel = document.getElementById('sticky-social-panel');

    if (toggle && panel) {
        const handleToggle = (e: MouseEvent) => {
            e.stopPropagation();
            const isOpen = panel.classList.contains('active');

            if (isOpen) {
                panel.classList.remove('active');
                toggle.classList.remove('active');
            } else {
                panel.classList.add('active');
                toggle.classList.add('active');
            }
        };

        const handleOutsideClick = (e: MouseEvent) => {
            if (!toggle.contains(e.target as Node) && !panel.contains(e.target as Node) && panel.classList.contains('active')) {
                panel.classList.remove('active');
                toggle.classList.remove('active');
            }
        };

        const handleResize = () => {
            if (window.innerWidth >= 768 && panel.classList.contains('active')) {
                panel.classList.remove('active');
                toggle.classList.remove('active');
            }
        };

        toggle.addEventListener('click', handleToggle);
        document.addEventListener('click', handleOutsideClick);
        window.addEventListener('resize', handleResize);
    }

    // 2. Desktop Back To Top Logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const toggleBackToTopVisibility = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        window.addEventListener('scroll', toggleBackToTopVisibility, { passive: true });
        backToTopBtn.addEventListener('click', scrollToTop);
        // Initial check in case page is refreshed while scrolled
        toggleBackToTopVisibility();
    }

    // 3. Sticky Phone Button Logic
    const stickyPhoneBtn = document.getElementById('sticky-phone-btn');
    if (stickyPhoneBtn) {
        stickyPhoneBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const contactEl = document.getElementById('contact');
            if (contactEl) {
                const nav = document.querySelector('nav');
                const navHeight = nav ? nav.getBoundingClientRect().height : 0;
                const top = contactEl.offsetTop - navHeight;

                window.scrollTo({
                    top: Math.max(0, top),
                    behavior: 'smooth'
                });
            }
        });
    }
};
