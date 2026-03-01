// src/pages/Registro.jsx
// Página de cadastro para o plano Free — exibida antes de abrir o editor gratuito

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Registro() {
  const { isLoggedIn, isPro, login, register } = useAuth();

  const [authMode, setAuthMode] = useState('register');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Se já está logado (incluindo retorno do OAuth Google), vai direto para o editor
  if (isLoggedIn) {
    window.location.href = isPro ? '/editor' : '/editor-free';
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (authMode === 'register') { await register(email, password, name); }
      else { await login(email, password); }
      window.location.href = isPro ? '/editor' : '/editor-free';
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleGoogle = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) { setError('Login com Google não configurado ainda.'); return; }
    // Redireciona de volta para /cadastro?auth=ok para o hook processar a sessão
    const redirectTo = `${window.location.origin}/cadastro?auth=ok`;
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
  };

  // ─── Estilos ──────────────────────────────────────────────────────────────
  const page = {
    minHeight: '100vh', width: '100%',
    background: '#080808', color: '#f0f0f0',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px',
  };
  const card = {
    width: '100%', maxWidth: 460,
    background: '#0d0d0d',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 24, padding: '36px 32px',
  };
  const inp = {
    width: '100%', background: '#111',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '13px 16px',
    fontSize: 14, color: '#f0f0f0',
    outline: 'none', fontFamily: 'inherit',
  };
  const lbl = {
    fontSize: 11, color: '#555', fontWeight: 700,
    letterSpacing: 1, textTransform: 'uppercase',
    marginBottom: 7, display: 'block',
  };
  const btn = {
    width: '100%', padding: '14px 0',
    background: '#00BFFF', color: '#000',
    fontWeight: 700, fontSize: 15, border: 'none',
    borderRadius: 12, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0,191,255,0.28)',
  };

  return (
    <div style={page}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#00BFFF,#0070ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
        <span style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,#fff 30%,#00BFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CanvasSync</span>
      </div>

      <div style={card}>

        {/* Badge Free */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <span style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', borderRadius: 999, padding: '4px 14px', fontSize: 12, color: '#00BFFF', fontWeight: 700 }}>
            ⚡ Plano Free — Sem cartão
          </span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, textAlign: 'center' }}>
          {authMode === 'register' ? 'Crie sua conta grátis' : 'Entre na sua conta'}
        </h1>
        <p style={{ fontSize: 13, color: '#444', textAlign: 'center', marginBottom: 24 }}>
          {authMode === 'register' ? 'Comece a criar imagens agora mesmo' : 'Continue criando suas composições'}
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#111', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {[['register', 'Criar conta'], ['login', 'Já tenho conta']].map(([mode, label]) => (
            <button key={mode} onClick={() => { setAuthMode(mode); setError(''); }}
              style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', background: authMode === mode ? '#00BFFF' : 'transparent', color: authMode === mode ? '#000' : '#555', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{ width: '100%', padding: '13px 0', background: '#fff', color: '#111', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar com Google
        </button>

        {/* Divisor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 20px' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }}/>
          <span style={{ fontSize: 12, color: '#333' }}>ou</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }}/>
        </div>

        {/* Erro */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '11px 15px', fontSize: 13, color: '#f87171', marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {authMode === 'register' && (
            <div>
              <span style={lbl}>Nome</span>
              <input style={inp} type="text" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <span style={lbl}>Email</span>
            <input style={inp} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <span style={lbl}>Senha</span>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inp, paddingRight: 44 }} type={showPass ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 14 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ ...btn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
            {loading ? 'Aguardando...' : authMode === 'register' ? 'Criar conta e começar →' : 'Entrar no editor →'}
          </button>
        </form>

        {/* O que está incluso no Free */}
        <div style={{ marginTop: 24, background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px' }}>
          <p style={{ fontSize: 11, color: '#444', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Plano Free inclui</p>
          {['Geração de imagens estáticas', 'Exportação PNG e JPG', '1 texto extra na composição', 'Imagens de fundo personalizadas'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 3 ? 7 : 0 }}>
              <span style={{ color: '#00BFFF', fontSize: 12, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 12, color: '#555' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Link para Pro */}
        <p style={{ textAlign: 'center', fontSize: 12, color: '#333', marginTop: 20 }}>
          Quer exportar vídeos?{' '}
          <button onClick={() => window.location.href = '/planos'}
            style={{ background: 'none', border: 'none', color: '#00BFFF', cursor: 'pointer', fontWeight: 700, fontSize: 12, padding: 0 }}>
            Ver plano Pro →
          </button>
        </p>
      </div>

      {/* Voltar */}
      <button onClick={() => window.location.href = '/'}
        style={{ marginTop: 20, background: 'none', border: 'none', color: '#333', fontSize: 13, cursor: 'pointer' }}>
        ← Voltar ao início
      </button>
    </div>
  );
}
