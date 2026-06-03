import React, { useEffect, useMemo, useState } from 'react';
import { SEOHead } from '../components/shared/SEOHead';

interface Album {
  id: string;
  name: string;
  description?: string | null;
}

interface Photo {
  id: string | number;
  album_id: string;
  title: string;
  caption?: string | null;
  image_url?: string;
  url?: string;
  alt_text: string;
}

interface AlbumWithPhotos extends Album {
  photos: Photo[];
}

const STATIC_ALBUMS: AlbumWithPhotos[] = [
  {
    id: 'pc-gaming',
    name: 'PC Gaming Song Phương',
    description: 'Album trưng bày các cấu hình máy tính gaming, linh kiện hiệu năng cao và không gian lắp đặt PC tại Song Phương Technology.',
    photos: [
      {
        id: 'pc-gaming-1',
        album_id: 'pc-gaming',
        title: 'Cấu hình PC Gaming MSI cao cấp chuẩn Song Phương',
        caption: 'Bộ máy tính gaming sử dụng linh kiện hiệu năng cao, tối ưu cho game thủ, streamer và người dùng cần hiệu suất ổn định.',
        alt_text: 'Cấu hình PC Gaming MSI cao cấp do Song Phương Technology lắp đặt',
        image_url: 'https://songphuong.vn/Content/uploads/2023/05/SP-PC-INTEL-i5-12400F-1-2.webp',
      },
      {
        id: 'pc-gaming-2',
        album_id: 'pc-gaming',
        title: 'PC Gaming Intel Core i5 kèm card đồ họa RTX',
        caption: 'Ảnh sản phẩm PC gaming phục vụ tư vấn cấu hình, nâng cấp linh kiện và tối ưu trải nghiệm chơi game tại Đà Lạt.',
        alt_text: 'PC Gaming Intel Core i5 với card đồ họa RTX tại Song Phương Technology',
        image_url: 'https://songphuong.vn/Content/uploads/2025/11/SP-PC-INTEL-i5-14400F-RTX-5060-1.jpg',
      },
    ],
  },
  {
    id: 'graphic-design',
    name: 'Thiết kế đồ họa UI/UX',
    description: 'Album ghi lại các tư liệu thiết kế giao diện, nhận diện thương hiệu và quy trình xử lý hình ảnh số.',
    photos: [
      {
        id: 'design-1',
        album_id: 'graphic-design',
        title: 'Không gian thiết kế giao diện và nhận diện thương hiệu',
        caption: 'Hình ảnh minh họa quy trình thiết kế UI/UX, chỉnh sửa tài sản thương hiệu và tối ưu giao diện cho sản phẩm số.',
        alt_text: 'Không gian làm việc thiết kế UI UX và nhận diện thương hiệu Song Phương Technology',
        image_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
      },
      {
        id: 'design-2',
        album_id: 'graphic-design',
        title: 'Bố cục hình ảnh phục vụ truyền thông số',
        caption: 'Tư liệu hình ảnh dùng cho thiết kế banner, album trưng bày sản phẩm và nội dung SEO hình ảnh Google Images.',
        alt_text: 'Bố cục thiết kế hình ảnh phục vụ truyền thông số và SEO Google Images',
        image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
      },
    ],
  },
  {
    id: 'technology-workspace',
    name: 'Không gian công nghệ',
    description: 'Album hình ảnh về thiết bị, lập trình, môi trường làm việc và hệ thống công nghệ phục vụ dự án web.',
    photos: [
      {
        id: 'tech-1',
        album_id: 'technology-workspace',
        title: 'Màn hình code trong dự án React TypeScript',
        caption: 'Hình ảnh lập trình giao diện web, tối ưu component, Zustand store và routing cho portfolio Song Phương Technology.',
        alt_text: 'Màn hình code React TypeScript trong dự án portfolio Song Phương Technology',
        image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
      },
      {
        id: 'tech-2',
        album_id: 'technology-workspace',
        title: 'Không gian làm việc công nghệ hiện đại',
        caption: 'Setup làm việc với máy tính, màn hình và thiết bị hỗ trợ phát triển website, thiết kế giao diện và quản trị dữ liệu.',
        alt_text: 'Không gian làm việc công nghệ hiện đại cho lập trình web và thiết kế giao diện',
        image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
      },
    ],
  },
];

function getPhotoUrl(photo: Photo): string {
  return photo.url || photo.image_url || '';
}

const PhotoFigure: React.FC<{ photo: Photo }> = ({ photo }) => (
  <figure className="border border-white/5 p-4 rounded-xl bg-zinc-900/30">
    <img
      src={getPhotoUrl(photo)}
      alt={photo.alt_text}
      className="w-full h-auto rounded-lg"
      loading="lazy"
    />
    <figcaption className="mt-2 space-y-1">
      <h3 className="text-sm font-bold text-white">{photo.title}</h3>
      <p className="text-xs text-zinc-400">{photo.caption}</p>
      <p className="text-[11px] leading-5 text-zinc-500">Alt text: {photo.alt_text}</p>
    </figcaption>
  </figure>
);

const AlbumPage: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumWithPhotos[]>(STATIC_ALBUMS);

  useEffect(() => {
    let active = true;

    async function loadAlbums() {
      try {
        const albumsResponse = await fetch('/api/albums');
        if (!albumsResponse.ok) throw new Error(`Failed to fetch albums: ${albumsResponse.status}`);
        const albumRows: Album[] = await albumsResponse.json();
        if (!Array.isArray(albumRows) || albumRows.length === 0) return;

        const hydratedAlbums = await Promise.all(
          albumRows.map(async (album) => {
            const photosResponse = await fetch(`/api/albums/${encodeURIComponent(album.id)}/photos`);
            if (!photosResponse.ok) {
              return { ...album, photos: [] };
            }
            const photos: Photo[] = await photosResponse.json();
            return {
              ...album,
              photos: Array.isArray(photos) ? photos : [],
            };
          }),
        );

        if (active && hydratedAlbums.some((album) => album.photos.length > 0)) {
          setAlbums(hydratedAlbums);
        }
      } catch (error) {
        console.warn('Không thể tải album từ API, đang dùng dữ liệu album tĩnh.', error);
      }
    }

    void loadAlbums();

    return () => {
      active = false;
    };
  }, []);

  const photoCount = useMemo(
    () => albums.reduce((total, album) => total + album.photos.length, 0),
    [albums],
  );

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100 sm:px-8 lg:px-10">
      <SEOHead 
        title="Thư viện Hình ảnh & Khung Trưng Bày Dự Án — Song Phương Technology" 
        description="Tổng hợp album hình ảnh thực tế các dự án công nghệ, giải pháp phần cứng máy tính và kỹ thuật phòng game chất lượng cao tại Lâm Đồng."
      />
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">Album SEO Google Images</p>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Thư viện Hình ảnh & Album Trưng Bày — Song Phương Technology
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300">
            Bộ sưu tập {photoCount} hình ảnh được trình bày bằng cấu trúc HTML5 semantic, hiển thị trực tiếp tiêu đề, chú thích và alt text để hỗ trợ Google Images thu thập dữ liệu.
          </p>
        </header>

        <div className="mt-10 space-y-14">
          {albums.map((album) => (
            <section key={album.id} aria-labelledby={`album-${album.id}`}>
              <div className="mb-5 max-w-3xl">
                <h2 id={`album-${album.id}`} className="text-2xl font-semibold text-white">
                  {album.name}
                </h2>
                {album.description && (
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{album.description}</p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {album.photos.map((photo) => (
                  <PhotoFigure key={photo.id} photo={photo} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AlbumPage;
