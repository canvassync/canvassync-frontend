// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const token = localStorage.getItem("canvassync_token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(`${API_URL}${path}`, config);
  const data = await res.json();
  if (!res.ok) {
    if (data.code === "TOKEN_EXPIRED") {
      localStorage.removeItem("canvassync_token");
      localStorage.removeItem("canvassync_user");
      window.location.href = "/";
    }
    throw new Error(data.error || "Erro desconhecido");
  }
  return data;
}

export const authApi = {
  register: (email, password, name) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request("/auth/me"),
};

export const paymentsApi = {
  checkout: async (plan, paymentMethod = "card") => {
    const data = await request("/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ plan, paymentMethod }),
    });
    window.location.href = data.url;
  },
  openPortal: async () => {
    const data = await request("/payments/portal", { method: "POST" });
    window.location.href = data.url;
  },
  getStatus: () => request("/payments/status"),
};

export function saveSession(token, user) {
  localStorage.setItem("canvassync_token", token);
  localStorage.setItem("canvassync_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("canvassync_token");
  localStorage.removeItem("canvassync_user");
}

export function getCachedUser() {
  try { return JSON.parse(localStorage.getItem("canvassync_user")); }
  catch { return null; }
}

export function isPro(user) {
  return user?.plan === "pro" && user?.subscriptionStatus === "active";
}
