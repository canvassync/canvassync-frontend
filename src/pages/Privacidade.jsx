import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";

export default function Privacidade() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Voltar
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "linear-gradient(135deg,#00BFFF,#0070ff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={13} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, background: "linear-gradient(135deg,#fff 30%,#00BFFF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>CanvasSync</span>
        </div>
      </div>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Política de Privacidade</h1>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 48 }}>Última atualização: março de 2026</p>
        {[
          ["Dados Coletados", "Coletamos nome, e-mail e dados de uso para fornecer e melhorar o serviço. Não vendemos seus dados a terceiros."],
          ["Autenticação", "Oferecemos login via Google OAuth. Neste caso, recebemos apenas nome, e-mail e foto de perfil públicos da sua conta Google."],
          ["Pagamentos", "Pagamentos são processados pelo Stripe. Não armazenamos dados de cartão de crédito em nossos servidores."],
          ["Conteúdo Criado", "Áudios, imagens e vídeos que você carrega são processados localmente no seu navegador para criação do vídeo final. Não armazenamos seu conteúdo em nossos servidores."],
          ["Cookies", "Usamos cookies essenciais para manter sua sessão ativa. Não usamos cookies de rastreamento de terceiros."],
          ["Retenção de Dados", "Seus dados são mantidos enquanto sua conta estiver ativa. Após o cancelamento, excluímos seus dados em até 30 dias."],
          ["Seus Direitos", null],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#00BFFF", marginBottom: 12 }}>{title}</h2>
            {text
              ? <p style={{ color: "#777", fontSize: 14, lineHeight: 1.8 }}>{text}</p>
              : <p style={{ color: "#777", fontSize: 14, lineHeight: 1.8 }}>Solicite exclusão da conta e dados: <a href="mailto:canvassynclyrics@gmail.com" style={{ color: "#00BFFF" }}>canvassynclyrics@gmail.com</a></p>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
