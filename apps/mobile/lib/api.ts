const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ── response types ────────────────────────────────────────────────────────────

export type FoodSearchResult = {
  id: string;
  name: string;
  category: string;
};

export type FoodReason = {
  trigger_type: 'medication' | 'restriction';
  trigger_name: string;
  verdict: 'avoid' | 'caution' | 'ok';
  severity: 'high' | 'medium' | 'low';
  reason: string;
  source?: string;
};

export type CheckFoodResponse = {
  food: string;
  verdict: 'avoid' | 'caution' | 'ok';
  personalized: boolean;
  reasons: FoodReason[];
};

// ── API surface ───────────────────────────────────────────────────────────────

export const api = {
  health:  () => get<{ status: string; time?: string }>('/healthz'),
  ready:   () => get<{ status: string; db?: string }>('/readyz'),
  ping:    () => get<{ message: string; version: string }>('/api/v1/ping'),

  foods: {
    search: (q: string) =>
      get<FoodSearchResult[]>(`/api/v1/foods/search?q=${encodeURIComponent(q)}`),
    check: (foodName: string, userId?: string) =>
      post<CheckFoodResponse>('/api/v1/foods/check', { food_name: foodName, user_id: userId }),
  },
};
