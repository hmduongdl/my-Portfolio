import { songPhuongProducts } from '../data/products';
import { languageManager } from '../utils/language';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export const renderProductShowcase = (): string => {
    const t = languageManager.getText('products_showcase');

    return `
    <section id="products" class="bg-white relative z-30 pt-6 sm:pt-8 md:pt-8 pb-[25px] overflow-hidden select-none w-full border-t border-gray-200">
        <!-- 1. Header Section: Centered as requested -->
        <!-- 1. Header Section: Standardized to match other sections -->
        <div class="container-custom mb-12 text-center">
            <h2 class="text-4xl md:text-5xl font-bold mb-4 text-red-600 font-serif tracking-tight">
                ${t.title}
            </h2>
            <p class="text-gray-500 text-lg font-light leading-relaxed mt-4 max-w-2xl mx-auto">
                ${t.subtitle}
            </p>
        </div>

        <!-- 2. Slider Section: Centered Container with Symmetrical Layout -->
        <!-- Using max-w-7xl to align with other sections, but overflow-visible to let shadows breathe -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/slider">
            
            <!-- Navigation Buttons (Floating Absolute) -->
            <button class="swiper-button-custom-prev absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-100 shadow-lg text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 translate-x-4 group-hover/slider:translate-x-0 disabled:opacity-0 hidden md:flex">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button class="swiper-button-custom-next absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-gray-100 shadow-lg text-slate-700 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 -translate-x-4 group-hover/slider:translate-x-0 disabled:opacity-0 hidden md:flex">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>

            <!-- Swiper Container -->
            <div class="swiper product-swiper !pb-12 !px-1">
                <div class="swiper-wrapper">
                    ${songPhuongProducts.map(product => `
                        <div class="swiper-slide h-auto">
                            <!-- Product Card -->
                            <div class="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1">
                                
                                <!-- Image Container (Square + Placeholder) -->
                                <div class="relative w-full aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                                     <!-- Placeholder Icon -->
                                     <div class="absolute inset-0 flex items-center justify-center text-slate-200">
                                        <svg class="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4 1l5-5l5 5l3-3v13h-18v-1z"></path></svg>
                                     </div>
                                     
                                    <img src="${product.image}" 
                                         alt="${product.name}" 
                                         class="relative z-10 h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110 mix-blend-multiply"
                                         loading="lazy"
                                         onerror="
                                            const currentSrc = this.src;
                                            if (currentSrc.endsWith('.webp')) {
                                                this.src = currentSrc.replace('.webp', '.jpg');
                                            } else if (currentSrc.endsWith('.jpg')) {
                                                this.src = currentSrc.replace('.jpg', '.png');
                                            } else {
                                                this.style.display='none'; 
                                                this.previousElementSibling.style.opacity='1';
                                            }
                                         "
                                    >
                                    
                                    <!-- Discount Badge -->
                                    ${product.discount > 0 ? `
                                    <span class="absolute left-3 top-3 z-20 rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm font-mono uppercase tracking-wide">
                                        -${product.discount}%
                                    </span>` : ''}
                                </div>

                                <!-- Content -->
                                <div class="flex flex-1 flex-col p-5 border-t border-gray-50">
                                    <div class="mb-2 flex items-center justify-between">
                                        <span class="text-[10px] uppercase tracking-widest text-slate-400 font-bold truncate pr-2">
                                            ${product.category}
                                        </span>
                                        ${product.status ? `
                                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-wide">
                                            ${product.status}
                                        </span>` : ''}
                                    </div>
                                    
                                    <h3 class="mb-2 line-clamp-2 text-sm md:text-base font-bold text-slate-900 leading-snug min-h-[2.5rem] group-hover:text-emerald-600 transition-colors">
                                        <a href="${product.link}" target="_blank" class="focus:outline-none">
                                            ${product.name}
                                        </a>
                                    </h3>
                                    
                                    <div class="mt-auto flex items-baseline gap-2 pt-2">
                                        <span class="text-lg font-extrabold text-red-600">
                                            ${product.price}đ
                                        </span>
                                        ${product.oldPrice ? `
                                        <span class="text-xs text-gray-400 line-through font-medium">
                                            ${product.oldPrice}đ
                                        </span>` : ''}
                                    </div>
                                </div>
                                
                                <!-- Quick View Overlay (Bottom) -->
                                <div class="absolute inset-x-0 bottom-0 z-30 translate-y-full px-4 py-3 transition-transform duration-300 group-hover:translate-y-0 bg-white/95 backdrop-blur-sm border-t border-gray-100">
                                    <a href="${product.link}" target="_blank" class="flex w-full items-center justify-center gap-2 rounded bg-slate-900 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-600 transition-colors">
                                        <span>View Details</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
             <!-- Bottom CTA mobile -->
            <div class="mt-4 text-center md:hidden">
                 <a href="https://songphuong.vn" target="_blank" class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-slate-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors uppercase tracking-wider">
                    View More
                 </a>
            </div>
        </div>

        <style>
            .swiper-button-disabled {
                opacity: 0;
                cursor: not-allowed;
            }
        </style>
    </section>
    `;
};

export const initProductShowcase = (): void => {
    const swiperEl = document.querySelector('.product-swiper');
    if (!swiperEl) return;

    new Swiper('.product-swiper', {
        modules: [Navigation],
        spaceBetween: 24,
        // Centered layout configuration
        breakpoints: {
            0: {
                slidesPerView: 1.2,
                spaceBetween: 16,
                centeredSlides: true, // Center on mobile
                loop: true, // Infinite loop on mobile for better feel
            },
            640: {
                slidesPerView: 2.2,
                spaceBetween: 20,
                centeredSlides: false,
                loop: false,
            },
            1024: {
                slidesPerView: 4, // 4 items strictly for symmetry in 7xl container
                spaceBetween: 24,
                loop: false,
            },
        },
        grabCursor: true,
        speed: 600,
        navigation: {
            nextEl: '.swiper-button-custom-next',
            prevEl: '.swiper-button-custom-prev',
        }
    });
};
