export type Language = 'en' | 'vn';

export const translations = {
    en: {
        nav: {
            about: "About",
            projects: "Projects",
            contact: "Contact",
            lang_en: "EN",
            lang_vn: "VN"
        },
        about: {
            role: "IT Student at Dalat University and Song Phương Technology, specializing in modern web development and solving real-world technical challenges.",
            title: "About Me",
            stats: {
                experience: "Years Experience",
                projects: "Projects Completed",
                clients: "Client Satisfaction"
            },
            slides: {
                experience: "Experience",
                skills: "Skills"
            }
        },
        experience: {
            title: "Experience",
            items: [
                {
                    role: "Education",
                    company: "Da Lat University",
                    period: "Aug 2025 - 2029",
                    description: "Graduate from Dalat University with a Bachelor of Engineering in Information Technology."
                },
                {
                    role: "Web Developer",
                    company: '<a href="https://songphuong.vn" target="_blank" class="text-clean-accent hover:text-deep-accent">Song Phương Technology</a>',
                    period: "Mar 2025 - Present",
                    description: "Specializing in full-stack web development, graphic design, iterative product updates, and SEO optimization for high-performance digital experiences."
                },
                {
                    role: "2D Graphic Designer",
                    company: "Freelance",
                    period: "",
                    description: "Conceptualized and executed creative 2D visual assets for digital and print media. Delivered branding materials, marketing collateral, and UI elements tailored to client requirements."
                }
            ]
        },
        projects: {
            title: "Projects",
            viewLive: "Live demo",
            viewSource: "Source",
            // Since projects are currently hardcoded in Projects.ts, we will just use generic titles here or move data later.
            // For now, I'll update Projects.ts to use these keys if possible, or usually Projects are dynamic data.
            // I will leave this section generic for now.
        },
        contact: {
            title: "Get In Touch",
            subtitle: "I'm here to help you with any questions or concerns you may have. Don't hesitate to reach out!",
            scan_text: "Scan with camera or Zalo app",
            step1_title: "Open Zalo App",
            step1_desc: "On your phone or computer",
            step2_title: "Select \"Scan QR Code\"",
            step2_desc: "Located at the top right of the screen",
            step3_title: "Point camera at QR Code",
            step3_desc: "And start chatting with me instantly",
            btn_download: "Download QR",
            btn_copy: "Copy Link",
            btn_copied: "Copied!"
        },
        products_showcase: {
            title: "Product Showcase",
            subtitle: "Featured products from Song Phương Technology",
            view_details: "View Details"
        },
        skills: {
            languages_title: "Languages",
            tech_stack_title: "Tech Stack",
            vietnamese: "Vietnamese",
            english: "English",
            native: "Native",
            independent: "Independent",
            fluent: "Fluent"
        },
        footer: {
            description: "A web developer based in Dalat. Passionate about sharing technology knowledge and helping people bring their website ideas to life.",
            navigation_title: "Navigation",
            contact_title: "Contact",
            nav: {
                about: "About",
                projects: "Projects",
                contact: "Contact"
            },
            contact_methods: {
                email: "Email",
                phone: "Phone",
                github: "GitHub",
                facebook: "Facebook"
            }
        }
    },
    vn: {
        nav: {
            about: "Giới thiệu",
            projects: "Dự án",
            contact: "Liên hệ",
            lang_en: "EN",
            lang_vn: "VN"
        },
        about: {
            role: "Sinh viên CNTT tại Đại học Đà Lạt và Công ty CN Song Phương, chuyên về phát triển web hiện đại và giải quyết các vấn đề kỹ thuật thực tế.",
            title: "Về tôi",
            stats: {
                experience: "Năm Kinh nghiệm",
                projects: "Dự án Hoàn thành",
                clients: "Khách hàng Hài lòng"
            },
            slides: {
                experience: "Kinh nghiệm",
                skills: "Kỹ năng"
            }
        },
        experience: {
            title: "Kinh nghiệm",
            items: [
                {
                    role: "Học vấn",
                    company: "Đại học Đà Lạt",
                    period: "Th8 2025 - 2029",
                    description: "Tốt nghiệp Đại học Đà Lạt với bằng Kỹ sư Công nghệ Thông tin."
                },
                {
                    role: "Lập trình Web",
                    company: '<a href="https://songphuong.vn" target="_blank" class="text-clean-accent hover:text-deep-accent">Công nghệ Song Phương</a>',
                    period: "Th3 2025 - Hiện tại",
                    description: "Chuyên về phát triển web full-stack, thiết kế đồ họa, cập nhật sản phẩm và tối ưu hóa SEO cho trải nghiệm kỹ thuật số hiệu suất cao."
                },
                {
                    role: "Thiết kế Đồ họa 2D",
                    company: "Tự do",
                    period: "",
                    description: "Lên ý tưởng và thực hiện các tài sản hình ảnh 2D sáng tạo cho truyền thông kỹ thuật số và in ấn. Cung cấp tài liệu thương hiệu, ấn phẩm tiếp thị và các yếu tố giao diện người dùng phù hợp với yêu cầu của khách hàng."
                }
            ]
        },
        projects: {
            title: "Dự án",
            viewLive: "Xem demo",
            viewSource: "Mã nguồn"
        },
        contact: {
            title: "Liên hệ",
            subtitle: "Tôi ở đây để giúp bạn với bất kỳ câu hỏi hoặc thắc mắc nào. Đừng ngần ngại liên hệ!",
            scan_text: "Quét bằng camera hoặc ứng dụng Zalo",
            step1_title: "Mở ứng dụng Zalo",
            step1_desc: "Trên điện thoại hoặc máy tính của bạn",
            step2_title: "Chọn \"Quét mã QR\"",
            step2_desc: "Nằm ở góc trên bên phải màn hình",
            step3_title: "Hướng camera vào mã QR",
            step3_desc: "Và bắt đầu trò chuyện ngay lập tức",
            btn_download: "Tải QR",
            btn_copy: "Sao chép Link",
            btn_copied: "Đã sao chép!"
        },
        products_showcase: {
            title: "Sản Phẩm Nổi Bật",
            subtitle: "Các sản phẩm nổi bật từ Công nghệ Song Phương",
            view_details: "Xem Chi Tiết"
        },
        skills: {
            languages_title: "Ngôn ngữ",
            tech_stack_title: "Công nghệ",
            vietnamese: "Tiếng Việt",
            english: "Tiếng Anh",
            native: "Bản địa",
            independent: "Trung cấp",
            fluent: "Thành thạo"
        },
        footer: {
            description: "Một lập trình viên web tại Đà Lạt. Đam mê chia sẻ kiến thức công nghệ và giúp mọi người hiện thực hóa ý tưởng website của họ.",
            navigation_title: "Điều hướng",
            contact_title: "Liên hệ",
            nav: {
                about: "Giới thiệu",
                projects: "Dự án",
                contact: "Liên hệ"
            },
            contact_methods: {
                email: "Email",
                phone: "Điện thoại",
                github: "GitHub",
                facebook: "Facebook"
            }
        }
    }
};
