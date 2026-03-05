import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play, Zap, Download, Layers, Star, Check, ChevronRight,
  Music, Image, Sparkles, ArrowRight, Menu, X,
  MessageSquare, Bot
} from "lucide-react";


function SupportChat({ chatTopic, setChatTopic, setChatOpen }) {
  const faqs = [
    { q: "Como exportar o vídeo?", a: "No editor Pro, selecione o formato (WEBM + Áudio ou HD 1080p) e clique em Salvar. O arquivo será baixado automaticamente." },
    { q: "Como sincronizar a letra?", a: "Cole a letra no campo de texto (uma frase por linha), dê Play e clique em ⚡ MARCAR AGORA no ritmo de cada frase." },
    { q: "Como adicionar vídeos?", a: "No editor Pro há a opção 🎬 Vídeos no topo. Adicione vídeos, ajuste posição, tamanho, rotação e áudio na timeline." },
    { q: "Diferença Free vs Pro?", a: "Free: imagens estáticas (PNG/JPG). Pro: vídeo com áudio, HD 1080p, sincronização de letras, vídeos e sem marca d'água." },
    { q: "Problemas com pagamento", a: "Pagamentos são processados pelo Stripe. Para problemas, entre em contato pelo e-mail abaixo." },
  ];
  return (
    <div style={{ position: "fixed", bottom: 88, right: 24, zIndex: 9998, width: 340, borderRadius: 18, background: "#111", border: "1px solid rgba(0,191,255,0.2)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", background: "linear-gradient(135deg,rgba(0,191,255,0.15),rgba(0,112,255,0.1))", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#00BFFF,#0070ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Bot size={17} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0" }}>Suporte CanvasSync</div>
          <div style={{ fontSize: 11, color: "#00BFFF" }}>Como podemos ajudar?</div>
        </div>
        {chatTopic !== null && (
          <button onClick={() => setChatTopic(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>←</button>
        )}
        <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>✕</button>
      </div>
      <div style={{ padding: 14, maxHeight: 360, overflowY: "auto" }}>
        {chatTopic === null ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>Selecione um tópico:</p>
            {faqs.map((item, i) => (
              <button key={i} onClick={() => setChatTopic(i)}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", color: "#ccc", fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit", width: "100%" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,191,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#ccc"; }}>
                {item.q}
              </button>
            ))}
            <a href="mailto:canvassynclyrics@gmail.com" style={{ marginTop: 4, background: "rgba(0,191,255,0.08)", border: "1px solid rgba(0,191,255,0.2)", borderRadius: 12, padding: "10px 14px", color: "#00BFFF", fontSize: 13, textAlign: "center", textDecoration: "none", display: "block" }}>
              ✉️ Enviar e-mail para o suporte
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "rgba(0,191,255,0.08)", border: "1px solid rgba(0,191,255,0.15)", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ fontSize: 12, color: "#00BFFF", fontWeight: 700, marginBottom: 8 }}>{faqs[chatTopic].q}</p>
              <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{faqs[chatTopic].a}</p>
            </div>
            <a href="mailto:canvassynclyrics@gmail.com" style={{ background: "rgba(0,191,255,0.08)", border: "1px solid rgba(0,191,255,0.2)", borderRadius: 12, padding: "10px 14px", color: "#00BFFF", fontSize: 13, textAlign: "center", textDecoration: "none", display: "block" }}>
              ✉️ canvassynclyrics@gmail.com
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Intersection Observer hook for scroll-reveal ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════ */
export default function CanvasSyncLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTopic, setChatTopic] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: <Music size={22} />,
      title: "Sincronia Manual Intuitiva",
      desc: "Marque cada frase da letra no ritmo da música em tempo real. Precisão total, sem complicação.",
    },
    {
      icon: <Download size={22} />,
      title: "Exportação em Alta Qualidade",
      desc: "Vídeo WEBM com áudio embutido e exportação HD 1080p, pronto para upload direto no Reels e TikTok.",
    },
    {
      icon: <Layers size={22} />,
      title: "Elementos Arrastáveis",
      desc: "Textos, imagens e sobreposições que você move, redimensiona e gira diretamente na tela.",
    },
    {
      icon: <Zap size={22} />,
      title: "Timeline Profissional",
      desc: "Controle total sobre cada elemento: duração, posição e encaixes via drag na timeline.",
    },
    {
      icon: <Image size={22} />,
      title: "Múltiplos Fundos & Fotos",
      desc: "Adicione quantas imagens quiser e distribua-as automaticamente ao longo da música.",
    },
    {
      icon: <Sparkles size={22} />,
      title: "Vídeos, Textos e Rotação",
      desc: "Adicione vídeos à composição, textos extras com múltiplas linhas, fontes premium e rotação livre para imagens e vídeos.",
    },
  ];

  const freePlan = [
    "Geração de imagens estáticas",
    "1 texto extra na composição",
    "Exportação PNG / JPG",
    "Marca d'água CanvasSync",
    "Acesso à timeline básica",
  ];

  const proPlan = [
    "Exportação de vídeo completo (WEBM)",
    "Sincronia de letras em tempo real",
    "Textos e imagens ilimitados",
    "Sem marca d'água",
    "Suporte prioritário",
    "Histórico de projetos",
    "Fontes premium exclusivas",
    "Exportação com áudio embutido",
  ];

  const testimonials = [
    { name: "Luana M.", role: "Produtora Musical", text: "Em 5 minutos meu lyric video estava pronto. Economizo horas toda semana.", stars: 5 },
    { name: "Caio R.", role: "Criador de Conteúdo", text: "A sincronização da letra no ritmo é absurdamente precisa. Melhor que qualquer outra ferramenta.", stars: 5 },
    { name: "Fernanda S.", role: "DJ & Artista", text: "Meus Reels explodiram depois que comecei a usar. Visual profissional em minutos.", stars: 5 },
  ];

  return (
    <div
      style={{
        background: "#080808",
        color: "#f0f0f0",
        fontFamily: "'DM Sans', 'Syne', system-ui, sans-serif",
        overflowX: "hidden",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --electric: #00BFFF;
          --electric-dim: rgba(0,191,255,0.15);
          --electric-glow: rgba(0,191,255,0.35);
          --surface: #111111;
          --surface-2: #181818;
          --border: rgba(255,255,255,0.07);
          --text-muted: #888;
        }

        html { scroll-behavior: smooth; }

        .syne { font-family: 'Syne', sans-serif; }

        .btn-primary {
          background: var(--electric);
          color: #000;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 24px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
        .btn-primary:hover {
          background: #29ccff;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(0,191,255,0.35);
        }

        .btn-ghost {
          background: transparent;
          color: #ccc;
          font-weight: 500;
          font-size: 14px;
          padding: 11px 22px;
          border-radius: 999px;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: #fff; }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          transition: border-color 0.3s, transform 0.3s;
        }
        .card:hover { border-color: rgba(0,191,255,0.25); transform: translateY(-3px); }

        .gradient-text {
          background: linear-gradient(135deg, #fff 30%, #00BFFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--electric);
          box-shadow: 0 0 8px var(--electric);
          display: inline-block;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .pricing-toggle {
          display: flex; align-items: center; gap: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 6px 6px 6px 16px;
        }

        .toggle-pill {
          width: 44px; height: 24px;
          border-radius: 999px;
          background: var(--electric-dim);
          border: 1px solid var(--electric-glow);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
        }
        .toggle-pill.on { background: var(--electric); }

        .toggle-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 2px; left: 2px;
          transition: transform 0.2s;
        }
        .toggle-thumb.on { transform: translateX(20px); }

        .noise-bg {
          position: relative;
        }
        .noise-bg::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
          z-index: 0;
        }

        .star { color: #FFB800; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ═══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 24px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition: "all 0.3s",
        }}
      >
        {/* Logo */}
        <div className="syne" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #00BFFF, #0070ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={16} color="#fff" fill="#fff" />
          </div>
          <span className="gradient-text">CanvasSync</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a href="#features" style={{ color: "#999", fontSize: 14, textDecoration: "none", padding: "8px 14px", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "#999"}>Recursos</a>
          <a href="#pricing" style={{ color: "#999", fontSize: 14, textDecoration: "none", padding: "8px 14px", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "#999"}>Planos</a>
          <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={() => navigate("/entrar")}>Entrar</button>
          <button className="btn-primary" onClick={() => navigate("/cadastro")}>Começar Agora</button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none" }}
          className="show-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "#0e0e0e", borderBottom: "1px solid var(--border)",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12,
        }}>
          <a href="#features" style={{ color: "#ccc", textDecoration: "none", fontSize: 15, padding: "8px 0" }} onClick={() => setMenuOpen(false)}>Recursos</a>
          <a href="#pricing" style={{ color: "#ccc", textDecoration: "none", fontSize: 15, padding: "8px 0" }} onClick={() => setMenuOpen(false)}>Planos</a>
          <button className="btn-ghost" style={{ width: "100%", marginTop: 4 }} onClick={() => navigate("/entrar")}>Entrar</button>
          <button className="btn-primary" style={{ width: "100%", padding: "14px 24px" }} onClick={() => navigate("/cadastro")}>Começar Agora</button>
        </div>
      )}

      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        className="noise-bg"
        style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "120px 24px 80px",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Ambient glow blobs */}
        <div style={{
          position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(0,191,255,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "20%",
          width: 300, height: 300,
          background: "radial-gradient(ellipse, rgba(0,112,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,191,255,0.08)",
            border: "1px solid rgba(0,191,255,0.2)",
            borderRadius: 999, padding: "6px 14px",
            fontSize: 12, color: "#00BFFF", fontWeight: 600,
            letterSpacing: 1, textTransform: "uppercase",
            marginBottom: 28,
            animation: "fadeInDown 0.6s ease both",
          }}>
            <span className="glow-dot" style={{ margin: 0 }} />
            Novo · Lyric Video Creator
          </div>

          {/* Main headline */}
          <h1
            className="syne"
            style={{
              fontSize: "clamp(40px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              marginBottom: 24,
              animation: "fadeInUp 0.7s ease 0.1s both",
            }}
          >
            <span className="gradient-text">Seus vídeos</span>
            <br />
            <span style={{ color: "#fff" }}>sincronizados</span>
            <br />
            <span style={{ color: "#00BFFF" }}>em um clique.</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: "clamp(16px, 2.2vw, 20px)",
            color: "#888",
            lineHeight: 1.65,
            maxWidth: 560,
            margin: "0 auto 40px",
            fontWeight: 300,
            animation: "fadeInUp 0.7s ease 0.2s both",
          }}>
            A maneira mais rápida de transformar áudio, imagem e vídeo em conteúdos{" "}
            <strong style={{ color: "#bbb", fontWeight: 500 }}>virais para Reels e TikTok</strong>.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
            animation: "fadeInUp 0.7s ease 0.3s both",
          }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px", display: "flex", alignItems: "center", gap: 8 }} onClick={() => navigate("/cadastro")}>
              Começar Grátis <ArrowRight size={16} />
            </button>
            <button className="btn-ghost" style={{ fontSize: 15, padding: "14px 28px", display: "flex", alignItems: "center", gap: 8 }}>
              <Play size={14} fill="currentColor" /> Ver demonstração
            </button>
          </div>

          {/* Trust micro-copy */}
          <p style={{ marginTop: 18, fontSize: 12, color: "#555" }}>
            Sem cartão de crédito · Grátis para sempre no plano Free
          </p>
        </div>
      </section>

      {/* ═══ VIDEO CONTAINER ════════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 100px", position: "relative" }}>
        <Reveal>
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            {/* Browser chrome mockup */}
            <div style={{
              background: "#141414",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(0,191,255,0.05)",
            }}>
              {/* Browser top bar */}
              <div style={{
                height: 44, background: "#1a1a1a",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", padding: "0 16px", gap: 10,
              }}>
                <div style={{ display: "flex", gap: 7 }}>
                  {["#ff5f57","#febc2e","#28c840"].map(c => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.9 }} />
                  ))}
                </div>
                <div style={{
                  flex: 1, height: 26, background: "#252525",
                  borderRadius: 8, margin: "0 16px",
                  display: "flex", alignItems: "center", paddingLeft: 12,
                  fontSize: 11, color: "#555",
                }}>
                  app.canvassync.com
                </div>
              </div>

              {/* Video placeholder */}
              <div style={{
                aspectRatio: "16/9",
                background: "linear-gradient(135deg, #0e0e0e 0%, #141420 50%, #0e0e12 100%)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 20, position: "relative", overflow: "hidden",
              }}>
                {/* Grid lines decoration */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }} />

                {/* Play button */}
                <div
                  style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "rgba(0,191,255,0.12)",
                    border: "2px solid rgba(0,191,255,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 0 40px rgba(0,191,255,0.2)",
                    position: "relative", zIndex: 1,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(0,191,255,0.22)";
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow = "0 0 60px rgba(0,191,255,0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(0,191,255,0.12)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 40px rgba(0,191,255,0.2)";
                  }}
                >
                  <Play size={28} color="#00BFFF" fill="#00BFFF" style={{ marginLeft: 4 }} />
                </div>

                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <p style={{ color: "#555", fontSize: 14, fontWeight: 500 }}>Vídeo demonstrativo</p>
                  <p style={{ color: "#333", fontSize: 12, marginTop: 4 }}>em breve disponível</p>
                </div>

                {/* Decorative corner accent */}
                <div style={{
                  position: "absolute", bottom: 24, right: 24,
                  background: "rgba(0,191,255,0.06)", border: "1px solid rgba(0,191,255,0.15)",
                  borderRadius: 10, padding: "8px 14px",
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12, color: "#00BFFF",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00BFFF", boxShadow: "0 0 6px #00BFFF" }} />
                  CanvasSync Demo
                </div>
              </div>
            </div>

            {/* Ambient glow under video */}
            <div style={{
              position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)",
              width: "70%", height: 80,
              background: "rgba(0,191,255,0.06)",
              filter: "blur(30px)",
              borderRadius: "50%",
              pointerEvents: "none",
            }} />
          </div>
        </Reveal>
      </section>

      {/* ═══ STATS ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: "20px 24px 80px" }}>
        <Reveal>
          <div
            className="stats-grid"
            style={{
              maxWidth: 900, margin: "0 auto",
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden",
            }}
          >
            {[
              { value: 12000, suffix: "+", label: "Vídeos criados" },
              { value: 97, suffix: "%", label: "Satisfação dos usuários" },
              { value: 5, suffix: "min", label: "Tempo médio por vídeo" },
              { value: 0, suffix: "R$", label: "Para começar" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: "#0d0d0d", padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div className="syne" style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, color: "#00BFFF", lineHeight: 1 }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div style={{ color: "#555", fontSize: 13, marginTop: 6, fontWeight: 400 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ FEATURES ════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: "80px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <p style={{ color: "#00BFFF", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                RECURSOS
              </p>
              <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px" }}>
                Tudo que você precisa,{" "}
                <span className="gradient-text">sem complicação</span>
              </h2>
              <p style={{ color: "#666", marginTop: 16, fontSize: 16, maxWidth: 480, margin: "16px auto 0" }}>
                Construído para criadores que precisam de resultado rápido e visual profissional.
              </p>
            </div>
          </Reveal>

          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "rgba(0,191,255,0.1)", border: "1px solid rgba(0,191,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#00BFFF", marginBottom: 18,
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: "#eee" }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <p style={{ textAlign: "center", color: "#00BFFF", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              DEPOIMENTOS
            </p>
            <h2 className="syne" style={{ textAlign: "center", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 48 }}>
              Criadores já estão <span className="gradient-text">amando</span>
            </h2>
          </Reveal>

          <div
            className="testimonials-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{ display: "flex", marginBottom: 14 }}>
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={14} className="star" fill="#FFB800" color="#FFB800" />
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: "#888", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "linear-gradient(135deg, #00BFFF, #0060ff)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: "#fff",
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd" }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "80px 24px 100px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p style={{ color: "#00BFFF", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                PLANOS
              </p>
              <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 24 }}>
                Simples e <span className="gradient-text">transparente</span>
              </h2>

              {/* Billing toggle */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="pricing-toggle">
                  <span style={{ fontSize: 13, color: billingAnnual ? "#555" : "#ddd", fontWeight: 500 }}>Mensal</span>
                  <div
                    className={`toggle-pill ${billingAnnual ? "on" : ""}`}
                    onClick={() => setBillingAnnual(!billingAnnual)}
                    style={{ background: billingAnnual ? "#00BFFF" : "rgba(0,191,255,0.15)" }}
                  >
                    <div className={`toggle-thumb ${billingAnnual ? "on" : ""}`} />
                  </div>
                  <span style={{ fontSize: 13, color: billingAnnual ? "#ddd" : "#555", fontWeight: 500 }}>Anual</span>
                  {billingAnnual && (
                    <div style={{
                      background: "rgba(0,191,255,0.12)", border: "1px solid rgba(0,191,255,0.25)",
                      borderRadius: 999, padding: "3px 10px",
                      fontSize: 11, color: "#00BFFF", fontWeight: 700,
                    }}>
                      -17%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <div
            className="pricing-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}
          >
            {/* FREE */}
            <Reveal delay={0}>
              <div className="card" style={{ padding: 36 }}>
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 12, color: "#555", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>FREE</p>
                  <div className="syne" style={{ fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                    R$ 0
                  </div>
                  <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>Para sempre</p>
                </div>

                <ul style={{ listStyle: "none", marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                  {freePlan.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#777" }}>
                      <Check size={14} color="#444" style={{ marginTop: 1, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="btn-ghost" style={{ width: "100%", padding: "13px 0", borderRadius: 12, fontSize: 14 }} onClick={() => navigate("/cadastro")}>
                  Criar conta grátis
                </button>
              </div>
            </Reveal>

            {/* PRO */}
            <Reveal delay={120}>
              <div
                style={{
                  background: "linear-gradient(160deg, #0a1a24 0%, #0d1520 100%)",
                  border: "1px solid rgba(0,191,255,0.3)",
                  borderRadius: 20, padding: 36,
                  position: "relative", overflow: "hidden",
                  boxShadow: "0 0 50px rgba(0,191,255,0.08), inset 0 1px 0 rgba(0,191,255,0.1)",
                }}
              >
                {/* Most popular badge */}
                <div style={{
                  position: "absolute", top: 20, right: 20,
                  background: "#00BFFF", color: "#000",
                  fontSize: 10, fontWeight: 800, letterSpacing: 1,
                  textTransform: "uppercase", padding: "4px 10px", borderRadius: 999,
                }}>
                  ✦ Popular
                </div>

                {/* Glow blob inside card */}
                <div style={{
                  position: "absolute", top: -40, right: -40,
                  width: 200, height: 200,
                  background: "radial-gradient(circle, rgba(0,191,255,0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />

                <div style={{ marginBottom: 28, position: "relative", zIndex: 1 }}>
                  <p style={{ fontSize: 12, color: "#00BFFF", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>PRO</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                    <div className="syne" style={{ fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                      {billingAnnual ? "R$ 399" : "R$ 39,90"}
                    </div>
                    <span style={{ color: "#555", fontSize: 14, marginBottom: 6 }}>
                      /{billingAnnual ? "ano" : "mês"}
                    </span>
                  </div>
                  {billingAnnual && (
                    <p style={{ color: "#00BFFF", fontSize: 12, marginTop: 6 }}>
                      ≈ R$ 33,25/mês — economize R$ 79,80
                    </p>
                  )}
                  {!billingAnnual && (
                    <p style={{ color: "#555", fontSize: 12, marginTop: 6 }}>
                      ou R$ 399/ano
                    </p>
                  )}
                </div>

                <ul style={{ listStyle: "none", marginBottom: 32, display: "flex", flexDirection: "column", gap: 12, position: "relative", zIndex: 1 }}>
                  {proPlan.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#bbb" }}>
                      <div style={{ marginTop: 1, flexShrink: 0 }}>
                        <Check size={14} color="#00BFFF" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-primary"
                  style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 15, position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  onClick={() => navigate("/planos")}
                >
                  Assinar Pro <ChevronRight size={16} />
                </button>

                <p style={{ textAlign: "center", fontSize: 11, color: "#444", marginTop: 14, position: "relative", zIndex: 1 }}>
                  Cancele quando quiser
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 600, height: 300,
          background: "radial-gradient(ellipse, rgba(0,191,255,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <Reveal>
          <p style={{ color: "#00BFFF", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>
            PRONTO PARA COMEÇAR?
          </p>
          <h2 className="syne" style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 20 }}>
            Crie seu primeiro vídeo
            <br />
            <span className="gradient-text">em menos de 5 minutos.</span>
          </h2>
          <p style={{ color: "#555", fontSize: 16, marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
            Sem cartão de crédito. Sem tutorial. Só você, sua música e o resultado.
          </p>
          <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px", display: "inline-flex", alignItems: "center", gap: 10 }} onClick={() => navigate("/cadastro")}>
            Começar Agora — É Grátis <ArrowRight size={18} />
          </button>
        </Reveal>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "40px 24px",
        background: "#060606",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div className="syne" style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8,
              background: "linear-gradient(135deg, #00BFFF, #0070ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Zap size={13} color="#fff" fill="#fff" />
            </div>
            <span className="gradient-text">CanvasSync</span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { label: "Termos de Uso", action: () => navigate("/termos") },
              { label: "Privacidade",   action: () => navigate("/privacidade") },
              { label: "Suporte",       action: () => { setChatOpen(true); setChatTopic(null); } },
              { label: "Contato",       action: () => { window.location.href = "mailto:canvassynclyrics@gmail.com"; } },
            ].map(({ label, action }) => (
              <button key={label} onClick={action}
                style={{ background: "none", border: "none", color: "#444", fontSize: 13, cursor: "pointer", padding: 0, transition: "color 0.2s", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.color = "#888"}
                onMouseLeave={e => e.currentTarget.style.color = "#444"}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "24px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
          <p style={{ color: "#333", fontSize: 12 }}>
            © {new Date().getFullYear()} CanvasSync. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Botão flutuante suporte */}
      <button
        onClick={() => { setChatOpen(o => !o); setChatTopic(null); }}
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#00BFFF,#0070ff)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,191,255,0.4)", transition: "transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {chatOpen ? <X size={22} color="#fff" /> : <MessageSquare size={22} color="#fff" />}
      </button>
      {chatOpen && <SupportChat chatTopic={chatTopic} setChatTopic={setChatTopic} setChatOpen={setChatOpen} />}

      {/* Global keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
