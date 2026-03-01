// src/hooks/useAuth.jsx
import { useState, useEffect, createContext, useContext } from "react";
import { authApi, saveSession, clearSession, getCachedUser, isPro } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Start with cached user for instant UI, but always verify with server
  const [user, setUser]       = useState(getCachedUser());
  const [loading, setLoading] = useState(true); // always true until /me returns

  useEffect(() => {
    // ── Detecta retorno do OAuth Google (Supabase retorna #access_token=... na URL) ──
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const hashParams = new URLSearchParams(hash.replace("#", ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken) {
        fetch(`${API_URL}/auth/google-callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
        })
          .then(r => r.json())
          .then(data => {
            if (data.token && data.user) {
              saveSession(data.token, data.user);
              setUser(data.user);
              // Redireciona baseado no plano após OAuth Google
              const userIsPro = data.user?.plan === "pro" && data.user?.subscriptionStatus === "active";
              const searchParams = new URLSearchParams(window.location.search);
              const redirectTo = searchParams.get("redirect");
              window.location.href = redirectTo || (userIsPro ? "/editor" : "/editor-free");
            } else {
              setLoading(false);
            }
          })
          .catch(() => setLoading(false));
        return;
      }
    }

    // ── Sessão normal via JWT ──
    const token = localStorage.getItem("canvassync_token");
    if (!token) { setLoading(false); return; }
    authApi.me()
      .then(freshUser => {
        // Always overwrite cache with fresh data from server (plan may have changed)
        setUser(freshUser);
        localStorage.setItem("canvassync_user", JSON.stringify(freshUser));
      })
      .catch(() => { clearSession(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    saveSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, name) => {
    const data = await authApi.register(email, password, name);
    saveSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearSession();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, isPro: isPro(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
