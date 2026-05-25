import { neon } from '@neondatabase/serverless';

// Đọc chuỗi kết nối từ biến môi trường
const url = process.env.DATABASE_URL;

if (!url) {
  console.error('LỖI: DATABASE_URL không được định nghĩa.');
  console.error('Vui lòng tạo file .env trong thư mục gốc dự án và điền DATABASE_URL vào.');
  process.exit(1);
}

const sql = neon(url);

async function main() {
  console.log('1. KIỂM TRA KẾT NỐI DATABASE...');
  try {
    const timeRes = await sql`SELECT NOW() AS current_time`;
    console.log('✅ Kết nối Neon SQL thành công! Thời gian hiện tại của database:', timeRes[0].current_time);
  } catch (err) {
    console.error('❌ Kết nối database thất bại:', err.message);
    process.exit(1);
  }

  console.log('\n2. KHỞI TẠO CẤU TRÚC BẢNG (SCHEMA)...');

  // a. tbl_profile
  console.log('- Đang tạo bảng tbl_profile...');
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_profile (
      id             INT PRIMARY KEY DEFAULT 1,
      name           VARCHAR(100)  NOT NULL DEFAULT 'Hoàng Minh Dương',
      title_en       VARCHAR(200)  DEFAULT 'Web Developer · IT Student',
      title_vn       VARCHAR(200)  DEFAULT 'Nhà phát triển Web · Sinh viên IT',
      bio_en         TEXT          DEFAULT '',
      bio_vn         TEXT          DEFAULT '',
      avatar_url     TEXT          DEFAULT '/img/my-avatar.jpg',
      email          VARCHAR(200)  DEFAULT '',
      phone          VARCHAR(50)   DEFAULT '',
      github_url     TEXT          DEFAULT '',
      facebook_url   TEXT          DEFAULT '',
      zalo_url       TEXT          DEFAULT '',
      songphuong_url TEXT          DEFAULT 'https://songphuong.vn',
      updated_at     TIMESTAMPTZ   DEFAULT NOW(),
      CONSTRAINT tbl_profile_singleton CHECK (id = 1)
    )
  `;

  // b. tbl_products
  console.log('- Đang tạo bảng tbl_products...');
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_products (
      id          SERIAL      PRIMARY KEY,
      name        VARCHAR(300) NOT NULL,
      category    VARCHAR(50)  NOT NULL,
      tag         VARCHAR(50),
      price       VARCHAR(50),
      old_price   VARCHAR(50),
      discount    INT,
      image_url   TEXT,
      link        TEXT,
      color       VARCHAR(20)  DEFAULT '#3B82F6',
      glyph       VARCHAR(20)  DEFAULT '📦',
      status      VARCHAR(10)  CHECK (status IS NULL OR status IN ('New','Hot','Sale')),
      override_name      VARCHAR(300),
      override_price     VARCHAR(50),
      override_image_url TEXT,
      override_status    VARCHAR(10) CHECK (override_status IS NULL OR override_status IN ('New','Hot','Sale')),
      override_tag       VARCHAR(50),
      visible     BOOLEAN     DEFAULT true,
      order_index INT         DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // View cho tbl_products
  console.log('- Đang tạo view products_resolved...');
  await sql`
    CREATE OR REPLACE VIEW products_resolved AS
    SELECT
      id,
      COALESCE(override_name,      name)      AS name,
      category,
      COALESCE(override_tag,       tag)       AS tag,
      COALESCE(override_price,     price)     AS price,
      old_price,
      discount,
      COALESCE(override_image_url, image_url) AS image_url,
      link,
      color,
      glyph,
      COALESCE(override_status,    status)    AS status,
      visible,
      order_index,
      (override_name IS NOT NULL OR override_price IS NOT NULL
       OR override_image_url IS NOT NULL OR override_status IS NOT NULL
       OR override_tag IS NOT NULL) AS has_override,
      override_name,
      override_price,
      override_image_url,
      override_status,
      override_tag,
      created_at,
      updated_at
    FROM tbl_products
  `;

  // c. tbl_projects
  console.log('- Đang tạo bảng tbl_projects...');
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_projects (
      id          TEXT     PRIMARY KEY,
      name        TEXT     NOT NULL,
      category    TEXT     NOT NULL,
      color       TEXT     NOT NULL DEFAULT '#2563EB',
      tags        TEXT[]   NOT NULL DEFAULT '{}',
      desc_vn     TEXT     NOT NULL DEFAULT '',
      desc_en     TEXT     NOT NULL DEFAULT '',
      demo_url    TEXT,
      github_url  TEXT,
      order_index INTEGER  DEFAULT 0,
      visible     BOOLEAN  DEFAULT TRUE
    )
  `;

  // d. tbl_timeline
  console.log('- Đang tạo bảng tbl_timeline...');
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_timeline (
      id          SERIAL      PRIMARY KEY,
      role_vn     TEXT        NOT NULL DEFAULT '',
      role_en     TEXT        NOT NULL DEFAULT '',
      company     TEXT        NOT NULL DEFAULT '',
      company_url TEXT,
      period_vn   TEXT        NOT NULL DEFAULT '',
      period_en   TEXT        NOT NULL DEFAULT '',
      desc_vn     TEXT        NOT NULL DEFAULT '[]',
      desc_en     TEXT        NOT NULL DEFAULT '[]',
      type        TEXT        NOT NULL DEFAULT 'work',
      order_index INTEGER     DEFAULT 0,
      visible     BOOLEAN     DEFAULT TRUE
    )
  `;

  // e. social_links
  console.log('- Đang tạo bảng social_links...');
  await sql`
    CREATE TABLE IF NOT EXISTS social_links (
      id          SERIAL       PRIMARY KEY,
      platform    VARCHAR(50)  UNIQUE NOT NULL,
      label       VARCHAR(100) NOT NULL,
      url         TEXT         NOT NULL DEFAULT '',
      visible     BOOLEAN      DEFAULT true,
      order_index INT          DEFAULT 0,
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `;

  // f. admin_users
  console.log('- Đang tạo bảng admin_users...');
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            SERIAL      PRIMARY KEY,
      username      VARCHAR(50) UNIQUE NOT NULL,
      password_hash TEXT        NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // g. trigger set_updated_at cho tbl_products và social_links
  console.log('- Đang tạo trigger...');
  await sql`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER LANGUAGE plpgsql AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$
  `;

  await sql`DROP TRIGGER IF EXISTS trg_products_updated_at ON tbl_products`;
  await sql`
    CREATE TRIGGER trg_products_updated_at
      BEFORE UPDATE ON tbl_products
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
  `;

  await sql`DROP TRIGGER IF EXISTS trg_social_links_updated_at ON social_links`;
  await sql`
    CREATE TRIGGER trg_social_links_updated_at
      BEFORE UPDATE ON social_links
      FOR EACH ROW EXECUTE FUNCTION set_updated_at()
  `;

  console.log('✅ Khởi tạo cấu trúc bảng hoàn tất!');

  console.log('\n3. NẠP VÀ CẬP NHẬT DỮ LIỆU THỰC TẾ (SEED)...');

  // a. Profile
  console.log('- Đang nạp/cập nhật thông tin profile của Hoàng Minh Dương...');
  await sql`
    INSERT INTO tbl_profile (id, name, title_en, title_vn, bio_en, bio_vn, avatar_url, email, github_url, facebook_url, songphuong_url)
    VALUES (
      1,
      'Hoàng Minh Dương',
      'Web Developer · IT Student at Dalat University',
      'Nhà phát triển Web · Sinh viên CNTT Đại học Đà Lạt',
      'IT Student at Da Lat University & Web Developer at Song Phương Technology. Passionate about creative UI design and optimizing user experience.',
      'Sinh viên IT tại Đại học Đà Lạt & Web Developer tại Song Phương Technology. Đam mê thiết kế giao diện sáng tạo và tối ưu hóa trải nghiệm người dùng.',
      '/img/my-avatar.jpg',
      'duonghm.work@gmail.com',
      'https://github.com/hmduongdl',
      'https://facebook.com/',
      'https://songphuong.vn'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      title_en = EXCLUDED.title_en,
      title_vn = EXCLUDED.title_vn,
      bio_en = EXCLUDED.bio_en,
      bio_vn = EXCLUDED.bio_vn,
      avatar_url = EXCLUDED.avatar_url,
      email = EXCLUDED.email,
      github_url = EXCLUDED.github_url,
      facebook_url = EXCLUDED.facebook_url,
      songphuong_url = EXCLUDED.songphuong_url,
      updated_at = NOW()
  `;

  // b. Social Links
  console.log('- Đang nạp/cập nhật social links...');
  const socialData = [
    { platform: 'github', label: 'GitHub', url: 'https://github.com/hmduongdl', order: 0 },
    { platform: 'facebook', label: 'Facebook', url: 'https://facebook.com/', order: 1 },
    { platform: 'gmail', label: 'Gmail', url: 'mailto:duonghm.work@gmail.com', order: 2 },
    { platform: 'phone', label: 'Phone', url: 'tel:+84', order: 3 },
    { platform: 'zalo', label: 'Zalo', url: 'https://zalo.me/', order: 4 },
  ];
  for (const s of socialData) {
    await sql`
      INSERT INTO social_links (platform, label, url, visible, order_index)
      VALUES (${s.platform}, ${s.label}, ${s.url}, true, ${s.order})
      ON CONFLICT (platform) DO UPDATE SET
        label = EXCLUDED.label,
        url = EXCLUDED.url,
        order_index = EXCLUDED.order_index,
        updated_at = NOW()
    `;
  }

  // c. Products (Song Phương Technology)
  console.log('- Đang nạp/cập nhật danh sách sản phẩm Song Phương...');
  const productsData = [
    {
      name: 'SP PC INTEL Core i5-12400F',
      category: 'PC Gaming',
      price: 'Liên hệ',
      image_url: '/img/products/SP-PC-G01.jpg',
      link: 'https://songphuong.vn',
      glyph: '🖥',
      color: '#3B82F6',
      status: 'Hot',
      order: 0
    },
    {
      name: 'SP PC INTEL i5-14400F RTX 5060',
      category: 'PC Gaming',
      price: 'Liên hệ',
      image_url: '/img/products/SP-PC-G01.jpg',
      link: 'https://songphuong.vn',
      glyph: '🖥',
      color: '#2563EB',
      status: 'New',
      order: 1
    },
    {
      name: 'SP PC AMD Ryzen 3 3200G',
      category: 'Office PC',
      price: 'Liên hệ',
      image_url: '/img/products/SP-PC-O02.jpg',
      link: 'https://songphuong.vn',
      glyph: '🖥',
      color: '#6B7280',
      status: null,
      order: 2
    },
    {
      name: 'Acer Aspire Lite 14',
      category: 'Laptop',
      price: 'Liên hệ',
      image_url: '/img/products/LAP-AC01.webp',
      link: 'https://songphuong.vn',
      glyph: '💻',
      color: '#8B5CF6',
      status: 'Sale',
      order: 3
    },
    {
      name: 'Colorful iGame RTX 5060 Ti Ultra W',
      category: 'VGA',
      price: 'Liên hệ',
      image_url: '/img/products/RTX 4060 Ti.jpg',
      link: 'https://songphuong.vn',
      glyph: '🎮',
      color: '#10B981',
      status: null,
      order: 4
    },
    {
      name: 'Machenike L8 Pro',
      category: 'Gaming Gear',
      price: 'Liên hệ',
      image_url: '/img/products/GEAR-M01.jpg',
      link: 'https://songphuong.vn',
      glyph: '🖱',
      color: '#F59E0B',
      status: null,
      order: 5
    },
    {
      name: 'Machenike G3 V2 Gamepad',
      category: 'Gaming Gear',
      price: 'Liên hệ',
      image_url: '/img/products/GEAR-C01.jpg',
      link: 'https://songphuong.vn',
      glyph: '🕹',
      color: '#D97706',
      status: null,
      order: 6
    },
    {
      name: 'Xiberia CZ98 Black Gradient',
      category: 'Keyboard',
      price: 'Liên hệ',
      image_url: 'https://songphuong.vn',
      link: 'https://songphuong.vn',
      glyph: '⌨',
      color: '#EC4899',
      status: null,
      order: 7
    },
    {
      name: 'Thonet & Vander KUMPEL 2.0',
      category: 'Audio',
      price: 'Liên hệ',
      image_url: 'https://songphuong.vn',
      link: 'https://songphuong.vn',
      glyph: '🔊',
      color: '#06B6D4',
      status: null,
      order: 8
    }
  ];

  // Xóa bớt sản phẩm cũ trong tbl_products để tránh bị trùng lặp order_index
  await sql`DELETE FROM tbl_products`;

  for (const p of productsData) {
    await sql`
      INSERT INTO tbl_products (name, category, price, image_url, link, glyph, color, status, visible, order_index)
      VALUES (${p.name}, ${p.category}, ${p.price}, ${p.image_url}, ${p.link}, ${p.glyph}, ${p.color}, ${p.status}, true, ${p.order})
    `;
  }

  // d. Projects (Dự án cá nhân)
  console.log('- Đang nạp/cập nhật danh sách dự án cá nhân...');
  const projectsData = [
    {
      id: 'portfolio-macos',
      name: 'Song Phương macOS Portfolio',
      category: 'web',
      color: '#2563EB',
      tags: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
      desc_vn: 'Portfolio tương tác phong cách macOS, tích hợp hệ thống cửa sổ kéo-thả, Dock và thanh menu. Cá nhân xây dựng toàn bộ UI/UX & logic state cho Song Phương Technology.',
      desc_en: 'Interactive macOS-style portfolio with draggable windows, Dock, and menu bar. Personally designed the full UI/UX & state architecture for Song Phương Technology.',
      demo_url: 'https://songphuong.vn',
      github_url: 'https://github.com/hmduongdl',
      order: 1
    },
    {
      id: 'ecommerce-integration',
      name: 'E-Commerce System Integration',
      category: 'web',
      color: '#10B981',
      tags: ['Node.js', 'Express', 'SQL Server', 'RESTful API'],
      desc_vn: 'Hệ thống tích hợp thương mại điện tử với RESTful API, quản lý sản phẩm & đơn hàng, backend SQL Server. Cá nhân thiết kế kiến trúc API và tối ưu hóa query cho Song Phương Technology.',
      desc_en: 'Full-stack e-commerce integration with RESTful API, product & order management, and SQL Server backend. Personally designed API architecture and optimized queries for Song Phương Technology.',
      demo_url: null,
      github_url: 'https://github.com/hmduongdl',
      order: 2
    },
    {
      id: 'brand-identity',
      name: 'Song Phương Brand Identity & Visual Assets',
      category: 'design',
      color: '#F59E0B',
      tags: ['Photoshop', 'Illustrator', 'Figma', '2D Design'],
      desc_vn: 'Bộ nhận diện thương hiệu đầy đủ: thiết kế logo, hệ màu, typography và tài sản kỹ thuật số/in ấn. Cá nhân thực hiện toàn bộ từ concept đến xuất file sản xuất cho Song Phương Technology.',
      desc_en: 'Comprehensive brand identity package: logo, color system, typography, and digital/print assets. Personally handled the full workflow from concept to production-ready files for Song Phương Technology.',
      demo_url: null,
      github_url: null,
      order: 3
    },
    {
      id: 'auto-backup-tool',
      name: 'Auto Backup Tool & Database Syncer',
      category: 'tools',
      color: '#EF4444',
      tags: ['Python', 'CronJob', 'SQL Shell'],
      desc_vn: 'Công cụ sao lưu tự động và đồng bộ cơ sở dữ liệu, chạy theo lịch với CronJob. Cá nhân viết script và thiết lập pipeline đồng bộ dev–production.',
      desc_en: 'Automated database backup and sync tool with scheduled CronJob execution and SQL Shell scripting. Personally wrote the scripts and set up the dev–production sync pipeline.',
      demo_url: null,
      github_url: 'https://github.com/hmduongdl',
      order: 4
    }
  ];

  for (const p of projectsData) {
    await sql`
      INSERT INTO tbl_projects (id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index)
      VALUES (${p.id}, ${p.name}, ${p.category}, ${p.color}, ${p.tags}, ${p.desc_vn}, ${p.desc_en}, ${p.demo_url}, ${p.github_url}, ${p.order})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        color = EXCLUDED.color,
        tags = EXCLUDED.tags,
        desc_vn = EXCLUDED.desc_vn,
        desc_en = EXCLUDED.desc_en,
        demo_url = EXCLUDED.demo_url,
        github_url = EXCLUDED.github_url,
        order_index = EXCLUDED.order_index
    `;
  }

  // e. Timeline (Lịch sử làm việc/học tập)
  console.log('- Đang nạp/cập nhật timeline...');
  const timelineData = [
    {
      role_vn: 'Web Developer',
      role_en: 'Web Developer',
      company: 'Song Phương Technology',
      company_url: 'https://songphuong.vn',
      period_vn: 'Tháng 3, 2025 - Hiện tại',
      period_en: 'Mar 2025 - Present',
      desc_vn: JSON.stringify([
        'Thiết kế và phát triển giao diện người dùng sáng tạo cho các trang web và ứng dụng của công ty.',
        'Quản lý hệ thống cơ sở dữ liệu và tích hợp các API dịch vụ.',
        'Tối ưu hóa hiệu suất ứng dụng và trải nghiệm người dùng.'
      ]),
      desc_en: JSON.stringify([
        'Designed and developed creative user interfaces for company websites and web applications.',
        'Managed database systems and integrated service APIs.',
        'Optimized application performance and overall user experience.'
      ]),
      type: 'work',
      order: 1
    },
    {
      role_vn: 'Sinh viên CNTT',
      role_en: 'IT Student',
      company: 'Trường Đại học Đà Lạt',
      company_url: 'https://dlu.edu.vn',
      period_vn: 'Tháng 8, 2025 - 2029',
      period_en: 'Aug 2025 - 2029',
      desc_vn: JSON.stringify([
        'Theo học ngành Công nghệ Thông tin.',
        'Nghiên cứu các thuật toán cơ bản, cấu trúc dữ liệu và phát triển phần mềm.'
      ]),
      desc_en: JSON.stringify([
        'Majoring in Information Technology.',
        'Studying fundamental algorithms, data structures, and software engineering.'
      ]),
      type: 'education',
      order: 2
    },
    {
      role_vn: 'Nhà thiết kế đồ họa 2D',
      role_en: '2D Graphic Designer',
      company: 'Freelance',
      company_url: null,
      period_vn: 'Trước đây',
      period_en: 'Freelance',
      desc_vn: JSON.stringify([
        'Thiết kế logo, nhận diện thương hiệu và ấn phẩm truyền thông cho khách hàng.',
        'Làm việc với Photoshop, Illustrator và Figma.'
      ]),
      desc_en: JSON.stringify([
        'Designed logos, brand identities, and social media banners for various clients.',
        'Worked extensively with Photoshop, Illustrator, and Figma.'
      ]),
      type: 'freelance',
      order: 3
    }
  ];

  await sql`DELETE FROM tbl_timeline`;

  for (const t of timelineData) {
    await sql`
      INSERT INTO tbl_timeline (role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index)
      VALUES (${t.role_vn}, ${t.role_en}, ${t.company}, ${t.company_url}, ${t.period_vn}, ${t.period_en}, ${t.desc_vn}, ${t.desc_en}, ${t.type}, ${t.order})
    `;
  }

  console.log('✅ Nạp dữ liệu (seed) hoàn tất!');

  console.log('\n4. XÁC MINH DỮ LIỆU ĐỊNH DẠNG DTO CHO API...');
  
  // Test SELECT profile (VN)
  const profileRow = (await sql`SELECT * FROM tbl_profile WHERE id = 1`)[0];
  const profileDTO = {
    name: profileRow.name,
    title: profileRow.title_vn,
    bio: profileRow.bio_vn,
    email: profileRow.email,
    github: profileRow.github_url,
    facebook: profileRow.facebook_url,
    songphuong_url: profileRow.songphuong_url,
    avatar: profileRow.avatar_url,
    phone: profileRow.phone,
    zalo: profileRow.zalo_url
  };
  console.log('🔍 DTO Profile (VN) test:', profileDTO);

  // Test SELECT products
  const productsRows = await sql`
    SELECT id, COALESCE(override_name, name) AS name, category, COALESCE(override_image_url, image_url) AS image_url FROM tbl_products ORDER BY order_index ASC
  `;
  console.log(`🔍 DTO Products test: Đã lấy ${productsRows.length} sản phẩm. Ví dụ sản phẩm đầu tiên:`, productsRows[0]);

  // Test SELECT projects (VN)
  const projectRow = (await sql`SELECT * FROM tbl_projects ORDER BY order_index ASC LIMIT 1`)[0];
  const projectDTO = {
    id: projectRow.id,
    name: projectRow.name,
    category: projectRow.category,
    color: projectRow.color,
    tags: projectRow.tags,
    description: projectRow.desc_vn,
    demo_url: projectRow.demo_url,
    github_url: projectRow.github_url
  };
  console.log('🔍 DTO Projects (VN) test:', projectDTO);

  console.log('\n✨ ĐỒNG BỘ HOÀN TẤT & ĐÃ XÁC MINH! Mọi thứ đã sẵn sàng cho Frontend API!');
}

main().catch((err) => {
  console.error('❌ Có lỗi xảy ra trong quá trình thực thi:', err);
  process.exit(1);
});
