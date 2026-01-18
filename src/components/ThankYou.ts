export const renderThankYou = (): string => {
    return `
    <section id="thankyou" class="section bg-white text-gray-900 relative z-10 flex flex-col items-center justify-center text-center overflow-hidden">
        <div class="container-custom py-24">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Thank You!</h2>
            <p class="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12">
                I appreciate you taking the time to view my portfolio. 
                If you have an interesting project or just want to connect, feel free to reach out.
            </p>
            <div class="animate-bounce">
                <a href="#hero" class="text-gray-400 hover:text-gray-900 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    <span class="sr-only">Back to Top</span>
                </a>
            </div>
            
            <div class="mt-20 pt-8 border-t border-gray-100 w-full max-w-md mx-auto">
                <p class="text-sm text-gray-400">&copy; ${new Date().getFullYear()} Minimalist Portfolio. All rights reserved.</p>
            </div>
        </div>
    </section>
    `;
};
