// Auto-sliding carousel for About section
export function initAboutCarousel() {
    let currentSlide = 0;
    const totalSlides = 2;
    const dots = document.querySelectorAll('.slide-dot');
    const carouselTrack = document.getElementById('carousel-track');
    let autoSlideInterval: number | null = null;

    function resetAndPlayAnimations() {
        // 1. Language Bars
        const bars = document.querySelectorAll('.lang-bar-fill') as NodeListOf<HTMLElement>;
        bars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'none'; // Disable transition for instant reset
        });

        // 2. Skill Circles
        const circles = document.querySelectorAll('.progress-ring__circle') as NodeListOf<SVGCircleElement>;
        circles.forEach(circle => {
            const radius = 18;
            const circumference = 2 * Math.PI * radius;
            circle.style.strokeDashoffset = `${circumference}`;
            circle.style.transition = 'none'; // Disable transition
        });

        // Force reflow/repaint to apply the reset
        void document.body.offsetHeight;

        // Re-enable validation and set values
        setTimeout(() => {
            // Bars
            bars.forEach(bar => {
                const pct = bar.getAttribute('data-percentage') || '0';
                bar.style.transition = 'width 1500ms cubic-bezier(.2, .8, .2, 1)';
                bar.style.width = `${pct}%`;
            });

            // Circles
            circles.forEach(circle => {
                const pct = parseInt(circle.getAttribute('data-percentage') || '0');
                const radius = 18;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (pct / 100) * circumference;

                circle.style.transition = 'stroke-dashoffset 1500ms ease-in-out';
                circle.style.strokeDashoffset = `${offset}`;
            });
        }, 50);
    }

    function showSlide(index: number) {
        currentSlide = index;

        // Move carousel track horizontally
        if (carouselTrack) {
            const translateX = -index * 100;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
        }

        // ** Trigger Animation Replay if showing Skills Slide (Index 1) **
        if (index === 1) {
            resetAndPlayAnimations();
        }

        // Update ALL dots (both mobile and desktop)
        dots.forEach((dot) => {
            const dotSlide = parseInt(dot.getAttribute('data-slide') || '0');
            if (dotSlide === index) {
                dot.classList.add('active');
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-clean-accent');
            } else {
                dot.classList.remove('active');
                dot.classList.remove('bg-clean-accent');
                dot.classList.add('bg-gray-300');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = window.setInterval(nextSlide, 8000); // 8 seconds
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Dot click handlers - use data-slide attribute
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide') || '0');
            stopAutoSlide();
            showSlide(slideIndex);
            startAutoSlide(); // Restart auto-slide after manual interaction
        });
    });

    // Initialize
    showSlide(0);
    startAutoSlide();

    // Pause on hover (optional)
    const aboutRight = document.getElementById('about-right');
    if (aboutRight) {
        aboutRight.addEventListener('mouseenter', stopAutoSlide);
        aboutRight.addEventListener('mouseleave', startAutoSlide);
    }

    console.log('About carousel initialized with horizontal slides');
}
