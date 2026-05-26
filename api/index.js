var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Pool } from 'pg';
// ============================================================================
// 1. DỮ LIỆU DỰ PHÒNG (STATIC FALLBACK DATA)
// Tự động trả về khi có lỗi kết nối Neon SQL hoặc khi bảng không tồn tại (Lỗi 500)
// ============================================================================
var FALLBACK_PROFILE = {
    id: 1,
    name: 'Hoàng Minh Dương',
    title: 'Nhà phát triển Web · Sinh viên CNTT',
    titleEn: 'Web Developer · IT Student',
    titleVn: 'Nhà phát triển Web · Sinh viên CNTT',
    bio: '',
    bioEn: '',
    bioVn: '',
    avatarUrl: '/my-avatar.jpg',
    email: 'duonghm.work@gmail.com',
    phone: '',
    githubUrl: 'https://github.com/hmduongdl',
    facebookUrl: 'https://facebook.com/',
    zaloUrl: '',
    songphuongUrl: 'https://songphuong.vn'
};
var FALLBACK_TIMELINE = [
    {
        id: 1,
        role: 'Web Developer',
        company: 'Song Phương Technology',
        companyUrl: 'https://songphuong.vn',
        period: 'Tháng 3, 2025 - Hiện tại',
        desc: [
            'Thiết kế và phát triển giao diện người dùng sáng tạo cho các trang web và ứng dụng của công ty.',
            'Quản lý hệ thống cơ sở dữ liệu và tích hợp các API dịch vụ.',
            'Tối ưu hóa hiệu suất ứng dụng và trải nghiệm người dùng.'
        ],
        type: 'work'
    },
    {
        id: 2,
        role: 'Sinh viên CNTT',
        company: 'Trường Đại học Đà Lạt',
        companyUrl: 'https://dlu.edu.vn',
        period: 'Tháng 8, 2025 - 2029',
        desc: [
            'Theo học ngành Công nghệ Thông tin.',
            'Nghiên cứu các thuật toán cơ bản, cấu trúc dữ liệu và phát triển phần mềm.'
        ],
        type: 'education'
    },
    {
        id: 3,
        role: 'Nhà thiết kế đồ họa 2D',
        company: 'Freelance',
        companyUrl: null,
        period: 'Trước đây',
        desc: [
            'Thiết kế logo, nhận diện thương hiệu và ấn phẩm truyền thông cho khách hàng.',
            'Làm việc với Photoshop, Illustrator và Figma.'
        ],
        type: 'freelance'
    }
];
var FALLBACK_PROJECTS = [
    {
        id: 'portfolio-macos',
        name: 'Song Phương macOS Portfolio',
        category: 'web',
        color: '#2563EB',
        tags: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
        desc: 'Portfolio tương tác phong cách macOS, tích hợp hệ thống cửa sổ kéo-thả, Dock và thanh menu. Cá nhân xây dựng toàn bộ UI/UX & logic state cho Song Phương Technology.',
        demoUrl: 'https://songphuong.vn',
        githubUrl: 'https://github.com/hmduongdl'
    },
    {
        id: 'ecommerce-integration',
        name: 'E-Commerce System Integration',
        category: 'web',
        color: '#10B981',
        tags: ['Node.js', 'Express', 'SQL Server', 'RESTful API'],
        desc: 'Hệ thống tích hợp thương mại điện tử với RESTful API, quản lý sản phẩm & đơn hàng, backend SQL Server. Cá nhân thiết kế kiến trúc API và tối ưu hóa query cho Song Phương Technology.',
        demoUrl: null,
        githubUrl: 'https://github.com/hmduongdl'
    },
    {
        id: 'brand-identity',
        name: 'Song Phương Brand Identity & Visual Assets',
        category: 'design',
        color: '#F59E0B',
        tags: ['Photoshop', 'Illustrator', 'Figma', '2D Design'],
        desc: 'Bộ nhận diện thương hiệu đầy đủ: thiết kế logo, hệ màu, typography và tài sản kỹ thuật số/in ấn. Cá nhân thực hiện toàn bộ từ concept đến xuất file sản xuất cho Song Phương Technology.',
        demoUrl: null,
        githubUrl: null
    },
    {
        id: 'auto-backup-tool',
        name: 'Auto Backup Tool & Database Syncer',
        category: 'tools',
        color: '#EF4444',
        tags: ['Python', 'CronJob', 'SQL Shell'],
        desc: 'Công cụ sao lưu tự động và đồng bộ cơ sở dữ liệu, chạy theo lịch với CronJob. Cá nhân viết script và thiết lập pipeline đồng bộ dev–production.',
        demoUrl: null,
        githubUrl: 'https://github.com/hmduongdl'
    }
];
var FALLBACK_PRODUCTS = [];
var FALLBACK_SEO = {
    title: 'Hoàng Minh Dương — Portfolio | Web Developer tại Song Phương Technology',
    description: 'Hoàng Minh Dương — Sinh viên IT Đại học Đà Lạt, Web Developer thực chiến tại Song Phương Technology, Freelance Designer. Chuyên React, TypeScript, Node.js và thiết kế UI/UX hiện đại.',
    keywords: 'Hoàng Minh Dương, Web Developer, Front End Developer, React, TypeScript, Node.js, Song Phương Technology, Đại học Đà Lạt, Freelance Designer, Portfolio',
    ogImage: 'https://hmduongdl.github.io/Minimalist-Design-Portfolio/songphuong-logo.png',
    twitterCard: 'summary_large_image'
};
// ============================================================================
// 2. KẾT NỐI NEON SQL BẰNG PG POOL (Singleton Pattern)
// ============================================================================
var connectionString = process.env.DATABASE_URL;
var pool;
try {
    if (connectionString) {
        if (process.env.NODE_ENV === 'production') {
            pool = new Pool({
                connectionString: connectionString,
                ssl: { rejectUnauthorized: false }
            });
        }
        else {
            if (!global.pool) {
                global.pool = new Pool({
                    connectionString: connectionString,
                    ssl: { rejectUnauthorized: false }
                });
            }
            pool = global.pool;
        }
    }
}
catch (err) {
    console.error("[Database Connection] Initialization failed:", err);
}
// Hàm thực thi DB query có wrapper try-catch
function runQuery(query_1) {
    return __awaiter(this, arguments, void 0, function (query, params) {
        var client, res;
        if (params === void 0) { params = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!pool)
                        throw new Error("Database pool is not initialized. Check DATABASE_URL.");
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, client.query(query, params)];
                case 3:
                    res = _a.sent();
                    return [2 /*return*/, res.rows];
                case 4:
                    client.release();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Helper xác thực (JWT admin đơn giản)
function verifyAdminJWT(req) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token;
        return __generator(this, function (_a) {
            try {
                authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith('Bearer '))
                    return [2 /*return*/, false];
                token = authHeader.split(' ')[1];
                return [2 /*return*/, !!token];
            }
            catch (_b) {
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
// ============================================================================
// 3. API SUPER-ROUTER
// ============================================================================
export default function handler(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, parsedUrl, path, forwardedPath, matchedPath, lang, rows, e_1, rows, p, e_2, fb, rows, mappedTimeline, e_3, fb, rows, mappedProducts, e_4, rows, mappedProjects, e_5, fb, rows, settingsObj, _i, rows_1, r, e_6, isAuthorized, body, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // CORS Configuration
                    res.setHeader('Access-Control-Allow-Credentials', 'true');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
                    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
                    if (req.method === 'OPTIONS') {
                        return [2 /*return*/, res.status(200).end()];
                    }
                    url = req.url || '';
                    parsedUrl = new URL(url, "http://".concat(req.headers.host || 'localhost'));
                    path = parsedUrl.pathname;
                    console.log("[API Router] Request received: method=".concat(req.method, " url=").concat(req.url, " parsedPath=").concat(path));
                    // Chuẩn hóa path: Loại bỏ /api prefix và định dạng nhất quán
                    path = path.replace(/^\/api/, '');
                    if (!path.startsWith('/'))
                        path = '/' + path;
                    if (path === '/index.ts' || path === '/index' || path === '/') {
                        forwardedPath = req.headers['x-vercel-forwarded-path'];
                        matchedPath = req.headers['x-matched-path'];
                        if (forwardedPath)
                            path = forwardedPath.replace(/^\/api/, '');
                        else if (matchedPath)
                            path = matchedPath.replace(/^\/api/, '');
                        if (!path.startsWith('/'))
                            path = '/' + path;
                    }
                    lang = parsedUrl.searchParams.get('lang') || 'vn';
                    if (!(path === '/health' || path === '/')) return [3 /*break*/, 4];
                    if (!pool) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'error',
                                database: 'disconnected',
                                environment: process.env.NODE_ENV,
                                message: 'DATABASE_URL_MISSING',
                                diagnostics: { databaseConfigured: false, host: req.headers.host }
                            })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, runQuery('SELECT NOW()')];
                case 2:
                    rows = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            status: 'healthy',
                            database: 'connected',
                            timestamp: rows[0].now,
                            environment: process.env.NODE_ENV,
                            diagnostics: { databaseConfigured: true, host: req.headers.host }
                        })];
                case 3:
                    e_1 = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            status: 'error',
                            database: 'error',
                            message: e_1.message,
                            environment: process.env.NODE_ENV
                        })];
                case 4:
                    if (!(req.method === 'GET')) return [3 /*break*/, 24];
                    if (!(path === '/profile')) return [3 /*break*/, 8];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, runQuery('SELECT * FROM tbl_profile LIMIT 1')];
                case 6:
                    rows = _a.sent();
                    if (rows.length === 0)
                        throw new Error('EMPTY_TABLE');
                    p = rows[0];
                    res.setHeader('x-database-status', 'online');
                    return [2 /*return*/, res.status(200).json({
                            id: p.id,
                            name: p.name,
                            title: lang === 'en' ? (p.title_en || p.title_vn) : (p.title_vn || p.title_en),
                            bio: lang === 'en' ? (p.bio_en || p.bio_vn) : (p.bio_vn || p.bio_en),
                            avatarUrl: p.avatar_url || '/my-avatar.jpg',
                            email: p.email,
                            phone: p.phone,
                            githubUrl: p.github_url,
                            facebookUrl: p.facebook_url,
                            zaloUrl: p.zalo_url,
                            songphuongUrl: p.songphuong_url,
                            titleEn: p.title_en,
                            titleVn: p.title_vn,
                            bioEn: p.bio_en,
                            bioVn: p.bio_vn
                        })];
                case 7:
                    e_2 = _a.sent();
                    console.error('[API Fallback] /profile error:', e_2);
                    res.setHeader('x-database-status', 'fallback_error');
                    fb = FALLBACK_PROFILE;
                    return [2 /*return*/, res.status(200).json(__assign(__assign({}, fb), { title: lang === 'en' ? fb.titleEn : fb.titleVn, bio: lang === 'en' ? fb.bioEn : fb.bioVn }))];
                case 8:
                    if (!(path === '/timeline')) return [3 /*break*/, 12];
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, runQuery('SELECT * FROM tbl_timeline ORDER BY id DESC')];
                case 10:
                    rows = _a.sent();
                    res.setHeader('x-database-status', 'online');
                    mappedTimeline = rows.map(function (t) {
                        var rawDesc = lang === 'en' ? t.desc_en : t.desc_vn;
                        var parsedDesc = [];
                        try {
                            if (typeof rawDesc === 'string')
                                parsedDesc = JSON.parse(rawDesc);
                            else if (Array.isArray(rawDesc))
                                parsedDesc = rawDesc;
                            else if (rawDesc)
                                parsedDesc = [String(rawDesc)];
                        }
                        catch (_a) {
                            parsedDesc = typeof rawDesc === 'string' ? [rawDesc] : [];
                        }
                        return {
                            id: t.id,
                            role: lang === 'en' ? t.role_en : t.role_vn,
                            company: t.company,
                            companyUrl: t.company_url,
                            period: lang === 'en' ? t.period_en : t.period_vn,
                            desc: parsedDesc,
                            type: t.type
                        };
                    });
                    return [2 /*return*/, res.status(200).json(mappedTimeline)];
                case 11:
                    e_3 = _a.sent();
                    console.error('[API Fallback] /timeline error:', e_3);
                    res.setHeader('x-database-status', 'fallback_error');
                    fb = FALLBACK_TIMELINE.map(function (t) { return (__assign(__assign({}, t), { role: lang === 'en' && t.role === 'Sinh viên CNTT' ? 'IT Student' : t.role, period: lang === 'en' && t.period.includes('Hiện tại') ? 'Mar 2025 - Present' : t.period })); });
                    return [2 /*return*/, res.status(200).json(fb)];
                case 12:
                    if (!(path === '/products')) return [3 /*break*/, 16];
                    _a.label = 13;
                case 13:
                    _a.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, runQuery('SELECT * FROM tbl_products WHERE visible = true ORDER BY order_index ASC')];
                case 14:
                    rows = _a.sent();
                    res.setHeader('x-database-status', 'online');
                    mappedProducts = rows.map(function (p) { return ({
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        tag: p.tag,
                        price: p.price,
                        oldPrice: p.old_price,
                        discount: p.discount,
                        imageUrl: p.image_url,
                        link: p.link,
                        color: p.color,
                        glyph: p.glyph,
                        status: p.status,
                        visible: p.visible
                    }); });
                    return [2 /*return*/, res.status(200).json(mappedProducts)];
                case 15:
                    e_4 = _a.sent();
                    console.error('[API Fallback] /products error:', e_4);
                    res.setHeader('x-database-status', 'fallback_error');
                    return [2 /*return*/, res.status(200).json(FALLBACK_PRODUCTS)];
                case 16:
                    if (!(path === '/projects')) return [3 /*break*/, 20];
                    _a.label = 17;
                case 17:
                    _a.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, runQuery('SELECT * FROM tbl_projects WHERE visible = true ORDER BY order_index ASC')];
                case 18:
                    rows = _a.sent();
                    res.setHeader('x-database-status', 'online');
                    mappedProjects = rows.map(function (proj) {
                        var tagsArray = [];
                        if (Array.isArray(proj.tags)) {
                            tagsArray = proj.tags;
                        }
                        else if (typeof proj.tags === 'string') {
                            tagsArray = proj.tags.replace(/[{}]/g, '').split(',').map(function (s) { return s.replace(/^"|"$/g, ''); });
                        }
                        return {
                            id: proj.id,
                            name: proj.name,
                            category: proj.category,
                            color: proj.color,
                            tags: tagsArray,
                            desc: lang === 'en' ? proj.desc_en : proj.desc_vn,
                            demoUrl: proj.demo_url,
                            githubUrl: proj.github_url
                        };
                    });
                    return [2 /*return*/, res.status(200).json(mappedProjects)];
                case 19:
                    e_5 = _a.sent();
                    console.error('[API Fallback] /projects error:', e_5);
                    res.setHeader('x-database-status', 'fallback_error');
                    fb = FALLBACK_PROJECTS.map(function (p) { return (__assign(__assign({}, p), { desc: lang === 'en' ? p.desc.replace('Cá nhân', 'Personally') : p.desc })); });
                    return [2 /*return*/, res.status(200).json(fb)];
                case 20:
                    if (!(path === '/seo')) return [3 /*break*/, 24];
                    _a.label = 21;
                case 21:
                    _a.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, runQuery('SELECT * FROM tbl_settings')];
                case 22:
                    rows = _a.sent();
                    res.setHeader('x-database-status', 'online');
                    if (rows.length === 0)
                        throw new Error('EMPTY_TABLE');
                    settingsObj = {};
                    for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                        r = rows_1[_i];
                        settingsObj[r.key] = r.value;
                    }
                    return [2 /*return*/, res.status(200).json({
                            title: settingsObj['seo_title'] || FALLBACK_SEO.title,
                            description: settingsObj['seo_description'] || FALLBACK_SEO.description,
                            keywords: settingsObj['seo_keywords'] || FALLBACK_SEO.keywords,
                            ogImage: settingsObj['og_image'] || FALLBACK_SEO.ogImage,
                            twitterCard: settingsObj['twitter_card'] || FALLBACK_SEO.twitterCard
                        })];
                case 23:
                    e_6 = _a.sent();
                    console.error('[API Fallback] /seo error:', e_6);
                    res.setHeader('x-database-status', 'fallback_error');
                    return [2 /*return*/, res.status(200).json(FALLBACK_SEO)];
                case 24:
                    if (!path.startsWith('/admin')) return [3 /*break*/, 30];
                    return [4 /*yield*/, verifyAdminJWT(req)];
                case 25:
                    isAuthorized = _a.sent();
                    if (!isAuthorized) {
                        return [2 /*return*/, res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token JWT không hợp lệ hoặc hết hạn.' })];
                    }
                    if (!(req.method === 'PUT' && path === '/admin/profile')) return [3 /*break*/, 29];
                    body = req.body;
                    _a.label = 26;
                case 26:
                    _a.trys.push([26, 28, , 29]);
                    return [4 /*yield*/, runQuery("UPDATE tbl_profile SET \n            name = $1, title_vn = $2, title_en = $3, bio_vn = $4, bio_en = $5, \n            email = $6, phone = $7, github_url = $8, facebook_url = $9, \n            zalo_url = $10, songphuong_url = $11, updated_at = NOW() \n           WHERE id = 1", [
                            body.name, body.titleVn, body.titleEn, body.bioVn, body.bioEn,
                            body.email, body.phone, body.githubUrl, body.facebookUrl,
                            body.zaloUrl, body.songphuongUrl
                        ])];
                case 27:
                    _a.sent();
                    return [2 /*return*/, res.status(200).json({ success: true, message: 'Cập nhật Profile thành công.' })];
                case 28:
                    e_7 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ error: 'DATABASE_ERROR', message: e_7.message })];
                case 29: return [2 /*return*/, res.status(404).json({ error: 'ADMIN_ENDPOINT_NOT_IMPLEMENTED', message: 'Endpoint admin cũ đã bị xóa trong quá trình cập nhật cấu trúc.' })];
                case 30: return [2 /*return*/, res.status(404).json({ error: 'ENDPOINT_NOT_FOUND', requestedPath: path })];
            }
        });
    });
}
