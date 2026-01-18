export const renderContact = (): string => {
    return `
    <section id="contact" class="section bg-gradient-to-br from-white to-gray-50 text-gray-800 relative z-[55]">
        <div class="container-custom py-20 h-full flex flex-col justify-center">
            
            <div class="mb-12">
                <h2 class="text-3xl font-bold mb-4 flex items-center">
                    <span class="w-3 h-3 bg-green-500 rounded-full mr-4"></span>
                    Contact
                </h2>
                <p class="text-gray-600 text-lg max-w-2xl">
                    I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                <!-- Contact Info -->
                <div class="space-y-6">
                     <div class="grid grid-cols-1 gap-4">
                        <a href="mailto:hello@example.com" class="flex items-center group p-4 border border-gray-100 rounded-xl hover:border-green-500 hover:shadow-md transition-all duration-300 bg-white">
                            <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500 font-medium">Email Me</p>
                                <p class="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">hello@example.com</p>
                            </div>
                        </a>

                        <a href="#" class="flex items-center group p-4 border border-gray-100 rounded-xl hover:border-green-500 hover:shadow-md transition-all duration-300 bg-white">
                             <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500 font-medium">LinkedIn</p>
                                <p class="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Connect with me</p>
                            </div>
                        </a>

                        <a href="#" class="flex items-center group p-4 border border-gray-100 rounded-xl hover:border-green-500 hover:shadow-md transition-all duration-300 bg-white">
                             <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-green-500 shadow-sm group-hover:scale-110 transition-transform">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500 font-medium">GitHub</p>
                                <p class="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Check my code</p>
                            </div>
                        </a>
                    </div>

                    <div class="pt-8">
                            <h3 class="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-4">Availability</h3>
                            <div class="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full w-fit border border-green-100">
                            <span class="relative flex h-3 w-3 mr-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Open for opportunities
                            </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                    <form class="space-y-6 relative z-10" onsubmit="event.preventDefault();">
                        <div class="relative">
                            <input type="text" id="name" class="peer w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition duration-200 outline-none placeholder-transparent" placeholder="Name">
                            <label for="name" class="absolute left-4 -top-2.5 bg-white px-1 text-xs text-green-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600 peer-focus:bg-white">Name</label>
                        </div>
                        <div class="relative">
                            <input type="email" id="email" class="peer w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition duration-200 outline-none placeholder-transparent" placeholder="Email">
                            <label for="email" class="absolute left-4 -top-2.5 bg-white px-1 text-xs text-green-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600 peer-focus:bg-white">Email</label>
                        </div>
                        <div class="relative">
                            <textarea id="message" rows="4" class="peer w-full px-4 py-3 rounded-lg bg-gray-50 border-transparent focus:border-green-500 focus:bg-white focus:ring-0 transition duration-200 outline-none placeholder-transparent" placeholder="Message"></textarea>
                            <label for="message" class="absolute left-4 -top-2.5 bg-white px-1 text-xs text-green-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-600 peer-focus:bg-white">Message</label>
                        </div>
                        <button type="submit" class="w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-lg hover:bg-black transition duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

                <footer class="mt-20 pt-8 border-t border-gray-200 text-center">
                      <div class="flex justify-center gap-4 text-gray-400">
                          <a href="#" class="hover:text-gray-600 transition-colors">Privacy</a>
                          <a href="#" class="hover:text-gray-600 transition-colors">Terms</a>
                      </div>
                </footer>
        </div>
    </section>
    `;
};
