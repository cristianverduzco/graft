/**
 * API client for the Graft backend.
 *
 * On iOS Simulator/Expo Go on physical device:
 *  - Simulator can use http://localhost:8080
 *  - Physical device needs your Mac's LAN IP (e.g. http://192.168.1.42:8080)
 *
 * We read this from EXPO_PUBLIC_API_URL so it's configurable per environment.
 */

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export type PingResponse = {
  message: string;
  version: string;
};

export type HealthResponse = {
  status: string;
  time?: string;
  db?: string;
};

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export const api = {
  ping: () => request<PingResponse>("/api/v1/ping"),
  health: () => request<HealthResponse>("/healthz"),
  ready: () => request<HealthResponse>("/readyz"),
};
