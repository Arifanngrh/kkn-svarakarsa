export const API = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export function mediaUrl(value) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API}${value.startsWith("/") ? value : `/${value}`}`;
}

async function parseResponse(res) {
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    const message = data?.detail || data?.message || (typeof data === "string" ? data : "Request gagal");
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, { ...options, headers });
  return parseResponse(res);
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  return api("/api/upload", { method: "POST", body: form });
}
