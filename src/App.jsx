import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from './hooks/useAuth.jsx';
import { useLanguage, LangToggle } from './hooks/useLanguage.jsx';

// ── Chat de Suporte IA — Editor Pro ──────────────────────────────────────────
function SupportChat({ chatTopic, setChatTopic, setChatOpen }) {
  const faqs = [
    {
      q: '🎵 Como sincronizar a letra?',
      a: 'Cole a letra no painel esquerdo (uma frase por linha) e clique em ▶ Play. No ritmo de cada frase, pressione ⚡ MARCAR AGORA. A frase entra na timeline. Você pode arrastar ou redimensionar cada bloco depois.',
    },
    {
      q: '🖼️ Como adicionar e editar imagens?',
      a: 'Clique em "Imagens" no header para fazer upload. A imagem aparece no canvas — clique para selecionar, arraste para mover e use as alças dos cantos para redimensionar. No painel lateral: Rotação e Filtros (Brilho, Contraste, Neon, P&B…).',
    },
    {
      q: '🎬 Como adicionar e editar vídeos?',
      a: 'Clique em "Vídeos" no header e escolha o arquivo. O vídeo entra no canvas e na timeline. Clique para selecionar → arraste para mover → alças para redimensionar. No painel lateral: Rotação, Filtros e Transições. Na timeline arraste as bordas para cortar.',
    },
    {
      q: '🎨 Como usar Filtros e Transições?',
      a: 'Selecione uma imagem ou vídeo no canvas. No painel lateral surgem 10 presets de filtro (Cinema, Neon, Vintage…) e 8 sliders finos. Abaixo ficam as Transições — escolha Entrada e Saída independentes (Fade, Zoom, Bounce, Elástico…) e ajuste a duração.',
    },
    {
      q: '✨ Como usar Templates?',
      a: 'Clique em 🎨 Templates no header. Filtre por formato (9:16, 16:9, 1:1, 4:3) e clique em "Usar template". Fontes, cores, textos e layout são aplicados automaticamente — suas mídias (fundo, áudio, vídeos) não são alteradas.',
    },
    {
      q: '🔊 Como adicionar Efeitos Sonoros?',
      a: 'Clique em 🔊 Efeitos no header. Pause o vídeo na posição desejada e clique num dos 24 efeitos. Ele aparece na lista "Colocados no Vídeo" com slider de volume. Os efeitos são incluídos no export final.',
    },
    {
      q: '✨ Como usar Stickers e Emojis?',
      a: 'Clique em ✨ Stickers no header. Aba Emojis: 120 opções. Aba Animados: 32 stickers (bounce, pulse, spin…). Clique no sticker no canvas para selecionar — barra de tamanho aparece na base. Arraste para mover, botão direito para remover.',
    },
    {
      q: '💾 Como exportar o vídeo?',
      a: 'Escolha o formato: WEBM + Áudio (recomendado), MP4 + Áudio, HD 1080p WEBM ou HD 1080p MP4. Clique em 💾 Salvar Vídeo. A barra de progresso mostra o andamento — não feche a aba. O arquivo é baixado automaticamente.',
    },
    {
      q: '✏️ Como adicionar Textos Extras?',
      a: 'No painel lateral em "✏️ TEXTOS EXTRAS", digite e clique +. Escolha cor, fonte e tamanho. Ative Sombra ou Gradiente para efeitos. No canvas: arraste para mover, círculo roxo para girar, botão direito para remover.',
    },
    {
      q: '📦 Como salvar e carregar o projeto?',
      a: 'Use 📦 Exportar Projeto para salvar um JSON com todo o estado (mídias, letras, stickers, efeitos). Use 📂 Importar Projeto para recarregar. O projeto também é auto-salvo no navegador a cada 500ms.',
    },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 88, right: 24, zIndex: 9998, width: 360, borderRadius: 18, background: '#111', border: '1px solid rgba(0,191,255,0.2)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '75vh' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg,rgba(0,191,255,0.15),rgba(0,112,255,0.1))', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#00BFFF,#0070ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 15 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f0f0' }}>Suporte CanvasSync Pro</div>
          <div style={{ fontSize: 11, color: '#00BFFF' }}>Selecione um tópico para ajuda</div>
        </div>
        {chatTopic !== null && (
          <button onClick={() => setChatTopic(null)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}>←</button>
        )}
        <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}>✕</button>
      </div>
      {/* Body */}
      <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
        {chatTopic === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>Como posso ajudar?</p>
            {faqs.map((item, i) => (
              <button key={i} onClick={() => setChatTopic(i)}
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '9px 13px', color: '#ccc', fontSize: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,191,255,0.35)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(0,191,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                {item.q}
              </button>
            ))}
            <a href="mailto:canvassynclyrics@gmail.com" style={{ marginTop: 6, background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', borderRadius: 12, padding: '9px 13px', color: '#00BFFF', fontSize: 12, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              ✉️ Enviar e-mail para o suporte
            </a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'rgba(0,191,255,0.07)', border: '1px solid rgba(0,191,255,0.18)', borderRadius: 14, padding: '14px' }}>
              <p style={{ fontSize: 12, color: '#00BFFF', fontWeight: 700, marginBottom: 10 }}>{faqs[chatTopic].q}</p>
              <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.65 }}>{faqs[chatTopic].a}</p>
            </div>
            <button onClick={() => setChatTopic(null)}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 0', fontSize: 12, color: '#888', cursor: 'pointer', fontFamily: 'inherit' }}>
              ← Ver todos os tópicos
            </button>
            <a href="mailto:canvassynclyrics@gmail.com" style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', borderRadius: 12, padding: '9px 13px', color: '#00BFFF', fontSize: 12, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
              ✉️ canvassynclyrics@gmail.com
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dados de Stickers / Emojis / GIFs ────────────────────────────────────────
const EMOJI_LIST = [
  // ── Setas (sem animação) ──────────────────────────────────────────────────
  ['⬆️','⬇️','⬅️','➡️','↗️','↘️','↙️','↖️','↔️','↕️','↩️','↪️'],
  ['🔄','⏫','⏬','⏩','⏪','⏭️','⏮️','🔃','🔁','🔂','▶️','◀️'],
  ['👉','👈','👆','👇','☝️','🫵','👍','👎','✅','❌','⭕','❓'],
  // ── Originais ─────────────────────────────────────────────────────────────
  ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💕','💞','💓','💗'],
  ['🔥','⭐','🌟','💫','✨','💥','🎉','🎊','🎈','🎀','🎁','🏅'],
  ['😂','😍','🥳','😎','🤩','😘','🤣','😜','🥰','🫶','😆','🤪'],
  ['👑','💎','🏆','🎸','🎤','🎬','🎯','🎲','🎨','🎭','🎪','🃏'],
  ['🌈','🌊','⚡','🌙','☀️','❄️','🌸','🍀','🌺','🌻','🌹','🍄'],
  ['💯','🔑','💪','🙌','👏','✌️','🤟','🤙','💰','💸','🔮','🧿'],
  ['🐉','🦄','🦊','🦁','🐺','🦅','🐙','🦈','🐯','🦋','🦚','🦜'],
  ['🍕','🎂','🍦','🍭','🍾','🥂','🧁','🍫','🍬','🍒','🍓','🫐'],
  ['🚀','✈️','🏎️','⚽','🏀','🎮','🎵','🎶','📸','📱','💻','🕹️'],
  ['🌍','🏔️','🏖️','🌅','🌃','🌆','🗼','🗽','🏯','🎠','🎡','🎢'],
];

const ANIMATED_STICKERS = [
  // ── Setas ──────────────────────────────────────────────────────────────────
  { key:'arrow_up',       emoji:'⬆️',  anim:'bounce', label:'↑ Cima'       },
  { key:'arrow_down',     emoji:'⬇️',  anim:'bounce', label:'↓ Baixo'      },
  { key:'arrow_left',     emoji:'⬅️',  anim:'bounce', label:'← Esquerda'   },
  { key:'arrow_right',    emoji:'➡️',  anim:'bounce', label:'→ Direita'    },
  { key:'arrow_ne',       emoji:'↗️',  anim:'float',  label:'↗ Diagonal'   },
  { key:'arrow_nw',       emoji:'↖️',  anim:'float',  label:'↖ Diagonal'   },
  { key:'arrow_se',       emoji:'↘️',  anim:'float',  label:'↘ Diagonal'   },
  { key:'arrow_sw',       emoji:'↙️',  anim:'float',  label:'↙ Diagonal'   },
  { key:'arrow_lr',       emoji:'↔️',  anim:'pulse',  label:'↔ Horizontal' },
  { key:'arrow_ud',       emoji:'↕️',  anim:'pulse',  label:'↕ Vertical'   },
  { key:'arrow_curve_r',  emoji:'↩️',  anim:'spin',   label:'↩ Volta'      },
  { key:'arrow_curve_l',  emoji:'↪️',  anim:'spin',   label:'↪ Volta'      },
  { key:'arrow_loop',     emoji:'🔄',  anim:'spin',   label:'🔄 Loop'       },
  { key:'arrow_dbl_up',   emoji:'⏫',  anim:'bounce', label:'⏫ Rápido ↑'   },
  { key:'arrow_dbl_down', emoji:'⏬',  anim:'bounce', label:'⏬ Rápido ↓'   },
  { key:'pointing_right', emoji:'👉',  anim:'bounce', label:'👉 Aponta →'   },
  { key:'pointing_left',  emoji:'👈',  anim:'bounce', label:'👈 Aponta ←'   },
  { key:'pointing_up',    emoji:'👆',  anim:'bounce', label:'👆 Aponta ↑'   },
  { key:'pointing_down',  emoji:'👇',  anim:'bounce', label:'👇 Aponta ↓'   },
  // ── Stickers originais ────────────────────────────────────────────────────
  { key:'fire',      emoji:'🔥', anim:'bounce', label:'Fogo'      },
  { key:'star',      emoji:'⭐', anim:'spin',   label:'Estrela'   },
  { key:'heart',     emoji:'❤️', anim:'pulse',  label:'Coração'   },
  { key:'party',     emoji:'🎉', anim:'shake',  label:'Festa'     },
  { key:'sparkle',   emoji:'✨', anim:'float',  label:'Brilho'    },
  { key:'crown',     emoji:'👑', anim:'bounce', label:'Coroa'     },
  { key:'music',     emoji:'🎵', anim:'pulse',  label:'Música'    },
  { key:'rainbow',   emoji:'🌈', anim:'float',  label:'Arco-íris' },
  { key:'lightning', emoji:'⚡', anim:'spin',   label:'Raio'      },
  { key:'diamond',   emoji:'💎', anim:'pulse',  label:'Diamante'  },
  { key:'rocket',    emoji:'🚀', anim:'float',  label:'Foguete'   },
  { key:'dragon',    emoji:'🐉', anim:'bounce', label:'Dragão'    },
  { key:'trophy',    emoji:'🏆', anim:'shake',  label:'Troféu'    },
  { key:'unicorn',   emoji:'🦄', anim:'bounce', label:'Unicórnio' },
  { key:'explosion', emoji:'💥', anim:'pulse',  label:'Explosão'  },
  { key:'confetti',  emoji:'🎊', anim:'shake',  label:'Confete'   },
  { key:'money',     emoji:'💰', anim:'bounce', label:'Dinheiro'  },
  { key:'mic',       emoji:'🎤', anim:'pulse',  label:'Microfone' },
  { key:'camera',    emoji:'📸', anim:'shake',  label:'Câmera'    },
  { key:'clapper',   emoji:'🎬', anim:'bounce', label:'Claquete'  },
  { key:'notes',     emoji:'🎶', anim:'float',  label:'Notas'     },
  { key:'sunflower', emoji:'🌻', anim:'spin',   label:'Girassol'  },
  { key:'butterfly', emoji:'🦋', anim:'float',  label:'Borboleta' },
  { key:'crystal',   emoji:'🔮', anim:'pulse',  label:'Cristal'   },
  { key:'target',    emoji:'🎯', anim:'spin',   label:'Alvo'      },
  { key:'alien',     emoji:'👽', anim:'float',  label:'Alien'     },
  { key:'ghost',     emoji:'👻', anim:'bounce', label:'Fantasma'  },
  { key:'skull',     emoji:'💀', anim:'shake',  label:'Caveira'   },
  { key:'angel',     emoji:'😇', anim:'float',  label:'Anjo'      },
  { key:'devil',     emoji:'😈', anim:'pulse',  label:'Diabo'     },
  { key:'hundred',   emoji:'💯', anim:'bounce', label:'100'       },
  { key:'flex',      emoji:'💪', anim:'pulse',  label:'Força'     },
];

const getStickerAnimTransform = (anim, t, size) => {
  switch (anim) {
    case 'bounce': return { dy: Math.sin(t * 5) * size * 0.12, s: 1, r: 0, a: 1 };
    case 'pulse':  return { dy: 0, s: 1 + Math.sin(t * 3.5) * 0.18, r: 0, a: 1 };
    case 'spin':   return { dy: 0, s: 1, r: t * 1.8, a: 1 };
    case 'shake':  return { dy: 0, s: 1, r: Math.sin(t * 9) * 0.25, a: 1 };
    case 'float':  return { dy: Math.sin(t * 2) * size * 0.08, s: 1, r: 0, a: 0.82 + Math.sin(t * 2.5) * 0.18 };
    default:       return { dy: 0, s: 1, r: 0, a: 1 };
  }
};

// ── Efeitos Sonoros — biblioteca local /public/sfx/ ──────────────────────────
const SFX_CATS = [
  {
    cat: '🌊 Ambiente', color: '#00BFFF',
    items: [
      { key:'vento_rapido',   emoji:'💨', name:'Vento Rápido',   file:'2- Vento Rápido.mp3' },
      { key:'vento_rapido2',  emoji:'💨', name:'Vento Rápido 2', file:'3- Vento Rápido 2.mp3' },
      { key:'vento_lento',    emoji:'🌬️', name:'Vento Lento',    file:'4- Vento Lento.mp3' },
      { key:'gota',           emoji:'💧', name:'Gota',           file:'23- Gota.mp3' },
      { key:'agua1',          emoji:'🌊', name:'Água 1',         file:'34- Água 1.mp3' },
      { key:'agua2',          emoji:'🌊', name:'Água 2',         file:'35- Água 2.mp3' },
      { key:'grilo',          emoji:'🦗', name:'Grilo',          file:'22- Grilo.mp3' },
      { key:'grilos',         emoji:'🦗', name:'Grilos',         file:'60- Grilos.mp3' },
    ],
  },
  {
    cat: '⚡ Ação', color: '#f59e0b',
    items: [
      { key:'arma1',          emoji:'🔫', name:'Arma 1',         file:'10 - Arma 1.mp3' },
      { key:'arma2',          emoji:'🔫', name:'Arma 2',         file:'11 - Arma 2.mp3' },
      { key:'pulo',           emoji:'🦘', name:'Pulo',           file:'16- Pulo.mp3' },
      { key:'chicote',        emoji:'⚡', name:'Chicote',        file:'37- Chicote.mp3' },
      { key:'punch',          emoji:'👊', name:'Punch',          file:'42- Punch1.mp3' },
      { key:'nave',           emoji:'🚀', name:'Nave',           file:'18- Nave.mp3' },
      { key:'nave2',          emoji:'🚀', name:'Nave 2',         file:'19- Nave 2.mp3' },
      { key:'raio',           emoji:'⚡', name:'Raio Logo',      file:'15- Raio Logo.mp3' },
    ],
  },
  {
    cat: '😱 Suspense', color: '#a78bfa',
    items: [
      { key:'suspense',       emoji:'😰', name:'Suspense',       file:'8- Suspense.mp3' },
      { key:'suspense2',      emoji:'😨', name:'Suspense 2',     file:'9- Suspense 2.mp3' },
      { key:'experimentos',   emoji:'🔬', name:'Experimentos',   file:'44- Experimentos Secretos.mp3' },
      { key:'sirene',         emoji:'🚨', name:'Sirene',         file:'62- Sirene.mp3' },
      { key:'magica',         emoji:'✨', name:'Mágica',         file:'21- Mágica.mp3' },
      { key:'warpy',          emoji:'🌀', name:'Warpy',          file:'63- Warpy.mp3' },
    ],
  },
  {
    cat: '😂 Comédia', color: '#f87171',
    items: [
      { key:'pegadinha',      emoji:'😜', name:'Pegadinha',      file:'17- Pegadinha.mp3' },
      { key:'derp',           emoji:'😵', name:'Derp',           file:'38- Derp - Gaming Sound Effect (HD).mp3' },
      { key:'morri',          emoji:'💀', name:'MORRI',          file:'39- MORRI.mp3' },
      { key:'plun',           emoji:'🪣', name:'PLUN',           file:'41- PLUN.mp3' },
      { key:'nope',           emoji:'🙅', name:'Nope',           file:'40- Nope (Construction Worker TF2) - Gaming Sound Effect (HD).mp3' },
      { key:'sumiu',          emoji:'👻', name:'SUMIU!',         file:'43- SUMIU!!!.mp3' },
      { key:'whaaat',         emoji:'😦', name:'Whaaat',         file:'45- Whaaat - Sound Effect.mp3' },
      { key:'fail',           emoji:'❌', name:'Fail',           file:'46- Fail Sound.wav' },
      { key:'peido',          emoji:'💨', name:'Peido',          file:'57- PEIDO.mp3' },
      { key:'naoconsegue',    emoji:'🤦', name:'Não consegue',   file:'61- Não consegue né-.mp3' },
      { key:'humwaa',         emoji:'😩', name:'Hu Waa Waa',     file:'66- Hu Waa Waa - Gaming Sound Effect (HD).mp3' },
      { key:'cartoon_slip',   emoji:'🤸', name:'Cartoon Slip',   file:'64- Cartoon Slip - Gaming Sound Effect (HD).mp3' },
    ],
  },
  {
    cat: '🖥️ UI / Tech', color: '#10b981',
    items: [
      { key:'click',          emoji:'🖱️', name:'Click',          file:'29- Click.mp3' },
      { key:'digitando',      emoji:'⌨️', name:'Digitando',      file:'28- Digitando.mp3' },
      { key:'mouse',          emoji:'🖱️', name:'Mouse',          file:'20- Mouse.mp3' },
      { key:'foto',           emoji:'📷', name:'Foto',           file:'24- Foto.mp3' },
      { key:'bip_longo',      emoji:'📳', name:'Bip Longo',      file:'31- Bip Longo.mp3' },
      { key:'bip_longo2',     emoji:'📳', name:'Bip Longo 2',    file:'32- Bip Longo 2.mp3' },
      { key:'errou',          emoji:'❌', name:'Errou',          file:'25- Errou.mp3' },
      { key:'erro_windows',   emoji:'💻', name:'Erro Windows',   file:'65- (erro no windows).mp3' },
      { key:'aparecendo',     emoji:'✨', name:'Aparecendo',     file:'33- Aparecendo.mp3' },
      { key:'voltando',       emoji:'⏪', name:'Voltando Vídeo', file:'1- Voltando Vídeo.mp3' },
    ],
  },
  {
    cat: '🔔 Notificação', color: '#fbbf24',
    items: [
      { key:'sino_longo',     emoji:'🔔', name:'Sino Longo',     file:'12- Sino Longo.mp3' },
      { key:'sino_longo2',    emoji:'🔔', name:'Sino Longo 2',   file:'13- Sino Longo 2.mp3' },
      { key:'sino_escola',    emoji:'🏫', name:'Sino Escola',    file:'14- Sino Escola.mp3' },
      { key:'tadaah',         emoji:'🎊', name:'TADAAH!',        file:'48- TADAAH Sound Effect.mp3' },
      { key:'buzzer',         emoji:'🔴', name:'Buzzer',         file:'58- Buzzer.mp3' },
      { key:'price_right',    emoji:'📺', name:'Price is Right', file:'49- The Price is Right Losing Horn - Gaming Sound Effect (HD).mp3' },
    ],
  },
  {
    cat: '💰 Dinheiro', color: '#d4af37',
    items: [
      { key:'dinheiro1',      emoji:'💸', name:'Dinheiro 1',     file:'27- Dinheiro 1.mp3' },
      { key:'dinheiro2',      emoji:'💵', name:'Dinheiro 2',     file:'26- Dinheiro 2.mp3' },
      { key:'tchan',          emoji:'🎉', name:'Tchan!',         file:'7- Tchan.mp3' },
      { key:'buzina',         emoji:'📯', name:'Buzina',         file:'30- Buzina.mp3' },
    ],
  },
  {
    cat: '🎭 Meme', color: '#e879f9',
    items: [
      { key:'john_cena',      emoji:'🤼', name:'John Cena',      file:'55- And His Name is JOHN CENA - Sound Effect (HD).mp3' },
      { key:'turn_down',      emoji:'🔥', name:'Turn Down',      file:'47- Turn down for what.mp3' },
      { key:'female_scream',  emoji:'😱', name:'Scream',         file:'50- Female Scream - Sound Effect.mp3' },
      { key:'e_morreu',       emoji:'💀', name:'E Morreu Didi',  file:'51- E Morreu - Didi.mp3' },
      { key:'cego',           emoji:'🙈', name:'Tu é Cego',      file:'52- tu é cego.mp3' },
      { key:'really',         emoji:'😤', name:'Really Nigga',   file:'53- Really Nigga Sound Effect.mp3' },
      { key:'surprise',       emoji:'😤', name:'Surprise MF',    file:'54- Suprise Mother Fuck.mp3' },
      { key:'taffarel',       emoji:'🥅', name:'Taffarel',       file:'68- Sai que é sua TAFFAREL!!!!!.mp3' },
      { key:'whatcha_say',    emoji:'🎤', name:'Whatcha Say',    file:'67- Whatcha Say - MLG Sound Effects (HD).mp3' },
      { key:'banana_song',    emoji:'🍌', name:'Banana Song',    file:'59- Banana Song.mp3' },
      { key:'ops',            emoji:'😬', name:'Ops',            file:'56- Ops.mp3' },
      { key:'triste',         emoji:'😢', name:'Triste',         file:'5- Triste.mp3' },
      { key:'tempo_passando', emoji:'⏰', name:'Tempo Passando', file:'6- Tempo Passando.mp3' },
      { key:'exclamacao',     emoji:'❗', name:'!',              file:'36- !.mp3' },
    ],
  },
];

// Flat list for lookup (key → {emoji, name, file})
const SFX_LIST = SFX_CATS.flatMap(c => c.items);

// Cache de AudioBuffers decodificados
const _sfxBufferCache = {};

const loadSfxBuffer = async (file) => {
  if (_sfxBufferCache[file]) return _sfxBufferCache[file];
  try {
    const url = '/sfx/' + encodeURIComponent(file);
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const arrayBuf = await res.arrayBuffer();
    const offlineCtx = new OfflineAudioContext(2, 44100 * 10, 44100);
    const decoded = await offlineCtx.decodeAudioData(arrayBuf);
    _sfxBufferCache[file] = decoded;
    return decoded;
  } catch (e) {
    console.warn('[SFX] Erro ao carregar:', file, e.message);
    return null;
  }
};

// Alias para compatibilidade com o código existente que chama synthesizeSfxBuffer(key)
const synthesizeSfxBuffer = async (key) => {
  const sfx = SFX_LIST.find(s => s.key === key);
  if (!sfx) return null;
  return loadSfxBuffer(sfx.file);
};


const CANVAS_TEMPLATES = [
  // ─── 16:9 ──────────────────────────────────────────────────────────────
  { id:'169_bold', format:'16:9', name:'Bold Center', accent:'#00BFFF',
    desc:'Texto central com máximo impacto, glow azul',
    descEn:'Center text with maximum impact, blue glow',
    settings:{ fontSize:72, fontFamily:'Bebas Neue', textColor:'#ffffff',
      gradientEnabled:true, gradientColor1:'#ffffff', gradientColor2:'#00BFFF',
      shadowEnabled:true, shadowBlur:28, shadowColor:'rgba(0,191,255,0.65)', shadowOffsetX:0, shadowOffsetY:4, zoom:60 },
    extraTexts:[
      { rx:0.5, ry:0.88, text:'@seucanal', textEn:'@yourchannel', fs:28, ff:'Poppins', color:'rgba(255,255,255,0.55)' },
    ]},
  { id:'169_lower3', format:'16:9', name:'Lower Third', accent:'#fbbf24',
    desc:'Legenda inferior centralizada estilo noticiário',
    descEn:'Lower caption, news broadcast style',
    settings:{ fontSize:52, fontFamily:'Montserrat', textColor:'#ffffff',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:16, shadowColor:'rgba(0,0,0,0.9)', shadowOffsetX:0, shadowOffsetY:2, zoom:55 },
    extraTexts:[
      { rx:0.5, ry:0.84, text:'Nome do Artista', textEn:'Artist Name', fs:42, ff:'Bebas Neue', color:'#fbbf24' },
      { rx:0.5, ry:0.93, text:'feat. Colaborador • 2024', textEn:'feat. Collaborator • 2024', fs:20, ff:'Poppins', color:'rgba(255,255,255,0.65)' },
    ]},
  { id:'169_neon_split', format:'16:9', name:'Neon Split', accent:'#a78bfa',
    desc:'Dois blocos de texto, glow roxo vibrante',
    descEn:'Two text blocks, vibrant purple glow',
    settings:{ fontSize:58, fontFamily:'Poppins', textColor:'#ffffff',
      gradientEnabled:true, gradientColor1:'#a78bfa', gradientColor2:'#f0abfc',
      shadowEnabled:true, shadowBlur:32, shadowColor:'rgba(167,139,250,0.75)', shadowOffsetX:0, shadowOffsetY:0, zoom:55 },
    extraTexts:[
      { rx:0.5, ry:0.12, text:'✦ TRACK TITLE ✦', textEn:'✦ TRACK TITLE ✦', fs:34, ff:'Bebas Neue', color:'#a78bfa' },
      { rx:0.5, ry:0.92, text:'Álbum • Ano • Gravadora', textEn:'Album • Year • Label', fs:22, ff:'Poppins', color:'rgba(255,255,255,0.45)' },
    ]},
  { id:'169_minimal', format:'16:9', name:'Minimal Dark', accent:'#e2e8f0',
    desc:'Layout limpo com tipografia elegante',
    descEn:'Clean layout with elegant typography',
    settings:{ fontSize:48, fontFamily:'Raleway', textColor:'#ffffff',
      gradientEnabled:false, shadowEnabled:false, shadowBlur:12, shadowColor:'rgba(0,0,0,0.9)', shadowOffsetX:0, shadowOffsetY:2, zoom:50 },
    extraTexts:[
      { rx:0.5, ry:0.10, text:'──────────────────', textEn:'──────────────────', fs:16, ff:'Poppins', color:'rgba(255,255,255,0.18)' },
      { rx:0.5, ry:0.90, text:'──────────────────', textEn:'──────────────────', fs:16, ff:'Poppins', color:'rgba(255,255,255,0.18)' },
      { rx:0.5, ry:0.96, text:'stream agora • todas as plataformas', textEn:'stream now • all platforms', fs:17, ff:'Raleway', color:'rgba(255,255,255,0.38)' },
    ]},
  { id:'169_fire', format:'16:9', name:'Fire Hype', accent:'#ff6b00',
    desc:'Trap/rap com gradiente de fogo explosivo',
    descEn:'Trap/rap with explosive fire gradient',
    settings:{ fontSize:82, fontFamily:'Bebas Neue', textColor:'#ff6b00',
      gradientEnabled:true, gradientColor1:'#ff6b00', gradientColor2:'#ffd700',
      shadowEnabled:true, shadowBlur:42, shadowColor:'rgba(255,107,0,0.85)', shadowOffsetX:0, shadowOffsetY:0, zoom:62 },
    extraTexts:[
      { rx:0.5, ry:0.09, text:'🔥 NEW MUSIC 🔥', textEn:'🔥 NEW MUSIC 🔥', fs:28, ff:'Bebas Neue', color:'#ffd700' },
      { rx:0.5, ry:0.92, text:'DISPONÍVEL AGORA', textEn:'AVAILABLE NOW', fs:24, ff:'Montserrat', color:'rgba(255,255,255,0.75)' },
    ]},
  { id:'169_gold', format:'16:9', name:'Classic Gold', accent:'#d4af37',
    desc:'Elegante dourado para MPB/clássico',
    descEn:'Elegant gold for classic/acoustic music',
    settings:{ fontSize:58, fontFamily:'Playfair Display', textColor:'#d4af37',
      gradientEnabled:true, gradientColor1:'#d4af37', gradientColor2:'#fff8dc',
      shadowEnabled:true, shadowBlur:22, shadowColor:'rgba(212,175,55,0.5)', shadowOffsetX:0, shadowOffsetY:2, zoom:56 },
    extraTexts:[
      { rx:0.5, ry:0.08, text:'◆  ◆  ◆', textEn:'◆  ◆  ◆', fs:22, ff:'Poppins', color:'rgba(212,175,55,0.5)' },
      { rx:0.5, ry:0.93, text:'◆  ◆  ◆', textEn:'◆  ◆  ◆', fs:22, ff:'Poppins', color:'rgba(212,175,55,0.5)' },
    ]},
  // ─── 9:16 ──────────────────────────────────────────────────────────────
  { id:'916_viral', format:'9:16', name:'Viral Reels', accent:'#ff4081',
    desc:'Texto grande + CTA no rodapé, Reels/TikTok',
    descEn:'Big text + CTA at the bottom, Reels/TikTok',
    settings:{ fontSize:80, fontFamily:'Bebas Neue', textColor:'#ffffff',
      gradientEnabled:true, gradientColor1:'#ff4081', gradientColor2:'#ff80ab',
      shadowEnabled:true, shadowBlur:32, shadowColor:'rgba(255,64,129,0.75)', shadowOffsetX:0, shadowOffsetY:4, zoom:42 },
    extraTexts:[
      { rx:0.5, ry:0.06, text:'🎵 OUÇA AGORA', textEn:'🎵 LISTEN NOW', fs:30, ff:'Poppins', color:'rgba(255,255,255,0.9)' },
      { rx:0.5, ry:0.95, text:'▸ segue pra mais', textEn:'▸ follow for more', fs:26, ff:'Poppins', color:'rgba(255,255,255,0.65)' },
    ]},
  { id:'916_neon', format:'9:16', name:'Center Neon', accent:'#00e5ff',
    desc:'Texto centralizado com glow ciano forte',
    descEn:'Centered text with strong cyan glow',
    settings:{ fontSize:88, fontFamily:'Bebas Neue', textColor:'#00e5ff',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:52, shadowColor:'rgba(0,229,255,0.92)', shadowOffsetX:0, shadowOffsetY:0, zoom:42 },
    extraTexts:[
      { rx:0.5, ry:0.11, text:'◈  LANÇAMENTO  ◈', textEn:'◈  NEW RELEASE  ◈', fs:26, ff:'Montserrat', color:'rgba(0,229,255,0.55)' },
      { rx:0.5, ry:0.90, text:'@artista • todas as plataformas', textEn:'@artist • all platforms', fs:22, ff:'Poppins', color:'rgba(255,255,255,0.45)' },
    ]},
  { id:'916_gradient', format:'9:16', name:'Gradient Wave', accent:'#c084fc',
    desc:'Roxo/rosa vibrante, Stories premium',
    descEn:'Vibrant purple/pink, premium Stories',
    settings:{ fontSize:82, fontFamily:'Poppins', textColor:'#ffffff',
      gradientEnabled:true, gradientColor1:'#c084fc', gradientColor2:'#f9a8d4',
      shadowEnabled:true, shadowBlur:36, shadowColor:'rgba(192,132,252,0.72)', shadowOffsetX:0, shadowOffsetY:0, zoom:42 },
    extraTexts:[
      { rx:0.5, ry:0.07, text:'✦ nova música ✦', textEn:'✦ new music ✦', fs:26, ff:'Raleway', color:'rgba(255,255,255,0.55)' },
      { rx:0.5, ry:0.93, text:'🎧 disponível agora', textEn:'🎧 available now', fs:26, ff:'Poppins', color:'rgba(255,255,255,0.65)' },
    ]},
  { id:'916_clean', format:'9:16', name:'Stories Clean', accent:'#f1f5f9',
    desc:'Minimalista elegante, indie/pop',
    descEn:'Elegant minimalist, indie/pop',
    settings:{ fontSize:72, fontFamily:'Raleway', textColor:'#ffffff',
      gradientEnabled:false, shadowEnabled:false, shadowBlur:12, shadowColor:'rgba(0,0,0,0.9)', shadowOffsetX:0, shadowOffsetY:2, zoom:40 },
    extraTexts:[
      { rx:0.5, ry:0.07, text:'N O V O  S I N G L E', textEn:'N E W  S I N G L E', fs:22, ff:'Raleway', color:'rgba(255,255,255,0.38)' },
      { rx:0.5, ry:0.94, text:'ouça • salve • compartilhe', textEn:'listen • save • share', fs:20, ff:'Poppins', color:'rgba(255,255,255,0.32)' },
    ]},
  { id:'916_hype', format:'9:16', name:'Dark Hype', accent:'#39ff14',
    desc:'Trap/drill urbano agressivo, verde neon',
    descEn:'Aggressive urban trap/drill, neon green',
    settings:{ fontSize:92, fontFamily:'Bebas Neue', textColor:'#39ff14',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:48, shadowColor:'rgba(57,255,20,0.85)', shadowOffsetX:0, shadowOffsetY:0, zoom:42 },
    extraTexts:[
      { rx:0.5, ry:0.05, text:'OUT NOW', textEn:'OUT NOW', fs:28, ff:'Montserrat', color:'rgba(255,255,255,0.88)' },
      { rx:0.5, ry:0.96, text:'▶ STREAM ▶', textEn:'▶ STREAM ▶', fs:26, ff:'Bebas Neue', color:'rgba(57,255,20,0.75)' },
    ]},
  { id:'916_lofi', format:'9:16', name:'Lo-Fi Vibes', accent:'#f59e0b',
    desc:'Chill, cores quentes, vibe café',
    descEn:'Chill, warm tones, coffee shop vibe',
    settings:{ fontSize:66, fontFamily:'Lora', textColor:'#f59e0b',
      gradientEnabled:true, gradientColor1:'#f59e0b', gradientColor2:'#fde68a',
      shadowEnabled:true, shadowBlur:22, shadowColor:'rgba(245,158,11,0.45)', shadowOffsetX:0, shadowOffsetY:2, zoom:40 },
    extraTexts:[
      { rx:0.5, ry:0.07, text:'lo-fi  •  chill  •  beats', textEn:'lo-fi  •  chill  •  beats', fs:24, ff:'Lora', color:'rgba(253,230,138,0.6)' },
      { rx:0.5, ry:0.93, text:'☕  relaxa e ouve', textEn:'☕  chill and vibe', fs:24, ff:'Lora', color:'rgba(255,255,255,0.5)' },
    ]},
  // ─── 1:1 ───────────────────────────────────────────────────────────────
  { id:'11_impact', format:'1:1', name:'Impact Square', accent:'#ff3d00',
    desc:'Máximo impacto para feed quadrado',
    descEn:'Maximum impact for square feed',
    settings:{ fontSize:94, fontFamily:'Bebas Neue', textColor:'#ffffff',
      gradientEnabled:true, gradientColor1:'#ff3d00', gradientColor2:'#ff9100',
      shadowEnabled:true, shadowBlur:42, shadowColor:'rgba(255,61,0,0.82)', shadowOffsetX:0, shadowOffsetY:0, zoom:50 },
    extraTexts:[
      { rx:0.5, ry:0.07, text:'🔥 NOVO LANÇAMENTO 🔥', textEn:'🔥 NEW RELEASE 🔥', fs:28, ff:'Montserrat', color:'rgba(255,145,0,0.9)' },
      { rx:0.5, ry:0.94, text:'disponível em todas as plataformas', textEn:'available on all platforms', fs:22, ff:'Poppins', color:'rgba(255,255,255,0.48)' },
    ]},
  { id:'11_blue_neon', format:'1:1', name:'Blue Neon', accent:'#00BFFF',
    desc:'Azul neon, estilo eletrônico/pop',
    descEn:'Neon blue, electronic/pop style',
    settings:{ fontSize:84, fontFamily:'Bebas Neue', textColor:'#00BFFF',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:52, shadowColor:'rgba(0,191,255,0.92)', shadowOffsetX:0, shadowOffsetY:0, zoom:50 },
    extraTexts:[
      { rx:0.5, ry:0.07, text:'◈  SINGLE  ◈', textEn:'◈  SINGLE  ◈', fs:26, ff:'Bebas Neue', color:'rgba(0,191,255,0.48)' },
      { rx:0.5, ry:0.94, text:'@artista  ·  link na bio', textEn:'@artist  ·  link in bio', fs:22, ff:'Poppins', color:'rgba(255,255,255,0.42)' },
    ]},
  { id:'11_gold', format:'1:1', name:'Gold Feed', accent:'#d4af37',
    desc:'Elegante dourado para feed premium',
    descEn:'Elegant gold for premium feed',
    settings:{ fontSize:78, fontFamily:'Playfair Display', textColor:'#d4af37',
      gradientEnabled:true, gradientColor1:'#d4af37', gradientColor2:'#fff8dc',
      shadowEnabled:true, shadowBlur:26, shadowColor:'rgba(212,175,55,0.62)', shadowOffsetX:0, shadowOffsetY:2, zoom:50 },
    extraTexts:[
      { rx:0.5, ry:0.07, text:'—  —  —  —  —  —', textEn:'—  —  —  —  —  —', fs:18, ff:'Poppins', color:'rgba(212,175,55,0.38)' },
      { rx:0.5, ry:0.93, text:'—  —  —  —  —  —', textEn:'—  —  —  —  —  —', fs:18, ff:'Poppins', color:'rgba(212,175,55,0.38)' },
      { rx:0.5, ry:0.97, text:'ouça agora em todos os streamings', textEn:'listen now on all platforms', fs:18, ff:'Raleway', color:'rgba(255,255,255,0.32)' },
    ]},
  { id:'11_minimal', format:'1:1', name:'Minimal Square', accent:'#e2e8f0',
    desc:'Clean e moderno, ótimo para pop/indie',
    descEn:'Clean and modern, great for pop/indie',
    settings:{ fontSize:72, fontFamily:'Raleway', textColor:'#ffffff',
      gradientEnabled:false, shadowEnabled:false, shadowBlur:12, shadowColor:'rgba(0,0,0,0.9)', shadowOffsetX:0, shadowOffsetY:2, zoom:50 },
    extraTexts:[
      { rx:0.5, ry:0.06, text:'novo  single', textEn:'new  single', fs:22, ff:'Raleway', color:'rgba(255,255,255,0.28)' },
      { rx:0.5, ry:0.95, text:'2024', textEn:'2024', fs:20, ff:'Raleway', color:'rgba(255,255,255,0.22)' },
    ]},
  { id:'11_trap', format:'1:1', name:'Trap Vibes', accent:'#00ff87',
    desc:'Urbano agressivo, trap/rap verde neon',
    descEn:'Aggressive urban trap/rap neon green',
    settings:{ fontSize:90, fontFamily:'Bebas Neue', textColor:'#00ff87',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:52, shadowColor:'rgba(0,255,135,0.88)', shadowOffsetX:0, shadowOffsetY:0, zoom:50 },
    extraTexts:[
      { rx:0.5, ry:0.05, text:'OUT NOW', textEn:'OUT NOW', fs:26, ff:'Montserrat', color:'rgba(255,255,255,0.82)' },
      { rx:0.5, ry:0.96, text:'🔊 ESCUTA AGORA 🔊', textEn:'🔊 LISTEN NOW 🔊', fs:24, ff:'Bebas Neue', color:'rgba(0,255,135,0.68)' },
    ]},
  { id:'11_retro', format:'1:1', name:'Retro Pop', accent:'#ff6eb4',
    desc:'Anos 80/90 com cores retrô vibrantes',
    descEn:'80s/90s with vibrant retro colors',
    settings:{ fontSize:76, fontFamily:'Bebas Neue', textColor:'#ffffff',
      gradientEnabled:true, gradientColor1:'#ff6eb4', gradientColor2:'#ffe44d',
      shadowEnabled:true, shadowBlur:22, shadowColor:'rgba(255,110,180,0.52)', shadowOffsetX:4, shadowOffsetY:4, zoom:50 },
    extraTexts:[
      { rx:0.5, ry:0.07, text:'✦ VIDEOCLIPE OFICIAL ✦', textEn:'✦ OFFICIAL MUSIC VIDEO ✦', fs:24, ff:'Bebas Neue', color:'#ffe44d' },
      { rx:0.5, ry:0.94, text:'inscreva-se  •  ative o sino 🔔', textEn:'subscribe  •  hit the bell 🔔', fs:20, ff:'Poppins', color:'rgba(255,228,77,0.68)' },
    ]},
  // ─── 4:3 ───────────────────────────────────────────────────────────────
  { id:'43_classic', format:'4:3', name:'Classic TV', accent:'#e2e8f0',
    desc:'Layout tradicional estilo apresentação TV',
    descEn:'Traditional layout, TV presentation style',
    settings:{ fontSize:66, fontFamily:'Oswald', textColor:'#ffffff',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:16, shadowColor:'rgba(0,0,0,0.9)', shadowOffsetX:0, shadowOffsetY:3, zoom:55 },
    extraTexts:[
      { rx:0.5, ry:0.10, text:'VIDEOCLIPE OFICIAL', textEn:'OFFICIAL MUSIC VIDEO', fs:28, ff:'Oswald', color:'rgba(255,255,255,0.48)' },
      { rx:0.5, ry:0.92, text:'Inscreva-se no Canal', textEn:'Subscribe to the Channel', fs:22, ff:'Poppins', color:'rgba(255,255,255,0.38)' },
    ]},
  { id:'43_gold', format:'4:3', name:'Gold Broadcast', accent:'#d4af37',
    desc:'Profissional com dourado, MPB/sertanejo',
    descEn:'Professional gold, acoustic/country style',
    settings:{ fontSize:70, fontFamily:'Playfair Display', textColor:'#d4af37',
      gradientEnabled:true, gradientColor1:'#d4af37', gradientColor2:'#fff8dc',
      shadowEnabled:true, shadowBlur:22, shadowColor:'rgba(212,175,55,0.52)', shadowOffsetX:0, shadowOffsetY:2, zoom:55 },
    extraTexts:[
      { rx:0.5, ry:0.09, text:'◆  A U T O R  ◆', textEn:'◆  A R T I S T  ◆', fs:26, ff:'Raleway', color:'rgba(212,175,55,0.58)' },
      { rx:0.5, ry:0.92, text:'disponível em todos os streamings', textEn:'available on all streaming platforms', fs:20, ff:'Raleway', color:'rgba(255,255,255,0.32)' },
    ]},
  { id:'43_neon', format:'4:3', name:'Neon Screen', accent:'#00e5ff',
    desc:'Tela neon eletrônica, lyric video',
    descEn:'Electronic neon screen, lyric video',
    settings:{ fontSize:72, fontFamily:'Bebas Neue', textColor:'#00e5ff',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:48, shadowColor:'rgba(0,229,255,0.92)', shadowOffsetX:0, shadowOffsetY:0, zoom:55 },
    extraTexts:[
      { rx:0.5, ry:0.10, text:'▶  LYRIC VIDEO  ◀', textEn:'▶  LYRIC VIDEO  ◀', fs:26, ff:'Bebas Neue', color:'rgba(0,229,255,0.48)' },
      { rx:0.5, ry:0.92, text:'@artista  ·  link na bio', textEn:'@artist  ·  link in bio', fs:20, ff:'Poppins', color:'rgba(255,255,255,0.38)' },
    ]},
  { id:'43_minimal', format:'4:3', name:'Minimal 4:3', accent:'#94a3b8',
    desc:'Moderno e limpo para apresentações',
    descEn:'Modern and clean for presentations',
    settings:{ fontSize:60, fontFamily:'Raleway', textColor:'#ffffff',
      gradientEnabled:false, shadowEnabled:false, shadowBlur:12, shadowColor:'rgba(0,0,0,0.9)', shadowOffsetX:0, shadowOffsetY:2, zoom:55 },
    extraTexts:[
      { rx:0.5, ry:0.09, text:'N O V A  M Ú S I C A', textEn:'N E W  M U S I C', fs:22, ff:'Raleway', color:'rgba(148,163,184,0.48)' },
      { rx:0.5, ry:0.92, text:'ouça agora', textEn:'listen now', fs:22, ff:'Raleway', color:'rgba(148,163,184,0.38)' },
    ]},
  { id:'43_fire', format:'4:3', name:'Fire Stage', accent:'#ff6b00',
    desc:'Rock/metal com energia explosiva',
    descEn:'Rock/metal with explosive energy',
    settings:{ fontSize:78, fontFamily:'Bebas Neue', textColor:'#ff6b00',
      gradientEnabled:true, gradientColor1:'#ff6b00', gradientColor2:'#ffd700',
      shadowEnabled:true, shadowBlur:42, shadowColor:'rgba(255,107,0,0.82)', shadowOffsetX:0, shadowOffsetY:0, zoom:56 },
    extraTexts:[
      { rx:0.5, ry:0.09, text:'🔥 AO VIVO 🔥', textEn:'🔥 LIVE 🔥', fs:26, ff:'Bebas Neue', color:'#ffd700' },
      { rx:0.5, ry:0.92, text:'INSCREVA-SE E ATIVE O SINO', textEn:'SUBSCRIBE AND HIT THE BELL', fs:18, ff:'Montserrat', color:'rgba(255,107,0,0.68)' },
    ]},
  { id:'43_retro', format:'4:3', name:'Retro Vintage', accent:'#c9a84c',
    desc:'Anos 70/80 vintage para clássicos',
    descEn:'70s/80s vintage for classic tracks',
    settings:{ fontSize:68, fontFamily:'Lora', textColor:'#c9a84c',
      gradientEnabled:true, gradientColor1:'#c9a84c', gradientColor2:'#f5deb3',
      shadowEnabled:true, shadowBlur:18, shadowColor:'rgba(201,168,76,0.42)', shadowOffsetX:2, shadowOffsetY:2, zoom:55 },
    extraTexts:[
      { rx:0.5, ry:0.09, text:'✦  C L Á S S I C O  ✦', textEn:'✦  C L A S S I C  ✦', fs:24, ff:'Lora', color:'rgba(201,168,76,0.58)' },
      { rx:0.5, ry:0.92, text:'remasterizado  •  alta qualidade', textEn:'remastered  •  high quality', fs:18, ff:'Lora', color:'rgba(255,255,255,0.28)' },
    ]},
];

// ── Overlays de Vídeo (Texturas) ─────────────────────────────────────────────
const OVERLAY_BASE_URL = 'https://grxejgpdnefyjjznaads.supabase.co/storage/v1/object/public/overlays/';
const OVERLAY_EFFECTS = [
  { id:'advanced-particles',   name:'Advanced Particles',   icon:'✨', file:'Advanced particles.mp4',            blend:'screen'   },
  { id:'bleeds-footages',      name:'Bleeds Footages',      icon:'🩸', file:'Bleeds footages.mp4',               blend:'screen'   },
  { id:'burn',                 name:'Burn',                 icon:'🔥', file:'Burn.mp4',                          blend:'screen'   },
  { id:'burning-fire',         name:'Burning Fire',         icon:'🔥', file:'Burning parkling fire.mp4',         blend:'screen'   },
  { id:'bursting-snow',        name:'Bursting Snow',        icon:'❄️', file:'Bursting Snow.mp4',                 blend:'screen'   },
  { id:'color-light-leak-1',   name:'Color Light Leak 1',   icon:'🌈', file:'Color Light Leak (1).mp4',          blend:'screen'   },
  { id:'color-light-leak-2',   name:'Color Light Leak 2',   icon:'🌈', file:'Color Light Leak (2).mp4',          blend:'screen'   },
  { id:'color-light-leak-3',   name:'Color Light Leak 3',   icon:'🌈', file:'Color Light Leak (3).mp4',          blend:'screen'   },
  { id:'dust-light-leaks',     name:'Dust Light Leaks',     icon:'💨', file:'Dust light leaks.mp4',              blend:'screen'   },
  { id:'dust-overlay',         name:'Dust Overlay',         icon:'🌫️', file:'Dust overlay.mp4',                  blend:'screen'   },
  { id:'falling-sparks',       name:'Falling Sparks',       icon:'⚡', file:'Falling sparks.mp4',                blend:'screen'   },
  { id:'fire-particles',       name:'Fire Particles',       icon:'🔥', file:'Fire particles.mp4',                blend:'screen'   },
  { id:'fire-spark-black',     name:'Fire Spark',           icon:'✴️', file:'Fire spark black.mp4',              blend:'screen'   },
  { id:'fire',                 name:'Fire',                 icon:'🔥', file:'Fire.mp4',                          blend:'screen'   },
  { id:'galaxy-gust',          name:'Galaxy Gust',          icon:'🌌', file:'Galaxy Gust.mp4',                   blend:'screen'   },
  { id:'gold-flare',           name:'Gold Light Flare',     icon:'✨', file:'Gold light flare particles.mp4',    blend:'screen'   },
  { id:'golden-smoke',         name:'Golden Smoke',         icon:'💛', file:'Golden Smoke.mp4',                  blend:'screen'   },
  { id:'goldendust',           name:'Golden Dust',          icon:'🏆', file:'Goldendust.mp4',                    blend:'screen'   },
  { id:'gray-particles',       name:'Gray Particles',       icon:'🌫️', file:'Gray particles.mp4',                blend:'screen'   },
  { id:'green-lines',          name:'Green Lines',          icon:'💚', file:'Green Lines.mp4',                   blend:'screen'   },
  { id:'grunge',               name:'Grunge',               icon:'🖤', file:'Grunge.mp4',                        blend:'multiply' },
  { id:'huge-dust',            name:'Huge Dust',            icon:'💨', file:'Huge Dust Particles.mp4',           blend:'screen'   },
  { id:'ink-drops',            name:'Ink Drops',            icon:'🖋️', file:'Ink Drops.mp4',                     blend:'multiply' },
  { id:'magical-ground',       name:'Magical Ground',       icon:'🔮', file:'Magical Ground.mp4',                blend:'screen'   },
  { id:'multicolor-particles', name:'Multicolor Particles', icon:'🌈', file:'Multicolor particles.mp4',          blend:'screen'   },
  { id:'orange-particles',     name:'Orange Particles',     icon:'🟠', file:'Orange particles.mp4',              blend:'screen'   },
  { id:'orange-sparkles',      name:'Orange Sparkles',      icon:'✨', file:'Orange Sparkles.mp4',               blend:'screen'   },
  { id:'light-flares',         name:'Light Flares',         icon:'💥', file:'Overlays Light Flers.mp4',          blend:'screen'   },
  { id:'colored-snow',         name:'Colored Snow',         icon:'🎨', file:'Particles Colored Snow.mp4',        blend:'screen'   },
  { id:'particles-red',        name:'Red Particles',        icon:'🔴', file:'Particles red.mp4',                 blend:'screen'   },
  { id:'rain',                 name:'Rain',                 icon:'🌧️', file:'Rain.mp4',                          blend:'screen'   },
  { id:'rainbow-sparks',       name:'Rainbow Sparks',       icon:'🌈', file:'Rainbow sparks.mp4',                blend:'screen'   },
  { id:'smoke-blue',           name:'Smoke Blue',           icon:'💙', file:'Smoke particles Blue.mp4',          blend:'screen'   },
  { id:'smoke-gray',           name:'Smoke Gray',           icon:'🌫️', file:'Smoke particles Gray.mp4',          blend:'screen'   },
  { id:'space',                name:'Space',                icon:'🌌', file:'Space.mp4',                         blend:'screen'   },
  { id:'star-field',           name:'Star Field',           icon:'⭐', file:'Star field.mp4',                    blend:'screen'   },
  { id:'thunder-sparkles',     name:'Thunder Sparkles',     icon:'⚡', file:'Thunder Sparkles.mp4',              blend:'screen'   },
];

function App() {
  const { user, isLoggedIn, isPro, loading: authLoading } = useAuth();
  const { t, lang } = useLanguage();
  const [image, setImage] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [projectVolume, setProjectVolume] = useState(1);    // 0–1
  const [projectSpeed,  setProjectSpeed]  = useState(1);    // 0.25–4
  const projectVolumeRef = useRef(1);
  const projectSpeedRef  = useRef(1);
  // Sempre atualiza o ref SYNC + o estado — evita stale closure em handlers
  const setVolume = (v) => { projectVolumeRef.current = v; setProjectVolume(v); };
  const setSpeed  = (s) => { projectSpeedRef.current  = s; setProjectSpeed(s); };
  const [lyrics, setLyrics] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioOffset, setAudioOffset] = useState(0);      // posição de início do áudio na timeline (s)
  const [audioTrimStart, setAudioTrimStart] = useState(0); // corte no início do arquivo de áudio (s)
  const [audioTrimEnd, setAudioTrimEnd] = useState(null);  // corte no fim (null = sem corte)
  const audioOffsetRef    = useRef(0);
  const audioTrimStartRef = useRef(0);
  const audioTrimEndRef   = useRef(null);
  useEffect(() => { audioOffsetRef.current = audioOffset; }, [audioOffset]);
  useEffect(() => { audioTrimStartRef.current = audioTrimStart; }, [audioTrimStart]);
  useEffect(() => { audioTrimEndRef.current = audioTrimEnd; }, [audioTrimEnd]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [textLines, setTextLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const [fontSize, setFontSize] = useState(35);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBgEffect, setTextBgEffect] = useState('none'); // efeito de fundo do texto de letra
  const [fontFamily, setFontFamily] = useState('Poppins');
  const [exportFormat, setExportFormat] = useState('mp4_hd');
  const fileHandleRef = useRef(null); // armazena o handle do picker para uso nos sub-handlers


  // ── Formato do canvas ─────────────────────────────────────────────────────
  const CANVAS_FORMATS = {
    '16:9': { width: 1280, height: 720,  label: '16:9 — YouTube' },
    '9:16': { width: 720,  height: 1280, label: '9:16 — Stories/TikTok' },
    '1:1':  { width: 1080, height: 1080, label: '1:1 — Instagram' },
    '4:3':  { width: 1024, height: 768,  label: '4:3 — Clássico' },
  };
  const [canvasFormat, setCanvasFormat] = useState('9:16');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stickers, setStickers] = useState([]);           // [{id,type,content,animStyle,x,y,size,rotation}]
  const [frames, setFrames]       = useState([]);           // [{id,style,x,y,width,height,color,thickness,opacity,rotation,cornerRadius}]
  const [activeFrameId, setActiveFrameId] = useState(null);
  const [showFramePanel, setShowFramePanel] = useState(false);
  const [framePanelPos, setFramePanelPos]   = useState({ top: 80, left: 0 });
  const frameBtnRef = useRef(null);
  const framesRef   = useRef([]);
  const [soundEffects, setSoundEffects] = useState([]);     // [{id,key,name,emoji,startTime,volume}]
  const [showSfxPanel, setShowSfxPanel] = useState(false);
  const [sfxPanelPos, setSfxPanelPos]   = useState({ top: 80, left: 0 });
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [showMidiasPanel, setShowMidiasPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showProjetoPanel, setShowProjetoPanel] = useState(false);
  const midiaBtnRef  = useRef(null);
  const exportBtnRef = useRef(null);
  const projetoBtnRef = useRef(null);
  const [screenEffect, setScreenEffect] = useState('none');
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.85);
  const overlayVideoRef = useRef(null);
  const overlayReadyRef = useRef(false);
  const activeOverlayRef = useRef(null);
  const overlayOpacityRef = useRef(0.85);
  useEffect(() => { activeOverlayRef.current = activeOverlay; }, [activeOverlay]);
  useEffect(() => { overlayOpacityRef.current = overlayOpacity; }, [overlayOpacity]);
  const [showFxPanel, setShowFxPanel] = useState(false);
  const fxBtnRef = useRef(null);
  const screenEffectRef = useRef('none');
  // ── Keyframes, Máscaras, Aberração Cromática ───────────────────────────────
  const [showKeyframePanel, setShowKeyframePanel] = useState(false);
  const [chromaAberration, setChromaAberration] = useState(0); // 0-20 intensidade global
  const [colorCurves, setColorCurves] = useState({ r:1, g:1, b:1, midtone:1, shadows:0, highlights:0 });
  const [bgSearch, setBgSearch] = useState('');
  const [bgSearchResults, setBgSearchResults] = useState([]);
  const [bgSearchLoading, setBgSearchLoading] = useState(false);
  const [bgTab, setBgTab] = useState('gradients');
  // ── Trilhas (biblioteca local) ─────────────────────────────────────────────
  const [showTrilhasPanel, setShowTrilhasPanel]   = useState(false);
  const [trilhasSearch, setTrilhasSearch]         = useState('');
  const [trilhasPreviewId, setTrilhasPreviewId]   = useState(null);
  const [trilhasPreviewTime, setTrilhasPreviewTime] = useState(0);
  const [trilhasUsingId, setTrilhasUsingId]       = useState(null);
  const trilhasPreviewRef = useRef(null);
  const trilhasBtnRef     = useRef(null);
  const [stickerPanelPos, setStickerPanelPos] = useState({ top: 80, left: 0 });
  const [stickerTab, setStickerTab] = useState('emoji');  // 'emoji'|'sticker'|'gif'
  const activeStickerRef = useRef(null);                  // id do sticker selecionado (sem re-render)
  const [activeStickerId, setActiveStickerId] = useState(null);
  const stickerBtnRef   = useRef(null);                   // posição real do botão para painel fixed
  const bgBtnRef        = useRef(null);                   // botão de fundos prontos
  const sfxBtnRef       = useRef(null);
  const sfxLiveAcRef    = useRef(null);                     // AudioContext para preview de SFX
  const sfxPlayedRef    = useRef(new Set());                // IDs de SFX já disparados nesta sessão
  // ── Templates ─────────────────────────────────────────────────────────────
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [templatePanelPos, setTemplatePanelPos]   = useState({ top: 80, left: 0 });
  const [templateFormatTab, setTemplateFormatTab] = useState('9:16');
  const templateBtnRef    = useRef(null);
  const templatePortalRef = useRef(null);
  const sfxLastTimeRef  = useRef(0);                        // último t conhecido para detecção de cruzamento
  const soundEffectsRef = useRef([]);
  useEffect(() => { soundEffectsRef.current = soundEffects; }, [soundEffects]);

  // ── Histórico Undo/Redo ───────────────────────────────────────────────────
  const historyRef        = useRef([]);   // pilha de snapshots (estado APÓS cada ação)
  const historyIdxRef     = useRef(-1);   // posição atual na pilha
  const isUndoingRef      = useRef(false);// bloqueia gravação durante restauração
  const pendingHistoryRef = useRef(false);// sinaliza que próximo useEffect deve gravar
  const videoTrashRef     = useRef({});   // {id: {videoEl, src}} — videoEls preservados para undo
  const allVideoEls       = useRef({});   // {id: {videoEl, audioBuffer}} — TODOS os videoEls, nunca destruídos
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const MAX_HISTORY = 60;
  const [historyTrigger, setHistoryTrigger] = useState(0); // força render inicial para snapshot
  const [imageSrc, setImageSrc] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);

  // ── Helpers: filtros CSS e transições ───────────────────────────────────────
  const buildFilterString = (f) => {
    if (!f) return 'none';
    const p = [];
    if (f.brightness !== undefined && f.brightness !== 100) p.push(`brightness(${f.brightness}%)`);
    if (f.contrast   !== undefined && f.contrast   !== 100) p.push(`contrast(${f.contrast}%)`);
    if (f.saturate   !== undefined && f.saturate   !== 100) p.push(`saturate(${f.saturate}%)`);
    if (f.hueRotate  !== undefined && f.hueRotate  !== 0)   p.push(`hue-rotate(${f.hueRotate}deg)`);
    if (f.blur       !== undefined && f.blur       !== 0)   p.push(`blur(${f.blur}px)`);
    if (f.sepia      !== undefined && f.sepia      !== 0)   p.push(`sepia(${f.sepia}%)`);
    if (f.grayscale  !== undefined && f.grayscale  !== 0)   p.push(`grayscale(${f.grayscale}%)`);
    if (f.opacity    !== undefined && f.opacity    !== 100) p.push(`opacity(${f.opacity}%)`);
    return p.length ? p.join(' ') : 'none';
  };
  // Retorna { alpha, tx, ty, scale } para aplicar antes de drawRotatedElement
  // ── _applyTr: aplica resultado de getTransitionTransform no ctx ─────────────
  const _applyTr = (ctx, tr, itemFilt, item) => {
    ctx.globalAlpha = Math.max(0, Math.min(1, tr.alpha));
    const fParts = [];
    if (tr.filterOverride) fParts.push(tr.filterOverride);
    if (itemFilt && itemFilt !== 'none') fParts.push(itemFilt);
    if (fParts.length) ctx.filter = fParts.join(' ');
    const cx = item.x + item.width / 2, cy = item.y + item.height / 2;
    ctx.translate(cx + (tr.tx||0), cy + (tr.ty||0));
    const sx = (tr.scale??1) * (tr.scaleX??1);
    const sy = (tr.scale??1) * (tr.scaleY??1);
    if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
    if (tr.addRotate) ctx.rotate(tr.addRotate);
    ctx.translate(-cx, -cy);
  };

  // ── Interpolação de Keyframes (Zoom Animado / Dinâmico) ──────────────────
  // Retorna o estado interpolado (x, y, width, height, opacity, rotation) num instante t,
  // considerando os keyframes definidos no item. Suporta easing configurável.
  const getKfState = useCallback((item, t) => {
    const kfs = item.keyframes;
    if (!kfs || kfs.length === 0) return null;

    // Easing functions
    const ease = (progress, type) => {
      const p = Math.max(0, Math.min(1, progress));
      switch(type) {
        case 'ease_in':      return p * p * p;
        case 'ease_out':     return 1 - Math.pow(1 - p, 3);
        case 'ease_in_out':  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        case 'spring': {
          // Overshoot elástico — similar ao Premiere/AE
          const c4 = (2 * Math.PI) / 3;
          if (p <= 0) return 0;
          if (p >= 1) return 1;
          return Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
        }
        case 'bounce': {
          const n1 = 7.5625, d1 = 2.75;
          let r = p;
          if (r < 1/d1)        return n1*r*r;
          else if (r < 2/d1)   { r -= 1.5/d1;  return n1*r*r + 0.75; }
          else if (r < 2.5/d1) { r -= 2.25/d1; return n1*r*r + 0.9375; }
          else                 { r -= 2.625/d1; return n1*r*r + 0.984375; }
        }
        default: return p; // linear
      }
    };

    const lerp = (a, b, p) => a + (b - a) * p;

    // Antes do primeiro keyframe: usa valores do primeiro KF
    if (t <= kfs[0].t) {
      const k = kfs[0];
      return { x: k.x ?? item.x, y: k.y ?? item.y,
               w: (k.scale ?? 1) * item.width, h: (k.scale ?? 1) * item.height,
               opacity: k.opacity ?? 1, rotation: k.rotation ?? item.rotation ?? 0,
               anchorX: k.anchorX ?? 0.5, anchorY: k.anchorY ?? 0.5 };
    }
    // Depois do último keyframe: usa valores do último KF
    if (t >= kfs[kfs.length - 1].t) {
      const k = kfs[kfs.length - 1];
      return { x: k.x ?? item.x, y: k.y ?? item.y,
               w: (k.scale ?? 1) * item.width, h: (k.scale ?? 1) * item.height,
               opacity: k.opacity ?? 1, rotation: k.rotation ?? item.rotation ?? 0,
               anchorX: k.anchorX ?? 0.5, anchorY: k.anchorY ?? 0.5 };
    }
    // Interpola entre dois keyframes
    for (let i = 0; i < kfs.length - 1; i++) {
      const k0 = kfs[i], k1 = kfs[i + 1];
      if (t >= k0.t && t <= k1.t) {
        const rawP = (t - k0.t) / (k1.t - k0.t);
        const easingType = k0.easing || 'ease_in_out';
        const p = ease(rawP, easingType);

        const sc0 = k0.scale ?? 1, sc1 = k1.scale ?? 1;
        const cx0 = (k0.x ?? item.x) + item.width  * (k0.anchorX ?? 0.5);
        const cy0 = (k0.y ?? item.y) + item.height * (k0.anchorY ?? 0.5);
        const cx1 = (k1.x ?? item.x) + item.width  * (k1.anchorX ?? 0.5);
        const cy1 = (k1.y ?? item.y) + item.height * (k1.anchorY ?? 0.5);
        const scI = lerp(sc0, sc1, p);
        const cxI = lerp(cx0, cx1, p);
        const cyI = lerp(cy0, cy1, p);
        return {
          x: cxI - item.width  * scI / 2,
          y: cyI - item.height * scI / 2,
          w: item.width  * scI,
          h: item.height * scI,
          opacity:  lerp(k0.opacity  ?? 1, k1.opacity  ?? 1, p),
          rotation: lerp(k0.rotation ?? (item.rotation||0), k1.rotation ?? (item.rotation||0), p),
          anchorX: lerp(k0.anchorX ?? 0.5, k1.anchorX ?? 0.5, p),
          anchorY: lerp(k0.anchorY ?? 0.5, k1.anchorY ?? 0.5, p),
        };
      }
    }
    return null;
  }, []);

  const getTransitionTransform = (item, t) => {
    // Suporta formato antigo (transition) e novo (transitionIn/Out)
    const trIn   = item.transitionIn  || item.transition || 'none';
    const trOut  = item.transitionOut || item.transition || 'none';
    const durIn  = item.transitionInDur  ?? item.transitionDur ?? 0.35;
    const durOut = item.transitionOutDur ?? item.transitionDur ?? 0.35;
    if (trIn === 'none' && trOut === 'none') return null;

    const tIn  = durIn  > 0 ? Math.min(1, Math.max(0, (t - item.start) / durIn))  : 1;
    const tOut = durOut > 0 ? Math.min(1, Math.max(0, (item.end - t)    / durOut)) : 1;

    const eOut3   = x => 1 - Math.pow(1 - x, 3);
    const eBounce = x => {
      if (x < 1/2.75)    return 7.5625*x*x;
      if (x < 2/2.75)    { x -= 1.5/2.75;  return 7.5625*x*x + 0.75; }
      if (x < 2.5/2.75)  { x -= 2.25/2.75; return 7.5625*x*x + 0.9375; }
      x -= 2.625/2.75;   return 7.5625*x*x + 0.984375;
    };
    const eElastic = x => x<=0||x>=1 ? x : Math.pow(2,-10*x)*Math.sin((x*10-0.75)*(2*Math.PI/3))+1;

    const calc = (tr, prog, isEntry) => {
      const p = eOut3(prog), inv = 1-p, d = isEntry ? 1 : -1;
      const base = { alpha:1, tx:0, ty:0, scale:1, scaleX:1, scaleY:1, addRotate:0, filterOverride:null, isPulse:false };
      switch(tr) {
        case 'fade':        return {...base, alpha: p};
        case 'slide-up':    return {...base, alpha: p, ty:  inv*80*d};
        case 'slide-down':  return {...base, alpha: p, ty: -inv*80*d};
        case 'slide-left':  return {...base, alpha: p, tx:  inv*80*d};
        case 'slide-right': return {...base, alpha: p, tx: -inv*80*d};
        case 'zoom':        return {...base, alpha: p, scale: 0.5+0.5*p};
        case 'zoom-out':    return {...base, alpha: p, scale: 1+0.5*inv};
        case 'blur-in':     return {...base, filterOverride:`blur(${(inv*14).toFixed(1)}px)`};
        case 'rotate':      return {...base, alpha: p, addRotate: inv*Math.PI*(isEntry?-1:1)};
        case 'flip-h':      return {...base, alpha: p, scaleX: prog<0.5?(isEntry?-1:1):(isEntry?1:-1)};
        case 'flip-v':      return {...base, alpha: p, scaleY: prog<0.5?(isEntry?-1:1):(isEntry?1:-1)};
        case 'bounce':      return {...base, alpha:Math.min(1,prog*3), ty:isEntry?(1-eBounce(prog))*70:-(1-eBounce(prog))*70};
        case 'elastic':     return {...base, alpha:Math.min(1,prog*3), scale:eElastic(prog)};
        case 'swing':       return {...base, alpha:p, addRotate:isEntry?(1-p)*0.45*d:-(1-p)*0.45*d};
        case 'drop':        return {...base, alpha:Math.min(1,prog*3), ty:isEntry?-(1-eOut3(prog))*130:(1-eOut3(prog))*130};
        case 'roll':        return {...base, alpha:p, tx:isEntry?-inv*120:inv*120, addRotate:isEntry?-inv*Math.PI*2:inv*Math.PI*2};
        case 'scale-pulse': return {...base, isPulse:true, scalePulse: 1 + Math.sin(prog*Math.PI)*0.35};
        default:            return base;
      }
    };

    const rIn  = trIn  !== 'none' ? calc(trIn,  tIn,  true)  : {alpha:1,tx:0,ty:0,scale:1,scaleX:1,scaleY:1,addRotate:0,filterOverride:null,isPulse:false};
    const rOut = trOut !== 'none' ? calc(trOut, tOut, false) : {alpha:1,tx:0,ty:0,scale:1,scaleX:1,scaleY:1,addRotate:0,filterOverride:null,isPulse:false};

    // scale-pulse: usa scalePulse separado para não ser clipado por min()
    const scaleIn  = rIn.isPulse  ? rIn.scalePulse  : rIn.scale;
    const scaleOut = rOut.isPulse ? rOut.scalePulse : rOut.scale;
    const combined = {
      alpha:         Math.min(rIn.alpha, rOut.alpha),
      tx:            rIn.tx + rOut.tx,
      ty:            rIn.ty + rOut.ty,
      scale:         scaleIn * scaleOut,
      scaleX:        rIn.scaleX * rOut.scaleX,
      scaleY:        rIn.scaleY * rOut.scaleY,
      addRotate:     rIn.addRotate + rOut.addRotate,
      filterOverride: rIn.filterOverride || rOut.filterOverride || null,
    };
    const isIdentity = combined.alpha>=1 && combined.tx===0 && combined.ty===0
      && combined.scale===1 && combined.scaleX===1 && combined.scaleY===1
      && combined.addRotate===0 && !combined.filterOverride;
    return isIdentity ? null : combined;
  };
  const [videos, setVideos] = useState([]);      // { id, src, videoEl, start, end, x, y, width, height, radius, muted }
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [extraTextColor, setExtraTextColor] = useState('#ffffff');
  const [extraTextFontFamily, setExtraTextFontFamily] = useState('Poppins');
  const [extraTextFontSize, setExtraTextFontSize] = useState(18);
  const importInputRef   = useRef(null);
  const bgInputRef       = useRef(null);
  const imagesInputRef   = useRef(null);
  const audioInputRef    = useRef(null);
  const videoInputRef    = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [audioFile, setAudioFile] = useState(null);
  const [audioBase64, setAudioBase64] = useState(null);
  const [audioMimeType, setAudioMimeType] = useState(null);
  const [waveformPeaks, setWaveformPeaks] = useState([]);

  // Estado de Zoom (Multiplicador de largura)
  const [zoom, setZoom] = useState(50);
  // Estado para controlar qual letra está sendo editada/por cima
  const [activeLyricId, setActiveLyricId] = useState(null);

  // AJUSTE: Sistema de múltiplos textos extras arrastáveis
  const [extraTexts, setExtraTexts] = useState([]); 
  const [newExtraInput, setNewExtraInput] = useState('');
  const [draggingExtraIndex, setDraggingExtraIndex] = useState(null);
  const [activeExtraTextId, setActiveExtraTextId] = useState(null);

  // ── FONTES CUSTOMIZADAS ───────────────────────────────────────────────────
  const [customFonts, setCustomFonts] = useState([]); // [{name, fileName}]
  const fontInputRef = useRef(null);

  const handleFontUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const buffer = await file.arrayBuffer();
    try {
      const face = new FontFace(name, buffer);
      await face.load();
      document.fonts.add(face);
      setCustomFonts(prev => [...prev, { name, fileName: file.name }]);
    } catch (err) {
      console.error('Erro ao carregar fonte:', err);
    }
    e.target.value = '';
  };

  // ── SOMBRA E GRADIENTE DO TEXTO PRINCIPAL ─────────────────────────────────
  const [shadowEnabled,  setShadowEnabled]  = useState(true);
  const [shadowBlur,     setShadowBlur]     = useState(12);
  const [shadowColor,    setShadowColor]    = useState('rgba(0,0,0,0.9)');
  const [shadowOffsetX,  setShadowOffsetX]  = useState(0);
  const [shadowOffsetY,  setShadowOffsetY]  = useState(2);
  const [gradientEnabled, setGradientEnabled] = useState(false);
  const [gradientColor1,  setGradientColor1]  = useState('#ffffff');
  const [gradientColor2,  setGradientColor2]  = useState('#00BFFF');

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const audioRef = useRef(null);
  const requestRef = useRef();
  const playheadRafRef = useRef(null);
  const lastPlayheadUpdateRef = useRef(0);
  const playheadRef = useRef(null);
  const timelineScrollRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const virtualTimeRef    = useRef(0);   // relógio virtual quando não há áudio
  const clockIntervalRef  = useRef(null);
  const rtExportRef       = useRef(false); // true durante WebM+Áudio RT — força draw() a ignorar audioRef
  const offlineExportRef  = useRef(false); // true durante exports frame-a-frame — suspende syncVideosInRAF
  const exportStopRef     = useRef(null);  // função para parar o export RT antecipadamente
  // Web Audio para vídeos (evita delay de áudio AAC em MP4 HD)
  const videoAudioACRef   = useRef(null);   // AudioContext partilhado para vídeos
  const videoAudioNodes   = useRef({});     // id → {source, gainNode} dos vídeos tocando
  // Refs para capturar valores atuais dentro de callbacks estáveis
  const fontSizeRef = useRef(fontSize);
  const fontFamilyRef = useRef(fontFamily);
  useEffect(() => { fontSizeRef.current = fontSize; }, [fontSize]);
  useEffect(() => { fontFamilyRef.current = fontFamily; }, [fontFamily]);
  const [animType, setAnimType] = useState('none');
  const [twSpeed,  setTwSpeed]  = useState(30);
  const animTypeRef = useRef('none');
  const twSpeedRef  = useRef(30);
  useEffect(() => { animTypeRef.current = animType; }, [animType]);
  useEffect(() => { twSpeedRef.current  = twSpeed;  }, [twSpeed]);
  const [dragging, setDragging] = useState(null);
  const draggingRef = useRef(null);  // ref síncrono — mousemove não espera re-render
  const _setDragging = (val) => { draggingRef.current = val; setDragging(val); };
  const [chatOpen,  setChatOpen]  = useState(false);
  const [chatTopic, setChatTopic] = useState(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
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
  // ── Mobile banner ────────────────────────────────────────────────────────────
  const [showMobileBanner, setShowMobileBanner] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [editingLyricId, setEditingLyricId] = useState(null);
  const [editingExtraTextId, setEditingExtraTextId] = useState(null);

  // ── UNDO / REDO ────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=Montserrat:wght@700&family=Poppins:wght@700&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&family=Raleway:wght@700&family=Playfair+Display:wght@700&family=Lora:wght@700&family=Anton&family=Black+Han+Sans&family=Righteous&family=Russo+One&family=Lilita+One&family=Exo+2:wght@700&family=Kanit:wght@700&family=Nunito:wght@700&family=Ubuntu:wght@700&family=Pacifico&family=Permanent+Marker&family=Caveat:wght@700&family=Dancing+Script:wght@700&family=Lobster&family=Abril+Fatface&family=Press+Start+2P&family=Orbitron:wght@700&family=Share+Tech+Mono&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Fecha tela cheia com ESC; fecha painel sticker com ESC ou clique fora
  useEffect(() => {
    const onKey = (e) => {
      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        const el = document.activeElement;
        if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) {
          e.preventDefault(); undoRef.current?.();
        }
      }
      // Redo: Ctrl+Y / Ctrl+Shift+Z / Cmd+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        const el = document.activeElement;
        if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA')) {
          e.preventDefault(); redoRef.current?.();
        }
      }
      if (e.key === 'Escape') { setIsFullscreen(false); setShowStickerPanel(false); setShowTemplatePanel(false); setShowFxPanel(false); setShowMidiasPanel(false); setShowExportPanel(false); setShowProjetoPanel(false); setShowTrilhasPanel(false); stopTrilhasPreview(); }
    };
    const onClickOut = (e) => {
      if (showBgPanel && bgBtnRef.current && !bgBtnRef.current.contains(e.target) &&
          !e.target.closest('[data-bg-portal]')) {
        setShowBgPanel(false);
      }
      if (showStickerPanel && stickerBtnRef.current && !stickerBtnRef.current.contains(e.target) &&
          !e.target.closest('[data-sticker-portal]')) {
        setShowStickerPanel(false);
      }
      if (showSfxPanel && sfxBtnRef.current && !sfxBtnRef.current.contains(e.target) &&
          !e.target.closest('[data-sfx-portal]')) {
        setShowSfxPanel(false);
      }
      if (showTemplatePanel && templateBtnRef.current && !templateBtnRef.current.contains(e.target) &&
          !(templatePortalRef.current && templatePortalRef.current.contains(e.target))) {
        // handled by overlay
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOut);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClickOut); };
  }, [showStickerPanel, showSfxPanel, showTemplatePanel, showBgPanel]);

  const searchUnsplash = async (query) => {
    if (!query.trim()) return;
    setBgSearchLoading(true);
    setBgSearchResults([]);
    try {
      // Wikimedia Commons — API pública, CORS habilitado, busca semântica real, sem chave
      const terms = encodeURIComponent(query.trim());
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${terms}&srnamespace=6&srlimit=12&format=json&origin=*`;
      const resp = await fetch(apiUrl);
      const data = await resp.json();
      const pages = (data?.query?.search || []);
      // Para cada resultado, busca a URL da imagem via imageinfo
      const titles = pages.map(p => encodeURIComponent(p.title)).join('|');
      if (!titles) { setBgSearchResults([]); return; }
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titles}&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=300&format=json&origin=*`;
      const infoResp = await fetch(infoUrl);
      const infoData = await infoResp.json();
      const pageMap = infoData?.query?.pages || {};
      const results = Object.values(pageMap)
        .filter(p => p?.imageinfo?.[0]?.url)
        .map((p, i) => ({
          id: `wiki_${i}`,
          thumb: p.imageinfo[0].thumburl || p.imageinfo[0].url,
          full:  p.imageinfo[0].url,
          credit: 'Wikimedia Commons',
        }))
        .filter(r => /\.(jpg|jpeg|png|webp)/i.test(r.full));
      setBgSearchResults(results.slice(0, 12));
    } catch(e) {
      console.error('[BgSearch]', e);
      setBgSearchResults([]);
    } finally {
      setBgSearchLoading(false);
    }
  };


  const searchBgImages = async () => {
    const query = bgSearch.trim();
    if (!query) return;
    await searchUnsplash(query);
  };

  const applyBgFromUrl = (url) => {
    // Carrega a imagem diretamente como src — evita taint de CORS no canvas
    // A imagem fica disponível para drawImage pois NÃO tentamos toDataURL
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      // Tenta converter para dataURL para persistência no localStorage
      try {
        const cw = img.naturalWidth  || 720;
        const ch = img.naturalHeight || 1280;
        const cv = document.createElement('canvas');
        cv.width = cw; cv.height = ch;
        const cvCtx = cv.getContext('2d');
        cvCtx.drawImage(img, 0, 0, cw, ch);
        const dataUrl = cv.toDataURL('image/jpeg', 0.92);
        setImageSrc(dataUrl);
      } catch(e) {
        // Taint de CORS — mantém a imagem em memória sem persistir no localStorage
        setImageSrc(null);
      }
      setShowBgPanel(false);
    };
    img.onerror = () => {
      // Tenta sem crossOrigin como fallback
      const img2 = new Image();
      img2.onload = () => { setImage(img2); setImageSrc(null); setShowBgPanel(false); };
      img2.onerror = () => alert('Erro ao carregar imagem. Tente outra busca.');
      img2.src = url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now();
    };
    img.src = url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      pushHistory();
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = event.target.result;
        setImageSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // permite reselecionar mesmo arquivo
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const getCanvasSize = useCallback(() => {
    const fmt = CANVAS_FORMATS[canvasFormat] || CANVAS_FORMATS['16:9'];
    return { width: fmt.width, height: fmt.height };
  }, [canvasFormat]);

  const buildImagePlacement = useCallback((img) => {
    const { width: canvasW, height: canvasH } = getCanvasSize();
    const maxW = canvasW * 0.72;
    const maxH = canvasH * 0.72;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const width = Math.max(40, img.width * scale);
    const height = Math.max(40, img.height * scale);
    const x = (canvasW - width) / 2;
    const y = (canvasH - height) / 2;
    return { x, y, width, height, radius: 18 };
  }, [getCanvasSize]);

  // Desenha imagem/vídeo com rotação ao redor do centro
  const drawRotatedElement = useCallback((ctx, drawFn, x, y, width, height, rotation) => {
    const rot = (rotation || 0) * Math.PI / 180;
    if (rot === 0) { drawFn(); return; }
    const cx = x + width / 2;
    const cy = y + height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.translate(-cx, -cy);
    drawFn();
    ctx.restore();
  }, []);

  const drawRoundedImage = useCallback((ctx, img, x, y, width, height, radius) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, width, height);
    ctx.restore();
  }, []);

  const drawRoundedRect = useCallback((ctx, x, y, width, height, radius) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }, []);

  const drawResizeHandles = useCallback((ctx, x, y, width, height) => {
    const handleSize = 12;
    ctx.fillStyle = '#00BFFF'; // Deep Sky Blue
    ctx.strokeStyle = '#FFFFFF'; // White
    ctx.lineWidth = 2;

    // Top-left
    ctx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    // Top-right
    ctx.strokeRect(x + width - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x + width - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    // Bottom-left
    ctx.strokeRect(x - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
    // Bottom-right
    ctx.strokeRect(x + width - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
    ctx.fillRect(x + width - handleSize / 2, y + height - handleSize / 2, handleSize, handleSize);
  }, []);

  // ── Aplica clip de máscara a um elemento (vídeo ou imagem) ─────────────────
  const applyElementMask = useCallback((ctx, item) => {
    const mask = item.mask || 'none';
    if (mask === 'none') return;
    const { x, y, width: w, height: h } = item;
    const cx = x + w / 2, cy = y + h / 2;
    const rx = w / 2, ry = h / 2;
    const feather = item.maskFeather || 0;
    ctx.beginPath();
    switch (mask) {
      case 'circle':
        ctx.arc(cx, cy, Math.min(rx, ry), 0, Math.PI * 2);
        break;
      case 'ellipse':
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        break;
      case 'diamond': {
        ctx.moveTo(cx, y);
        ctx.lineTo(x + w, cy);
        ctx.lineTo(cx, y + h);
        ctx.lineTo(x, cy);
        ctx.closePath();
        break;
      }
      case 'triangle':
        ctx.moveTo(cx, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x, y + h);
        ctx.closePath();
        break;
      case 'star': {
        const outer = Math.min(rx, ry), inner = outer * 0.45;
        for (let i = 0; i < 10; i++) {
          const r2 = i % 2 === 0 ? outer : inner;
          const a = (Math.PI / 5) * i - Math.PI / 2;
          i === 0 ? ctx.moveTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a))
                  : ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
        }
        ctx.closePath();
        break;
      }
      case 'heart': {
        const s = Math.min(rx, ry);
        ctx.moveTo(cx, cy + s * 0.7);
        ctx.bezierCurveTo(cx - s * 1.1, cy, cx - s * 1.1, cy - s * 0.8, cx, cy - s * 0.3);
        ctx.bezierCurveTo(cx + s * 1.1, cy - s * 0.8, cx + s * 1.1, cy, cx, cy + s * 0.7);
        ctx.closePath();
        break;
      }
      case 'hexagon': {
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          const r2 = Math.min(rx, ry);
          i === 0 ? ctx.moveTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a))
                  : ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
        }
        ctx.closePath();
        break;
      }
      default: return;
    }
    if (feather > 0) {
      ctx.save();
      ctx.shadowBlur = feather * 2;
      ctx.shadowColor = 'rgba(0,0,0,1)';
    }
    ctx.clip();
    if (feather > 0) ctx.restore();
  }, []);

  // ── Aberração cromática por elemento ──────────────────────────────────────
  const applyElementChromatic = useCallback((ctx, item, drawFn) => {
    const ca = item.chromaticAberration || 0;
    if (!ca) { drawFn(); return; }
    // Desenha R, G, B com offsets ligeiramente diferentes e combina com globalCompositeOperation
    const off = ca * 0.7;
    const saved = ctx.globalAlpha;
    ctx.globalAlpha = 0.85;

    ctx.save();
    ctx.translate(-off, 0);
    ctx.globalCompositeOperation = 'screen';
    // Filtro vermelho
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width  = ctx.canvas.width;
    tmpCanvas.height = ctx.canvas.height;
    const tmpCtx = tmpCanvas.getContext('2d');
    drawFn(tmpCtx);
    // tint red
    tmpCtx.globalCompositeOperation = 'multiply';
    tmpCtx.fillStyle = 'rgba(255,0,0,1)';
    tmpCtx.fillRect(item.x, item.y, item.width, item.height);
    ctx.drawImage(tmpCanvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(off, 0);
    ctx.globalCompositeOperation = 'screen';
    const tmpCanvas2 = document.createElement('canvas');
    tmpCanvas2.width  = ctx.canvas.width;
    tmpCanvas2.height = ctx.canvas.height;
    const tmpCtx2 = tmpCanvas2.getContext('2d');
    drawFn(tmpCtx2);
    tmpCtx2.globalCompositeOperation = 'multiply';
    tmpCtx2.fillStyle = 'rgba(0,0,255,1)';
    tmpCtx2.fillRect(item.x, item.y, item.width, item.height);
    ctx.drawImage(tmpCanvas2, 0, 0);
    ctx.restore();

    ctx.globalAlpha = saved;
    ctx.globalCompositeOperation = 'source-over';
    // Green channel — central, opacidade normal
    drawFn(ctx);
  }, []);

  const getHandleCursor = useCallback((x, y, width, height, mouseX, mouseY) => {
    const handleSize = 12;
    const nearLeft = Math.abs(mouseX - x) <= handleSize;
    const nearRight = Math.abs(mouseX - (x + width)) <= handleSize;
    const nearTop = Math.abs(mouseY - y) <= handleSize;
    const nearBottom = Math.abs(mouseY - (y + height)) <= handleSize;

    if (nearTop && nearLeft) return 'nwse-resize';
    if (nearTop && nearRight) return 'nesw-resize';
    if (nearBottom && nearLeft) return 'nesw-resize';
    if (nearBottom && nearRight) return 'nwse-resize';
    if (nearTop || nearBottom) return 'ns-resize';
    if (nearLeft || nearRight) return 'ew-resize';
    return null;
  }, []);

  const isMouseOverResizeHandle = useCallback((x, y, width, height, mouseX, mouseY) => {
    return getHandleCursor(x, y, width, height, mouseX, mouseY) !== null;
  }, [getHandleCursor]);


  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    pushHistory();
    const results = await Promise.all(files.map(readFileAsDataUrl));
    setImages((prev) => {
      const audioDuration = audioRef.current?.duration || duration;
      const allCount = prev.length + results.length;

      // Auto-distribui APENAS na primeira inserção (sem imagens anteriores)
      if (audioDuration > 0 && prev.length === 0) {
        const slotSize = audioDuration / allCount;

        const newItems = results.map((src, index) => {
          const start = index * slotSize;
          const end = (index + 1) * slotSize;
          const img = new Image();
          const id = Date.now() + index;
          img.onload = () => {
            const placement = buildImagePlacement(img);
            setImages(prevImages => prevImages.map((item) => item.id === id ? { ...item, ...placement } : item));
          };
          img.src = src;
          return { id, src, img, start, end, x: 40, y: 60, width: 180, height: 180, radius: 18, rotation: 0 };
        });

        return newItems;
      }

      // Sem áudio: comportamento anterior (3s cada)
      const baseStart = Math.max(currentTime, prev.reduce((max, item) => Math.max(max, item.end || 0), 0));
      const newItems = results.map((src, index) => {
        const start = baseStart + (index * 3);
        const end = start + 3;
        const img = new Image();
        const id = Date.now() + index;
        img.onload = () => {
          const placement = buildImagePlacement(img);
          setImages(prevImages => prevImages.map((item) => item.id === id ? { ...item, ...placement } : item));
        };
        img.src = src;
        return { id, src, img, start, end, x: 40, y: 60, width: 180, height: 180, radius: 18, rotation: 0 };
      });
      return [...prev, ...newItems];
    });
    e.target.value = '';
  };

  const handleImagesChange = (e) => {
    handleImageUpload(e);
  };

  // ── Upload de vídeos ────────────────────────────────────────────────────────
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    pushHistory();
    files.forEach((file, index) => {
      const videoEl = document.createElement('video');
      videoEl.muted = false;
      videoEl.loop = false;
      videoEl.playsInline = true;
      videoEl.preload = 'auto';
      videoEl.style.cssText = 'position:fixed;width:1px;height:1px;visibility:hidden;pointer-events:none;top:-9999px;left:-9999px';
      document.body.appendChild(videoEl);
      const id = Date.now() + index;

      // ── Carrega o arquivo INTEIRO via MediaSource ──────────────────────────
      // URL.createObjectURL() faz buffering incremental — buscando no meio do vídeo
      // o Chrome só bufferiza ~30% do arquivo, causando stall de áudio em HD.
      // Com MediaSource + appendBuffer(fullBuffer) todo o arquivo fica em RAM
      // e QUALQUER seek é instantâneo (sem stall de áudio).
      const tryMediaSource = (mimeType) => new Promise((resolve) => {
        if (!window.MediaSource || !MediaSource.isTypeSupported(mimeType)) {
          resolve(URL.createObjectURL(file)); return;
        }
        const ms = new MediaSource();
        const msUrl = URL.createObjectURL(ms);
        ms.addEventListener('sourceopen', async () => {
          try {
            const buf = await file.arrayBuffer();
            const sb = ms.addSourceBuffer(mimeType);
            sb.addEventListener('updateend', () => {
              try { ms.endOfStream(); } catch {}
              resolve(msUrl);
            }, { once: true });
            sb.onerror = () => resolve(URL.createObjectURL(file));
            sb.appendBuffer(buf);
          } catch { resolve(URL.createObjectURL(file)); }
        }, { once: true });
        videoEl.src = msUrl;
      });

      const mimeType = file.type && file.type !== '' ? file.type : 'video/mp4';
      const src = URL.createObjectURL(file); // usado como fallback e para src inicial

      // Inicia com objectURL para metadata (rápido), depois substitui com MediaSource completo
      videoEl.src = src;

      // addVideo recebe a duration já capturada — NÃO relê videoEl.duration,
      // que pode ter sido resetada para NaN/Infinity pelo MediaSource.
      // ── Lê a duration de forma INDEPENDENTE do videoEl ─────────────────────
      // Problema: videoEl.duration é resetado para NaN pelo MediaSource,
      // e em alguns MP4s loadedmetadata dispara antes da duration ser conhecida.
      // Solução: elemento temporário dedicado SOMENTE à leitura de duration —
      // nunca recebe MediaSource, garantindo que a duration seja lida corretamente.
      const readDurationFromFile = () => new Promise(resolve => {
        const probe = document.createElement('video');
        probe.preload = 'metadata';
        probe.muted = true;
        probe.style.cssText = 'position:fixed;width:1px;height:1px;top:-9999px;left:-9999px;visibility:hidden';
        document.body.appendChild(probe);
        let resolved = false;
        const finish = (dur) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timeout);
          probe.src = '';
          try { document.body.removeChild(probe); } catch {}
          resolve(isFinite(dur) && dur > 0 ? dur : 0);
        };
        // durationchange é mais confiável que loadedmetadata — pode disparar depois
        probe.addEventListener('durationchange', () => {
          if (isFinite(probe.duration) && probe.duration > 0) finish(probe.duration);
        });
        probe.addEventListener('loadedmetadata', () => {
          if (isFinite(probe.duration) && probe.duration > 0) finish(probe.duration);
        });
        probe.addEventListener('error', () => finish(0));
        // Timeout: se após 5s ainda não tiver duration, continua com 0 (fallback)
        const timeout = setTimeout(() => finish(0), 5000);
        probe.src = src; // objectURL original — nunca troca para MediaSource
        probe.load();
      });

      const addVideo = async (finalSrc, vidDuration) => {
        // Decodifica o áudio do vídeo para Web Audio (permite seek instantâneo sem delay)
        let audioBuffer = null;
        try {
          if (!videoAudioACRef.current || videoAudioACRef.current.state === 'closed') {
            videoAudioACRef.current = new (window.AudioContext || window.webkitAudioContext)();
          }
          const arrayBuf = await file.arrayBuffer();
          audioBuffer = await videoAudioACRef.current.decodeAudioData(arrayBuf);
        } catch (e) {
          console.warn('[VideoAudio] decodeAudioData falhou (vídeo pode não ter áudio):', e.message);
        }
        // vidDuration já vem validado do readDurationFromFile —
        // audioBuffer.duration como fallback extra para vídeos onde o probe falhou
        const finalDuration = (vidDuration > 0 && isFinite(vidDuration))
          ? vidDuration
          : (audioBuffer && isFinite(audioBuffer.duration) && audioBuffer.duration > 0)
            ? audioBuffer.duration
            : 3;
        const lastEnd = videos.reduce((max, v) => Math.max(max, v.end || 0), 0);
        const start = lastEnd;
        const end   = start + finalDuration;
        const canvas = canvasRef.current;
        const cW = canvas?.width  || 720;
        const cH = canvas?.height || 1280;
        const vW = videoEl.videoWidth  || 640;
        const vH = videoEl.videoHeight || 360;
        const maxW = cW * 0.72;
        const maxH = cH * 0.72;
        const scale = Math.min(maxW / vW, maxH / vH, 1);
        const w = Math.round(vW * scale);
        const h = Math.round(vH * scale);
        const x = Math.round((cW - w) / 2);
        const y = Math.round((cH - h) / 2);
        setVideos(prev => {
          if (prev.find(v => v.id === id)) return prev;
          const initSpeed = projectSpeedRef.current ?? 1;
          const newVid = { id, src: finalSrc || src, videoEl, audioBuffer, start, end, x, y, width: w, height: h, radius: 12, muted: false, vidVolume: projectVolumeRef.current ?? 1, vidSpeed: initSpeed, rawDuration: finalDuration };
          allVideoEls.current[id] = { videoEl, audioBuffer };
          return [...prev, newVid];
        });
      };

      // Lê a duration e configura o MediaSource em paralelo para ganhar tempo
      Promise.all([
        readDurationFromFile(),
        tryMediaSource(mimeType).catch(() => src),
      ]).then(([dur, fullSrc]) => {
        addVideo(fullSrc, dur);
      });
      videoEl.onerror = () => console.warn('Erro ao carregar vídeo:', file.name, file.type);
      videoEl.load();
    });
    e.target.value = '';
  };



  const decodeWaveformFromBuffer = async (arrayBuffer) => {
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const buffer = await ac.decodeAudioData(arrayBuffer);
      const sampleCount = 1200;
      const channelL = buffer.getChannelData(0);
      const channelR = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
      const blockSize = Math.floor(channelL.length / sampleCount);
      const peaks = Array.from({ length: sampleCount }, (_, i) => {
        const start = i * blockSize;
        let max = 0;
        for (let j = 0; j < blockSize; j++) {
          const idx = start + j;
          const l = Math.abs(channelL[idx] || 0);
          const r = channelR ? Math.abs(channelR[idx] || 0) : 0;
          const v = channelR ? (l + r) / 2 : l;
          if (v > max) max = v;
        }
        return max;
      });
      setWaveformPeaks(peaks);
      ac.close();
    } catch {
      setWaveformPeaks([]);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioSrc(URL.createObjectURL(file));
      setAudioFile(file);
      setAudioMimeType(file.type || 'audio/mpeg');
      // Save as base64 for project export/import
      const b64Reader = new FileReader();
      b64Reader.onload = (ev) => setAudioBase64(ev.target.result);
      b64Reader.readAsDataURL(file);
      const decode = async () => {
        try {
          const arrayBuffer = await file.arrayBuffer();
          await decodeWaveformFromBuffer(arrayBuffer);
        } catch { void 0; }
      };
      decode();
    }
  };

  // ── Trilhas — biblioteca local (/public/trilhas) ───────────────────────────
  const BASE_URL = '/trilhas/';

  const TRILHAS_LIST = [
    { id:1,   title:'1st',                              artist:'',                          file:'1st.mp3' },
    { id:2,   title:'Electric',                         artist:'Akacia',                    file:'Akacia - Electric [NCS Release].mp3' },
    { id:3,   title:'AndreoBee Full Outro Song',        artist:'',                          file:'AndreoBee Full Outro Song(MP3_320K).mp3' },
    { id:4,   title:'Cyberpunk',                        artist:'Alex Productions',          file:'Angry Dubstep Music (No Copyright) - _Cyberpunk_ by Alex Productions ----(MP3_320K).mp3' },
    { id:5,   title:'Arms Dealer',                      artist:'Anno Domini Beats',         file:'Anno Domini Beats - Arms Dealer(MP3_160K).mp3' },
    { id:6,   title:'Glass',                            artist:'Anno Domini Beats',         file:'Anno Domini Beats - Glass(MP3_160K).mp3' },
    { id:7,   title:'Sinister',                         artist:'Anno Domini Beats',         file:'Anno Domini Beats - Sinister(MP3_160K).mp3' },
    { id:8,   title:'Arms Dealer',                      artist:'Anno Domini Beats',         file:'Arms Dealer - Anno Domini Beats.mp3' },
    { id:9,   title:'Arrival',                          artist:'',                          file:'Arrival(MP3_320K).mp3' },
    { id:10,  title:'Tin Man',                          artist:'Ava Low',                   file:'Ava Low - Tin man (Royalty Free Music)(MP3_320K).mp3' },
    { id:11,  title:'Awake',                            artist:'Sappheiros',                file:'Awake_ by _Sappheiros  _ ---- Chinese Electronic Music (No Copyright)(MP3_320K).mp3' },
    { id:12,  title:'Back To 1981',                     artist:'Iaio',                      file:'Back to 1981 _ Iaio _ Free Background Music _ Audio Library Release(MP3_160K).mp3' },
    { id:13,  title:'Bathtub Explorations',             artist:'',                          file:'Bathtub Explorations(M4A_128K).mp3' },
    { id:14,  title:'Alone',                            artist:'BEAUZ & Heleen',            file:'BEAUZ & Heleen - Alone [NCS Release].mp3' },
    { id:15,  title:'Book The Rental Wit It',           artist:'RAGE',                      file:'Book The Rental Wit It - RAGE.mp3' },
    { id:16,  title:'Breakpoint',                       artist:'Eoin Mantell',              file:'Breakpoint - Eoin Mantell(MP3_320K).mp3' },
    { id:17,  title:'CarryMinati Background Music 2',   artist:'',                          file:'CarryMinati Background Music _2(MP3_320K).mp3' },
    { id:18,  title:'CarryMinati Background Music',     artist:'',                          file:'CarryMinati BackGround Music(MP3_320K).mp3' },
    { id:19,  title:'Traveller',                        artist:'Unfeel',                    file:'Chill Electronic Calm by unfeel [No Copyright Music] _ Traveller(MP3_320K).mp3' },
    { id:20,  title:'Breakfast In Paris',               artist:'Alex-Productions',          file:'Chilling Stylish Lo-Fi Hip Hop by Alex-Productions [No Copyright Music] _ Breakfast in Paris(MP3_160K).mp3' },
    { id:21,  title:'Chosen One',                       artist:'Verified Picasso',          file:'Chosen One - Verified Picasso.mp3' },
    { id:22,  title:'Tales From The Grave',             artist:'Christoffer Moe Ditlevsen', file:'Christoffer Moe Ditlevsen - Tales From the Grave (Royalty Free Music)(MP3_320K).mp3' },
    { id:23,  title:'Cinema',                           artist:'',                          file:'Cinematic Background Music for videos (No Copyright Music) _ CINEMA(MP3_160K).mp3' },
    { id:24,  title:'Epic Shield',                      artist:'Alex-Productions',          file:'Cinematic Epic Orchestra by Alex-Productions [No Copyright Music] _ Epic Shield(MP3_160K).mp3' },
    { id:25,  title:'Call Of Duty Black Ops Main Theme',artist:'Cold War',                  file:'Cold War_ - Call of Duty®_ Black Ops Cold War Main Theme(MP3_320K).mp3' },
    { id:26,  title:'Comedy Music Background',          artist:'',                          file:'COMEDY MUSIC BACKGROUND INSTRUMENTAL _ NO COPYRIGHT BACKGROUND MUSIC(MP3_320K).mp3' },
    { id:27,  title:'Comical Question Mark',            artist:'',                          file:'Comical Question Mark   Sound Effect for editing   Free Copyright(MP3_320K).mp3' },
    { id:28,  title:'Contrast',                         artist:'Anno Domini Beats',         file:'Contrast - Anno Domini Beats.mp3' },
    { id:29,  title:'Eastridge Turnstile',              artist:'The Loyalist',              file:'Copyright Free Aesthetic Music - _Eastridge Turnstile_ by The Loyalist ----(MP3_320K).mp3' },
    { id:30,  title:'Reality',                          artist:'ASHUTOSH',                  file:'Copyright Free Indian Music [Chill   Trap] _Reality_ by _ASHUTOSH  ----(MP3_320K).mp3' },
    { id:31,  title:'Night City',                       artist:'MokkaMusic',                file:'Cozy Lo Fi Background [Calm Music] by MokkaMusic _ Night City(MP3_320K).mp3' },
    { id:32,  title:'Crazy',                            artist:'Patrick Patrikios',         file:'Crazy - Patrick Patrikios.mp3' },
    { id:33,  title:'Culture',                          artist:'Anno Domini Beats',         file:'Culture - Anno Domini Beats.mp3' },
    { id:34,  title:'Cutting It Close',                 artist:'DJ Freedem',                file:'Cutting It Close - DJ Freedem.mp3' },
    { id:35,  title:'Risky Business',                   artist:'Infraction',                file:'Cyberpunk Electro Retro by Infraction [No Copyright Music] _ Risky Business(MP3_320K).mp3' },
    { id:36,  title:'Big Plans',                        artist:'Dancehall Riddim',          file:'Dancehall Riddim Instrumental 2023 - Big Plans(MP3_160K).mp3' },
    { id:37,  title:'Dark Tranquility',                 artist:'Anno Domini Beats',         file:'Dark Tranquility - Anno Domini Beats.mp3' },
    { id:38,  title:'Dark Zephyr',                      artist:'Audio Hertz',               file:'Dark Zephyr - Audio Hertz.mp3' },
    { id:39,  title:'Deathtown',                        artist:'',                          file:'Deathtown - [FREE NO COPYRIGHT BEAT 2023].mp3' },
    { id:40,  title:'Darix Togni',                      artist:'Digi G Alessio',            file:'Digi G_Alessio - Darix Togni(MP3_320K).mp3' },
    { id:41,  title:'Doraemon No Uta',                  artist:'Doraemon Lofi',             file:'doraemon lofi _ doraemon no uta (theme song)(MP3_320K).mp3' },
    { id:42,  title:'Doraemon',                         artist:'',                          file:'Doraemon(MP3_320K).mp3' },
    { id:43,  title:'Drop',                             artist:'Anno Domini Beats',         file:'Drop - Anno Domini Beats.mp3' },
    { id:44,  title:'Eine Kleine Nachtmusik',           artist:'Mozart',                    file:'Eine Kleine Nachtmusik - Mozart(MP3_320K).mp3' },
    { id:45,  title:'El Secreto',                       artist:'Yung Logos',                file:'El Secreto - Yung Logos.mp3' },
    { id:46,  title:'How Many Times',                   artist:'Alex-Productions',          file:'Electronic Hybrid Future Bass by Alex-Productions [No Copyright Music] _ How Many Times(MP3_160K).mp3' },
    { id:47,  title:'Warrior',                          artist:'Yoitrax',                   file:'Electronic Japanese Music (Royalty Free) - _Warrior_ by Yoitrax(MP3_320K).mp3' },
    { id:48,  title:'Cinematic',                        artist:'Aylex',                     file:'Epic Trailer Build-up Free No Copyright Legendary Movie_Film Background Music _ Cinematic by Aylex(MP3_160K).mp3' },
    { id:49,  title:'Ritmo',                            artist:'Alex-Productions',          file:'Extreme Electronic Stomp Trailer  by Alex-Productions [No Copyright Music] _ Ritmo(MP3_160K).mp3' },
    { id:50,  title:'Fight',                            artist:'Alex-Productions',          file:'Extreme Powerful Energetic Midtempo Cyberpunk music by Alex-Productions (No Copyright Music ) Fight(MP3_160K).mp3' },
    { id:51,  title:'Push',                             artist:'Alex-Productions',          file:'Extreme Sport Electronic Stomp by Alex-Productions [No Copyright Music] _ Push(MP3_160K).mp3' },
    { id:52,  title:'Faraway',                          artist:'Lucjo',                     file:'Faraway _ Lucjo _ Free Background Music _ Audio Library Release(MP3_160K).mp3' },
    { id:53,  title:'Magazines',                        artist:'Infraction',                file:'Fashion Calm Technology by Infraction [No Copyright Music] _ Magazines(MP3_320K).mp3' },
    { id:54,  title:'Stand Up',                         artist:'Infraction',                file:'Fashion Saxophone Rnb Beat by Infraction [No Copyright Music] _ Stand Up(MP3_160K).mp3' },
    { id:55,  title:'Feelin Fine',                      artist:'Infraction',                file:'Fashion Saxophone Trap by Infraction [Copyright Free Music] _ Feelin Fine(MP3_320K).mp3' },
    { id:56,  title:'Sunset Lounge',                    artist:'Infraction',                file:'Fashion Stylish House by Infraction_ OddVision [No Copyright Music] _ Sunset Lounge(MP3_320K).mp3' },
    { id:57,  title:'Whistling Rap',                    artist:'Infraction',                file:'Fashion Stylish R_B by Infraction [No Copyright Music] _ Whistling Rap(MP3_160K).mp3' },
    { id:58,  title:'Chilling Time',                    artist:'Infraction',                file:'Fashion Vlog Lo-Fi Hip-Hop by OddVision_ Infraction [No Copyright Music] _ Chilling Time(MP3_320K).mp3' },
    { id:59,  title:'Matrix',                           artist:'FAYZED',                    file:'FAYZED - MATRIX - Hard Flute Type Beat - Trap Instrumental Beat [ FREE NO COPYRIGHT MUSIC ](MP3_160K).mp3' },
    { id:60,  title:'Feel',                             artist:'Land Of Fire',              file:'Feel - Land of Fire (No Copyright Music) _ Release Preview(MP3_320K).mp3' },
    { id:61,  title:'Finally The Sun',                  artist:'NCS FF',                    file:'Finally The Sun _ Fact Background Music _ NCS FF(MP3_320K).mp3' },
    { id:62,  title:'Flute Beat',                       artist:'BeatboX',                   file:'Flute Beat Copyright Free Music  __ [BeatboX](MP3_320K).mp3' },
    { id:63,  title:'Heads Up',                         artist:'',                          file:'FREE BEATS NO COPYRIGHT - _Heads Up_ _ Free Type Beat _ Hype Type Trap Beat Instrumental(MP3_160K).mp3' },
    { id:64,  title:'Cutthroat',                        artist:'Syndrome',                  file:'FREE Old School Dark Rap Beat _ Cutthroat (Prod. By Syndrome)(MP3_160K).mp3' },
    { id:65,  title:'Swoosh Whoosh',                    artist:'',                          file:'FREE Transition Sounds Effects_ _ Swoosh_ Swish_ Whoosh(MP3_320K).mp3' },
    { id:66,  title:'Funky Thing',                      artist:'Infraction',                file:'Funk Stylish Groove by Infraction [No Copyright Music] _ Funky Thing(MP3_320K).mp3' },
    { id:67,  title:'Funky Background Music',           artist:'',                          file:'Funky Background Music For Video __ Royalty Free Funk Music(MP3_160K).mp3' },
    { id:68,  title:'Scheming Weasel',                  artist:'Kevin MacLeod',             file:'Funny Background Music _ Music _04 Scheming Weasel(Kevin MacLeod) _ NO COPYRIGHT _ SS 1912(MP3_320K).mp3' },
    { id:69,  title:'AndreoBee Song',                   artist:'',                          file:'funny background song_ AndreoBee song(MP3_320K).mp3' },
    { id:70,  title:'Glass',                            artist:'Anno Domini Beats',         file:'Glass - Anno Domini Beats.mp3' },
    { id:71,  title:'Gully Dreams',                     artist:'Hanu Dixit',                file:'Gully Dreams - Hanu Dixit.mp3' },
    { id:72,  title:'Whistle',                          artist:'Alex Productions',          file:'Vlog _ Happy Lofi (Music For Videos) - _Whistle_ by Alex Productions ----(MP3_160K).mp3' },
    { id:73,  title:'Russian Slav',                     artist:'Leo',                       file:'Hard Bass Type Beat Russian _Slav_ (prod. Leo) hard bass type beat(MP3_320K).mp3' },
    { id:74,  title:'Hidden',                           artist:'Alex-Productions',          file:'Hidden ÔÇª Alex-Productions (No Copyright Music)(MP3_160K).mp3' },
    { id:75,  title:'Hopeless',                         artist:'Jimena Contreras',          file:'Hopeless - Jimena Contreras.mp3' },
    { id:76,  title:'Horror Background Music',          artist:'',                          file:'Horror Music No Copyright]Horror Background Music No Copyright - Non Copyrighted Scary Music(MP3_320K).mp3' },
    { id:77,  title:'Illusions',                        artist:'Anno Domini Beats',         file:'Illusions - Anno Domini Beats.mp3' },
    { id:78,  title:'Indian Bollywood Sampled',         artist:'',                          file:'Indian Bollywood Sampled x West ).mp3' },
    { id:79,  title:'Ethereal Dream',                   artist:'Artificial Music',          file:'Indian R_B Electronic Music (For Videos) - _Ethereal Dream_ by Artificial.Music _ ASHUTOSH(MP3_320K).mp3' },
    { id:80,  title:'Inspire',                          artist:'ASHUTOSH',                  file:'Royalty Free Indian Electronic Music (For Videos) - _Inspire_ by ASHUTOSH ----(MP3_320K).mp3' },
    { id:81,  title:'Instrumental Trap 11',             artist:'',                          file:'FREE INSTRUMENTAL TRAP _11(MP3_160K).mp3' },
    { id:82,  title:'Instrumental Trap 8',              artist:'',                          file:'FREE INSTRUMENTAL TRAP _8(MP3_160K).mp3' },
    { id:83,  title:'Intense Action',                   artist:'Argsound',                  file:'Intense Action Background Music _ Cinematic Music by Argsound(MP3_320K).mp3' },
    { id:84,  title:'It Takes Two To Tango',            artist:'Vanoss Gaming',             file:'It Takes Two to Tango - Vanoss Gaming Background Music (HD)(MP3_320K).mp3' },
    { id:85,  title:'Jazz In Paris',                    artist:'',                          file:'Jazz In Paris(MP3_320K).mp3' },
    { id:86,  title:'Jazz Hip Hop',                     artist:'Cosimo Fogg',               file:'Jazzaddicts_ by Cosimo Fogg ---- _ Jazz Hip Hop (No Copyright Music) --(MP3_160K).mp3' },
    { id:87,  title:'Bus Rider',                        artist:'John Swihart',              file:'John Swihart -- Bus Rider(MP3_320K).mp3' },
    { id:88,  title:'Klondike',                         artist:'Audio Hertz',               file:'Klondike - Audio Hertz.mp3' },
    { id:89,  title:'Late Night Driving',               artist:'Broke In Summer',           file:'Late Night Driving _ Broke In Summer _ Free Background Music _ Audio Library Release(MP3_320K).mp3' },
    { id:90,  title:'Heroic',                           artist:'Alex-Productions',          file:'Legendary Epic Heroic Cinematic Music by Alex-Productions (No Copyright Music) Free Music _ Heroic(MP3_160K).mp3' },
    { id:91,  title:'Less Rake',                        artist:'Tubebackr',                 file:'Less Rake ÔÇª tubebackr (No Copyright Music)(MP3_160K).mp3' },
    { id:92,  title:'Chill Vibes',                      artist:'Pufino',                    file:'Lofi Hip Hop Beat No Copyright Free Soft _ Calm Aesthetic Background Music _ Chill Vibes by Pufino(MP3_160K).mp3' },
    { id:93,  title:'Forgive Me',                       artist:'Italics',                   file:'Lofi Hip Hop Instrumental_ Rap [ FREE NO COPYRIGHT SOUND ] [ Chill Type Beat ] ITALICS - Forgive Me(MP3_160K).mp3' },
    { id:94,  title:'Blue Moon',                        artist:'Lo-fi Type Beat',           file:'Lo-fi Type Beat - Blue Moon(MP3_160K).mp3' },
    { id:95,  title:'Lottery',                          artist:'Anno Domini Beats',         file:'Lottery - Anno Domini Beats.mp3' },
    { id:96,  title:'Luck Witch',                       artist:'Audio Hertz',               file:'Luck Witch - Audio Hertz.mp3' },
    { id:97,  title:'Mario Jump Sound Effect',          artist:'',                          file:'Mario jump sound effect (download)(M4A_128K).m4a' },
    { id:98,  title:'Take It Easy',                     artist:'MBB',                       file:'MBB - Take It Easy (MP3).mp3' },
    { id:99,  title:'Mission Start',                    artist:'The Brothers Records',      file:'Mission Start - The Brothers Records.mp3' },
    { id:100, title:'Mission To Mars',                  artist:'Audio Hertz',               file:'Mission to Mars - Audio Hertz.mp3' },
    { id:101, title:'Mixkit CBPD 400',                  artist:'',                          file:'mixkit-cbpd-400.mp3' },
    { id:102, title:'Mr Gyani Fact',                    artist:'NCS FF',                    file:'Mr Gyani Fact _ Fact Background Music _ NCS FF(MP3_320K).mp3' },
    { id:103, title:'Never Surrender',                  artist:'Anno Domini Beats',         file:'Never Surrender - Anno Domini Beats.mp3' },
    { id:104, title:'Ember',                            artist:'Kubbi',                     file:'Kubbi - Ember [Chiptune](MP3_160K).mp3' },
    { id:105, title:'Circles',                          artist:'Lensko',                    file:'Lensko - Circles [Norwegian House](MP3_320K).mp3' },
    { id:106, title:'Groove Day Hip Hop Beat',          artist:'',                          file:'No_Copyright_Groove_Day_Hip_Hop_Beat_Groove_and_Modern_Background.mp3' },
    { id:107, title:'Resonate',                         artist:'Aoeris',                    file:'Non Copyrighted Music _ Aoeris - Resonate [BC Release](MP3_320K).mp3' },
    { id:108, title:'Herbal Tea',                       artist:'SmartToaster',              file:'SmartToaster  - Herbal Tea [Lo-fi](MP3_160K).mp3' },
    { id:109, title:'Not For Nothing',                  artist:'Otis McDonald',             file:'Not For Nothing ÔÇª Otis McDonald (No Copyright Music)(MP3_320K).mp3' },
    { id:110, title:'Chase',                            artist:'Alexander Nakarada',        file:'ÔÅ® Royalty Free Chase Fast Music (For Videos) - _Chase_ by Alexander Nakarada ----(MP3_320K).mp3' },
    { id:111, title:'Oh What A Whirl',                  artist:'',                          file:'Oh What A Whirl(MP3_320K).mp3' },
    { id:112, title:'Okay Energy',                      artist:'',                          file:'Okay Energy(MP3_160K).mp3' },
    { id:113, title:'Her Name Is Edith',                artist:'OTE',                       file:'OTE - Her Name Is Edith (Instrumental Version) (Royalty Free Music)(MP3_320K).mp3' },
    { id:114, title:'Orange Marmalade',                 artist:'OTE',                       file:'OTE - Orange Marmalade (Royalty Free Music)(MP3_320K).mp3' },
    { id:115, title:'Sea Lion',                         artist:'OTE',                       file:'OTE - Sea Lion (Royalty Free Music)(MP3_320K).mp3' },
    { id:116, title:'Out Of The Blue',                  artist:'Aldenmark Niklasson',       file:'Out Of The Blue [Instrumental Version] by Aldenmark Niklasson - [2010s Pop Music](MP3_320K).mp3' },
    { id:117, title:'Palm City Getaway',                artist:'',                          file:'Palm City- Getaway Instrumental (Ryan Trahan Donation List Music)(MP3_320K).mp3' },
    { id:118, title:'Past',                             artist:'Alex-Productions',          file:'PAST ÔÇª Alex-Productions (No Copyright Music)(MP3_160K).mp3' },
    { id:119, title:'Forget Me Not',                    artist:'Patrick Patrikios',         file:'Patrick Patrikios _ Forget Me Not(MP3_320K).mp3' },
    { id:120, title:'Powerful Indie Rock',              artist:'Alex-Productions',          file:'Powerful Indie Rock music by Alex-Productions (No Copyright Music) _ Promotional Video(MP3_160K).mp3' },
    { id:121, title:'Strong',                           artist:'Alex-Productions',          file:'Powerful Trap Beat By Alex-Productions ( No Copyright Music ) _ Extreme  Car Trap Music _ Strong _(MP3_160K).mp3' },
    { id:122, title:'The Goat',                         artist:'Alex-Productions',          file:'Powerful Upbeat Energetic Lo-Fi Hip Hop by Alex-Productions [No Copyright Music] _ The GOAT(MP3_160K).mp3' },
    { id:123, title:'Pray',                             artist:'Anno Domini Beats',         file:'Pray - Anno Domini Beats.mp3' },
    { id:124, title:'ProBoiz 95 Outro Song',            artist:'',                          file:'ProBoiz 95 Outro Song ----------(SONG NAME___)(MP3_320K).mp3' },
    { id:125, title:'Firefly',                          artist:'Quincas Moreira',           file:'Quincas Moreira _ Firefly(MP3_320K).mp3' },
    { id:126, title:'Racing',                           artist:'Alex-Productions',          file:'Racing Sport Gaming by Alex-Productions [No Copyright Music] _ RACING _ FREE MUSIC DOWNLOAD _(MP3_160K).mp3' },
    { id:127, title:'Funny Background Music',           artist:'NCS FF',                    file:'RAOST (FUNNY) BACKGROUND MUSIC _ NCS FF(MP3_320K).mp3' },
    { id:128, title:'Funny Background Music 1',         artist:'NCS FF',                    file:'RAOST (FUNNY) BACKGROUND MUSIC _ NCS FF(MP3_320K)_1.mp3' },
    { id:129, title:'Rebel',                            artist:'Alex-Productions',          file:'Rebel ÔÇª Alex-Productions (No Copyright Music)(MP3_160K).mp3' },
    { id:130, title:'Game Over',                        artist:'',                          file:'Royalty Free Heavy Metal Instrumental - Game Over(MP3_320K).mp3' },
    { id:131, title:'Runaway Deer',                     artist:'',                          file:'Runaway Deer(MP3_320K).mp3' },
    { id:132, title:'Schizo',                           artist:'Anno Domini Beats',         file:'Schizo - Anno Domini Beats.mp3' },
    { id:133, title:'Ave Maria',                        artist:'Schubert',                  file:'Schubert - Ave Maria(MP3_320K).mp3' },
    { id:134, title:'Pleasant',                         artist:'SebastiAn',                 file:'SebastiAn - Pleasant(MP3_320K).mp3' },
    { id:135, title:'Serial Killer Music',              artist:'',                          file:'Serial Killer Music [No Copyright Background  Music] _ Royalty Free Background music _ Audio Instore(MP3_320K).mp3' },
    { id:136, title:'Shake',                            artist:'Anno Domini Beats',         file:'Shake - Anno Domini Beats.mp3' },
    { id:137, title:'Sinister',                         artist:'Anno Domini Beats',         file:'Sinister - Anno Domini Beats.mp3' },
    { id:138, title:'Skylines',                         artist:'Anno Domini Beats',         file:'Skylines - Anno Domini Beats.mp3' },
    { id:139, title:'Spaceship',                        artist:'',                          file:'Spaceship.mp3' },
    { id:140, title:'Happy Go Lively',                  artist:'SpongeBob Music',           file:'SpongeBob Music_ Happy-Go-Lively(MP3_320K).mp3' },
    { id:141, title:'House Of Horror',                  artist:'SpongeBob Production Music',file:'SpongeBob Production Music House of Horror(MP3_320K).mp3' },
    { id:142, title:'Digital Love',                     artist:'Alex-Productions',          file:'Sport Future Bass Energy by Alex-Productions ]No Copyright music] _ Digital Love(MP3_160K).mp3' },
    { id:143, title:'Bubbles',                          artist:'Alex-Productions',          file:'Sport Percussive Rap by Alex-Productions (No Copyright Music) _ Bubbles(MP3_160K).mp3' },
    { id:144, title:'Full Speed',                       artist:'Infraction',                file:'Sport Racing Electro Punk by Infraction [No Copyright Music] _ Full Speed(MP3_320K).mp3' },
    { id:145, title:'Rock And Ride',                    artist:'Infraction',                file:'Sport Racing Rock by Infraction [No Copyright Music] _ Rock And Ride(MP3_160K).mp3' },
    { id:146, title:'Punch',                            artist:'Infraction',                file:'Sport Rock Racing Workout by Infraction [No Copyright Music] _ Punch(MP3_160K).mp3' },
    { id:147, title:'Stand',                            artist:'Anno Domini Beats',         file:'Stand - Anno Domini Beats.mp3' },
    { id:148, title:'Street Rhapsody',                  artist:'DJ Freedem',                file:'Street Rhapsody - DJ Freedem.mp3' },
    { id:149, title:'Sunny Days',                       artist:'Anno Domini Beats',         file:'Sunny Days - Anno Domini Beats.mp3' },
    { id:150, title:'Tension Music',                    artist:'',                          file:'Suspense - copyright free music - royalty free Background music - Tension Music - free to use(MP3_320K).mp3' },
    { id:151, title:'Teddy Gaming Cinematic',           artist:'',                          file:'Teddy gaming cinematic background music download _ teddy gaming cinematic background song(MP3_320K).mp3' },
    { id:152, title:'Unreal',                           artist:'Infraction',                file:'Trap Futuristic Stylish Technology by Infraction [No Copyright Music] _ Unreal(MP3_320K).mp3' },
    { id:153, title:'T-Rexed',                          artist:'Audio Hertz',               file:'T-Rexed - Audio Hertz.mp3' },
    { id:154, title:'Triple Six',                       artist:'',                          file:'Triple Six(MP3_320K).mp3' },
    { id:155, title:'Tropic',                           artist:'Anno Domini Beats',         file:'Tropic - Anno Domini Beats.mp3' },
    { id:156, title:'Tropic Fuse',                      artist:'French Fuse',               file:'Tropic Fuse - French Fuse.mp3' },
    { id:157, title:'The Disc',                         artist:'Infraction',                file:'Upbeat Dance Funk Pop by Infraction [No Copyright Music] _ The Disc(MP3_320K).mp3' },
    { id:158, title:'Jazzy',                            artist:'Infraction',                file:'Upbeat Energetic Hip-Hop by Infraction [No Copyright Music] _ Jazzy(MP3_160K).mp3' },
    { id:159, title:'Groovy Town',                      artist:'Infraction',                file:'Upbeat Funk Positive by Infraction [No Copyright Music] _ Groovy Town(MP3_320K).mp3' },
    { id:160, title:'Upbeat Funky Background Music',    artist:'',                          file:'Upbeat Funky Background Music for Video __ ROYALTY FREE Funk Music for Commercial Use(MP3_160K).mp3' },
    { id:161, title:'Upbeat Hip Hop',                   artist:'',                          file:'Upbeat Hip Hop Background Music for Videos (No Copyright)(MP3_160K).mp3' },
    { id:162, title:'Shake Head',                       artist:'Infraction',                file:'Upbeat Reggaeton Latin by Infraction [No Copyright Music] _ Shake Head(MP3_160K).mp3' },
    { id:163, title:'Uplifting Hip Hop',                artist:'',                          file:'Uplifting Hip Hop Background Music for Videos (Free For Non-Commercial Use)(MP3_160K).mp3' },
    { id:164, title:'Violin Instrumental',              artist:'',                          file:'Violin Instrumental No Copyright Music Royalty free violin music no copyright Free Download (320kbps).mp3' },
    { id:165, title:'Violin Instrumental 2',            artist:'',                          file:'Violin Instrumental No Copyright Music Royalty free violin music no copyright Free Download(MP3_320K).mp3' },
    { id:166, title:'Warzone',                          artist:'Anno Domini Beats',         file:'Warzone - Anno Domini Beats.mp3' },
    { id:167, title:'Where The Trap Is',                artist:'Audio Hertz',               file:'Where The Trap Is - Audio Hertz.mp3' },
    { id:168, title:'Wii Shop Channel Main Theme',      artist:'',                          file:'Wii Shop Channel Main Theme (HQ)(MP3_320K).mp3' },
    { id:169, title:'World War Outerspace',             artist:'Audio Hertz',               file:'World War Outerspace - Audio Hertz.mp3' },
    { id:170, title:'Mind Heist',                       artist:'Zack Hemsey',               file:'Zack Hemsey - _Mind Heist_(MP3_320K).mp3' },
  ];

  // ── Overlay de Vídeo ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (overlayVideoRef.current) {
      overlayVideoRef.current.pause();
      overlayVideoRef.current.src = '';
      try { document.body.removeChild(overlayVideoRef.current); } catch {}
      overlayVideoRef.current = null;
    }
    overlayReadyRef.current = false;
    if (!activeOverlay) return;
    const eff = OVERLAY_EFFECTS.find(o => o.id === activeOverlay);
    if (!eff) return;
    const vid = document.createElement('video');
    vid.src = OVERLAY_BASE_URL + encodeURIComponent(eff.file);
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.crossOrigin = 'anonymous';
    vid.style.cssText = 'position:fixed;width:1px;height:1px;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none';
    document.body.appendChild(vid);
    vid.oncanplay = () => { overlayReadyRef.current = true; vid.play().catch(() => {}); };
    overlayVideoRef.current = vid;
    vid.load();
    return () => {
      vid.pause(); vid.src = '';
      try { document.body.removeChild(vid); } catch {}
      overlayVideoRef.current = null;
      overlayReadyRef.current = false;
    };
  }, [activeOverlay]);

  const stopTrilhasPreview = () => {
    if (trilhasPreviewRef.current) {
      trilhasPreviewRef.current.pause();
      trilhasPreviewRef.current.src = '';
      trilhasPreviewRef.current = null;
    }
    setTrilhasPreviewId(null);
    setTrilhasPreviewTime(0);
  };

  const toggleTrilhasPreview = (track) => {
    if (trilhasPreviewId === track.id) { stopTrilhasPreview(); return; }
    stopTrilhasPreview();
    const url   = BASE_URL + encodeURIComponent(track.file);
    const audio = new Audio(url);
    audio.volume       = 0.75;
    audio.ontimeupdate = () => setTrilhasPreviewTime(audio.currentTime);
    audio.onended      = () => { setTrilhasPreviewId(null); setTrilhasPreviewTime(0); };
    audio.play().catch(() => {});
    trilhasPreviewRef.current = audio;
    setTrilhasPreviewId(track.id);
    setTrilhasPreviewTime(0);
  };

  const useTrilhaNoProject = async (track) => {
    setTrilhasUsingId(track.id);
    stopTrilhasPreview();
    try {
      const url  = BASE_URL + encodeURIComponent(track.file);
      const res  = await fetch(url);
      const blob = await res.blob();
      const mime = track.file.endsWith('.m4a') ? 'audio/mp4' : 'audio/mpeg';
      const objectUrl = URL.createObjectURL(blob);
      setAudioSrc(objectUrl);
      setAudioMimeType(mime);
      setAudioFile(new File([blob], track.file, { type: mime }));
      const ab64Reader  = new FileReader();
      ab64Reader.onload = (ev) => setAudioBase64(ev.target.result);
      ab64Reader.readAsDataURL(blob);
      const arrayBuffer = await blob.arrayBuffer();
      await decodeWaveformFromBuffer(arrayBuffer);
      setShowTrilhasPanel(false);
      setShowMidiasPanel(false);
    } catch { alert('Erro ao carregar trilha. Verifique sua conexão.'); }
    setTrilhasUsingId(null);
  };

  const fmtDur = (s) => {
    const m  = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  };

  useEffect(() => {
    const lines = bulkText.split('\n').filter(l => l.trim() !== '');
    setTextLines(lines);
    setCurrentLineIndex(0);
  }, [bulkText]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gc_project');
      if (saved) {
        const p = JSON.parse(saved);
        if (p.bulkText !== undefined) setBulkText(p.bulkText);
        if (Array.isArray(p.lyrics)) setLyrics(p.lyrics);
        if (Array.isArray(p.images)) {
          const loadedImages = p.images.map((item) => {
            const img = new Image();
            const id = item.id || Date.now() + Math.random();
            img.onload = () => {
              if (item.width && item.height && item.x !== undefined && item.y !== undefined) return;
              const placement = buildImagePlacement(img);
              setImages(prevImages => prevImages.map((imgItem) => imgItem.id === id ? { ...imgItem, ...placement } : imgItem));
            };
            img.src = item.src;
            return {
              id,
              src: item.src,
              img,
              start: item.start ?? 0,
              end: item.end ?? 3,
              x: item.x ?? 40,
              y: item.y ?? 60,
              width: item.width ?? 180,
              height: item.height ?? 180,
              radius: item.radius ?? 18,
              rotation: item.rotation ?? 0,
              filters: item.filters || {},
              transitionIn:     item.transitionIn     || 'none',
              transitionOut:    item.transitionOut    || 'none',
              transitionInDur:  item.transitionInDur  ?? 0.35,
              transitionOutDur: item.transitionOutDur ?? 0.35,
            };
          });
          setImages(loadedImages);
        }
        if (Array.isArray(p.extraTexts)) setExtraTexts(p.extraTexts);
        if (Array.isArray(p.stickers)) {
          setStickers(p.stickers);
        }
        if (Array.isArray(p.frames)) setFrames(p.frames);
        if (Array.isArray(p.soundEffects)) setSoundEffects(p.soundEffects);
        if (p.fontSize !== undefined) setFontSize(p.fontSize);
        if (p.textColor) setTextColor(p.textColor);
        if (p.fontFamily) setFontFamily(p.fontFamily);
        if (p.zoom !== undefined) setZoom(p.zoom);
        if (p.imageSrc) {
          setImageSrc(p.imageSrc);
          const img = new Image();
          img.onload = () => setImage(img);
          img.src = p.imageSrc;
        }
        if (p.projectVolume !== undefined) setVolume(p.projectVolume);
        if (p.projectSpeed  !== undefined) setSpeed(p.projectSpeed);
        if (p.screenEffect    !== undefined) setScreenEffect(p.screenEffect);
        if (p.chromaAberration!== undefined) setChromaAberration(p.chromaAberration);
        if (p.colorCurves      !== undefined) setColorCurves(p.colorCurves);
        if (p.audioBase64) {
          setAudioBase64(p.audioBase64);
          setAudioMimeType(p.audioMimeType || 'audio/mpeg');
          setAudioSrc(p.audioBase64);
        }
      }
    } catch { void 0; }
  }, [buildImagePlacement]);

  useEffect(() => {
    const payload = {
      bulkText,
      lyrics,
      images: images.map((item) => ({
        id: item.id,
        src: item.src,
        start: item.start,
        end: item.end,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        radius: item.radius,
      rotation: item.rotation ?? 0
      })),
      extraTexts,
      fontSize,
      textColor,
      fontFamily,
      zoom,
      imageSrc,
      audioBase64: audioBase64 || null,
      audioMimeType: audioMimeType || null,
    };
    const t = setTimeout(() => {
      try {
        localStorage.setItem('gc_project', JSON.stringify(payload));
      } catch { void 0; }
    }, 400);
    return () => clearTimeout(t);
  }, [bulkText, lyrics, images, extraTexts, fontSize, textColor, fontFamily, zoom, imageSrc, audioBase64]);

  // Ref para evitar stale closure no markLyricTiming
  const textLinesRef = useRef(textLines);
  useEffect(() => { textLinesRef.current = textLines; }, [textLines]);

  // Quando usuário remove manualmente uma lyric, recalcula currentLineIndex
  // para que o contador não fique travado em "FIM"
  useEffect(() => {
    if (currentLineIndex > 0 && currentLineIndex > lyrics.length) {
      setCurrentLineIndex(lyrics.length);
    }
  }, [lyrics.length]);

  const markLyricTiming = useCallback(() => {
    const lines = textLinesRef.current;
    if (!lines || lines.length === 0) return;
    setCurrentLineIndex(prev => {
      if (prev >= lines.length) return prev;
      // Usa tempo do PROJETO (não audio.currentTime bruto):
      // audio.currentTime = tempo no arquivo; com audioTrimStart=47, começa em 47s
      // O tempo de projeto = audioOffset + (audio.currentTime - audioTrimStart)
      const startTime = audioRef.current && isPlayingRef.current
        ? (audioOffsetRef.current || 0) + (audioRef.current.currentTime - (audioTrimStartRef.current || 0))
        : virtualTimeRef.current;
      const canvas = canvasRef.current;
      const newLine = {
        id: Date.now(),
        text: lines[prev],
        start: startTime,
        end: startTime + 3,
        x: canvas ? canvas.width / 2 : 135,
        y: canvas ? Math.round(canvas.height / 2) : 240,
        rotation: 0,
        fontSize: fontSizeRef.current,
        fontFamily: fontFamilyRef.current,
        animType: animTypeRef.current,
        twSpeed:  twSpeedRef.current,
      };
      pushHistory();
      setLyrics(prevLyrics => [...prevLyrics, newLine].sort((a, b) => a.start - b.start));
      return prev + 1;
    });
  }, []);

  // Função para adicionar novo texto fixo na tela
  const addExtraText = () => {
    if (!newExtraInput.trim()) return;
    pushHistory();
    const newItem = {
      id: Date.now(),
      text: newExtraInput,
      x: 135,
      y: 80 + (extraTexts.length * 50),
      rotation: 0,
      color: extraTextColor,
      fontFamily: extraTextFontFamily,
      fontSize: extraTextFontSize,
    };
    const newId = newItem.id;
    setExtraTexts(prev => [...prev, newItem]);
    setActiveExtraTextId(newId);
    setNewExtraInput('');
  };

  // Função para remover texto extra
  const removeExtraText = (id) => {
    pushHistory();
    setExtraTexts(extraTexts.filter(t => t.id !== id));
  };



  // ── Undo/Redo helpers ────────────────────────────────────────────────────
  // Captura um snapshot do estado atual para o histórico
  // requestHistory: sinaliza que a PRÓXIMA renderização deve gravar um snapshot.
  // O snapshot é capturado no useEffect abaixo, DEPOIS que o React comita o estado —
  // isso garante que os valores gravados são exatamente os do estado pós-ação,
  // independente de batching ou timing de useEffects de sincronização de refs.
  const requestHistory = useCallback(() => {
    if (!isUndoingRef.current) pendingHistoryRef.current = true;
  }, []);

  // Alias para compatibilidade com chamadas que ainda usam pushHistory
  const pushHistory = requestHistory;

  const applySnapshot = useCallback((snap) => {
    isUndoingRef.current = true;
    // Background
    if (snap.imageSrc) {
      setImageSrc(snap.imageSrc);
      const bg = new Image();
      bg.onload = () => setImage(bg);
      bg.src = snap.imageSrc;
    } else {
      setImageSrc(null);
      setImage(null);
    }
    // Overlay images — reusa img element se id bater, senão recria
    setImages(snap.images.map(item => {
      const existing = (imagesRef.current || []).find(i => i.id === item.id);
      if (existing?.img) return { ...item, img: existing.img };
      const img = new Image();
      img.src = item.src || '';
      return { ...item, img };
    }));
    // Videos — usa allVideoEls como fonte definitiva (nunca perde um videoEl)
    const restoredVideos = snap.videos.map(v => {
      // Lookup no registry completo de todos os videos já carregados
      const registered = allVideoEls.current[v.id];
      if (registered?.videoEl) {
        const el = registered.videoEl;
        // Reanexa ao DOM se foi removido
        if (!el.parentNode) {
          el.style.cssText = 'position:fixed;width:1px;height:1px;visibility:hidden;pointer-events:none;top:-9999px;left:-9999px';
          document.body.appendChild(el);
        }
        el.pause();
        el.muted = true;
        // Se readyState zerou, força reload mantendo src
        if (el.readyState === 0 && el.src) { el.load(); }
        return { ...v, videoEl: el, audioBuffer: registered.audioBuffer };
      }
      // Fallback — também checa trash legacy
      const trashed = videoTrashRef.current[v.id];
      if (trashed?.videoEl) {
        const el = trashed.videoEl;
        if (!el.parentNode) {
          el.style.cssText = 'position:fixed;width:1px;height:1px;visibility:hidden;pointer-events:none;top:-9999px;left:-9999px';
          document.body.appendChild(el);
        }
        el.pause(); el.muted = true;
        if (el.readyState === 0 && el.src) { el.load(); }
        delete videoTrashRef.current[v.id];
        return { ...v, videoEl: el, audioBuffer: trashed.audioBuffer };
      }
      return v;
    });
    setVideos(restoredVideos);
    // Reseta o playhead para o início do primeiro vídeo restaurado (se houver)
    // para garantir que fique visível no canvas imediatamente
    if (restoredVideos.length > 0 && snap.videos.length > 0) {
      const firstVid = restoredVideos[0];
      if (firstVid?.videoEl) {
        const targetTime = firstVid.start ?? 0;
        virtualTimeRef.current = targetTime;
        setCurrentTime(targetTime);
      }
    }
    setExtraTexts(snap.extraTexts);
    setLyrics(snap.lyrics);
    setStickers(snap.stickers);
    if (snap.frames) setFrames(snap.frames);
    setScreenEffect(snap.screenEffect);
    setSoundEffects(snap.soundEffects);
    setColorCurves(snap.colorCurves);
    // Libera o lock após dois ticks para que todos os useEffects de sync rodem
    setTimeout(() => { isUndoingRef.current = false; }, 80);
  }, []);

  const undo = useCallback(() => {
    const idx = historyIdxRef.current;
    if (idx <= 0) return;
    const newIdx = idx - 1;
    historyIdxRef.current = newIdx;
    applySnapshot(historyRef.current[newIdx]);
    setCanUndo(newIdx > 0);
    setCanRedo(true);
  }, [applySnapshot]);

  const redo = useCallback(() => {
    const idx    = historyIdxRef.current;
    const hist   = historyRef.current;
    if (idx >= hist.length - 1) return;
    const newIdx = idx + 1;
    historyIdxRef.current = newIdx;
    applySnapshot(hist[newIdx]);
    setCanUndo(true);
    setCanRedo(newIdx < hist.length - 1);
  }, [applySnapshot]);

  const addSticker = (type, content, animStyle = null) => {
    pushHistory();
    const canvas = canvasRef.current;
    const cw = canvas?.width  || 720;
    const ch = canvas?.height || 480;
    const size = Math.round(Math.min(cw, ch) * 0.12);
    // Sticker aparece a partir do tempo atual e dura 3 segundos por padrão
    const tNow = virtualTimeRef.current;
    const maxEnd = Math.max(duration || 0,
      videosRef.current.reduce((m, v) => Math.max(m, v.end || 0), 0),
      lyricsRef.current.reduce((m, l) => Math.max(m, l.end || 0), 0),
    ) || (tNow + 5);
    setStickers(prev => [...prev, {
      id: Date.now() + Math.random(),
      type, content, animStyle, size, rotation: 0,
      x: Math.round(cw / 2 + (Math.random() - 0.5) * cw * 0.3),
      y: Math.round(ch / 2 + (Math.random() - 0.5) * ch * 0.3),
      start: tNow,
      end: Math.min(tNow + 3, maxEnd),
    }]);
  };

  const removeSticker = (id) => { pushHistory(); setStickers(prev => prev.filter(s => s.id !== id)); };

  const removeLyric = (id) => {
    pushHistory();
    setLyrics(lyrics.filter(l => l.id !== id));
  };

  // ── Helpers Web Audio para vídeos ──────────────────────────────────────────
  // Para TODAS as fontes de áudio de vídeo ativas
  const stopAllVideoAudio = () => {
    const nodes = videoAudioNodes.current;
    Object.values(nodes).forEach(({ source, gainNode }) => {
      try { source.stop(); } catch {}
      try { gainNode.disconnect(); } catch {}
    });
    videoAudioNodes.current = {};
  };

  // Inicia o áudio Web Audio de um vídeo a partir de um offset no projeto

  const addSfxToTimeline = (key) => {
    const startTime = virtualTimeRef.current;
    setSoundEffects(prev => [...prev, { id: Date.now(), key, startTime, volume: 1 }]);
    setShowSfxPanel(false);
  };
  const startVideoAudio = (v, tProject) => {
    if (!v.audioBuffer || v.muted) return;
    const ac = videoAudioACRef.current;
    if (!ac || ac.state === 'closed') return;

    // Para fonte anterior deste vídeo (se houver)
    const prev = videoAudioNodes.current[v.id];
    if (prev) { try { prev.source.stop(); } catch {} try { prev.gainNode.disconnect(); } catch {} }

    const trimSt   = v.trimStart ?? 0;
    const vidSpd   = v.vidSpeed ?? 1;
    const projSpd  = projectSpeedRef.current ?? 1;
    const effSpd   = vidSpd * projSpd;

    const bufOffset    = Math.max(0, trimSt + (tProject - v.start) * vidSpd);
    const wallDuration = Math.max(0, (v.end - tProject) / projSpd);
    if (wallDuration < 0.05) return;

    const gainNode = ac.createGain();
    gainNode.gain.value = Math.max(0, Math.min(1, projectVolumeRef.current * (v.vidVolume ?? 1)));
    gainNode.connect(ac.destination);

    const source = ac.createBufferSource();
    source.buffer = v.audioBuffer;
    source.playbackRate.value = effSpd;
    source.connect(gainNode);

    // Registra o nó ANTES do resume para que chamadas concorrentes não iniciem
    // uma segunda fonte enquanto o resume ainda está pendente
    videoAudioNodes.current[v.id] = { source, gainNode };
    source.onended = () => {
      delete videoAudioNodes.current[v.id];
      try { gainNode.disconnect(); } catch {}
    };

    // source.start() DEVE ser chamado após o AC estar resumed.
    // Se chamado com AC suspended, a fonte só começa quando o browser
    // resolver o resume (pode ser ao chamar audio.play() segundos depois)
    // → áudio do vídeo fica mudo até o áudio principal iniciar.
    const doStart = () => {
      // Recalcula bufOffset com o tempo atual caso tenha havido atraso no resume
      const tNow = virtualTimeRef.current;
      const bufOff2 = Math.max(0, trimSt + (tNow - v.start) * vidSpd);
      const wallDur2 = Math.max(0, (v.end - tNow) / projSpd);
      if (wallDur2 < 0.05) return;
      try { source.start(0, bufOff2, wallDur2); } catch {}
    };

    if (ac.state === 'suspended') {
      ac.resume().then(doStart).catch(doStart);
    } else {
      doStart();
    }
  };

  const handleStopPlayback = () => {
    isPlayingRef.current = false;
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    if (clockIntervalRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; }
    // Para o export RT se estiver rodando
    if (exportStopRef.current) { exportStopRef.current(); exportStopRef.current = null; }
    stopAllVideoAudio();// para o áudio Web Audio dos vídeos
    virtualTimeRef.current = 0;
    setIsPlaying(false);
    // Pré-posiciona todos os vídeos no trimStart para que play() inicie sem delay
    videosRef.current.forEach(v => {
      if (!v.videoEl) return;
      v.videoEl.pause();
      const ts = v.trimStart ?? 0;
      if (Math.abs(v.videoEl.currentTime - ts) > 0.05) v.videoEl.currentTime = ts;
    });
    setCurrentTime(0);
  };


  const handleClearProject = () => {
    handleStopPlayback();
    setBulkText('');
    setLyrics([]);
    setImages([]);
    setVideos(prev => { prev.forEach(v => { if (v.videoEl) { v.videoEl.pause(); if (v.videoEl.parentNode) v.videoEl.parentNode.removeChild(v.videoEl); URL.revokeObjectURL(v.src); } }); return []; });
    videoTrashRef.current = {}; // limpa o trash também no clear total
    setActiveVideoId(null);
    setExtraTexts([]);
    setStickers([]);
    setFrames([]);
    setActiveFrameId(null);
    setNewExtraInput('');
    setTextLines([]);
    setCurrentLineIndex(0);
    setImage(null);
    setImageSrc(null);
    setAudioSrc(null);
    setAudioFile(null);
    setAudioBase64(null);
    setScreenEffect('none');
    setChromaAberration(0);
    setColorCurves({r:1,g:1,b:1,midtone:1,shadows:0,highlights:0});
    setAudioMimeType(null);
    setWaveformPeaks([]);
    setDuration(0);
    setActiveImageId(null);
    setActiveLyricId(null);
    setFontSize(35);
    setTextColor('#ffffff');
    setFontFamily('Poppins');
    setExtraTextColor('#ffffff');
    setExtraTextFontFamily('Poppins');
    setExtraTextFontSize(18);
    setZoom(50);
    setExportFormat('webm_offline_audio');
    // Reseta todos os inputs de arquivo para permitir reselecionar o mesmo arquivo
    if (bgInputRef.current)     bgInputRef.current.value     = '';
    if (imagesInputRef.current) imagesInputRef.current.value = '';
    if (audioInputRef.current)  audioInputRef.current.value  = '';
    if (videoInputRef.current)  videoInputRef.current.value  = '';
    try {
      localStorage.removeItem('gc_project');
    } catch { void 0; }
  };

  // Quebra o texto da letra respeitando \n manuais e auto-wrap
  const wrapLyricText = useCallback((text, ctx, maxWidth) => {
    // Respeita quebras manuais de linha primeiro
    const manualLines = text.split('\n').filter(l => l.trim() !== '');
    if (manualLines.length > 1) return manualLines;
    // Auto-wrap: divide ao meio se muitas palavras
    const words = text.split(' ');
    if (words.length <= 4) return [text];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }, []);

  const handleTimelineMouseDown = (id, type, e) => {
    e.stopPropagation();
    setActiveLyricId(id);
    setEditingLyricId(null);
    const lyric = lyrics.find(l => l.id === id);
    // Seek para o início da lyric apenas em 'move' (resize não deve mudar playhead)
    if (type === 'move' && lyric) {
      const seekTo = lyric.start + 0.05;
      if (audioRef.current) audioRef.current.currentTime = seekTo;
      virtualTimeRef.current = seekTo;
      setCurrentTime(seekTo);
      if (playheadRef.current) {
        playheadRef.current.style.transform = `translateX(${seekTo * zoom}px)`;
      }
    }
    // Snapshot the lyric state at drag start to prevent stale-closure duplication
    _setDragging({ id, type, initialX: e.clientX, itemKind: 'lyric',
      initialStart: lyric?.start ?? 0, initialEnd: lyric?.end ?? 3 });
  };

  // ── Drag/trim do bloco de áudio na timeline ─────────────────────────────
  const handleAudioTimelineMouseDown = (type, e) => {
    e.stopPropagation();
    const audioDur = audioRef.current?.duration || duration;
    const displayDur = audioTrimEnd !== null ? (audioTrimEnd - audioTrimStart) : (audioDur - audioTrimStart);
    _setDragging({
      id: 'audio', type, itemKind: 'audio',
      initialX: e.clientX,
      initialOffset: audioOffset,
      initialTrimStart: audioTrimStart,
      initialTrimEnd: audioTrimEnd !== null ? audioTrimEnd : audioDur,
      audioDur,
    });
  };

  const handleImageTimelineMouseDown = (id, type, e) => {
    e.stopPropagation();
    setActiveImageId(id);
    const item = images.find(img => img.id === id);
    // Seek para dentro do range da imagem para ficar visível e editável no canvas
    if (item) {
      const seekTo = item.start + (item.end - item.start) * 0.01;
      if (audioRef.current) audioRef.current.currentTime = seekTo;
      virtualTimeRef.current = seekTo;
      setCurrentTime(seekTo);
      if (playheadRef.current) {
        playheadRef.current.style.transform = `translateX(${seekTo * zoom}px)`;
      }
    }
    _setDragging({ id, type, initialX: e.clientX, itemKind: 'image', initialStart: item?.start ?? 0, initialEnd: item?.end ?? 3 });
  };

  const handleVideoTimelineMouseDown = (id, type, e) => {
    e.stopPropagation();
    // NÃO chamar setActiveVideoId aqui — causaria re-render que mata o drag
    // Definimos o ativo via ref imediatamente, e sincronizamos state no mouseup
    const item = videosRef.current.find(v => v.id === id);

    // Move playhead para o início do vídeo só quando for arrastar o bloco (não resize)
    if (type === 'move' && item) {
      const seekTo = item.start;
      if (audioRef.current) audioRef.current.currentTime = seekTo;
      virtualTimeRef.current = seekTo;
      setCurrentTime(seekTo);
      if (playheadRef.current) playheadRef.current.style.transform = `translateX(${seekTo * zoom}px)`;
      // Pré-posiciona o videoEl no trimStart para não ter delay ao dar play
      if (item.videoEl) {
        const ts = item.trimStart ?? 0;
        if (Math.abs(item.videoEl.currentTime - ts) > 0.05) item.videoEl.currentTime = ts;
      }
    }

    setActiveVideoId(id);  // OK chamar depois de setup do drag
    _setDragging({
      id, type, initialX: e.clientX, itemKind: 'video',
      initialStart: item?.start ?? 0,
      initialEnd: item?.end ?? 3,
      initialTrimStart: item?.trimStart ?? 0,
      initialRawDuration: item?.rawDuration ?? (item ? (item.end - item.start) : 3),
    });
  };

  const scrubToClientX = (clientX) => {
    const container = timelineScrollRef.current;
    const audio = audioRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const rawX = clientX - rect.left + container.scrollLeft;
    const lyricMax = lyrics.reduce((max, l) => Math.max(max, l.end || 0), 0);
    const imageMax = images.reduce((max, item) => Math.max(max, item.end || 0), 0);
    const videoMax = videosRef.current.reduce((max, v) => Math.max(max, v.end || 0), 0);
    // Usa o maior entre: duração do áudio, letras, imagens e vídeos
    const maxTime = Math.max(duration || 0, lyricMax, imageMax, videoMax, 1);
    const nextTime = Math.max(0, Math.min(maxTime, rawX / zoom));
    if (audio) {
      // draw() usa virtualTimeRef quando pausado, então audio.currentTime
      // só precisa estar correto para quando o play for iniciado
      const off = audioOffsetRef.current || 0;
      const trimSt = audioTrimStartRef.current || 0;
      audio.currentTime = nextTime >= off ? trimSt + (nextTime - off) : trimSt;
    }
    virtualTimeRef.current = nextTime;
    setCurrentTime(nextTime);
    if (playheadRef.current) {
      playheadRef.current.style.transform = `translateX(${nextTime * zoom}px)`;
    }
    // Pré-posiciona vídeos no ponto correto — throttle para não sobrecarregar buffer em HDs
    videosRef.current.forEach(v => {
      if (!v.videoEl || v.videoEl.readyState < 1) return;
      const trimSt = v.trimStart ?? 0;
      const vidSpd = v.vidSpeed ?? 1;
      let target;
      if (nextTime < v.start) {
        target = trimSt;
      } else if (nextTime <= v.end) {
        target = Math.max(0, trimSt + (nextTime - v.start) * vidSpd);
      } else return;
      // Só faz seek se não está já seekando (evita seek-storm em vídeos HD grandes)
      if (!v.videoEl.seeking && Math.abs(v.videoEl.currentTime - target) > 0.05) {
        v.videoEl.currentTime = target;
      }
    });
  };

  // Helper: retorna bounding box do texto extra (considerando multiline)
  const getExtraTextBounds = useCallback((txt, ctx) => {
    const fs = txt.fontSize || extraTextFontSize;
    const ff = txt.fontFamily || extraTextFontFamily;
    const lines = txt.text.split('\n');
    const lineH = fs * 1.25;
    ctx.font = `bold ${fs}px ${ff}`;
    const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
    const totalH = lines.length * lineH;
    return { halfW: maxW / 2 + 10, halfH: totalH / 2 + 8, lineH, lines };
  }, [extraTextFontSize, extraTextFontFamily]);

  // Helper: transforma ponto de canvas para espaço local do texto (rotacionado)
  const toLocalSpace = (px, py, cx, cy, rot) => {
    const cos = Math.cos(-rot);
    const sin = Math.sin(-rot);
    const dx = px - cx;
    const dy = py - cy;
    return { lx: dx * cos - dy * sin, ly: dx * sin + dy * cos };
  };

  // AJUSTE: Lógica de clique para iniciar arrasto no Canvas
  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const ctx = canvas.getContext('2d');

    // ── Verifica colisão com molduras ────────────────────────────────────────
    for (let i = framesRef.current.length - 1; i >= 0; i--) {
      const fr = framesRef.current[i];
      const fw = fr.width || 200, fh = fr.height || 200;
      const fx = fr.x || 0, fy = fr.y || 0;
      const hs2 = 12; // handle size
      // Check resize corner handles (only when selected)
      if (activeFrameId === fr.id) {
        const corners = [[fx,fy],[fx+fw,fy],[fx,fy+fh],[fx+fw,fy+fh]];
        for (const [hx2,hy2] of corners) {
          if (Math.abs(mouseX-hx2) <= hs2 && Math.abs(mouseY-hy2) <= hs2) {
            const corner = `${mouseY<=fy+fh/2?'n':'s'}${mouseX<=fx+fw/2?'w':'e'}`;
            _setDragging({ type:'frame-resize', id:fr.id, corner, startX:mouseX, startY:mouseY,
              startW:fw, startH:fh, startFx:fx, startFy:fy });
            return;
          }
        }
      }
      // Check if inside frame bounding box
      if (mouseX >= fx-8 && mouseX <= fx+fw+8 && mouseY >= fy-8 && mouseY <= fy+fh+8) {
        setActiveFrameId(fr.id);
        _setDragging({ type:'frame-move', id:fr.id, offsetX:mouseX-fx, offsetY:mouseY-fy });
        return;
      }
    }
    setActiveFrameId(null);

    // ── Verifica colisão com stickers (do último para o primeiro) ────────────
    for (let i = stickers.length - 1; i >= 0; i--) {
      const stk = stickers[i];
      const sz  = stk.size || 80;
      const half = sz / 2 + 8;
      // Check resize corner handles first (only when selected)
      if (Math.abs(mouseX - stk.x) <= half && Math.abs(mouseY - stk.y) <= half) {
        activeStickerRef.current = stk.id;
        setActiveStickerId(stk.id);
        _setDragging({ type: 'sticker', id: stk.id, offsetX: mouseX - stk.x, offsetY: mouseY - stk.y });
        return;
      }
    }
    activeStickerRef.current = null;
    setActiveStickerId(null);

    // Verifica colisão com textos extras (do último para o primeiro)
    for (let i = extraTexts.length - 1; i >= 0; i--) {
      const txt = extraTexts[i];
      const rot = (txt.rotation || 0) * Math.PI / 180;
      const { halfW, halfH } = getExtraTextBounds(txt, ctx);

      // Ponto de rotação do handle (acima do texto)
      const handleDist = halfH + 20;
      const hx = txt.x + Math.sin(rot) * (-handleDist);
      const hy = txt.y - Math.cos(rot) * handleDist;

      // Verifica se clicou no handle de rotação
      const distHandle = Math.hypot(mouseX - hx, mouseY - hy);
      if (distHandle <= 10) {
        setActiveExtraTextId(txt.id);
        _setDragging({
          type: 'extra-rotate',
          id: txt.id,
          cx: txt.x,
          cy: txt.y,
          startAngle: Math.atan2(mouseY - txt.y, mouseX - txt.x),
          startRotation: txt.rotation || 0,
        });
        return;
      }

      // Verifica se clicou dentro do bounding box rotacionado
      const { lx, ly } = toLocalSpace(mouseX, mouseY, txt.x, txt.y, rot);
      if (Math.abs(lx) <= halfW && Math.abs(ly) <= halfH) {
        setActiveExtraTextId(txt.id);
        if (e.detail === 2) {
          setEditingExtraTextId(txt.id);
          return;
        }
        setDraggingExtraIndex(i);
        _setDragging({ type: 'extra', id: txt.id, offsetX: mouseX - txt.x, offsetY: mouseY - txt.y });
        return;
      }
    }

    // Deseleciona texto extra se clicou fora
    setActiveExtraTextId(null);

    // Verifica clique em lyric ativa no canvas
    const time = audioRef.current ? audioRef.current.currentTime : virtualTimeRef.current;
    const visibleLyric = lyrics.find(l => time >= l.start && time <= l.end);
    if (visibleLyric) {
      const vFontSize = visibleLyric.fontSize || fontSize;
      const vFontFamily = visibleLyric.fontFamily || fontFamily;
      ctx.font = `bold ${vFontSize}px ${vFontFamily}`;
      const lines = wrapLyricText(visibleLyric.text, ctx, canvas.width - 40);
      const lineH = vFontSize * 1.3;
      const totalH = lines.length * lineH;
      const lx = visibleLyric.x ?? canvas.width / 2;
      const ly = visibleLyric.y ?? canvas.height * 0.75;
      const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l.toUpperCase()).width), 0);
      const hw = maxW / 2 + 14;
      const hh = totalH / 2 + 10;
      const lRot = (visibleLyric.rotation || 0) * Math.PI / 180;

      // Check rotation handle (circle above text)
      if (activeLyricId === visibleLyric.id) {
        const handleDist = hh + 22;
        const rhx = lx + Math.sin(lRot) * (-handleDist);
        const rhy = ly - Math.cos(lRot) * handleDist;
        if (Math.hypot(mouseX - rhx, mouseY - rhy) <= 11) {
          setActiveLyricId(visibleLyric.id);
          _setDragging({ type: 'lyric-rotate', id: visibleLyric.id, cx: lx, cy: ly,
            startAngle: Math.atan2(mouseY - ly, mouseX - lx),
            startRotation: visibleLyric.rotation || 0 });
          return;
        }
      }

      // Hit-test in local rotated space
      const { lx: llx, ly: lly } = toLocalSpace(mouseX, mouseY, lx, ly, lRot);
      if (Math.abs(llx) <= hw && Math.abs(lly) <= hh) {
        setActiveLyricId(visibleLyric.id);
        if (e.detail === 2) {
          setEditingLyricId(visibleLyric.id);
          return;
        }
        _setDragging({ type: 'lyric-canvas', id: visibleLyric.id, offsetX: mouseX - lx, offsetY: mouseY - ly });
        return;
      }
    }

    setActiveLyricId(null);
    const hs = 10;

    // ── Imagens verificadas PRIMEIRO (ficam visualmente acima dos vídeos) ────
    const clickedItem = images.slice().reverse().find((item) => {
      if (!item || !item.img) return false;
      return time >= item.start && time <= item.end &&
        mouseX >= item.x - hs && mouseX <= item.x + item.width + hs &&
        mouseY >= item.y - hs && mouseY <= item.y + item.height + hs;
    });
    if (clickedItem) {
      setActiveImageId(clickedItem.id);
      setActiveVideoId(null);
      const handleSize = 12;
      const nearLeft   = Math.abs(mouseX - clickedItem.x) <= handleSize;
      const nearRight  = Math.abs(mouseX - (clickedItem.x + clickedItem.width)) <= handleSize;
      const nearTop    = Math.abs(mouseY - clickedItem.y) <= handleSize;
      const nearBottom = Math.abs(mouseY - (clickedItem.y + clickedItem.height)) <= handleSize;
      const corner = `${nearTop?'n':''}${nearBottom?'s':''}${nearLeft?'w':''}${nearRight?'e':''}`;
      if (corner.length >= 2) {
        _setDragging({ itemKind: 'canvas-image', type: 'resize', id: clickedItem.id, corner,
          startX: mouseX, startY: mouseY,
          startWidth: clickedItem.width, startHeight: clickedItem.height,
          startXPos: clickedItem.x, startYPos: clickedItem.y });
      } else {
        _setDragging({ itemKind: 'canvas-image', type: 'move', id: clickedItem.id,
          offsetX: mouseX - clickedItem.x, offsetY: mouseY - clickedItem.y });
      }
      return;
    }
    setActiveImageId(null);

    // ── Vídeos verificados após imagens ──────────────────────────────────────
    const s = 14;
    const clickedVideo = videos.slice().reverse().find(v => {
      if (!v.videoEl) return false;
      return time >= v.start && time <= v.end &&
        mouseX >= v.x - s && mouseX <= v.x + v.width + s &&
        mouseY >= v.y - s && mouseY <= v.y + v.height + s;
    });
    if (clickedVideo) {
      setActiveVideoId(clickedVideo.id);
      const nL = Math.abs(mouseX - clickedVideo.x) <= s;
      const nR = Math.abs(mouseX - (clickedVideo.x + clickedVideo.width)) <= s;
      const nT = Math.abs(mouseY - clickedVideo.y) <= s;
      const nB = Math.abs(mouseY - (clickedVideo.y + clickedVideo.height)) <= s;
      const corner = `${nT?'n':''}${nB?'s':''}${nL?'w':''}${nR?'e':''}`;
      if (corner.length >= 2) {
        _setDragging({ itemKind: 'canvas-video', type: 'resize', id: clickedVideo.id, corner,
          startX: mouseX, startY: mouseY,
          startWidth: clickedVideo.width, startHeight: clickedVideo.height,
          startXPos: clickedVideo.x, startYPos: clickedVideo.y });
      } else {
        _setDragging({ itemKind: 'canvas-video', type: 'move', id: clickedVideo.id,
          offsetX: mouseX - clickedVideo.x, offsetY: mouseY - clickedVideo.y });
      }
      return;
    }
    setActiveVideoId(null);
  };

  const handleGlobalMouseMove = useCallback((e) => {
    if (isScrubbing) {
      scrubToClientX(e.clientX);
      return;
    }
    // Usa ref síncrono para não perder o drag em re-renders
    const dragging = draggingRef.current;

    // Timeline lyric drag/resize
    if (dragging && dragging.itemKind === 'lyric') {
      const dx = (e.clientX - dragging.initialX) / zoom;
      if (dragging.type === 'move') {
        const duration = dragging.initialEnd - dragging.initialStart;
        const newStart = Math.max(0, dragging.initialStart + dx);
        const newEnd = newStart + duration;
        setLyrics(prev => prev.map(l => l.id === dragging.id ? { ...l, start: newStart, end: newEnd } : l));
      } else if (dragging.type === 'resize-start') {
        const newStart = Math.max(0, Math.min(dragging.initialStart + dx, dragging.initialEnd - 0.1));
        setLyrics(prev => prev.map(l => l.id === dragging.id ? { ...l, start: newStart } : l));
      } else if (dragging.type === 'resize-end') {
        const newEnd = Math.max(dragging.initialStart + 0.1, dragging.initialEnd + dx);
        setLyrics(prev => prev.map(l => l.id === dragging.id ? { ...l, end: newEnd } : l));
      }
      return;
    }

    // Timeline video drag/resize
    if (dragging && dragging.itemKind === 'video') {
      const dx = (e.clientX - dragging.initialX) / zoom;
      if (dragging.type === 'move') {
        const dur = dragging.initialEnd - dragging.initialStart;
        const newStart = Math.max(0, dragging.initialStart + dx);
        setVideos(prev => prev.map(v => v.id === dragging.id ? { ...v, start: newStart, end: newStart + dur } : v));
      } else if (dragging.type === 'resize-start') {
        // Trim do início: avança start + avança trimStart (ponto de entrada no vídeo)
        const rawDur   = dragging.initialRawDuration;
        const trimSt0  = dragging.initialTrimStart ?? 0;
        const vidSpeed = (videosRef.current.find(v => v.id === dragging.id)?.vidSpeed) ?? 1;
        // Limite máximo para puxar para a direita: o início não pode ultrapassar o fim do arquivo
        const maxDxRight = (rawDur - trimSt0) / vidSpeed - 0.2;
        // Limite máximo para puxar para a esquerda: só volta até onde trimStart chegaria a 0
        const maxDxLeft  = -(trimSt0 / vidSpeed);
        const clampedDx  = Math.max(maxDxLeft, Math.min(maxDxRight, dx));
        const newStart   = Math.max(0, dragging.initialStart + clampedDx);
        const trimDelta  = newStart - dragging.initialStart;
        const newTrimStart = Math.max(0, Math.min(
          trimSt0 + trimDelta * vidSpeed,
          rawDur - 0.1
        ));
        setVideos(prev => prev.map(v =>
          v.id === dragging.id ? { ...v, start: newStart, trimStart: newTrimStart } : v
        ));
      } else if (dragging.type === 'resize-end') {
        // Trim do fim: limita ao rawDuration disponível após trimStart
        const rawDur   = dragging.initialRawDuration;
        const vidSpeed = (videosRef.current.find(v => v.id === dragging.id)?.vidSpeed) ?? 1;
        const trimSt   = dragging.initialTrimStart ?? 0;
        const maxEnd   = dragging.initialStart + (rawDur - trimSt) / Math.max(0.25, vidSpeed);
        const newEnd   = Math.max(dragging.initialStart + 0.1, Math.min(dragging.initialEnd + dx, maxEnd));
        setVideos(prev => prev.map(v => v.id === dragging.id ? { ...v, end: newEnd } : v));
      }
      return;
    }

    // Timeline audio drag/trim
    if (dragging && dragging.itemKind === 'audio') {
      const dx = (e.clientX - dragging.initialX) / zoom;
      const audioDur = dragging.audioDur;
      if (dragging.type === 'move') {
        const newOffset = Math.max(0, dragging.initialOffset + dx);
        setAudioOffset(newOffset);
        // Sincroniza o elemento de áudio com o novo offset
        if (audioRef.current) {
          const t = virtualTimeRef.current;
          if (t >= newOffset) audioRef.current.currentTime = t - newOffset + audioTrimStart;
        }
      } else if (dragging.type === 'trim-start') {
        // Avança trim start (corta o início)
        const newTrimStart = Math.max(0, Math.min(dragging.initialTrimStart + dx, dragging.initialTrimEnd - 0.1));
        const offsetDelta = newTrimStart - dragging.initialTrimStart;
        setAudioTrimStart(newTrimStart);
        setAudioOffset(Math.max(0, dragging.initialOffset + offsetDelta));
      } else if (dragging.type === 'trim-end') {
        // Recua trim end (corta o final)
        const newTrimEnd = Math.max(dragging.initialTrimStart + 0.1, Math.min(dragging.initialTrimEnd + dx, audioDur));
        setAudioTrimEnd(newTrimEnd);
      }
      return;
    }

    // Timeline sticker drag/resize
    if (dragging && dragging.itemKind === 'sticker-timeline') {
      const dx = (e.clientX - dragging.initialX) / zoom;
      if (dragging.type === 'move') {
        const dur = dragging.initialEnd - dragging.initialStart;
        const newStart = Math.max(0, dragging.initialStart + dx);
        setStickers(prev => prev.map(s => s.id === dragging.id ? { ...s, start: newStart, end: newStart + dur } : s));
      } else if (dragging.type === 'resize-start') {
        const newStart = Math.max(0, Math.min(dragging.initialStart + dx, dragging.initialEnd - 0.1));
        setStickers(prev => prev.map(s => s.id === dragging.id ? { ...s, start: newStart } : s));
      } else if (dragging.type === 'resize-end') {
        const newEnd = Math.max(dragging.initialStart + 0.1, dragging.initialEnd + dx);
        setStickers(prev => prev.map(s => s.id === dragging.id ? { ...s, end: newEnd } : s));
      }
      return;
    }

    // Timeline image drag/resize
    if (dragging && dragging.itemKind === 'image') {
      const dx = (e.clientX - dragging.initialX) / zoom;
      if (dragging.type === 'move') {
        const dur = dragging.initialEnd - dragging.initialStart;
        const newStart = Math.max(0, dragging.initialStart + dx);
        const newEnd = newStart + dur;
        setImages(prev => prev.map(item => item.id === dragging.id ? { ...item, start: newStart, end: newEnd } : item));
      } else if (dragging.type === 'resize-start') {
        const newStart = Math.max(0, Math.min(dragging.initialStart + dx, dragging.initialEnd - 0.1));
        setImages(prev => prev.map(item => item.id === dragging.id ? { ...item, start: newStart } : item));
      } else if (dragging.type === 'resize-end') {
        const newEnd = Math.max(dragging.initialStart + 0.1, dragging.initialEnd + dx);
        setImages(prev => prev.map(item => item.id === dragging.id ? { ...item, end: newEnd } : item));
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Lyric rotation
    if (dragging && dragging.type === 'lyric-rotate') {
      const angle = Math.atan2(mouseY - dragging.cy, mouseX - dragging.cx);
      const delta = angle - dragging.startAngle;
      const newRotation = dragging.startRotation + delta * (180 / Math.PI);
      setLyrics(prev => prev.map(l => l.id === dragging.id ? { ...l, rotation: newRotation } : l));
      return;
    }

    // Extra text rotation
    if (dragging && dragging.type === 'extra-rotate') {
      const angle = Math.atan2(mouseY - dragging.cy, mouseX - dragging.cx);
      const delta = angle - dragging.startAngle;
      const newRotation = dragging.startRotation + delta * (180 / Math.PI);
      setExtraTexts(prev => prev.map(t => t.id === dragging.id ? { ...t, rotation: newRotation } : t));
      return;
    }

    // Sticker move
    if (dragging && dragging.type === 'sticker') {
      setStickers(prev => prev.map(s => s.id === dragging.id
        ? { ...s, x: mouseX - dragging.offsetX, y: mouseY - dragging.offsetY }
        : s));
      return;
    }

    // Frame move
    if (dragging && dragging.type === 'frame-move') {
      setFrames(prev => prev.map(fr => fr.id === dragging.id
        ? { ...fr, x: mouseX - dragging.offsetX, y: mouseY - dragging.offsetY }
        : fr));
      return;
    }
    // Frame resize
    if (dragging && dragging.type === 'frame-resize') {
      const { id, corner, startX, startY, startW, startH, startFx, startFy } = dragging;
      const dx = mouseX - startX, dy = mouseY - startY;
      let newX = startFx, newY = startFy, newW = startW, newH = startH;
      if (corner.includes('e')) newW = Math.max(30, startW + dx);
      if (corner.includes('s')) newH = Math.max(30, startH + dy);
      if (corner.includes('w')) { newW = Math.max(30, startW - dx); newX = startFx + startW - newW; }
      if (corner.includes('n')) { newH = Math.max(30, startH - dy); newY = startFy + startH - newH; }
      setFrames(prev => prev.map(fr => fr.id === id
        ? { ...fr, x: newX, y: newY, width: newW, height: newH }
        : fr));
      return;
    }


    // Extra text move
    if (dragging && dragging.type === 'extra' && draggingExtraIndex !== null) {
      const newX = mouseX - dragging.offsetX;
      const newY = mouseY - dragging.offsetY;
      setExtraTexts(prev => prev.map(t => t.id === dragging.id ? { ...t, x: newX, y: newY } : t));
      return;
    }

    // Lyric canvas drag
    if (dragging && dragging.type === 'lyric-canvas') {
      const newX = mouseX - dragging.offsetX;
      const newY = mouseY - dragging.offsetY;
      setLyrics(prev => prev.map(l => l.id === dragging.id ? { ...l, x: newX, y: newY } : l));
      return;
    }

    // Cursor style for resize handles
    let newCursor = 'default';
    if (!dragging) {
      const time = audioRef.current ? audioRef.current.currentTime : virtualTimeRef.current;
      const activeItem = images.find((item) => item.id === activeImageId && time >= item.start && time <= item.end);
      if (activeItem) {
        const handleSize = 12;
        const cursor = getHandleCursor(activeItem.x, activeItem.y, activeItem.width, activeItem.height, mouseX, mouseY);
        if (cursor) {
          newCursor = cursor;
        } else if (
          mouseX >= activeItem.x &&
          mouseX <= activeItem.x + activeItem.width &&
          mouseY >= activeItem.y &&
          mouseY <= activeItem.y + activeItem.height
        ) {
          newCursor = 'grab';
        }
      }
    }
    canvas.style.cursor = newCursor;

    if (dragging && dragging.itemKind === 'canvas-video') {
      if (dragging.type === 'move') {
        setVideos(prev => prev.map(v => v.id === dragging.id ? { ...v, x: mouseX - dragging.offsetX, y: mouseY - dragging.offsetY } : v));
      } else if (dragging.type === 'resize') {
        const { id, corner, startX, startY, startWidth, startHeight, startXPos, startYPos } = dragging;
        let nW = startWidth, nH = startHeight, nX = startXPos, nY = startYPos;
        const dx = mouseX - startX, dy = mouseY - startY;
        if (corner.includes('e')) nW = Math.max(20, startWidth + dx);
        if (corner.includes('s')) nH = Math.max(20, startHeight + dy);
        if (corner.includes('w')) { nW = Math.max(20, startWidth - dx); nX = startXPos + startWidth - nW; }
        if (corner.includes('n')) { nH = Math.max(20, startHeight - dy); nY = startYPos + startHeight - nH; }
        if (e.shiftKey || corner.length === 2) {
          const ar = startWidth / startHeight;
          if (corner.includes('e') || corner.includes('w')) { nH = Math.max(20, nW / ar); if (corner.includes('n')) nY = startYPos + startHeight - nH; }
          else { nW = Math.max(20, nH * ar); if (corner.includes('w')) nX = startXPos + startWidth - nW; }
        }
        if (corner.includes('w')) nX = startXPos + startWidth - nW;
        if (corner.includes('n')) nY = startYPos + startHeight - nH;
        setVideos(prev => prev.map(v => v.id === id ? { ...v, x: nX, y: nY, width: nW, height: nH } : v));
      }
      return;
    }

    if (dragging && dragging.itemKind === 'canvas-image') {
      if (dragging.type === 'move') {
        const x = mouseX - dragging.offsetX;
        const y = mouseY - dragging.offsetY;
        setImages(prevImages => prevImages.map((item) => item.id === dragging.id ? { ...item, x, y } : item));
      } else if (dragging.type === 'resize') {
        const { id, corner, startX, startY, startWidth, startHeight, startXPos, startYPos } = dragging;
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = startXPos;
        let newY = startYPos;

        const dx = mouseX - startX;
        const dy = mouseY - startY;

        // Calculate new width and height based on corner
        if (corner.includes('e')) {
          newWidth = Math.max(20, startWidth + dx);
        }
        if (corner.includes('s')) {
          newHeight = Math.max(20, startHeight + dy);
        }
        if (corner.includes('w')) {
          newWidth = Math.max(20, startWidth - dx);
          newX = startXPos + startWidth - newWidth;
        }
        if (corner.includes('n')) {
          newHeight = Math.max(20, startHeight - dy);
          newY = startYPos + startHeight - newHeight;
        }

        // Maintain aspect ratio if Shift key is pressed (or if it's a corner resize)
        if (e.shiftKey || corner.length === 2) {
          const aspectRatio = startWidth / startHeight;
          if (corner.includes('e') || corner.includes('w')) {
            newHeight = Math.max(20, newWidth / aspectRatio);
            if (corner.includes('n')) {
              newY = startYPos + startHeight - newHeight;
            }
          } else if (corner.includes('s') || corner.includes('n')) {
            newWidth = Math.max(20, newHeight * aspectRatio);
            if (corner.includes('w')) {
              newX = startXPos + startWidth - newWidth;
            }
          }
        }

        // Ensure minimum size
        if (newWidth < 20) newWidth = 20;
        if (newHeight < 20) newHeight = 20;

        // Update position if resizing from top or left
        if (corner.includes('w')) {
          newX = startXPos + startWidth - newWidth;
        }
        if (corner.includes('n')) {
          newY = startYPos + startHeight - newHeight;
        }

        setImages(prevImages => prevImages.map((item) =>
          item.id === id ? { ...item, x: newX, y: newY, width: newWidth, height: newHeight } : item
        ));
      }
    }
  }, [isScrubbing, scrubToClientX, canvasRef, dragging, draggingExtraIndex, audioRef, currentTime, images, activeImageId, setImages, getHandleCursor, zoom, setLyrics, setExtraTexts, lyrics, fontSize, fontFamily, wrapLyricText]);       






  const handleGlobalMouseUp = useCallback(() => {
_setDragging(null);
    setDraggingExtraIndex(null);
    setIsScrubbing(false);
  }, []);








  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT' || activeEl.isContentEditable)) return;
      // Prioridade estrita: só deleta o item explicitamente selecionado
      // Jamais deleta vídeo se o que está selecionado é uma lyric/imagem/texto
      if (activeFrameId) {
        pushHistory();
        setFrames(prev => prev.filter(fr => fr.id !== activeFrameId));
        setActiveFrameId(null);
        return;
      }
      if (activeVideoId && !activeImageId && !activeLyricId && !activeExtraTextId) {
        pushHistory();
        setVideos(prev => {
          const v = prev.find(vv => vv.id === activeVideoId);
          if (v?.videoEl) {
            v.videoEl.pause();
            // Preserva no trash para undo/redo poderem restaurar
            videoTrashRef.current[v.id] = { videoEl: v.videoEl, audioBuffer: v.audioBuffer, src: v.src };
            // NÃO revoga nem remove do DOM — apenas pausa e desanexa visualmente
          }
          return prev.filter(vv => vv.id !== activeVideoId);
        });
        setActiveVideoId(null);
        return;
      }
      if (activeImageId) {
        pushHistory();
        setImages(prev => prev.filter(img => img.id !== activeImageId));
        setActiveImageId(null);
        return;
      }
      if (activeLyricId) {
        pushHistory();
        setLyrics(prev => prev.filter(l => l.id !== activeLyricId));
        setActiveLyricId(null);
        return;
      }
      if (activeExtraTextId) {
        setExtraTexts(prev => prev.filter(t => t.id !== activeExtraTextId));
        setActiveExtraTextId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageId, activeLyricId, activeVideoId, activeExtraTextId]);

  // Playhead + canvas: loop unificado abaixo

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Retorna TODOS os vídeos ativos no instante t
  const getVideosForTime = useCallback((t) => {
    return videos.filter(v => v.videoEl && t >= v.start && t <= v.end);
  }, [videos]);

  // Retorna TODAS as imagens ativas no instante t (suporte a camadas simultâneas)
  const getImagesForTime = useCallback((t) => {
    return images.filter(item => item?.img && t >= item.start && t <= item.end);
  }, [images]);
  // Compat: retorna a mais recente (usada no hit-test do canvas)
  const getImageForTime = useCallback((t) => {
    const all = images.filter(item => item?.img && t >= item.start && t <= item.end);
    return all.length ? all[all.length - 1] : null;
  }, [images]);

  const timelineMaxTime = useMemo(() => {
    const videoMax = videos.reduce((max, v) => Math.max(max, v.end || 0), 0);
    return Math.max(duration > 0 ? duration : 60, videoMax);
  }, [duration, videos]);

  const timelineWidth = useMemo(() => Math.max(timelineMaxTime * zoom, 800), [timelineMaxTime, zoom]);

  // Largura em px que representa exatamente a duração do áudio
  const audioPxWidth = useMemo(() => duration > 0 ? duration * zoom : timelineWidth, [duration, zoom, timelineWidth]);

  // Marcadores de tempo para a régua (a cada ~80px, intervalos legíveis)
  const rulerMarkers = useMemo(() => {
    const maxT = timelineMaxTime; // usa sempre o máximo de conteúdo (funciona sem áudio)
    if (!maxT) return [];
    const minPxGap = 80;
    const niceIntervals = [1, 2, 5, 10, 15, 30, 60, 120, 300];
    const rawGap = minPxGap / zoom;
    const interval = niceIntervals.find(i => i >= rawGap) || 300;
    const markers = [];
    for (let t = 0; t <= maxT; t += interval) {
      markers.push(t);
    }
    return markers;
  }, [timelineMaxTime, zoom]);

  const waveformBars = useMemo(() => {
    const count = Math.ceil(audioPxWidth / 3);
    return Array.from({ length: count }).map((_, i) => {
      const total = Math.max(count - 1, 1);
      const idx = waveformPeaks.length ? Math.min(waveformPeaks.length - 1, Math.floor((i / total) * waveformPeaks.length)) : 0;
      const amp = waveformPeaks.length ? waveformPeaks[idx] : 0.15;
      return {
        key: i,
        height: Math.max(3, amp * 22)
      };
    });
  }, [audioPxWidth, waveformPeaks]);

  const stickersRef = useRef([]);
  useEffect(() => { stickersRef.current = stickers; }, [stickers]);
  useEffect(() => { framesRef.current = frames; }, [frames]);

  // ── Desenha efeito de fundo atrás do texto ─────────────────────────────────
  const drawTextBgEffectRef = useRef(null);
  const drawScreenEffectRef = useRef(null);
  const _drawTextBgEffectImpl = (ctx, effect, lines, lFontSize, lineH, totalH) => {
    if (!effect || effect === 'none') return;
    const phase = Date.now() / 1000;
    const maxW = Math.max(20, lines.reduce((m, l) => {
      const str = typeof l === 'string' ? l : String(l);
      return Math.max(m, ctx.measureText(str.toUpperCase()).width);
    }, 0));
    const padX = lFontSize * 0.55, padY = lFontSize * 0.3;
    const bx = -maxW / 2 - padX, by = -totalH / 2 - padY;
    const bw = maxW + padX * 2,  bh = totalH + padY * 2;
    const r  = Math.min(lFontSize * 0.2, bw / 2, bh / 2);

    const rr = (cx, cy, cw, ch, cr) => {
      const rr2 = Math.max(0, Math.min(cr, cw / 2, ch / 2));
      ctx.beginPath();
      ctx.moveTo(cx + rr2, cy);
      ctx.arcTo(cx + cw, cy, cx + cw, cy + ch, rr2);
      ctx.arcTo(cx + cw, cy + ch, cx, cy + ch, rr2);
      ctx.arcTo(cx, cy + ch, cx, cy, rr2);
      ctx.arcTo(cx, cy, cx + cw, cy, rr2);
      ctx.closePath();
    };

    // Desenha todas as linhas de texto
    const drawLines = (mode = 'fill') => {
      lines.forEach((line, li) => {
        const str = (typeof line === 'string' ? line : String(line)).toUpperCase();
        const lineY = -totalH / 2 + li * (lineH) + lineH / 2;
        if (mode === 'fill') ctx.fillText(str, 0, lineY);
        else ctx.strokeText(str, 0, lineY);
      });
    };

    ctx.save();
    try {
      ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
      ctx.globalAlpha = 1; ctx.filter = 'none';
      switch (effect) {

        // ══ EFEITOS DE TEXTO ══════════════════════════

        case 'outline_white': {
          // Outline branco espesso + sombra preta — máxima legibilidade
          ctx.lineJoin = 'round'; ctx.lineCap = 'round';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = lFontSize * 0.13;
          ctx.shadowBlur = 6; ctx.shadowColor = 'rgba(0,0,0,0.95)';
          drawLines('stroke');
          // Borda interna levemente cinza para profundidade
          ctx.strokeStyle = 'rgba(220,220,220,0.4)';
          ctx.lineWidth = lFontSize * 0.04;
          ctx.shadowBlur = 0;
          drawLines('stroke');
          break;
        }

        case 'outline_black': {
          // Outline preto extra espesso — estilo bolha/cartoon
          ctx.lineJoin = 'round'; ctx.lineCap = 'round';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = lFontSize * 0.18;
          drawLines('stroke');
          // Highlight branco fino por dentro
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.lineWidth = lFontSize * 0.035;
          drawLines('stroke');
          break;
        }

        case 'double_stroke': {
          // Duplo stroke: externo preto, interno branco — impacto máximo
          ctx.lineJoin = 'round'; ctx.lineCap = 'round';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = lFontSize * 0.22;
          drawLines('stroke');
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = lFontSize * 0.10;
          drawLines('stroke');
          // Fio brilhante no topo
          ctx.strokeStyle = 'rgba(255,255,255,0.25)';
          ctx.lineWidth = lFontSize * 0.025;
          drawLines('stroke');
          break;
        }

        case 'glow_neon': {
          // Glow neon multicamada animado — 5 passes decrescentes
          const hue = (phase * 55) % 360;
          const col = `hsl(${hue},100%,60%)`;
          const layers = [
            { blur: lFontSize * 1.4, alpha: 0.18 },
            { blur: lFontSize * 0.9, alpha: 0.32 },
            { blur: lFontSize * 0.5, alpha: 0.52 },
            { blur: lFontSize * 0.2, alpha: 0.72 },
            { blur: lFontSize * 0.05,alpha: 0.95 },
          ];
          layers.forEach(({ blur, alpha }) => {
            ctx.shadowBlur = blur; ctx.shadowColor = col;
            ctx.fillStyle = `hsla(${hue},100%,88%,${alpha})`;
            drawLines('fill');
          });
          ctx.shadowBlur = 0;
          break;
        }

        case 'glow_fire': {
          // Chama animada com 4 passes de glow vermelho→amarelo
          const fp = phase * 1.6;
          const flicker = Math.sin(fp) * 0.08;
          const fireLayers = [
            { color: 'rgba(200,0,0,0.28)',    blur: lFontSize * 1.5 },
            { color: 'rgba(255,60,0,0.42)',   blur: lFontSize * 0.9 + flicker*lFontSize },
            { color: 'rgba(255,150,0,0.60)',  blur: lFontSize * 0.45 },
            { color: 'rgba(255,240,100,0.80)',blur: lFontSize * 0.12 },
          ];
          fireLayers.forEach(({ color, blur }) => {
            ctx.shadowBlur = blur; ctx.shadowColor = color;
            ctx.fillStyle = color;
            drawLines('fill');
          });
          // Núcleo branco-amarelo brilhante
          ctx.shadowBlur = lFontSize * 0.08; ctx.shadowColor = '#fff8d0';
          ctx.fillStyle = 'rgba(255,255,200,0.55)';
          drawLines('fill');
          ctx.shadowBlur = 0;
          break;
        }

        case 'stroke_gradient': {
          // Stroke com gradiente dourado brilhante
          ctx.lineJoin = 'round'; ctx.lineCap = 'round';
          const sg = ctx.createLinearGradient(-maxW/2, -totalH/2, maxW/2, totalH/2);
          sg.addColorStop(0,   '#b8860b');
          sg.addColorStop(0.25,'#ffd700');
          sg.addColorStop(0.5, '#fffacd');
          sg.addColorStop(0.75,'#ffd700');
          sg.addColorStop(1,   '#b8860b');
          ctx.lineWidth = lFontSize * 0.12;
          ctx.strokeStyle = sg;
          ctx.shadowBlur = 14; ctx.shadowColor = 'rgba(255,180,0,0.65)';
          drawLines('stroke');
          // Linha interna fina e clara
          ctx.lineWidth = lFontSize * 0.03;
          ctx.strokeStyle = 'rgba(255,255,220,0.5)';
          ctx.shadowBlur = 0;
          drawLines('stroke');
          break;
        }

        case 'shadow_3d': {
          // Sombra 3D extrudada — múltiplas cópias criam profundidade real
          const depth = Math.max(2, Math.round(lFontSize * 0.09));
          for (let d = depth; d >= 1; d--) {
            const ratio = d / depth;
            ctx.fillStyle = `rgba(${Math.round(30*ratio)},${Math.round(10*ratio)},${Math.round(60*ratio)},${0.55 + ratio * 0.35})`;
            ctx.save();
            ctx.translate(d * 1.8, d * 1.8);
            drawLines('fill');
            ctx.restore();
          }
          break;
        }

        case 'brush_stroke': {
          // Pincelada de tinta orgânica atrás do texto
          const bph = phase * 0.35;
          ctx.beginPath();
          const bx2 = bx - lFontSize * 0.3, bw2 = bw + lFontSize * 0.6;
          const bhH = bh * 0.75;
          const by2 = by + (bh - bhH) / 2 + Math.sin(bph) * lFontSize * 0.04;
          // Borda superior ondulada
          ctx.moveTo(bx2 + lFontSize * 0.2, by2 + Math.sin(bph + 0.3) * lFontSize * 0.15);
          for (let s = 0; s <= 10; s++) {
            const tx = bx2 + bw2 * (s / 10);
            const ty = by2 + Math.sin(bph + s * 0.8) * lFontSize * 0.14;
            ctx.lineTo(tx, ty);
          }
          ctx.lineTo(bx2 + bw2 - lFontSize * 0.15, by2 + bhH + Math.sin(bph + 9) * lFontSize * 0.12);
          // Borda inferior ondulada (de trás pra frente)
          for (let s = 10; s >= 0; s--) {
            const tx = bx2 + bw2 * (s / 10);
            const ty = by2 + bhH + Math.sin(bph + s * 0.9 + 3) * lFontSize * 0.14;
            ctx.lineTo(tx, ty);
          }
          ctx.closePath();
          // Preenchimento de tinta preta com gradiente interno
          const brushG = ctx.createLinearGradient(bx2, by2, bx2 + bw2, by2 + bhH);
          brushG.addColorStop(0,   'rgba(5,5,5,0.92)');
          brushG.addColorStop(0.4, 'rgba(15,15,15,0.97)');
          brushG.addColorStop(1,   'rgba(5,5,5,0.90)');
          ctx.fillStyle = brushG; ctx.fill();
          // Highlight branco no topo para dar brilho de tinta
          ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1; ctx.stroke();
          break;
        }

        case 'glitch_rgb': {
          // Separação de canais RGB estilo glitch digital
          const gOff = lFontSize * 0.07;
          const gTime = Math.floor(phase * 6);
          const jitter = (gTime % 3 === 0) ? lFontSize * 0.04 : 0;
          // Canal R — deslocado esquerda+cima
          ctx.fillStyle = 'rgba(255,0,50,0.80)';
          ctx.save(); ctx.translate(-gOff + jitter, -gOff * 0.4);
          drawLines('fill'); ctx.restore();
          // Canal B — deslocado direita+baixo
          ctx.fillStyle = 'rgba(0,120,255,0.80)';
          ctx.save(); ctx.translate(gOff - jitter * 0.5, gOff * 0.4);
          drawLines('fill'); ctx.restore();
          // Scanlines horizontais finas
          ctx.fillStyle = 'rgba(0,0,0,0.10)';
          for (let sy = -totalH / 2; sy < totalH / 2; sy += lFontSize * 0.38) {
            ctx.fillRect(-maxW / 2 - padX * 0.5, sy, bw * 0.8, 1);
          }
          break;
        }

        // ══ EFEITOS DE FUNDO (mantidos) ══════════════════════════════

        case 'black':
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(0,0,0,0.78)'; ctx.fill(); break;

        case 'white':
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(255,255,255,0.84)'; ctx.fill(); break;

        case 'blur': {
          rr(bx - 8, by - 8, bw + 16, bh + 16, r + 8);
          ctx.filter = 'blur(14px)'; ctx.fillStyle = 'rgba(30,30,30,0.9)'; ctx.fill();
          ctx.filter = 'none'; rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill(); break;
        }

        case 'dark_blur': {
          rr(bx - 10, by - 10, bw + 20, bh + 20, r + 10);
          ctx.filter = 'blur(18px)'; ctx.fillStyle = 'rgba(0,0,0,0.95)'; ctx.fill();
          ctx.filter = 'none'; rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fill(); break;
        }

        case 'fire': {
          const p = phase * 2;
          const mid1 = Math.max(0.05, Math.min(0.55, 0.35 + 0.12 * Math.sin(p)));
          const mid2 = Math.max(mid1 + 0.1, Math.min(0.9, 0.65 + 0.08 * Math.cos(p * 1.3)));
          const g = ctx.createLinearGradient(bx, by + bh, bx, by);
          g.addColorStop(0, '#cc0000'); g.addColorStop(mid1, '#ff5500');
          g.addColorStop(mid2, '#ffaa00'); g.addColorStop(1, '#ffee00');
          rr(bx, by, bw, bh, r); ctx.fillStyle = g; ctx.fill();
          ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(255,80,0,0.7)';
          ctx.strokeStyle = 'rgba(255,150,0,0.5)'; ctx.lineWidth = 1.5; ctx.stroke(); break;
        }

        case 'water': {
          const p2 = phase * 1.5;
          const w1 = Math.max(0.05, Math.min(0.45, 0.25 + 0.1 * Math.sin(p2)));
          const w2 = Math.max(w1 + 0.15, Math.min(0.85, 0.6 + 0.08 * Math.cos(p2 * 1.2)));
          const g2 = ctx.createLinearGradient(bx, by, bx, by + bh);
          g2.addColorStop(0, 'rgba(0,210,255,0.3)'); g2.addColorStop(w1, 'rgba(0,140,230,0.7)');
          g2.addColorStop(w2, 'rgba(0,70,200,0.82)'); g2.addColorStop(1, 'rgba(0,20,140,0.9)');
          rr(bx, by, bw, bh, r); ctx.fillStyle = g2; ctx.fill();
          ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(0,180,255,0.6)';
          ctx.strokeStyle = 'rgba(80,220,255,0.5)'; ctx.lineWidth = 1.5; ctx.stroke(); break;
        }

        case 'neon': {
          rr(bx, by, bw, bh, r); ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fill();
          const hue2 = ((phase * 60) % 360);
          const nc2 = `hsl(${hue2},100%,60%)`;
          ctx.shadowBlur = 20; ctx.shadowColor = nc2;
          ctx.strokeStyle = nc2; ctx.lineWidth = 2; ctx.stroke(); break;
        }

        case 'rainbow': {
          const shift = (phase * 0.25) % 1;
          const rg = ctx.createLinearGradient(bx, by, bx + bw, by);
          [0, 42, 60, 120, 210, 270, 300, 360].forEach((h, i, arr) => {
            rg.addColorStop(i / (arr.length - 1), `hsl(${(h + shift * 360) % 360},100%,55%)`);
          });
          rr(bx, by, bw, bh, r); ctx.fillStyle = rg;
          ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1; break;
        }

        case 'gold': {
          const gp = phase * 0.8;
          const gs = Math.max(0.1, Math.min(0.45, 0.3 + 0.15 * Math.sin(gp)));
          const gg = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
          gg.addColorStop(0, 'rgba(160,110,0,0.95)');
          gg.addColorStop(gs, 'rgba(255,215,0,1)');
          gg.addColorStop(1, 'rgba(160,110,0,0.95)');
          rr(bx, by, bw, bh, r); ctx.fillStyle = gg; ctx.fill();
          ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,200,0,0.7)';
          ctx.strokeStyle = 'rgba(255,240,100,0.6)'; ctx.lineWidth = 1.5; ctx.stroke(); break;
        }

        default: break;
      }
    } finally {
      ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
      ctx.globalAlpha = 1; ctx.filter = 'none';
      ctx.restore();
    }
  };

  drawTextBgEffectRef.current = _drawTextBgEffectImpl;

  const _drawScreenEffectImpl = (ctx, effect, W, H, t) => {
    if (!effect || effect === 'none') return;
    const ph = t;
    ctx.save();
    try {
      switch(effect) {
        case 'vignette': { const vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.15,W/2,H/2,Math.max(W,H)*0.72); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(0.5,'rgba(0,0,0,0.3)'); vg.addColorStop(1,'rgba(0,0,0,0.92)'); ctx.fillStyle=vg; ctx.fillRect(0,0,W,H); break; }
        case 'film_grain': {
          // Grain visível em múltiplos tamanhos
          for(let i=0;i<1500;i++){const gx=Math.random()*W,gy=Math.random()*H,gs=Math.random()<0.7?1:2;const gv=Math.random();ctx.fillStyle=gv>0.5?`rgba(255,255,255,${0.15+Math.random()*0.35})`:`rgba(0,0,0,${0.1+Math.random()*0.25})`;ctx.fillRect(gx,gy,gs,gs);}
          // Vinheta
          const fvg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.75); fvg.addColorStop(0,'transparent'); fvg.addColorStop(1,'rgba(0,0,0,0.55)'); ctx.fillStyle=fvg; ctx.fillRect(0,0,W,H);
          // Overlay sépia leve
          ctx.fillStyle='rgba(40,25,5,0.12)'; ctx.fillRect(0,0,W,H);
          break;
        }
        case 'vintage': { ctx.fillStyle='rgba(100,60,0,0.18)'; ctx.fillRect(0,0,W,H); const vvg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.75); vvg.addColorStop(0,'transparent'); vvg.addColorStop(1,'rgba(40,20,0,0.5)'); ctx.fillStyle=vvg; ctx.fillRect(0,0,W,H); ctx.strokeStyle='rgba(255,240,200,0.08)'; ctx.lineWidth=1; for(let i=0;i<3;i++){const sx=((i*317+Math.floor(ph*2)*89)%W+W)%W; ctx.beginPath(); ctx.moveTo(sx,0); ctx.lineTo(sx+2,H); ctx.stroke();} break; }
        case 'tv_static': { for(let y=0;y<H;y+=2){ctx.fillStyle=`rgba(0,0,0,${Math.random()*0.06})`;ctx.fillRect(0,y,W,1);} for(let i=0;i<400;i++){const nx=Math.random()*W,ny=Math.random()*H,nv=Math.floor(Math.random()*255);ctx.fillStyle=`rgba(${nv},${nv},${nv},0.4)`;ctx.fillRect(nx,ny,2,2);} if(Math.random()<0.15){ctx.fillStyle='rgba(255,255,255,0.08)';ctx.fillRect(0,Math.random()*H,W,1+Math.random()*3);} break; }
        case 'vhs': { for(let y=0;y<H;y+=3){ctx.fillStyle='rgba(0,0,0,0.18)';ctx.fillRect(0,y,W,1);} ctx.globalCompositeOperation='screen'; ctx.fillStyle='rgba(255,0,0,0.04)';ctx.fillRect(2,0,W,H); ctx.fillStyle='rgba(0,0,255,0.04)';ctx.fillRect(-2,0,W,H); ctx.globalCompositeOperation='source-over'; const barY=((ph*30)%H+H)%H; ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(0,barY,W,12); break; }
        case 'glitch': { ctx.globalCompositeOperation='screen'; ctx.fillStyle='rgba(255,0,100,0.04)';ctx.fillRect(3,0,W,H); ctx.fillStyle='rgba(0,255,200,0.04)';ctx.fillRect(-3,0,W,H); ctx.globalCompositeOperation='source-over'; if(Math.floor(ph*8)%3===0){for(let i=0;i<5;i++){const gy=Math.random()*H,gh=2+Math.random()*8;ctx.fillStyle=`rgba(${Math.random()<0.5?255:0},0,${Math.random()<0.5?255:0},0.08)`;ctx.fillRect(0,gy,W,gh);}} break; }
        case 'neon_glow': { const np=0.4+0.3*Math.sin(ph*2),hue=(ph*40)%360; const ng=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.2,W/2,H/2,Math.max(W,H)*0.8); ng.addColorStop(0,'transparent'); ng.addColorStop(1,`hsla(${hue},100%,55%,${np*0.35})`); ctx.fillStyle=ng; ctx.fillRect(0,0,W,H); ctx.strokeStyle=`hsla(${hue},100%,65%,${np*0.4})`; ctx.lineWidth=4; ctx.shadowBlur=20; ctx.shadowColor=`hsl(${hue},100%,60%)`; ctx.strokeRect(8,8,W-16,H-16); ctx.shadowBlur=0; break; }
        case 'blur_fx': { try{ctx.filter='blur(4px)';ctx.drawImage(ctx.canvas,0,0);ctx.filter='none';}catch(e){} ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,W,H); break; }
        case 'matrix': { ctx.fillStyle='rgba(0,255,70,0.06)';ctx.fillRect(0,0,W,H); ctx.fillStyle='rgba(0,255,70,0.55)'; ctx.font=`${Math.max(10,Math.floor(W/50))}px monospace`; ctx.textAlign='left'; const cols=Math.floor(W/14); for(let c=0;c<cols;c++){const ch2=String.fromCharCode(0x30A0+Math.floor((ph*7+c*13)%96));const cy2=((c*137+Math.floor(ph*20)*31)%H+H)%H;ctx.fillText(ch2,c*14,cy2);} break; }
        case 'confetti': { const colors2=['#ff0','#f0f','#0ff','#f66','#6f6','#66f','#fa0']; for(let i=0;i<60;i++){const cx2=((i*197+Math.floor(ph*15)*53)%W+W)%W,cy3=((i*113+ph*80*((i%5)+1))%H+H)%H,crot=(ph*2+i)*0.5;ctx.save();ctx.translate(cx2,cy3);ctx.rotate(crot);ctx.fillStyle=colors2[i%colors2.length];ctx.globalAlpha=0.7;ctx.fillRect(-4,-2,8,4);ctx.restore();} break; }
        case 'particles': { ctx.fillStyle='rgba(200,220,255,0.55)'; for(let i=0;i<80;i++){const px2=((i*197+ph*15*(1+(i%5)*0.2))%W+W)%W,py2=((i*113-ph*20*(1+(i%3)*0.3))%H+H)%H,pr=0.5+((i*71)%3)*0.5;ctx.beginPath();ctx.arc(px2,py2,pr,0,6.28);ctx.fill();} break; }
        case 'aurora': { for(let band=0;band<4;band++){const bph=ph*0.5+band*0.8,ay=H*0.15+H*0.1*Math.sin(bph+band),hue2=(160+band*40+(ph*10)%60)%360;const ag=ctx.createLinearGradient(0,ay-60,0,ay+80);ag.addColorStop(0,'transparent');ag.addColorStop(0.3,`hsla(${hue2},90%,60%,0.18)`);ag.addColorStop(0.7,`hsla(${(hue2+40)%360},80%,55%,0.12)`);ag.addColorStop(1,'transparent');ctx.fillStyle=ag;ctx.fillRect(0,ay-60,W,140);} break; }
        case 'ice': { ctx.fillStyle='rgba(150,200,255,0.08)';ctx.fillRect(0,0,W,H); ctx.strokeStyle='rgba(180,220,255,0.25)';ctx.lineWidth=1; for(let i=0;i<20;i++){const ix=Math.random()*W,iy=Math.random()*H,il=10+Math.random()*30,ia=(Math.random()-0.5)*Math.PI;ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(ix+Math.cos(ia)*il,iy+Math.sin(ia)*il);ctx.stroke();} const ig=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.7);ig.addColorStop(0,'transparent');ig.addColorStop(1,'rgba(150,200,255,0.3)');ctx.fillStyle=ig;ctx.fillRect(0,0,W,H); break; }
        case 'cyberpunk': { ctx.fillStyle='rgba(0,0,20,0.3)';ctx.fillRect(0,0,W,H); ctx.strokeStyle='rgba(0,255,180,0.06)';ctx.lineWidth=1; const cg2=Math.floor(W/20); for(let c=0;c<=cg2;c++){const x=c*(W/cg2);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();} for(let r=0;r<=10;r++){const y=r*(H/10);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();} const cp=0.3+0.3*Math.sin(ph*3);ctx.shadowBlur=15;ctx.shadowColor='#00ffb4';ctx.strokeStyle=`rgba(0,255,180,${cp})`;ctx.lineWidth=2;ctx.strokeRect(4,4,W-8,H-8);ctx.shadowBlur=0; break; }

        case 'rain': {
          const atmo=ctx.createLinearGradient(0,0,0,H);atmo.addColorStop(0,'rgba(15,25,45,0.22)');atmo.addColorStop(1,'rgba(8,15,30,0.10)');ctx.fillStyle=atmo;ctx.fillRect(0,0,W,H);
          const windAngle=Math.sin(ph*0.25)*0.22+Math.sin(ph*0.07)*0.08-0.18;
          const RL=[{n:100,spd:220,len:14,lw:0.4,a:0.14},{n:80,spd:320,len:22,lw:0.6,a:0.22},{n:55,spd:450,len:34,lw:0.9,a:0.32},{n:30,spd:600,len:50,lw:1.3,a:0.45}];
          RL.forEach((L,li)=>{ctx.lineWidth=L.lw;for(let i=0;i<L.n;i++){const hx=((i*127.1+li*311.7+0.03)%1+1)%1,hy=((i*91.3+li*173.9+0.07)%1+1)%1,spd=L.spd*(0.75+((i*71.3)%1)*0.5);const bx2=((hx*W+ph*windAngle*spd)%W+W)%W,by2=((hy*H+ph*(spd/H)*H)%H+H)%H,ex2=bx2+L.len*windAngle,ey2=by2+L.len,alpha=L.a*(0.55+((i*53.9)%1)*0.45);const rg=ctx.createLinearGradient(bx2,by2,ex2,ey2);rg.addColorStop(0,`rgba(200,225,255,${alpha*1.4})`);rg.addColorStop(1,'rgba(140,190,255,0)');ctx.strokeStyle=rg;ctx.beginPath();ctx.moveTo(bx2,by2);ctx.lineTo(ex2,ey2);ctx.stroke();}});
          const sT=ph*2.5;for(let i=0;i<35;i++){const gx=((i*197.3+Math.floor(sT+i*0.37)*79.1)%W+W)%W,gy=H-1-((i*113.7)%1)*(H*0.04),age=(sT+i*0.37)%1,sr2=age*8*(0.7+((i*53)%1)*0.6),sa2=Math.pow(1-age,1.5)*0.4;ctx.strokeStyle=`rgba(160,210,255,${sa2})`;ctx.lineWidth=0.7;ctx.beginPath();ctx.ellipse(gx,gy,sr2,sr2*0.25,0,0,Math.PI*2);ctx.stroke();}
          const rv=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.8);rv.addColorStop(0,'transparent');rv.addColorStop(1,'rgba(5,15,40,0.50)');ctx.fillStyle=rv;ctx.fillRect(0,0,W,H);
          break;
        }
        case 'fire': {
          for(let layer=0;layer<3;layer++){const lh=H*(0.12+layer*0.06);const lg=ctx.createLinearGradient(0,H,0,H-lh);const intensities=[0.40,0.20,0.10];lg.addColorStop(0,`rgba(255,${40+layer*30},0,${intensities[layer]})`);lg.addColorStop(0.6,`rgba(255,${80+layer*40},0,${intensities[layer]*0.4})`);lg.addColorStop(1,'transparent');ctx.fillStyle=lg;ctx.fillRect(0,H-lh,W,lh);}
          const COL=Math.max(1,Math.floor(W/4));for(let c=0;c<COL;c++){const nx=c/COL,f1=Math.sin(ph*2.7+nx*8.3)*0.40,f2=Math.sin(ph*4.3+nx*14.1+1.5)*0.25,f3=Math.sin(ph*1.6+nx*5.9+0.8)*0.20,f4=Math.sin(ph*7.1+nx*22.0+2.1)*0.15,turb=0.5+(f1+f2+f3+f4)*0.5,baseH=H*(0.25+turb*0.30),cx2=c*(W/COL),cw2=W/COL*1.6;const fg2=ctx.createLinearGradient(cx2+cw2/2,H,cx2+cw2/2,H-baseH);fg2.addColorStop(0,'rgba(255,255,200,0.80)');fg2.addColorStop(0.15,'rgba(255,200,30,0.70)');fg2.addColorStop(0.40,'rgba(255,100,0,0.55)');fg2.addColorStop(0.70,'rgba(200,30,0,0.30)');fg2.addColorStop(1,'transparent');const ctrlX=cx2+(turb-0.5)*cw2*0.8;ctx.fillStyle=fg2;ctx.beginPath();ctx.moveTo(cx2-cw2*0.1,H);ctx.quadraticCurveTo(ctrlX,H-baseH*0.5,cx2+cw2/2,H-baseH);ctx.quadraticCurveTo(ctrlX+cw2*0.3,H-baseH*0.5,cx2+cw2*1.1,H);ctx.closePath();ctx.fill();}
          ctx.shadowBlur=6;for(let e=0;e<45;e++){const eph=ph*(0.8+((e*71.3)%1)*0.6)+e*0.41,ex2=((e*173.3+Math.sin(eph*1.3)*W*0.04)%W+W)%W,riseY=((eph*H*0.6)%H+H)%H,ey2=H-riseY;if(ey2<-10||ey2>H)continue;const fade=Math.max(0,ey2/H),er=0.8+((e*53.1)%1)*1.8,ec=`rgba(255,${160+Math.floor(((e*71)%1)*90)},${Math.floor(((e*37)%1)*40)},${fade*0.9})`;ctx.shadowColor=ec;ctx.fillStyle=ec;ctx.beginPath();ctx.arc(ex2,ey2,er,0,Math.PI*2);ctx.fill();}ctx.shadowBlur=0;
          break;
        }
        case 'smoke': {
          for(let layer=0;layer<3;layer++){const lh=H*(0.08+layer*0.05),lo=0.10-layer*0.03;const lg=ctx.createLinearGradient(0,H,0,H-lh);lg.addColorStop(0,`rgba(130,130,140,${lo})`);lg.addColorStop(1,'transparent');ctx.fillStyle=lg;ctx.fillRect(0,H-lh,W,lh);}
          const N=35;for(let i=0;i<N;i++){const vrise=0.03+((i*71.3)%1)*0.04,windPhase=ph*0.15+i*0.9,windDrift=Math.sin(windPhase)*0.04+Math.sin(windPhase*2.3+1)*0.02,life=((ph*vrise+(i/N))%1+1)%1,spx=((i*197.3)%1)*W,px=(spx+windDrift*W*life*3+W)%W,py=H*0.92-life*H*0.65,baseR=W*0.045*(0.5+((i*53.1)%1)*0.5),pr=baseR*(0.2+life*0.8)*1.6;const pa=life<0.15?(life/0.15)*0.20:Math.pow(1-life,1.2)*0.20*(0.6+((i*37.7)%1)*0.4);if(pa<=0.005)continue;const gv=Math.floor(80+life*130);const sg2=ctx.createRadialGradient(px,py,0,px,py,pr);sg2.addColorStop(0,`rgba(${gv},${gv},${gv},${pa})`);sg2.addColorStop(0.45,`rgba(${gv},${gv},${gv},${pa*0.55})`);sg2.addColorStop(1,'transparent');ctx.fillStyle=sg2;ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill();}
          const veil=ctx.createLinearGradient(0,0,0,H);veil.addColorStop(0,'rgba(60,60,70,0.04)');veil.addColorStop(1,'rgba(80,80,90,0.09)');ctx.fillStyle=veil;ctx.fillRect(0,0,W,H);
          break;
        }
        case 'night': {
          const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'rgba(0,2,14,0.72)');sky.addColorStop(0.45,'rgba(0,4,20,0.45)');sky.addColorStop(1,'rgba(0,6,25,0.18)');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
          [{x:0.18,y:0.10,r:W*0.20,h:240,a:0.07},{x:0.78,y:0.07,r:W*0.16,h:195,a:0.06},{x:0.50,y:0.18,r:W*0.26,h:275,a:0.05}].forEach(nb=>{const g3=ctx.createRadialGradient(nb.x*W,nb.y*H,0,nb.x*W,nb.y*H,nb.r);g3.addColorStop(0,`hsla(${nb.h},60%,35%,${nb.a})`);g3.addColorStop(1,'transparent');ctx.fillStyle=g3;ctx.fillRect(0,0,W,H);});
          const classes=[{n:180,sMin:0.4,sMax:0.9,twMin:0.20,twMax:0.65,yMax:0.60},{n:50,sMin:0.8,sMax:1.6,twMin:0.35,twMax:0.85,yMax:0.50},{n:18,sMin:1.4,sMax:2.4,twMin:0.60,twMax:1.00,yMax:0.42}];
          const seeds=[[127.1,91.3,53.1],[197.7,113.9,71.3],[311.3,173.7,37.9]];
          classes.forEach((cls,ci)=>{const [sx2,sy2,sp2]=seeds[ci];for(let i=0;i<cls.n;i++){const fx=((i*sx2+ci*211)%1+1)%1,fy=((i*sy2+ci*173)%1+1)%1;if(fy>cls.yMax)continue;const fr=((i*sp2)%1+1)%1,sr=cls.sMin+fr*(cls.sMax-cls.sMin),phase2=i*2.3+ci*1.7,tw=cls.twMin+Math.abs(Math.sin(ph*0.7+phase2))*(cls.twMax-cls.twMin);ctx.globalAlpha=tw*0.35;const hg=ctx.createRadialGradient(fx*W,fy*H,0,fx*W,fy*H,sr*4);hg.addColorStop(0,'rgba(220,230,255,0.6)');hg.addColorStop(1,'transparent');ctx.fillStyle=hg;ctx.fillRect(fx*W-sr*5,fy*H-sr*5,sr*10,sr*10);ctx.globalAlpha=tw;ctx.fillStyle='hsl(200,20%,97%)';ctx.beginPath();ctx.arc(fx*W,fy*H,sr*0.55,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}});
          const mx=W*0.80,my=H*0.11,mr=Math.min(W,H)*0.052;const corona=ctx.createRadialGradient(mx,my,mr,mx,my,mr*3.5);corona.addColorStop(0,'rgba(255,250,210,0.18)');corona.addColorStop(1,'transparent');ctx.fillStyle=corona;ctx.fillRect(mx-mr*4,my-mr*4,mr*8,mr*8);ctx.fillStyle='rgba(255,252,225,0.92)';ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,4,20,0.94)';ctx.beginPath();ctx.arc(mx+mr*0.42,my,mr*0.88,0,Math.PI*2);ctx.fill();
          const hmist=ctx.createLinearGradient(0,H*0.60,0,H);hmist.addColorStop(0,'transparent');hmist.addColorStop(1,'rgba(0,10,32,0.42)');ctx.fillStyle=hmist;ctx.fillRect(0,H*0.60,W,H*0.40);
          break;
        }
        case 'lightning': {
          const CYCLE=2.8,cyclePhase=(ph%CYCLE)/CYCLE,isFlash=cyclePhase<0.08,flashAge=cyclePhase/0.08;
          if(isFlash){
            const flashAlpha=Math.pow(1-flashAge,1.8)*0.35*(0.7+Math.sin(ph*47)*0.3);ctx.fillStyle=`rgba(200,215,255,${flashAlpha})`;ctx.fillRect(0,0,W,H);
            const drawBolt=(x1,y1,x2,y2,depth,alpha,lineW)=>{if(depth<=0||alpha<0.03){ctx.strokeStyle=`rgba(220,235,255,${alpha})`;ctx.lineWidth=lineW;ctx.shadowBlur=lineW*8;ctx.shadowColor=`rgba(150,180,255,${alpha*0.7})`;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();return;}const mx2=(x1+x2)/2+(Math.sin(x1*0.1+y1*0.07+ph*31)*W*0.04*(4/depth));const my2=(y1+y2)/2+(Math.cos(y1*0.08+x1*0.05+ph*17)*H*0.015*(4/depth));drawBolt(x1,y1,mx2,my2,depth-1,alpha,lineW);drawBolt(mx2,my2,x2,y2,depth-1,alpha,lineW);if(depth===3&&((Math.sin(ph*13+x1)*0.5+0.5)>0.4)){drawBolt(mx2,my2,mx2+W*(Math.sin(ph*7+y1*0.05)*0.1),my2+H*(0.12+((Math.sin(ph*11+x1*0.03)*0.5+0.5))*0.08),depth-2,alpha*0.55,lineW*0.55);}};
            const fade=1-flashAge,boltX=W*(0.2+((Math.sin(Math.floor(ph/CYCLE)*7.3+1.5)*0.5+0.5))*0.6);ctx.shadowBlur=0;drawBolt(boltX,-5,boltX+W*(Math.sin(ph*3)*0.08),H*0.75,4,fade*0.9,2.2);drawBolt(boltX,-5,boltX+W*(Math.sin(ph*3)*0.08),H*0.75,3,fade*0.35,5.0);ctx.shadowBlur=0;
          }
          const bgGlow=Math.max(0,(0.12-cyclePhase)*8)*0.25;if(bgGlow>0){ctx.fillStyle=`rgba(180,200,255,${bgGlow})`;ctx.fillRect(0,0,W,H);}
          const stormVig=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.25,W/2,H/2,Math.max(W,H)*0.85);stormVig.addColorStop(0,'transparent');stormVig.addColorStop(1,'rgba(0,5,20,0.55)');ctx.fillStyle=stormVig;ctx.fillRect(0,0,W,H);
          break;
        }
        case 'shake': {
          const intensity=Math.min(W,H)*0.018*(0.5+0.5*Math.abs(Math.sin(ph*1.3)));const dx=Math.sin(ph*23.7)*intensity+Math.sin(ph*37.1)*intensity*0.4,dy=Math.cos(ph*19.3)*intensity+Math.cos(ph*29.7)*intensity*0.3;
          const steps=5;for(let s=1;s<=steps;s++){const t2=s/steps;ctx.globalAlpha=0.12*(1-t2*0.6);ctx.drawImage(ctx.canvas,dx*t2,dy*t2);ctx.drawImage(ctx.canvas,-dx*t2*0.5,-dy*t2*0.5);}ctx.globalAlpha=1;
          break;
        }

        // ── EFEITOS PROFISSIONAIS ────────────────────────────────────────────

        case 'glitch_pro': {
          const numSlices=6+Math.floor(Math.sin(ph*7.3)*3);
          for(let s=0;s<numSlices;s++){
            const sy=((s*173.1+Math.floor(ph*12)*97.3)%H+H)%H;
            const sh=2+((s*53.7)%1)*22;
            const ox=Math.sin(ph*23+s*5.1)*W*0.06;
            if(Math.random()<0.65){
              ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.7;
              ctx.drawImage(ctx.canvas,ox*1.4,0,W,H,0,sy,W,sh);
              ctx.globalAlpha=0.5;ctx.fillStyle=`rgba(${Math.random()<0.5?255:0},0,${Math.random()<0.5?255:0},0.12)`;ctx.fillRect(0,sy,W,sh);
              ctx.restore();
            }
          }
          if(Math.floor(ph*15)%4===0){const gy=Math.random()*H;const gl=ctx.createLinearGradient(0,gy,0,gy+3);gl.addColorStop(0,'rgba(0,255,200,0.5)');gl.addColorStop(1,'transparent');ctx.fillStyle=gl;ctx.fillRect(0,gy,W,3);}
          ctx.fillStyle='rgba(0,0,0,0.07)';for(let y=0;y<H;y+=4)ctx.fillRect(0,y,W,1);
          break;
        }
        case 'pixel_sort': {
          const cols=Math.floor(W/3);
          for(let c=0;c<cols;c++){const cx2=c*3;const drift=Math.sin(ph*1.8+c*0.3)*0.5+0.5;const shiftY=-Math.floor(drift*H*0.4);if(Math.abs(shiftY)<2)continue;ctx.drawImage(ctx.canvas,cx2,0,3,H,cx2,shiftY,3,H);}
          ctx.globalAlpha=0.12;ctx.fillStyle='rgba(0,255,180,1)';ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;
          break;
        }
        case 'zoom_blur': {
          const cx2=W/2,cy2=H/2,pulse=0.5+0.5*Math.sin(ph*2.5);
          for(let s=1;s<=6;s++){const sc=1+(s/6)*0.06*pulse;const alpha=(0.12-s*0.015)*pulse;ctx.globalAlpha=Math.max(0,alpha);ctx.save();ctx.translate(cx2,cy2);ctx.scale(sc,sc);ctx.translate(-cx2,-cy2);ctx.drawImage(ctx.canvas,0,0);ctx.restore();}
          ctx.globalAlpha=1;break;
        }
        case 'speed_lines': {
          const cx2=W/2+Math.sin(ph*0.7)*W*0.05,cy2=H/2+Math.cos(ph*0.5)*H*0.04;
          const spd2=0.3+0.7*Math.abs(Math.sin(ph*1.5));
          for(let i=0;i<60;i++){const angle=(i/60)*Math.PI*2+ph*0.4;const len=(0.3+((i*73.1)%1)*0.7)*Math.max(W,H)*0.6;const startR=Math.min(W,H)*0.05*spd2;const lw=0.4+((i*53.3)%1)*1.2;const alpha=(0.15+((i*37.7)%1)*0.25)*spd2;const x1=cx2+Math.cos(angle)*startR,y1=cy2+Math.sin(angle)*startR;const x2=cx2+Math.cos(angle)*(startR+len),y2=cy2+Math.sin(angle)*(startR+len);const sg2=ctx.createLinearGradient(x1,y1,x2,y2);sg2.addColorStop(0,`rgba(255,255,255,${alpha})`);sg2.addColorStop(1,'transparent');ctx.strokeStyle=sg2;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
          break;
        }
        case 'shockwave': {
          const cx2=W/2,cy2=H/2,maxR=Math.max(W,H)*0.8,phase2=ph%1.8;
          for(let ring=0;ring<3;ring++){const rph=(phase2+ring*0.6)%1.8;const r=rph*maxR;const alpha=Math.max(0,0.5-rph*0.27)*(1-ring*0.25);const lw=(3-ring)*2*(1-rph*0.5);if(alpha<0.01)continue;ctx.strokeStyle=`rgba(200,230,255,${alpha})`;ctx.lineWidth=lw;ctx.shadowBlur=lw*6;ctx.shadowColor=`rgba(150,200,255,${alpha*0.7})`;ctx.beginPath();ctx.ellipse(cx2,cy2,r,r*(H/W),0,0,Math.PI*2);ctx.stroke();}
          ctx.shadowBlur=0;break;
        }
        case 'duotone': {
          const hue1=(ph*20)%360,hue2=(hue1+150)%360;
          ctx.globalCompositeOperation='multiply';ctx.globalAlpha=0.55;
          const dg=ctx.createLinearGradient(0,0,W,H);dg.addColorStop(0,`hsl(${hue1},80%,25%)`);dg.addColorStop(1,`hsl(${hue2},80%,25%)`);ctx.fillStyle=dg;ctx.fillRect(0,0,W,H);
          ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.35;
          const lg2=ctx.createLinearGradient(W,0,0,H);lg2.addColorStop(0,`hsl(${hue1},100%,70%)`);lg2.addColorStop(1,`hsl(${hue2},100%,70%)`);ctx.fillStyle=lg2;ctx.fillRect(0,0,W,H);
          ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;break;
        }
        case 'hologram': {
          const scanY=((ph*60)%H+H)%H;
          ctx.fillStyle='rgba(0,0,0,0.15)';for(let y=0;y<H;y+=3)ctx.fillRect(0,y,W,1);
          const barG=ctx.createLinearGradient(0,scanY-10,0,scanY+10);barG.addColorStop(0,'transparent');barG.addColorStop(0.5,'rgba(0,255,220,0.18)');barG.addColorStop(1,'transparent');ctx.fillStyle=barG;ctx.fillRect(0,scanY-10,W,20);
          ctx.globalCompositeOperation='screen';ctx.globalAlpha=0.08;ctx.fillStyle='rgba(0,255,220,1)';ctx.fillRect(2,0,W,H);ctx.fillStyle='rgba(255,0,180,1)';ctx.fillRect(-2,0,W,H);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
          ctx.fillStyle='rgba(0,255,200,0.06)';for(let gx=0;gx<W;gx+=8)for(let gy=0;gy<H;gy+=8)ctx.fillRect(gx,gy,1,1);
          const bg2=0.3+0.2*Math.sin(ph*3);ctx.strokeStyle=`rgba(0,255,200,${bg2})`;ctx.lineWidth=2;ctx.shadowBlur=12;ctx.shadowColor='rgba(0,255,200,0.5)';ctx.strokeRect(3,3,W-6,H-6);ctx.shadowBlur=0;
          break;
        }
        case 'retrowave': {
          const horizon=H*0.55;
          const sky2=ctx.createLinearGradient(0,0,0,horizon);sky2.addColorStop(0,'rgba(20,0,40,0.7)');sky2.addColorStop(1,'rgba(80,0,80,0.4)');ctx.fillStyle=sky2;ctx.fillRect(0,0,W,horizon);
          const sunY=H*0.42,sunR=Math.min(W,H)*0.14;const sunG=ctx.createRadialGradient(W/2,sunY,0,W/2,sunY,sunR);sunG.addColorStop(0,'rgba(255,240,50,0.9)');sunG.addColorStop(0.4,'rgba(255,100,20,0.7)');sunG.addColorStop(1,'rgba(200,0,80,0)');ctx.fillStyle=sunG;ctx.fillRect(W/2-sunR,sunY-sunR,sunR*2,sunR*2);
          ctx.fillStyle='rgba(20,0,40,0.65)';for(let i=0;i<8;i++){const ly=sunY-sunR+i*sunR*0.28;if(ly<sunY-sunR||ly>sunY+sunR*0.1)continue;ctx.fillRect(W/2-sunR,ly,sunR*2,sunR*0.1*(i*0.3+0.5));}
          ctx.strokeStyle='rgba(255,0,180,0.35)';ctx.lineWidth=1;const vp={x:W/2,y:horizon};
          for(let i=-10;i<=10;i++){const bx=W/2+i*(W/10);ctx.beginPath();ctx.moveTo(vp.x,vp.y);ctx.lineTo(bx,H);ctx.stroke();}
          for(let i=0;i<=8;i++){const prog=Math.pow(i/8,2);const hy=horizon+(H-horizon)*prog;const perspX=W/2+(W/2)*prog;ctx.strokeStyle=`rgba(255,0,180,${0.15+prog*0.4})`;ctx.beginPath();ctx.moveTo(W/2-perspX,hy);ctx.lineTo(W/2+perspX,hy);ctx.stroke();}
          const ao=((ph*0.3)%1);ctx.strokeStyle='rgba(0,220,255,0.2)';ctx.lineWidth=1;for(let i=0;i<=8;i++){const pa=Math.pow(((i+ao)%(9))/8,2);const ha=horizon+(H-horizon)*pa;const pxa=W/2+(W/2)*pa;ctx.beginPath();ctx.moveTo(W/2-pxa,ha);ctx.lineTo(W/2+pxa,ha);ctx.stroke();}
          break;
        }
        case 'bokeh': {
          for(let i=0;i<40;i++){const fx=((i*197.3+Math.sin(ph*0.3+i*0.7)*0.05)%1+1)%1;const fy=((i*113.7+ph*(0.02+((i*53)%1)*0.03))%1+1)%1;const r=8+((i*71.3)%1)*40;const alpha=0.04+Math.abs(Math.sin(ph*0.8+i*1.3))*0.1;const hue2=(i*37+ph*15)%360;const bg2=ctx.createRadialGradient(fx*W,fy*H,0,fx*W,fy*H,r);bg2.addColorStop(0,`hsla(${hue2},80%,75%,${alpha*2})`);bg2.addColorStop(0.4,`hsla(${hue2},80%,75%,${alpha})`);bg2.addColorStop(0.8,`hsla(${hue2},80%,75%,${alpha*0.3})`);bg2.addColorStop(1,'transparent');ctx.fillStyle=bg2;ctx.beginPath();ctx.arc(fx*W,fy*H,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle=`hsla(${hue2},90%,85%,${alpha*1.5})`;ctx.lineWidth=0.8;ctx.beginPath();ctx.arc(fx*W,fy*H,r*0.85,0,Math.PI*2);ctx.stroke();}
          break;
        }
        case 'snow': {
          const sLayers=[{n:60,size:1.2,spd:40,alpha:0.5},{n:40,size:2.2,spd:70,alpha:0.7},{n:20,size:3.5,spd:100,alpha:0.9}];
          sLayers.forEach((L,li)=>{for(let i=0;i<L.n;i++){const hx=((i*(127.1+li*50)+li*311.7)%1+1)%1;const hy=((i*(91.3+li*30)+li*173.9)%1+1)%1;const px2=((hx*W+Math.sin(ph*0.4+i*0.9+li)*W*L.alpha*0.1)+W)%W;const py2=((hy*H+ph*L.spd)%H+H)%H;const flicker=0.7+0.3*Math.sin(ph*3+i*1.7);ctx.globalAlpha=L.alpha*flicker;const sg2=ctx.createRadialGradient(px2,py2,0,px2,py2,L.size);sg2.addColorStop(0,'rgba(255,255,255,1)');sg2.addColorStop(1,'rgba(220,235,255,0)');ctx.fillStyle=sg2;ctx.beginPath();ctx.arc(px2,py2,L.size,0,Math.PI*2);ctx.fill();}});
          ctx.globalAlpha=1;break;
        }
        case 'sparkles': {
          for(let i=0;i<25;i++){const life=((ph*(0.5+((i*53.1)%1)*1.0)+i*0.4)%1+1)%1;const fx=((i*197.3+Math.sin(i*2.3+ph*0.2)*0.1)%1+1)%1;const fy=((i*113.7+Math.cos(i*1.9+ph*0.15)*0.08)%1+1)%1;const r=(2+((i*71.3)%1)*6)*Math.sin(life*Math.PI);const alpha=Math.sin(life*Math.PI)*0.9;if(alpha<0.05||r<0.5)continue;const hue2=(i*47+40)%60+30;const cx2=fx*W,cy2=fy*H;ctx.strokeStyle=`hsla(${hue2},100%,90%,${alpha})`;ctx.lineWidth=r*0.25;ctx.shadowBlur=r*3;ctx.shadowColor=`hsla(${hue2},100%,80%,${alpha})`;ctx.beginPath();ctx.moveTo(cx2-r,cy2);ctx.lineTo(cx2+r,cy2);ctx.stroke();ctx.beginPath();ctx.moveTo(cx2,cy2-r);ctx.lineTo(cx2,cy2+r);ctx.stroke();ctx.lineWidth=r*0.12;ctx.beginPath();ctx.moveTo(cx2-r*0.7,cy2-r*0.7);ctx.lineTo(cx2+r*0.7,cy2+r*0.7);ctx.stroke();ctx.beginPath();ctx.moveTo(cx2+r*0.7,cy2-r*0.7);ctx.lineTo(cx2-r*0.7,cy2+r*0.7);ctx.stroke();}
          ctx.shadowBlur=0;break;
        }
        case 'mirror': {
          const prog=(ph*0.4)%1;const alpha2=Math.min(1,Math.min(prog,1-prog)*10);
          if(alpha2>0.1){ctx.save();ctx.globalAlpha=alpha2;ctx.save();ctx.translate(W,0);ctx.scale(-1,1);ctx.drawImage(ctx.canvas,0,0,W/2,H,0,0,W/2,H);ctx.restore();const mg=ctx.createLinearGradient(W/2-4,0,W/2+4,0);mg.addColorStop(0,'transparent');mg.addColorStop(0.5,'rgba(255,255,255,0.5)');mg.addColorStop(1,'transparent');ctx.fillStyle=mg;ctx.fillRect(W/2-4,0,8,H);ctx.restore();}
          break;
        }
        case 'neon_lines': {
          for(let i=0;i<8;i++){const progress=((ph*0.25+i/8)%1+1)%1;const hue2=(i*45+ph*20)%360;const x1=-W*0.2+(W*1.4)*progress;const alpha=Math.sin(progress*Math.PI)*0.6;if(alpha<0.05)continue;ctx.strokeStyle=`hsla(${hue2},100%,65%,${alpha})`;ctx.lineWidth=2;ctx.shadowBlur=16;ctx.shadowColor=`hsla(${hue2},100%,70%,${alpha})`;ctx.beginPath();ctx.moveTo(x1,0);ctx.lineTo(x1+H*0.4,H);ctx.stroke();}
          ctx.shadowBlur=0;break;
        }
        case 'old_film': {
          const flicker=0.88+0.12*Math.random();ctx.fillStyle=`rgba(180,140,60,${0.12*flicker})`;ctx.fillRect(0,0,W,H);
          for(let i=0;i<1200;i++){const gx=Math.random()*W,gy=Math.random()*H,gv=Math.floor(Math.random()*180);ctx.fillStyle=`rgba(${gv},${gv},${gv*0.7},${Math.random()*0.35})`;ctx.fillRect(gx,gy,1,1);}
          for(let s=0;s<3;s++){const sx=((s*317+Math.floor(ph*12)*89)%W+W)%W;const slen=H*(0.3+Math.random()*0.7);const sy=Math.random()*(H-slen);ctx.strokeStyle=`rgba(255,240,200,${0.15+Math.random()*0.25})`;ctx.lineWidth=0.5+Math.random();ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+0.5,sy+slen);ctx.stroke();}
          const ovg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.2,W/2,H/2,Math.max(W,H)*0.75);ovg.addColorStop(0,'transparent');ovg.addColorStop(1,'rgba(20,10,0,0.65)');ctx.fillStyle=ovg;ctx.fillRect(0,0,W,H);
          break;
        }

        default: break;
      }
    } finally {
      ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
      ctx.filter='none'; ctx.shadowBlur=0; ctx.shadowColor='transparent';
      ctx.restore();
    }
  };
  drawScreenEffectRef.current = _drawScreenEffectImpl;



    const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Quando tocando: tempo do projeto = audioOffset + (audio.currentTime - audioTrimStart)
    // Quando pausado: virtualTimeRef tem a posição correta do playhead
    const time = (!rtExportRef.current && audioRef.current && isPlayingRef.current && !audioRef.current.paused)
      ? audioOffsetRef.current + (audioRef.current.currentTime - (audioTrimStartRef.current || 0))
      : virtualTimeRef.current;
    // Reset completo do estado ctx para evitar vazamento entre frames
    // (shadowBlur, filter, globalAlpha definidos fora de save/restore contaminam o próximo frame)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Desenha TODOS os vídeos ativos (abaixo das imagens)
    getVideosForTime(time).forEach(v => {
      if (!v.videoEl || v.videoEl.readyState < 1 || v.videoEl.videoWidth === 0) return;
      // Aplica keyframes de zoom animado se existirem
      const kfState = getKfState(v, time);
      const vx = kfState ? kfState.x : v.x;
      const vy = kfState ? kfState.y : v.y;
      const vw = kfState ? kfState.w : v.width;
      const vh = kfState ? kfState.h : v.height;
      const vRot = kfState ? kfState.rotation * Math.PI / 180 : (v.rotation || 0) * Math.PI / 180;
      const vOp  = kfState ? kfState.opacity : 1;
      const _vf  = buildFilterString(v.filters);
      const _vtr = getTransitionTransform(v, time);
      const vProxy = { ...v, x: vx, y: vy, width: vw, height: vh };
      ctx.save();
      if (kfState) ctx.globalAlpha = Math.max(0, Math.min(1, vOp));
      if (_vtr) { _applyTr(ctx, _vtr, _vf, vProxy); }
      else if (_vf !== 'none') { ctx.filter = _vf; }
      applyElementMask(ctx, vProxy);
      const drawVid = (tCtx) => drawRotatedElement(tCtx || ctx, () => drawRoundedImage(tCtx || ctx, v.videoEl, vx, vy, vw, vh, v.radius ?? 12), vx, vy, vw, vh, kfState ? kfState.rotation : v.rotation);
      applyElementChromatic(ctx, vProxy, drawVid);
      ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.restore();
      if (activeVideoId === v.id) {
        const cx = vx + vw / 2, cy = vy + vh / 2;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(vRot); ctx.translate(-cx, -cy);
        ctx.strokeStyle = 'rgba(167,139,250,0.9)';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, vx, vy, vw, vh, (v.radius ?? 12) + 2);
        ctx.stroke();
        drawResizeHandles(ctx, vx, vy, vw, vh);
        ctx.restore();
      }
    });

    // Desenha TODAS as imagens ativas no instante (camadas simultâneas)
    const overlayImages = getImagesForTime(time);
    overlayImages.forEach(overlayImage => {
      const kfStateI = getKfState(overlayImage, time);
      const ix = kfStateI ? kfStateI.x : overlayImage.x;
      const iy = kfStateI ? kfStateI.y : overlayImage.y;
      const iw = kfStateI ? kfStateI.w : overlayImage.width;
      const ih = kfStateI ? kfStateI.h : overlayImage.height;
      const iRot = kfStateI ? kfStateI.rotation * Math.PI / 180 : (overlayImage.rotation || 0) * Math.PI / 180;
      const iOp  = kfStateI ? kfStateI.opacity : 1;
      const _if  = buildFilterString(overlayImage.filters);
      const _itr = getTransitionTransform(overlayImage, time);
      const iProxy = { ...overlayImage, x: ix, y: iy, width: iw, height: ih };
      ctx.save();
      if (kfStateI) ctx.globalAlpha = Math.max(0, Math.min(1, iOp));
      if (_itr) { _applyTr(ctx, _itr, _if, iProxy); }
      else if (_if !== 'none') { ctx.filter = _if; }
      drawRotatedElement(ctx, () => drawRoundedImage(ctx, overlayImage.img, ix, iy, iw, ih, overlayImage.radius ?? 18), ix, iy, iw, ih, kfStateI ? kfStateI.rotation : overlayImage.rotation);
      ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.restore();
      if (activeImageId === overlayImage.id) {
        const cx = ix + iw / 2, cy = iy + ih / 2;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(iRot); ctx.translate(-cx, -cy);
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.9)';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, ix, iy, iw, ih, (overlayImage.radius ?? 18) + 2);
        ctx.stroke();
        drawResizeHandles(ctx, ix, iy, iw, ih);
        ctx.restore();
      }
    });

    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,0,0,0.8)";

    // Desenha todos os Textos Extras
    extraTexts.forEach((txt) => {
      const tColor = txt.color || extraTextColor;
      const tFont  = txt.fontFamily || extraTextFontFamily;
      const tSize  = txt.fontSize || extraTextFontSize;
      const lines = txt.text.split('\n');
      const lineH = tSize * 1.25;
      const rot = (txt.rotation || 0) * Math.PI / 180;
      // Efeito de fundo do texto extra
      if (txt.bgEffect && txt.bgEffect !== 'none') {
        ctx.save();
        ctx.translate(txt.x, txt.y);
        ctx.rotate(rot);
        ctx.font = `bold ${tSize}px ${tFont}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const _etotalH = lines.length * lineH;
        drawTextBgEffectRef.current?.(ctx, txt.bgEffect, lines, tSize, lineH, _etotalH);
        ctx.restore();
      }
      ctx.save();
      if (txt.bgEffect && txt.bgEffect !== 'none') {
        ctx.save();
        ctx.translate(txt.x, txt.y);
        ctx.rotate(rot);
        ctx.font = `bold ${tSize}px ${tFont}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const _etH = lines.length * lineH;
        drawTextBgEffectRef.current?.(ctx, txt.bgEffect, lines, tSize, lineH, _etH);
        ctx.restore();
      }
      ctx.translate(txt.x, txt.y);
      ctx.rotate(rot);
      ctx.font = `bold ${tSize}px ${tFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (txt.shadowEnabled ?? true) {
        ctx.shadowBlur    = txt.shadowBlur ?? 10;
        ctx.shadowColor   = txt.shadowColor || 'rgba(0,0,0,0.8)';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
      }
      const totalH = lines.length * lineH;
      lines.forEach((line, li) => {
        const lineY = -totalH / 2 + li * lineH + lineH / 2;
        if (txt.gradientEnabled) {
          const w = ctx.measureText(line).width;
          const grad = ctx.createLinearGradient(-w/2, lineY - tSize/2, w/2, lineY + tSize/2);
          grad.addColorStop(0, txt.gradientColor1 || '#ffffff');
          grad.addColorStop(1, txt.gradientColor2 || '#00BFFF');
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = tColor;
        }
        ctx.fillText(line, 0, lineY);
      });
      ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

      // Indicador de seleção
      if (activeExtraTextId === txt.id) {
        ctx.font = `bold ${tSize}px ${tFont}`;
        const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
        const hw = maxW / 2 + 10;
        const hh = totalH / 2 + 8;
        ctx.strokeStyle = 'rgba(167,139,250,0.9)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(-hw, -hh, hw * 2, hh * 2);
        ctx.setLineDash([]);
        // Handle de rotação
        const handleDist = hh + 20;
        ctx.beginPath();
        ctx.arc(0, -handleDist, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.9)';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Linha conectando box ao handle
        ctx.beginPath();
        ctx.moveTo(0, -hh);
        ctx.lineTo(0, -handleDist + 7);
        ctx.strokeStyle = 'rgba(167,139,250,0.7)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    });

    // Desenha Letra da Música
    const activeLine = lyrics.find(l => time >= l.start && time <= l.end);
    if (activeLine) {
      const lx = activeLine.x ?? canvas.width / 2;
      const ly = activeLine.y ?? canvas.height * 0.75;
      const lRot = (activeLine.rotation || 0) * Math.PI / 180;
      // ── Usa font/size por-lyric se definido, senão usa global ──────────────
      const lFontSize = activeLine.fontSize || fontSize;
      const lFontFamily = activeLine.fontFamily || fontFamily;
      ctx.font = `bold ${lFontSize}px ${lFontFamily}`;
      const lines = wrapLyricText(activeLine.text, ctx, canvas.width - 40);
      const lineH = lFontSize * 1.3;
      const totalH = lines.length * lineH;

      // ── Animação de entrada (preview — usa `time`) ──────────────────────
      const _anim  = activeLine.animType || 'none';
      const _twSpd = activeLine.twSpeed  || 30;
      const _elaps = Math.max(0, time - activeLine.start);
      const _ease  = 1 - Math.pow(1 - Math.min(1, _elaps / 0.45), 2);
      const _twCh  = _anim === 'typewriter' ? Math.floor(_elaps * _twSpd) : Infinity;
      // Efeito de fundo atrás do texto
      const _bgFx = activeLine.bgEffect ?? textBgEffect;
      if (_bgFx && _bgFx !== 'none') {
        ctx.save();
        if (_anim === 'fade')  ctx.globalAlpha = _ease;
        if (_anim === 'slide') ctx.translate(0, (1 - _ease) * 48);
        ctx.translate(lx, ly);
        ctx.rotate(lRot);
        ctx.font = `bold ${lFontSize}px ${lFontFamily}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        drawTextBgEffectRef.current?.(ctx, _bgFx, lines, lFontSize, lineH, totalH);
        ctx.restore();
      }
      ctx.save();
      if (_anim === 'fade')  ctx.globalAlpha = _ease;
      if (_anim === 'slide') ctx.translate(0, (1 - _ease) * 48);
      ctx.translate(lx, ly);
      ctx.rotate(lRot);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Lê da marcação; fallback para global
      const _shOn  = activeLine.shadowEnabled   !== undefined ? activeLine.shadowEnabled   : shadowEnabled;
      const _shBlur= activeLine.shadowBlur      !== undefined ? activeLine.shadowBlur      : shadowBlur;
      const _shCol = activeLine.shadowColor     || shadowColor;
      const _shOX  = activeLine.shadowOffsetX   !== undefined ? activeLine.shadowOffsetX   : shadowOffsetX;
      const _shOY  = activeLine.shadowOffsetY   !== undefined ? activeLine.shadowOffsetY   : shadowOffsetY;
      const _grOn  = activeLine.gradientEnabled !== undefined ? activeLine.gradientEnabled : gradientEnabled;
      const _gr1   = activeLine.gradientColor1  || gradientColor1;
      const _gr2   = activeLine.gradientColor2  || gradientColor2;
      const _col   = activeLine.color           || textColor;
      if (_shOn) {
        ctx.shadowBlur    = _shBlur;
        ctx.shadowColor   = _shCol;
        ctx.shadowOffsetX = _shOX;
        ctx.shadowOffsetY = _shOY;
      }
      let _twN = 0;
      lines.forEach((line, li) => {
        const lineY = -totalH / 2 + li * lineH + lineH / 2;
        const upperLine = line.toUpperCase();
        let vis = upperLine;
        if (_anim === 'typewriter') {
          const rem = _twCh - _twN; _twN += upperLine.length;
          if (rem <= 0) return;
          vis = upperLine.slice(0, rem);
        }
        if (_grOn) {
          const w = ctx.measureText(vis).width;
          const grad = ctx.createLinearGradient(-w / 2, lineY - lFontSize / 2, w / 2, lineY + lFontSize / 2);
          grad.addColorStop(0, _gr1);
          grad.addColorStop(1, _gr2);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = _col;
        }
        ctx.fillText(vis, 0, lineY);
      });
      ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      ctx.globalAlpha = 1;
      ctx.restore();

      // Indicador de seleção / arrasto + handle de rotação
      if (activeLyricId === activeLine.id && editingLyricId !== activeLine.id) {
        ctx.font = `bold ${lFontSize}px ${lFontFamily}`;
        const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l.toUpperCase()).width), 0);
        const hw = maxW / 2 + 14;
        const hh = totalH / 2 + 10;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(lRot);
        ctx.strokeStyle = 'rgba(139,92,246,0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(-hw, -hh, hw * 2, hh * 2);
        ctx.setLineDash([]);
        // Rotation handle
        const handleDist = hh + 22;
        ctx.beginPath();
        ctx.arc(0, -handleDist, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,0.9)';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -hh);
        ctx.lineTo(0, -handleDist + 8);
        ctx.strokeStyle = 'rgba(139,92,246,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }

    // ── Stickers / Emojis / GIFs ─────────────────────────────────────────────
    const _sNow = Date.now() / 1000;
    stickersRef.current.filter(stk => {
      // Se o sticker tem start/end definidos, só mostra no intervalo
      if (stk.start !== undefined && stk.end !== undefined) {
        return time >= stk.start && time <= stk.end;
      }
      return true; // stickers legados (sem start/end) sempre visíveis
    }).forEach(stk => {
      const sz = stk.size || 80;
      const { dy, s, r, a } = getStickerAnimTransform(stk.animStyle, _sNow, sz);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(stk.x, stk.y + dy);
      ctx.rotate((stk.rotation || 0) * Math.PI / 180 + r);
      ctx.scale(s, s);
      ctx.font = `${sz}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(stk.content, 0, 0);
      // Indicador de seleção + handles de resize
      if (activeStickerRef.current === stk.id) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(0,191,255,0.85)';
        ctx.lineWidth = 2 / s;
        ctx.setLineDash([5, 4]);
        const bx = -sz / 2 - 8, by = -sz / 2 - 8, bw = sz + 16, bh = sz + 16;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);
        // Corner resize handles
        const hs = 9 / s;
        ctx.fillStyle = '#00BFFF';
        [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([hx,hy]) => {
          ctx.fillRect(hx - hs/2, hy - hs/2, hs, hs);
        });
      }
      ctx.restore();
    });
    // ── Molduras (desenhadas sobre tudo, antes dos efeitos globais) ────────────
    framesRef.current.forEach(fr => {
      const fw = fr.width || 200, fh = fr.height || 200;
      const fx = fr.x || 0, fy = fr.y || 0;
      const frot = (fr.rotation || 0) * Math.PI / 180;
      const th = fr.thickness || 6;
      const col = fr.color || '#ffffff';
      const cr = fr.cornerRadius || 0;
      const op = fr.opacity ?? 1;
      ctx.save();
      ctx.globalAlpha = op;
      if (frot) {
        const fcx = fx + fw/2, fcy = fy + fh/2;
        ctx.translate(fcx, fcy); ctx.rotate(frot); ctx.translate(-fcx, -fcy);
      }
      ctx.strokeStyle = col;
      ctx.lineWidth = th;
      ctx.shadowBlur = 0;
      const isActive = activeFrameId === fr.id;

      switch (fr.style) {
        case 'solid': {
          if (cr > 0) {
            ctx.beginPath();
            ctx.moveTo(fx+cr, fy); ctx.lineTo(fx+fw-cr, fy);
            ctx.arcTo(fx+fw, fy, fx+fw, fy+cr, cr);
            ctx.lineTo(fx+fw, fy+fh-cr);
            ctx.arcTo(fx+fw, fy+fh, fx+fw-cr, fy+fh, cr);
            ctx.lineTo(fx+cr, fy+fh);
            ctx.arcTo(fx, fy+fh, fx, fy+fh-cr, cr);
            ctx.lineTo(fx, fy+cr);
            ctx.arcTo(fx, fy, fx+cr, fy, cr);
            ctx.closePath(); ctx.stroke();
          } else {
            ctx.strokeRect(fx, fy, fw, fh);
          }
          break;
        }
        case 'double': {
          const off = th * 1.5;
          ctx.lineWidth = th * 0.6;
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.strokeRect(fx+off, fy+off, fw-off*2, fh-off*2);
          break;
        }
        case 'dashed': {
          ctx.setLineDash([th*3, th*2]);
          if (cr > 0) {
            ctx.beginPath(); ctx.moveTo(fx+cr, fy); ctx.lineTo(fx+fw-cr, fy);
            ctx.arcTo(fx+fw, fy, fx+fw, fy+cr, cr); ctx.lineTo(fx+fw, fy+fh-cr);
            ctx.arcTo(fx+fw, fy+fh, fx+fw-cr, fy+fh, cr); ctx.lineTo(fx+cr, fy+fh);
            ctx.arcTo(fx, fy+fh, fx, fy+fh-cr, cr); ctx.lineTo(fx, fy+cr);
            ctx.arcTo(fx, fy, fx+cr, fy, cr); ctx.closePath(); ctx.stroke();
          } else { ctx.strokeRect(fx, fy, fw, fh); }
          ctx.setLineDash([]);
          break;
        }
        case 'dotted': {
          ctx.setLineDash([th, th*2]);
          ctx.lineCap = 'round';
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.setLineDash([]); ctx.lineCap = 'butt';
          break;
        }
        case 'neon': {
          ctx.shadowBlur = th * 4; ctx.shadowColor = col;
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.shadowBlur = th * 8; ctx.shadowColor = col;
          ctx.lineWidth = th * 0.5;
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.shadowBlur = 0;
          break;
        }
        case 'neon_double': {
          const col2 = fr.color2 || '#ff00ff';
          ctx.shadowBlur = th*5; ctx.shadowColor = col;
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.shadowBlur = th*5; ctx.shadowColor = col2;
          ctx.strokeStyle = col2; ctx.lineWidth = th * 0.4;
          ctx.strokeRect(fx+th*1.2, fy+th*1.2, fw-th*2.4, fh-th*2.4);
          ctx.shadowBlur = 0;
          break;
        }
        case 'gradient': {
          const gg = ctx.createLinearGradient(fx, fy, fx+fw, fy+fh);
          gg.addColorStop(0, col);
          gg.addColorStop(0.5, fr.color2 || '#00bfff');
          gg.addColorStop(1, col);
          ctx.strokeStyle = gg;
          ctx.strokeRect(fx, fy, fw, fh);
          break;
        }
        case 'corners': {
          const cl = Math.min(fw, fh) * 0.22;
          ctx.lineCap = 'square';
          // TL
          ctx.beginPath(); ctx.moveTo(fx, fy+cl); ctx.lineTo(fx, fy); ctx.lineTo(fx+cl, fy); ctx.stroke();
          // TR
          ctx.beginPath(); ctx.moveTo(fx+fw-cl, fy); ctx.lineTo(fx+fw, fy); ctx.lineTo(fx+fw, fy+cl); ctx.stroke();
          // BL
          ctx.beginPath(); ctx.moveTo(fx, fy+fh-cl); ctx.lineTo(fx, fy+fh); ctx.lineTo(fx+cl, fy+fh); ctx.stroke();
          // BR
          ctx.beginPath(); ctx.moveTo(fx+fw-cl, fy+fh); ctx.lineTo(fx+fw, fy+fh); ctx.lineTo(fx+fw, fy+fh-cl); ctx.stroke();
          ctx.lineCap = 'butt';
          break;
        }
        case 'corners_round': {
          const cl = Math.min(fw, fh) * 0.2;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(fx, fy+cl); ctx.quadraticCurveTo(fx, fy, fx+cl, fy); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(fx+fw-cl, fy); ctx.quadraticCurveTo(fx+fw, fy, fx+fw, fy+cl); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(fx, fy+fh-cl); ctx.quadraticCurveTo(fx, fy+fh, fx+cl, fy+fh); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(fx+fw-cl, fy+fh); ctx.quadraticCurveTo(fx+fw, fy+fh, fx+fw, fy+fh-cl); ctx.stroke();
          ctx.lineCap = 'butt';
          break;
        }
        case 'film': {
          ctx.fillStyle = col;
          const hp = fh * 0.06, pw = fw * 0.035, gap = pw * 1.6;
          const count = Math.floor((fw * 0.8) / (pw + gap));
          const total = count * (pw + gap) - gap;
          const startX = fx + (fw - total) / 2;
          for (let i = 0; i < count; i++) {
            const px = startX + i * (pw + gap);
            ctx.fillRect(px, fy + hp*0.3, pw, hp);
            ctx.fillRect(px, fy + fh - hp*1.3, pw, hp);
          }
          ctx.lineWidth = th; ctx.strokeStyle = col;
          ctx.strokeRect(fx, fy + hp*1.8, fw, fh - hp*3.6);
          break;
        }
        case 'polaroid': {
          ctx.fillStyle = col;
          ctx.globalAlpha = op * 0.92;
          const bw = th * 1.5;
          ctx.fillRect(fx, fy, fw, bw);
          ctx.fillRect(fx, fy+fh-bw*3, fw, bw*3);
          ctx.fillRect(fx, fy+bw, bw, fh-bw*4);
          ctx.fillRect(fx+fw-bw, fy+bw, bw, fh-bw*4);
          break;
        }
        case 'art_deco': {
          ctx.lineWidth = th * 0.5;
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.strokeRect(fx+th*2, fy+th*2, fw-th*4, fh-th*4);
          const cdl = Math.min(fw,fh)*0.08;
          [[fx,fy],[fx+fw,fy],[fx,fy+fh],[fx+fw,fy+fh]].forEach(([cx2,cy2]) => {
            ctx.beginPath();
            ctx.arc(cx2, cy2, cdl, 0, Math.PI*2);
            ctx.stroke();
          });
          break;
        }
        case 'vintage': {
          ctx.lineWidth = th*0.7; ctx.strokeRect(fx+th, fy+th, fw-th*2, fh-th*2);
          ctx.lineWidth = th*1.4; ctx.setLineDash([th*1.5,th]);
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.setLineDash([]);
          break;
        }
        case 'shadow': {
          ctx.shadowColor = col; ctx.shadowBlur = th*3;
          ctx.shadowOffsetX = th; ctx.shadowOffsetY = th;
          ctx.lineWidth = th * 0.5; ctx.strokeRect(fx, fy, fw, fh);
          ctx.shadowBlur=0; ctx.shadowOffsetX=0; ctx.shadowOffsetY=0;
          break;
        }
        case 'glitch_frame': {
          const off2 = th * 0.8;
          ctx.strokeStyle = '#ff0040'; ctx.strokeRect(fx+off2, fy-off2*0.5, fw, fh);
          ctx.strokeStyle = '#00ffcc'; ctx.strokeRect(fx-off2*0.5, fy+off2, fw, fh);
          ctx.strokeStyle = col; ctx.lineWidth = th*0.5;
          if (Math.sin(Date.now()/80)>0.3) { ctx.strokeRect(fx-1, fy+Math.random()*fh*0.3, fw+2, fh*0.05); }
          break;
        }
        default:
          ctx.strokeRect(fx, fy, fw, fh);
      }

      // Selection indicator
      if (isActive) {
        ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(0,191,255,0.9)';
        ctx.lineWidth = 1.5; ctx.setLineDash([4,3]);
        ctx.strokeRect(fx-6, fy-6, fw+12, fh+12);
        ctx.setLineDash([]);
        // Resize handles
        ctx.fillStyle = '#00BFFF';
        const hs2 = 8;
        [[fx,fy],[fx+fw,fy],[fx,fy+fh],[fx+fw,fy+fh]].forEach(([hx2,hy2]) => {
          ctx.fillRect(hx2-hs2/2, hy2-hs2/2, hs2, hs2);
        });
      }
      ctx.restore();
    });

    // ── Curvas de Cor (pós-processamento global) ──────────────────────────────
    const cc = colorCurves;
    const hasCC = cc && (Math.abs(cc.r-1)>0.01||Math.abs(cc.g-1)>0.01||Math.abs(cc.b-1)>0.01||
                         Math.abs(cc.midtone-1)>0.01||Math.abs(cc.shadows)>0.01||Math.abs(cc.highlights)>0.01);
    if (hasCC) {
      try {
        // CSS filter approach: GPU-accelerated, funciona mesmo com canvas tainted por vídeo.
        // Mapeia os canais R/G/B e parâmetros de curva para funções CSS filter equivalentes.
        const fR  = cc.r  ?? 1;
        const fG  = cc.g  ?? 1;
        const fB  = cc.b  ?? 1;
        const mid = cc.midtone   ?? 1;  // gamma (>1 = mais brilho nos meios-tons)
        const shd = cc.shadows   ?? 0;  // aumento nas sombras (0-1)
        const hlt = cc.highlights ?? 0; // aumento nos realces (0-1)
        // Saturação estimada a partir do desvio entre canais RGB
        const maxRGB = Math.max(fR, fG, fB);
        const minRGB = Math.min(fR, fG, fB);
        const satEst = minRGB > 0 ? maxRGB / minRGB : 1;
        const satPct  = Math.round(Math.max(0, Math.min(5, satEst)) * 100);
        const brightPct = Math.round(Math.max(0, Math.min(3, mid)) * 100);
        const contrastPct = Math.round(100 + (hlt - shd) * 60);
        const tmp = document.createElement('canvas');
        tmp.width = canvas.width; tmp.height = canvas.height;
        const tctx = tmp.getContext('2d');
        tctx.filter = `brightness(${brightPct}%) saturate(${satPct}%) contrast(${contrastPct}%)`;
        tctx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tmp, 0, 0);
      } catch(e) {}
    }
    // ── Overlay de Vídeo ──────────────────────────────────────────────────────────
    const _ovEl = overlayVideoRef.current;
    const _ovId = activeOverlayRef.current;
    if (_ovEl && _ovId && overlayReadyRef.current && _ovEl.readyState >= 2) {
      const _ovEff = OVERLAY_EFFECTS.find(o => o.id === _ovId);
      ctx.save();
      ctx.globalAlpha = overlayOpacityRef.current;
      ctx.globalCompositeOperation = _ovEff?.blend || 'screen';
      ctx.drawImage(_ovEl, 0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    // Efeito de tela (overlay sobre tudo)
    if (screenEffect && screenEffect !== 'none') {
      drawScreenEffectRef.current?.(ctx, screenEffect, canvas.width, canvas.height, Date.now()/1000);
    }
    // Não agenda mais RAF aqui — o loop unificado abaixo cuida disso
  }, [activeImageId, activeVideoId, activeExtraTextId, activeLyricId, editingLyricId, drawRotatedElement, drawRoundedImage, drawRoundedRect, drawResizeHandles, applyElementMask, applyElementChromatic, getKfState, extraTextColor, extraTextFontFamily, extraTextFontSize, extraTexts, fontFamily, fontSize, getImagesForTime, getVideosForTime, image, lyrics, textColor, wrapLyricText, videos, shadowEnabled, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, gradientEnabled, gradientColor1, gradientColor2, zoom, screenEffect, colorCurves, chromaAberration, activeFrameId, frames]);


  // ── Sync de vídeos via função chamada pelo loop RAF ──────────────────────
  // Não usa useEffect reativo — evita closure stale de isPlaying
  const syncVideosInRAF = useCallback(() => {
    // Durante exports offline (frame-a-frame) o renderAtTimeToCanvas controla
    // os vídeos diretamente — interferir aqui corrompe os frames exportados
    if (offlineExportRef.current) return;
    // Durante RT export o export loop controla play/pause e playbackRate
    // — interferir aqui sobrescreve o playbackRate correto e acelera o vídeo
    if (rtExportRef.current) return;
    const audio = audioRef.current;
    // Durante RT export (WebM+Áudio) usa sempre virtualTimeRef — o audioRef
    // não é tocado, então audio.currentTime estaria congelado no último valor
    const t = (rtExportRef.current || !audio || audio.paused || !isPlayingRef.current)
      ? virtualTimeRef.current
      : audioOffsetRef.current + (audio.currentTime - (audioTrimStartRef.current || 0));
    const playing = isPlayingRef.current;
    const spd = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    videosRef.current.forEach(v => {
      if (!v.videoEl) return;
      const active = t >= v.start && t <= v.end;
      const vidSpdFactor = v.vidSpeed ?? 1;
      const vSpd = Math.max(0.25, Math.min(4, vidSpdFactor * spd));
      const trimSt = v.trimStart ?? 0;
      // currentTime = trimStart (offset) + tempo decorrido × vidSpeed
      const relTime = Math.max(0, Math.min(trimSt + (t - v.start) * vidSpdFactor, v.videoEl.duration || 0));
      // Duração efetiva em tempo de projeto: (rawDuration - trimStart) / vidSpeed
      const rawDur  = v.rawDuration ?? v.videoEl.duration ?? (v.end - v.start);
      const effEnd  = v.start + (rawDur - trimSt) / Math.max(0.25, vidSpdFactor);
      const activeNow = t >= v.start && t < effEnd;

      if (activeNow) {
        // Ajusta playbackRate se necessário
        if (Math.abs(v.videoEl.playbackRate - vSpd) > 0.01) v.videoEl.playbackRate = vSpd;
        if (!playing && !v.videoEl.paused && !rtExportRef.current) {
          // Usuário pausou e não estamos exportando: para o vídeo
          v.videoEl.pause();
        }
        // NUNCA chamar play() aqui — o play button é o único responsável por iniciar.
        // Chamar play() no RAF a cada 16ms aborta seeks em andamento (HD MP4) → áudio mudo.
        // O browser retoma automaticamente após buffer stall sem precisar de play() externo.
      } else {
        if (!v.videoEl.paused) v.videoEl.pause();
        // Para o áudio Web Audio se este vídeo ainda estiver tocando
        if (videoAudioNodes.current[v.id]) {
          const node = videoAudioNodes.current[v.id];
          try { node.source.stop(); } catch {}
          try { node.gainNode.disconnect(); } catch {}
          delete videoAudioNodes.current[v.id];
        }
        // Pré-posiciona apenas quando NÃO está em playback e não está seekando
        if (!playing && !v.videoEl.seeking && !rtExportRef.current) {
          const targetTime = t < v.start ? (v.trimStart ?? 0) : relTime;
          if (Math.abs(v.videoEl.currentTime - targetTime) > 0.1) {
            v.videoEl.currentTime = targetTime;
          }
        }
      }
    });
  }, []);

  // ── REFS para o loop RAF unificado ────────────────────────────────────────
  // Mantemos todas as dependências em refs para que o loop NUNCA precise ser
  // recriado. Recriação = cancel + restart = solavanco visível no playhead.
  // ── Atualiza dimensões do canvas via imperative para evitar flash branco ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fmt = CANVAS_FORMATS[canvasFormat];
    if (!fmt) return;
    const prevW = canvas.width, prevH = canvas.height;
    if (prevW === fmt.width && prevH === fmt.height) return; // sem mudança
    // Salva pixels atuais antes de redimensionar
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width  = prevW;
    tempCanvas.height = prevH;
    if (prevW > 0 && prevH > 0) {
      tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
    }
    canvas.width  = fmt.width;
    canvas.height = fmt.height;
    // Preenche fundo escuro imediatamente para não mostrar branco
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, fmt.width, fmt.height);
    // Restaura pixels redimensionados
    if (prevW > 0 && prevH > 0) {
      ctx.drawImage(tempCanvas, 0, 0, fmt.width, fmt.height);
    }
  }, [canvasFormat]); // eslint-disable-line

  // Grava snapshot inicial (estado vazio) via pendingHistory flag
  useEffect(() => {
    const t = setTimeout(() => {
      if (historyRef.current.length === 0 && !isUndoingRef.current) {
        pendingHistoryRef.current = true;
        setHistoryTrigger(1); // força re-render para o useEffect de captura rodar
      }
    }, 300);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line

  // Refs estáveis para undo/redo (acessíveis no keydown listener sem re-criar)
  const undoRef = useRef(null);
  const redoRef = useRef(null);
  useEffect(() => { undoRef.current = undo; }, [undo]);
  useEffect(() => { redoRef.current = redo; }, [redo]);

  const drawRef = useRef(null);
  useEffect(() => { drawRef.current = draw; }, [draw]);

  const syncVideosInRAFRef = useRef(null);
  useEffect(() => { syncVideosInRAFRef.current = syncVideosInRAF; }, [syncVideosInRAF]);

  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  const videosRef = useRef(videos);
  useEffect(() => { videosRef.current = videos; }, [videos]);
  const lyricsRef = useRef(lyrics);
  useEffect(() => { lyricsRef.current = lyrics; }, [lyrics]);
  const imagesRef = useRef(images);
  useEffect(() => { imagesRef.current = images; }, [images]);
  const extraTextsRef = useRef(extraTexts);
  useEffect(() => { extraTextsRef.current = extraTexts; }, [extraTexts]);
  const imageSrcRef = useRef(imageSrc);
  useEffect(() => { imageSrcRef.current = imageSrc; }, [imageSrc]);
  const colorCurvesRef = useRef(colorCurves);
  useEffect(() => { colorCurvesRef.current = colorCurves; }, [colorCurves]);

  // ── Captura de snapshot APÓS React comitar o estado ─────────────────────
  // Este useEffect roda depois de cada render onde os estados relevantes mudaram.
  // Quando pendingHistoryRef=true, grava o estado atual (já commitado) na pilha.
  // Isso garante que cada snapshot reflete exatamente um estado coerente,
  // sem o problema de refs desatualizadas que ocorria ao capturar antes do render.
  useEffect(() => {
    if (!pendingHistoryRef.current || isUndoingRef.current) return;
    pendingHistoryRef.current = false;
    const snap = {
      imageSrc,
      images:       images.map(({ img, ...rest }) => rest),
      extraTexts:   [...extraTexts],
      lyrics:       [...lyrics],
      stickers:     [...stickers],
      frames:       frames.map(f => ({...f})),
      screenEffect,
      videos:       videos.map(({ videoEl, audioBuffer, ...rest }) => rest),
      soundEffects: [...soundEffects],
      colorCurves:  { ...colorCurves },
    };
    const history = historyRef.current;
    const idx     = historyIdxRef.current;
    // Descarta snapshots idênticos ao último (evita duplicatas por double-render)
    if (idx >= 0) {
      const last = history[idx];
      const sameVideos = JSON.stringify(snap.videos) === JSON.stringify(last.videos);
      const sameImages = JSON.stringify(snap.images) === JSON.stringify(last.images);
      const sameLyrics = JSON.stringify(snap.lyrics) === JSON.stringify(last.lyrics);
      const sameExtras = JSON.stringify(snap.extraTexts) === JSON.stringify(last.extraTexts);
      const sameStickers = JSON.stringify(snap.stickers) === JSON.stringify(last.stickers);
      const sameSfx = JSON.stringify(snap.soundEffects) === JSON.stringify(last.soundEffects);
      const sameEffect = snap.screenEffect === last.screenEffect;
      const sameBg = snap.imageSrc === last.imageSrc;
      if (sameVideos && sameImages && sameLyrics && sameExtras && sameStickers && sameSfx && sameEffect && sameBg) return;
    }
    const newHist = history.slice(0, idx + 1);
    newHist.push(snap);
    if (newHist.length > MAX_HISTORY) newHist.shift();
    historyRef.current    = newHist;
    historyIdxRef.current = newHist.length - 1;
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, extraTexts, lyrics, stickers, screenEffect, videos, soundEffects, colorCurves, imageSrc, historyTrigger]);

  // ── Waveform estático em canvas (sem re-renders do React) ─────────────────
  useEffect(() => {
    const wc = waveformCanvasRef.current;
    if (!wc) return;
    const ctx2 = wc.getContext('2d');
    ctx2.clearRect(0, 0, wc.width, wc.height);
    if (!waveformPeaks.length) return;
    const barW = 2, gap = 1, total = Math.ceil(wc.width / (barW + gap));
    ctx2.fillStyle = '#00BFFF';
    for (let i = 0; i < total; i++) {
      const idx = Math.min(waveformPeaks.length - 1, Math.floor((i / total) * waveformPeaks.length));
      const amp = waveformPeaks[idx] || 0.15;
      const h = Math.max(3, amp * 22);
      ctx2.fillRect(i * (barW + gap), (wc.height - h) / 2, barW, h);
    }
  }, [waveformPeaks, audioPxWidth]);

  // ── LOOP RAF ÚNICO E ESTÁVEL ──────────────────────────────────────────────
  // Iniciado uma única vez na montagem, nunca cancelado durante a sessão.
  // Sem setState dentro do loop → zero re-renders causados pela animação.
  useEffect(() => {
    let rafId;
    const loop = () => {
      // 1) Mover o playhead
      const audio = audioRef.current;
      const t_now = (audio && !audio.paused && isPlayingRef.current)
        ? audioOffsetRef.current + (audio.currentTime - (audioTrimStartRef.current || 0))
        : virtualTimeRef.current;
      if (playheadRef.current) {
        playheadRef.current.style.transform = `translateX(${t_now * zoomRef.current}px)`;
      }
      // 1b) Disparar SFX na hora certa
      if (isPlayingRef.current) {
        const sfxList = soundEffectsRef.current;
        const prevT   = sfxLastTimeRef.current;
        for (const sfx of sfxList) {
          const st = sfx.startTime || 0;
          if (t_now >= st && prevT < st && !sfxPlayedRef.current.has(sfx.id)) {
            sfxPlayedRef.current.add(sfx.id);
            synthesizeSfxBuffer(sfx.key).then(buf => {
              if (!buf) return;
              try {
                if (!sfxLiveAcRef.current || sfxLiveAcRef.current.state === 'closed') {
                  sfxLiveAcRef.current = new (window.AudioContext || window.webkitAudioContext)();
                }
                const liveAc = sfxLiveAcRef.current;
                const liveBuf = liveAc.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
                for (let ch = 0; ch < buf.numberOfChannels; ch++)
                  liveBuf.copyToChannel(buf.getChannelData(ch), ch);
                const src = liveAc.createBufferSource();
                const gain = liveAc.createGain();
                gain.gain.value = sfx.volume ?? 1;
                src.buffer = liveBuf;
                src.connect(gain); gain.connect(liveAc.destination);
                src.start();
              } catch(e) { console.error('[SFX preview]', e); }
            });
          }
        }
        sfxLastTimeRef.current = t_now;
      } else {
        sfxPlayedRef.current.clear();
        sfxLastTimeRef.current = 0;
      }
      // 2) Sincronizar vídeos
      if (syncVideosInRAFRef.current) syncVideosInRAFRef.current();
      // 3) Desenhar o canvas
      if (drawRef.current) drawRef.current();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []); // [] → monta uma vez, nunca reinicia

  // Relógio de tempo via evento nativo (não interfere no RAF)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      const t = audio.currentTime;
      // Para o áudio quando passa do ponto de corte (audioTrimEnd)
      const trimEnd = audioTrimEndRef.current;
      if (trimEnd !== null && t >= trimEnd && isPlayingRef.current) {
        audio.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
        stopAllVideoAudio();
        return;
      }
      const projT = (audioOffsetRef.current || 0) + t - (audioTrimStartRef.current || 0);
      // Só atualiza virtualTimeRef durante playback real — scrub/pause podem
      // disparar timeupdate, o que corromperia a posição do playhead
      if (isPlayingRef.current) virtualTimeRef.current = projT;
      setCurrentTime(projT);
      // Ativa vídeos que entram no range durante playback com áudio
      if (!isPlayingRef.current) return;
      // IMPORTANTE: todas as comparações usam projT (tempo de projeto),
      // não `t` (audio.currentTime bruto). Com audioOffset≠0, `t` começa
      // em 0 mas o projeto já está em audioOffset — usar `t` causava seeks
      // para o início do vídeo a cada timeupdate → flickering.
      videosRef.current.forEach(v => {
        if (!v.videoEl || v.muted) return;
        const ts = v.trimStart ?? 0;
        const vs = v.vidSpeed ?? 1;
        const rd = v.rawDuration ?? v.videoEl.duration ?? (v.end - v.start);
        const ee = v.start + (rd - ts) / Math.max(0.25, vs);
        const pastEnd = projT >= ee;
        if (pastEnd && videoAudioNodes.current[v.id]) {
          const node = videoAudioNodes.current[v.id];
          try { node.source.stop(); } catch {}
          try { node.gainNode.disconnect(); } catch {}
          delete videoAudioNodes.current[v.id];
          if (!v.videoEl.paused) v.videoEl.pause();
        } else if (!pastEnd && projT >= v.start && v.videoEl.paused) {
          const rel = Math.max(0, Math.min(ts + (projT - v.start) * vs, (v.videoEl.duration || 0) - 0.033));
          v.videoEl.muted = true;
          v.videoEl.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current * vs));
          if (Math.abs(v.videoEl.currentTime - rel) > 0.1) v.videoEl.currentTime = rel;
          v.videoEl.play().catch(() => {});
          if (!videoAudioNodes.current[v.id]) startVideoAudio(v, projT);
        }
      });
    };
    audio.addEventListener('timeupdate', onTime);
    return () => audio.removeEventListener('timeupdate', onTime);
  }, [audioSrc]);

  // Aplica volume/speed no elemento <audio> ao mudar (ref já atualizado pelo wrapper)
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, projectVolume));
  }, [projectVolume]);

  useEffect(() => {
    const spd = Math.max(0.25, Math.min(4, projectSpeed));
    if (audioRef.current) audioRef.current.playbackRate = spd;
    // Atualiza velocidade em todos os vídeos overlay em tempo real
    videosRef.current.forEach(v => {
      // Velocidade por vídeo: usa vidSpeed do vídeo, multiplicado pelo speed global
      if (v.videoEl) v.videoEl.playbackRate = Math.max(0.25, Math.min(4, (v.vidSpeed ?? 1) * spd));
    });
  }, [projectSpeed]);

  const renderAtTimeToCanvas = async (targetCanvas, t, scale = 1) => {
    const ctx = targetCanvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    ctx.scale(scale, scale);
    const logicalW = targetCanvas.width / scale;
    const logicalH = targetCanvas.height / scale;
    if (image) {
      ctx.drawImage(image, 0, 0, logicalW, logicalH);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, logicalW, logicalH);
    }

    // ── Vídeos: seek preciso + verificação de readyState ─────────────────────
    const activeVids = (videosRef.current || []).filter(v => {
      if (!v.videoEl) return false;
      const ts = v.trimStart ?? 0;
      const vs = v.vidSpeed ?? 1;
      const rd = v.rawDuration ?? v.videoEl.duration ?? (v.end - v.start);
      const effEnd = v.start + (rd - ts) / Math.max(0.25, vs);
      return t >= v.start && t < Math.min(v.end, effEnd);
    });

    if (activeVids.length > 0) {
      await Promise.all(activeVids.map(v => new Promise(resolve => {
        if (!v.videoEl) return resolve();
        const vidDur  = isFinite(v.videoEl.duration) && v.videoEl.duration > 0
          ? v.videoEl.duration : (v.end - v.start);
        const trimSt  = v.trimStart ?? 0;
        const vidSpd  = v.vidSpeed ?? 1;
        const trimEnd = Math.min(trimSt + (v.end - v.start) * vidSpd, Math.max(0, vidDur - 0.2));
        const relTime = Math.max(0, Math.min(trimSt + (t - v.start) * vidSpd, trimEnd));
        v.videoEl.pause();

        // Se já na posição certa com dados disponíveis: resolve imediatamente
        if (Math.abs(v.videoEl.currentTime - relTime) < 0.04 && v.videoEl.readyState >= 2) {
          return resolve();
        }

        let settled = false;
        const done = () => { if (settled) return; settled = true; resolve(); };

        // Timeout de segurança: 1000ms (raros casos de H.264 remoto/lento)
        const hard = setTimeout(done, 1000);

        // seeked + readyState >= 2 é SUFICIENTE para drawImage sem frame preto.
        // NÃO usar canplay/canplaythrough — não disparam em vídeos PAUSADOS.
        // Cada frame que esperava canplay ficava 800ms travado = horas de export.
        v.videoEl.addEventListener('seeked', () => {
          clearTimeout(hard);
          done(); // readyState >= 2 garantido após seeked em blob/MediaSource local
        }, { once: true });

        v.videoEl.currentTime = relTime;
      })));
    }

    // readyState >= 2 = frame atual disponível para drawImage
    activeVids.forEach(v => {
      if (!v.videoEl || v.videoEl.readyState < 2 || v.videoEl.videoWidth === 0) return;
      const kfEV = getKfState(v, t);
      const evx = kfEV ? kfEV.x : v.x, evy = kfEV ? kfEV.y : v.y;
      const evw = kfEV ? kfEV.w : v.width, evh = kfEV ? kfEV.h : v.height;
      const evProxy = { ...v, x: evx, y: evy, width: evw, height: evh };
      const _evf = buildFilterString(v.filters);
      const _etr = getTransitionTransform(evProxy, t);
      ctx.save();
      if (kfEV) ctx.globalAlpha = Math.max(0, Math.min(1, kfEV.opacity));
      if (_etr) { _applyTr(ctx, _etr, _evf, evProxy); } else if(_evf!=='none'){ctx.filter=_evf;}
      applyElementMask(ctx, evProxy);
      const drawVidE = (tCtx) => drawRotatedElement(tCtx || ctx, () => drawRoundedImage(tCtx || ctx, v.videoEl, evx, evy, evw, evh, v.radius ?? 12), evx, evy, evw, evh, kfEV ? kfEV.rotation : v.rotation);
      applyElementChromatic(ctx, evProxy, drawVidE);
      ctx.filter='none'; ctx.globalAlpha=1; ctx.restore();
    });
    // Renderiza TODAS as imagens ativas no instante t (usa ref para evitar closure stale)
    const activeImgs = (imagesRef.current || []).filter(item => item?.img && t >= item.start && t <= item.end);
    activeImgs.forEach(overlayImage => {
      const kfEI = getKfState(overlayImage, t);
      const eix = kfEI ? kfEI.x : overlayImage.x, eiy = kfEI ? kfEI.y : overlayImage.y;
      const eiw = kfEI ? kfEI.w : overlayImage.width, eih = kfEI ? kfEI.h : overlayImage.height;
      const eiProxy = { ...overlayImage, x: eix, y: eiy, width: eiw, height: eih };
      const _eif = buildFilterString(overlayImage.filters);
      const _eit = getTransitionTransform(eiProxy, t);
      ctx.save();
      if (kfEI) ctx.globalAlpha = Math.max(0, Math.min(1, kfEI.opacity));
      if (_eit) { _applyTr(ctx, _eit, _eif, eiProxy); } else if(_eif!=='none'){ctx.filter=_eif;}
      drawRotatedElement(ctx, () => drawRoundedImage(ctx, overlayImage.img, eix, eiy, eiw, eih, overlayImage.radius ?? 18), eix, eiy, eiw, eih, kfEI ? kfEI.rotation : overlayImage.rotation);
      ctx.filter='none'; ctx.globalAlpha=1; ctx.restore();
    });
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    (extraTextsRef.current || extraTexts).forEach((txt) => {
      const tColor = txt.color || extraTextColor;
      const tFont  = txt.fontFamily || extraTextFontFamily;
      const tSize  = txt.fontSize || extraTextFontSize;
      const lines = txt.text.split('\n');
      const lineH = tSize * 1.25;
      const rot = (txt.rotation || 0) * Math.PI / 180;
      ctx.save();
      ctx.translate(txt.x, txt.y);
      ctx.rotate(rot);
      ctx.font = `bold ${tSize}px ${tFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (txt.shadowEnabled ?? true) {
        ctx.shadowBlur    = txt.shadowBlur ?? 10;
        ctx.shadowColor   = txt.shadowColor || 'rgba(0,0,0,0.8)';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
      }
      const totalH = lines.length * lineH;
      lines.forEach((line, li) => {
        const lineY = -totalH / 2 + li * lineH + lineH / 2;
        if (txt.gradientEnabled) {
          const w = ctx.measureText(line).width;
          const grad = ctx.createLinearGradient(-w/2, lineY - tSize/2, w/2, lineY + tSize/2);
          grad.addColorStop(0, txt.gradientColor1 || '#ffffff');
          grad.addColorStop(1, txt.gradientColor2 || '#00BFFF');
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = tColor;
        }
        ctx.fillText(line, 0, lineY);
      });
      ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      ctx.restore();
    });
    const activeLine = (lyricsRef.current || lyrics).find(l => t >= l.start && t <= l.end);
    if (activeLine) {
      const lx = activeLine.x ?? logicalW / 2;
      const ly = activeLine.y ?? logicalH * 0.75;
      const lRot = (activeLine.rotation || 0) * Math.PI / 180;
      const lFontSize = activeLine.fontSize || fontSize;
      const lFontFamily = activeLine.fontFamily || fontFamily;
      ctx.font = `bold ${lFontSize}px ${lFontFamily}`;
      const lines = wrapLyricText(activeLine.text, ctx, logicalW - 40);
      const lineH = lFontSize * 1.3;
      const totalH = lines.length * lineH;
      // ── Animação de entrada (export — usa `t`) ──────────────────────────
      const _anim  = activeLine.animType || 'none';
      const _twSpd = activeLine.twSpeed  || 30;
      const _elaps = Math.max(0, t - activeLine.start);
      const _ease  = 1 - Math.pow(1 - Math.min(1, _elaps / 0.45), 2);
      const _twCh  = _anim === 'typewriter' ? Math.floor(_elaps * _twSpd) : Infinity;
      const _bgFxR = activeLine.bgEffect ?? textBgEffect;
      if (_bgFxR && _bgFxR !== 'none') {
        ctx.save();
        if (_anim === 'fade')  ctx.globalAlpha = _ease;
        if (_anim === 'slide') ctx.translate(0, (1 - _ease) * 48);
        ctx.translate(lx, ly); ctx.rotate(lRot);
        ctx.font = `bold ${lFontSize}px ${lFontFamily}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        drawTextBgEffectRef.current?.(ctx, _bgFxR, lines, lFontSize, lineH, totalH);
        ctx.restore();
      }
      ctx.save();
      if (_anim === 'fade')  ctx.globalAlpha = _ease;
      if (_anim === 'slide') ctx.translate(0, (1 - _ease) * 48);
      ctx.translate(lx, ly);
      ctx.rotate(lRot);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Lê da marcação; fallback para global
      const _shOn  = activeLine.shadowEnabled   !== undefined ? activeLine.shadowEnabled   : shadowEnabled;
      const _shBlur= activeLine.shadowBlur      !== undefined ? activeLine.shadowBlur      : shadowBlur;
      const _shCol = activeLine.shadowColor     || shadowColor;
      const _shOX  = activeLine.shadowOffsetX   !== undefined ? activeLine.shadowOffsetX   : shadowOffsetX;
      const _shOY  = activeLine.shadowOffsetY   !== undefined ? activeLine.shadowOffsetY   : shadowOffsetY;
      const _grOn  = activeLine.gradientEnabled !== undefined ? activeLine.gradientEnabled : gradientEnabled;
      const _gr1   = activeLine.gradientColor1  || gradientColor1;
      const _gr2   = activeLine.gradientColor2  || gradientColor2;
      const _col   = activeLine.color           || textColor;
      if (_shOn) {
        ctx.shadowBlur    = _shBlur;
        ctx.shadowColor   = _shCol;
        ctx.shadowOffsetX = _shOX;
        ctx.shadowOffsetY = _shOY;
      }
      let _twN = 0;
      lines.forEach((line, li) => {
        const lineY = -totalH / 2 + li * lineH + lineH / 2;
        const upperLine = line.toUpperCase();
        let vis = upperLine;
        if (_anim === 'typewriter') {
          const rem = _twCh - _twN; _twN += upperLine.length;
          if (rem <= 0) return;
          vis = upperLine.slice(0, rem);
        }
        if (_grOn) {
          const w = ctx.measureText(vis).width;
          const grad = ctx.createLinearGradient(-w / 2, lineY - lFontSize / 2, w / 2, lineY + lFontSize / 2);
          grad.addColorStop(0, _gr1);
          grad.addColorStop(1, _gr2);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = _col;
        }
        ctx.fillText(vis, 0, lineY);
      });
      ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // ── Stickers / Emojis / GIFs (export) ───────────────────────────────────
    stickersRef.current.filter(stk => {
      if (stk.start !== undefined && stk.end !== undefined) return t >= stk.start && t <= stk.end;
      return true;
    }).forEach(stk => {
      const sz = stk.size || 80;
      const { dy, s, r, a } = getStickerAnimTransform(stk.animStyle, t, sz);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(stk.x, stk.y + dy);
      ctx.rotate((stk.rotation || 0) * Math.PI / 180 + r);
      ctx.scale(s, s);
      ctx.font = `${sz}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(stk.content, 0, 0);
      ctx.restore();
    });
    // ── Curvas de Cor no export ──────────────────────────────────────────────
    // Molduras no export
    framesRef.current.forEach(fr => {
      const fw=fr.width||200,fh=fr.height||200,fx=fr.x||0,fy=fr.y||0;
      const frot=(fr.rotation||0)*Math.PI/180,th=fr.thickness||6,col=fr.color||'#ffffff',op=fr.opacity??1,cr=fr.cornerRadius||0;
      ctx.save(); ctx.globalAlpha=op; ctx.strokeStyle=col; ctx.lineWidth=th;
      if(frot){const fcx=fx+fw/2,fcy=fy+fh/2;ctx.translate(fcx,fcy);ctx.rotate(frot);ctx.translate(-fcx,-fcy);}
      switch(fr.style){
        case 'solid':if(cr>0){ctx.beginPath();ctx.moveTo(fx+cr,fy);ctx.lineTo(fx+fw-cr,fy);ctx.arcTo(fx+fw,fy,fx+fw,fy+cr,cr);ctx.lineTo(fx+fw,fy+fh-cr);ctx.arcTo(fx+fw,fy+fh,fx+fw-cr,fy+fh,cr);ctx.lineTo(fx+cr,fy+fh);ctx.arcTo(fx,fy+fh,fx,fy+fh-cr,cr);ctx.lineTo(fx,fy+cr);ctx.arcTo(fx,fy,fx+cr,fy,cr);ctx.closePath();ctx.stroke();}else ctx.strokeRect(fx,fy,fw,fh);break;
        case 'double':ctx.lineWidth=th*0.6;ctx.strokeRect(fx,fy,fw,fh);ctx.strokeRect(fx+th*1.5,fy+th*1.5,fw-th*3,fh-th*3);break;
        case 'dashed':ctx.setLineDash([th*3,th*2]);ctx.strokeRect(fx,fy,fw,fh);ctx.setLineDash([]);break;
        case 'dotted':ctx.setLineDash([th,th*2]);ctx.lineCap='round';ctx.strokeRect(fx,fy,fw,fh);ctx.setLineDash([]);ctx.lineCap='butt';break;
        case 'neon':ctx.shadowBlur=th*4;ctx.shadowColor=col;ctx.strokeRect(fx,fy,fw,fh);ctx.shadowBlur=0;break;
        case 'gradient':{const gg=ctx.createLinearGradient(fx,fy,fx+fw,fy+fh);gg.addColorStop(0,col);gg.addColorStop(0.5,fr.color2||'#00bfff');gg.addColorStop(1,col);ctx.strokeStyle=gg;ctx.strokeRect(fx,fy,fw,fh);break;}
        case 'corners':{const cl=Math.min(fw,fh)*0.22;ctx.lineCap='square';[[fx,fy+cl,fx,fy,fx+cl,fy],[fx+fw-cl,fy,fx+fw,fy,fx+fw,fy+cl],[fx,fy+fh-cl,fx,fy+fh,fx+cl,fy+fh],[fx+fw-cl,fy+fh,fx+fw,fy+fh,fx+fw,fy+fh-cl]].forEach(([x1,y1,x2,y2,x3,y3])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.lineTo(x3,y3);ctx.stroke();});ctx.lineCap='butt';break;}
        case 'film':{ctx.fillStyle=col;const hp=fh*0.06,pw=fw*0.035,gap=pw*1.6,count=Math.floor(fw*0.8/(pw+gap)),total=count*(pw+gap)-gap,startX=fx+(fw-total)/2;for(let i=0;i<count;i++){const px=startX+i*(pw+gap);ctx.fillRect(px,fy+hp*0.3,pw,hp);ctx.fillRect(px,fy+fh-hp*1.3,pw,hp);}ctx.lineWidth=th;ctx.strokeStyle=col;ctx.strokeRect(fx,fy+hp*1.8,fw,fh-hp*3.6);break;}
        case 'polaroid':{ctx.fillStyle=col;const bw=th*1.5;ctx.fillRect(fx,fy,fw,bw);ctx.fillRect(fx,fy+fh-bw*3,fw,bw*3);ctx.fillRect(fx,fy+bw,bw,fh-bw*4);ctx.fillRect(fx+fw-bw,fy+bw,bw,fh-bw*4);break;}
        default:ctx.strokeRect(fx,fy,fw,fh);
      }
      ctx.restore();
    });

    const ccE = colorCurves;
    const hasCCE = ccE && (Math.abs(ccE.r-1)>0.01||Math.abs(ccE.g-1)>0.01||Math.abs(ccE.b-1)>0.01||
                           Math.abs(ccE.midtone-1)>0.01||Math.abs(ccE.shadows)>0.01||Math.abs(ccE.highlights)>0.01);
    if (hasCCE) {
      try {
        const fRe  = ccE.r  ?? 1;
        const fGe  = ccE.g  ?? 1;
        const fBe  = ccE.b  ?? 1;
        const mide = ccE.midtone   ?? 1;
        const shde = ccE.shadows   ?? 0;
        const hlte = ccE.highlights ?? 0;
        const maxE = Math.max(fRe, fGe, fBe);
        const minE = Math.min(fRe, fGe, fBe);
        const satE  = Math.round(Math.max(0, Math.min(5, minE > 0 ? maxE / minE : 1)) * 100);
        const briE  = Math.round(Math.max(0, Math.min(3, mide)) * 100);
        const conE  = Math.round(100 + (hlte - shde) * 60);
        const tmpE  = document.createElement('canvas');
        tmpE.width  = targetCanvas.width; tmpE.height = targetCanvas.height;
        const tctxE = tmpE.getContext('2d');
        tctxE.filter = `brightness(${briE}%) saturate(${satE}%) contrast(${conE}%)`;
        tctxE.drawImage(targetCanvas, 0, 0);
        ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
        ctx.drawImage(tmpE, 0, 0);
      } catch(e) {}
    }
    // Efeito de tela no export (shake ignorado — drawImage em canvas offscreen causa artefatos)
    if (screenEffect && screenEffect !== 'none' && screenEffect !== 'shake') {
      drawScreenEffectRef.current?.(ctx, screenEffect, logicalW, logicalH, t);
    }
  };

  // ── _renderAudioStretched: time-stretch preservando tom + volume ─────────────
  // Estratégia:
  //   speed == 1 → OfflineAudioContext puro (sem DSP, qualidade perfeita)
  //   speed != 1 → WOLA 75 % overlap (frameSize=4096, hop=1024)
  //                Janela Hann ao quadrado satisfaz condição WOLA → gain constante
  //                Sem SOLA/correlação (que adicionava instabilidade)
  //                Sem AudioBufferSourceNode.playbackRate (não suporta preservesPitch)
  // Retorna [Float32ArrayL, Float32ArrayR] prontos para o AudioEncoder.
  const _renderAudioStretched = async (audioBuffer, speed, volume, sampleRate) => {
    const nCh    = Math.min(audioBuffer.numberOfChannels, 2);
    const chL    = audioBuffer.getChannelData(0);
    const chR    = nCh > 1 ? audioBuffer.getChannelData(1) : chL;
    const srcLen = chL.length;

    // ── Caminho limpo para speed == 1: OfflineAudioContext com gain ──────────
    if (Math.abs(speed - 1.0) < 0.005) {
      const outFrames = Math.ceil(audioBuffer.duration * sampleRate);
      const offCtx    = new OfflineAudioContext(nCh, outFrames, sampleRate);
      const src       = offCtx.createBufferSource();
      src.buffer      = audioBuffer;
      const gain      = offCtx.createGain();
      gain.gain.value = Math.max(0, Math.min(1, volume));
      src.connect(gain);
      gain.connect(offCtx.destination);
      src.start(0);
      const rendered  = await offCtx.startRendering();
      return [
        new Float32Array(rendered.getChannelData(0)),
        new Float32Array(rendered.numberOfChannels > 1 ? rendered.getChannelData(1) : rendered.getChannelData(0)),
      ];
    }

    // ── WOLA 75 % overlap para speed != 1 ────────────────────────────────────
    // hopOut fixo; hopSrc avança mais rápido (speed>1) ou mais devagar (speed<1)
    // Com janela Hann e 75 % overlap: Σ w²[n-kH] = 3/8 * N = constante → sem modulação
    const frameSize = 4096;
    const hopOut    = frameSize >> 2;              // 1024 — 75 % overlap
    const hopSrc    = Math.round(hopOut * speed);
    const outLen    = Math.ceil(srcLen / speed);

    const hann = new Float32Array(frameSize);
    for (let i = 0; i < frameSize; i++)
      hann[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / frameSize));

    // Pré-calcula a constante de normalização WOLA (Σ w²  com hop=N/4)
    // É exatamente 3/8 * frameSize para Hann + 75 % overlap, mas calculamos
    // diretamente para ser robusto a qualquer frameSize.
    let wolaGain = 0;
    for (let i = 0; i < frameSize; i++) wolaGain += hann[i] * hann[i];
    wolaGain /= hopOut; // ganho por amostra de saída

    const outL = new Float32Array(outLen);
    const outR = new Float32Array(outLen);
    const norm = new Float32Array(outLen);

    let srcPos = 0, outPos = 0;
    while (outPos < outLen + hopOut) {
      for (let i = 0; i < frameSize; i++) {
        const oi = outPos + i;
        if (oi >= outLen) break;
        const si = srcPos + i;
        const w  = hann[i];
        outL[oi] += (si < srcLen ? chL[si] : 0) * w;
        outR[oi] += (si < srcLen ? chR[si] : 0) * w;
        norm[oi] += w * w;
      }
      srcPos += hopSrc;
      outPos += hopOut;
    }

    // Normaliza pelo acumulador WOLA + aplica volume + clipping
    for (let i = 0; i < outLen; i++) {
      const n = norm[i] > 1e-6 ? norm[i] : wolaGain;
      outL[i] = Math.max(-1, Math.min(1, (outL[i] / n) * volume));
      outR[i] = Math.max(-1, Math.min(1, (outR[i] / n) * volume));
    }
    return [outL, outR];
  };

  // Sintetiza e mixa todos os SFX colocados no timeline nos buffers de saída
  const _mixSfxIntoBuffers = async (outL, outR, sfxArr, sampleRate) => {
    if (!sfxArr || sfxArr.length === 0) return;
    for (const sfx of sfxArr) {
      try {
        const buf = await synthesizeSfxBuffer(sfx.key);
        if (!buf) continue;
        const offset = Math.round((sfx.startTime || 0) * sampleRate);
        const vol    = sfx.volume ?? 1;
        const chL    = buf.getChannelData(0);
        const chR    = buf.numberOfChannels > 1 ? buf.getChannelData(1) : chL;
        for (let i = 0; i < buf.length; i++) {
          const oi = offset + i;
          if (oi >= outL.length) break;
          outL[oi] = Math.max(-1, Math.min(1, outL[oi] + chL[i] * vol));
          outR[oi] = Math.max(-1, Math.min(1, outR[oi] + chR[i] * vol));
        }
      } catch(e) { console.error('[SFX mix]', sfx.key, e); }
    }
  };

  // ── _mixVideoAudioIntoBuffers: mistura áudio dos vídeos do canvas ───────────
  const _mixVideoAudioIntoBuffers = async (outL, outR, videosArr, speed, volume, sampleRate) => {
    if (!videosArr || videosArr.length === 0) return;
    for (const v of videosArr) {
      if (v.muted) continue;
      try {
        // Usa audioBuffer já decodificado (evita fetch + decode = rápido e sem problemas com MediaSource URLs)
        let decoded = v.audioBuffer || null;
        if (!decoded) {
          // Fallback: tenta fetch se não tiver audioBuffer (projetos antigos)
          try {
            const resp = await fetch(v.src);
            const ab = await resp.arrayBuffer();
            const ac = new (window.AudioContext || window.webkitAudioContext)({ sampleRate });
            decoded = await ac.decodeAudioData(ab);
            ac.close();
          } catch { continue; }
        }
        if (!decoded) continue;

        const trimSt   = v.trimStart ?? 0;
        const vidSpd   = v.vidSpeed ?? 1;
        const effSpeed = Math.max(0.25, Math.min(4, speed * vidSpd));
        const vol      = Math.max(0, Math.min(1, volume * (v.vidVolume ?? 1)));

        // Região trimada: trimStart → fim do vídeo editado (v.end)
        const trimEndInBuf = Math.min(trimSt + (v.end - v.start) * vidSpd, decoded.duration);
        const trimmedDuration = Math.max(0, trimEndInBuf - trimSt);
        if (trimmedDuration < 0.05) continue;

        // Cria AudioBuffer com a região trimada sem OfflineAudioContext (mais rápido)
        const startSample = Math.round(trimSt * decoded.sampleRate);
        const endSample   = Math.round(trimEndInBuf * decoded.sampleRate);
        const nCh = decoded.numberOfChannels;
        const tmpBuf = new (window.AudioContext || window.webkitAudioContext)().createBuffer ?
          (() => {
            const _ac = new (window.AudioContext || window.webkitAudioContext)();
            const b = _ac.createBuffer(nCh, endSample - startSample, decoded.sampleRate);
            for (let ch = 0; ch < nCh; ch++) b.getChannelData(ch).set(decoded.getChannelData(ch).subarray(startSample, endSample));
            _ac.close();
            return b;
          })() : null;
        if (!tmpBuf) continue;

        const [strL, strR] = await _renderAudioStretched(tmpBuf, effSpeed, vol, sampleRate);

        const outOffset = Math.round((v.start / speed) * sampleRate);
        const copyLen   = Math.min(strL.length, outL.length - outOffset);
        if (copyLen <= 0) continue;

        for (let i = 0; i < copyLen; i++) {
          const oi = outOffset + i;
          outL[oi] = Math.max(-1, Math.min(1, outL[oi] + strL[i]));
          outR[oi] = Math.max(-1, Math.min(1, outR[oi] + strR[i]));
        }
      } catch (e) { console.warn('[VideoAudio mix]', v.id, e); }
    }
  };

  // ════════════════════════════════════════════════════════════════
  // saveWithPicker — diálogo nativo para nome e pasta do arquivo
  // Usa File System Access API (Chrome/Edge); fallback automático.
  // ════════════════════════════════════════════════════════════════
  // Mostra toast de sucesso após salvar
  const showSaveToast = (name) => {
    const toast = document.createElement('div');
    toast.textContent = `✅ Salvo: ${name}`;
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;background:#10b981;color:#fff;padding:12px 20px;border-radius:14px;font-size:14px;font-weight:700;box-shadow:0 4px 20px rgba(0,0,0,0.4);pointer-events:none;transition:opacity 0.4s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
  };

  const saveWithPicker = async (blobOrDataUrl, suggestedName, mimeType, extensions) => {
    // Normaliza para Blob
    let blob;
    if (typeof blobOrDataUrl === 'string' && blobOrDataUrl.startsWith('data:')) {
      const res = await fetch(blobOrDataUrl);
      blob = await res.blob();
    } else {
      blob = blobOrDataUrl instanceof Blob ? blobOrDataUrl : new Blob([blobOrDataUrl], { type: mimeType });
    }

    // Usa handle pré-adquirido (picker já foi aberto no click do usuário — File System Access API)
    if (fileHandleRef.current) {
      try {
        const writable = await fileHandleRef.current.createWritable();
        await writable.write(blob);
        await writable.close();
        const savedName = fileHandleRef.current.name || suggestedName;
        fileHandleRef.current = null;
        showSaveToast(savedName);
        // Também dispara download clássico para aparecer na barra de downloads
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = savedName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 8000);
        return;
      } catch { fileHandleRef.current = null; /* cai no fallback */ }
    }

    // Fallback: download clássico via <a>
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 8000);
    showSaveToast(suggestedName);
  };

  const handleSaveWebmOffline = async () => {
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;
    const effectiveDuration = (() => {
      // Calcula o fim real do áudio na timeline: offset + duração após trim
      const _audEnd = duration > 0
        ? (audioOffset || 0) + (
            audioTrimEnd !== null
              ? (audioTrimEnd - (audioTrimStart || 0))
              : (duration - (audioTrimStart || 0))
          )
        : 0;
      const _lyricEnd = lyrics && lyrics.length ? Math.max(...lyrics.map(l => l.end || 0)) : 0;
      const _imgEnd   = images && images.length ? Math.max(...images.map(i => i.end || 0)) : 0;
      const _vidEnd   = videos && videos.length ? Math.max(...videos.map(v => v.end || 0)) : 0;
      return Math.max(_audEnd, _lyricEnd, _imgEnd, _vidEnd) || 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;
    const _spdW = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    const outputDurationW = effectiveDuration / _spdW;
    setIsExporting(true);
    setExportProgress(0);
    offlineExportRef.current = true;
    try {
      const { default: WebMWriter } = await import('webm-writer');
      const offCanvas = document.createElement('canvas');
      offCanvas.width = baseCanvas.width;
      offCanvas.height = baseCanvas.height;
      const fps = 30;
      const totalFrames = Math.ceil(outputDurationW * fps);
      const writer = new WebMWriter({ frameRate: fps, quality: 0.95 });
      for (let i = 0; i < totalFrames; i++) {
        // t = tempo no espaço do projeto: cada frame de saída avança spd× o projeto
        const t = (i / fps) * _spdW;
        await renderAtTimeToCanvas(offCanvas, t);
        writer.addFrame(offCanvas);
        if (i % 15 === 0) { setExportProgress((i + 1) / totalFrames); await new Promise(r => setTimeout(r, 0)); }
      }
      const blob = await writer.complete();
      await saveWithPicker(blob, `canvas.webm`, 'video/webm', ['.webm']);
    } finally {
      offlineExportRef.current = false;
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleSaveWebmOfflineWithAudio = async () => {
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;

    const effectiveDuration = (() => {
      // Calcula o fim real do áudio na timeline: offset + duração após trim
      const _audEnd = duration > 0
        ? (audioOffset || 0) + (
            audioTrimEnd !== null
              ? (audioTrimEnd - (audioTrimStart || 0))
              : (duration - (audioTrimStart || 0))
          )
        : 0;
      const _lyricEnd = lyrics && lyrics.length ? Math.max(...lyrics.map(l => l.end || 0)) : 0;
      const _imgEnd   = images && images.length ? Math.max(...images.map(i => i.end || 0)) : 0;
      const _vidEnd   = videos && videos.length ? Math.max(...videos.map(v => v.end || 0)) : 0;
      return Math.max(_audEnd, _lyricEnd, _imgEnd, _vidEnd) || 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;

    const _spd1 = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    const _vol1 = Math.max(0, Math.min(1, projectVolumeRef.current));
    const _trimStart1 = audioTrimStart || 0;
    const _trimEnd1   = audioTrimEnd !== null ? audioTrimEnd : null;
    // outputDuration1 = duração TOTAL do projeto (não limitada pelo trim do áudio)
    // O trim afeta apenas o conteúdo do buffer de áudio, não a duração do vídeo
    const outputDuration1 = effectiveDuration / _spd1;

    setIsExporting(true);
    setExportProgress(0);

    // ── Abordagem real-time: captura canvas + áudio enquanto tudo toca ─────────
    // Muito mais rápida e confiável que seek frame-a-frame para projetos com vídeo
    try {
      // 1. AudioContext para mixar todas as fontes de áudio
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const dest = ac.createMediaStreamDestination();
      const gainNode = ac.createGain();
      gainNode.gain.value = _vol1;
      gainNode.connect(dest);

      // 2. Música de fundo
      let bgSource = null;
      if (audioFile || audioBase64) {
        try {
          let buf;
          if (audioFile) { buf = await audioFile.arrayBuffer(); }
          else {
            const b64 = audioBase64.split(',')[1];
            const bin = atob(b64); const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            buf = bytes.buffer;
          }
          const decoded = await ac.decodeAudioData(buf);
          // Aplica trimStart/trimEnd ao buffer antes de tocar
          const _tS = Math.round((_trimStart1 || 0) * decoded.sampleRate);
          const _tE = _trimEnd1 !== null
            ? Math.round(_trimEnd1 * decoded.sampleRate)
            : decoded.length;
          const _nCh = decoded.numberOfChannels;
          const _trimmedBuf = ac.createBuffer(_nCh, Math.max(1, _tE - _tS), decoded.sampleRate);
          for (let _ch = 0; _ch < _nCh; _ch++)
            _trimmedBuf.getChannelData(_ch).set(decoded.getChannelData(_ch).subarray(_tS, _tE));
          bgSource = ac.createBufferSource();
          bgSource.buffer = _trimmedBuf;
          bgSource.playbackRate.value = _spd1;
          bgSource.connect(gainNode);
        } catch(e) { console.warn('[WEBM RT] bg audio error', e); }
      }

      // 3. Áudio dos vídeos: usa audioBuffer (já decodificado) — MediaElementSource
      //    capturaria silêncio pois videoEl.muted=true durante playback Web Audio
      const vidSources = [];
      const vidVolumesBackup = []; // mantido para compatibilidade com cleanup
      for (const v of videosRef.current) {
        if (v.muted || !v.audioBuffer) continue;
        try {
          const trimSt   = v.trimStart ?? 0;
          const vidSpd   = v.vidSpeed ?? 1;
          const effSpd   = Math.max(0.25, Math.min(4, _spd1 * vidSpd));
          const trimEnd  = Math.min(trimSt + (v.end - v.start) * vidSpd, v.audioBuffer.duration);
          const trimDur  = Math.max(0, trimEnd - trimSt);
          if (trimDur < 0.05) continue;

          // Sub-buffer com região trimada
          const nCh    = v.audioBuffer.numberOfChannels;
          const sr     = v.audioBuffer.sampleRate;
          const startS = Math.round(trimSt * sr);
          const endS   = Math.round(trimEnd * sr);
          const tmpBuf = ac.createBuffer(nCh, endS - startS, sr);
          for (let ch = 0; ch < nCh; ch++) {
            tmpBuf.getChannelData(ch).set(v.audioBuffer.getChannelData(ch).subarray(startS, endS));
          }

          const srcNode = ac.createBufferSource();
          srcNode.buffer = tmpBuf;
          srcNode.playbackRate.value = effSpd;
          const volNode = ac.createGain();
          volNode.gain.value = Math.max(0, Math.min(1, _vol1 * (v.vidVolume ?? 1)));
          srcNode.connect(volNode);
          volNode.connect(dest);
          // Agenda início: v.start segundos após o início do export (ajustado por projSpd)
          srcNode.start(ac.currentTime + v.start / _spd1);
          vidSources.push(srcNode);
        } catch(e) {
          console.warn('[WEBM RT] video audio error:', e.message);
        }
      }

      // 4. Captura canvas em 30fps
      const canvasStream = baseCanvas.captureStream(30);
      const combined = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      const chunks = [];
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus' : 'video/webm';
      const recorder = new MediaRecorder(combined, { mimeType, videoBitsPerSecond: 4_000_000 });
      recorder.ondataavailable = e => { if (e.data?.size > 0) chunks.push(e.data); };

      // 5. Posiciona vídeos overlay no tempo correto e prepara playback
      const vidsToPlay = videosRef.current.filter(v => v.videoEl);
      for (const v of vidsToPlay) {
        // Durante RT export, o virtualTimeRef já avança com _spd1 embutido.
        // O videoEl deve tocar na velocidade NATURAL do clipe (vidSpeed apenas),
        // caso contrário o vídeo aparece acelerado por projectSpeed no canvas capturado.
        v.videoEl.playbackRate = Math.max(0.25, Math.min(4, v.vidSpeed ?? 1));
        v.videoEl.volume = Math.max(0, Math.min(1, _vol1 * (v.vidVolume ?? 1)));
        v.videoEl.currentTime = v.trimStart ?? 0;
      }

      // 6. Inicia gravação
      rtExportRef.current = true; // draw() ignora audioRef.current durante captura
      recorder.start(100); // chunks a cada 100ms

      // 7. Começa a tocar tudo em sincronia
      // audioOffset: agendar o início do bgSource no tempo correto da timeline
      if (bgSource) bgSource.start(ac.currentTime + (audioOffset || 0) / _spd1);
      for (const v of vidsToPlay) {
        if (0 >= v.start && 0 <= v.end) v.videoEl.play().catch(() => {});
      }

      // 8. Sincroniza o relógio virtual para o draw loop funcionar
      const startWall = Date.now();
      virtualTimeRef.current = 0;
      // NÃO chamar setIsPlaying — export é independente do estado de play do usuário
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
      clockIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startWall) / 1000;
        const vt = elapsed * _spd1;
        virtualTimeRef.current = vt;
        setCurrentTime(vt);
        setExportProgress(Math.min(elapsed / outputDuration1, 1));

        // Inicia/para vídeos overlay conforme o tempo
        for (const v of vidsToPlay) {
          if (!v.videoEl) continue;
          if (vt >= v.start && vt <= v.end && v.videoEl.paused) {
            const trimSt = v.trimStart ?? 0;
            const rel = trimSt + Math.max(0, vt - v.start) * (v.vidSpeed ?? 1);
            v.videoEl.currentTime = Math.min(rel, v.videoEl.duration || rel);
            v.videoEl.playbackRate = Math.max(0.25, Math.min(4, v.vidSpeed ?? 1));
            v.videoEl.play().catch(() => {});
          } else if ((vt < v.start || vt > v.end) && !v.videoEl.paused) {
            v.videoEl.pause();
          }
        }
      }, 100);

      // 9. Aguarda o tempo de exportação
      await new Promise(resolve => setTimeout(resolve, Math.ceil(outputDuration1 * 1000) + 500));

      // 10. Para tudo
      clearInterval(clockIntervalRef.current); clockIntervalRef.current = null;
      for (const v of vidsToPlay) { if (!v.videoEl.paused) v.videoEl.pause(); }
      if (bgSource) { try { bgSource.stop(); } catch {} }

      // 11. Para o recorder e aguarda finalização
      await new Promise(resolve => {
        recorder.onstop = resolve;
        recorder.stop();
      });

      rtExportRef.current = false; // restaura draw() para usar audioRef.current
      // 12. Limpa WebAudio
      for (const s of vidSources) { try { s.stop(); } catch {} try { s.disconnect(); } catch {} }
      // Restaura volume original dos vídeos após export
      // Também reconecta o audio nativo recarregando a src (desfaz o MediaElementSource hijack)
      for (const { el, vol } of vidVolumesBackup) {
        try {
          const savedSrc = el.src;
          const savedTime = el.currentTime;
          el.src = savedSrc;          // reload desanexa o MediaElementSource
          el.load();
          el.volume = vol;
          el.currentTime = savedTime;
        } catch { try { el.volume = vol; } catch {} }
      }
      ac.close();

      const blob = new Blob(chunks, { type: 'video/webm' });
      if (!blob.size) throw new Error('Arquivo vazio — tente novamente.');
      await saveWithPicker(blob, 'canvas.webm', 'video/webm', ['.webm']);

    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }
  const handleSaveVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fps = 30;
    const canvasStream = canvas.captureStream(fps);
    let stream = canvasStream;
    const audio = audioRef.current;
    if (audio && audio.captureStream) {
      const audioStream = audio.captureStream();
      stream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);
    }
    const chunks = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
    recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      saveWithPicker(blob, `canvas.webm`, 'video/webm', ['.webm']);
    };
    // Ativa flag de playback para que syncVideosInRAF inicie os vídeos overlay
    isPlayingRef.current = true;
    videosRef.current.forEach(v => {
      if (!v.videoEl) return;
      v.videoEl.currentTime = Math.max(0, 0 - v.start); // reseta para o início relativo
      if (0 >= v.start && 0 <= v.end) v.videoEl.play().catch(() => {});
    });
    recorder.start();
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      const onAudioEnded = () => {
        recorder.stop();
        audio.removeEventListener('ended', onAudioEnded);
        isPlayingRef.current = false;
        videosRef.current.forEach(v => { if (v.videoEl && !v.videoEl.paused) v.videoEl.pause(); });
      };
      audio.addEventListener('ended', onAudioEnded);
    } else {
      // Calcula duração pelo conteúdo quando não há áudio
      const contentDur = Math.max(
        ...(videosRef.current.map(v => v.end || 0)),
        ...(lyricsRef.current.map(l => l.end || 0)),
        3
      ) * 1000;
      setTimeout(() => {
        recorder.stop();
        isPlayingRef.current = false;
        videosRef.current.forEach(v => { if (v.videoEl && !v.videoEl.paused) v.videoEl.pause(); });
      }, contentDur);
    }
  };

  // Converte blob URL para base64 (para salvar vídeo no projeto)
  const blobToBase64 = (blobUrl) => new Promise((resolve) => {
    fetch(blobUrl).then(r => r.blob()).then(blob => {
      const reader = new FileReader();
      reader.onload = () => resolve({ data: reader.result, mime: blob.type });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    }).catch(() => resolve(null));
  });

  const buildProjectPayload = () => ({
    bulkText,
    lyrics,
    images: images.map((item) => ({
      id: item.id,
      src: item.src,
      start: item.start,
      end: item.end,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      radius: item.radius,
      rotation: item.rotation ?? 0,
      filters: item.filters || {},
      transitionIn:     item.transitionIn     || 'none',
      transitionOut:    item.transitionOut    || 'none',
      transitionInDur:  item.transitionInDur  ?? 0.35,
      transitionOutDur: item.transitionOutDur ?? 0.35,
    })),
    extraTexts,
    stickers: stickers.map(s => ({ ...s })),
    frames:   frames.map(f => ({ ...f })),
    soundEffects: soundEffects.map(s => ({ ...s })),
    fontSize,
    textColor,
    fontFamily,
    zoom,
    imageSrc,
    audioBase64: audioBase64 || null,
    audioMimeType: audioMimeType || null,
    projectVolume: projectVolume ?? 1,
    projectSpeed:  projectSpeed  ?? 1,
    screenEffect:  screenEffect  || 'none',
    chromaAberration: chromaAberration || 0,
    colorCurves: colorCurves || {r:1,g:1,b:1,midtone:1,shadows:0,highlights:0},
  });

  const exportProject = async () => {
    const payload = buildProjectPayload();
    // Serializa vídeos como base64
    payload.videos = await Promise.all(
      videos.map(async (v) => {
        const b64result = await blobToBase64(v.src);
        return {
          id: v.id, start: v.start, end: v.end,
          x: v.x, y: v.y, width: v.width, height: v.height,
          radius: v.radius ?? 12, rotation: v.rotation ?? 0,
          muted: v.muted || false,
          vidVolume: v.vidVolume ?? 1,
          vidSpeed: v.vidSpeed ?? 1,
          rawDuration: v.rawDuration ?? (v.end - v.start),
          trimStart: v.trimStart ?? 0,
          videoBase64: b64result?.data || null,
          videoMime: b64result?.mime || 'video/mp4',
          filters: v.filters || {},
          transitionIn:     v.transitionIn     || 'none',
          transitionOut:    v.transitionOut    || 'none',
          transitionInDur:  v.transitionInDur  ?? 0.35,
          transitionOutDur: v.transitionOutDur ?? 0.35,
        };
      })
    );
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    await saveWithPicker(blob, 'projeto.json', 'application/json', ['.json']);
  };

  const importProjectFromFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const p = JSON.parse(ev.target.result);
        if (p.bulkText !== undefined) setBulkText(p.bulkText);
        if (Array.isArray(p.lyrics)) setLyrics(p.lyrics);
        if (Array.isArray(p.images)) {
          const loadedImages = p.images.map((item) => {
            const img = new Image();
            const id = item.id || Date.now() + Math.random();
            img.onload = () => {
              if (item.width && item.height && item.x !== undefined && item.y !== undefined) return;
              const placement = buildImagePlacement(img);
              setImages(prevImages => prevImages.map((imgItem) => imgItem.id === id ? { ...imgItem, ...placement } : imgItem));
            };
            img.src = item.src;
            return {
              id,
              src: item.src,
              img,
              start: item.start ?? 0,
              end: item.end ?? 3,
              x: item.x ?? 40,
              y: item.y ?? 60,
              width: item.width ?? 180,
              height: item.height ?? 180,
              radius: item.radius ?? 18,
              rotation: item.rotation ?? 0,
              filters: item.filters || {},
              transitionIn:     item.transitionIn     || 'none',
              transitionOut:    item.transitionOut    || 'none',
              transitionInDur:  item.transitionInDur  ?? 0.35,
              transitionOutDur: item.transitionOutDur ?? 0.35,
            };
          });
          setImages(loadedImages);
        }
        if (Array.isArray(p.extraTexts)) setExtraTexts(p.extraTexts);
        if (Array.isArray(p.stickers)) {
          setStickers(p.stickers);
        }
        if (Array.isArray(p.frames)) setFrames(p.frames);
        if (Array.isArray(p.soundEffects)) setSoundEffects(p.soundEffects);
        if (p.fontSize !== undefined) setFontSize(p.fontSize);
        if (p.textColor) setTextColor(p.textColor);
        if (p.fontFamily) setFontFamily(p.fontFamily);
        if (p.zoom !== undefined) setZoom(p.zoom);
        if (p.imageSrc) {
          setImageSrc(p.imageSrc);
          const img = new Image();
          img.onload = () => setImage(img);
          img.src = p.imageSrc;
        }
        // Restaura vídeos do projeto
        if (Array.isArray(p.videos) && p.videos.length > 0) {
          const loadedVideos = [];
          for (const vData of p.videos) {
            if (!vData.videoBase64) continue;
            try {
              // Converte base64 → blob → object URL → HTMLVideoElement
              const res = await fetch(vData.videoBase64);
              const blob = await res.blob();
              const src = URL.createObjectURL(blob);
              const videoEl = document.createElement('video');
              videoEl.src = src;
              videoEl.muted = vData.muted || false;
              videoEl.playsInline = true;
              videoEl.preload = 'auto';
              videoEl.style.cssText = 'position:fixed;width:1px;height:1px;visibility:hidden;pointer-events:none;top:-9999px;left:-9999px';
              document.body.appendChild(videoEl);
              await new Promise(res2 => {
                videoEl.onloadedmetadata = res2;
                videoEl.onerror = res2;
                setTimeout(res2, 3000);
              });
              // Decodifica audioBuffer para Web Audio (permite seek instantâneo sem delay)
              let audioBuffer = null;
              try {
                if (!videoAudioACRef.current || videoAudioACRef.current.state === 'closed') {
                  videoAudioACRef.current = new (window.AudioContext || window.webkitAudioContext)();
                }
                const arrayBuf = await (await fetch(src)).arrayBuffer();
                audioBuffer = await videoAudioACRef.current.decodeAudioData(arrayBuf);
              } catch (e) { /* vídeo sem áudio — ignora */ }

              loadedVideos.push({
                id: vData.id || Date.now() + Math.random(),
                src, videoEl, audioBuffer,
                start: vData.start ?? 0, end: vData.end ?? 3,
                x: vData.x ?? 0, y: vData.y ?? 0,
                width: vData.width ?? 200, height: vData.height ?? 200,
                radius: vData.radius ?? 12, rotation: vData.rotation ?? 0,
                muted: vData.muted || false,
                vidVolume: vData.vidVolume ?? 1,
                vidSpeed: vData.vidSpeed ?? 1,
                rawDuration: vData.rawDuration ?? (vData.end - vData.start),
                trimStart: vData.trimStart ?? 0,
                transitionIn:     vData.transitionIn     || 'none',
                transitionOut:    vData.transitionOut    || 'none',
                transitionInDur:  vData.transitionInDur  ?? 0.35,
                transitionOutDur: vData.transitionOutDur ?? 0.35,
              });
            } catch { void 0; }
          }
          if (loadedVideos.length > 0) setVideos(loadedVideos);
        }

        // Restaura áudio do projeto
        if (p.projectVolume !== undefined) setVolume(p.projectVolume);
        if (p.projectSpeed  !== undefined) setSpeed(p.projectSpeed);
        if (p.screenEffect    !== undefined) setScreenEffect(p.screenEffect);
        if (p.chromaAberration!== undefined) setChromaAberration(p.chromaAberration);
        if (p.colorCurves      !== undefined) setColorCurves(p.colorCurves);
        if (p.audioBase64) {
          setAudioBase64(p.audioBase64);
          setAudioMimeType(p.audioMimeType || 'audio/mpeg');
          setAudioSrc(p.audioBase64); // data URL funciona diretamente como src
          setAudioFile(null); // sem File object, mas audioBase64 disponível
          // Decodifica waveform
          try {
            const b64 = p.audioBase64.split(',')[1];
            const binary = atob(b64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            decodeWaveformFromBuffer(bytes.buffer);
          } catch { void 0; }
        }
      } catch { void 0; }
    };
    reader.readAsText(file);
  };


  // ── Exportação MP4 SD (usando mp4-muxer + WebCodecs H.264) ─────────────────

  // ── Helper: exporta em tempo real usando WebCodecs + AudioContext ─────────
  // Mesma abordagem do WEBM+Áudio — 40s de projeto = ~40s de export
  const _exportRealtimeWebCodecs = async ({
    outputMime, videoCodec, audioCodec, bitrateVideo, bitrateAudio,
    scaleFactor, muxerFactory, targetWidth, targetHeight, suggestedName, mimeForPicker,
  }) => {
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;

    const effectiveDuration = (() => {
      const _audEnd = duration > 0
        ? (audioOffset || 0) + (
            audioTrimEnd !== null
              ? (audioTrimEnd - (audioTrimStart || 0))
              : (duration - (audioTrimStart || 0))
          )
        : 0;
      const _lyricEnd = lyrics.length ? Math.max(...lyrics.map(l => l.end || 0)) : 0;
      const _imgEnd   = images.length ? Math.max(...images.map(i => i.end || 0)) : 0;
      const _vidEnd   = videos.length ? Math.max(...videos.map(v => v.end || 0)) : 0;
      return Math.max(_audEnd, _lyricEnd, _imgEnd, _vidEnd) || 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;

    const spd  = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    const vol  = Math.max(0, Math.min(1, projectVolumeRef.current));
    const outDur = effectiveDuration / spd;
    const FPS = 30;
    const W   = targetWidth  || baseCanvas.width;
    const H   = targetHeight || baseCanvas.height;
    const SCALE = (W !== baseCanvas.width) ? W / baseCanvas.width : (scaleFactor || 1);
    const isMP4 = outputMime === 'video/mp4';

    // Respeita o corte de áudio
    const trimStart = audioTrimStart || 0;
    const trimEnd   = audioTrimEnd !== null ? audioTrimEnd : null;
    // Duração real do projeto limitada pelo audioTrimEnd se houver corte
    const audioDur  = trimEnd !== null
      ? Math.min(outDur, (trimEnd - trimStart) / spd)
      : outDur;

    stopAllVideoAudio();
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsExporting(true);
    setExportProgress(0);

    const offCanvas = (W !== baseCanvas.width || H !== baseCanvas.height)
      ? Object.assign(document.createElement('canvas'), { width: W, height: H })
      : null; // null = usa baseCanvas diretamente

    try {
      const muxerMod = await muxerFactory();
      const { Muxer, ArrayBufferTarget } = muxerMod;
      const target = new ArrayBufferTarget();

      // mp4-muxer usa 'avc' e 'aac'; webm-muxer usa 'V_VP8' e 'A_OPUS'
      const muxVideoCodec = isMP4 ? 'avc' : videoCodec;
      const muxAudioCodec = isMP4 ? 'aac' : audioCodec;
      const hasAudio = !!(audioFile || audioBase64 || videosRef.current.some(v => !v.muted));

      const muxer = new Muxer({
        target,
        video: { codec: muxVideoCodec, width: W, height: H, frameRate: FPS },
        ...(hasAudio ? { audio: { codec: muxAudioCodec, sampleRate: 48000, numberOfChannels: 2 } } : {}),
        ...(isMP4 ? { fastStart: 'in-memory' } : {}),
      });

      let encoderError = null;
      const vEncCodec = isMP4 ? 'avc1.640034' : 'vp8';
      const vEnc = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: e => { encoderError = e; console.error('[RT VideoEncoder]', e); },
      });
      vEnc.configure({ codec: vEncCodec, width: W, height: H, bitrate: bitrateVideo, framerate: FPS });

      // ── Áudio (processado offline antes de iniciar captura) ─────────────────
      let aEnc = null;
      if (hasAudio) {
        try {
          aEnc = new AudioEncoder({
            output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
            error: e => console.error('[RT AudioEnc]', e),
          });
          const aEncCodec = isMP4 ? 'mp4a.40.2' : 'opus';
          aEnc.configure({ codec: aEncCodec, sampleRate: 48000, numberOfChannels: 2, bitrate: bitrateAudio });

          // Buffer de saída: tamanho do projeto completo (outDur), não audioDur.
          // Com audioOffset, audioDur seria pequeno demais: offsetSamples + sL.length > audioDur*SR
          const silLen = Math.ceil(48000 * outDur);
          const outL = new Float32Array(silLen);
          const outR = new Float32Array(silLen);

          if (audioFile || audioBase64) {
            let buf;
            if (audioFile) { buf = await audioFile.arrayBuffer(); }
            else {
              const b64 = audioBase64.split(',')[1]; const bin = atob(b64);
              const by = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) by[i]=bin.charCodeAt(i);
              buf = by.buffer;
            }
            const ac = new (window.AudioContext||window.webkitAudioContext)({ sampleRate:48000 });
            const decoded = await ac.decodeAudioData(buf); ac.close();
            // Cria sub-buffer respeitando trimStart/trimEnd
            const startSample = Math.round(trimStart * decoded.sampleRate);
            const endSample   = trimEnd !== null
              ? Math.round(trimEnd * decoded.sampleRate)
              : decoded.length;
            const nCh = decoded.numberOfChannels;
            const tmpBuf = ac.createBuffer ? (() => {
              const _ac2 = new (window.AudioContext||window.webkitAudioContext)();
              const b = _ac2.createBuffer(nCh, endSample - startSample, decoded.sampleRate);
              for (let ch=0;ch<nCh;ch++) b.getChannelData(ch).set(decoded.getChannelData(ch).subarray(startSample, endSample));
              _ac2.close(); return b;
            })() : decoded;
            const [sL, sR] = await _renderAudioStretched(tmpBuf, spd, vol, 48000);
            // audioOffset: o áudio começa em audioOffset segundos na timeline.
            // No buffer de saída, precisamos pular offsetSamples amostras antes de escrever.
            const offsetSamples = Math.round((audioOffset || 0) / spd * 48000);
            const copyLen = Math.min(sL.length, silLen - offsetSamples);
            if (copyLen > 0 && offsetSamples < silLen) {
              outL.set(sL.subarray(0, copyLen), offsetSamples);
              outR.set(sR.subarray(0, copyLen), offsetSamples);
            }
          }
          await _mixSfxIntoBuffers(outL, outR, soundEffects, 48000);
          await _mixVideoAudioIntoBuffers(outL, outR, videosRef.current, spd, vol, 48000);

          const BLK = 4096;
          for (let op = 0; op < outL.length; op += BLK) {
            const bl = Math.min(BLK, outL.length - op);
            const pl = new Float32Array(bl * 2);
            for (let i = 0; i < bl; i++) { pl[i] = outL[op+i]||0; pl[bl+i] = outR[op+i]||0; }
            const ad = new AudioData({ format:'f32-planar', sampleRate:48000, numberOfChannels:2,
              numberOfFrames:bl, timestamp:Math.round((op/48000)*1e6), data:pl.buffer });
            aEnc.encode(ad); ad.close();
          }
          await aEnc.flush();
        } catch(e) { console.error('[RT AudioEnc setup]', e); aEnc = null; }
      }

      // ── Captura de frames em tempo real ────────────────────────────────────
      // Os vídeos são tocados internamente pelo syncId abaixo — invisível para o usuário
      // (videoEl.muted=false apenas para o export, restaurado no finally)
      // O draw loop do RAF captura os frames via virtualTimeRef sem alterar o estado de play

      const startWall = Date.now();
      virtualTimeRef.current = 0;
      rtExportRef.current = true;

      // totalFrames usa outDur (duração total do projeto), não audioDur
      // audioDur apenas limita o buffer de áudio — o vídeo deve ter o comprimento total
      const totalFrames = Math.ceil(outDur * FPS);
      let frameCount = 0;

      await new Promise(resolve => {
        let stopped = false;
        const stop = () => {
          if (stopped) return; stopped = true;
          exportStopRef.current = null;
          clearInterval(captureId); clearInterval(syncId); resolve();
        };
        exportStopRef.current = stop; // permite que Stop pare o export

        const captureId = setInterval(() => {
          if (stopped || encoderError) { stop(); return; }
          const elapsed = (Date.now() - startWall) / 1000;
          if (elapsed >= outDur + 0.2 || frameCount >= totalFrames + 3) { stop(); return; }

          const srcCanvas = offCanvas || baseCanvas;
          if (offCanvas) {
            const ctx = offCanvas.getContext('2d');
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(baseCanvas, 0, 0, W, H);
          }

          try {
            const frame = new VideoFrame(srcCanvas, {
              timestamp: Math.round(frameCount * (1e6 / FPS)),
              duration:  Math.round(1e6 / FPS),
            });
            vEnc.encode(frame, { keyFrame: frameCount % 60 === 0 });
            frame.close();
          } catch(e) { console.warn('[RT frame]', e); }

          frameCount++;
          if (frameCount % 15 === 0) setExportProgress(Math.min(frameCount / totalFrames, 0.99));
        }, Math.round(1000 / FPS));

        // Pre-posiciona e desmuta vídeos para o export (sem aparecer no editor)
        videosRef.current.forEach(v => {
          if (!v.videoEl) return;
          v.videoEl.muted = false; // precisa de áudio se usar MediaElementSource
          v.videoEl.volume = 0;    // silencia saída do speaker — export captura via offscreen
          // Igual ao RT export: virtualTimeRef já embute projectSpeed,
          // então o videoEl deve tocar em vidSpeed apenas para não acelerar.
          v.videoEl.playbackRate = Math.max(0.25, Math.min(4, v.vidSpeed ?? 1));
          v.videoEl.currentTime = v.trimStart ?? 0;
        });
        // Inicia vídeos no range t=0
        videosRef.current.forEach(v => {
          if (!v.videoEl || v.start > 0) return;
          v.videoEl.play().catch(() => {});
        });

        const syncId = setInterval(() => {
          const elapsed = (Date.now() - startWall) / 1000;
          const vt = elapsed * spd;
          virtualTimeRef.current = vt;
          setCurrentTime(vt);
          // Ativa/desativa vídeos conforme o tempo — sem alterar estado de play do usuário
          for (const v of videosRef.current) {
            if (!v.videoEl) continue;
            if (vt >= v.start && vt <= v.end && v.videoEl.paused) {
              const trimSt = v.trimStart ?? 0;
              const rel = trimSt + Math.max(0, vt - v.start) * (v.vidSpeed ?? 1);
              v.videoEl.currentTime = Math.min(rel, v.videoEl.duration || rel);
              v.videoEl.playbackRate = Math.max(0.25, Math.min(4, v.vidSpeed ?? 1));
              v.videoEl.play().catch(() => {});
            } else if ((vt < v.start || vt > v.end) && !v.videoEl.paused) {
              v.videoEl.pause();
            }
          }
        }, 100);
      });

      // Para os vídeos do export e restaura volume
      rtExportRef.current = false;
      videosRef.current.forEach(v => {
        if (!v.videoEl) return;
        if (!v.videoEl.paused) v.videoEl.pause();
        v.videoEl.muted = true;
        // Restaura volume para o valor configurado pelo usuário
        v.videoEl.volume = Math.max(0, Math.min(1, projectVolumeRef.current * (v.vidVolume ?? 1)));
      });

      await vEnc.flush();
      if (encoderError) throw encoderError;
      muxer.finalize();

      const blob = new Blob([target.buffer], { type: outputMime });
      if (!blob.size) throw new Error('Arquivo gerado está vazio.');
      setExportProgress(1);
      await saveWithPicker(blob, suggestedName, mimeForPicker, [suggestedName.slice(suggestedName.lastIndexOf('.'))]);

    } finally {
      setIsExporting(false);
      setExportProgress(0);
      offlineExportRef.current = false;
      rtExportRef.current = false;
      videosRef.current.forEach(v => { if (v.videoEl) v.videoEl.muted = true; });
    }
  };

  const handleSaveMp4 = async () => {
    if (!window.VideoEncoder) { alert('Exportação MP4 disponível apenas em Chrome/Edge.'); return; }
    await _exportRealtimeWebCodecs({
      outputMime: 'video/mp4', videoCodec: 'avc1.640034', audioCodec: 'mp4a.40.2',
      bitrateVideo: 4_000_000, bitrateAudio: 192000,
      scaleFactor: 1, muxerFactory: () => import('mp4-muxer'),
      suggestedName: 'canvas.mp4', mimeForPicker: 'video/mp4',
    });
  };

  const handleSaveMp4HD = async () => {
    if (!window.VideoEncoder) { alert('Exportação MP4 HD disponível apenas em Chrome/Edge.'); return; }
    const baseCanvas = canvasRef.current; if (!baseCanvas) return;
    const SCALE = 1080 / baseCanvas.width;
    const W = 1080, H = Math.round(baseCanvas.height * SCALE);
    await _exportRealtimeWebCodecs({
      outputMime: 'video/mp4', videoCodec: 'avc1.640034', audioCodec: 'mp4a.40.2',
      bitrateVideo: 8_000_000, bitrateAudio: 192000,
      scaleFactor: SCALE, targetWidth: W, targetHeight: H,
      muxerFactory: () => import('mp4-muxer'),
      suggestedName: 'canvas_hd.mp4', mimeForPicker: 'video/mp4',
    });
  };

  const handleSaveHD = async () => {
    if (!window.VideoEncoder) { alert('Exportação HD disponível apenas em Chrome/Edge.'); return; }
    const baseCanvas = canvasRef.current; if (!baseCanvas) return;
    const srcW = baseCanvas.width, srcH = baseCanvas.height;
    const MAX_SIDE = 1920;
    const sf = Math.min(MAX_SIDE / srcW, MAX_SIDE / srcH, 4);
    const W = Math.round(srcW * sf / 2) * 2, H = Math.round(srcH * sf / 2) * 2;
    await _exportRealtimeWebCodecs({
      outputMime: 'video/webm', videoCodec: 'V_VP8', audioCodec: 'A_OPUS',
      bitrateVideo: 8_000_000, bitrateAudio: 192000,
      scaleFactor: sf, targetWidth: W, targetHeight: H,
      muxerFactory: () => import('webm-muxer'),
      suggestedName: 'canvas_hd.webm', mimeForPicker: 'video/webm',
    });
  };



  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mapeamento de formato → mime, extensão e nome sugerido
    const fmtMap = {
      webm_offline_audio: { mime: 'video/webm',  ext: ['.webm'], name: 'canvas.webm' },
      mp4:                { mime: 'video/mp4',   ext: ['.mp4'],  name: 'canvas.mp4'  },
      webm_hd:            { mime: 'video/webm',  ext: ['.webm'], name: 'canvas_hd.webm' },
      mp4_hd:             { mime: 'video/mp4',   ext: ['.mp4'],  name: 'canvas_hd.mp4'  },
      png:                { mime: 'image/png',   ext: ['.png'],  name: 'canvas.png'  },
      jpg:                { mime: 'image/jpeg',  ext: ['.jpg', '.jpeg'], name: 'canvas.jpg' },
    };
    const fmt = fmtMap[exportFormat] || fmtMap['webm_offline_audio'];

    // Abre o diálogo AGORA — ainda no contexto do clique do usuário
    if (window.showSaveFilePicker) {
      try {
        fileHandleRef.current = await window.showSaveFilePicker({
          suggestedName: fmt.name,
          types: [{ description: fmt.mime, accept: { [fmt.mime]: fmt.ext } }],
        });
      } catch (err) {
        if (err.name === 'AbortError') return; // usuário cancelou
        fileHandleRef.current = null; // erro inesperado — usa fallback
      }
    }

    // Agora chama o processamento (pode demorar, não importa mais)
    if (exportFormat === 'webm_offline_audio') {
      handleSaveWebmOfflineWithAudio();
      return;
    }
    if (exportFormat === 'mp4') {
      handleSaveMp4();
      return;
    }
    if (exportFormat === 'webm_hd') {
      handleSaveHD();
      return;
    }
    if (exportFormat === 'mp4_hd') {
      handleSaveMp4HD();
      return;
    }
    const isPng = exportFormat === 'png';
    const dataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92);
    const mime = isPng ? 'image/png' : 'image/jpeg';
    await saveWithPicker(dataUrl, isPng ? 'canvas.png' : 'canvas.jpg', mime, isPng ? ['.png'] : ['.jpg', '.jpeg']);
  };


  // ── Proteção de rota ─────────────────────────────────────────────────────────
  if (authLoading) return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', color:'#555', fontFamily:'DM Sans,sans-serif', fontSize:14 }}>
      Carregando...
    </div>
  );

  if (!isLoggedIn) {
    window.location.href = '/entrar?redirect=/editor';
    return null;
  }

  if (!isPro) {
    window.location.href = '/planos';
    return null;
  }


  // ── applyTemplate ──────────────────────────────────────────────────────────
  const applyTemplate = (tpl) => {
    const fmt = CANVAS_FORMATS[tpl.format] || CANVAS_FORMATS['16:9'];
    const cw  = fmt.width;
    const ch  = fmt.height;
    const s   = tpl.settings;
    setCanvasFormat(tpl.format);
    setFontSize(s.fontSize);
    setFontFamily(s.fontFamily);
    setTextColor(s.textColor);
    setGradientEnabled(s.gradientEnabled);
    setGradientColor1(s.gradientColor1 ?? '#ffffff');
    setGradientColor2(s.gradientColor2 ?? '#00BFFF');
    setShadowEnabled(s.shadowEnabled);
    setShadowBlur(s.shadowBlur ?? 12);
    setShadowColor(s.shadowColor ?? 'rgba(0,0,0,0.9)');
    setShadowOffsetX(s.shadowOffsetX ?? 0);
    setShadowOffsetY(s.shadowOffsetY ?? 2);
    setZoom(s.zoom ?? 50);
    const newExtras = tpl.extraTexts.map((et, idx) => ({
      id:         Date.now() + idx,
      text:       (lang === 'en' && et.textEn) ? et.textEn : et.text,
      x:          Math.round(cw * et.rx),
      y:          Math.round(ch * et.ry),
      rotation:   0,
      color:      et.color,
      fontFamily: et.ff,
      fontSize:   et.fs,
    }));
    setExtraTexts(newExtras);
    if (newExtras.length > 0) {
      const last = newExtras[newExtras.length - 1];
      setExtraTextColor(last.color);
      setExtraTextFontFamily(last.fontFamily);
      setExtraTextFontSize(last.fontSize);
      setActiveExtraTextId(last.id);
    }
    setShowTemplatePanel(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      background: '#080808', 
      color: '#f0f0f0', 
      fontFamily: "'DM Sans', 'Poppins', system-ui, sans-serif", 
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}
    onMouseMove={handleGlobalMouseMove}
    onMouseUp={handleGlobalMouseUp}
    >
      <style>{`
        .lyrics-textarea::-webkit-scrollbar {
          width: 10px;
        }
        .lyrics-textarea::-webkit-scrollbar-track {
          background: #0a0a0a;
          border-radius: 12px;
        }
        .lyrics-textarea::-webkit-scrollbar-thumb {
          background: #00BFFF;
          border-radius: 12px;
          border: 2px solid #0a0a0a;
        }
        .lyrics-textarea::-webkit-scrollbar-button {
          height: 10px;
          background: #111;
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          .cs-left-panel { display: none !important; }
          .cs-timeline    { display: none !important; }
          .cs-header      { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; }
        }
      `}</style>

      {/* Banner mobile */}
      {showMobileBanner && (
        <div style={{ background:'linear-gradient(90deg,#1a0e00,#0a1200)', borderBottom:'1px solid rgba(251,191,36,0.25)', padding:'7px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, zIndex:200, flexShrink:0 }}>
          <span style={{ fontSize:11, color:'#fbbf24', lineHeight:1.4 }}>📱 Para melhor experiência use no <strong>computador</strong> em <strong>modo paisagem</strong>.</span>
          <button onClick={() => setShowMobileBanner(false)} style={{ background:'none', border:'none', color:'#fbbf24', cursor:'pointer', fontSize:18, flexShrink:0, lineHeight:1 }}>✕</button>
        </div>
      )}

      {/* HEADER CONTROLS — Redesign profissional: barra única com grupos */}
      <div className="cs-header" style={{ display:'flex', alignItems:'center', gap:4, padding:'0 10px', height:52, background:'linear-gradient(180deg,#0d1117 0%,#090d13 100%)', borderBottom:'1px solid rgba(255,255,255,0.07)', width:'100%', boxSizing:'border-box', flexShrink:0, zIndex:100 }}>

        {/* ── Logo ── */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginRight:6, flexShrink:0 }}>
          <div style={{ width:24, height:24, borderRadius:7, background:'linear-gradient(135deg,#00BFFF,#7b2ff7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>▶</div>
          <span style={{ fontSize:12, fontWeight:800, color:'#f0f0f0', letterSpacing:'-0.3px', whiteSpace:'nowrap' }}>Canvas<span style={{ color:'#00BFFF' }}>Sync</span></span>
        </div>

        {/* Divisor */}
        <div style={{ width:1, height:28, background:'rgba(255,255,255,0.07)', flexShrink:0 }} />

        {/* ── Grupo MÍDIAS ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={(el)=>{ midiaBtnRef.current=el; bgBtnRef.current=el; trilhasBtnRef.current=el; }}
            onClick={() => { setShowMidiasPanel(v=>!v); setShowExportPanel(false); setShowProjetoPanel(false); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showMidiasPanel?'rgba(0,191,255,0.18)':'transparent', border:`1px solid ${showMidiasPanel?'rgba(0,191,255,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, transition:'all 0.15s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{if(!showMidiasPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showMidiasPanel)e.currentTarget.style.background='transparent'}}
          >
            <span style={{fontSize:13}}>📂</span> Mídias <span style={{fontSize:9,opacity:0.6}}>▾</span>
          </button>
          {showMidiasPanel && createPortal(
            <>
              <div onClick={()=>setShowMidiasPanel(false)} style={{position:'fixed',inset:0,zIndex:99997}} />
              <div style={{ position:'fixed', top:(midiaBtnRef.current?.getBoundingClientRect().bottom??52)+4, left:Math.max(8,midiaBtnRef.current?.getBoundingClientRect().left??0), zIndex:99998, background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, width:240, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', overflow:'hidden', padding:'6px 0' }}>
                <div style={{padding:'8px 14px 4px',fontSize:10,color:'#555',fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase'}}>Importar Mídia</div>
                {[
                  { icon:'🖼️', label:'Fundo / Imagem de fundo', color:'#00BFFF',  action:()=>{ bgInputRef.current?.click(); setShowMidiasPanel(false); } },
                  { icon:'🎨', label:'Fundos & Gradientes',       color:'#00BFFF',  action:()=>{ setShowMidiasPanel(false); setShowBgPanel(v=>!v); } },
                  { icon:'✕',  label:'Remover fundo',             color:'#f87171',  action:()=>{ setImageSrc(null); setImage(null); if(bgInputRef.current)bgInputRef.current.value=''; setShowMidiasPanel(false); } },
                  { icon:'🏞️', label:'Imagens overlay',         color:'#00BFFF',  action:()=>{ imagesInputRef.current?.click(); setShowMidiasPanel(false); } },
                  { icon:'🎬', label:'Vídeo',                    color:'#a78bfa',  action:()=>{ videoInputRef.current?.click(); setShowMidiasPanel(false); } },
                  { icon:'🎵', label:'Música / Áudio',           color:'#10b981',  action:()=>{ audioInputRef.current?.click(); setShowMidiasPanel(false); } },
                  { icon:'🎼', label:'Trilhas',                        color:'#a78bfa',  action:()=>{ setShowMidiasPanel(false); setShowTrilhasPanel(v=>!v); } },
                ].map(item=>(
                  <div key={item.label} onClick={item.action}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', cursor:'pointer', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <span style={{fontSize:16}}>{item.icon}</span>
                    <span style={{fontSize:12,color:'#ccc',fontWeight:500}}>{item.label}</span>
                  </div>
                ))}
<div style={{height:1,background:'rgba(255,255,255,0.06)',margin:'4px 0'}} />

              </div>
            </>,
            document.body
          )}
        </div>

        {/* ── Templates ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={templateBtnRef}
            onClick={()=>{ const rect=templateBtnRef.current?.getBoundingClientRect(); if(rect) setTemplatePanelPos({top:rect.bottom+4,left:Math.max(10,Math.min(rect.left,window.innerWidth-750))}); setTemplateFormatTab(canvasFormat); setShowTemplatePanel(v=>!v); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showTemplatePanel?'rgba(16,185,129,0.18)':'transparent', border:`1px solid ${showTemplatePanel?'rgba(16,185,129,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showTemplatePanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showTemplatePanel)e.currentTarget.style.background='transparent'}}
          >
            <span style={{fontSize:13}}>⚡</span> Templates
          </button>
          {showTemplatePanel && createPortal(
            <>
              <div onClick={()=>setShowTemplatePanel(false)} style={{position:'fixed',inset:0,zIndex:99998}} />
              <div ref={templatePortalRef} style={{ position:'fixed', top:templatePanelPos.top, left:templatePanelPos.left, zIndex:99999, background:'#0f172a', border:'1px solid rgba(16,185,129,0.3)', borderRadius:20, width:740, maxHeight:'82vh', boxShadow:'0 24px 64px rgba(0,0,0,0.85)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'16px 20px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:800, fontSize:16, color:'#10b981' }}>⚡ Templates</span>
                  <button onClick={()=>setShowTemplatePanel(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:18 }}>✕</button>
                </div>
                {/* TEMPLATE CONTENT — MANTIDO ORIGINAL */}
                <div style={{ display:'flex', gap:6, padding:'10px 16px 6px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  {['9:16','16:9','1:1','4:3'].map(fmt=>{
                    const count = CANVAS_TEMPLATES.filter(t=>t.format===fmt).length;
                    if(!count) return null;
                    return <button key={fmt} onClick={()=>setTemplateFormatTab(fmt)} style={{ padding:'4px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, background:templateFormatTab===fmt?'#10b981':'rgba(255,255,255,0.06)', color:templateFormatTab===fmt?'#000':'#888' }}>{fmt} <span style={{opacity:0.5}}>({count})</span></button>;
                  })}
                </div>
                <div style={{ overflowY:'auto', flex:1, padding:14, display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:10 }}>
                  {CANVAS_TEMPLATES.filter(t => t.format === templateFormatTab).map(tpl => {
                    const s = tpl.settings;
                    const fmtRatios = {'16:9':[16,9],'9:16':[9,16],'1:1':[1,1],'4:3':[4,3]};
                    const [rw, rh] = fmtRatios[tpl.format] || [9,16];
                    let mw = 175, mh = mw * (rh / rw);
                    if (mh > 100) { mh = 100; mw = mh * (rw / rh); }
                    mw = Math.round(mw); mh = Math.round(mh);
                    return (
                      <div key={tpl.id} style={{ background:'#0a0f1e', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, cursor:'pointer', transition:'border 0.15s, background 0.15s', display:'flex', flexDirection:'column' }}
                        onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${tpl.accent}70`;e.currentTarget.style.background='#0e1628';}}
                        onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.07)';e.currentTarget.style.background='#0a0f1e';}}
                      >
                        {/* Preview */}
                        <div style={{ width:'100%', height:110, background:'#060c18', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', borderRadius:'14px 14px 0 0', overflow:'hidden' }}>
                          <div style={{ width:mw, height:mh, position:'relative', borderRadius:4, overflow:'hidden', background:`radial-gradient(ellipse at 50% 50%, ${tpl.accent}20 0%, #080818 70%)`, boxShadow:s.shadowEnabled?`0 0 14px ${tpl.accent}50`:'none', border:`1px solid ${tpl.accent}30`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3 }}>
                            <div style={{ width:'55%', height:2, borderRadius:1, background:tpl.accent, opacity:0.35 }} />
                            <div style={{ width:'75%', height:Math.max(4,Math.round(mh*0.1)), borderRadius:2, background:s.gradientEnabled?`linear-gradient(90deg,${s.gradientColor1},${s.gradientColor2})`:s.textColor, boxShadow:s.shadowEnabled?`0 0 8px ${tpl.accent}80`:'none' }} />
                            <div style={{ width:'55%', height:Math.max(3,Math.round(mh*0.07)), borderRadius:2, background:s.gradientEnabled?s.gradientColor2:s.textColor, opacity:0.55 }} />
                            <div style={{ width:'50%', height:2, borderRadius:1, background:tpl.accent, opacity:0.25 }} />
                          </div>
                          <div style={{ position:'absolute', top:5, right:6, background:`${tpl.accent}22`, border:`1px solid ${tpl.accent}44`, borderRadius:4, padding:'1px 5px', fontSize:8, color:tpl.accent, fontWeight:700 }}>{tpl.format}</div>
                        </div>
                        {/* Info */}
                        <div style={{ padding:'9px 12px 4px', display:'flex', flexDirection:'column', gap:4 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ width:7, height:7, borderRadius:'50%', background:tpl.accent, flexShrink:0 }} />
                            <span style={{ fontSize:11, fontWeight:800, color:'#f1f5f9' }}>{tpl.name}</span>
                          </div>
                          <span style={{ fontSize:10, color:'#64748b', lineHeight:1.4 }}>{lang==='en'&&tpl.descEn?tpl.descEn:tpl.desc}</span>
                          <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                            <span style={{ fontSize:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, padding:'1px 5px', color:'#94a3b8' }}>{s.fontFamily}</span>
                            {s.gradientEnabled&&<span style={{ fontSize:9, background:'rgba(167,139,250,0.1)', border:'1px solid rgba(167,139,250,0.3)', borderRadius:4, padding:'1px 5px', color:'#a78bfa' }}>gradient</span>}
                            {s.shadowEnabled&&<span style={{ fontSize:9, background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)', borderRadius:4, padding:'1px 5px', color:'#fbbf24' }}>glow</span>}
                          </div>
                        </div>
                        <button onClick={()=>applyTemplate(tpl)}
                          style={{ margin:'4px 12px 12px', padding:'7px 0', borderRadius:9, cursor:'pointer', background:`${tpl.accent}20`, border:`1px solid ${tpl.accent}55`, color:tpl.accent, fontWeight:800, fontSize:12 }}
                          onMouseEnter={e=>{e.currentTarget.style.background=`${tpl.accent}45`;e.currentTarget.style.color='#fff';}}
                          onMouseLeave={e=>{e.currentTarget.style.background=`${tpl.accent}20`;e.currentTarget.style.color=tpl.accent;}}
                        >✓ {t('tpl_use')}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* ── Stickers ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={stickerBtnRef}
            onClick={()=>{ const rect=stickerBtnRef.current?.getBoundingClientRect(); if(rect) setStickerPanelPos({top:rect.bottom+4,left:Math.min(rect.left,window.innerWidth-372)}); setShowStickerPanel(v=>!v); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showStickerPanel?'rgba(251,191,36,0.18)':'transparent', border:`1px solid ${showStickerPanel?'rgba(251,191,36,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showStickerPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showStickerPanel)e.currentTarget.style.background='transparent'}}
          >
            <span style={{fontSize:14}}>✨</span> Stickers {stickers.length>0&&<span style={{background:'#fbbf24',color:'#000',borderRadius:6,padding:'0 5px',fontSize:10,fontWeight:900,marginLeft:2}}>{stickers.length}</span>}
          </button>
          {showStickerPanel && createPortal(
            <div data-sticker-portal onClick={e=>e.stopPropagation()} style={{ position:'fixed', top:stickerPanelPos.top, left:stickerPanelPos.left, zIndex:99999, background:'#111827', border:'1px solid rgba(251,191,36,0.25)', borderRadius:18, width:360, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', maxHeight:'80vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'12px 16px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:800, fontSize:14, color:'#fbbf24' }}>✨ Stickers</span>
                <button onClick={()=>setShowStickerPanel(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>✕</button>
              </div>
              <div style={{ display:'flex', gap:6, padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                {[['emoji',`😀 Emojis`],['sticker',`✨ Animados`]].map(([tab,label])=>(
                  <button key={tab} onClick={()=>setStickerTab(tab)} style={{ padding:'4px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, background:stickerTab===tab?'#fbbf24':'rgba(255,255,255,0.06)', color:stickerTab===tab?'#000':'#888' }}>
                    {label}
                  </button>
                ))}
              </div>
              <div style={{ overflowY:'auto', flex:1, padding:8 }}>
                {stickerTab==='emoji'&&(
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:4 }}>
                    {EMOJI_LIST.flat().map((em, idx) => (
                      <button key={`${em}_${idx}`} onClick={()=>addSticker('emoji',em,null)}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:'5px 2px', fontSize:22, cursor:'pointer', lineHeight:1, width:'100%', aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.1s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(251,191,36,0.15)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      >{em}</button>
                    ))}
                  </div>
                )}
                {stickerTab==='sticker'&&(
                  <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                    {ANIMATED_STICKERS.map(stk=>(
                      <button key={stk.key} onClick={()=>addSticker('sticker',stk.emoji,stk.anim)}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:11, padding:'7px 5px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, width:64, transition:'background 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(251,191,36,0.15)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      >
                        <span style={{fontSize:24}}>{stk.emoji}</span>
                        <span style={{fontSize:9,color:'#888',fontWeight:700}}>{stk.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {stickers.length>0&&(
                <div style={{ padding:'8px 12px', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'flex-end' }}>
                  <button onClick={()=>{ setStickers([]); setActiveStickerId(null); }} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'3px 10px', fontSize:10, color:'#f87171', fontWeight:700, cursor:'pointer' }}>{t('stk_clear_all')}</button>
                </div>
              )}
            </div>,
            document.body
          )}
        </div>

        {/* ── Sons (SFX) ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={sfxBtnRef}
            onClick={()=>{ const rect=sfxBtnRef.current?.getBoundingClientRect(); if(rect) setSfxPanelPos({top:rect.bottom+4,left:Math.min(rect.left,window.innerWidth-380)}); setShowSfxPanel(v=>!v); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showSfxPanel?'rgba(16,185,129,0.18)':'transparent', border:`1px solid ${showSfxPanel?'rgba(16,185,129,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showSfxPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showSfxPanel)e.currentTarget.style.background='transparent'}}
          >
            <span style={{fontSize:14}}>🔊</span> {t('ed_sfx')} {soundEffects.length>0&&<span style={{background:'#10b981',color:'#000',borderRadius:6,padding:'0 5px',fontSize:10,fontWeight:900,marginLeft:2}}>{soundEffects.length}</span>}
          </button>
          {showSfxPanel && createPortal(
            <div data-sfx-portal onClick={e=>e.stopPropagation()} style={{ position:'fixed', top:sfxPanelPos.top, left:sfxPanelPos.left, zIndex:99999, background:'#0f172a', border:'1px solid rgba(16,185,129,0.25)', borderRadius:18, width:400, maxHeight:'82vh', boxShadow:'0 16px 48px rgba(0,0,0,0.8)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'12px 16px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:800, fontSize:13, color:'#10b981' }}>{t('sfx_title')} <span style={{fontSize:10,opacity:0.6,fontWeight:400}}>{t('sfx_count')}</span></span>
                <button onClick={()=>setShowSfxPanel(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>✕</button>
              </div>
              <div style={{ overflowY:'auto', flex:1, padding:'10px 12px' }}>
                {SFX_CATS.map(cat => (
                  <div key={cat.cat} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color: cat.color, letterSpacing:'0.6px', marginBottom:6, opacity:0.85 }}>{cat.cat}</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:5 }}>
                      {cat.items.map(sfx => (
                        <button key={sfx.key}
                          title={sfx.name}
                          onClick={()=>{
                            const t=virtualTimeRef.current;
                            pushHistory(); setSoundEffects(prev=>[...prev,{id:Date.now()+Math.random(),key:sfx.key,name:sfx.name,emoji:sfx.emoji,startTime:parseFloat(t.toFixed(2)),volume:1}]);
                          }}
                          style={{ background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.08)`, borderRadius:9, padding:'7px 3px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, width:'100%', boxSizing:'border-box', transition:'all 0.12s' }}
                          onMouseEnter={e=>{ e.currentTarget.style.background=`${cat.color}22`; e.currentTarget.style.borderColor=`${cat.color}55`; }}
                          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}
                        >
                          <span style={{fontSize:18,lineHeight:1}}>{sfx.emoji}</span>
                          <span style={{fontSize:8,color:'#aaa',fontWeight:600,textAlign:'center',lineHeight:1.2,wordBreak:'break-word',maxWidth:'100%',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'0 2px'}}>{sfx.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {soundEffects.length>0&&(
                <div style={{ padding:'8px 12px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', gap:4, maxHeight:140, overflowY:'auto' }}>
                  {soundEffects.map(sfx=>(
                    <div key={sfx.id} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'4px 8px' }}>
                      <span style={{fontSize:16}}>{sfx.emoji||SFX_LIST.find(s=>s.key===sfx.key)?.emoji||'🔊'}</span>
                      <span style={{fontSize:11,color:'#ccc',fontWeight:600,flex:1}}>{sfx.name||SFX_LIST.find(s=>s.key===sfx.key)?.name||sfx.key}</span>
                      <span style={{fontSize:10,color:'#10b981',minWidth:36}}>{sfx.startTime?.toFixed(1)}s</span>
                      <input type="range" min={0.1} max={2} step={0.1} value={sfx.volume} title={`Volume: ${Math.round(sfx.volume*100)}%`}
                        onChange={e=>setSoundEffects(prev=>prev.map(s=>s.id===sfx.id?{...s,volume:Number(e.target.value)}:s))}
                        style={{width:60,accentColor:'#10b981',cursor:'pointer'}} />
                      <span style={{fontSize:9,color:'#555',minWidth:28}}>{Math.round(sfx.volume*100)}%</span>
                      <button onClick={()=>setSoundEffects(prev=>prev.filter(s=>s.id!==sfx.id))} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'2px 7px', fontSize:11, color:'#f87171', cursor:'pointer' }}>✕</button>
                    </div>
                  ))}
                  <button onClick={()=>{ pushHistory(); setSoundEffects([]); }} style={{ marginTop:4, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'4px 12px', fontSize:10, color:'#f87171', fontWeight:700, cursor:'pointer', width:'100%' }}>{t('sfx_remove_all')}</button>
                </div>
              )}
              {soundEffects.length===0&&<div style={{padding:'10px 16px 14px',fontSize:11,color:'#444',textAlign:'center'}}>{t('sfx_empty')}</div>}
            </div>,
            document.body
          )}
        </div>

        {/* ── Molduras ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={frameBtnRef}
            onClick={()=>{ const rect=frameBtnRef.current?.getBoundingClientRect(); if(rect) setFramePanelPos({top:rect.bottom+4,left:Math.min(rect.left,window.innerWidth-420)}); setShowFramePanel(v=>!v); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7,
              background:showFramePanel?'rgba(16,185,129,0.18)':'transparent',
              border:`1px solid ${showFramePanel?'rgba(16,185,129,0.5)':'transparent'}`,
              cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showFramePanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showFramePanel)e.currentTarget.style.background=showFramePanel?'rgba(16,185,129,0.18)':'transparent'}}
          >
            <span style={{fontSize:14}}>🖼</span> {t('frames_btn')} {frames.length>0&&<span style={{background:'#10b981',borderRadius:8,padding:'1px 5px',fontSize:9,color:'#000',fontWeight:900}}>{frames.length}</span>}
          </button>
          {showFramePanel && (() => {
            const FRAME_CATALOG = [
              { style:'solid',       label:'Sólida',         icon:'⬜', desc:'Borda simples' },
              { style:'solid',       label:'Arredondada',    icon:'🔘', desc:'Cantos suaves', cornerRadius:30 },
              { style:'double',      label:'Dupla',          icon:'⏹', desc:'Duas bordas' },
              { style:'dashed',      label:'Tracejada',      icon:'▭',  desc:'Linha tracejada' },
              { style:'dotted',      label:'Pontilhada',     icon:'··', desc:'Pontos' },
              { style:'corners',     label:'Cantos',         icon:'⌐',  desc:'Apenas cantos' },
              { style:'corners_round',label:'Cantos Curvos', icon:'⌒',  desc:'Cantos arredondados' },
              { style:'neon',        label:'Neon',           icon:'💡', desc:'Brilho neon', color:'#00BFFF' },
              { style:'neon_double', label:'Neon Duplo',     icon:'🌈', desc:'Dois neons', color:'#00BFFF', color2:'#ff00ff' },
              { style:'gradient',    label:'Gradiente',      icon:'🌅', desc:'Cor degradê', color:'#a78bfa', color2:'#00bfff' },
              { style:'film',        label:'Tira de Filme',  icon:'🎬', desc:'Estilo filme' },
              { style:'polaroid',    label:'Polaroid',       icon:'📷', desc:'Estilo foto' },
              { style:'art_deco',    label:'Art Déco',       icon:'✦',  desc:'Ornamental' },
              { style:'vintage',     label:'Vintage',        icon:'🎞', desc:'Dupla tracejada' },
              { style:'shadow',      label:'Sombra',         icon:'🌑', desc:'Sombra suave' },
              { style:'glitch_frame',label:'Glitch',         icon:'📺', desc:'Frame glitchado', color:'#00ffcc' },
            ];
            const addFrame = (tmpl) => {
              const canvas = canvasRef.current;
              const cw = canvas?.width||720, ch = canvas?.height||1280;
              const w = Math.round(cw*0.7), h = Math.round(ch*0.5);
              pushHistory();
              const newFrame = {
                id: Date.now()+Math.random(), style: tmpl.style,
                x: Math.round((cw-w)/2), y: Math.round((ch-h)/2),
                width: w, height: h, color: tmpl.color||'#ffffff',
                color2: tmpl.color2||null, thickness: 8, opacity: 1,
                rotation: 0, cornerRadius: tmpl.cornerRadius||0,
              };
              setFrames(prev=>[...prev, newFrame]);
              setActiveFrameId(newFrame.id);
              setShowFramePanel(false);
            };
            return createPortal(
              <div onClick={e=>e.stopPropagation()} style={{ position:'fixed', top:framePanelPos.top, left:framePanelPos.left,
                zIndex:99999, background:'#0d1117', border:'1px solid rgba(16,185,129,0.3)',
                borderRadius:18, width:415, maxHeight:'80vh', boxShadow:'0 20px 60px rgba(0,0,0,0.85)',
                display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'12px 16px 10px', borderBottom:'1px solid rgba(255,255,255,0.06)',
                  display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontWeight:800, fontSize:15, color:'#10b981' }}>{t('frames_title')}</span>
                    {frames.length>0&&<span style={{ fontSize:10, background:'rgba(16,185,129,0.2)', border:'1px solid rgba(16,185,129,0.4)', borderRadius:20, padding:'2px 8px', color:'#10b981' }}>{frames.length} {frames.length>1?t('frames_active_many'):t('frames_active_one')}</span>}
                  </div>
                  <button onClick={()=>setShowFramePanel(false)} style={{ background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:18,lineHeight:1 }}>✕</button>
                </div>
                <div style={{ padding:'12px', overflowY:'auto', flex:1 }}>
                  <div style={{ fontSize:10, color:'#555', fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:8 }}>Adicionar moldura</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:14 }}>
                    {FRAME_CATALOG.map((tmpl,i)=>(
                      <div key={i} onClick={()=>addFrame(tmpl)}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'9px 6px 7px',
                          borderRadius:10, cursor:'pointer', background:'rgba(255,255,255,0.03)',
                          border:'1px solid rgba(255,255,255,0.07)', transition:'all 0.15s' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(16,185,129,0.1)';e.currentTarget.style.borderColor='rgba(16,185,129,0.35)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';}}
                      >
                        <div style={{ width:'100%', height:38, borderRadius:7, background:'rgba(255,255,255,0.04)',
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
                          border:'1px solid rgba(255,255,255,0.06)' }}>{tmpl.icon}</div>
                        <span style={{ fontSize:9, color:'#aaa', fontWeight:600, textAlign:'center', lineHeight:1.2 }}>{tmpl.label}</span>
                      </div>
                    ))}
                  </div>
                  {frames.length>0&&(
                    <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12 }}>
                      <div style={{ fontSize:10, color:'#555', fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:8 }}>Molduras no projeto</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        {frames.map((fr,fi)=>{
                          const isAct=activeFrameId===fr.id;
                          return(
                            <div key={fr.id} onClick={()=>setActiveFrameId(fr.id)}
                              style={{ background:isAct?'rgba(16,185,129,0.1)':'rgba(255,255,255,0.02)',
                                border:`1px solid ${isAct?'rgba(16,185,129,0.4)':'rgba(255,255,255,0.06)'}`,
                                borderRadius:10, padding:'8px 10px', display:'flex', flexDirection:'column', gap:7, cursor:'pointer' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <span style={{ fontSize:11, color:'#10b981', fontWeight:700, flex:1 }}>{t('frames_label')} {fi+1} — {fr.style}</span>
                                <button onClick={e=>{e.stopPropagation();pushHistory();setFrames(prev=>prev.filter(f=>f.id!==fr.id));if(activeFrameId===fr.id)setActiveFrameId(null);}}
                                  style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:7,padding:'2px 8px',fontSize:11,color:'#f87171',cursor:'pointer' }}>{t('frames_remove')}</button>
                              </div>
                              {isAct&&(
                                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    <span style={{ fontSize:10, color:'#666', minWidth:60 }}>{t('frames_color')}</span>
                                    <input type="color" value={fr.color||'#ffffff'}
                                      onChange={e=>setFrames(prev=>prev.map(f=>f.id===fr.id?{...f,color:e.target.value}:f))}
                                      style={{ width:28,height:28,padding:0,border:'none',background:'none',cursor:'pointer',borderRadius:6 }} />
                                    {(fr.style==='gradient'||fr.style==='neon_double')&&<>
                                      <span style={{ fontSize:10, color:'#666' }}>{t('frames_color2')}</span>
                                      <input type="color" value={fr.color2||'#00bfff'}
                                        onChange={e=>setFrames(prev=>prev.map(f=>f.id===fr.id?{...f,color2:e.target.value}:f))}
                                        style={{ width:28,height:28,padding:0,border:'none',background:'none',cursor:'pointer',borderRadius:6 }} />
                                    </>}
                                  </div>
                                  {[
                                    {label:t('frames_thickness'),min:1,max:40,step:1,key:'thickness',unit:'px',def:8,accent:'#10b981'},
                                    {label:t('frames_opacity'),min:0,max:1,step:0.01,key:'opacity',unit:'%',def:1,accent:'#10b981',fmt:v=>Math.round(v*100)+'%'},
                                    {label:t('frames_rotation'),min:-180,max:180,step:1,key:'rotation',unit:'°',def:0,accent:'#10b981',fmt:v=>v+'°'},
                                  ].map(({label,min,max,step,key,def,accent,fmt})=>(
                                    <div key={key} style={{ display:'flex', alignItems:'center', gap:8 }}>
                                      <span style={{ fontSize:10, color:'#666', minWidth:60 }}>{label}</span>
                                      <input type="range" min={min} max={max} step={step} value={fr[key]??def}
                                        onChange={e=>setFrames(prev=>prev.map(f=>f.id===fr.id?{...f,[key]:+e.target.value}:f))}
                                        onMouseDown={ev=>ev.stopPropagation()} onPointerDown={ev=>ev.stopPropagation()}
                                        style={{ flex:1, accentColor:accent, height:3 }} />
                                      <span style={{ fontSize:10, color:accent, minWidth:30, textAlign:'right' }}>{fmt?fmt(fr[key]??def):(fr[key]??def)}</span>
                                    </div>
                                  ))}
                                  {fr.style==='solid'&&(
                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                      <span style={{ fontSize:10, color:'#666', minWidth:60 }}>{t('frames_corners')}</span>
                                      <input type="range" min={0} max={200} value={fr.cornerRadius||0}
                                        onChange={e=>setFrames(prev=>prev.map(f=>f.id===fr.id?{...f,cornerRadius:+e.target.value}:f))}
                                        onMouseDown={ev=>ev.stopPropagation()} onPointerDown={ev=>ev.stopPropagation()}
                                        style={{ flex:1, accentColor:'#10b981', height:3 }} />
                                      <span style={{ fontSize:10, color:'#10b981', minWidth:30, textAlign:'right' }}>{fr.cornerRadius||0}px</span>
                                    </div>
                                  )}
                                  <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:2 }}>
                                    <span style={{ fontSize:10, color:'#555', alignSelf:'center', marginRight:2 }}>{t('frames_size')}</span>
                                    {[[t('frames_fullscreen'),'full'],[t('frames_square'),'square'],['16:9','wide'],['9:16','tall']].map(([lbl,preset])=>(
                                      <button key={preset} onClick={e=>{
                                        e.stopPropagation();
                                        const cv=canvasRef.current;
                                        const cw=cv?.width||720,ch=cv?.height||1280;
                                        let nw,nh;
                                        if(preset==='full'){nw=cw;nh=ch;}
                                        else if(preset==='square'){const s=Math.min(cw,ch)*0.8;nw=s;nh=s;}
                                        else if(preset==='wide'){nw=cw*0.9;nh=nw*9/16;}
                                        else{nh=ch*0.85;nw=nh*9/16;}
                                        setFrames(prev=>prev.map(f=>f.id===fr.id?{...f,x:Math.round((cw-nw)/2),y:Math.round((ch-nh)/2),width:Math.round(nw),height:Math.round(nh)}:f));
                                      }}
                                        style={{ fontSize:9,padding:'2px 7px',borderRadius:5,cursor:'pointer',fontWeight:600,
                                          background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',color:'#10b981' }}>
                                        {lbl}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <button onClick={()=>{pushHistory();setFrames([]);setActiveFrameId(null);}}
                          style={{ marginTop:2,background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.2)',
                            borderRadius:8,padding:'5px 0',fontSize:11,color:'#f87171',cursor:'pointer',width:'100%',fontWeight:700 }}>
                          {t('frames_remove_all')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>,
              document.body
            );
          })()}
        </div>

        {/* ── Visual (Efeitos + Cor) ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={fxBtnRef}
            onClick={()=>setShowFxPanel(v=>!v)}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showFxPanel||screenEffect!=='none'?'rgba(167,139,250,0.18)':'transparent', border:`1px solid ${showFxPanel||screenEffect!=='none'?'rgba(167,139,250,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showFxPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showFxPanel)e.currentTarget.style.background=showFxPanel||screenEffect!=='none'?'rgba(167,139,250,0.18)':'transparent'}}
          >
            <span style={{fontSize:14}}>🎬</span> Efeitos {screenEffect!=='none'&&<span style={{background:'#a78bfa',borderRadius:4,width:6,height:6,display:'inline-block',marginLeft:2}} />}
          </button>
          {showFxPanel && (() => {
            const rect2 = fxBtnRef.current?.getBoundingClientRect();
            const FX_CATS = [
              { cat:'✨ Populares', items:[
                { id:'none',       label:'Nenhum',      icon:'🔲', preview:'#111' },
                { id:'vignette',   label:'Vinheta',     icon:'🌑', preview:'radial-gradient(#111,#000)' },
                { id:'film_grain', label:'Grão Filme',  icon:'📽️', preview:'#1a1a1a' },
                { id:'old_film',   label:'Filme Antigo',icon:'🎞️', preview:'linear-gradient(135deg,#3a2a0a,#1a1200)' },
                { id:'bokeh',      label:'Bokeh',       icon:'🔮', preview:'radial-gradient(#1a1a3a,#000)' },
                { id:'sparkles',   label:'Faíscas',     icon:'⭐', preview:'linear-gradient(135deg,#1a1a00,#0a0a0a)' },
              ]},
              { cat:'⚡ Ação', items:[
                { id:'shockwave',  label:'Shockwave',   icon:'💥', preview:'radial-gradient(#1a1a2a,#000)' },
                { id:'speed_lines',label:'Velocidade',  icon:'🏎️', preview:'radial-gradient(#1a1a1a,#000)' },
                { id:'zoom_blur',  label:'Zoom Blur',   icon:'🔍', preview:'radial-gradient(#111,#000)' },
                { id:'shake',      label:'Tremor',      icon:'📳', preview:'#111' },
                { id:'lightning',  label:'Raios',       icon:'⚡', preview:'linear-gradient(135deg,#0a0a1a,#000)' },
                { id:'confetti',   label:'Confete',     icon:'🎉', preview:'linear-gradient(135deg,#1a0a0a,#0a1a0a)' },
              ]},
              { cat:'🎨 Estilo', items:[
                { id:'duotone',    label:'Duotone',     icon:'🎭', preview:'linear-gradient(135deg,#1a003a,#003a1a)' },
                { id:'hologram',   label:'Holograma',   icon:'👾', preview:'linear-gradient(#001a1a,#000)' },
                { id:'retrowave',  label:'RetroWave',   icon:'🌅', preview:'linear-gradient(#1a003a,#3a0066)' },
                { id:'neon_glow',  label:'Neon',        icon:'💜', preview:'radial-gradient(#1a001a,#000)' },
                { id:'neon_lines', label:'Neon Lines',  icon:'🌈', preview:'linear-gradient(135deg,#001a1a,#1a001a)' },
                { id:'cyberpunk',  label:'Cyberpunk',   icon:'🟢', preview:'linear-gradient(#001a0a,#000)' },
              ]},
              { cat:'📺 Glitch', items:[
                { id:'glitch_pro', label:'Glitch Pro',  icon:'📺', preview:'#0a0a0a' },
                { id:'glitch',     label:'Glitch',      icon:'⚡', preview:'#0a0a0a' },
                { id:'pixel_sort', label:'Pixel Sort',  icon:'🔀', preview:'linear-gradient(135deg,#001a1a,#1a0010)' },
                { id:'vhs',        label:'VHS',         icon:'📼', preview:'#0a0a0a' },
                { id:'tv_static',  label:'TV Estático', icon:'📡', preview:'#0a0a0a' },
                { id:'mirror',     label:'Espelho',     icon:'🪞', preview:'linear-gradient(#0a0a0a,#1a1a1a)' },
              ]},
              { cat:'🌊 Natureza', items:[
                { id:'rain',       label:'Chuva',       icon:'🌧️', preview:'linear-gradient(#000d1a,#001530)' },
                { id:'fire',       label:'Fogo',        icon:'🔥', preview:'linear-gradient(#0a0000,#1a0500)' },
                { id:'smoke',      label:'Fumaça',      icon:'💨', preview:'linear-gradient(#0a0a0a,#1a1a1a)' },
                { id:'snow',       label:'Neve',        icon:'❄️', preview:'linear-gradient(#05050f,#0a0a20)' },
                { id:'night',      label:'Noite',       icon:'🌌', preview:'linear-gradient(#00020e,#000420)' },
                { id:'aurora',     label:'Aurora',      icon:'🌈', preview:'linear-gradient(#001a0a,#0a001a)' },
              ]},
              { cat:'🔵 Overlay', items:[
                { id:'particles',  label:'Partículas',  icon:'✨', preview:'#050510' },
                { id:'matrix',     label:'Matrix',      icon:'💚', preview:'#000a00' },
                { id:'vintage',    label:'Vintage',     icon:'🟤', preview:'linear-gradient(#1a0f00,#0f0800)' },
                { id:'ice',        label:'Gelo',        icon:'❄️', preview:'linear-gradient(#050f1a,#0a1520)' },
                { id:'blur_fx',    label:'Desfoque',    icon:'🌫️', preview:'#0a0a0a' },
                { id:'film_grain', label:'Grão',        icon:'📽️', preview:'#1a1a1a' },
              ]},
            ];
            return createPortal(
              <div style={{ position:'fixed', top:(rect2?.bottom??52)+4, left:Math.max(8,(rect2?.left??0)), zIndex:99999, background:'#0d1117', border:'1px solid rgba(167,139,250,0.25)', borderRadius:18, width:400, maxHeight:'82vh', boxShadow:'0 24px 64px rgba(0,0,0,0.85)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
                <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
                  <div>
                    <span style={{ fontWeight:800, fontSize:15, color:'#a78bfa' }}>{t('fx_title')}</span>
                    {screenEffect!=='none'&&<span style={{ marginLeft:8, fontSize:10, background:'rgba(167,139,250,0.2)', border:'1px solid rgba(167,139,250,0.4)', borderRadius:20, padding:'2px 8px', color:'#a78bfa' }}>{t('fx_active')}</span>}
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    {screenEffect!=='none'&&<button onClick={()=>{ pushHistory(); setScreenEffect('none'); }} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'3px 10px', color:'#f87171', fontSize:10, cursor:'pointer', fontWeight:700 }}>{t('fx_remove')}</button>}
                    <button onClick={()=>setShowFxPanel(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:18, lineHeight:1 }}>✕</button>
                  </div>
                </div>
                <div style={{ overflowY:'auto', flex:1, padding:'12px 12px 16px' }}>
                  {/* ── Overlays de Vídeo ─────────────────────────────── */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                      🎞️ Texturas & Overlays
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                      <button onClick={() => setActiveOverlay(null)}
                        style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid',
                          borderColor: !activeOverlay ? '#00BFFF' : 'rgba(255,255,255,0.12)',
                          background: !activeOverlay ? 'rgba(0,191,255,0.15)' : 'rgba(255,255,255,0.04)',
                          color: !activeOverlay ? '#00BFFF' : '#888', cursor: 'pointer' }}>
                        Nenhum
                      </button>
                      {OVERLAY_EFFECTS.map(ov => (
                        <button key={ov.id} onClick={() => setActiveOverlay(ov.id)}
                          style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, border: '1px solid',
                            borderColor: activeOverlay === ov.id ? '#00BFFF' : 'rgba(255,255,255,0.12)',
                            background: activeOverlay === ov.id ? 'rgba(0,191,255,0.15)' : 'rgba(255,255,255,0.04)',
                            color: activeOverlay === ov.id ? '#00BFFF' : '#ccc', cursor: 'pointer',
                            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span>{ov.icon}</span>{ov.name}
                        </button>
                      ))}
                    </div>
                    {activeOverlay && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>Opacidade</span>
                        <input type="range" min={0} max={1} step={0.05} value={overlayOpacity}
                          onChange={e => setOverlayOpacity(Number(e.target.value))}
                          style={{ flex: 1, accentColor: '#00BFFF' }} />
                        <span style={{ fontSize: 11, color: '#aaa', width: 32, textAlign: 'right' }}>
                          {Math.round(overlayOpacity * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 12px' }} />
                  {FX_CATS.map(cat => (
                    <div key={cat.cat} style={{ marginBottom:16 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#555', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:8, paddingLeft:2 }}>{cat.cat}</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7 }}>
                        {cat.items.map(fx => {
                          const isActive = screenEffect === fx.id;
                          return (
                            <div key={fx.id} onClick={()=>{ if(fx.id !== screenEffect){ pushHistory(); setScreenEffect(fx.id); } if(fx.id!=='none') setShowFxPanel(false); }}
                              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'10px 6px 8px', borderRadius:12, cursor:'pointer', background:isActive?'rgba(167,139,250,0.18)':'rgba(255,255,255,0.03)', border:`1px solid ${isActive?'rgba(167,139,250,0.6)':'rgba(255,255,255,0.07)'}`, transition:'all 0.15s', position:'relative' }}
                              onMouseEnter={e=>{ if(!isActive){e.currentTarget.style.background='rgba(167,139,250,0.08)';e.currentTarget.style.borderColor='rgba(167,139,250,0.3)';}}}
                              onMouseLeave={e=>{ e.currentTarget.style.background=isActive?'rgba(167,139,250,0.18)':'rgba(255,255,255,0.03)';e.currentTarget.style.borderColor=isActive?'rgba(167,139,250,0.6)':'rgba(255,255,255,0.07)';}}
                            >
                              <div style={{ width:'100%', height:44, borderRadius:8, background:fx.preview||'#111', marginBottom:2, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, border:'1px solid rgba(255,255,255,0.04)' }}>{fx.icon}</div>
                              <span style={{ fontSize:10, color:isActive?'#a78bfa':'#999', fontWeight:isActive?700:400, textAlign:'center', lineHeight:1.2 }}>{fx.label}</span>
                              {isActive&&<div style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'#a78bfa' }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>,
              document.body
            );
          })()}
        </div>

        {/* ── Cor & Curvas ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button onClick={()=>setShowKeyframePanel(v=>!v)}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showKeyframePanel?'rgba(251,191,36,0.18)':'transparent', border:`1px solid ${showKeyframePanel?'rgba(251,191,36,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showKeyframePanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showKeyframePanel)e.currentTarget.style.background=showKeyframePanel?'rgba(251,191,36,0.18)':'transparent'}}
          >
            <span style={{fontSize:13}}>🎨</span> {t('cc_btn')}
          </button>
          {showKeyframePanel && (() => {
            const r2 = fxBtnRef.current?.getBoundingClientRect();
            return createPortal(
              <div style={{ position:'fixed', top:(r2?.bottom??52)+4, right:16, zIndex:99999, background:'#0f172a', border:'1px solid rgba(251,191,36,0.3)', borderRadius:16, width:320, boxShadow:'0 20px 60px rgba(0,0,0,0.8)', padding:16, display:'flex', flexDirection:'column', gap:12 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:800, fontSize:14, color:'#fbbf24' }}>{t('cc_title')}</span>
                  <button onClick={()=>setShowKeyframePanel(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>✕</button>
                </div>
                <div>
                  <span style={{ fontSize:11, color:'#fbbf24', fontWeight:700, display:'block', marginBottom:6 }}>{t('cc_chroma_global')}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <input type="range" min={0} max={20} value={chromaAberration} onChange={e=>setChromaAberration(+e.target.value)} style={{ flex:1, accentColor:'#fbbf24', height:3 }} />
                    <span style={{ fontSize:10, color:chromaAberration>0?'#fbbf24':'#555', minWidth:24 }}>{chromaAberration}</span>
                    {chromaAberration>0&&<button onClick={()=>setChromaAberration(0)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:12 }}>↺</button>}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize:11, color:'#fbbf24', fontWeight:700, display:'block', marginBottom:6 }}>{t('cc_curves')}</span>
                  {[{key:'r',label:'R — Vermelho',color:'#f87171'},{key:'g',label:'G — Verde',color:'#4ade80'},{key:'b',label:'B — Azul',color:'#60a5fa'},{key:'midtone',label:'Meios-tons',color:'#fbbf24'},{key:'shadows',label:'Sombras',color:'#94a3b8'},{key:'highlights',label:'Altas Luzes',color:'#fff'}].map(({key,label,color})=>{
                    const def=key==='r'||key==='g'||key==='b'||key==='midtone'?1:0;
                    const min2=key==='shadows'||key==='highlights'?-0.3:0.2;
                    const max2=key==='shadows'||key==='highlights'?0.3:2.0;
                    const val=colorCurves[key]??def;
                    const changed=Math.abs(val-def)>0.01;
                    return (
                      <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:10, color:changed?color:'#555', minWidth:80, fontWeight:changed?700:400 }}>{label}</span>
                        <input type="range" min={min2} max={max2} step={0.01} value={val} onChange={e=>setColorCurves(prev=>({...prev,[key]:+e.target.value}))} style={{ flex:1, accentColor:color, height:3 }} />
                        <span style={{ fontSize:10, color:changed?color:'#555', minWidth:32, textAlign:'right' }}>{val.toFixed(2)}</span>
                        {changed&&<button onClick={()=>setColorCurves(prev=>({...prev,[key]:def}))} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:12, padding:0 }}>↺</button>}
                      </div>
                    );
                  })}
                  <button onClick={()=>setColorCurves({r:1,g:1,b:1,midtone:1,shadows:0,highlights:0})} style={{ marginTop:4, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:8, padding:'3px 12px', fontSize:10, color:'#fbbf24', cursor:'pointer', width:'100%' }}>{t('cc_reset')}</button>
                </div>
              </div>,
              document.body
            );
          })()}
        </div>

        {/* Divisor */}
        <div style={{ width:1, height:28, background:'rgba(255,255,255,0.07)', flexShrink:0, marginLeft:4 }} />

        {/* ── Formato de Canvas ── */}
        <select value={canvasFormat} onChange={e=>setCanvasFormat(e.target.value)} style={{ backgroundColor:'transparent', color:'#999', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 8px', fontSize:11, cursor:'pointer', flexShrink:0 }}>
          {Object.entries(CANVAS_FORMATS).map(([key,val])=>(
            <option key={key} value={key} style={{background:'#111'}}>{key} — {val.width}×{val.height}</option>
          ))}
        </select>

        {/* Spacer */}
        <div style={{ flex:1 }} />

        {/* ── Undo / Redo ── */}
        <div style={{ display:'flex', alignItems:'center', gap:2, flexShrink:0 }}>
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Desfazer (Ctrl+Z)"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:7, background:'transparent', border:'1px solid transparent', cursor:canUndo?'pointer':'not-allowed', color:canUndo?'#a78bfa':'#333', fontSize:14, transition:'all 0.15s', flexShrink:0 }}
            onMouseEnter={e=>{ if(canUndo){ e.currentTarget.style.background='rgba(167,139,250,0.1)'; e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'; }}}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}
          >↩</button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Refazer (Ctrl+Y)"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:7, background:'transparent', border:'1px solid transparent', cursor:canRedo?'pointer':'not-allowed', color:canRedo?'#a78bfa':'#333', fontSize:14, transition:'all 0.15s', flexShrink:0 }}
            onMouseEnter={e=>{ if(canRedo){ e.currentTarget.style.background='rgba(167,139,250,0.1)'; e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'; }}}
            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}
          >↪</button>
        </div>

        {/* ── Limpar tudo ── */}
        <button
          onClick={handleClearProject}
          style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:'transparent', border:'1px solid transparent', cursor:'pointer', color:'#f87171', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s', flexShrink:0 }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor='rgba(239,68,68,0.25)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}
        >
          <span style={{fontSize:13}}>🗑️</span> {t('ed_clear_project').replace(/^🗑️\s*/,'')}
        </button>

        {/* ── Projeto ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={projetoBtnRef}
            onClick={()=>{ setShowProjetoPanel(v=>!v); setShowExportPanel(false); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showProjetoPanel?'rgba(255,255,255,0.12)':'transparent', border:`1px solid ${showProjetoPanel?'rgba(255,255,255,0.2)':'transparent'}`, cursor:'pointer', color:'#888', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showProjetoPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showProjetoPanel)e.currentTarget.style.background='transparent'}}
          >
            <span style={{fontSize:13}}>📁</span> Projeto <span style={{fontSize:9,opacity:0.6}}>▾</span>
          </button>
          {showProjetoPanel && createPortal(
            <>
              <div onClick={()=>setShowProjetoPanel(false)} style={{position:'fixed',inset:0,zIndex:99997}} />
              <div style={{ position:'fixed', top:(projetoBtnRef.current?.getBoundingClientRect().bottom??52)+4, right:Math.max(8,window.innerWidth-(projetoBtnRef.current?.getBoundingClientRect().right??200)), zIndex:99998, background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, width:220, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', overflow:'hidden', padding:'6px 0' }}>
                <div style={{padding:'8px 14px 4px',fontSize:10,color:'#555',fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase'}}>Projeto</div>
                {[
                  { icon:'💾', label:t('ed_export_project'), color:'#00BFFF',  action: exportProject },
                  { icon:'📂', label:t('ed_import_project'), color:'#888',     action:()=>{ importInputRef.current?.click(); setShowProjetoPanel(false); } },
                ].map(item=>(
                  <div key={item.label} onClick={item.action}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', cursor:'pointer', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <span style={{fontSize:16}}>{item.icon}</span>
                    <span style={{fontSize:12,color:item.color,fontWeight:500}}>{item.label}</span>
                  </div>
                ))}
              </div>
            </>,
            document.body
          )}
        </div>

        {/* ── Exportar ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={exportBtnRef}
            onClick={()=>{ setShowExportPanel(v=>!v); setShowProjetoPanel(false); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:7, background:showExportPanel?'rgba(0,191,255,0.22)':'rgba(0,191,255,0.1)', border:`1px solid ${showExportPanel?'rgba(0,191,255,0.6)':'rgba(0,191,255,0.25)'}`, cursor:'pointer', color:'#00BFFF', fontSize:11, fontWeight:700, whiteSpace:'nowrap', transition:'all 0.15s' }}
          >
            <span style={{fontSize:13}}>⬇</span> Exportar <span style={{fontSize:9,opacity:0.7}}>▾</span>
          </button>
          {showExportPanel && createPortal(
            <>
              <div onClick={()=>setShowExportPanel(false)} style={{position:'fixed',inset:0,zIndex:99997}} />
              <div style={{ position:'fixed', top:(exportBtnRef.current?.getBoundingClientRect().bottom??52)+4, right:Math.max(8,window.innerWidth-(exportBtnRef.current?.getBoundingClientRect().right??100)), zIndex:99998, background:'#0f172a', border:'1px solid rgba(0,191,255,0.2)', borderRadius:14, width:260, boxShadow:'0 16px 48px rgba(0,0,0,0.85)', overflow:'hidden' }}>
                <div style={{padding:'12px 14px 8px',fontSize:10,color:'#555',fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>Formato de Saída</div>
                <div style={{padding:'8px 10px', display:'flex', flexDirection:'column', gap:4}}>
                  {[
                    {value:'webm_offline_audio', label:'🎬 WebM com Áudio', desc:''},
                    {value:'mp4',                label:'🎬 MP4 HD',          desc:'Alta qualidade'},
                    {value:'webm_hd',            label:'✨ WebM HD+',        desc:'Alta qualidade'},
                    {value:'mp4_hd',             label:'✨ MP4 HD+',         desc:'Padrão'},
                    {value:'png',                label:'🖼️ PNG',             desc:'Imagem estática'},
                    {value:'jpg',                label:'🖼️ JPG',             desc:'Imagem estática'},
                  ].map(fmt=>(
                    <div key={fmt.value} onClick={()=>setExportFormat(fmt.value)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', borderRadius:8, cursor:'pointer', background:exportFormat===fmt.value?'rgba(0,191,255,0.12)':'transparent', border:`1px solid ${exportFormat===fmt.value?'rgba(0,191,255,0.35)':'transparent'}`, transition:'all 0.12s' }}
                      onMouseEnter={e=>{ if(exportFormat!==fmt.value) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e=>{ if(exportFormat!==fmt.value) e.currentTarget.style.background='transparent'; }}
                    >
                      <span style={{fontSize:12,color:exportFormat===fmt.value?'#00BFFF':'#ccc',fontWeight:exportFormat===fmt.value?700:400}}>{fmt.label}</span>
                      {fmt.desc&&<span style={{fontSize:9,color:'#555',background:'rgba(255,255,255,0.05)',padding:'1px 5px',borderRadius:4}}>{fmt.desc}</span>}
                    </div>
                  ))}
                </div>
                <div style={{padding:'8px 10px', borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                  {isExporting?(
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <div style={{width:'100%',height:5,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${Math.round(exportProgress*100)}%`,background:'#00BFFF',borderRadius:3,transition:'width 0.2s'}} />
                      </div>
                      <span style={{fontSize:11,color:'#00BFFF',fontWeight:700,textAlign:'center'}}>{t('ed_exporting')} {Math.round(exportProgress*100)}%</span>
                    </div>
                  ):(
                    <button onClick={()=>{ handleSave(); }} style={{ width:'100%', padding:'9px 0', background:'linear-gradient(135deg,#00BFFF,#0080ff)', border:'none', borderRadius:9, cursor:'pointer', fontWeight:800, fontSize:13, color:'#000', boxShadow:'0 4px 16px rgba(0,191,255,0.3)' }}>
                      ⬇ {t('ed_save')}
                    </button>
                  )}
                </div>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* ── inputs ocultos ── */}
        <input ref={bgInputRef}     type="file" onChange={handleImageChange}  accept="image/*"          style={{display:'none'}} />
        <input ref={imagesInputRef} type="file" onChange={handleImagesChange} accept="image/*" multiple style={{display:'none'}} />
        <input ref={audioInputRef}  type="file" onChange={handleAudioChange}  accept="audio/*"          style={{display:'none'}} />
        <input ref={videoInputRef}  type="file" onChange={handleVideoUpload}  accept="video/*" multiple style={{display:'none'}} />
        <input ref={fontInputRef}   type="file" accept=".ttf,.otf,.woff,.woff2" style={{display:'none'}} onChange={handleFontUpload} />
        <input ref={importInputRef} type="file" accept="application/json"       style={{display:'none'}} onChange={e=>importProjectFromFile(e.target.files[0])} />
        {/* ── Painel de Fundos (portal independente) ── */}
        {showBgPanel && (() => {
          const rect = bgBtnRef.current?.getBoundingClientRect() || {bottom:60,left:100};
          const applyGradient = (css) => {
            const cw = 720, ch = 1280;
            const c = document.createElement('canvas'); c.width = cw; c.height = ch;
            const ctx2 = c.getContext('2d');
            if (css.startsWith('linear')) {
              const stops = css.match(/#[a-fA-F0-9]{3,6}|rgba?\([^)]+\)/g) || [];
              const grad = ctx2.createLinearGradient(0, 0, cw * 0.3, ch);
              stops.forEach((c2, i) => grad.addColorStop(i / Math.max(1, stops.length - 1), c2));
              ctx2.fillStyle = grad;
            } else { ctx2.fillStyle = css; }
            ctx2.fillRect(0, 0, cw, ch);
            const dataUrl = c.toDataURL('image/jpeg', 0.95);
            setImageSrc(dataUrl);
            const img = new Image(); img.onload = () => setImage(img); img.src = dataUrl;
            setShowBgPanel(false);
          };
          const GRADIENTS = [
            { id:'g1',  label:'Noite',    css:'linear-gradient(160deg,#0a0a2e 0%,#1a0a3e 50%,#0d1b4b 100%)' },
            { id:'g2',  label:'Pôr Sol',  css:'linear-gradient(160deg,#ff6b6b 0%,#feca57 50%,#ff9ff3 100%)' },
            { id:'g3',  label:'Oceano',   css:'linear-gradient(160deg,#0575e6 0%,#021b79 100%)' },
            { id:'g4',  label:'Floresta', css:'linear-gradient(160deg,#134e5e 0%,#71b280 100%)' },
            { id:'g5',  label:'Fogo',     css:'linear-gradient(160deg,#f83600 0%,#f9d423 100%)' },
            { id:'g6',  label:'Aurora',   css:'linear-gradient(160deg,#00c3ff 0%,#7b2ff7 50%,#f64f59 100%)' },
            { id:'g7',  label:'Rosa Neon',css:'linear-gradient(160deg,#f953c6 0%,#b91d73 100%)' },
            { id:'g8',  label:'Menta',    css:'linear-gradient(160deg,#0ba360 0%,#3cba92 100%)' },
            { id:'g9',  label:'Carvão',   css:'linear-gradient(160deg,#232526 0%,#414345 100%)' },
            { id:'g10', label:'Roxo',     css:'linear-gradient(160deg,#4776e6 0%,#8e54e9 100%)' },
            { id:'g11', label:'Cobre',    css:'linear-gradient(160deg,#b79891 0%,#94716b 100%)' },
            { id:'g12', label:'Cyber',    css:'linear-gradient(160deg,#00f2fe 0%,#4facfe 50%,#0ef 100%)' },
            { id:'s1',  label:'Preto',    css:'#000000' },
            { id:'s2',  label:'Branco',   css:'#ffffff' },
            { id:'s3',  label:'Cinza',    css:'#1a1a2e' },
            { id:'s4',  label:'Azul',     css:'#0d1b2a' },
          ];
          return createPortal(
            <div data-bg-portal="true" style={{ position:'fixed', top:(rect.bottom)+4, left:Math.max(8,(rect.left||100)), zIndex:99999, background:'#0f172a', border:'1px solid rgba(0,191,255,0.25)', borderRadius:16, width:400, maxHeight:'80vh', boxShadow:'0 20px 60px rgba(0,0,0,0.85)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'12px 16px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:800, fontSize:14, color:'#00BFFF' }}>🎨 Fundos</span>
                <div style={{ display:'flex', gap:6 }}>
                  {[['gradients',t('bg_tab_gradients')],['unsplash',t('bg_tab_photos')],['generate',t('bg_tab_generate')]].map(([tab,label])=>(
                    <button key={tab} onClick={()=>setBgTab(tab)} style={{ padding:'4px 10px', borderRadius:7, border:'none', cursor:'pointer', fontSize:10, fontWeight:700, background:bgTab===tab?'#00BFFF':'rgba(255,255,255,0.06)', color:bgTab===tab?'#000':'#888' }}>{label}</button>
                  ))}
                  <button onClick={()=>setShowBgPanel(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>✕</button>
                </div>
              </div>
              <div style={{ overflowY:'auto', flex:1 }}>
                {bgTab==='gradients'&&(
                  <div style={{ padding:12, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
                    {GRADIENTS.map(g=>(
                      <div key={g.id} onClick={()=>applyGradient(g.css)}
                        style={{ aspectRatio:'9/16', background:g.css, borderRadius:8, cursor:'pointer', border:'2px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'flex-end', justifyContent:'center', padding:4, transition:'border-color 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,191,255,0.7)'}
                        onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}
                      ><span style={{fontSize:8,color:'rgba(255,255,255,0.7)',fontWeight:700}}>{g.label}</span></div>
                    ))}
                  </div>
                )}
                {bgTab==='unsplash'&&(
                  <div style={{ padding:12, display:'flex', flexDirection:'column', gap:10 }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <input value={bgSearch} onChange={e=>{setBgSearch(e.target.value);}}
                        onKeyDown={e=>e.key==='Enter'&&searchBgImages()}
                        placeholder={t('bg_search_placeholder')} style={{ flex:1, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'7px 10px', color:'#fff', fontSize:12 }} />
                      <button onClick={searchBgImages} disabled={bgSearchLoading} style={{ padding:'7px 14px', background:'rgba(0,191,255,0.15)', border:'1px solid rgba(0,191,255,0.3)', borderRadius:8, color:'#00BFFF', fontSize:12, cursor:'pointer', fontWeight:700 }}>
                        {bgSearchLoading?'...':t('bg_search_btn')}
                      </button>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, maxHeight:300, overflowY:'auto' }}>
                      {bgSearchResults.map(r=>(
                        <img key={r.id} src={r.thumb} onClick={()=>applyBgFromUrl(r.full)}
                          style={{ width:'100%', aspectRatio:'9/16', objectFit:'cover', borderRadius:6, cursor:'pointer', border:'2px solid transparent', transition:'border 0.15s' }}
                          onMouseEnter={e=>e.target.style.border='2px solid #00BFFF'}
                          onMouseLeave={e=>e.target.style.border='2px solid transparent'}
                          alt="" />
                      ))}
                    </div>
                  </div>
                )}
                {bgTab==='generate'&&(()=>{
                  const GEN_LIST = [
                    { id:'p1',  label:'Partículas',   preview:'radial-gradient(ellipse at 20% 30%,rgba(0,191,255,0.5) 0%,transparent 55%),#050510', gen:(c,w,h)=>{ c.fillStyle='#050510';c.fillRect(0,0,w,h);for(let i=0;i<300;i++){c.beginPath();c.arc(Math.random()*w,Math.random()*h,Math.random()*2.5+0.5,0,6.28);c.fillStyle=`rgba(0,191,255,${Math.random()*0.8+0.2})`;c.fill();} } },
                    { id:'p2',  label:'Grade Neon',   preview:'linear-gradient(180deg,#000 0%,#001200 100%)', gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);c.strokeStyle='rgba(0,255,100,0.3)';c.lineWidth=1;for(let x=0;x<w;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=0;y<h;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();} } },
                    { id:'p3',  label:'Bokeh',        preview:'radial-gradient(ellipse at 30% 40%,rgba(123,47,247,0.7) 0%,transparent 50%),#1a0533', gen:(c,w,h)=>{ const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#1a0533');g.addColorStop(1,'#0a1a4e');c.fillStyle=g;c.fillRect(0,0,w,h);for(let i=0;i<50;i++){const x=Math.random()*w,y=Math.random()*h,r=Math.random()*80+20;const cg=c.createRadialGradient(x,y,0,x,y,r);cg.addColorStop(0,`hsla(${Math.random()*80+200},80%,70%,${Math.random()*0.2+0.05})`);cg.addColorStop(1,'transparent');c.fillStyle=cg;c.beginPath();c.arc(x,y,r,0,6.28);c.fill();} } },
                    { id:'p4',  label:'Ondas',        preview:'linear-gradient(180deg,#000d1a 0%,#001a33 100%)', gen:(c,w,h)=>{ c.fillStyle='#000d1a';c.fillRect(0,0,w,h);for(let i=0;i<8;i++){c.beginPath();c.strokeStyle=`rgba(0,191,255,${0.05+i*0.05})`;c.lineWidth=2;for(let x=0;x<w;x+=2){const y2=h/2+Math.sin((x+i*50)/80)*60*(i+1)*0.3+i*30;x===0?c.moveTo(x,y2):c.lineTo(x,y2);}c.stroke();} } },
                    { id:'p5',  label:'Hexágonos',   preview:'linear-gradient(160deg,#0a0a1a 0%,#0a1040 100%)', gen:(c,w,h)=>{ c.fillStyle='#0a0a1a';c.fillRect(0,0,w,h);const s=50;for(let row=0;row<h/s+2;row++){for(let col=0;col<w/s+2;col++){const x2=col*s*1.5,y2=row*s*Math.sqrt(3)+(col%2)*s*Math.sqrt(3)/2;c.beginPath();for(let k=0;k<6;k++){const a2=Math.PI/3*k;c.lineTo(x2+s*0.45*Math.cos(a2),y2+s*0.45*Math.sin(a2));}c.closePath();c.strokeStyle='rgba(100,200,255,0.2)';c.lineWidth=1;c.stroke();}} } },
                    { id:'p6',  label:'Nebulosa',     preview:'radial-gradient(ellipse at 50% 50%,rgba(123,47,247,0.6) 0%,rgba(249,83,198,0.4) 40%,transparent 100%),#000', gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);const cs=['#7b2ff7','#f953c6','#00c3ff','#ff6b6b'];for(let i=0;i<8;i++){const x2=Math.random()*w,y2=Math.random()*h,r=Math.random()*250+100;const rg=c.createRadialGradient(x2,y2,0,x2,y2,r);rg.addColorStop(0,cs[i%4]+'44');rg.addColorStop(1,'transparent');c.fillStyle=rg;c.fillRect(0,0,w,h);} } },
                    { id:'p7',  label:'Aurora',       preview:'linear-gradient(180deg,#0a0a1a 0%,#0d2b1a 50%,#1a0a2e 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#050510');bg.addColorStop(1,'#0a1a0a');c.fillStyle=bg;c.fillRect(0,0,w,h);const bands=[{h:200,col:'#00ff88',alpha:0.18},{h:320,col:'#00bfff',alpha:0.14},{h:180,col:'#a855f7',alpha:0.16},{h:260,col:'#00ffcc',alpha:0.10}];bands.forEach((b,bi)=>{const ay=h*0.1+bi*(h*0.18);const ag=c.createLinearGradient(0,ay-80,0,ay+b.h);ag.addColorStop(0,'transparent');ag.addColorStop(0.35,b.col+Math.round(b.alpha*255).toString(16).padStart(2,'0'));ag.addColorStop(0.65,b.col+'22');ag.addColorStop(1,'transparent');c.fillStyle=ag;c.fillRect(0,ay-80,w,b.h+80);});for(let i=0;i<120;i++){c.beginPath();c.arc(Math.random()*w,Math.random()*h*0.6,Math.random()*1.5+0.3,0,6.28);c.fillStyle=`rgba(255,255,255,${Math.random()*0.7+0.1})`;c.fill();} } },
                    { id:'p8',  label:'Galáxia',      preview:'radial-gradient(ellipse at 50% 55%,rgba(100,60,200,0.8) 0%,rgba(20,10,60,0.9) 60%,#000 100%)', gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);for(let i=0;i<500;i++){const sx=Math.random()*w,sy=Math.random()*h,ss=Math.random()*1.8+0.2;c.beginPath();c.arc(sx,sy,ss,0,6.28);c.fillStyle=`rgba(255,255,255,${Math.random()*0.9+0.1})`;c.fill();}const cx=w/2,cy=h*0.52;for(let arm=0;arm<3;arm++){for(let i=0;i<200;i++){const t=i/200,angle=t*Math.PI*6+arm*(Math.PI*2/3),r=t*Math.min(w,h)*0.42,spread=(Math.random()-0.5)*60*t;const px=cx+Math.cos(angle)*(r+spread),py=cy+Math.sin(angle)*(r+spread)*0.55;c.beginPath();c.arc(px,py,Math.random()*2+0.5,0,6.28);c.fillStyle=`hsla(${220+arm*40},80%,75%,${0.6-t*0.3})`;c.fill();}}const cg=c.createRadialGradient(cx,cy,0,cx,cy,120);cg.addColorStop(0,'rgba(255,240,200,0.9)');cg.addColorStop(0.3,'rgba(200,150,255,0.4)');cg.addColorStop(1,'transparent');c.fillStyle=cg;c.fillRect(0,0,w,h); } },
                    { id:'p9',  label:'Lava',          preview:'linear-gradient(180deg,#1a0000 0%,#3d0000 50%,#1a0000 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0d0000');bg.addColorStop(0.5,'#1a0500');bg.addColorStop(1,'#0d0000');c.fillStyle=bg;c.fillRect(0,0,w,h);for(let i=0;i<30;i++){const bx=Math.random()*w,by=h*0.4+Math.random()*h*0.6,br=Math.random()*120+40;const bg2=c.createRadialGradient(bx,by,0,bx,by,br);bg2.addColorStop(0,`rgba(255,${60+Math.random()*80},0,0.55)`);bg2.addColorStop(0.5,`rgba(200,30,0,0.25)`);bg2.addColorStop(1,'transparent');c.fillStyle=bg2;c.fillRect(0,0,w,h);}const COL=Math.max(1,Math.floor(w/5));for(let col2=0;col2<COL;col2++){const nx=col2/COL,f1=Math.sin(nx*9.1)*0.4,f2=Math.sin(nx*17.3+1.2)*0.25,turb=0.5+(f1+f2)*0.5,bH=h*(0.12+turb*0.25),cx2=col2*(w/COL),cw2=w/COL*1.5;const fg=c.createLinearGradient(cx2,h,cx2,h-bH);fg.addColorStop(0,'rgba(255,255,180,0.85)');fg.addColorStop(0.2,'rgba(255,160,0,0.75)');fg.addColorStop(0.55,'rgba(220,40,0,0.45)');fg.addColorStop(1,'transparent');c.fillStyle=fg;c.beginPath();c.moveTo(cx2-cw2*0.1,h);c.quadraticCurveTo(cx2+cw2*0.4,h-bH*0.6,cx2+cw2/2,h-bH);c.quadraticCurveTo(cx2+cw2*0.7,h-bH*0.6,cx2+cw2*1.1,h);c.closePath();c.fill();} } },
                    { id:'p10', label:'Matrix',        preview:'linear-gradient(180deg,#000 0%,#001500 100%)', gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);const chars='アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';const cols=Math.floor(w/18);const drops=Array.from({length:cols},()=>Math.random()*h);for(let frame=0;frame<80;frame++){for(let i=0;i<cols;i++){const ch=chars[Math.floor(Math.random()*chars.length)];const x2=i*18,y2=drops[i];const alpha=Math.random()*0.8+0.2;c.font=`bold 14px monospace`;c.fillStyle=`rgba(0,255,${60+Math.random()*50},${alpha})`;c.fillText(ch,x2,y2);if(y2>h*0.7&&Math.random()>0.92)c.fillStyle=`rgba(180,255,180,${alpha})`;drops[i]=(drops[i]+14)%(h+14);}}const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(0,0,0,0.0)');grad.addColorStop(0.4,'rgba(0,0,0,0.0)');grad.addColorStop(1,'rgba(0,0,0,0.5)');c.fillStyle=grad;c.fillRect(0,0,w,h); } },
                    { id:'p11', label:'Cyberpunk',     preview:'linear-gradient(160deg,#0d0021 0%,#180033 50%,#0d0021 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#0d0021');bg.addColorStop(1,'#180033');c.fillStyle=bg;c.fillRect(0,0,w,h);const lines=[{col:'rgba(0,255,255,0.25)',lw:1.5},{col:'rgba(255,0,200,0.18)',lw:1},{col:'rgba(0,200,255,0.12)',lw:0.8}];lines.forEach((ln,li)=>{c.strokeStyle=ln.col;c.lineWidth=ln.lw;for(let i=0;i<6;i++){const x2=(i+li)*w/7;c.beginPath();c.moveTo(x2,0);c.lineTo(x2+(Math.random()-0.5)*60,h);c.stroke();}});for(let i=0;i<40;i++){const rx=Math.random()*w,ry=Math.random()*h,rw=Math.random()*80+20,rh=Math.random()*3+1;c.strokeStyle=`rgba(0,255,255,${Math.random()*0.15+0.03})`;c.lineWidth=rh;c.beginPath();c.moveTo(rx,ry);c.lineTo(rx+rw,ry);c.stroke();}const ng=c.createRadialGradient(w/2,h*0.8,0,w/2,h*0.8,w*0.7);ng.addColorStop(0,'rgba(255,0,200,0.2)');ng.addColorStop(0.4,'rgba(0,255,255,0.08)');ng.addColorStop(1,'transparent');c.fillStyle=ng;c.fillRect(0,0,w,h); } },
                    { id:'p12', label:'Mármore',       preview:'linear-gradient(135deg,#e8e0d5 0%,#c8bfb0 50%,#e8e0d5 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#f0ece6');bg.addColorStop(0.5,'#d4cdc4');bg.addColorStop(1,'#ece8e2');c.fillStyle=bg;c.fillRect(0,0,w,h);const drawVein=(sx,sy,length,angle,alpha,lw)=>{let x2=sx,y2=sy,a2=angle;c.beginPath();c.moveTo(x2,y2);for(let i=0;i<length;i++){a2+=(Math.random()-0.5)*0.3;x2+=Math.cos(a2)*3;y2+=Math.sin(a2)*3;c.lineTo(x2,y2);}c.strokeStyle=`rgba(80,65,55,${alpha})`;c.lineWidth=lw;c.stroke();};for(let i=0;i<25;i++){drawVein(Math.random()*w,Math.random()*h,80+Math.random()*150,Math.random()*Math.PI,0.06+Math.random()*0.08,0.8+Math.random()*1.5);}for(let i=0;i<8;i++){drawVein(Math.random()*w,Math.random()*h,200+Math.random()*300,Math.random()*Math.PI,0.04+Math.random()*0.05,0.4+Math.random()*0.8);}const sheen=c.createLinearGradient(0,0,w,h);sheen.addColorStop(0,'rgba(255,255,255,0.25)');sheen.addColorStop(0.4,'rgba(255,255,255,0.0)');sheen.addColorStop(1,'rgba(255,255,255,0.1)');c.fillStyle=sheen;c.fillRect(0,0,w,h); } },
                    { id:'p13', label:'Fogo',          preview:'linear-gradient(180deg,#000 0%,#1a0800 50%,#3d1500 100%)', gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);for(let layer=0;layer<3;layer++){const lh=h*(0.15+layer*0.08),lo=0.45-layer*0.12;const lg=c.createLinearGradient(0,h,0,h-lh);lg.addColorStop(0,`rgba(255,${40+layer*35},0,${lo})`);lg.addColorStop(0.6,`rgba(255,${90+layer*40},0,${lo*0.35})`);lg.addColorStop(1,'transparent');c.fillStyle=lg;c.fillRect(0,h-lh,w,lh);}const COLS=Math.max(1,Math.floor(w/4));for(let col=0;col<COLS;col++){const nx=col/COLS,f1=Math.sin(nx*8.7)*0.38,f2=Math.sin(nx*15.4+0.8)*0.28,f3=Math.sin(nx*6.1+2.0)*0.18,turb=0.5+(f1+f2+f3)*0.5,bH=h*(0.28+turb*0.35),cx=col*(w/COLS),cw=w/COLS*1.6;const fg=c.createLinearGradient(cx,h,cx,h-bH);fg.addColorStop(0,'rgba(255,255,180,0.9)');fg.addColorStop(0.12,'rgba(255,200,20,0.8)');fg.addColorStop(0.38,'rgba(255,80,0,0.6)');fg.addColorStop(0.65,'rgba(180,20,0,0.35)');fg.addColorStop(1,'transparent');c.fillStyle=fg;c.beginPath();c.moveTo(cx-cw*0.1,h);c.quadraticCurveTo(cx+cw*0.35,h-bH*0.55,cx+cw/2,h-bH);c.quadraticCurveTo(cx+cw*0.68,h-bH*0.55,cx+cw*1.1,h);c.closePath();c.fill();}for(let i=0;i<60;i++){const ex=Math.random()*w,ey=h*0.15+Math.random()*h*0.55,er=Math.random()*5+1;c.beginPath();c.arc(ex,ey,er,0,6.28);c.fillStyle=`rgba(255,${150+Math.random()*105},0,${Math.random()*0.6+0.2})`;c.fill();} } },
                    { id:'p14', label:'Água Profunda', preview:'linear-gradient(180deg,#001a33 0%,#003366 40%,#001a4d 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#001220');bg.addColorStop(0.4,'#002244');bg.addColorStop(1,'#000d1a');c.fillStyle=bg;c.fillRect(0,0,w,h);for(let i=0;i<6;i++){c.beginPath();c.strokeStyle=`rgba(0,150,255,${0.04+i*0.03})`;c.lineWidth=2+i*0.5;for(let x=0;x<w;x+=3){const y2=h*0.25+Math.sin((x/w)*Math.PI*5+i*1.1)*h*0.07+i*(h*0.12);x===0?c.moveTo(x,y2):c.lineTo(x,y2);}c.stroke();}for(let i=0;i<80;i++){const bx=Math.random()*w,by=Math.random()*h,br=Math.random()*40+10;const bg2=c.createRadialGradient(bx,by,0,bx,by,br);bg2.addColorStop(0,`rgba(0,180,255,${Math.random()*0.12+0.03})`);bg2.addColorStop(1,'transparent');c.fillStyle=bg2;c.fillRect(0,0,w,h);}for(let i=0;i<15;i++){const lx=Math.random()*w,ly=Math.random()*h*0.7,lw=Math.random()*4+1,ll=Math.random()*120+40;c.strokeStyle=`rgba(100,220,255,${Math.random()*0.2+0.05})`;c.lineWidth=lw;c.beginPath();c.moveTo(lx,ly);c.lineTo(lx+(Math.random()-0.5)*20,ly+ll);c.stroke();} } },
                    { id:'p15', label:'Glitch',        preview:'linear-gradient(160deg,#000 0%,#100010 100%)', gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);const scanH=Math.floor(h/4);for(let i=0;i<scanH;i++){const y2=Math.random()*h,sh=Math.random()*6+2;c.fillStyle=`rgba(${Math.random()>0.5?'255,0,80':'0,255,200'},${Math.random()*0.15+0.02})`;c.fillRect(0,y2,w,sh);}for(let i=0;i<8;i++){const gy=Math.random()*h,gh=Math.random()*40+5,gx=(Math.random()-0.5)*60;c.drawImage(c.canvas,gx,gy,w,gh,0,gy,w,gh);}for(let i=0;i<6;i++){const gy2=Math.random()*h,gh2=Math.random()*12+2;c.fillStyle=`rgba(0,255,255,${Math.random()*0.2+0.05})`;c.fillRect(0,gy2,w*Math.random()*0.6+w*0.2,gh2);}for(let i=0;i<200;i++){c.fillStyle=`rgba(${Math.random()>0.5?'255,0,100':'0,255,200'},${Math.random()*0.8+0.2})`;c.fillRect(Math.random()*w,Math.random()*h,Math.random()*4+1,Math.random()*2+1);}const vg=c.createRadialGradient(w/2,h/2,Math.min(w,h)*0.1,w/2,h/2,Math.max(w,h)*0.8);vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(0,0,0,0.7)');c.fillStyle=vg;c.fillRect(0,0,w,h); } },
                    { id:'p16', label:'Cristal',       preview:'linear-gradient(135deg,rgba(200,230,255,0.9) 0%,rgba(150,200,255,0.8) 50%,rgba(180,220,255,0.9) 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#c8e6ff');bg.addColorStop(0.5,'#96c8ff');bg.addColorStop(1,'#b4d8ff');c.fillStyle=bg;c.fillRect(0,0,w,h);const drawShard=(sx,sy,size,angle)=>{c.save();c.translate(sx,sy);c.rotate(angle);const pts=[[0,-size],[size*0.4,-size*0.2],[size*0.3,size*0.6],[-size*0.3,size*0.6],[-size*0.4,-size*0.2]];c.beginPath();pts.forEach(([px,py],i)=>i===0?c.moveTo(px,py):c.lineTo(px,py));c.closePath();const sg=c.createLinearGradient(-size,-size,size,size);sg.addColorStop(0,'rgba(255,255,255,0.6)');sg.addColorStop(0.5,'rgba(180,220,255,0.3)');sg.addColorStop(1,'rgba(100,170,255,0.4)');c.fillStyle=sg;c.fill();c.strokeStyle='rgba(255,255,255,0.8)';c.lineWidth=1;c.stroke();c.restore();};for(let i=0;i<30;i++){drawShard(Math.random()*w,Math.random()*h,Math.random()*60+20,Math.random()*Math.PI);}const sheen=c.createLinearGradient(0,0,w,h);sheen.addColorStop(0,'rgba(255,255,255,0.3)');sheen.addColorStop(0.3,'rgba(255,255,255,0.0)');sheen.addColorStop(1,'rgba(255,255,255,0.15)');c.fillStyle=sheen;c.fillRect(0,0,w,h); } },
                    { id:'p17', label:'Chuva Neon',    preview:'linear-gradient(180deg,#000510 0%,#000820 100%)', gen:(c,w,h)=>{ c.fillStyle='#000510';c.fillRect(0,0,w,h);const cols2=['rgba(0,191,255,','rgba(180,0,255,','rgba(0,255,150,','rgba(255,50,150,'];for(let i=0;i<120;i++){const rx=Math.random()*w,ry=Math.random()*h,rl=Math.random()*80+20,rw=Math.random()*1.5+0.5,col=cols2[Math.floor(Math.random()*cols2.length)],alpha=Math.random()*0.6+0.2;const rg=c.createLinearGradient(rx,ry,rx+rw,ry+rl);rg.addColorStop(0,col+alpha+')');rg.addColorStop(1,col+'0)');c.strokeStyle=rg.toString?`${col}${alpha})`:rg;c.lineWidth=rw;c.beginPath();c.moveTo(rx,ry);c.lineTo(rx+rw,ry+rl);c.stroke();}for(let i=0;i<40;i++){const px=Math.random()*w,py=Math.random()*h,pr=Math.random()*3+0.5,pcol=cols2[Math.floor(Math.random()*cols2.length)];c.beginPath();c.arc(px,py,pr,0,6.28);c.fillStyle=pcol+(Math.random()*0.9+0.1)+')';c.fill();const pg=c.createRadialGradient(px,py,0,px,py,pr*6);pg.addColorStop(0,pcol+'0.3)');pg.addColorStop(1,'transparent');c.fillStyle=pg;c.fillRect(px-pr*6,py-pr*6,pr*12,pr*12);}const vg2=c.createRadialGradient(w/2,h/2,Math.min(w,h)*0.2,w/2,h/2,Math.max(w,h)*0.9);vg2.addColorStop(0,'transparent');vg2.addColorStop(1,'rgba(0,0,5,0.6)');c.fillStyle=vg2;c.fillRect(0,0,w,h); } },
                    { id:'p18', label:'Pôr do Sol',    preview:'linear-gradient(180deg,#0a0a1a 0%,#1a0a30 20%,#4a0a20 50%,#c44b00 75%,#ff8c00 100%)', gen:(c,w,h)=>{ const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#050515');sky.addColorStop(0.2,'#15052a');sky.addColorStop(0.45,'#3d0a1a');sky.addColorStop(0.65,'#8b2500');sky.addColorStop(0.8,'#d45000');sky.addColorStop(0.92,'#ff8c00');sky.addColorStop(1,'#ffb300');c.fillStyle=sky;c.fillRect(0,0,w,h);for(let i=0;i<60;i++){c.beginPath();c.arc(Math.random()*w,Math.random()*h*0.55,Math.random()*1.2+0.2,0,6.28);c.fillStyle=`rgba(255,255,255,${Math.random()*0.8+0.1})`;c.fill();}const sunX=w/2,sunY=h*0.72,sunR=60;const sunG=c.createRadialGradient(sunX,sunY,0,sunX,sunY,sunR*2.5);sunG.addColorStop(0,'rgba(255,255,200,0.95)');sunG.addColorStop(0.15,'rgba(255,200,50,0.8)');sunG.addColorStop(0.4,'rgba(255,120,0,0.4)');sunG.addColorStop(1,'transparent');c.fillStyle=sunG;c.fillRect(0,0,w,h);c.beginPath();c.arc(sunX,sunY,sunR,0,6.28);c.fillStyle='rgba(255,255,200,0.9)';c.fill();const ref=c.createLinearGradient(sunX-20,sunY,sunX+20,h);ref.addColorStop(0,'rgba(255,180,0,0.5)');ref.addColorStop(0.5,'rgba(255,120,0,0.2)');ref.addColorStop(1,'rgba(255,80,0,0.05)');c.fillStyle=ref;c.fillRect(sunX-20,sunY,40,h-sunY); } },
                    { id:'p19', label:'Floresta',      preview:'linear-gradient(180deg,#001a00 0%,#003300 40%,#001a00 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#000d00');bg.addColorStop(0.3,'#001a00');bg.addColorStop(1,'#000800');c.fillStyle=bg;c.fillRect(0,0,w,h);const drawTree=(tx,ty,trunk,height,spread)=>{c.strokeStyle=`rgba(30,20,10,0.8)`;c.lineWidth=trunk;c.beginPath();c.moveTo(tx,ty);c.lineTo(tx,ty-height*0.35);c.stroke();const drawBranch=(bx,by,len,angle2,depth)=>{if(depth>4||len<5)return;const ex=bx+Math.cos(angle2)*len,ey=by+Math.sin(angle2)*len;c.strokeStyle=`rgba(${20+depth*8},${15+depth*6},${5+depth*4},0.7)`;c.lineWidth=Math.max(0.5,trunk*(1-depth*0.18));c.beginPath();c.moveTo(bx,by);c.lineTo(ex,ey);c.stroke();c.beginPath();c.arc(ex,ey,spread*(1-depth*0.15),0,6.28);c.fillStyle=`rgba(0,${60+Math.random()*60},0,${0.12+depth*0.04})`;c.fill();drawBranch(ex,ey,len*0.7,angle2-0.4+(Math.random()-0.5)*0.3,depth+1);drawBranch(ex,ey,len*0.65,angle2+0.4+(Math.random()-0.5)*0.3,depth+1);};drawBranch(tx,ty-height*0.35,height*0.35,-Math.PI/2,0);};for(let i=0;i<12;i++){drawTree(Math.random()*w,h*0.5+Math.random()*h*0.5,2+Math.random()*4,100+Math.random()*200,15+Math.random()*20);}for(let i=0;i<30;i++){c.beginPath();c.arc(Math.random()*w,Math.random()*h*0.5,Math.random()*1+0.2,0,6.28);c.fillStyle=`rgba(180,255,150,${Math.random()*0.5+0.1})`;c.fill();}const fog=c.createLinearGradient(0,0,0,h);fog.addColorStop(0,'rgba(0,20,0,0.6)');fog.addColorStop(0.5,'rgba(0,0,0,0.0)');fog.addColorStop(1,'rgba(0,0,0,0.3)');c.fillStyle=fog;c.fillRect(0,0,w,h); } },
                    { id:'p20', label:'Espaço 3D',     preview:'radial-gradient(ellipse at 40% 40%,rgba(60,0,120,0.9) 0%,rgba(0,0,30,0.95) 60%,#000 100%)', gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);const cx=w/2,cy=h/2;for(let i=0;i<600;i++){const dist=Math.random(),angle=Math.random()*Math.PI*2,spd=Math.pow(dist,0.5),sx=cx+Math.cos(angle)*dist*w*0.8,sy=cy+Math.sin(angle)*dist*h*0.8,sr=Math.random()*1.5*dist+0.1;c.beginPath();c.arc(sx,sy,sr,0,6.28);c.fillStyle=`rgba(255,255,255,${Math.random()*0.8+0.1})`;c.fill();}for(let ring=1;ring<8;ring++){const rr=ring*Math.min(w,h)*0.08,tilted=0.3;c.strokeStyle=`rgba(${100+ring*15},${50+ring*10},${200-ring*10},${0.25-ring*0.02})`;c.lineWidth=ring===1?3:1.5;c.beginPath();c.ellipse(cx,cy,rr,rr*tilted,0.4,0,Math.PI*2);c.stroke();}const planet=c.createRadialGradient(cx*0.9,cy*0.85,0,cx*0.9,cy*0.85,Math.min(w,h)*0.22);planet.addColorStop(0,'rgba(80,40,160,0.95)');planet.addColorStop(0.4,'rgba(40,20,100,0.85)');planet.addColorStop(0.8,'rgba(20,10,60,0.6)');planet.addColorStop(1,'transparent');c.fillStyle=planet;c.fillRect(0,0,w,h);const amb=c.createRadialGradient(w*0.75,h*0.15,0,w*0.75,h*0.15,w*0.5);amb.addColorStop(0,'rgba(100,200,255,0.18)');amb.addColorStop(1,'transparent');c.fillStyle=amb;c.fillRect(0,0,w,h); } },
                    { id:'p21', label:'Confete',       preview:'linear-gradient(180deg,#0a0015 0%,#12001f 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0a0015');bg.addColorStop(1,'#12001f');c.fillStyle=bg;c.fillRect(0,0,w,h);const colors=['#ff3366','#ff9900','#ffee00','#33ff66','#00ccff','#cc44ff','#ff66aa','#44ffee'];for(let i=0;i<200;i++){const x2=Math.random()*w,y2=Math.random()*h,col=colors[Math.floor(Math.random()*colors.length)],type=Math.floor(Math.random()*3);c.save();c.translate(x2,y2);c.rotate(Math.random()*Math.PI*2);c.fillStyle=col+Math.round(Math.random()*100+100).toString(16).slice(-2);if(type===0){const cw=Math.random()*16+4,ch=Math.random()*8+3;c.fillRect(-cw/2,-ch/2,cw,ch);}else if(type===1){c.beginPath();c.arc(0,0,Math.random()*6+2,0,6.28);c.fill();}else{const rs=Math.random()*8+3;c.beginPath();for(let k=0;k<5;k++){const a2=k*Math.PI*2/5-Math.PI/2,a3=a2+Math.PI/5;c.lineTo(Math.cos(a2)*rs,Math.sin(a2)*rs);c.lineTo(Math.cos(a3)*rs*0.4,Math.sin(a3)*rs*0.4);}c.closePath();c.fill();}c.restore();}const vg=c.createRadialGradient(w/2,h/2,Math.min(w,h)*0.15,w/2,h/2,Math.max(w,h)*0.75);vg.addColorStop(0,'transparent');vg.addColorStop(1,'rgba(0,0,0,0.55)');c.fillStyle=vg;c.fillRect(0,0,w,h); } },
                    { id:'p22', label:'Runas',         preview:'linear-gradient(180deg,#05000d 0%,#0a0019 100%)', gen:(c,w,h)=>{ const bg=c.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#05000d');bg.addColorStop(1,'#0a0019');c.fillStyle=bg;c.fillRect(0,0,w,h);const runes=['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];const cols3=Math.floor(w/55),rows3=Math.floor(h/55);for(let row=0;row<rows3+1;row++){for(let col=0;col<cols3+1;col++){const rx=col*55+(Math.random()-0.5)*20,ry=row*55+(Math.random()-0.5)*20,rune=runes[Math.floor(Math.random()*runes.length)],alpha=Math.random()*0.35+0.05,size=Math.random()*14+10,hue=220+Math.random()*80;c.font=`${size}px serif`;c.fillStyle=`hsla(${hue},70%,65%,${alpha})`;c.fillText(rune,rx,ry);}}const glows=['rgba(100,0,255,','rgba(0,100,255,','rgba(200,0,255,'];for(let i=0;i<20;i++){const gx=Math.random()*w,gy=Math.random()*h,gr=Math.random()*80+30,gcol=glows[Math.floor(Math.random()*glows.length)];const gg=c.createRadialGradient(gx,gy,0,gx,gy,gr);gg.addColorStop(0,gcol+'0.2)');gg.addColorStop(1,'transparent');c.fillStyle=gg;c.fillRect(0,0,w,h);}const vg2=c.createRadialGradient(w/2,h/2,Math.min(w,h)*0.1,w/2,h/2,Math.max(w,h)*0.8);vg2.addColorStop(0,'transparent');vg2.addColorStop(1,'rgba(0,0,0,0.65)');c.fillStyle=vg2;c.fillRect(0,0,w,h); } },
                  ];
                  return (
                    <div style={{ padding:12, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                      {GEN_LIST.map(p=>(
                        <div key={p.id} onClick={()=>{ const cv=document.createElement('canvas');cv.width=720;cv.height=1280;p.gen(cv.getContext('2d'),720,1280);const url=cv.toDataURL('image/jpeg',0.95);setImageSrc(url);const img=new Image();img.onload=()=>setImage(img);img.src=url;setShowBgPanel(false); }}
                          style={{ cursor:'pointer' }}>
                          <div style={{ width:'100%', aspectRatio:'9/16', background:p.preview, borderRadius:8, border:'2px solid rgba(255,255,255,0.08)', transition:'border-color 0.15s' }}
                            onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(0,191,255,0.7)'}
                            onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}
                          />
                          <span style={{fontSize:9,color:'#888',display:'block',textAlign:'center',marginTop:3}}>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>,
            document.body
          );
        })()}

        {/* ── Painel de Trilhas ── */}
        {showTrilhasPanel && createPortal(
          <>
            <div onClick={()=>{ setShowTrilhasPanel(false); stopTrilhasPreview(); }} style={{position:'fixed',inset:0,zIndex:99997}} />
            <div style={{
              position:'fixed',
              top: (trilhasBtnRef.current?.getBoundingClientRect().bottom ?? 52) + 4,
              left: Math.max(8, Math.min((trilhasBtnRef.current?.getBoundingClientRect().left ?? 200), window.innerWidth - 520)),
              zIndex:99999, background:'#0f172a',
              border:'1px solid rgba(167,139,250,0.3)', borderRadius:16, width:510,
              maxHeight:'82vh', boxShadow:'0 20px 60px rgba(0,0,0,0.85)',
              display:'flex', flexDirection:'column', overflow:'hidden'
            }}>
              {/* Header */}
              <div style={{padding:'12px 16px 10px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{fontSize:18}}>🎼</span>
                  <span style={{fontWeight:800, fontSize:14, color:'#a78bfa'}}>{t('trilhas_title')}</span>
                  <span style={{fontSize:10, color:'#666', background:'rgba(255,255,255,0.05)', borderRadius:20, padding:'2px 8px'}}>{t('trilhas_royalty')}</span>
                </div>
                <button onClick={()=>{ setShowTrilhasPanel(false); stopTrilhasPreview(); }}
                  style={{background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:18, lineHeight:1}}>✕</button>
              </div>

              {/* Busca */}
              <div style={{padding:'10px 14px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0}}>
                <input
                  value={trilhasSearch}
                  onChange={e=>setTrilhasSearch(e.target.value)}
                  placeholder={t('trilhas_search')}
                  style={{width:'100%', boxSizing:'border-box', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'7px 10px', color:'#fff', fontSize:12, outline:'none'}}
                />
              </div>

              {/* Lista de trilhas */}
              <div style={{overflowY:'auto', flex:1, padding:'4px 0'}}>
                {(() => {
                  const q = trilhasSearch.toLowerCase().trim();
                  const filtered = q
                    ? TRILHAS_LIST.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q))
                    : TRILHAS_LIST;
                  if (filtered.length === 0) return (
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 0', gap:8}}>
                      <span style={{fontSize:28}}>🎼</span>
                      <span style={{fontSize:12, color:'#555'}}>{t('trilhas_empty')}</span>
                    </div>
                  );
                  return filtered.map(track => {
                    const isPlaying = trilhasPreviewId === track.id;
                    const isUsing   = trilhasUsingId   === track.id;
                    const progress  = isPlaying && trilhasPreviewRef.current?.duration > 0
                      ? (trilhasPreviewTime / trilhasPreviewRef.current.duration) * 100 : 0;
                    return (
                      <div key={track.id}
                        style={{
                          display:'flex', alignItems:'center', gap:10,
                          padding:'8px 14px', transition:'background 0.12s',
                          borderBottom:'1px solid rgba(255,255,255,0.04)',
                          background: isPlaying ? 'rgba(167,139,250,0.07)' : 'transparent'
                        }}
                        onMouseEnter={e=>{ if(!isPlaying) e.currentTarget.style.background='rgba(255,255,255,0.04)'; }}
                        onMouseLeave={e=>{ if(!isPlaying) e.currentTarget.style.background=isPlaying?'rgba(167,139,250,0.07)':'transparent'; }}
                      >
                        {/* Play/Pause */}
                        <button onClick={()=>toggleTrilhasPreview(track)}
                          style={{
                            width:34, height:34, borderRadius:'50%', flexShrink:0,
                            background: isPlaying ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.07)',
                            border:`1px solid ${isPlaying ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.12)'}`,
                            cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:13, color: isPlaying ? '#c4b5fd' : '#888', transition:'all 0.15s'
                          }}>
                          {isPlaying ? '⏸' : '▶'}
                        </button>

                        {/* Info + barra de progresso */}
                        <div style={{flex:1, minWidth:0}}>
                          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:2}}>
                            <span style={{fontSize:12, fontWeight:600, color: isPlaying ? '#c4b5fd' : '#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:240}}>
                              {track.title}
                            </span>
                          </div>
                          {track.artist && (
                            <div style={{fontSize:10, color:'#555', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                              {track.artist}
                            </div>
                          )}
                          {/* Barra de progresso */}
                          <div style={{height:2, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden'}}>
                            <div style={{height:'100%', width:`${progress}%`, background:'linear-gradient(90deg,#a78bfa,#c4b5fd)', borderRadius:2, transition:'width 0.5s linear'}} />
                          </div>
                          {isPlaying && (
                            <div style={{fontSize:9, color:'#a78bfa', marginTop:2}}>
                              {fmtDur(Math.floor(trilhasPreviewTime))}
                            </div>
                          )}
                        </div>

                        {/* Botão Usar */}
                        <button
                          onClick={()=>useTrilhaNoProject(track)}
                          disabled={isUsing}
                          style={{
                            padding:'5px 12px', borderRadius:7,
                            border:'1px solid rgba(167,139,250,0.4)',
                            background: isUsing ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.15)',
                            color:'#c4b5fd', fontSize:11, cursor: isUsing ? 'wait' : 'pointer',
                            fontWeight:700, transition:'all 0.15s', flexShrink:0, whiteSpace:'nowrap'
                          }}>
                          {isUsing ? '⏳' : t('trilhas_use')}
                        </button>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </>,
          document.body
        )}

        {/* ── Lang Toggle ── */}
        <div style={{ flexShrink:0, marginLeft:2 }}>
          <LangToggle />
        </div>

        {/* ── Botão PWA ── */}
        {pwaPrompt && !pwaInstalled && (
          <button onClick={handlePwaInstall}
            title="Instalar CanvasSync como aplicativo"
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:7, background:'rgba(0,191,255,0.12)', border:'1px solid rgba(0,191,255,0.35)', cursor:'pointer', color:'#00BFFF', fontSize:11, fontWeight:700, flexShrink:0, whiteSpace:'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(0,191,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(0,191,255,0.12)'}
          >⬇ Instalar App</button>
        )}

      </div>{/* fim HEADER CONTROLS */}

      <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>
        
        {/* EDITOR ESQUERDA — 580PX */}
        <div className="cs-left-panel" style={{ width: '580px', minWidth: '580px', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', background: '#0d0d0d', boxShadow: 'none', overflowY: 'auto' }}>

          {/* ══ SEÇÃO SELEÇÃO IMAGEM/VÍDEO — rotação ══ */}
          {(activeImageId || activeVideoId) && (() => {
            const selImg  = activeImageId ? images.find(i => i.id === activeImageId) : null;
            const selVid  = activeVideoId ? videos.find(v => v.id === activeVideoId) : null;
            const sel     = selImg || selVid;
            const isVid   = !!selVid;
            if (!sel) return null;
            const rot     = sel.rotation ?? 0;
            const setRot  = (deg) => {
              if (isVid) setVideos(prev => prev.map(v => v.id === sel.id ? { ...v, rotation: deg } : v));
              else        setImages(prev => prev.map(i => i.id === sel.id ? { ...i, rotation: deg } : i));
            };
            return (
              <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '11px', color: isVid ? '#a78bfa' : '#fbbf24', fontWeight: 700, letterSpacing: '0.6px' }}>
                    {isVid ? t('sel_video') : t('sel_image')}
                  </label>
                  <button onClick={() => { if (isVid) setActiveVideoId(null); else setActiveImageId(null); }}
                    style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#888', minWidth: 52 }}>{t('ed_rotation')}</span>
                  <input type="range" min="-180" max="180" value={rot}
                    onChange={e => setRot(parseInt(e.target.value))}
                    style={{ flex: 1, accentColor: isVid ? '#a78bfa' : '#fbbf24' }} />
                  <span style={{ fontSize: 11, color: '#ccc', minWidth: 40, textAlign: 'right' }}>{rot}°</span>
                  <button onClick={() => setRot(0)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '3px 8px', fontSize: 11, color: '#888', cursor: 'pointer' }}>
                    0°
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[-90, -45, 0, 45, 90, 180].map(d => (
                    <button key={d} onClick={() => setRot(d)}
                      style={{ background: rot === d ? (isVid ? 'rgba(167,139,250,0.2)' : 'rgba(251,191,36,0.2)') : 'rgba(255,255,255,0.04)', border: `1px solid ${rot === d ? (isVid ? 'rgba(167,139,250,0.5)' : 'rgba(251,191,36,0.5)') : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, padding: '3px 10px', fontSize: 11, color: rot === d ? '#fff' : '#666', cursor: 'pointer' }}>
                      {d}°
                    </button>
                  ))}
                </div>

                {(() => {
                  const accent = isVid ? '#a78bfa' : '#fbbf24';
                  const accentBg = isVid ? 'rgba(167,139,250,' : 'rgba(251,191,36,';
                  const flt = sel.filters || {};
                  const setF = (prop, val) => {
                    if (isVid) setVideos(prev => prev.map(v => v.id === sel.id ? { ...v, filters: { ...(v.filters||{}), [prop]: val } } : v));
                    else       setImages(prev => prev.map(i => i.id === sel.id ? { ...i, filters: { ...(i.filters||{}), [prop]: val } } : i));
                  };
                  const resetF = () => {
                    if (isVid) setVideos(prev => prev.map(v => v.id === sel.id ? { ...v, filters: {} } : v));
                    else       setImages(prev => prev.map(i => i.id === sel.id ? { ...i, filters: {} } : i));
                  };
                  const setPreset = (f) => {
                    if (isVid) setVideos(prev => prev.map(v => v.id === sel.id ? { ...v, filters: f } : v));
                    else       setImages(prev => prev.map(i => i.id === sel.id ? { ...i, filters: f } : i));
                  };
                  const PRESETS = [
                    { label: t('prs_original'), f: {} },
                    { label: t('prs_bw'),      f: { grayscale: 100 } },
                    { label: t('prs_sepia'),    f: { sepia: 80 } },
                    { label: t('prs_cinema'),   f: { contrast: 115, saturate: 80, brightness: 95 } },
                    { label: t('prs_neon'),     f: { saturate: 200, brightness: 110, contrast: 120 } },
                    { label: t('prs_vintage'),  f: { sepia: 40, contrast: 90, brightness: 105, saturate: 80 } },
                    { label: t('prs_cold'),     f: { hueRotate: 190, saturate: 120 } },
                    { label: t('prs_warm'),     f: { hueRotate: 340, saturate: 130, brightness: 105 } },
                    { label: t('prs_fade'),     f: { brightness: 130, saturate: 60, contrast: 85 } },
                    { label: t('prs_dramatic'), f: { contrast: 150, saturate: 50, brightness: 90 } },
                  ];
                  const SLIDERS = [
                    { key: 'brightness', label: t('flt_brightness'), min: 0,   max: 200, def: 100, unit: '%' },
                    { key: 'contrast',   label: t('flt_contrast'),   min: 0,   max: 200, def: 100, unit: '%' },
                    { key: 'saturate',   label: t('flt_saturate'),   min: 0,   max: 300, def: 100, unit: '%' },
                    { key: 'hueRotate',  label: t('flt_hue'),        min: 0,   max: 360, def: 0,   unit: '°' },
                    { key: 'blur',       label: t('flt_blur'),       min: 0,   max: 20,  def: 0,   unit: 'px' },
                    { key: 'sepia',      label: t('flt_sepia'),      min: 0,   max: 100, def: 0,   unit: '%' },
                    { key: 'grayscale',  label: t('flt_bw'),         min: 0,   max: 100, def: 0,   unit: '%' },
                    { key: 'opacity',    label: t('flt_opacity'),    min: 0,   max: 100, def: 100, unit: '%' },
                  ];
                  const isPreset = (pf) => JSON.stringify(flt) === JSON.stringify(pf);
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: `${accentBg}0.04)`, border: `1px solid ${accentBg}0.18)`, borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: accent, fontWeight: 700, letterSpacing: '0.5px' }}>🎨 {t('ed_filters')}</span>
                        <button onClick={resetF} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: '#666', cursor: 'pointer' }}>{t('ed_reset')}</button>
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {PRESETS.map(({ label, f }) => (
                          <button key={label} onClick={() => setPreset(f)} style={{
                            padding: '3px 9px', fontSize: 10, borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                            background: isPreset(f) ? `${accentBg}0.25)` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isPreset(f) ? `${accentBg}0.6)` : 'rgba(255,255,255,0.08)'}`,
                            color: isPreset(f) ? accent : '#666',
                          }}>{label}</button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {SLIDERS.map(({ key, label, min, max, def, unit }) => {
                          const val = flt[key] !== undefined ? flt[key] : def;
                          const changed = val !== def;
                          return (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 10, color: changed ? accent : '#555', minWidth: 60, fontWeight: changed ? 700 : 400 }}>{label}</span>
                              <input type="range" min={min} max={max} value={val} onChange={e => setF(key, +e.target.value)} style={{ flex: 1, accentColor: accent, height: 3 }} />
                              <span style={{ fontSize: 10, color: changed ? accent : '#555', minWidth: 36, textAlign: 'right' }}>{val}{unit}</span>
                              {changed && <button onClick={() => setF(key, def)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 12, padding: '0 2px' }}>↺</button>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* ── TRANSIÇÕES ── */}
                {(() => {
                  const accent   = isVid ? '#a78bfa' : '#fbbf24';
                  const accentBg = isVid ? 'rgba(167,139,250,' : 'rgba(251,191,36,';
                  const trIn    = sel.transitionIn  || 'none';
                  const trOut   = sel.transitionOut || 'none';
                  const durIn   = sel.transitionInDur  ?? 0.35;
                  const durOut  = sel.transitionOutDur ?? 0.35;
                  const upd = (patch) => {
                    if (isVid) setVideos(prev => prev.map(v => v.id === sel.id ? { ...v, ...patch } : v));
                    else       setImages(prev => prev.map(i => i.id === sel.id ? { ...i, ...patch } : i));
                  };
                  const TRANSITIONS = [
                    { value: 'none',        label: '—'        },
                    { value: 'fade',        label: 'Fade'     },
                    { value: 'slide-up',    label: 'Slide ↑'  },
                    { value: 'slide-down',  label: 'Slide ↓'  },
                    { value: 'slide-left',  label: 'Slide ←'  },
                    { value: 'slide-right', label: 'Slide →'  },
                    { value: 'zoom',        label: 'Zoom +'   },
                    { value: 'zoom-out',    label: 'Zoom −'   },
                    { value: 'blur-in',     label: 'Blur'     },
                    { value: 'rotate',      label: 'Girar'    },
                    { value: 'flip-h',      label: 'Flip ↔'   },
                    { value: 'flip-v',      label: 'Flip ↕'   },
                    { value: 'bounce',      label: 'Bounce'   },
                    { value: 'elastic',     label: t('tr_elastic') },
                    { value: 'swing',       label: 'Swing'    },
                    { value: 'drop',        label: 'Drop'     },
                    { value: 'roll',        label: 'Rolar'    },
                    { value: 'scale-pulse', label: 'Pulsar'   },
                  ];
                  const TrGrid = ({ current, onSelect }) => (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {TRANSITIONS.map(({ value, label }) => (
                        <button key={value} onClick={() => onSelect(value)} style={{
                          padding: '3px 8px', fontSize: 10, borderRadius: 7, cursor: 'pointer', fontWeight: 600,
                          background: current === value ? `${accentBg}0.25)` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${current === value ? `${accentBg}0.65)` : 'rgba(255,255,255,0.07)'}`,
                          color: current === value ? accent : '#555',
                        }}>{label}</button>
                      ))}
                    </div>
                  );

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: `${accentBg}0.04)`, border: `1px solid ${accentBg}0.18)`, borderRadius: 12, padding: '10px 12px' }}>
                      <span style={{ fontSize: 11, color: accent, fontWeight: 700, letterSpacing: '0.5px' }}>✨ {t('ed_transitions')}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>▶ {t('tr_in')}</span>
                          {trIn !== 'none' && <button onClick={() => upd({ transitionIn: 'none' })} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>}
                        </div>
                        <TrGrid current={trIn} onSelect={v => upd({ transitionIn: v })} />
                        {trIn !== 'none' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
                          <span style={{ fontSize: 10, color: '#444', minWidth: 54 }}>{t('ed_duration')}</span>
                          <input type="range" min={0.05} max={2} step={0.05} value={durIn}
                            onMouseDown={e => e.stopPropagation()}
                            onPointerDown={e => e.stopPropagation()}
                            onTouchStart={e => e.stopPropagation()}
                            onChange={e => upd({ transitionInDur: +e.target.value })}
                            style={{ flex: 1, accentColor: accent }} />
                          <span style={{ fontSize: 10, color: accent, minWidth: 34, textAlign: 'right' }}>{durIn.toFixed(2)}s</span>
                        </div>
                      )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>◀ {t('tr_out')}</span>
                          {trOut !== 'none' && <button onClick={() => upd({ transitionOut: 'none' })} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>}
                        </div>
                        <TrGrid current={trOut} onSelect={v => upd({ transitionOut: v })} />
                        {trOut !== 'none' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
                          <span style={{ fontSize: 10, color: '#444', minWidth: 54 }}>{t('ed_duration')}</span>
                          <input type="range" min={0.05} max={2} step={0.05} value={durOut}
                            onMouseDown={e => e.stopPropagation()}
                            onPointerDown={e => e.stopPropagation()}
                            onTouchStart={e => e.stopPropagation()}
                            onChange={e => upd({ transitionOutDur: +e.target.value })}
                            style={{ flex: 1, accentColor: accent }} />
                          <span style={{ fontSize: 10, color: accent, minWidth: 34, textAlign: 'right' }}>{durOut.toFixed(2)}s</span>
                        </div>
                      )}
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: '#444' }}>{t('tr_both')}:</span>
                        {['fade','slide-up','zoom','blur-in','bounce','roll'].map(v => (
                          <button key={v} onClick={() => upd({ transitionIn: v, transitionOut: v })}
                            style={{ padding: '3px 9px', fontSize: 10, borderRadius: 7, cursor: 'pointer', fontWeight: 600, background: (trIn===v&&trOut===v) ? `${accentBg}0.2)` : 'rgba(255,255,255,0.03)', border: `1px solid ${(trIn===v&&trOut===v) ? `${accentBg}0.5)` : 'rgba(255,255,255,0.06)'}`, color: (trIn===v&&trOut===v) ? accent : '#555' }}>
                            {TRANSITIONS.find(t=>t.value===v)?.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

              </div>
            );
          })()}

          {/* ══ SEÇÃO KEYFRAMES + MÁSCARAS + ABERRAÇÃO CROMÁTICA ══ */}
          {(activeImageId || activeVideoId) && (() => {
            const selImg = activeImageId ? images.find(i => i.id === activeImageId) : null;
            const selVid = activeVideoId ? videos.find(v => v.id === activeVideoId) : null;
            const sel    = selImg || selVid;
            const isVid  = !!selVid;
            if (!sel) return null;
            const accent   = isVid ? '#a78bfa' : '#fbbf24';
            const accentBg = isVid ? 'rgba(167,139,250,' : 'rgba(251,191,36,';
            const upd = (patch) => {
              if (isVid) setVideos(prev => prev.map(v => v.id === sel.id ? {...v, ...patch} : v));
              else       setImages(prev => prev.map(i => i.id === sel.id ? {...i, ...patch} : i));
            };
            const kfs = sel.keyframes || [];
            const tNow = virtualTimeRef.current;
            return (
              <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* ── Máscara de Forma ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11, color: accent, fontWeight: 700, letterSpacing: '0.5px' }}>{t('el_mask')}</span>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {[['none','Sem'],['circle','⬤ Círculo'],['ellipse','⬭ Elipse'],['diamond','◇ Losango'],['star','★ Estrela'],['heart','♥ Coração'],['hexagon','⬡ Hex'],['triangle','▲ Triângulo']].map(([v,l]) => (
                      <button key={v} onClick={() => upd({mask: v})}
                        style={{ padding:'3px 8px', fontSize:10, borderRadius:8, cursor:'pointer', fontWeight:600,
                          background: (sel.mask||'none')===v ? `${accentBg}0.25)` : 'rgba(255,255,255,0.04)',
                          border:`1px solid ${(sel.mask||'none')===v ? `${accentBg}0.6)` : 'rgba(255,255,255,0.08)'}`,
                          color: (sel.mask||'none')===v ? accent : '#666' }}>{l}</button>
                    ))}
                  </div>
                  {sel.mask && sel.mask !== 'none' && (
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:10, color:'#666', minWidth:70 }}>{t('el_mask_feather')}</span>
                      <input type="range" min={0} max={15} value={sel.maskFeather||0}
                        onChange={e => upd({maskFeather: +e.target.value})}
                        style={{ flex:1, accentColor: accent, height:3 }} />
                      <span style={{ fontSize:10, color: accent, minWidth:24 }}>{sel.maskFeather||0}px</span>
                    </div>
                  )}
                </div>
                {/* ── Aberração Cromática por elemento ── */}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <span style={{ fontSize:11, color: accent, fontWeight:700, letterSpacing:'0.5px' }}>{t('el_chroma')}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:10, color:'#666', minWidth:70 }}>{t('el_chroma_int')}</span>
                    <input type="range" min={0} max={20} value={sel.chromaticAberration||0}
                      onChange={e => upd({chromaticAberration: +e.target.value})}
                      style={{ flex:1, accentColor: accent, height:3 }} />
                    <span style={{ fontSize:10, color:(sel.chromaticAberration||0)>0?accent:'#555', minWidth:24 }}>{sel.chromaticAberration||0}</span>
                    {(sel.chromaticAberration||0)>0 && <button onClick={() => upd({chromaticAberration:0})} style={{ background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:12 }}>↺</button>}
                  </div>
                </div>
                {/* ── Zoom Animado / Keyframes ── */}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <span style={{ fontSize:11, color: accent, fontWeight:700, letterSpacing:'0.5px' }}>{t('kf_zoom_title')}</span>
                      {kfs.length > 0 && <span style={{ marginLeft:6, fontSize:9, background:`${accentBg}0.2)`, border:`1px solid ${accentBg}0.4)`, borderRadius:10, padding:'1px 6px', color:accent }}>{kfs.length} KF</span>}
                    </div>
                    <div style={{ display:'flex', gap:5 }}>
                      <button
                        onClick={() => {
                          // Captura posição e escala atuais (incluindo kfState se já há KFs)
                          const kfNow = getKfState(sel, tNow);
                          const scNow = kfNow ? kfNow.w / sel.width : 1;
                          const xNow  = kfNow ? kfNow.x : sel.x;
                          const yNow  = kfNow ? kfNow.y : sel.y;
                          const kf = {
                            t: parseFloat(tNow.toFixed(3)),
                            x: xNow, y: yNow,
                            scale: parseFloat(scNow.toFixed(3)),
                            opacity: 1,
                            rotation: sel.rotation || 0,
                            anchorX: 0.5, anchorY: 0.5,
                            easing: 'ease_in_out',
                          };
                          const existing = kfs.filter(k => Math.abs(k.t - kf.t) > 0.05);
                          upd({ keyframes: [...existing, kf].sort((a,b) => a.t - b.t) });
                        }}
                        style={{ background:`${accentBg}0.15)`, border:`1px solid ${accentBg}0.4)`, borderRadius:7, padding:'3px 9px', fontSize:10, color:accent, cursor:'pointer', fontWeight:700 }}
                      >+ KF {tNow.toFixed(1)}s</button>
                      {kfs.length > 0 && <button onClick={() => upd({keyframes:[]})}
                        style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:7, padding:'3px 7px', fontSize:10, color:'#f87171', cursor:'pointer' }}>✕</button>}
                    </div>
                  </div>

                  {/* Presets de zoom rápido */}
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                    {[
                      { label:t('kf_preset_kenburns'), title:'Zoom suave de entrada', fn:() => {
                        const dur = (sel.end||5) - (sel.start||0);
                        upd({ keyframes: [
                          { t: sel.start||0, x: sel.x, y: sel.y, scale:1,    opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                          { t: (sel.start||0)+dur, x: sel.x - sel.width*0.1, y: sel.y - sel.height*0.1, scale:1.2, opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                        ]});
                      }},
                      { label:t('kf_preset_punchin'), title:'Zoom rápido de aproximação', fn:() => {
                        const s = sel.start||0;
                        upd({ keyframes: [
                          { t: s,      x: sel.x, y: sel.y, scale:1,   opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_out' },
                          { t: s+0.6,  x: sel.x - sel.width*0.15, y: sel.y - sel.height*0.15, scale:1.3, opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_out' },
                        ]});
                      }},
                      { label:t('kf_preset_zoomout'), title:'Zoom suave de afastamento', fn:() => {
                        const dur = (sel.end||5) - (sel.start||0);
                        upd({ keyframes: [
                          { t: sel.start||0, x: sel.x - sel.width*0.15, y: sel.y - sel.height*0.15, scale:1.3, opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                          { t: (sel.start||0)+dur, x: sel.x, y: sel.y, scale:1, opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                        ]});
                      }},
                      { label:t('kf_preset_pulse'), title:'Pulso rítmico de escala', fn:() => {
                        const s = sel.start||0;
                        upd({ keyframes: [
                          { t: s,      x:sel.x, y:sel.y, scale:1,    opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                          { t: s+0.5,  x:sel.x - sel.width*0.06, y:sel.y - sel.height*0.06, scale:1.12, opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                          { t: s+1.0,  x:sel.x, y:sel.y, scale:1,    opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                          { t: s+1.5,  x:sel.x - sel.width*0.06, y:sel.y - sel.height*0.06, scale:1.12, opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                          { t: s+2.0,  x:sel.x, y:sel.y, scale:1,    opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_in_out' },
                        ]});
                      }},
                      { label:t('kf_preset_fadein'), title:'Aparece gradualmente', fn:() => {
                        const s = sel.start||0;
                        upd({ keyframes: [
                          { t: s,     x:sel.x, y:sel.y, scale:1, opacity:0, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_out' },
                          { t: s+0.8, x:sel.x, y:sel.y, scale:1, opacity:1, rotation:sel.rotation||0, anchorX:0.5, anchorY:0.5, easing:'ease_out' },
                        ]});
                      }},
                      { label:t('kf_clear'), id:'clear', title:'Remove todos os keyframes', fn:() => upd({keyframes:[]}) },
                    ].map(p => (
                      <button key={p.label} onClick={p.fn} title={p.title}
                        style={{ padding:'3px 8px', fontSize:9, borderRadius:6, cursor:'pointer', fontWeight:700,
                          background: p.id==='clear' ? 'rgba(239,68,68,0.08)' : `${accentBg}0.1)`,
                          border: `1px solid ${p.id==='clear' ? 'rgba(239,68,68,0.25)' : accentBg+'0.3)'}` ,
                          color: p.id==='clear' ? '#f87171' : accent }}>{p.label}</button>
                    ))}
                  </div>

                  {/* Lista de keyframes com controles */}
                  {kfs.length > 0 ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:200, overflowY:'auto' }}>
                      {/* Mini timeline visual */}
                      <div style={{ position:'relative', height:18, background:'rgba(255,255,255,0.04)', borderRadius:6, margin:'0 0 2px', overflow:'visible' }}>
                        <div style={{ position:'absolute', left:0, top:'50%', right:0, height:1, background:'rgba(255,255,255,0.08)', transform:'translateY(-50%)' }} />
                        {(() => {
                          const tMin = kfs[0].t, tMax = kfs[kfs.length-1].t || (tMin+1);
                          const range = Math.max(0.5, tMax - tMin);
                          return kfs.map((kf, ki) => {
                            const pct = range > 0 ? ((kf.t - tMin) / range) * 92 + 4 : 4;
                            return (
                              <div key={ki} style={{ position:'absolute', left:`${pct}%`, top:'50%', transform:'translate(-50%,-50%)', width:8, height:8, borderRadius:'50%', background:accent, border:'2px solid #0d1117', cursor:'pointer', zIndex:2 }} title={`KF ${kf.t.toFixed(2)}s — escala ${(kf.scale||1).toFixed(2)}×`} />
                            );
                          });
                        })()}
                        {/* Playhead */}
                        {(() => {
                          const tMin = kfs[0].t, tMax = kfs[kfs.length-1].t || (tMin+1);
                          const range = Math.max(0.5, tMax - tMin);
                          const pct = range > 0 ? Math.max(0,Math.min(100,((tNow - tMin) / range) * 92 + 4)) : 4;
                          return <div style={{ position:'absolute', left:`${pct}%`, top:0, bottom:0, width:1, background:'rgba(0,191,255,0.6)', transform:'translateX(-50%)', pointerEvents:'none' }} />;
                        })()}
                      </div>
                      {kfs.map((kf, ki) => (
                        <div key={ki} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${accentBg}0.15)`, borderRadius:9, padding:'7px 10px', display:'flex', flexDirection:'column', gap:5 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ width:6, height:6, borderRadius:'50%', background:accent, flexShrink:0 }} />
                            <span style={{ fontSize:11, color:accent, fontWeight:800, minWidth:36 }}>{kf.t.toFixed(2)}s</span>
                            {/* Easing selector */}
                            <select value={kf.easing||'ease_in_out'}
                              onChange={e => upd({keyframes: kfs.map((k,i) => i===ki?{...k,easing:e.target.value}:k)})}
                              style={{ flex:1, fontSize:9, background:'#0a0a0a', color:'#888', border:`1px solid ${accentBg}0.2)`, borderRadius:5, padding:'2px 4px', cursor:'pointer' }}>
                              <option value="linear">Linear</option>
                              <option value="ease_in">Ease In</option>
                              <option value="ease_out">Ease Out</option>
                              <option value="ease_in_out">Ease In-Out</option>
                              <option value="spring">Spring</option>
                              <option value="bounce">Bounce</option>
                            </select>
                            <button onClick={() => upd({keyframes: kfs.filter((_,i) => i!==ki)})}
                              style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:13, lineHeight:1 }}>✕</button>
                          </div>
                          {/* Escala */}
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <span style={{ fontSize:9, color:'#666', minWidth:46 }}>{t('kf_scale')}</span>
                            <input type="range" min={0.1} max={3} step={0.01} value={kf.scale||1}
                              onMouseDown={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}
                              onChange={e => upd({keyframes: kfs.map((k,i) => i===ki?{...k,scale:+e.target.value}:k)})}
                              style={{ flex:1, accentColor:accent, height:3 }} />
                            <span style={{ fontSize:10, color:accent, fontWeight:700, minWidth:30, textAlign:'right' }}>{(kf.scale||1).toFixed(2)}×</span>
                            {(kf.scale||1) !== 1 && <button onClick={() => upd({keyframes:kfs.map((k,i)=>i===ki?{...k,scale:1}:k)})}
                              style={{ background:'none',border:'none',color:'#555',cursor:'pointer',fontSize:11,padding:0 }}>↺</button>}
                          </div>
                          {/* Opacidade */}
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <span style={{ fontSize:9, color:'#666', minWidth:46 }}>{t('kf_opacity')}</span>
                            <input type="range" min={0} max={1} step={0.01} value={kf.opacity??1}
                              onMouseDown={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}
                              onChange={e => upd({keyframes: kfs.map((k,i) => i===ki?{...k,opacity:+e.target.value}:k)})}
                              style={{ flex:1, accentColor:accent, height:3 }} />
                            <span style={{ fontSize:10, color:accent, fontWeight:700, minWidth:30, textAlign:'right' }}>{Math.round((kf.opacity??1)*100)}%</span>
                          </div>
                          {/* Ancora (ponto de zoom) */}
                          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                            <span style={{ fontSize:9, color:'#666', minWidth:46 }}>{t('kf_anchor')}</span>
                            {[['↖','0,0'],['↑','0.5,0'],['↗','1,0'],['←','0,0.5'],['⊙','0.5,0.5'],['→','1,0.5'],['↙','0,1'],['↓','0.5,1'],['↘','1,1']].map(([lbl,val]) => {
                              const [ax,ay] = val.split(',').map(Number);
                              const isActive = Math.abs((kf.anchorX??0.5)-ax)<0.01 && Math.abs((kf.anchorY??0.5)-ay)<0.01;
                              return (
                                <button key={val} onClick={() => upd({keyframes:kfs.map((k,i)=>i===ki?{...k,anchorX:ax,anchorY:ay}:k)})}
                                  style={{ width:20, height:20, borderRadius:4, border:`1px solid ${isActive?accentBg+'0.7)':'rgba(255,255,255,0.08)'}`, background:isActive?`${accentBg}0.2)`:'rgba(255,255,255,0.03)', color:isActive?accent:'#555', fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>{lbl}</button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:8, padding:'10px 12px', fontSize:10, color:'#444', textAlign:'center', lineHeight:1.6 }}>
                      Use um preset acima ou clique <strong style={{color:accent}}>+ KF</strong> para adicionar keyframes manualmente.<br/>
                      <span style={{fontSize:9}}>{t('kf_hint_main')}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ══ SEÇÃO TEXTOS EXTRAS ══ */}
          <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.6px' }}>{t('ed_extra_texts')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="color"
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.color || extraTextColor) : (extraTexts.length ? extraTexts[extraTexts.length-1].color || extraTextColor : extraTextColor)}
                  onChange={e => { setExtraTextColor(e.target.value); const tid = activeExtraTextId || (extraTexts.length ? extraTexts[extraTexts.length-1].id : null); if(tid) setExtraTexts(prev=>prev.map(t=>t.id===tid?{...t,color:e.target.value}:t)); }}
                  style={{ width: '28px', height: '28px', padding: 0, border: '1px solid rgba(0,191,255,0.2)', background: '#111', borderRadius: '8px', cursor: 'pointer' }} />
                <select
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontFamily || extraTextFontFamily) : (extraTexts.length ? extraTexts[extraTexts.length-1].fontFamily || extraTextFontFamily : extraTextFontFamily)}
                  onChange={e => { setExtraTextFontFamily(e.target.value); const tid = activeExtraTextId || (extraTexts.length ? extraTexts[extraTexts.length-1].id : null); if(tid) setExtraTexts(prev=>prev.map(t=>t.id===tid?{...t,fontFamily:e.target.value}:t)); }}
                  style={{ fontSize: '11px', backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '5px 8px' }}>
                  <optgroup label="── Display ──">
                  <option value="Bebas Neue">Bebas Neue</option>
                  <option value="Anton">Anton</option>
                  <option value="Black Han Sans">Black Han Sans</option>
                  <option value="Righteous">Righteous</option>
                  <option value="Russo One">Russo One</option>
                  <option value="Lilita One">Lilita One</option>
                  <option value="Abril Fatface">Abril Fatface</option>
                  <option value="Lobster">Lobster</option>
                  </optgroup>
                  <optgroup label="── Sans Serif ──">
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Roboto Condensed">Roboto Condensed</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Exo 2">Exo 2</option>
                  <option value="Kanit">Kanit</option>
                  <option value="Nunito">Nunito</option>
                  <option value="Ubuntu">Ubuntu</option>
                  <option value="Orbitron">Orbitron</option>
                  </optgroup>
                  <optgroup label="── Serif / Script ──">
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Lora">Lora</option>
                  <option value="Pacifico">Pacifico</option>
                  <option value="Permanent Marker">Permanent Marker</option>
                  <option value="Caveat">Caveat</option>
                  <option value="Dancing Script">Dancing Script</option>
                  </optgroup>
                  <optgroup label="── Pixel / Tech ──">
                  <option value="Press Start 2P">Press Start 2P</option>
                  <option value="Share Tech Mono">Share Tech Mono</option>
                  </optgroup>
                  {customFonts.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize || extraTextFontSize) : (extraTexts.length ? extraTexts[extraTexts.length-1]?.fontSize || extraTextFontSize : extraTextFontSize)}px
                </span>
                <input type="range" min="10" max="200"
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize || extraTextFontSize) : (extraTexts.length ? extraTexts[extraTexts.length-1]?.fontSize || extraTextFontSize : extraTextFontSize)}
                  onChange={e => { const v=parseInt(e.target.value); setExtraTextFontSize(v); const tid = activeExtraTextId || (extraTexts.length ? extraTexts[extraTexts.length-1].id : null); if(tid) setExtraTexts(prev=>prev.map(t=>t.id===tid?{...t,fontSize:v}:t)); }}
                  style={{ width: '90px', accentColor: '#00BFFF' }} />
                <select
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.bgEffect ?? 'none') : (extraTexts.length ? extraTexts[extraTexts.length-1]?.bgEffect ?? 'none' : 'none')}
                  onChange={e => { const tid = activeExtraTextId || (extraTexts.length ? extraTexts[extraTexts.length-1].id : null); if(tid) setExtraTexts(prev=>prev.map(t=>t.id===tid?{...t,bgEffect:e.target.value}:t)); }}
                  title='Efeito de fundo'
                  style={{ fontSize: '10px', backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '4px 6px' }}>
                  <option value='none'>— Sem efeito</option>
                  <optgroup label='── Estilo Texto ──'>
                  <option value='outline_white'>◻ Outline Branco</option>
                  <option value='outline_black'>◼ Outline Preto</option>
                  <option value='double_stroke'>⬜ Duplo Stroke</option>
                  <option value='glow_neon'>💡 Glow Neon</option>
                  <option value='glow_fire'>🔥 Glow Fogo</option>
                  <option value='stroke_gradient'>✨ Stroke Dourado</option>
                  <option value='shadow_3d'>🧱 Sombra 3D</option>
                  <option value='brush_stroke'>🖌️ Pincelada</option>
                  <option value='glitch_rgb'>⚡ Glitch RGB</option>
                  </optgroup>
                  <optgroup label='── Fundo ──'>
                  <option value='black'>⬛ Fundo preto</option>
                  <option value='white'>⬜ Fundo branco</option>
                  <option value='blur'>🌫️ Blur</option>
                  <option value='dark_blur'>🔳 Blur escuro</option>
                  <option value='fire'>🔥 Fogo (fundo)</option>
                  <option value='water'>💧 Água (fundo)</option>
                  <option value='neon'>✨ Neon (fundo)</option>
                  <option value='rainbow'>🌈 Arco-íris (fundo)</option>
                  <option value='gold'>🏆 Dourado (fundo)</option>
                  </optgroup>
                </select>
                <button onClick={() => fontInputRef.current?.click()} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', padding: '3px 9px', fontSize: '10px', color: '#f59e0b', cursor: 'pointer' }}>+ {t('ed_add_font')}</button>
              </div>
            </div>
            {/* Sombra + Gradiente por item */}
            {(() => {
              const tid = activeExtraTextId || (extraTexts.length ? extraTexts[extraTexts.length-1]?.id : null);
              const sel = extraTexts.find(t => t.id === tid);
              if (!sel) return null;
              const setP = (prop, val) => setExtraTexts(prev => prev.map(t => t.id === tid ? {...t, [prop]: val} : t));
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: 'rgba(0,191,255,0.03)', border: '1px solid rgba(0,191,255,0.08)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>{t('ed_shadow')}</span>
                    <input type="checkbox" checked={sel.shadowEnabled ?? true} onChange={e => setP('shadowEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {(sel.shadowEnabled ?? true) && <>
                      <input type="color" value={(sel.shadowColor || '#000000').replace(/rgba?\([^)]+\)/, '#000000')} onChange={e => setP('shadowColor', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                      <input type="range" min="0" max="30" value={sel.shadowBlur ?? 10} onChange={e => setP('shadowBlur', +e.target.value)} style={{ width: '60px', accentColor: '#00BFFF' }} />
                    </>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>{t('ed_gradient')}</span>
                    <input type="checkbox" checked={sel.gradientEnabled ?? false} onChange={e => setP('gradientEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {(sel.gradientEnabled ?? false) && <>
                      <input type="color" value={sel.gradientColor1 || '#ffffff'} onChange={e => setP('gradientColor1', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                      <input type="color" value={sel.gradientColor2 || '#00BFFF'} onChange={e => setP('gradientColor2', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                    </>}
                  </div>
                </div>
              );
            })()}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <textarea
                placeholder={t('et_placeholder')}
                value={newExtraInput}
                onChange={(e) => setNewExtraInput(e.target.value)}
                rows={3}
                style={{ flex: 1, padding: '10px 12px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f0', borderRadius: '14px', fontSize: '12px', resize: 'none', lineHeight: '1.5', fontFamily: 'inherit' }}
              />
              <button onClick={addExtraText} style={{ padding: '0 16px', height: '56px', background: '#00BFFF', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', color: '#000', boxShadow: '0 4px 16px rgba(0,191,255,0.25)', fontSize: '22px' }}>+</button>
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginTop: '-4px' }}>{t('et_hint')}</span>
          </div>

          {/* ══ SEÇÃO LETRA DA MÚSICA ══ */}
          <div style={{ flex: 1, padding: '14px 18px 14px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
            
            {/* Linha config letra — por lyric selecionada ou padrão global */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.6px' }}>
                {t('ed_lyrics_title')}
                {activeLyricId && <span style={{ marginLeft: 6, color: 'rgba(0,191,255,0.6)', fontWeight: 400, fontSize: 10 }}>({t('ed_selected')})</span>}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} title="Cor da letra" style={{ width: '28px', height: '28px', padding: 0, border: '1px solid rgba(0,191,255,0.2)', background: '#111', borderRadius: '8px', cursor: 'pointer' }} />
              <select
                value={activeLyricId ? (lyrics.find(l => l.id === activeLyricId)?.fontFamily || fontFamily) : fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  if (activeLyricId) setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, fontFamily: e.target.value} : l));
                }}
                style={{ fontSize: '11px', backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '5px 8px' }}>
                <optgroup label="── Display ──">
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Anton">Anton</option>
                <option value="Black Han Sans">Black Han Sans</option>
                <option value="Righteous">Righteous</option>
                <option value="Russo One">Russo One</option>
                <option value="Lilita One">Lilita One</option>
                <option value="Abril Fatface">Abril Fatface</option>
                <option value="Lobster">Lobster</option>
                </optgroup>
                <optgroup label="── Sans Serif ──">
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Oswald">Oswald</option>
                <option value="Roboto Condensed">Roboto Condensed</option>
                <option value="Raleway">Raleway</option>
                <option value="Exo 2">Exo 2</option>
                <option value="Kanit">Kanit</option>
                <option value="Nunito">Nunito</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Orbitron">Orbitron</option>
                </optgroup>
                <optgroup label="── Serif / Script ──">
                <option value="Playfair Display">Playfair Display</option>
                <option value="Lora">Lora</option>
                <option value="Pacifico">Pacifico</option>
                <option value="Permanent Marker">Permanent Marker</option>
                <option value="Caveat">Caveat</option>
                <option value="Dancing Script">Dancing Script</option>
                </optgroup>
                <optgroup label="── Pixel / Tech ──">
                <option value="Press Start 2P">Press Start 2P</option>
                <option value="Share Tech Mono">Share Tech Mono</option>
                </optgroup>
                {customFonts.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                {activeLyricId ? (lyrics.find(l => l.id === activeLyricId)?.fontSize || fontSize) : fontSize}px
              </span>
              <input type="range" min="15" max="200"
                value={activeLyricId ? (lyrics.find(l => l.id === activeLyricId)?.fontSize || fontSize) : fontSize}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setFontSize(v);
                  if (activeLyricId) setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, fontSize: v} : l));
                }}
                style={{ width: '90px', accentColor: '#00BFFF' }} />
              <select
                value={activeLyricId ? (lyrics.find(l => l.id === activeLyricId)?.bgEffect ?? textBgEffect) : textBgEffect}
                onChange={e => {
                  setTextBgEffect(e.target.value);
                  if (activeLyricId) setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, bgEffect: e.target.value} : l));
                }}
                title="Efeito de fundo"
                style={{ fontSize: '10px', backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '4px 6px' }}>
                <option value="none">— Sem efeito</option>
                <optgroup label="── Estilo Texto ──">
                <option value="outline_white">◻ Outline Branco</option>
                <option value="outline_black">◼ Outline Preto</option>
                <option value="double_stroke">⬜ Duplo Stroke</option>
                <option value="glow_neon">💡 Glow Neon</option>
                <option value="glow_fire">🔥 Glow Fogo</option>
                <option value="stroke_gradient">✨ Stroke Dourado</option>
                <option value="shadow_3d">🧱 Sombra 3D</option>
                <option value="brush_stroke">🖌️ Pincelada</option>
                <option value="glitch_rgb">⚡ Glitch RGB</option>
                </optgroup>
                <optgroup label="── Fundo ──">
                <option value="black">⬛ Fundo preto</option>
                <option value="white">⬜ Fundo branco</option>
                <option value="blur">🌫️ Blur</option>
                <option value="dark_blur">🔳 Blur escuro</option>
                <option value="fire">🔥 Fogo (fundo)</option>
                <option value="water">💧 Água (fundo)</option>
                <option value="neon">✨ Neon (fundo)</option>
                <option value="rainbow">🌈 Arco-íris (fundo)</option>
                <option value="gold">🏆 Dourado (fundo)</option>
                </optgroup>
              </select>
              </div>
            </div>

            {/* Sombra + Gradiente + Upload fonte — por marcação quando selecionada */}
            {(() => {
              const selL = activeLyricId ? lyrics.find(l => l.id === activeLyricId) : null;
              const uiShOn  = selL ? (selL.shadowEnabled   !== undefined ? selL.shadowEnabled   : shadowEnabled)   : shadowEnabled;
              const uiShBlur= selL ? (selL.shadowBlur      !== undefined ? selL.shadowBlur      : shadowBlur)      : shadowBlur;
              const uiShCol = selL ? (selL.shadowColor     || shadowColor)   : shadowColor;
              const uiGrOn  = selL ? (selL.gradientEnabled !== undefined ? selL.gradientEnabled : gradientEnabled) : gradientEnabled;
              const uiGr1   = selL ? (selL.gradientColor1  || gradientColor1) : gradientColor1;
              const uiGr2   = selL ? (selL.gradientColor2  || gradientColor2) : gradientColor2;
              const applyLP = (prop, val) => {
                if (selL) {
                  // Tem marcação selecionada → atualiza SÓ ela
                  setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, [prop]: val} : l));
                } else {
                  // Nenhuma marcação → atualiza global (padrão para novas)
                  if (prop === 'shadowEnabled')  setShadowEnabled(val);
                  if (prop === 'shadowBlur')      setShadowBlur(val);
                  if (prop === 'shadowColor')     setShadowColor(val);
                  if (prop === 'gradientEnabled') setGradientEnabled(val);
                  if (prop === 'gradientColor1')  setGradientColor1(val);
                  if (prop === 'gradientColor2')  setGradientColor2(val);
                }
              };
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: 'rgba(0,191,255,0.03)', border: '1px solid rgba(0,191,255,0.08)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>{t('ed_shadow')}</span>
                    <input type="checkbox" checked={uiShOn} onChange={e => applyLP('shadowEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {uiShOn && <>
                      <input type="color" value={uiShCol.startsWith('rgba') ? '#000000' : uiShCol} onChange={e => applyLP('shadowColor', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} title="Cor da sombra" />
                      <input type="range" min="0" max="30" value={uiShBlur} onChange={e => applyLP('shadowBlur', +e.target.value)} style={{ width: '60px', accentColor: '#00BFFF' }} title="Intensidade" />
                    </>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>{t('ed_gradient')}</span>
                    <input type="checkbox" checked={uiGrOn} onChange={e => applyLP('gradientEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {uiGrOn && <>
                      <input type="color" value={uiGr1} onChange={e => applyLP('gradientColor1', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} title="Cor 1" />
                      <input type="color" value={uiGr2} onChange={e => applyLP('gradientColor2', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} title="Cor 2" />
                    </>}
                  </div>
                  <button onClick={() => fontInputRef.current?.click()} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', padding: '3px 9px', fontSize: '10px', color: '#f59e0b', cursor: 'pointer' }}>+ {t('ed_add_font_ttf')}</button>
                </div>
              );
            })()}

            {/* Animação de entrada */}
            {(() => {
              const selL = activeLyricId ? lyrics.find(l => l.id === activeLyricId) : null;
              const curAnim  = selL ? (selL.animType || animType) : animType;
              const curSpeed = selL ? (selL.twSpeed  || twSpeed)  : twSpeed;
              const setAnim = val => {
                if (selL) setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, animType: val} : l));
                else setAnimType(val);
              };
              const setSpd = val => {
                if (selL) setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, twSpeed: val} : l));
                else setTwSpeed(val);
              };
              return (
                <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:10, padding:'8px 10px' }}>
                  <span style={{ fontSize:'10px', color:'#a78bfa', fontWeight:700, marginRight:2 }}>{t('ed_animation')}</span>
                  {[['none', t('anim_none')],['fade','Fade'],['slide','Slide'],['typewriter','Typewriter']].map(([v, label]) => (
                    <button key={v} onClick={() => setAnim(v)} style={{
                      padding:'3px 10px', fontSize:'10px', borderRadius:'8px', cursor:'pointer', fontWeight:600,
                      background: curAnim === v ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${curAnim === v ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.1)'}`,
                      color: curAnim === v ? '#c4b5fd' : '#666',
                    }}>{label}</button>
                  ))}
                  {curAnim === 'typewriter' && (
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', marginLeft:4 }}>
                      <span style={{ fontSize:'10px', color:'#64748b' }}>{t('ed_speed_anim')}</span>
                      <input type="range" min="5" max="80" step="5" value={curSpeed}
                        onChange={e => setSpd(+e.target.value)}
                        style={{ width:'70px', accentColor:'#a78bfa' }} />
                      <span style={{ fontSize:'10px', color:'#a78bfa', minWidth:30 }}>{curSpeed}/s</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Textarea letra — flex:1 para preencher espaço disponível */}
            <textarea
              className="lyrics-textarea"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={t('ed_paste_lyrics')}
              style={{ flex: 1, minHeight: '140px', backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px', resize: 'none', fontSize: '12px', lineHeight: '1.6', scrollbarColor: '#00BFFF #0a0a0a', scrollbarWidth: 'thin' }}
            />

            {/* Próxima frase + botão — lado a lado */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
              <div style={{ flex: 1, background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.15)', padding: '10px 14px', borderRadius: '16px', minHeight: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '10px', color: '#00BFFF', letterSpacing: '0.6px', fontWeight: 600, marginBottom: '4px' }}>
                  {t('ed_next_line')}
                  {textLines.length > 0 && <span style={{ color: 'rgba(0,191,255,0.65)', marginLeft: '6px' }}>({currentLineIndex}/{textLines.length})</span>}
                </div>
                <div style={{ fontWeight: 'bold', color: '#f8fafc', fontSize: '13px', wordBreak: 'break-word', lineHeight: 1.4 }}>
                  {textLines[currentLineIndex] || (textLines.length === 0 ? t('ed_paste_lyrics_short') : t('ed_all_marked'))}
                </div>
              </div>
              <button
                onClick={markLyricTiming}
                disabled={textLines.length === 0 || currentLineIndex >= textLines.length}
                style={{
                  padding: '0 20px',
                  minWidth: '110px',
                  background: (textLines.length > 0 && currentLineIndex < textLines.length)
                    ? '#00BFFF'
                    : 'rgba(255,255,255,0.04)',
                  color: (textLines.length > 0 && currentLineIndex < textLines.length) ? '#000' : '#444',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  cursor: (textLines.length > 0 && currentLineIndex < textLines.length) ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  textAlign: 'center',
                  flexShrink: 0,
                  boxShadow: (textLines.length > 0 && currentLineIndex < textLines.length) ? '0 4px 18px rgba(0,191,255,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {textLines.length === 0 ? t('ed_paste_lyrics_short') : currentLineIndex >= textLines.length ? t('ed_all_done') : t('ed_mark_now')}
              </button>
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginTop: '-4px' }}>
              {t('ed_lyrics_hint')}
            </span>
          </div>
        </div>

        {/* PREVIEW CENTRO */}
        <div ref={canvasContainerRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #141b34 0%, #0b1024 100%)', position: 'relative' }}>
          {/* Botão tela cheia */}
          <button
            onClick={() => setIsFullscreen(true)}
            title="Visualização em tela cheia"
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              background: 'rgba(0,191,255,0.12)', border: '1px solid rgba(0,191,255,0.3)',
              borderRadius: '10px', padding: '6px 12px', cursor: 'pointer',
              fontSize: '13px', color: '#00BFFF', fontWeight: 700,
              backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >⛶ {t('ed_fullscreen')}</button>

          {/* Badge do formato atual */}
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 10,
            background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '8px', padding: '4px 10px', fontSize: '11px',
            color: '#a78bfa', fontWeight: 700, backdropFilter: 'blur(8px)',
          }}>
            {canvasFormat} · {CANVAS_FORMATS[canvasFormat].width}×{CANVAS_FORMATS[canvasFormat].height}
          </div>

          <canvas 
            ref={canvasRef}
            width={CANVAS_FORMATS[canvasFormat]?.width || 720}
            height={CANVAS_FORMATS[canvasFormat]?.height || 1280}
            onMouseDown={handleCanvasMouseDown}
            onContextMenu={(e) => {
              e.preventDefault();
              const canvas = canvasRef.current;
              const rect = canvas.getBoundingClientRect();
              const scaleX = canvas.width / rect.width;
              const scaleY = canvas.height / rect.height;
              const mouseX = (e.clientX - rect.left) * scaleX;
              const mouseY = (e.clientY - rect.top) * scaleY;
              // Stickers: botão direito remove
              for (let i = stickers.length - 1; i >= 0; i--) {
                const stk = stickers[i];
                const half = (stk.size || 80) / 2 + 8;
                if (Math.abs(mouseX - stk.x) <= half && Math.abs(mouseY - stk.y) <= half) {
                  removeSticker(stk.id);
                  return;
                }
              }
              const ctx = canvas.getContext('2d');
              extraTexts.forEach(txt => {
                const rot = (txt.rotation || 0) * Math.PI / 180;
                const lines = txt.text.split('\n');
                const lineH = extraTextFontSize * 1.25;
                ctx.font = `bold ${extraTextFontSize}px ${extraTextFontFamily}`;
                const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
                const halfW = maxW / 2 + 10;
                const halfH = (lines.length * lineH) / 2 + 8;
                const cos = Math.cos(-rot), sin = Math.sin(-rot);
                const dx = mouseX - txt.x, dy = mouseY - txt.y;
                const lx = dx * cos - dy * sin, ly = dx * sin + dy * cos;
                if (Math.abs(lx) <= halfW && Math.abs(ly) <= halfH) {
                  removeExtraText(txt.id);
                }
              });
            }}
            style={{ border: '1px solid rgba(0,191,255,0.15)', borderRadius: '12px', maxWidth: '100%', maxHeight: '88%', cursor: 'move', boxShadow: '0 24px 50px rgba(10, 12, 24, 0.55)', objectFit: 'contain' }} 
          />


          {/* Slider de tamanho flutuante — aparece quando sticker está selecionado */}
          {stickers.filter(s => s.id === activeStickerId).map(sel => (
            <div key={sel.id} style={{
              position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
              zIndex: 100, background: 'rgba(10,12,28,0.92)', border: '1px solid rgba(0,191,255,0.4)',
              borderRadius: 12, padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 10,
              backdropFilter: 'blur(8px)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)', minWidth: 240,
            }}>
              <span style={{ fontSize: 10, color: '#00BFFF', fontWeight: 700, whiteSpace: 'nowrap' }}>📐 Tamanho</span>
              <input type="range" min={20} max={400} step={4}
                value={sel.size || 80}
                onChange={e => setStickers(prev => prev.map(s => s.id === sel.id ? { ...s, size: Number(e.target.value) } : s))}
                style={{ flex: 1, accentColor: '#00BFFF', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 11, color: '#00BFFF', fontWeight: 700, minWidth: 34, textAlign: 'right' }}>{Math.round(sel.size || 80)}px</span>
              <button onClick={() => { activeStickerRef.current = null; setActiveStickerId(null); }}
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
            </div>
          ))}

          {/* Sliders de tamanho flutuante — aparece quando imagem está selecionada */}
          {(() => {
            const selImg = activeImageId ? images.find(i => i.id === activeImageId) : null;
            if (!selImg) return null;
            const canvasW = CANVAS_FORMATS[canvasFormat]?.width  || 1280;
            const canvasH = CANVAS_FORMATS[canvasFormat]?.height || 720;
            const setW = (v) => setImages(prev => prev.map(i => i.id === selImg.id ? { ...i, width:  Number(v) } : i));
            const setH = (v) => setImages(prev => prev.map(i => i.id === selImg.id ? { ...i, height: Number(v) } : i));
            return (
              <div style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                zIndex: 100, background: 'rgba(10,12,28,0.92)', border: '1px solid rgba(251,191,36,0.5)',
                borderRadius: 14, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 14,
                backdropFilter: 'blur(10px)', boxShadow: '0 4px 24px rgba(0,0,0,0.55)', minWidth: 320,
              }}>
                <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, whiteSpace: 'nowrap' }}>🖼️ {t('ed_size')}</span>

                {/* Largura */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>W</span>
                  <input
                    type="range" min={20} max={canvasW} step={2}
                    value={Math.round(selImg.width || 100)}
                    onMouseDown={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onChange={e => setW(e.target.value)}
                    style={{ flex: 1, accentColor: '#fbbf24', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{Math.round(selImg.width || 100)}px</span>
                </div>

                {/* Altura */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>H</span>
                  <input
                    type="range" min={20} max={canvasH} step={2}
                    value={Math.round(selImg.height || 100)}
                    onMouseDown={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onChange={e => setH(e.target.value)}
                    style={{ flex: 1, accentColor: '#fbbf24', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{Math.round(selImg.height || 100)}px</span>
                </div>

                <button
                  onClick={() => setActiveImageId(null)}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                >✕</button>
              </div>
            );
          })()}

          {/* Sliders de tamanho flutuante — aparece quando vídeo está selecionado */}
          {(() => {
            const selVid = activeVideoId ? videos.find(v => v.id === activeVideoId) : null;
            if (!selVid || activeImageId) return null;
            const canvasW = CANVAS_FORMATS[canvasFormat]?.width  || 1280;
            const canvasH = CANVAS_FORMATS[canvasFormat]?.height || 720;
            const setW = (v) => setVideos(prev => prev.map(vv => vv.id === selVid.id ? { ...vv, width:  Number(v) } : vv));
            const setH = (v) => setVideos(prev => prev.map(vv => vv.id === selVid.id ? { ...vv, height: Number(v) } : vv));
            return (
              <div style={{
                position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                zIndex: 100, background: 'rgba(10,12,28,0.92)', border: '1px solid rgba(167,139,250,0.5)',
                borderRadius: 14, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 14,
                backdropFilter: 'blur(10px)', boxShadow: '0 4px 24px rgba(0,0,0,0.55)', minWidth: 320,
              }}>
                <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, whiteSpace: 'nowrap' }}>🎬 {t('ed_size')}</span>

                {/* Largura */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>W</span>
                  <input
                    type="range" min={20} max={canvasW} step={2}
                    value={Math.round(selVid.width || 100)}
                    onMouseDown={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onChange={e => setW(e.target.value)}
                    style={{ flex: 1, accentColor: '#a78bfa', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{Math.round(selVid.width || 100)}px</span>
                </div>

                {/* Altura */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <span style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap' }}>H</span>
                  <input
                    type="range" min={20} max={canvasH} step={2}
                    value={Math.round(selVid.height || 100)}
                    onMouseDown={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    onChange={e => setH(e.target.value)}
                    style={{ flex: 1, accentColor: '#a78bfa', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, minWidth: 36, textAlign: 'right' }}>{Math.round(selVid.height || 100)}px</span>
                </div>

                <button
                  onClick={() => setActiveVideoId(null)}
                  style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                >✕</button>
              </div>
            );
          })()}

          {/* Modal Tela Cheia */}
          {isFullscreen && (
            <div
              onClick={(e) => {
                // Para o mirror RAF antes de fechar
                const fsCanvas = e.currentTarget.querySelector('canvas');
                if (fsCanvas?._stopMirror) fsCanvas._stopMirror();
                setIsFullscreen(false);
              }}
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.92)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 16,
                backdropFilter: 'blur(6px)',
              }}
            >
              <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13 }}>
                  {canvasFormat} · {CANVAS_FORMATS[canvasFormat].width}×{CANVAS_FORMATS[canvasFormat].height}
                </span>
                <button
                  onClick={async () => {
                    const audio = audioRef.current;
                    if (isPlaying) {
                      isPlayingRef.current = false;
                      if (audio) audio.pause();
                      if (clockIntervalRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; }
                      stopAllVideoAudio();
                      videosRef.current.forEach(v => { if (v.videoEl && !v.videoEl.paused) v.videoEl.pause(); });
                      setIsPlaying(false);
                    } else {
                      isPlayingRef.current = true;
                      if (!videoAudioACRef.current || videoAudioACRef.current.state === 'closed' || videoAudioACRef.current.state === 'suspended') {
                        try { if (videoAudioACRef.current) videoAudioACRef.current.close(); } catch {}
                        videoAudioACRef.current = new (window.AudioContext || window.webkitAudioContext)();
                      }
                      const tNow = virtualTimeRef.current;
                      // Inicia vídeos ativos
                      videosRef.current.forEach(v => {
                        if (!v.videoEl) return;
                        const trimSt = v.trimStart ?? 0;
                        const vidSpd = v.vidSpeed ?? 1;
                        const rawDur = v.rawDuration ?? v.videoEl.duration ?? (v.end - v.start);
                        const effEnd = v.start + (rawDur - trimSt) / Math.max(0.25, vidSpd);
                        if (tNow < v.start || tNow >= effEnd) return;
                        const rel = Math.max(0, Math.min(trimSt + (tNow - v.start) * vidSpd, (v.videoEl.duration || 0) - 0.2));
                        v.videoEl.muted = true;
                        v.videoEl.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current * vidSpd));
                        if (Math.abs(v.videoEl.currentTime - rel) > 0.05) v.videoEl.currentTime = rel;
                        v.videoEl.play().catch(() => {});
                        startVideoAudio(v, tNow);
                      });
                      if (audio) {
                        audio.volume = Math.max(0, Math.min(1, projectVolumeRef.current));
                        audio.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                        const tNowFs = virtualTimeRef.current;
                        const offFs = audioOffsetRef.current || 0;
                        const trimFs = audioTrimStartRef.current || 0;
                        if (tNowFs >= offFs) {
                          const relFs = trimFs + (tNowFs - offFs);
                          if (Math.abs(audio.currentTime - relFs) > 0.1) audio.currentTime = relFs;
                          audio.play().catch(() => {});
                        } else {
                          const swFs = Date.now(); const svFs = tNowFs;
                          const csFs = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                          if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
                          clockIntervalRef.current = setInterval(() => {
                            if (!isPlayingRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; return; }
                            const ntFs = svFs + (Date.now() - swFs) / 1000 * csFs;
                            virtualTimeRef.current = ntFs; setCurrentTime(ntFs);
                            if (ntFs >= offFs) {
                              clearInterval(clockIntervalRef.current); clockIntervalRef.current = null;
                              audio.currentTime = trimFs;
                              audio.volume = Math.max(0, Math.min(1, projectVolumeRef.current));
                              audio.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                              audio.play().catch(() => {});
                            }
                          }, 30);
                        }
                      } else {
                        const startWall = Date.now(); const startVirt = virtualTimeRef.current;
                        const clockSpd = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                        if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
                        clockIntervalRef.current = setInterval(() => {
                          const elapsed = (Date.now() - startWall) / 1000;
                          const newTime = startVirt + elapsed * clockSpd;
                          const contentEnd = Math.max(
                            lyricsRef.current.reduce((m, l) => Math.max(m, l.end || 0), 0),
                            imagesRef.current.reduce((m, i) => Math.max(m, i.end || 0), 0),
                            videosRef.current.reduce((m, v) => Math.max(m, v.end || 0), 0),
                          );
                          if (contentEnd > 0 && newTime >= contentEnd) {
                            clearInterval(clockIntervalRef.current); clockIntervalRef.current = null;
                            virtualTimeRef.current = contentEnd; setCurrentTime(contentEnd); setIsPlaying(false);
                            return;
                          }
                          virtualTimeRef.current = newTime; setCurrentTime(newTime);
                        }, 30);
                      }
                      setIsPlaying(true);
                    }
                  }}
                  style={{ background: isPlaying ? '#00BFFF' : 'rgba(0,191,255,0.12)', border: '1px solid rgba(0,191,255,0.4)', borderRadius: 10, padding: '6px 18px', color: isPlaying ? '#000' : '#00BFFF', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >{isPlaying ? '⏸ Pausar' : '▶ Play'}</button>
                <button
                  onClick={handleStopPlayback}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '6px 18px', color: '#f87171', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >⏹ Stop</button>
                <span style={{ fontSize: 13, color: '#00BFFF', fontWeight: 700, minWidth: 100 }}>
                  {formatTime(currentTime / projectSpeed)} / {formatTime(duration / projectSpeed)}
                </span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '6px 14px', color: '#f87171', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >✕ Fechar</button>
              </div>
              <canvas
                ref={node => {
                  if (!node || !canvasRef.current) return;
                  const src = canvasRef.current;
                  node.width  = src.width;
                  node.height = src.height;
                  const ctx = node.getContext('2d');
                  let rafId;
                  const draw = () => {
                    if (!node.isConnected) { cancelAnimationFrame(rafId); return; }
                    ctx.clearRect(0, 0, node.width, node.height);
                    ctx.drawImage(src, 0, 0);
                    rafId = requestAnimationFrame(draw);
                  };
                  draw();
                  // Cleanup automático quando o canvas sai do DOM
                  node._stopMirror = () => cancelAnimationFrame(rafId);
                }}
                onClick={e => e.stopPropagation()}
                style={{
                  maxWidth: '92vw', maxHeight: '82vh',
                  borderRadius: '14px',
                  border: '1px solid rgba(0,191,255,0.2)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
                }}
              />
            </div>
          )}

          {/* OVERLAY DE EDIÇÃO DE LYRIC */}
          {editingLyricId && (() => {            const canvas = canvasRef.current;
            const container = canvasContainerRef.current;
            if (!canvas || !container) return null;
            const lyric = lyrics.find(l => l.id === editingLyricId);
            if (!lyric) return null;
            const canvasRect = canvas.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scaleX = canvasRect.width / canvas.width;
            const scaleY = canvasRect.height / canvas.height;
            const lx = (lyric.x ?? canvas.width / 2) * scaleX + (canvasRect.left - containerRect.left);
            const ly = (lyric.y ?? canvas.height * 0.75) * scaleY + (canvasRect.top - containerRect.top);
            return (
              <div style={{ position: 'absolute', left: lx, top: ly, transform: 'translate(-50%, -50%)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', pointerEvents: 'all' }}>
                <textarea
                  autoFocus
                  value={lyric.text}
                  onChange={(e) => setLyrics(prev => prev.map(l => l.id === editingLyricId ? { ...l, text: e.target.value } : l))}
                  onKeyDown={(e) => { if (e.key === 'Escape') setEditingLyricId(null); e.stopPropagation(); }}
                  rows={3}
                  style={{
                    background: 'rgba(10,14,30,0.93)',
                    color: textColor,
                    border: '2px solid rgba(0,191,255,0.8)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    fontSize: `${Math.min(18, Math.max(12, Math.round(fontSize * 0.45)))}px`,
                    fontFamily: fontFamily,
                    fontWeight: 'bold',
                    resize: 'none',
                    width: '190px',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: '0 8px 28px rgba(0,191,255,0.25)',
                    backdropFilter: 'blur(12px)',
                    letterSpacing: '0.5px',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setEditingLyricId(null)}
                    style={{ padding: '5px 14px', background: '#00BFFF', border: 'none', borderRadius: '10px', color: '#000', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,191,255,0.3)' }}
                  >✓ OK</button>
                  <button
                    onClick={() => { removeLyric(editingLyricId); setEditingLyricId(null); setActiveLyricId(null); }}
                    style={{ padding: '5px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', color: '#f87171', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'none' }}
                  >✕ {t('ed_delete')}</button>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(0,191,255,0.5)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{t('ed_inline_hint')}</span>
              </div>
            );
          })()}

          {editingExtraTextId && (() => {
            const canvas = canvasRef.current;
            const container = canvasContainerRef.current;
            if (!canvas || !container) return null;
            const txt = extraTexts.find(t => t.id === editingExtraTextId);
            if (!txt) return null;
            const canvasRect = canvas.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const scaleX = canvasRect.width / canvas.width;
            const scaleY = canvasRect.height / canvas.height;
            const px = txt.x * scaleX + (canvasRect.left - containerRect.left);
            const py = txt.y * scaleY + (canvasRect.top - containerRect.top);
            return (
              <div style={{ position: 'absolute', left: px, top: py, transform: 'translate(-50%, -50%)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', pointerEvents: 'all' }}>
                <textarea
                  autoFocus
                  value={txt.text}
                  onChange={(e) => setExtraTexts(prev => prev.map(t => t.id === editingExtraTextId ? { ...t, text: e.target.value } : t))}
                  onKeyDown={(e) => { if (e.key === 'Escape') setEditingExtraTextId(null); e.stopPropagation(); }}
                  rows={3}
                  style={{
                    background: 'rgba(10,14,30,0.93)',
                    color: txt.color || extraTextColor,
                    border: '2px solid rgba(167,139,250,0.8)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    fontSize: `${Math.min(18, Math.max(12, Math.round((txt.fontSize || extraTextFontSize) * 0.45)))}px`,
                    fontFamily: txt.fontFamily || extraTextFontFamily,
                    fontWeight: 'bold',
                    resize: 'none',
                    width: '190px',
                    textAlign: 'center',
                    outline: 'none',
                    boxShadow: '0 8px 28px rgba(167,139,250,0.25)',
                    backdropFilter: 'blur(12px)',
                    letterSpacing: '0.5px',
                  }}
                />
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setEditingExtraTextId(null)}
                    style={{ padding: '5px 14px', background: '#a78bfa', border: 'none', borderRadius: '10px', color: '#000', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(167,139,250,0.3)' }}
                  >✓ OK</button>
                  <button
                    onClick={() => { removeExtraText(editingExtraTextId); setEditingExtraTextId(null); setActiveExtraTextId(null); }}
                    style={{ padding: '5px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', color: '#f87171', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', boxShadow: 'none' }}
                  >✕ {t('ed_delete')}</button>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(167,139,250,0.5)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>{t('ed_inline_hint')}</span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* TIMELINE INFERIOR */}
      <div className="cs-timeline" style={{ 
        height: '210px', 
        background: '#080808', 
        borderTop: '1px solid rgba(255,255,255,0.07)', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        
        {/* CONTROLES E ZOOM */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 16px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.07)', width: '100%', boxSizing: 'border-box' }}>
            <button onClick={async () => {
              const audio = audioRef.current;
              if (isPlaying) {
                isPlayingRef.current = false;
                if (audio) {
                  audio.pause();
                  // Salva posição atual em virtualTimeRef para que o play retome de onde parou
                  virtualTimeRef.current = audioOffset + (audio.currentTime - audioTrimStart);
                  setCurrentTime(virtualTimeRef.current);
                }
                if (clockIntervalRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; }
                stopAllVideoAudio();
                setIsPlaying(false);
              } else {
                // Iniciar — atualiza isPlayingRef SINCRONAMENTE antes de qualquer play()
                // Sem isso, o RAF (60fps) vê playing=false enquanto vídeo está tocando e pausa tudo
                isPlayingRef.current = true;
                // Cria AC dentro do gesto do usuario — unica forma garantida de ter estado running.
                // AC criado durante upload fica suspended; resume() apos async nao e garantido.
                if (!videoAudioACRef.current || videoAudioACRef.current.state === 'closed' || videoAudioACRef.current.state === 'suspended') {
                  try { if (videoAudioACRef.current) videoAudioACRef.current.close(); } catch {}
                  videoAudioACRef.current = new (window.AudioContext || window.webkitAudioContext)();
                }
                const tNow = virtualTimeRef.current;
                // Pré-posiciona vídeos ainda não ativos no trimStart (evita delay quando chegarem)
                videosRef.current.forEach(v => {
                  if (!v.videoEl || v.videoEl.seeking) return;
                  const trimSt = v.trimStart ?? 0;
                  if (tNow < v.start && Math.abs(v.videoEl.currentTime - trimSt) > 0.05) {
                    v.videoEl.currentTime = trimSt;
                  }
                });
                const hasPreroll = audio && tNow < audioOffset;
                videosRef.current.forEach(v => {
                  if (!v.videoEl) return;
                  const trimSt   = v.trimStart ?? 0;
                  const vidSpd   = v.vidSpeed ?? 1;
                  const rawDur   = v.rawDuration ?? v.videoEl.duration ?? (v.end - v.start);
                  const effEnd   = v.start + (rawDur - trimSt) / Math.max(0.25, vidSpd);
                  if (tNow < v.start || tNow >= effEnd) return;
                  const rel = Math.max(0, Math.min(trimSt + (tNow - v.start) * vidSpd, (v.videoEl.duration || 0) - 0.033));
                  v.videoEl.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current * vidSpd));
                  if (Math.abs(v.videoEl.currentTime - rel) > 0.05) v.videoEl.currentTime = rel;
                  if (hasPreroll) {
                    // Pre-roll: usa áudio nativo (muted=false). Web Audio depende do
                    // AudioContext suspenso criado no upload — resume() não é garantido
                    // antes das chamadas seguintes em async handlers React.
                    v.videoEl.muted = false;
                    v.videoEl.volume = Math.max(0, Math.min(1, projectVolumeRef.current * (v.vidVolume ?? 1)));
                  } else {
                    // Sem pré-roll: Web Audio para volume + sincronismo
                    v.videoEl.muted = true;
                    startVideoAudio(v, tNow);
                  }
                  v.videoEl.play().catch(() => {});
                });
                if (audio) {
                  audio.volume       = Math.max(0, Math.min(1, projectVolumeRef.current));
                  audio.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                  const tNowAudio = virtualTimeRef.current;
                  if (tNowAudio >= audioOffset) {
                    const relAudio = audioTrimStart + (tNowAudio - audioOffset);
                    if (Math.abs(audio.currentTime - relAudio) > 0.1) audio.currentTime = relAudio;
                    audio.play().catch(() => {});
                  } else {
                    const startWallPre = Date.now();
                    const startVirtPre = tNowAudio;
                    const clockSpdPre = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                    if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
                    clockIntervalRef.current = setInterval(() => {
                      if (!isPlayingRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; return; }
                      const newTimePre = startVirtPre + (Date.now() - startWallPre) / 1000 * clockSpdPre;
                      virtualTimeRef.current = newTimePre;
                      setCurrentTime(newTimePre);
                      // Ativa vídeos cujo start foi cruzado durante o pré-roll
                      videosRef.current.forEach(v => {
                        if (!v.videoEl || !v.videoEl.paused) return;
                        const ts = v.trimStart ?? 0;
                        const vs = v.vidSpeed ?? 1;
                        const rd = v.rawDuration ?? v.videoEl.duration ?? (v.end - v.start);
                        const ee = v.start + (rd - ts) / Math.max(0.25, vs);
                        if (newTimePre >= v.start && newTimePre < ee) {
                          const rel = Math.max(0, Math.min(ts + (newTimePre - v.start) * vs, (v.videoEl.duration || 0) - 0.033));
                          if (Math.abs(v.videoEl.currentTime - rel) > 0.1) v.videoEl.currentTime = rel;
                          v.videoEl.muted = false;
                          v.videoEl.volume = Math.max(0, Math.min(1, projectVolumeRef.current * (v.vidVolume ?? 1)));
                          v.videoEl.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current * vs));
                          v.videoEl.play().catch(() => {});
                        } else if (newTimePre >= ee && !v.videoEl.paused) {
                          v.videoEl.pause();
                        }
                      });
                      if (newTimePre >= audioOffsetRef.current) {
                        clearInterval(clockIntervalRef.current); clockIntervalRef.current = null;
                        // Transição pré-roll → áudio principal:
                        // troca vídeos ativos de áudio nativo para Web Audio
                        videosRef.current.forEach(v2 => {
                          if (!v2.videoEl || v2.muted) return;
                          const ts2 = v2.trimStart ?? 0;
                          const vs2 = v2.vidSpeed ?? 1;
                          const rd2 = v2.rawDuration ?? v2.videoEl.duration ?? (v2.end - v2.start);
                          const ee2 = v2.start + (rd2 - ts2) / Math.max(0.25, vs2);
                          if (newTimePre >= v2.start && newTimePre < ee2) {
                            v2.videoEl.muted = true;
                            startVideoAudio(v2, newTimePre);
                          }
                        });
                        audio.currentTime = audioTrimStartRef.current || 0;
                        audio.volume = Math.max(0, Math.min(1, projectVolumeRef.current));
                        audio.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                        audio.play().catch(() => {});
                      }
                    }, 30);
                  }
                } else {
                  // Sem áudio: clock virtual baseado em Date.now()
                  const startWall = Date.now();
                  const startVirt = virtualTimeRef.current;
                  const clockSpd2 = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                  if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
                  clockIntervalRef.current = setInterval(() => {
                    const elapsed = (Date.now() - startWall) / 1000;
                    const newTime = startVirt + elapsed * clockSpd2;
                    // Ativa vídeos que entram no range durante playback (sem áudio de fundo)
                    videosRef.current.forEach(v => {
                      if (!v.videoEl || v.muted) return;
                      const ts = v.trimStart ?? 0;
                      const vs = v.vidSpeed ?? 1;
                      const rd = v.rawDuration ?? v.videoEl.duration ?? (v.end - v.start);
                      const ee = v.start + (rd - ts) / Math.max(0.25, vs);
                      if (newTime >= v.start && newTime < ee && v.videoEl.paused) {
                        const rel = Math.max(0, Math.min(ts + (newTime - v.start) * vs, (v.videoEl.duration || 0) - 0.033));
                        v.videoEl.muted = true;
                        v.videoEl.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current * vs));
                        if (Math.abs(v.videoEl.currentTime - rel) > 0.1) v.videoEl.currentTime = rel;
                        v.videoEl.play().catch(() => {});
                        startVideoAudio(v, newTime);
                      }
                    });
                    // Para automaticamente ao final do conteúdo (sem áudio)
                    const contentEnd = Math.max(
                      lyricsRef.current.reduce((m, l) => Math.max(m, l.end || 0), 0),
                      imagesRef.current.reduce((m, i) => Math.max(m, i.end || 0), 0),
                      videosRef.current.reduce((m, v) => Math.max(m, v.end || 0), 0),
                    );
                    if (contentEnd > 0 && newTime >= contentEnd) {
                      clearInterval(clockIntervalRef.current);
                      clockIntervalRef.current = null;
                      virtualTimeRef.current = contentEnd;
                      setCurrentTime(contentEnd);
                      setIsPlaying(false);
                      return;
                    }
                    virtualTimeRef.current = newTime;
                    setCurrentTime(newTime);
                  }, 30);
                }
                setIsPlaying(true);
              }
            }} style={{ background: isPlaying ? '#00BFFF' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,191,255,0.25)', padding: '6px 16px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: isPlaying ? '#000' : '#f0f0f0', boxShadow: isPlaying ? '0 8px 20px rgba(0,191,255,0.3)' : 'none' }}>
              {isPlaying ? t('ed_pause') : t('ed_play')}
            </button>
            <button onClick={handleStopPlayback} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '6px 16px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#f87171', boxShadow: 'none' }}>
              {t('ed_stop')}
            </button>
            <span style={{ fontSize: '12px', color: '#00BFFF', fontWeight: 'bold', minWidth: '85px' }}>{formatTime(currentTime / projectSpeed)} / {formatTime(duration / projectSpeed)}</span>

            {/* ── Separador ── */}
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)', margin: '0 2px' }} />

            {/* Volume — por vídeo se selecionado, global se não */}
            {(() => {
              const selVid = activeVideoId ? videos.find(v => v.id === activeVideoId) : null;
              const volVal = selVid ? (selVid.vidVolume ?? 1) : projectVolume;
              const isPerVid = !!selVid;
              const accentCol = isPerVid ? '#a78bfa' : '#00BFFF';
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: accentCol, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                    {volVal === 0 ? '🔇' : volVal < 0.5 ? '🔉' : '🔊'}
                    {isPerVid && <span style={{ display: 'block', fontSize: 8, color: '#a78bfa' }}>vídeo</span>}
                  </span>
                  <input type="range" min={0} max={1} step={0.01} value={volVal}
                    onChange={e => {
                      const val = +e.target.value;
                      if (isPerVid) {
                        setVideos(prev => prev.map(v => {
                          if (v.id !== activeVideoId) return v;
                          if (v.videoEl) v.videoEl.volume = Math.max(0, Math.min(1, val * projectVolumeRef.current));
                          return { ...v, vidVolume: val };
                        }));
                      } else {
                        setVolume(val);
                        // Aplica também aos vídeos sem volume individual customizado
                        videosRef.current.forEach(v => { if (v.videoEl) v.videoEl.volume = Math.max(0, Math.min(1, val * (v.vidVolume ?? 1))); });
                      }
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    style={{ width: 80, accentColor: accentCol, cursor: 'pointer' }} />
                  <span style={{ fontSize: 10, color: volVal !== 1 ? accentCol : '#555', minWidth: 28, fontWeight: 700 }}>{Math.round(volVal * 100)}%</span>
                </div>
              );
            })()}

            {/* ── Separador ── */}
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)', margin: '0 2px' }} />

            {/* Velocidade — por vídeo se selecionado, global se não */}
            {(() => {
              const selVid = activeVideoId ? videos.find(v => v.id === activeVideoId) : null;
              const spdVal = selVid ? (selVid.vidSpeed ?? 1) : projectSpeed;
              const isPerVid = !!selVid;
              const accentCol = isPerVid ? '#a78bfa' : '#00BFFF';
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, color: accentCol, fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                    ⚡{isPerVid && <span style={{ display: 'block', fontSize: 8, color: '#a78bfa' }}>vídeo</span>}
                  </span>
                  <input type="range" min={0.25} max={4} step={0.05} value={spdVal}
                    onChange={e => {
                      const val = +e.target.value;
                      if (isPerVid) {
                        setVideos(prev => {
                          // Calcula o novo end do vídeo alterado
                          const changedIdx = prev.findIndex(v => v.id === activeVideoId);
                          if (changedIdx < 0) return prev;
                          const changed = prev[changedIdx];
                          if (changed.videoEl) changed.videoEl.playbackRate = Math.max(0.25, Math.min(4, val * projectSpeedRef.current));
                          const raw = changed.rawDuration ?? (changed.end - changed.start);
                          const oldEnd = changed.end;
                          const newEnd = changed.start + raw / val;
                          const delta = newEnd - oldEnd; // negativo se acelerou, positivo se desacelerou

                          return prev.map((v, idx) => {
                            if (v.id === activeVideoId) {
                              return { ...v, vidSpeed: val, rawDuration: raw, end: newEnd };
                            }
                            // Vídeos APÓS o alterado: deslocam de acordo com o delta
                            if (idx > changedIdx) {
                              return { ...v, start: v.start + delta, end: v.end + delta };
                            }
                            return v;
                          });
                        });
                      } else {
                        setSpeed(val);
                        // Velocidade global: recalcula end de todos os vídeos
                        setVideos(prev => prev.map(v => {
                          if (v.videoEl) v.videoEl.playbackRate = Math.max(0.25, Math.min(4, val * (v.vidSpeed ?? 1)));
                          return v; // end global não muda (projectSpeed afeta só playback, não layout)
                        }));
                      }
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    onPointerDown={e => e.stopPropagation()}
                    style={{ width: 80, accentColor: accentCol, cursor: 'pointer' }} />
                  <span style={{ fontSize: 10, color: spdVal !== 1 ? accentCol : '#555', minWidth: 28, fontWeight: 700 }}>{spdVal.toFixed(2)}×</span>
                </div>
              );
            })()}
            
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#555' }}>{t('ed_zoom')}</span>
              <input type="range" min="20" max="150" value={zoom} onChange={(e) => setZoom(parseInt(e.target.value))} style={{ cursor: 'pointer', accentColor: '#00BFFF' }} />
            </div>
        </div>

        {/* ÁREA DE ROLAGEM */}
        <div 
          ref={timelineScrollRef}
          style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '10px', position: 'relative' }}
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            {
              const isScrubTarget = e.target === e.currentTarget || ['track-bg','wave-container','video-track-row','image-track-row'].includes(e.target.id);
              if (isScrubTarget) { setIsScrubbing(true); scrubToClientX(e.clientX); }
            }
          }}
          onDoubleClick={(e) => {
            const isScrubTarget = e.target === e.currentTarget || ['track-bg','wave-container','video-track-row','image-track-row'].includes(e.target.id);
            if (isScrubTarget) {
              scrubToClientX(e.clientX);
              const audio = audioRef.current;
              if (audio) { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
            }
          }}
          onClick={(e) => {
            const isScrubTarget = e.target === e.currentTarget || ['track-bg','wave-container','video-track-row','image-track-row'].includes(e.target.id);
            if (isScrubTarget) { scrubToClientX(e.clientX); }
          }}
        >
          <div id="track-bg" style={{ position: 'relative', height: '155px', width: timelineWidth + 'px', background: '#0d0d0d', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)', overflow: 'hidden' }}>

            {/* RÉGUA DE TEMPO */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: audioPxWidth + 'px', height: '14px', pointerEvents: 'none', zIndex: 5 }}>
              {rulerMarkers.map((t) => (
                <div key={t} style={{ position: 'absolute', left: t * zoom + 'px', top: 0, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '1px', height: '8px', backgroundColor: 'rgba(0,191,255,0.35)' }} />
                  <span style={{ fontSize: '9px', color: 'rgba(0,191,255,0.6)', whiteSpace: 'nowrap', transform: 'translateX(-50%)', marginLeft: '1px', lineHeight: 1 }}>
                    {formatTime(t)}
                  </span>
                </div>
              ))}
            </div>

            {/* FAIXA DE ÁUDIO — bloco arrastável com trim */}
            {(audioSrc || audioFile || audioBase64) && (
              <div
                onMouseDown={(e) => handleAudioTimelineMouseDown('move', e)}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;} setAudioSrc(null);setAudioFile(null);setAudioBase64(null);setDuration(0);setAudioOffset(0);setAudioTrimStart(0);setAudioTrimEnd(null); }}
                style={{
                  position: 'absolute',
                  left: `${audioOffset * zoom}px`,
                  width: `${((audioTrimEnd !== null ? audioTrimEnd : (duration || 60)) - audioTrimStart) * zoom}px`,
                  top: '113px',
                  height: '28px',
                  background: 'rgba(0,191,255,0.18)',
                  border: '1px solid rgba(0,191,255,0.5)',
                  borderRadius: '8px',
                  cursor: 'grab',
                  overflow: 'hidden',
                  zIndex: 20,
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Alça trim esquerda */}
                <div
                  onMouseDown={(e) => { e.stopPropagation(); handleAudioTimelineMouseDown('trim-start', e); }}
                  style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '10px', cursor: 'ew-resize', background: 'rgba(0,191,255,0.4)', borderTopLeftRadius: '7px', borderBottomLeftRadius: '7px', zIndex: 3 }}
                />
                {/* Waveform visual */}
                <canvas
                  id="wave-container"
                  ref={waveformCanvasRef}
                  width={Math.ceil(audioPxWidth)}
                  height={24}
                  style={{ position: 'absolute', left: `${-audioTrimStart * zoom}px`, top: 2, opacity: 0.7, pointerEvents: 'none' }}
                />
                {/* Label */}
                <span style={{ position: 'absolute', left: 14, fontSize: 9, color: '#00BFFF', fontWeight: 700, pointerEvents: 'none', whiteSpace: 'nowrap', textShadow: '0 1px 4px #000' }}>🎵 ÁUDIO</span>
                {/* Botão remover */}
                <button
                  onMouseDown={e => e.stopPropagation()}
                  onClick={e => { e.stopPropagation(); if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0;} setAudioSrc(null);setAudioFile(null);setAudioBase64(null);setDuration(0);setAudioOffset(0);setAudioTrimStart(0);setAudioTrimEnd(null); }}
                  title="Remover áudio (Delete)"
                  style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:'rgba(239,68,68,0.85)', border:'none', borderRadius:4, color:'#fff', fontSize:10, fontWeight:700, cursor:'pointer', padding:'2px 6px', lineHeight:1, zIndex:4 }}
                >✕</button>
                {/* Alça trim direita */}
                <div
                  onMouseDown={(e) => { e.stopPropagation(); handleAudioTimelineMouseDown('trim-end', e); }}
                  style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '10px', cursor: 'ew-resize', background: 'rgba(0,191,255,0.4)', borderTopRightRadius: '7px', borderBottomRightRadius: '7px', zIndex: 3 }}
                />
              </div>
            )}

            {/* BARRA FINA QUE MARCA O FIM DA MÚSICA */}
            {duration > 0 && (
              <div style={{ position: 'absolute', left: audioPxWidth + 'px', top: 0, bottom: 0, width: '2px', backgroundColor: 'rgba(0,191,255,0.4)', pointerEvents: 'none', zIndex: 8 }} />
            )}

            <div ref={playheadRef} 
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsScrubbing(true);
              }}
              style={{ position: 'absolute', left: 0, transform: 'translateX(0px)', top: 6, bottom: 6, width: '10px', marginLeft: '-4px', backgroundColor: 'transparent', zIndex: 110, cursor: 'ew-resize', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ width: '2px', height: '100%', backgroundColor: '#00BFFF', boxShadow: '0 0 14px rgba(0,191,255,0.7)', position: 'relative', pointerEvents: 'none' }}>
                <div style={{ width: '0', height: '0', borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '12px solid #00BFFF', marginLeft: '-6px' }} />
              </div>
            </div>

            <div style={{ position: 'absolute', top: '42px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '80px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '114px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
            {/* Labels das faixas */}
            <div style={{ position: 'absolute', right: 6, top: 16, fontSize: 9, color: 'rgba(0,191,255,0.4)', pointerEvents: 'none' }}>LETRA</div>
            <div style={{ position: 'absolute', right: 6, top: 54, fontSize: 9, color: 'rgba(251,191,36,0.4)', pointerEvents: 'none' }}>IMG</div>
            <div style={{ position: 'absolute', right: 6, top: 88, fontSize: 9, color: 'rgba(167,139,250,0.4)', pointerEvents: 'none' }}>VID</div>
            
            {lyrics.map((l) => (
              <div 
                key={l.id}
                onMouseDown={(e) => handleTimelineMouseDown(l.id, 'move', e)}
                onContextMenu={(e) => { e.preventDefault(); removeLyric(l.id); }}
                style={{
                  position: 'absolute',
                  left: l.start * zoom + 'px',
                  width: (l.end - l.start) * zoom + 'px',
                  height: '28px',
                  top: '9px',
                  background: activeLyricId === l.id ? '#00BFFF' : 'rgba(0,191,255,0.55)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  cursor: 'grab',
                  border: activeLyricId === l.id ? '2px solid #fff' : '1px solid rgba(0,191,255,0.3)',
                  userSelect: 'none',
                  zIndex: activeLyricId === l.id ? 50 : 10,
                  boxShadow: '0 4px 14px rgba(0,191,255,0.2)'
                }}
              >
                <div onMouseDown={(e) => handleTimelineMouseDown(l.id, 'resize-start', e)} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px', cursor: 'ew-resize', backgroundColor: 'rgba(0,0,0,0.25)', borderTopLeftRadius: '18px', borderBottomLeftRadius: '18px' }} />
                <span style={{ padding: '0 10px', textAlign: 'center', pointerEvents: 'none', fontWeight: 'bold' }}>{l.text}</span>
                <div onMouseDown={(e) => handleTimelineMouseDown(l.id, 'resize-end', e)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12px', cursor: 'ew-resize', backgroundColor: 'rgba(0,0,0,0.25)', borderTopRightRadius: '18px', borderBottomRightRadius: '18px' }} />
              </div>
            ))}

            {/* Área de scrub para a faixa de vídeo (clique aqui move o playhead) */}
            <div id="video-track-row" style={{ position: 'absolute', left: 0, right: 0, top: '76px', height: '42px', zIndex: 1, cursor: 'crosshair' }} />

            {videos.map((v) => (
              <div
                key={v.id}
                onMouseDown={(e) => handleVideoTimelineMouseDown(v.id, 'move', e)}
                onContextMenu={(e) => {
  e.preventDefault(); pushHistory();
  if (v.videoEl) {
    v.videoEl.pause();
    videoTrashRef.current[v.id] = { videoEl: v.videoEl, audioBuffer: v.audioBuffer, src: v.src };
  }
  setVideos(prev => prev.filter(vv => vv.id !== v.id));
  if (activeVideoId === v.id) setActiveVideoId(null);
}}
                style={{
                  position: 'absolute',
                  left: v.start * zoom + 'px',
                  width: (v.end - v.start) * zoom + 'px',
                  height: '26px',
                  top: '84px',
                  background: activeVideoId === v.id ? 'rgba(167,139,250,1)' : 'rgba(167,139,250,0.55)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  cursor: 'grab',
                  border: activeVideoId === v.id ? '2px solid #c4b5fd' : '1px solid rgba(167,139,250,0.3)',
                  userSelect: 'none',
                  zIndex: activeVideoId === v.id ? 65 : 25,
                  color: '#000',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px rgba(167,139,250,0.2)',
                  overflow: 'hidden',
                }}
              >
                {/* Alça resize esquerda */}
                <div onMouseDown={(e) => handleVideoTimelineMouseDown(v.id, 'resize-start', e)} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px', cursor: 'ew-resize', backgroundColor: 'rgba(0,0,0,0.25)', borderTopLeftRadius: '18px', borderBottomLeftRadius: '18px', zIndex: 3 }} />
                {/* Botão mute — fixo no canto esquerdo, sobre tudo */}
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newMuted = !v.muted;
                    if (v.videoEl) v.videoEl.muted = newMuted;
                    setVideos(prev => prev.map(vv => vv.id === v.id ? { ...vv, muted: newMuted } : vv));
                  }}
                  style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    zIndex: 10, background: v.muted ? 'rgba(239,68,68,0.85)' : 'rgba(0,0,0,0.5)',
                    border: 'none', borderRadius: 6, padding: '2px 6px',
                    fontSize: 11, color: '#fff', cursor: 'pointer', lineHeight: 1.4,
                  }}
                  title={v.muted ? t('vid_unmute') : t('vid_mute')}
                >
                  {v.muted ? '🔇' : '🔊'}
                </button>
                {/* Label central */}
                <span style={{ fontSize: 10, fontWeight: 'bold', color: '#000', pointerEvents: 'none', paddingLeft: 36 }}>🎬 VID</span>
                {/* Alça resize direita */}
                <div onMouseDown={(e) => handleVideoTimelineMouseDown(v.id, 'resize-end', e)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12px', cursor: 'ew-resize', backgroundColor: 'rgba(0,0,0,0.25)', borderTopRightRadius: '18px', borderBottomRightRadius: '18px', zIndex: 3 }} />
              </div>
            ))}

            {/* Blocos de stickers na timeline */}
            {stickers.filter(stk => stk.start !== undefined).map(stk => (
              <div
                key={stk.id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  _setDragging({ id: stk.id, type: 'move', itemKind: 'sticker-timeline',
                    initialX: e.clientX, initialStart: stk.start, initialEnd: stk.end });
                }}
                onContextMenu={(e) => { e.preventDefault(); removeSticker(stk.id); }}
                style={{
                  position: 'absolute',
                  left: stk.start * zoom + 'px',
                  width: Math.max(24, (stk.end - stk.start) * zoom) + 'px',
                  height: '18px',
                  top: '128px',
                  background: 'rgba(251,191,36,0.35)',
                  border: '1px solid rgba(251,191,36,0.6)',
                  borderRadius: '6px',
                  cursor: 'grab',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, userSelect: 'none', zIndex: 20, overflow: 'hidden',
                }}
              >
                <div onMouseDown={(e) => { e.stopPropagation(); _setDragging({ id: stk.id, type: 'resize-start', itemKind: 'sticker-timeline', initialX: e.clientX, initialStart: stk.start, initialEnd: stk.end }); }} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px', cursor: 'ew-resize', background: 'rgba(251,191,36,0.5)', borderRadius: '5px 0 0 5px' }} />
                <span style={{ pointerEvents: 'none', fontSize: 10 }}>{stk.content}</span>
                <div onMouseDown={(e) => { e.stopPropagation(); _setDragging({ id: stk.id, type: 'resize-end', itemKind: 'sticker-timeline', initialX: e.clientX, initialStart: stk.start, initialEnd: stk.end }); }} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '8px', cursor: 'ew-resize', background: 'rgba(251,191,36,0.5)', borderRadius: '0 5px 5px 0' }} />
              </div>
            ))}

            {images.map((item) => (
              <div 
                key={item.id}
                onMouseDown={(e) => handleImageTimelineMouseDown(item.id, 'move', e)}
                onContextMenu={(e) => { e.preventDefault(); setImages(prev => prev.filter(img => img.id !== item.id)); }}
                style={{
                  position: 'absolute',
                  left: item.start * zoom + 'px',
                  width: (item.end - item.start) * zoom + 'px',
                  height: '26px',
                  top: '48px',
                  background: activeImageId === item.id ? 'rgba(251,191,36,0.9)' : 'rgba(251,191,36,0.5)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  cursor: 'grab',
                  border: activeImageId === item.id ? '2px solid #fbbf24' : '1px solid rgba(251,191,36,0.3)',
                  userSelect: 'none',
                  zIndex: activeImageId === item.id ? 60 : 20,
                  color: '#000',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px rgba(251,191,36,0.15)'
                }}
              >
                <div onMouseDown={(e) => handleImageTimelineMouseDown(item.id, 'resize-start', e)} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px', cursor: 'ew-resize', backgroundColor: 'rgba(0,0,0,0.25)', borderTopLeftRadius: '18px', borderBottomLeftRadius: '18px' }} />
                <span style={{ padding: '0 10px', textAlign: 'center', pointerEvents: 'none' }}>IMG</span>
                <div onMouseDown={(e) => handleImageTimelineMouseDown(item.id, 'resize-end', e)} style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12px', cursor: 'ew-resize', backgroundColor: 'rgba(0,0,0,0.25)', borderTopRightRadius: '18px', borderBottomRightRadius: '18px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onLoadedMetadata={(e) => {
            setDuration(e.target.duration);
            setAudioOffset(0);
            setAudioTrimStart(0);
            setAudioTrimEnd(null);
            e.target.volume       = Math.max(0, Math.min(1, projectVolumeRef.current));
            e.target.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current));
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* ── Botão flutuante de suporte IA ── */}
      <button
        onClick={() => { setChatOpen(o => !o); setChatTopic(null); }}
        title="Suporte CanvasSync Pro"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,#00BFFF,#0070ff)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,191,255,0.45)',
          fontSize: 22,
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {chatOpen ? '✕' : '🤖'}
      </button>
      {chatOpen && <SupportChat chatTopic={chatTopic} setChatTopic={setChatTopic} setChatOpen={setChatOpen} />}

    </div>
  );
}

export default App;