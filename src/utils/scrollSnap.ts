/**
 * Scroll Snap Utility
 * Provides smooth scroll snapping to predefined scroll positions (layers)
 * to improve UX when scrolling quickly
 */

let scrollTimeout: number | null = null;
let isSnapping = false;

export function initializeScrollSnap(): void {
    window.addEventListener('scroll', handleScrollSnap, { passive: true });
}

function handleScrollSnap(): void {
    // Don't interrupt if we're already snapping
    if (isSnapping) return;

    // Clear existing timeout
    if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
    }

    // Set a new timeout to detect when scrolling stops
    scrollTimeout = window.setTimeout(() => {
        snapToNearestLayer();
    }, 150) as unknown as number; // Wait 150ms after scroll stops
}

function snapToNearestLayer(): void {
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = documentHeight - windowHeight;
    const currentScroll = window.scrollY;
    const currentPercentage = (currentScroll / scrollableHeight) * 100;

    // Define snap points for each layer (midpoints of ranges)
    const snapPoints = [
        { name: 'experience', percentage: 10, range: [0, 20] },
        { name: 'skills', percentage: 30, range: [20, 40] },
        { name: 'projects', percentage: 50, range: [40, 60] },
        { name: 'contact', percentage: 70, range: [60, 100] }
    ];

    // Find the closest snap point
    let closestSnap = snapPoints[0];
    let minDistance = Math.abs(currentPercentage - snapPoints[0].percentage);

    for (const snapPoint of snapPoints) {
        const distance = Math.abs(currentPercentage - snapPoint.percentage);
        if (distance < minDistance) {
            minDistance = distance;
            closestSnap = snapPoint;
        }
    }

    // Only snap if we're not already very close to a snap point
    // This prevents unnecessary snapping when user is already at a layer
    const threshold = 3; // 3% tolerance
    if (minDistance > threshold) {
        const targetScroll = (scrollableHeight * closestSnap.percentage) / 100;

        // Prevent scroll events during snapping
        isSnapping = true;

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

        // Re-enable scroll detection after snapping completes
        setTimeout(() => {
            isSnapping = false;
        }, 600); // Match scroll animation duration
    }
}

export function cleanupScrollSnap(): void {
    if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
    }
    window.removeEventListener('scroll', handleScrollSnap);
}
