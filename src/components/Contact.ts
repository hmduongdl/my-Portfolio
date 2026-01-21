export const renderContact = (): string => {
    return `
    <section id="contact" class="section bg-white relative z-[55]">
        <div class="container-custom h-auto">
            
            <!-- Header -->
            <div class="mb-8 text-center">
                <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-serif tracking-tight">
                    Get In Touch
                </h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    I'm here to help you with any questions or concerns you may have. Don't hesitate to reach out!
                </p>
            </div>

                <!-- Main Layout -->
                <div class="flex flex-col gap-0">
                    
                    <!-- TOP ROW: ZONE 1 (QR) | ZONES 2+3 (Header + Steps) -->
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                        
                        <!-- ===================== ZONE 1: QR Code Card ===================== -->
                        <div class="md:col-span-5">
                            <div class="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                                <!-- QR Container -->
                                <div class="w-full max-w-[240px] aspect-square bg-white rounded-2xl overflow-hidden mb-3 border-2 border-dashed border-gray-200 p-2">
                                    <img src="/img/zalo-contact-qr.jpg" 
                                         alt="Zalo QR Code" 
                                         class="w-full h-full object-contain"
                                    >
                                </div>
                                
                                <!-- Text -->
                                <p class="text-gray-500 font-medium text-sm">
                                    Scan with camera or Zalo app
                                </p>
                            </div>
                        </div>

                        <!-- ===================== Right Column: ZONES 2 + 3 ===================== -->
                        <div class="md:col-span-7 flex flex-col gap-6">
                            
                            <!-- ===================== ZONE 2: Name Header (Rounded Pill) ===================== -->
                            <div class="bg-emerald-600 rounded-full py-2 px-6 inline-flex items-center justify-center gap-3 shadow-md">
                                <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                     <img src="/icons8-zalo-64.png" alt="Zalo" class="w-full h-full object-contain">
                                </div>
                                <h3 class="text-lg md:text-xl font-bold text-white leading-tight whitespace-nowrap">
                                    Hoàng Minh Dương
                                </h3>
                            </div>

                            <!-- ===================== ZONE 3: Steps List ===================== -->
                            <div class="space-y-5">
                                <div class="flex gap-4 items-start">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
                                    <div>
                                        <h4 class="font-bold text-gray-900 text-lg leading-tight">Open Zalo App</h4>
                                        <p class="text-gray-500 text-base mt-1 leading-relaxed">On your phone or computer</p>
                                    </div>
                                </div>
                                <div class="flex gap-4 items-start">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">2</div>
                                    <div>
                                        <h4 class="font-bold text-gray-900 text-lg leading-tight">Select "Scan QR Code"</h4>
                                        <p class="text-gray-500 text-base mt-1 leading-relaxed">Located at the top right of the screen</p>
                                    </div>
                                </div>
                                <div class="flex gap-4 items-start">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">3</div>
                                    <div>
                                        <h4 class="font-bold text-gray-900 text-lg leading-tight">Point camera at QR Code</h4>
                                        <p class="text-gray-500 text-base mt-1 leading-relaxed">And start chatting with me instantly</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ===================== ZONE 4: Action Buttons (FULL WIDTH - Separate Row) ===================== -->
                    <div class="pt-4 md:pt-2 border-t border-gray-100 grid grid-cols-2 md:flex md:flex-row gap-3 md:justify-end md:pr-0.5">
                        <!-- Download Button -->
                        <button id="btn-download-qr" class="inline-flex items-center justify-center gap-2 px-3 md:px-5 py-3 bg-emerald-600 text-white rounded-xl shadow-md font-medium hover:bg-emerald-700 transition-all text-sm md:text-base">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Tải xuống QR
                        </button>
                        
                        <!-- Copy Link Button -->
                        <button id="btn-copy-link" class="inline-flex items-center justify-center gap-2 px-3 md:px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm hover:bg-gray-50 transition-all text-sm md:text-base">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                            Copy Link
                        </button>
                    </div>
                </div>

        </div>
    </section>
    `;
};

export const initContact = (): void => {
    // 1. Handle Download QR
    const btnDownload = document.getElementById('btn-download-qr');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = '/img/zalo-contact-qr.jpg';
            link.download = 'HoangMinhDuong_ZaloQR.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // 2. Handle Copy Link
    const btnCopy = document.getElementById('btn-copy-link');
    if (btnCopy) {
        btnCopy.addEventListener('click', async () => {
            const zaloLink = 'https://zalo.me/0911818016';
            try {
                await navigator.clipboard.writeText(zaloLink);
                // Simple Toast notification or alert
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!`;
                btnCopy.classList.add('border-green-500', 'text-green-600', 'bg-green-50');

                setTimeout(() => {
                    btnCopy.innerHTML = originalText;
                    btnCopy.classList.remove('border-green-500', 'text-green-600', 'bg-green-50');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        });
    }

};


