// src/pages/Sucesso.jsx
// Página exibida após pagamento confirmado pelo Stripe

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Sucesso() {
  const [searchParams] = useSearchParams();
  const [status, setStatus]   = useState("loading"); // loading | pix_pending | success | error
  const [plan, setPlan]       = useState("");

  // Verifica status do pagamento via session_id retornado pelo Stripe
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) { setStatus("error"); return; }

    const token = localStorage.getItem("canvassync_token");

    // Consulta o status da assinatura no backend
    fetch(`${API_URL}/payments/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.plan === "pro" && data.status === "active") {
          setPlan(data.subscriptionId ? "monthly" : "annual");
          setStatus("success");
          // Atualiza cache local do usuário
          try {
            const user = JSON.parse(localStorage.getItem("canvassync_user") || "{}");
            user.plan = "pro";
            user.subscriptionStatus = "active";
            localStorage.setItem("canvassync_user", JSON.stringify(user));
          } catch { void 0; }
        } else {
          // PIX pode estar pendente — pagamento ainda não confirmado
          setStatus("pix_pending");
        }
      })
      .catch(() => setStatus("pix_pending"));
  }, [searchParams]);

  // ─── Telas ────────────────────────────────────────────────────────────────
  const containerStyle = {
    minHeight: "100vh",
    background: "#080808",
    color: "#f0f0f0",
    fontFamily: "'DM Sans', 'Poppins', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    textAlign: "center",
  };

  // Loading
  if (status === "loading") {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 40, marginBottom: 20, animation: "spin 1s linear infinite" }}>⚡</div>
        <p style={{ color: "#555", fontSize: 16 }}>Verificando seu pagamento…</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // PIX pendente
  if (status === "pix_pending") {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🏦</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Aguardando confirmação do PIX
        </h1>
        <p style={{ color: "#666", fontSize: 16, maxWidth: 420, lineHeight: 1.7, marginBottom: 32 }}>
          Seu QR Code foi gerado. Assim que o pagamento for confirmado pelo banco,
          seu acesso Pro será ativado <strong style={{ color: "#f0f0f0" }}>automaticamente</strong> — normalmente leva alguns segundos.
        </p>

        <div style={{
          background: "#111", border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: 16, padding: "20px 28px", marginBottom: 32, maxWidth: 380,
        }}>
          <p style={{ fontSize: 13, color: "#888", margin: 0, lineHeight: 1.7 }}>
            💡 Você receberá acesso assim que o Stripe confirmar o pagamento.
            Pode fechar esta janela — o acesso será liberado automaticamente.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => window.location.reload()}
            style={{ background: "#00BFFF", border: "none", borderRadius: 999, padding: "12px 28px", fontWeight: 700, fontSize: 14, color: "#000", cursor: "pointer", boxShadow: "0 6px 20px rgba(0,191,255,0.3)" }}
          >
            Verificar novamente
          </button>
          <button
            onClick={() => window.location.href = "/"}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "12px 28px", fontWeight: 600, fontSize: 14, color: "#888", cursor: "pointer" }}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // Erro
  if (status === "error") {
    return (
      <div style={containerStyle}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>⚠️</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Algo deu errado
        </h1>
        <p style={{ color: "#666", fontSize: 16, maxWidth: 380, lineHeight: 1.7, marginBottom: 32 }}>
          Não conseguimos verificar seu pagamento. Se você realizou o pagamento e
          o problema persistir, entre em contato com o suporte.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => window.location.href = "/planos"}
            style={{ background: "#00BFFF", border: "none", borderRadius: 999, padding: "12px 28px", fontWeight: 700, fontSize: 14, color: "#000", cursor: "pointer" }}
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.href = "/"}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "12px 28px", fontWeight: 600, fontSize: 14, color: "#888", cursor: "pointer" }}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  // ── SUCESSO ────────────────────────────────────────────────────────────────
  return (
    <div style={{ ...containerStyle, position: "relative", overflow: "hidden" }}>
      {/* Glow de fundo */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 300,
        background: "radial-gradient(ellipse, rgba(0,191,255,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Ícone animado */}
      <div style={{
        width: 90, height: 90, borderRadius: "50%",
        background: "rgba(0,191,255,0.1)", border: "2px solid rgba(0,191,255,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 40, marginBottom: 28,
        boxShadow: "0 0 40px rgba(0,191,255,0.2)",
        animation: "popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
      }}>
        ✅
      </div>

      <h1 style={{
        fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
        marginBottom: 14, letterSpacing: "-1px",
        animation: "fadeUp 0.5s ease 0.1s both",
      }}>
        Bem-vindo ao Pro! 🎉
      </h1>

      <p style={{
        color: "#666", fontSize: 17, maxWidth: 440, lineHeight: 1.7,
        marginBottom: 36,
        animation: "fadeUp 0.5s ease 0.2s both",
      }}>
        Seu acesso foi ativado com sucesso. Agora você tem tudo que precisa para
        criar <strong style={{ color: "#f0f0f0" }}>lyric videos profissionais</strong> sem limitações.
      </p>

      {/* Card de benefícios */}
      <div style={{
        background: "#111", border: "1px solid rgba(0,191,255,0.2)",
        borderRadius: 20, padding: "24px 32px", marginBottom: 36,
        maxWidth: 420, width: "100%", textAlign: "left",
        animation: "fadeUp 0.5s ease 0.3s both",
        boxShadow: "0 0 40px rgba(0,191,255,0.05)",
      }}>
        <p style={{ fontSize: 12, color: "#00BFFF", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16, marginTop: 0 }}>
          O que você desbloqueou
        </p>
        {[
          "Exportação de vídeo completo (WEBM + áudio)",
          "Sincronização de letras em tempo real",
          "Textos e imagens ilimitados",
          "Sem marca d'água",
          "Suporte prioritário",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ color: "#00BFFF", fontSize: 14, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 14, color: "#aaa" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        animation: "fadeUp 0.5s ease 0.4s both",
      }}>
        <button
          onClick={() => window.location.href = "/editor"}
          style={{
            background: "#00BFFF", border: "none", borderRadius: 999,
            padding: "14px 36px", fontWeight: 700, fontSize: 15, color: "#000",
            cursor: "pointer", boxShadow: "0 8px 24px rgba(0,191,255,0.35)",
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          Abrir o Editor Pro ⚡
        </button>
        <button
          onClick={() => window.location.href = "/"}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 999, padding: "14px 28px", fontWeight: 600, fontSize: 15,
            color: "#888", cursor: "pointer",
          }}
        >
          Voltar ao início
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
