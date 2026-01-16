export const renderContactLayer = (): string => {
    return `
    <div id="contact-layer" class="col-start-1 row-start-1 transition-all duration-700 ease-in-out" style="opacity: 0; pointer-events: none;">
      <div>
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <span class="w-2 h-2 bg-clean-accent rounded-full mr-3"></span>
          Contact
        </h2>
        <div class="flex flex-col gap-4">
          <p class="text-gray-700">Email: <a href="mailto:hello@example.com" class="text-clean-accent">hello@example.com</a></p>
          <p class="text-gray-700">Phone: <a href="tel:+84911818016" class="text-clean-accent">+84 911 818 016</a></p>
        </div>
      </div>
    </div>
  `;
};
