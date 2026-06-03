export interface Album {
  id: string;
  name: string;
  description?: string | null;
  order_index?: number;
  visible?: boolean;
}

export interface Photo {
  id: string | number;
  album_id: string;
  title: string;
  caption?: string | null;
  image_url: string;
  alt_text: string;
  created_at?: string;
}

export interface AlbumWithPhotos extends Album {
  photos: Photo[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchAlbumsWithPhotos(): Promise<AlbumWithPhotos[]> {
  const albums = await fetchJson<Album[]>('/api/albums');
  if (!Array.isArray(albums) || albums.length === 0) return [];

  return Promise.all(
    albums.map(async (album) => {
      const photos = await fetchJson<Photo[]>(`/api/albums/${encodeURIComponent(album.id)}/photos`);
      return {
        ...album,
        photos: Array.isArray(photos) ? photos : [],
      };
    }),
  );
}
