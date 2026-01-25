export interface Product {
    id: number;
    name: string;
    category: string;
    description: string;
    image: string;
    link: string;
    price: string;
    oldPrice: string;
    discount: number;
    sku: string;
    rating: number; // 0-5
    status?: 'New' | 'Hot' | 'Sale' | null;
}

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "SP PC Intel Core i5-12400F | RTX 3050 8GB",
        category: "Gaming PC",
        description: "A balanced powerhouse for gaming and multitasking, optimized for stability and performance.",
        image: "https://songphuong.vn/Content/uploads/2023/05/SP-PC-INTEL-i5-12400F-1-2.webp",
        link: "https://songphuong.vn/product/sp-pc-intel-i5-12400f/",
        price: "12.490.000",
        oldPrice: "14.500.000",
        discount: 14,
        sku: "SP-PC-G01",
        rating: 5,
        status: 'Hot'
    },
    {
        id: 2,
        name: "SP PC AMD Ryzen 3 3200G | Vega 8",
        category: "Office PC",
        description: "Efficient and budget-friendly solution for daily office tasks and casual entertainment.",
        image: "https://songphuong.vn/Content/uploads/2023/07/SP-PC-AMD-3000G.jpg",
        link: "https://songphuong.vn/product/sp-pc-amd-3200g/",
        price: "5.990.000",
        oldPrice: "7.200.000",
        discount: 17,
        sku: "SP-PC-O02",
        rating: 4.5,
        status: 'Sale'
    },
    {
        id: 3,
        name: "SP PC i5-14400F | RTX 4060 Ti | 32GB RAM",
        category: "High-End Gaming",
        description: "Cutting-edge performance featuring the latest RTX 40-series graphics for ultimate visual fidelity.",
        image: "https://songphuong.vn/Content/uploads/2025/11/SP-PC-INTEL-i5-14400F-RTX-5060-1.jpg",
        link: "https://songphuong.vn/product/sp-pc-intel-i5-14400f-rtx-5060/",
        price: "24.990.000",
        oldPrice: "28.000.000",
        discount: 11,
        sku: "SP-PC-G03",
        rating: 5,
        status: 'New'
    },
    {
        id: 4,
        name: "Machenike L8 Pro Tri-mode Wireless Mouse",
        category: "Gaming Gear",
        description: "High-precision wireless gaming mouse with triple-mode connectivity and ergonomic design.",
        image: "https://songphuong.vn/Content/uploads/2025/06/L8-Pro-Tri-Modes-5.webp",
        link: "https://songphuong.vn/product/chuot-machenike-l8-pro-tri-mode/",
        price: "890.000",
        oldPrice: "1.200.000",
        discount: 25,
        sku: "GEAR-M01",
        rating: 4.8,
        status: null
    },
    {
        id: 5,
        name: "Acer Aspire Lite 14 | i5-1235U | 16GB",
        category: "Laptop",
        description: "Ultra-portable and sleek design, perfect for students and professionals on the go.",
        image: "/img/products/LAP-AC01.webp",
        link: "https://songphuong.vn/product/laptop-acer-aspire-lite-14-n23g2/",
        price: "13.490.000",
        oldPrice: "15.990.000",
        discount: 16,
        sku: "LAP-AC01",
        rating: 4.7,
        status: 'Sale'
    },
    {
        id: 6,
        name: "Machenike G3 V2 Black Controller",
        category: "Gaming Gear",
        description: "Enhanced gaming experience with responsive triggers and durable build quality.",
        image: "https://songphuong.vn/Content/uploads/2025/04/MACHENIKE-G3-V2-Tri-mode-1.jpg",
        link: "https://songphuong.vn/product/tay-cam-choi-game-machenike-g3-v2-black/",
        price: "550.000",
        oldPrice: "750.000",
        discount: 27,
        sku: "GEAR-C01",
        rating: 4.6,
        status: 'Hot'
    }
];

class ProductStore {
    private products: Product[];
    private readonly STORAGE_KEY = 'portfolio_products_v1';
    private listeners: (() => void)[] = [];

    constructor() {
        this.products = this.loadFromStorage();
    }

    private loadFromStorage(): Product[] {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load products from localStorage', e);
        }
        return [...INITIAL_PRODUCTS];
    }

    private saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.products));
            this.notifyListeners();
        } catch (e) {
            console.error('Failed to save products to localStorage', e);
        }
    }

    public getProducts(): Product[] {
        return this.products;
    }

    public addProduct(product: Omit<Product, 'id'>) {
        // Generate new ID (max id + 1)
        const maxId = this.products.reduce((max, p) => Math.max(max, p.id), 0);
        const newProduct = { ...product, id: maxId + 1 };
        this.products.push(newProduct);
        this.saveToStorage();
    }

    public updateProduct(id: number, updates: Partial<Omit<Product, 'id'>>) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updates };
            this.saveToStorage();
        }
    }

    public deleteProduct(id: number) {
        this.products = this.products.filter(p => p.id !== id);
        this.saveToStorage();
    }

    public moveProduct(id: number, direction: 'up' | 'down') {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return;

        if (direction === 'up' && index > 0) {
            // Swap with previous
            [this.products[index], this.products[index - 1]] = [this.products[index - 1], this.products[index]];
            this.saveToStorage();
        } else if (direction === 'down' && index < this.products.length - 1) {
            // Swap with next
            [this.products[index], this.products[index + 1]] = [this.products[index + 1], this.products[index]];
            this.saveToStorage();
        }
    }

    public resetToDefaults() {
        this.products = [...INITIAL_PRODUCTS];
        this.saveToStorage();
    }

    public subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l());
    }
}

export const productStore = new ProductStore();

// For backward compatibility with existing code that imports songPhuongProducts
// We use a getter to always return the current state
export const songPhuongProducts = new Proxy([], {
    get: (target, prop) => {
        // This is a bit of a hack to make the array behave like a real array but dynamic
        // Basically we delegate all array operations to the current internal state of store
        const currentProducts = productStore.getProducts();
        const value = Reflect.get(currentProducts, prop);
        return typeof value === 'function' ? value.bind(currentProducts) : value;
    },
    // Support iteration
    ownKeys: () => {
        return Reflect.ownKeys(productStore.getProducts());
    },
    getOwnPropertyDescriptor: (target, prop) => {
        return Reflect.getOwnPropertyDescriptor(productStore.getProducts(), prop);
    }
}) as Product[]; // Type cast to fool TS into thinking it's a simple array
