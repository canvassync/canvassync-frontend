import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";

export default function Termos() {
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
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Termos de Uso</h1>
        <p style={{ color: "#555", fontSize: 13, marginBottom: 48 }}>Última atualização: março de 2026</p>
        {[
          ["1. Aceitação", "Ao usar o CanvasSync você concorda com estes termos. Se não concordar, não utilize o serviço."],
          ["2. Uso Permitido", "O CanvasSync é destinado à criação de conteúdo visual para fins pessoais e comerciais legítimos. É proibido usar a plataforma para criar conteúdo que viole direitos autorais, seja difamatório, ilegal ou prejudicial."],
          ["3. Conteúdo do Usuário", "Você é responsável por todo conteúdo (áudio, imagem, vídeo e texto) que inserir na plataforma. O CanvasSync não se responsabiliza pelo uso indevido de material protegido por direitos autorais."],
          ["4. Planos e Pagamentos", "Os planos pagos são cobrados conforme descrito na página de preços. Cancelamentos podem ser realizados a qualquer momento, sem multa, mas sem reembolso proporcional do período em curso."],
          ["5. Disponibilidade", "Nos esforçamos para manter o serviço disponível 24/7, mas não garantimos disponibilidade ininterrupta. Manutenções programadas serão comunicadas com antecedência."],
          ["6. Limitação de Responsabilidade", "O CanvasSync é fornecido como está. Não nos responsabilizamos por danos indiretos, lucros cessantes ou perda de dados resultantes do uso da plataforma."],
          ["7. Alterações", "Podemos atualizar estes termos a qualquer momento. O uso continuado do serviço após as alterações implica aceitação dos novos termos."],
          ["8. Contato", null],
        ].map(([title, text]) => (
          <div key={title} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#00BFFF", marginBottom: 12 }}>{title}</h2>
            {text
              ? <p style={{ color: "#777", fontSize: 14, lineHeight: 1.8 }}>{text}</p>
              : <p style={{ color: "#777", fontSize: 14, lineHeight: 1.8 }}>Dúvidas sobre os termos: <a href="mailto:canvassynclyrics@gmail.com" style={{ color: "#00BFFF" }}>canvassynclyrics@gmail.com</a></p>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
