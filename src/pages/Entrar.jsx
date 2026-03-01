// src/pages/Entrar.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function Entrar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const { login, register, isLoggedIn, isPro } = useAuth();

  const [mode, setMode]         = useState("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Redireciona após login (não pode chamar navigate() fora de hook/evento)
  // Destination after login: respect ?redirect param, else Pro→/editor, Free→/editor-free
  const getDestination = () => redirectParam || (isPro ? '/editor' : '/editor-free');

  useEffect(() => {
    if (isLoggedIn) navigate(getDestination(), { replace: true });
  }, [isLoggedIn, isPro]);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Preencha email e senha."); return; }
    if (mode === "register" && !name) { setError("Informe seu nome."); return; }
    if (password.length < 6) { setError("Senha deve ter pelo menos 6 caracteres."); return; }

    setLoading(true);
    try {
      if (mode === "register") { await register(email, password, name); }
      else { await login(email, password); }
      navigate(getDestination(), { replace: true });
    } catch (err) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) { setError("Login com Google não configurado."); return; }
    // Retorna para /entrar?auth=ok para processar a sessão antes de redirecionar
    const redirectTo = `${window.location.origin}/entrar?auth=ok&redirect=${encodeURIComponent(redirectParam || '')}`;
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "#080808", color: "#f0f0f0",
      fontFamily: "'DM Sans', 'Poppins', system-ui, sans-serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    }}>

      {/* Glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 400,
        background: "radial-gradient(ellipse, rgba(0,191,255,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, cursor: "pointer" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #00BFFF, #0070ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
        <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #fff 30%, #00BFFF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CanvasSync</span>
      </div>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 420, background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "36px 32px", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>

        {/* Toggle */}
        <div style={{ display: "flex", background: "#0a0a0a", borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "9px 0", border: "none", borderRadius: 9, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s", background: mode === m ? "#00BFFF" : "transparent", color: mode === m ? "#000" : "#555" }}>
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: "-0.5px" }}>
          {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta grátis"}
        </h1>
        <p style={{ color: "#555", fontSize: 14, marginBottom: 24 }}>
          {mode === "login" ? "Entre para acessar seus projetos." : "Sem cartão de crédito. Comece a criar agora."}
        </p>

        {/* Google */}
        <button onClick={handleGoogle} style={{ width: "100%", padding: "13px 0", background: "#fff", color: "#111", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, transition: "opacity 0.2s" }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar com Google
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 12, color: "#333" }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <div>
              <label style={lblStyle}>NOME</label>
              <input type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} style={inputStyle} />
            </div>
          )}
          <div>
            <label style={lblStyle}>EMAIL</label>
            <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} style={inputStyle} />
          </div>
          <div>
            <label style={lblStyle}>SENHA</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} style={{ ...inputStyle, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 14 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginTop: 16, color: "#f87171", fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 22, padding: "14px 0", background: loading ? "#0a2030" : "#00BFFF", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, color: loading ? "#555" : "#000", cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 6px 20px rgba(0,191,255,0.3)", transition: "all 0.2s" }}>
          {loading ? "Aguardando..." : mode === "login" ? "Entrar" : "Criar conta e começar"}
        </button>

        {/* Link Pro */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#333", marginTop: 20 }}>
          Quer exportar vídeos?{" "}
          <button onClick={() => navigate("/planos")} style={{ background: "none", border: "none", color: "#00BFFF", cursor: "pointer", fontWeight: 700, fontSize: 12, padding: 0 }}>
            Ver plano Pro →
          </button>
        </p>
      </div>

      {/* Back */}
      <button onClick={() => navigate("/")} style={{ marginTop: 24, background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 13 }}>
        ← Voltar ao início
      </button>

      <p style={{ marginTop: 16, fontSize: 11, color: "#222", textAlign: "center", maxWidth: 320 }}>
        Ao criar uma conta, você concorda com nossos Termos de Uso e Política de Privacidade.
      </p>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px",
  background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10, color: "#f0f0f0", fontSize: 14,
  outline: "none", fontFamily: "inherit",
};

const lblStyle = {
  fontSize: 11, color: "#555", fontWeight: 700,
  letterSpacing: 1, textTransform: "uppercase",
  display: "block", marginBottom: 6,
};
