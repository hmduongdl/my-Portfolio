export const renderAfterAbout = (): string => {
    return `
    <div id="after-about" class="bg-clean-bg" style="position:fixed; inset:0; height:100vh; opacity:0; transform: translateY(30px); transition: all 1000ms ease-in-out; pointer-events:none; z-index:40; display:flex; align-items:center;">
      <!-- Background for after-about (reuse profile-background.jpg) -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/profile-background.jpg'); filter: blur(6px) saturate(0.95); transform: scale(1.05);"></div>
        <div class="absolute inset-0 bg-white/85"></div>
      </div>
      <div class="container-custom">
        <h2 class="text-3xl font-bold mb-4">What's Next</h2>
        <p class="text-gray-700">This section replaces the About with a smooth split + reveal animation.</p>
      </div>
    </div>
  `;
};
