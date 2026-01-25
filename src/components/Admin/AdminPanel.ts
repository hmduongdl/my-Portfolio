
import { productStore, Product } from '../../data/products';

export const renderAdminPanel = (): string => {
    return `
    <div class="fixed inset-0 bg-gray-50 z-[100] overflow-y-auto">
        <div class="container mx-auto px-4 py-8">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Showcase Management</h1>
                <div class="flex gap-4">
                    <a href="#" id="exit-admin" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Exit to Site</a>
                    <button id="export-data" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Export to Code</button>
                    <button id="reset-defaults" class="px-4 py-2 text-red-600 hover:text-red-700 underline text-sm">Reset Defaults</button>
                    <button id="add-product-btn" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Product
                    </button>
                </div>
            </div>

            <!-- Product List -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name / SKU</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (New/Old)</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100" id="admin-product-list">
                            <!-- Populated via JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div id="product-modal" class="fixed inset-0 bg-black/50 hidden flex items-center justify-center z-[110]">
            <div class="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 class="text-xl font-bold" id="modal-title">Add Product</h3>
                    <button id="close-modal" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form id="product-form" class="p-6 space-y-4">
                    <input type="hidden" id="p-id">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input type="text" id="p-name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input type="text" id="p-category" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Price (VND)</label>
                            <input type="text" id="p-price" required placeholder="12.490.000" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Old Price (VND)</label>
                            <input type="text" id="p-oldPrice" placeholder="14.500.000" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                            <input type="number" id="p-discount" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        </div>
                    </div>

                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input type="text" id="p-sku" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select id="p-status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                <option value="">None</option>
                                <option value="New">New</option>
                                <option value="Hot">Hot</option>
                                <option value="Sale">Sale</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input type="url" id="p-image" required placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Product Link</label>
                        <input type="url" id="p-link" placeholder="https://..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                    </div>
                    
                     <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="p-description" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"></textarea>
                    </div>

                    <div class="pt-4 flex justify-end gap-3 border-t border-gray-100">
                        <button type="button" id="cancel-form" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">Save Product</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
};

export const initAdminPanel = (): void => {
    const listBody = document.getElementById('admin-product-list');
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form') as HTMLFormElement;
    const modalTitle = document.getElementById('modal-title');
    const resetBtn = document.getElementById('reset-defaults');

    const renderList = () => {
        if (!listBody) return;
        const products = productStore.getProducts();

        listBody.innerHTML = products.map((p, index) => `
            <tr class="hover:bg-gray-50 group transition-colors">
                <td class="px-6 py-4">
                    <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                         <img src="${p.image}" alt="" class="w-full h-full object-cover">
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium text-gray-900">${p.name}</div>
                    <div class="text-xs text-gray-500">${p.sku}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">${p.category}</td>
                <td class="px-6 py-4">
                     <div class="text-sm font-medium text-emerald-600">${p.price}đ</div>
                     ${p.oldPrice ? `<div class="text-xs text-gray-400 line-through">${p.oldPrice}đ</div>` : ''}
                </td>
                <td class="px-6 py-4">
                    ${p.status ?
                `<span class="px-2 py-1 text-xs font-bold rounded-full 
                            ${p.status === 'New' ? 'bg-blue-100 text-blue-700' :
                    p.status === 'Hot' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}">
                            ${p.status}
                        </span>` :
                '<span class="text-gray-400 text-xs">-</span>'}
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2 text-gray-400">
                         <button class="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded" onclick="window.dispatchEvent(new CustomEvent('admin:move', {detail: {id: ${p.id}, dir: 'up'}}))" title="Move Up">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
                        </button>
                        <button class="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded" onclick="window.dispatchEvent(new CustomEvent('admin:move', {detail: {id: ${p.id}, dir: 'down'}}))" title="Move Down">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <button class="p-1 hover:text-blue-600 hover:bg-blue-50 rounded" onclick="window.dispatchEvent(new CustomEvent('admin:edit', {detail: ${p.id}}))" title="Edit">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button class="p-1 hover:text-red-600 hover:bg-red-50 rounded" onclick="window.dispatchEvent(new CustomEvent('admin:delete', {detail: ${p.id}}))" title="Delete">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    };

    // --- Modal Logic ---
    const openModal = (product?: Product) => {
        if (modal) {
            modal.classList.remove('hidden');
            if (product) {
                if (modalTitle) modalTitle.textContent = 'Edit Product';
                // Populate fields
                (document.getElementById('p-id') as HTMLInputElement).value = product.id.toString();
                (document.getElementById('p-name') as HTMLInputElement).value = product.name;
                (document.getElementById('p-category') as HTMLInputElement).value = product.category;
                (document.getElementById('p-price') as HTMLInputElement).value = product.price;
                (document.getElementById('p-oldPrice') as HTMLInputElement).value = product.oldPrice || '';
                (document.getElementById('p-discount') as HTMLInputElement).value = product.discount.toString();
                (document.getElementById('p-sku') as HTMLInputElement).value = product.sku || '';
                (document.getElementById('p-status') as HTMLSelectElement).value = product.status || '';
                (document.getElementById('p-image') as HTMLInputElement).value = product.image;
                (document.getElementById('p-link') as HTMLInputElement).value = product.link || '';
                (document.getElementById('p-description') as HTMLTextAreaElement).value = product.description || '';
            } else {
                if (modalTitle) modalTitle.textContent = 'Add Product';
                form.reset();
                (document.getElementById('p-id') as HTMLInputElement).value = '';
            }
        }
    };

    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    document.getElementById('add-product-btn')?.addEventListener('click', () => openModal());
    document.getElementById('close-modal')?.addEventListener('click', closeModal);
    document.getElementById('cancel-form')?.addEventListener('click', closeModal);

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const idStr = (document.getElementById('p-id') as HTMLInputElement).value;

        const productData: any = {
            name: (document.getElementById('p-name') as HTMLInputElement).value,
            category: (document.getElementById('p-category') as HTMLInputElement).value,
            price: (document.getElementById('p-price') as HTMLInputElement).value,
            oldPrice: (document.getElementById('p-oldPrice') as HTMLInputElement).value,
            discount: Number((document.getElementById('p-discount') as HTMLInputElement).value),
            sku: (document.getElementById('p-sku') as HTMLInputElement).value,
            status: (document.getElementById('p-status') as HTMLSelectElement).value || null,
            image: (document.getElementById('p-image') as HTMLInputElement).value,
            link: (document.getElementById('p-link') as HTMLInputElement).value,
            description: (document.getElementById('p-description') as HTMLTextAreaElement).value,
            rating: 5, // Default
        };

        if (idStr) {
            productStore.updateProduct(Number(idStr), productData);
        } else {
            productStore.addProduct(productData);
        }
        closeModal();
        renderList();
        // Since we are single page app, changes propagate to store, and if we exit admin, site is updated
    });

    // Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to revert to the original default products? All changes will be lost.')) {
                productStore.resetToDefaults();
                renderList();
            }
        });
    }

    // Export
    document.getElementById('export-data')?.addEventListener('click', async () => {
        const products = productStore.getProducts();
        // format as code
        const code = JSON.stringify(products, null, 4)
            .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys for JS object style (optional, but cleaner)
            .replace(/"/g, "'"); // Use single quotes (optional preference)

        // Use JSON for reliability usually, but let's try to match the TS format decently
        // Actually, pure JSON is valid JS/TS. Let's just give them pure JSON for safety, they can just paste it into the array.
        // Or better yet, just give them the array content.

        const jsonContent = JSON.stringify(products, null, 4);

        try {
            await navigator.clipboard.writeText(jsonContent);
            alert('Data copied to clipboard! \n\nTo make these changes permanent in your code:\n1. Open src/data/products.ts\n2. Replace the content of INITIAL_PRODUCTS array with this copied data.');
        } catch (err) {
            console.error('Failed to copy', err);
            alert('Failed to copy data. Check console.');
        }
    });

    // --- Auto Calculate Discount ---
    const priceInput = document.getElementById('p-price') as HTMLInputElement;
    const oldPriceInput = document.getElementById('p-oldPrice') as HTMLInputElement;
    const discountInput = document.getElementById('p-discount') as HTMLInputElement;

    const parsePrice = (str: string): number => {
        // Remove dots or commas or non-digits to get raw number
        return Number(str.replace(/[^0-9]/g, ''));
    };

    const calculateDiscount = () => {
        const price = parsePrice(priceInput.value);
        const oldPrice = parsePrice(oldPriceInput.value);

        if (price > 0 && oldPrice > 0 && oldPrice > price) {
            const disc = Math.round(((oldPrice - price) / oldPrice) * 100);
            discountInput.value = disc.toString();
        } else {
            // Either invalid prices or price >= oldPrice (no discount)
            // We can optionally clear it or leave it. Let's clear if logic fails or is negative
            // But if user manually wants -10, we shouldn't force it unless inputs change.
            // Only update if we have a valid calculated value?
            if (oldPrice > 0 && price > 0) discountInput.value = '0';
        }
    };

    if (priceInput && oldPriceInput) {
        priceInput.addEventListener('input', calculateDiscount);
        oldPriceInput.addEventListener('input', calculateDiscount);
    }

    // --- Global Custom Event Listeners (using window to capture events from inline onclick) ---
    // Note: In real app, avoid inline onclick, but for simple vanilla JS structure it's cleanest here
    window.addEventListener('admin:delete', ((e: CustomEvent) => {
        if (confirm('Delete this product?')) {
            productStore.deleteProduct(e.detail);
            renderList();
        }
    }) as EventListener);

    window.addEventListener('admin:edit', ((e: CustomEvent) => {
        const p = productStore.getProducts().find(x => x.id === e.detail);
        if (p) openModal(p);
    }) as EventListener);

    window.addEventListener('admin:move', ((e: CustomEvent) => {
        productStore.moveProduct(e.detail.id, e.detail.dir);
        renderList();
    }) as EventListener);

    renderList();
};
