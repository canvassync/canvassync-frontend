// src/hooks/useAuth.jsx
import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../services/supabase";
import { authApi, saveSession, clearSession, getCachedUser, isPro } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(getCachedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    const processAuth = async () => {
      const hash   = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      const code   = params.get("code");

      // ── FORMATO 1: #access_token= no hash (implicit flow) ──────────────────
      if (hash && hash.includes("access_token")) {
        const hashParams  = new URLSearchParams(hash.replace("#", ""));
        const accessToken = hashParams.get("access_token");

        if (accessToken) {
          try {
            const res  = await fetch(`${API_URL}/auth/google-callback`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: accessToken }),
            });
            const json = await res.json();

            if (json.token && json.user) {
              saveSession(json.token, json.user);
              setUser(json.user);
              const userIsPro  = json.user?.plan === "pro" && json.user?.subscriptionStatus === "active";
              const redirectTo = params.get("redirect");
              window.history.replaceState(null, "", window.location.pathname);
              window.location.href = redirectTo || (userIsPro ? "/editor" : "/editor-free");
              return;
            }
          } catch (err) {
            console.error("[OAuth hash] Erro:", err);
          }
          setLoading(false);
          return;
        }
      }

      // ── FORMATO 2: ?code= na query string (PKCE flow) ──────────────────────
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );

          if (error || !data?.session) {
            console.error("[OAuth PKCE] Erro:", error);
            setLoading(false);
            return;
          }

          const res  = await fetch(`${API_URL}/auth/google-callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: data.session.access_token }),
          });
          const json = await res.json();

          if (json.token && json.user) {
            saveSession(json.token, json.user);
            setUser(json.user);
            const userIsPro  = json.user?.plan === "pro" && json.user?.subscriptionStatus === "active";
            const redirectTo = params.get("redirect");
            window.history.replaceState(null, "", window.location.pathname);
            window.location.href = redirectTo || (userIsPro ? "/editor" : "/editor-free");
            return;
          }
        } catch (err) {
          console.error("[OAuth PKCE] Erro:", err);
        }
        setLoading(false);
        return;
      }

      // ── Sessão normal via JWT ───────────────────────────────────────────────
      const token = localStorage.getItem("canvassync_token");
      if (!token) { setLoading(false); return; }

      authApi.me()
        .then(freshUser => {
          setUser(freshUser);
          localStorage.setItem("canvassync_user", JSON.stringify(freshUser));
        })
        .catch(() => { clearSession(); setUser(null); })
        .finally(() => setLoading(false));
    };

    processAuth();
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
