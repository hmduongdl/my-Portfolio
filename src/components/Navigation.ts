export const renderNavigation = (): string => {
  return `
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-[60] border-b border-gray-100">
      <div class="container-custom py-2">
        <div class="flex justify-between items-center">
          <a href="#" class="text-xl font-semibold">HMD</a>
          <ul class="flex gap-8">
            <li><a href="#" data-layer="experience" id="nav-about" class="nav-link link-hover text-sm font-medium">About</a></li>
            <li><a href="#" data-layer="projects" id="nav-projects" class="nav-link link-hover text-sm font-medium">Projects</a></li>
            <li><a href="#" data-layer="contact" id="nav-contact" class="nav-link link-hover text-sm font-medium">Contact</a></li>
          </ul>
        </div>
      </div>
      <!-- Scroll Progress Bar removed from nav; moved to top-level for overlay -->
    </nav>
  `;
};
