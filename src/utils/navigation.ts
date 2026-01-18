export function initNavigation(onNavClick?: (layer: string, opts?: { instant?: boolean }) => void) {
  const nav = document.querySelector('nav');
  if (!nav) return { setActiveLayer: (_: string) => {} };

  const links = Array.from(nav.querySelectorAll('a.nav-link')) as HTMLAnchorElement[];

  function setActiveLayer(layer: string) {
    links.forEach((el) => {
      const isActive = (el.dataset.layer || 'experience') === layer;
      el.classList.toggle('text-clean-accent', isActive);
      if (isActive) {
        el.setAttribute('aria-current', 'page');
      } else {
        el.removeAttribute('aria-current');
      }
    });
  }

  nav.addEventListener(
    'click',
    (e) => {
      const targetA = (e.target as HTMLElement).closest('a.nav-link') as HTMLAnchorElement | null;
      if (!targetA) return;
      e.preventDefault();

      const layer = targetA.dataset.layer || 'experience';

      // Immediate UI feedback
      setActiveLayer(layer);

      // Update visible progress bar quickly
      const visibleBar = document.getElementById('scroll-progress');
      if (visibleBar) {
        const map: Record<string, number> = { experience: 0, skills: 0.25, projects: 0.5, contact: 0.75, thankyou: 1 };
        visibleBar.style.transform = `scaleX(${map[layer] ?? 0})`;
      }

      if (onNavClick) onNavClick(layer, { instant: true });
    },
    { passive: false }
  );

  return { setActiveLayer };
}
