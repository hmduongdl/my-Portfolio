const BASE = '/api';

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

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(text);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  async login(username: string, password: string): Promise<void> {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handle<{ token: string }>(res);
    localStorage.setItem('admin_token', data.token);
  },

  logout(): void {
    localStorage.removeItem('admin_token');
  },

  isLoggedIn(): boolean {
    return !!getToken();
  },

  async get<T>(path: string): Promise<T> {
    return handle<T>(await fetch(`${BASE}${path}`, { headers: headers(false) }));
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    return handle<T>(await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body),
    }));
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    return handle<T>(await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    }));
  },

  async del(path: string): Promise<void> {
    return handle<void>(await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: headers(false),
    }));
  },
};
