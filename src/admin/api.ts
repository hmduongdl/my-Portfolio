const BASE = '/api';
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  data: unknown;
  expiresAt: number;
};

const getCache = new Map<string, CacheEntry>();
const pendingGets = new Map<string, Promise<unknown>>();

function cloneData<T>(data: T): T {
  if (data === undefined || data === null) return data;
  if (typeof structuredClone === 'function') return structuredClone(data);
  return JSON.parse(JSON.stringify(data)) as T;
}

function cacheKey(path: string): string {
  return path;
}

function invalidatePath(path: string): void {
  const related = new Set<string>([path]);

  if (path === '/admin/profile') related.add('/profile');
  if (path === '/admin/timeline' || path === '/admin/tech-stack') related.add('/profile');

  for (const key of getCache.keys()) {
    for (const prefix of related) {
      if (key === prefix || key.startsWith(`${prefix}?`)) {
        getCache.delete(key);
        break;
      }
    }
  }

  for (const key of pendingGets.keys()) {
    for (const prefix of related) {
      if (key === prefix || key.startsWith(`${prefix}?`)) {
        pendingGets.delete(key);
        break;
      }
    }
  }
}

function clearCache(): void {
  getCache.clear();
  pendingGets.clear();
}

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

function headers(json = true): HeadersInit {
  const h: Record<string, string> = {};
  if (json) h['Content-Type'] = 'application/json';
  const t = getToken();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

let onUnauthorizedCallback: (() => void) | null = null;

async function handle<T>(res: Response): Promise<T> {
  if (res.status === 401 && !res.url.includes('/auth/login')) {
    localStorage.removeItem('admin_token');
    clearCache();
    alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    throw new Error('UNAUTHORIZED');
  }
  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(text);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  onUnauthorized(cb: () => void): void {
    onUnauthorizedCallback = cb;
  },

  async login(username: string, password: string): Promise<void> {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handle<{ token: string }>(res);
    localStorage.setItem('admin_token', data.token);
    clearCache();
  },

  logout(): void {
    localStorage.removeItem('admin_token');
    clearCache();
  },

  isLoggedIn(): boolean {
    return !!getToken();
  },

  async get<T>(path: string): Promise<T> {
    const key = cacheKey(path);
    const cached = getCache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cloneData(cached.data) as T;
    }

    const pending = pendingGets.get(key);
    if (pending) {
      return pending.then(data => cloneData(data) as T);
    }

    const request = fetch(`${BASE}${path}`, { headers: headers(false) })
      .then(res => handle<unknown>(res))
      .then(data => {
        if (pendingGets.get(key) === request) {
          getCache.set(key, {
            data: cloneData(data),
            expiresAt: Date.now() + CACHE_TTL_MS,
          });
        }
        return data;
      })
      .finally(() => {
        pendingGets.delete(key);
      });

    pendingGets.set(key, request);
    return request.then(data => cloneData(data) as T);
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const result = await handle<T>(await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    }));
    invalidatePath(path);
    return result;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const result = await handle<T>(await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    }));
    invalidatePath(path);
    return result;
  },

  async del(path: string, body?: unknown): Promise<void> {
    await handle<void>(await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: headers(body !== undefined),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }));
    invalidatePath(path);
  },
};
