import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/shared/SEOHead';

const AboutPage: React.FC = () => {
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": "Hoàng Minh Dương",
        "alternateName": ["Dương Song Phương", "Long Song Phương"],
        "jobTitle": "Web Developer",
        "worksFor": {
          "@type": "Organization",
          "name": "Song Phương Technology",
          "url": "https://songphuong.vn"
        }
      }
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-about-person';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);
    return () => {
      document.getElementById('schema-about-person')?.remove();
    };
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SEOHead 
        title="Hoàng Minh Dương (Dương Song Phương) — Lập trình viên Web tại Đà Lạt" 
        description="Tìm hiểu về Hoàng Minh Dương (Dương Song Phương) — lập trình viên fullstack chuyên nghiệp tại Đà Lạt, thành viên uy tín của Song Phương Technology."
      />
      <div className="fixed left-4 top-4 z-10 sm:left-6 sm:top-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-full border border-white/10 bg-zinc-900/90 px-4 py-2 text-sm font-medium text-cyan-200 shadow-lg shadow-black/20 transition-colors hover:border-cyan-300/40 hover:text-cyan-100"
        >
          🔙 Quay lại màn hình Desktop OS
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="pt-16 sm:pt-20">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Giới thiệu cá nhân</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Hoàng Minh Dương (Dương Song Phương) — Lập trình viên Web tại Đà Lạt
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Tôi tập trung xây dựng giao diện web hiện đại, hệ thống quản trị nội dung và trải nghiệm số có cấu trúc rõ ràng cho Song Phương Technology.
          </p>
        </header>

        <div className="mt-12 space-y-12">
          <section aria-labelledby="about-self">
            <h2 id="about-self" className="text-2xl font-semibold text-white">
              Về bản thân tôi
            </h2>
            <div className="mt-4 space-y-4 text-base leading-8 text-zinc-300">
              <p>
                Hoàng Minh Dương, còn được biết đến với tên Dương Song Phương, là lập trình viên web đang làm việc tại Đà Lạt. Tôi quan tâm đến cách một sản phẩm số được thiết kế, vận hành và tối ưu để người dùng có thể sử dụng dễ dàng trong công việc hằng ngày.
              </p>
              <p>
                Trọng tâm công việc của tôi là phát triển giao diện React, xây dựng hệ thống quản trị dữ liệu, tối ưu hiệu năng frontend và kết nối API cho các dự án nội bộ của Song Phương Technology.
              </p>
            </div>
          </section>

          <section aria-labelledby="about-tech-stack">
            <h2 id="about-tech-stack" className="text-2xl font-semibold text-white">
              Kỹ năng lập trình chuyên môn (Tech Stack)
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Frontend', 'React, TypeScript, Tailwind CSS, Zustand, responsive UI và component architecture.'],
                ['Backend & API', 'Node.js, RESTful API, PostgreSQL, Neon SQL và tích hợp dữ liệu cho dashboard quản trị.'],
                ['Thiết kế giao diện', 'UI/UX, Figma, Photoshop, Illustrator và hệ thống nhận diện thương hiệu số.'],
                ['Tối ưu vận hành', 'SEO on-page, cấu trúc semantic HTML, quản lý bundle và quy trình triển khai web.'],
              ].map(([title, desc]) => (
                <section key={title} className="border border-white/10 bg-zinc-900/40 p-5">
                  <h3 className="text-lg font-semibold text-cyan-200">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{desc}</p>
                </section>
              ))}
            </div>
          </section>

          <section aria-labelledby="about-experience">
            <h2 id="about-experience" className="text-2xl font-semibold text-white">
              Lịch sử kinh nghiệm tại Song Phương Technology & Học vấn
            </h2>
            <div className="mt-5 space-y-5">
              <section className="border-l border-cyan-300/40 pl-5">
                <h3 className="text-lg font-semibold text-white">Song Phương Technology</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Tham gia thiết kế và phát triển các hệ thống web phục vụ giới thiệu dịch vụ, quản lý sản phẩm, danh mục dự án, hồ sơ cá nhân và nội dung SEO. Công việc bao gồm xây dựng giao diện, kết nối API, quản lý state và chuẩn hóa trải nghiệm người dùng.
                </p>
              </section>
              <section className="border-l border-cyan-300/40 pl-5">
                <h3 className="text-lg font-semibold text-white">Học vấn và tự học chuyên môn</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Liên tục tự học lập trình web, thiết kế giao diện, quản trị cơ sở dữ liệu và tối ưu hóa công cụ tìm kiếm để phục vụ các dự án thực tế tại Đà Lạt và hệ sinh thái Song Phương Technology.
                </p>
              </section>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
};

export default AboutPage;
