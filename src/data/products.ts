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
        "id": 1,
        "name": "SP PC INTEL i5 12400F (i5 12400F/ B760/ Ram 8GB/ RTX 3050/ SSD 256GB/ 500W/ DOS)",
        "category": "PC Gaming ",
        "description": "",
        "image": "https://songphuong.vn/Content/uploads/2023/05/SP-PC-INTEL-i5-12400F-1-2.webp",
        "link": "https://songphuong.vn/product/sp-pc-intel-i5-12400f/",
        "price": " 15.390.000",
        "oldPrice": " 16.399.000",
        "discount": 6,
        "sku": "109863",
        "rating": 5,
        "status": "Hot"
    },
    {
        "id": 3,
        "name": "SP PC INTEL i5 14400F RTX 5060 (i5 14400F/ B760/ Ram 16GB/ RTX 5060/ SSD 256GB/ 650W/ DOS)",
        "category": "High-End Gaming",
        "description": "CPU: Intel Core i5 14400F\nMain: MSI PRO B760M-E DDR4\nRam: 01 Tản Ocypus Delta A40 BK ARGB: 539.000 vnđ\nVGA: Colorful RTX 5060 Battle AX Duo 8GB-V\nSSD: Colorful CN600 256GB PRO M2\nPSU: Thermaltake Litepower 650W\nCase:MIK FOCALORS M BLACK (3 Fan RGB)\nOS: DOS",
        "image": "https://songphuong.vn/Content/uploads/2025/11/SP-PC-INTEL-i5-14400F-RTX-5060-1.jpg",
        "link": "https://songphuong.vn/product/sp-pc-intel-i5-14400f-rtx-5060/",
        "price": "23.790.000",
        "oldPrice": " 24.610.000",
        "discount": 3,
        "sku": "147143",
        "rating": 5,
        "status": null
    },
    {
        "id": 2,
        "name": "SP PC AMD 3200G (Ryzen 3 3200G/ B450/ Ram 8GB DDR4/ SSD 256GB/ 250W/ DOS)",
        "category": "Office PC",
        "description": "",
        "image": "https://songphuong.vn/Content/uploads/2023/07/SP-PC-AMD-3000G.jpg",
        "link": "https://songphuong.vn/product/sp-pc-amd-3200g/",
        "price": "6.890.000",
        "oldPrice": " 7.319.000",
        "discount": 6,
        "sku": "SP-PC-O02",
        "rating": 5,
        "status": null
    },
    {
        "id": 5,
        "name": "Laptop Acer Aspire Lite 14 N23G2 – AL14-52M-32KV (Intel Core i3-1305U, RAM 8GB, SSD 256GB, 14 Inch WUXGA, Win11 Home, NX.J38SV.003)",
        "category": "Laptop",
        "description": "Ultra-portable and sleek design, perfect for students and professionals on the go.",
        "image": "https://songphuong.vn/Content/uploads/2025/08/Laptop-Acer-Aspire-Lite-14-AL14-52M-32KV-2.webp",
        "link": "https://songphuong.vn/product/laptop-acer-aspire-lite-14-n23g2/",
        "price": " 11.390.000",
        "oldPrice": "",
        "discount": 0,
        "sku": "142477",
        "rating": 5,
        "status": null
    },
    {
        "name": "VGA Colorful iGame GeForce RTX 5060 TI Ultra W DUO OC 16GB",
        "category": "VGA",
        "price": "15.090.000",
        "oldPrice": "16.490.000",
        "discount": 8,
        "sku": "133685",
        "status": null,
        "image": "https://songphuong.vn/Content/uploads/2025/04/VGA-Colorful-iGame-GeForce-RTX-5060-TI-Ultra-W-DUO-OC-16GB.jpg",
        "link": "https://songphuong.vn/product/vga-colorful-rtx-5060-ti-ultra-w-duo-oc-16gb/",
        "description": "Thương hiệu: Colorful\nModel: RTX 5060 Ti Ultra W DUO OC 16GB\nDung lượng: 16GB GDDR7\nBăng thông: 128-bit\nTốc độ bộ nhớ: 28Gb/giây\nChuẩn giao tiếp: PCIe 5.0\nKết nối: 1 x HDMI 2.1b, 3 x DisplayPort 2.1b\nNguồn yêu cầu: 550W\nKích thước: 243.5 x 135 x 49.4mm",
        "rating": 5,
        "id": 9
    },
    {
        "id": 4,
        "name": "Chuột Machenike L8 Pro Tri-Mode (White/Black, Wireless, 26000 DPI, RGB, Kèm Dock Sạc)",
        "category": "Gaming Gear",
        "description": "Chuột Machenike L8 Pro Tri-Mode Wireless\nThương Hiệu: Machenike\nPhương thức kết nối: Wired (Support 8K)/ 2.4GHz Wireless (Support 2K)/ Bluetooth 5.1\nMàu sắc: White\nCảm biến: PAW 3395\nDPI: 26000\nKèm theo Dock sạc",
        "image": "https://songphuong.vn/Content/uploads/2025/06/L8-Pro-Tri-Modes-5.webp",
        "link": "https://songphuong.vn/product/chuot-machenike-l8-pro-tri-mode/",
        "price": "1.390.000",
        "oldPrice": "1.690.000",
        "discount": 18,
        "sku": "137830",
        "rating": 5,
        "status": "Hot"
    },
    {
        "id": 6,
        "name": "Tay Cầm Chơi Game Machenike G3 V2 Tri-mode (Black, Có dây, 2.4G Wireless, Bluetooth 5.0, RGB)",
        "category": "Gaming Gear",
        "description": "Enhanced gaming experience with responsive triggers and durable build quality.",
        "image": "https://songphuong.vn/Content/uploads/2025/04/MACHENIKE-G3-V2-Tri-mode-1.jpg",
        "link": "https://songphuong.vn/product/tay-cam-choi-game-machenike-g3-v2-black/",
        "price": "729.000",
        "oldPrice": " 890.000",
        "discount": 18,
        "sku": "134653",
        "rating": 5,
        "status": "Hot"
    },
    {
        "name": "Bàn phím cơ Xiberia CZ98 Black Gradient (Hotswap/Magnetic switch/Led RGB/Waterproof)",
        "category": "Bàn Phím Gaming",
        "price": "1.690.000",
        "oldPrice": " 1.950.000",
        "discount": 13,
        "sku": "138974",
        "status": "New",
        "image": "https://songphuong.vn/Content/uploads/2025/06/Ban-phim-co-Xiberia-CZ98-Black-Gradient-2.webp",
        "link": "https://songphuong.vn/product/ban-phim-co-xiberia-cz98-black-gradient/",
        "description": "Sản phẩm: XIBERIA CZ98\nLoại bàn phím: Gaming Mechanical Keyboard\nKết nối: USB 2.0\nMàu sắc:Black Gradient\nKeycap: 99 phím, Double-shot PBT , HOTSWAP\nLoại công tắc bàn phím: Magnetic switch(Xiberia) độ bền lên tới 100 triệu lần nhấn\nTốc độ phản hồi và độ trễ: 0.1ms / Polling rate: 1000Hz / Scan Rate: 2000Hz\nPhương thức kết nối: Có dây\nCông nghệ NANO được phủ 2 bề mặt phím giúp khả năng chống nước tốt hơn\nDòng điện hoạt động: 350mA\nThiết kế bề mặt phím sử dung chất liệu Nhôm cao cấp\nAnti-ghosting Number: Full\nChiều dài cáp (m): Tổng chiều dài 1,8m được thiết kế cục từ 4.0 chất liệu Nhôm-Magie với lõi nhôm chống nhiễu\nSở hữu 19 hiệu ứng RGB & Thiết kế LED RGB ở hai bên.",
        "rating": 5,
        "id": 7
    },
    {
        "name": "Loa Bluetooth Thonet & Vander KUMPEL 2.0 (Đen/Trắng)",
        "category": "Loa Âm Thanh",
        "price": "2.690.000",
        "oldPrice": " 3.580.000",
        "discount": 25,
        "sku": "139047",
        "status": "Sale",
        "image": "https://songphuong.vn/Content/uploads/2025/06/KUMPEL-2.0-2.webp",
        "link": "https://songphuong.vn/product/loa-bluetooth-thonet-vander-kumpel-2-0/",
        "description": "Thương Hiệu: Thonet & Vander\nModel: KUMPEL 2.0\nHệ thống 2.0, hai chiều, tủ phản xạ âm trầm\nKết nối: Bluetooth, 3.5 mm, RCA, Quang kỹ thuật số\nĐèn báo đầu vào LED\nBảng điều khiển bên hông\nCân bằng âm trầm và âm bổng\nĐầu ra thụ động cho loa siêu trầm chủ động",
        "rating": 5,
        "id": 8
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
    get: (_target, prop) => {
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
    getOwnPropertyDescriptor: (_target, prop) => {
        return Reflect.getOwnPropertyDescriptor(productStore.getProducts(), prop);
    }
}) as Product[]; // Type cast to fool TS into thinking it's a simple array
