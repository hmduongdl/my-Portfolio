// Auto-sliding carousel for About section
export function initAboutCarousel() {
    let currentSlide = 0;
    const totalSlides = 2;
    const dots = document.querySelectorAll('.slide-dot');
    const carouselTrack = document.getElementById('carousel-track');
    let autoSlideInterval: number | null = null;

    function showSlide(index: number) {
        currentSlide = index;

        // Move carousel track horizontally
        if (carouselTrack) {
            const translateX = -index * 100;
            carouselTrack.style.transform = `translateX(${translateX}%)`;
        }

        // Update dots
        dots.forEach((dot, i) => {
            if (i === index) {
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

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
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
