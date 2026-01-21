export const renderContact = (): string => {
    return `
    <section id="contact" class="section bg-white relative z-[55]">
        <div class="container-custom py-24 h-full">
            
            <!-- Header -->
            <div class="mb-14 text-center">
                <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-serif tracking-tight">
                    Get In Touch
                </h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    I'm here to help you with any questions or concerns you may have. Don't hesitate to reach out!
                </p>
            </div>

            <!-- Content Card -->
            <div class="max-w-5xl mx-auto">
                <div class="flex flex-col md:flex-row gap-8 md:gap-20 items-center justify-center">
                    
                    <!-- Left: QR Code Card -->
                    <div class="relative mx-auto md:mx-0 max-w-[280px] w-full">
                        <!-- Decorative Blob (Static) -->
                        <div class="absolute -inset-4 bg-clean-accent/5 rounded-[2.5rem] transform -rotate-2 scale-105"></div>
                        
                        <div class="relative bg-white p-6 rounded-[2rem] shadow-lg border border-gray-100 text-center">
                            <div class="aspect-square w-full bg-white rounded-2xl overflow-hidden mb-6 border-2 border-dashed border-gray-200 flex items-center justify-center p-2 relative">
                                <img src="/img/zalo-contact-qr.jpg" 
                                     alt="Zalo QR Code" 
                                     class="w-full h-full object-contain"
                                >
                            </div>
                            <p class="text-gray-500 font-medium flex items-center justify-center gap-2">
                                Scan with camera or Zalo app
                            </p>
                        </div>
                    </div>

                    <!-- Right: Instructions & Actions -->
                    <div class="space-y-10">
                        <div>
                            <h3 class="text-3xl font-bold flex items-center gap-3 text-clean-accent mb-8">
                                <img src="https://img.icons8.com/?size=128&id=ipvR9njjOZmB&format=png" alt="Zalo" class="w-10 h-10 object-contain">
                                Hoàng Minh Dương
                            </h3>

                            <div class="space-y-8">
                                <div class="flex gap-5">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-clean-accent text-white flex items-center justify-center font-bold text-base shadow-md">1</div>
                                    <div class="pt-1">
                                        <h4 class="font-bold text-gray-900 text-lg mb-1">Mở ứng dụng Zalo</h4>
                                        <p class="text-gray-500">Trên điện thoại hoặc máy tính của bạn</p>
                                    </div>
                                </div>
                                <div class="flex gap-5">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-clean-accent text-white flex items-center justify-center font-bold text-base shadow-md">2</div>
                                    <div class="pt-1">
                                        <h4 class="font-bold text-gray-900 text-lg mb-1">Chọn "Quét mã QR"</h4>
                                        <p class="text-gray-500">Nằm ở góc trên bên phải màn hình</p>
                                    </div>
                                </div>
                                <div class="flex gap-5">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-clean-accent text-white flex items-center justify-center font-bold text-base shadow-md">3</div>
                                    <div class="pt-1">
                                        <h4 class="font-bold text-gray-900 text-lg mb-1">Hướng camera vào mã QR</h4>
                                        <p class="text-gray-500">Và bắt đầu trò chuyện ngay với tôi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
                            <!-- Download Button -->
                            <button id="btn-download-qr" class="inline-flex items-center gap-2 px-6 py-3.5 bg-clean-accent text-white rounded-xl shadow-lg font-medium border border-transparent">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Tải xuống QR
                            </button>
                            
                            <!-- Copy Link Button -->
                            <button id="btn-copy-link" class="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium shadow-sm">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                Sao chép link
                            </button>
                        </div>
                    </div>

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
                btnCopy.innerHTML = `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Đã sao chép!`;
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


