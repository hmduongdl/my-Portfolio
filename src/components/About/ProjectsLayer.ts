export const renderProjectsLayer = (): string => {
    return `
    <div id="projects-layer" class="col-start-1 row-start-1 transition-all duration-700 ease-in-out" style="opacity: 0; pointer-events: none;">
      <div>
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
          Projects
        </h2>
        <div class="projects-grid">
          <div class="project-card">Project A — brief description.</div>
          <div class="project-card">Project B — brief description.</div>
          <div class="project-card">Project C — brief description.</div>
          <div class="project-card">Project D — brief description.</div>
          <div class="project-card">Project E — brief description.</div>
          <div class="project-card">Project F — brief description.</div>
        </div>
      </div>
    </div>
  `;
};
