import React, { useEffect, useMemo, useState } from 'react';
import { SEOHead } from '../components/shared/SEOHead';
import { AlbumWithPhotos, Photo, fetchAlbumsWithPhotos } from '../services/galleryService';

function getPhotoUrl(photo: Photo): string {
  return photo.image_url || '';
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
  const [albums, setAlbums] = useState<AlbumWithPhotos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAlbums() {
      try {
        const hydratedAlbums = await fetchAlbumsWithPhotos();
        if (!active) return;
        setAlbums(hydratedAlbums);
        setLoadError(null);
      } catch (error) {
        console.error('Không thể tải album từ API.', error);
        if (active) setLoadError('Không thể tải dữ liệu album từ database.');
      } finally {
        if (active) setIsLoading(false);
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
          {isLoading && (
            <p className="text-sm text-zinc-400">Đang tải dữ liệu album...</p>
          )}
          {!isLoading && loadError && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {loadError}
            </p>
          )}
          {!isLoading && !loadError && albums.length === 0 && (
            <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
              Chưa có album nào được bật hiển thị trong admin.
            </p>
          )}
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
