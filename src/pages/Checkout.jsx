// src/pages/Checkout.jsx
import { useState } from 'react';
import { paymentsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';

export default function CheckoutPage() {
  const { user, isLoggedIn, isPro, login, register } = useAuth();

  // Se vier de redirect OAuth do Google (?auth=ok), pula direto para pagamento
  const params = new URLSearchParams(window.location.search);
  // If user is already Pro and came from Google OAuth, go directly to editor
  if (isLoggedIn && isPro && params.get('auth') === 'ok') {
    window.location.href = '/editor';
    return null;
  }
  const [step, setStep] = useState(
    isLoggedIn && params.get('auth') === 'ok' ? 'payment' : 'plan'
  );
  const [selectedPlan, setSelectedPlan] = useState('pro_monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const [authMode, setAuthMode] = useState('register');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const pixAvailable = selectedPlan === 'pro_annual';

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    if (plan === 'pro_monthly') setPaymentMethod('card');
  };

  const handleContinue = () => {
    if (!isLoggedIn) { setStep('auth'); return; }
    setStep('payment');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (authMode === 'register') { await register(email, password, name); }
      else { await login(email, password); }
      setStep('payment');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = () => {
    const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) { setError('Login com Google não configurado. Use email e senha.'); return; }
    // Retorna para /planos?auth=ok — o Checkout detecta e avança direto para pagamento
    const redirectTo = `${window.location.origin}/planos?auth=ok`;
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
  };

  const handleCheckout = async () => {
    setLoading(true); setError('');
    try { await paymentsApi.checkout(selectedPlan, paymentMethod); }
    catch (err) { setError(err.message || 'Erro ao iniciar pagamento.'); setLoading(false); }
  };

  // ─── Shared styles ─────────────────────────────────────────────────────────
  const page = { minHeight:'100vh', width:'100%', background:'#080808', color:'#f0f0f0', fontFamily:"'DM Sans',system-ui,sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px' };
  const card = { width:'100%', maxWidth:500, background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.07)', borderRadius:24, padding:'36px 32px' };
  const inp  = { width:'100%', background:'#111', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'13px 16px', fontSize:14, color:'#f0f0f0', outline:'none', fontFamily:'inherit' };
  const lbl  = { fontSize:11, color:'#555', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:7, display:'block' };
  const btn  = { width:'100%', padding:'14px 0', background:'#00BFFF', color:'#000', fontWeight:700, fontSize:15, border:'none', borderRadius:12, cursor:'pointer', boxShadow:'0 6px 20px rgba(0,191,255,0.28)' };
  const err  = { background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'11px 15px', fontSize:13, color:'#f87171', marginBottom:16 };

  const planCard = (active) => ({ border: active ? '2px solid #00BFFF' : '1.5px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 18px', cursor:'pointer', background: active ? 'rgba(0,191,255,0.05)' : '#111', transition:'all 0.2s', flex:1 });
  const payCard  = (active, disabled) => ({ border: active ? '2px solid #00BFFF' : '1.5px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 16px', cursor: disabled ? 'not-allowed' : 'pointer', background: active ? 'rgba(0,191,255,0.05)' : '#111', opacity: disabled ? 0.35 : 1, transition:'all 0.2s', flex:1, display:'flex', alignItems:'center', gap:10 });

  const Logo = () => (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
      <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#00BFFF,#0070ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⚡</div>
      <span style={{ fontWeight:800, fontSize:18, background:'linear-gradient(135deg,#fff 30%,#00BFFF 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>CanvasSync</span>
    </div>
  );

  const Back = ({ to }) => (
    <button onClick={() => setStep(to)} style={{ background:'none', border:'none', color:'#444', fontSize:13, cursor:'pointer', marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>← Voltar</button>
  );

  // ── STEP 1: PLANO ─────────────────────────────────────────────────────────
  if (step === 'plan') return (
    <div style={page}>
      <Logo />
      <div style={card}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6, textAlign:'center' }}>Assinar o Pro</h1>
        <p style={{ fontSize:14, color:'#444', textAlign:'center', marginBottom:28 }}>Cancele quando quiser</p>

        <span style={lbl}>Período</span>
        <div style={{ display:'flex', gap:10, marginBottom:24 }}>
          {[
            { id:'pro_monthly', label:'Mensal',  price:'R$ 39,90', sub:'por mês' },
            { id:'pro_annual',  label:'Anual',   price:'R$ 399',   sub:'≈ R$ 33,25/mês · -17%' },
          ].map(p => (
            <div key={p.id} style={planCard(selectedPlan === p.id)} onClick={() => handleSelectPlan(p.id)}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={{ fontWeight:700, fontSize:14 }}>{p.label}</span>
                {selectedPlan === p.id && <span style={{ color:'#00BFFF' }}>✓</span>}
              </div>
              <div style={{ color:'#00BFFF', fontWeight:800, fontSize:20 }}>{p.price}</div>
              <div style={{ color:'#444', fontSize:11, marginTop:3 }}>{p.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'16px 18px', marginBottom:24 }}>
          <p style={{ fontSize:11, color:'#00BFFF', fontWeight:700, letterSpacing:1, textTransform:'uppercase', marginBottom:12 }}>Incluído no Pro</p>
          {['Exportação de vídeo WEBM + áudio','Sincronização de letras em tempo real','Textos e imagens ilimitados','Sem marca d\'água','Suporte prioritário'].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom: i < 4 ? 8 : 0 }}>
              <span style={{ color:'#00BFFF', fontSize:13, flexShrink:0 }}>✓</span>
              <span style={{ fontSize:13, color:'#777' }}>{item}</span>
            </div>
          ))}
        </div>

        <button style={btn} onClick={handleContinue}>
          {isLoggedIn ? 'Continuar para Pagamento →' : 'Continuar →'}
        </button>
        <p style={{ textAlign:'center', fontSize:12, color:'#222', marginTop:14 }}>🔒 Pagamento seguro · SSL 256-bit · Stripe</p>
      </div>
      <button onClick={() => window.location.href='/'} style={{ marginTop:20, background:'none', border:'none', color:'#333', fontSize:13, cursor:'pointer' }}>← Voltar ao início</button>
    </div>
  );

  // ── STEP 2: AUTENTICAÇÃO ──────────────────────────────────────────────────
  if (step === 'auth') return (
    <div style={page}>
      <Logo />
      <div style={card}>
        <Back to="plan" />

        {/* Tabs */}
        <div style={{ display:'flex', background:'#111', borderRadius:12, padding:4, marginBottom:24 }}>
          {[['register','Criar conta'],['login','Já tenho conta']].map(([mode, label]) => (
            <button key={mode} onClick={() => { setAuthMode(mode); setError(''); }} style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', background: authMode===mode ? '#00BFFF' : 'transparent', color: authMode===mode ? '#000' : '#555', fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Google */}
        <button onClick={handleGoogleLogin} style={{ width:'100%', padding:'13px 0', background:'#fff', color:'#111', fontWeight:700, fontSize:14, border:'none', borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:16 }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continuar com Google
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'4px 0 20px' }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/>
          <span style={{ fontSize:12, color:'#333' }}>ou</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/>
        </div>

        {error && <div style={err}>⚠️ {error}</div>}

        <form onSubmit={handleAuth} style={{ display:'flex', flexDirection:'column', gap:14 }}>
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
            <div style={{ position:'relative' }}>
              <input style={{ ...inp, paddingRight:44 }} type={showPass ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#444', cursor:'pointer', fontSize:14 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop:4 }}>
            {loading ? 'Aguardando...' : authMode === 'register' ? 'Criar conta e continuar →' : 'Entrar e continuar →'}
          </button>
        </form>
      </div>
    </div>
  );

  // ── STEP 3: PAGAMENTO ─────────────────────────────────────────────────────
  return (
    <div style={page}>
      <Logo />
      <div style={card}>
        <Back to="plan" />
        <h2 style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Forma de pagamento</h2>
        {user?.email && <p style={{ fontSize:13, color:'#444', marginBottom:24 }}>Logado como <strong style={{ color:'#666' }}>{user.email}</strong></p>}

        <span style={lbl}>Método</span>
        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          <div style={payCard(paymentMethod==='card', false)} onClick={() => setPaymentMethod('card')}>
            <span style={{ fontSize:22 }}>💳</span>
            <div><div style={{ fontWeight:700, fontSize:13 }}>Cartão</div><div style={{ color:'#444', fontSize:11 }}>Crédito · Débito</div></div>
          </div>
          <div style={payCard(paymentMethod==='pix', !pixAvailable)} onClick={() => pixAvailable && setPaymentMethod('pix')}>
            <span style={{ fontSize:22 }}>🏦</span>
            <div><div style={{ fontWeight:700, fontSize:13 }}>PIX</div><div style={{ color:'#444', fontSize:11 }}>{pixAvailable ? 'Instantâneo' : 'Só plano anual'}</div></div>
          </div>
        </div>

        {paymentMethod === 'pix' && (
          <div style={{ background:'rgba(0,191,255,0.05)', border:'1px solid rgba(0,191,255,0.15)', borderRadius:10, padding:'10px 14px', fontSize:12, color:'#555', marginBottom:16 }}>
            💡 O QR Code aparece na próxima tela. Você terá 30 minutos para pagar.
          </div>
        )}

        <div style={{ background:'#111', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'14px 18px', marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ color:'#555', fontSize:13 }}>Pro {selectedPlan === 'pro_annual' ? 'Anual' : 'Mensal'}</span>
            <span style={{ fontWeight:800, color:'#00BFFF' }}>{selectedPlan === 'pro_annual' ? 'R$ 399,00' : 'R$ 39,90'}</span>
          </div>

        </div>

        {error && <div style={err}>⚠️ {error}</div>}

        <button onClick={handleCheckout} disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Redirecionando...' : `Pagar com ${paymentMethod === 'pix' ? 'PIX' : 'Cartão'} →`}
        </button>
        <p style={{ textAlign:'center', fontSize:12, color:'#1e1e1e', marginTop:14 }}>🔒 Pagamento seguro via Stripe · SSL 256-bit</p>
      </div>
    </div>
  );
}
