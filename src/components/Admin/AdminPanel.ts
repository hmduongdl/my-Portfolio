
// PUBLIC DUMMY ADMIN GATEWAY
// This file is safe to be committed. It checks for the existence of the Private Admin file.

export const renderAdminPanel = async (): Promise<string> => {
    // Vite's import.meta.glob returns an object where keys are paths and values are import functions.
    // If the file is not in the repo (gitignored), this might be empty in production build context if strict,
    // or it might be present if the file exists on disk.

    // Attempt dynamic import with error handling
    try {
        const modules = import.meta.glob('./PrivateAdmin.ts');
        const loader = modules['./PrivateAdmin.ts'];

        if (loader) {
            const mod = await loader() as any;
            return mod.renderPrivateAdminPanel();
        } else {
            return `
            <div class="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center z-[100]">
                <h1 class="text-4xl font-bold text-gray-800 mb-4">404 Not Found</h1>
                <p class="text-gray-600 mb-8">The requested administrative resource is not available.</p>
                <a href="#" onclick="window.location.hash=''; return false;" class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition-colors">Return Home</a>
            </div>
            `;
        }
    } catch (e) {
        console.error("Admin Load Error", e);
        return "<h1>Error loading resource</h1>";
    }
};

export const initAdminPanel = async (): Promise<void> => {
    try {
        const modules = import.meta.glob('./PrivateAdmin.ts');
        const loader = modules['./PrivateAdmin.ts'];
        if (loader) {
            const mod = await loader() as any;
            if (mod.initPrivateAdminPanel) {
                mod.initPrivateAdminPanel();
            }
        }
    } catch (e) {
        // Silent fail or log
    }
};
