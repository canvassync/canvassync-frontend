import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, LangToggle } from "./hooks/useLanguage.jsx";
import {
  Play, Zap, Download, Layers, Star, Check, ChevronRight,
  Music, Image, Sparkles, ArrowRight, Menu, X,
  MessageSquare, Bot, Volume2, Film, Wand2, Sticker
} from "lucide-react";


function SupportChat({ chatTopic, setChatTopic, setChatOpen }) {
  const { t } = useLanguage();
  const faqs = [
    { q: t("chat_faq1_q"), a: t("chat_faq1_a") },
    { q: t("chat_faq2_q"), a: t("chat_faq2_a") },
    { q: t("chat_faq3_q"), a: t("chat_faq3_a") },
    { q: t("chat_faq4_q"), a: t("chat_faq4_a") },
    { q: t("chat_faq5_q"), a: t("chat_faq5_a") },
  ];
  return (
    <div style={{ position: "fixed", bottom: 88, right: 24, zIndex: 9998, width: 340, borderRadius: 18, background: "#111", border: "1px solid rgba(0,191,255,0.2)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)", overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", background: "linear-gradient(135deg,rgba(0,191,255,0.15),rgba(0,112,255,0.1))", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#00BFFF,#0070ff)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Bot size={17} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0" }}>{t("chat_title")}</div>
          <div style={{ fontSize: 11, color: "#00BFFF" }}>{t("chat_subtitle")}</div>
        </div>
        {chatTopic !== null && (
          <button onClick={() => setChatTopic(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}>←</button>
        )}
        <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>✕</button>
      </div>
      <div style={{ padding: 14, maxHeight: 360, overflowY: "auto" }}>
        {chatTopic === null ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{t("chat_subtitle")}</p>
            {faqs.map((item, i) => (
              <button key={i} onClick={() => setChatTopic(i)}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", color: "#ccc", fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit", width: "100%" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,191,255,0.3)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#ccc"; }}>
                {item.q}
              </button>
            ))}
            <a href="mailto:canvassynclyrics@gmail.com" style={{ marginTop: 4, background: "rgba(0,191,255,0.08)", border: "1px solid rgba(0,191,255,0.2)", borderRadius: 12, padding: "10px 14px", color: "#00BFFF", fontSize: 13, textAlign: "center", textDecoration: "none", display: "block" }}>
              ✉️ canvassynclyrics@gmail.com
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
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTopic, setChatTopic] = useState(null);

  // ── PWA Install ──────────────────────────────────────────────────────────────
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  useEffect(() => {
    const handler = e => { e.preventDefault(); setPwaPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setPwaInstalled(true); setPwaPrompt(null); });
    if (window.matchMedia('(display-mode: standalone)').matches) setPwaInstalled(true);
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handlePwaInstall = async () => {
    if (!pwaPrompt) return;
    await pwaPrompt.prompt();
    const { outcome } = await pwaPrompt.userChoice;
    if (outcome === 'accepted') { setPwaInstalled(true); setPwaPrompt(null); }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { icon: <Music size={22} />,    title: t("feat1_title"), desc: t("feat1_desc") },
    { icon: <Film size={22} />,     title: t("feat2_title"), desc: t("feat2_desc") },
    { icon: <Layers size={22} />,   title: t("feat3_title"), desc: t("feat3_desc") },
    { icon: <Zap size={22} />,      title: t("feat4_title"), desc: t("feat4_desc") },
    { icon: <Volume2 size={22} />,  title: t("feat5_title"), desc: t("feat5_desc") },
    { icon: <Sparkles size={22} />, title: t("feat6_title"), desc: t("feat6_desc") },
    { icon: <Wand2 size={22} />,    title: t("feat7_title"), desc: t("feat7_desc") },
    { icon: <Sticker size={22} />,  title: t("feat8_title"), desc: t("feat8_desc") },
    { icon: <Image size={22} />,    title: t("feat9_title"), desc: t("feat9_desc") },
  ];

  const freePlan = [
    t("free_feat1"), t("free_feat2"), t("free_feat3"), t("free_feat4"), t("free_feat5"),
  ];

  const proPlan = [
    t("pro_feat1"), t("pro_feat2"), t("pro_feat3"), t("pro_feat4"),
    t("pro_feat5"), t("pro_feat6"), t("pro_feat7"), t("pro_feat8"),
    t("pro_feat9"), t("pro_feat10"), t("pro_feat11"), t("pro_feat12"),
  ];

  const testimonials = [
    { name: t("test1_name"), role: t("test1_role"), text: t("test1_text"), stars: 5 },
    { name: t("test2_name"), role: t("test2_role"), text: t("test2_text"), stars: 5 },
    { name: t("test3_name"), role: t("test3_role"), text: t("test3_text"), stars: 5 },
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
          .formats-grid { grid-template-columns: repeat(2, 1fr) !important; }
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
            onMouseLeave={e => e.target.style.color = "#999"}>{t("nav_features")}</a>
          <a href="#pricing" style={{ color: "#999", fontSize: 14, textDecoration: "none", padding: "8px 14px", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "#999"}>{t("nav_plans")}</a>
          <LangToggle />
          {pwaPrompt && !pwaInstalled && (
            <button onClick={handlePwaInstall}
              title="Instalar CanvasSync como aplicativo"
              style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:8, background:'rgba(0,191,255,0.1)', border:'1px solid rgba(0,191,255,0.35)', cursor:'pointer', color:'#00BFFF', fontSize:12, fontWeight:700, whiteSpace:'nowrap', marginLeft:4 }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(0,191,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(0,191,255,0.1)'}
            >⬇ Instalar App</button>
          )}
          <button className="btn-ghost" style={{ marginLeft: 8 }} onClick={() => navigate("/entrar")}>{t("nav_signin")}</button>
          <button className="btn-primary" onClick={() => navigate("/cadastro")}>{t("nav_start")}</button>
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
          <a href="#features" style={{ color: "#ccc", textDecoration: "none", fontSize: 15, padding: "8px 0" }} onClick={() => setMenuOpen(false)}>{t("nav_features")}</a>
          <a href="#pricing" style={{ color: "#ccc", textDecoration: "none", fontSize: 15, padding: "8px 0" }} onClick={() => setMenuOpen(false)}>{t("nav_plans")}</a>
          <button className="btn-ghost" style={{ width: "100%", marginTop: 4 }} onClick={() => navigate("/entrar")}>{t("nav_signin")}</button>
          <button className="btn-primary" style={{ width: "100%", padding: "14px 24px" }} onClick={() => navigate("/cadastro")}>{t("nav_start")}</button>
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
            {t("hero_badge")}
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
            <span className="gradient-text">{t("hero_title1")}</span>
            <br />
            <span style={{ color: "#fff" }}>{t("hero_title2")}</span>
            <br />
            <span style={{ color: "#00BFFF" }}>{t("hero_title3")}</span>
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
            {t("hero_sub").split(t("hero_sub_bold"))[0]}
            <strong style={{ color: "#bbb", fontWeight: 500 }}>{t("hero_sub_bold")}</strong>.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
            animation: "fadeInUp 0.7s ease 0.3s both",
          }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: "14px 32px", display: "flex", alignItems: "center", gap: 8 }} onClick={() => navigate("/cadastro")}>
              {t("hero_cta_primary")} <ArrowRight size={16} />
            </button>
            <button className="btn-ghost" style={{ fontSize: 15, padding: "14px 28px", display: "flex", alignItems: "center", gap: 8 }}
              onClick={() => document.getElementById("demo-video")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
              <Play size={14} fill="currentColor" /> {t("hero_cta_demo")}
            </button>
          </div>

          {/* Trust micro-copy */}
          <p style={{ marginTop: 18, fontSize: 12, color: "#555" }}>
            {t("hero_trust")}
          </p>
        </div>
      </section>

      {/* ═══ VIDEO CONTAINER ════════════════════════════════════════════════ */}
      <section id="demo-video" style={{ padding: "0 24px 100px", position: "relative" }}>
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

              {/* YouTube embed */}
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                <iframe
                  src="https://www.youtube.com/embed/a5ZmRz9gVRA?rel=0&modestbranding=1&color=white"
                  title="CanvasSync Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%",
                    border: "none",
                  }}
                />
              </div>
              <div style={{ display: "none" }}>CanvasSync Demo
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
              { value: 170, suffix: "",  label: "Trilhas musicais" },
              { value: 68,  suffix: "",  label: "Efeitos sonoros" },
              { value: 24,  suffix: "",  label: "Templates prontos" },
              { value: 4,   suffix: "",  label: "Formatos de export" },
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
                {t("features_label")}
              </p>
              <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px" }}>
                {t("features_title1")}{" "}
                <span className="gradient-text">{t("features_title2")}</span>
              </h2>
              <p style={{ color: "#666", marginTop: 16, fontSize: 16, maxWidth: 480, margin: "16px auto 0" }}>
                {t("features_sub")}
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


      {/* ═══ EFEITOS DE TELA ═════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
              {t("fx_section_label")}
            </p>
            <h2 className="syne" style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-1px" }}>
              {t("fx_section_title")}
            </h2>
            <p style={{ color: "#666", marginTop: 16, fontSize: 16, lineHeight: 1.7 }}>
              {t("fx_section_sub")}
            </p>
            <p style={{ color: "#555", fontSize: 13, marginTop: 28 }}>{t("fx_section_cta")}</p>
          </Reveal>
        </div>
      </section>


      {/* ═══ NOVIDADES PRO ═══════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: "#060606" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                {t("new_features_label")}
              </p>
              <h2 className="syne" style={{ fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-1px" }}>
                {t("new_features_title")}
              </h2>
              <p style={{ color: "#666", marginTop: 16, fontSize: 16, maxWidth: 520, margin: "16px auto 0" }}>
                {t("new_features_sub")}
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>

            {/* Trilhas */}
            <Reveal delay={0}>
              <div style={{ background: "linear-gradient(135deg,#0d0a1f,#12083a)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 20, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎼</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c4b5fd", marginBottom: 6 }}>{t("new_feat_trilhas_title")}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{t("new_feat_trilhas_desc")}</p>
                </div>
              </div>
            </Reveal>

            {/* SFX */}
            <Reveal delay={80}>
              <div style={{ background: "linear-gradient(135deg,#0a1a0a,#0d2a0a)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🔊</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#6ee7b7", marginBottom: 6 }}>{t("new_feat_sfx_title")}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{t("new_feat_sfx_desc")}</p>
                </div>
              </div>
            </Reveal>

            {/* Zoom Animado / Keyframes */}
            <Reveal delay={160}>
              <div style={{ background: "linear-gradient(135deg,#0a1020,#0d1a35)", border: "1px solid rgba(0,191,255,0.2)", borderRadius: 20, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(0,191,255,0.1)", border: "1px solid rgba(0,191,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎬</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#7dd3fc", marginBottom: 6 }}>{t("new_feat_zoom_title")}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{t("new_feat_zoom_desc")}</p>
                </div>
              </div>
            </Reveal>

            {/* Cor & Curvas */}
            <Reveal delay={240}>
              <div style={{ background: "linear-gradient(135deg,#1a1200,#2a1a00)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 20, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎨</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fbbf24", marginBottom: 6 }}>{t("new_feat_color_title")}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{t("new_feat_color_desc")}</p>
                </div>
              </div>
            </Reveal>

            {/* Narração TTS */}
            <Reveal delay={320}>
              <div style={{ background: "linear-gradient(135deg,#1a0a1a,#2a0a2a)", border: "1px solid rgba(244,114,182,0.2)", borderRadius: 20, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎙️</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f9a8d4", marginBottom: 6 }}>Narração com IA</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>Gere narração em português ou inglês com vozes realistas diretamente no editor. Áudio cai automaticamente na timeline. Powered by ElevenLabs.</p>
                </div>
              </div>
            </Reveal>

            {/* Sincronização Automática */}
            <Reveal delay={400}>
              <div style={{ background: "linear-gradient(135deg,#0a0d1f,#0d1535)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 20, padding: "28px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🤖</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#c4b5fd", marginBottom: 6 }}>Sincronização Automática com IA</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>Cole a letra, carregue a música e deixe a IA sincronizar tudo. O Whisper analisa o áudio e posiciona cada frase no tempo exato. Acabou o trabalho manual. Powered by Groq.</p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ═══ CANVAS FORMATS ══════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px", background: "#060606" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p style={{ color: "#00BFFF", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                {t("formats_label")}
              </p>
              <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px" }}>
                {t("formats_title1")}{" "}
                <span className="gradient-text">{t("formats_title2")}</span>
              </h2>
              <p style={{ color: "#666", marginTop: 16, fontSize: 16, maxWidth: 480, margin: "16px auto 0" }}>
                {t("formats_sub")}
              </p>
            </div>
          </Reveal>

          <div className="formats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { ratio: "16:9", label: "YouTube", sub: "1280 × 720", color: "#ff0000", icon: "▶", w: 80, h: 45 },
              { ratio: "9:16", label: "Stories / TikTok", sub: "720 × 1280", color: "#00e5ff", icon: "📱", w: 40, h: 71 },
              { ratio: "1:1",  label: "Instagram Feed", sub: "1080 × 1080", color: "#c084fc", icon: "⊞", w: 60, h: 60 },
              { ratio: "4:3",  label: "Broadcast / TV", sub: "1280 × 960", color: "#fbbf24", icon: "📺", w: 72, h: 54 },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card" style={{ textAlign: "center", padding: "28px 20px", cursor: "default" }}>
                  {/* Canvas mockup */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, height: 90, alignItems: "center" }}>
                    <div style={{
                      width: f.w, height: f.h,
                      borderRadius: 6,
                      background: "linear-gradient(135deg, #0d0d0d, #181818)",
                      border: `1.5px solid ${f.color}44`,
                      boxShadow: `0 0 18px ${f.color}22`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      position: "relative", overflow: "hidden",
                    }}>
                      {/* fake lyric lines */}
                      <div style={{ position: "absolute", width: "70%", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                        <div style={{ height: 2, width: "100%", background: `${f.color}66`, borderRadius: 2 }} />
                        <div style={{ height: 2, width: "70%", background: `${f.color}33`, borderRadius: 2 }} />
                      </div>
                      {/* glow dot */}
                      <div style={{ position: "absolute", top: 4, right: 4, width: 4, height: 4, borderRadius: "50%", background: f.color, boxShadow: `0 0 6px ${f.color}` }} />
                    </div>
                  </div>

                  <div className="syne" style={{ fontSize: 22, fontWeight: 800, color: f.color, marginBottom: 6, letterSpacing: "-0.5px" }}>
                    {f.ratio}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc", marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace" }}>{f.sub}</div>
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
                {t("pricing_label")}
              </p>
              <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 24 }}>
                {t("pricing_title1")} <span className="gradient-text">{t("pricing_title2")}</span>
              </h2>

              {/* Billing toggle */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="pricing-toggle">
                  <span style={{ fontSize: 13, color: billingAnnual ? "#555" : "#ddd", fontWeight: 500 }}>{t("billing_monthly")}</span>
                  <div
                    className={`toggle-pill ${billingAnnual ? "on" : ""}`}
                    onClick={() => setBillingAnnual(!billingAnnual)}
                    style={{ background: billingAnnual ? "#00BFFF" : "rgba(0,191,255,0.15)" }}
                  >
                    <div className={`toggle-thumb ${billingAnnual ? "on" : ""}`} />
                  </div>
                  <span style={{ fontSize: 13, color: billingAnnual ? "#ddd" : "#555", fontWeight: 500 }}>{t("billing_annual")}</span>
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
                  <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>{t("free_forever")}</p>
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
                  {t("free_cta")}
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
                      /{billingAnnual ? t("pro_per_year").replace("/","") : t("pro_per_month").replace("/","")}
                    </span>
                  </div>
                  {billingAnnual && (
                    <p style={{ color: "#00BFFF", fontSize: 12, marginTop: 6 }}>
                      {t("pro_annual_note")}
                    </p>
                  )}
                  {!billingAnnual && (
                    <p style={{ color: "#555", fontSize: 12, marginTop: 6 }}>
                      {t("pro_monthly_note")}
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
                  {t("pro_cta")} <ChevronRight size={16} />
                </button>

                <p style={{ textAlign: "center", fontSize: 11, color: "#444", marginTop: 14, position: "relative", zIndex: 1 }}>
                  {t("pro_cancel")}
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
            {t("cta_label")}
          </p>
          <h2 className="syne" style={{ fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 20 }}>
            {t("cta_title1")}
            <br />
            <span className="gradient-text">{t("cta_title2")}</span>
          </h2>
          <p style={{ color: "#555", fontSize: 16, marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
            {t("cta_sub")}
          </p>
          <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px", display: "inline-flex", alignItems: "center", gap: 10 }} onClick={() => navigate("/cadastro")}>
            {t("cta_btn")} <ArrowRight size={18} />
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
              { label: t("footer_terms"),   action: () => navigate("/termos") },
              { label: t("footer_privacy"), action: () => navigate("/privacidade") },
              { label: t("footer_support"), action: () => { setChatOpen(true); setChatTopic(null); } },
              { label: t("footer_contact"), action: () => { window.location.href = "mailto:canvassynclyrics@gmail.com"; } },
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
            © {new Date().getFullYear()} CanvasSync. {t("footer_rights")}
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
