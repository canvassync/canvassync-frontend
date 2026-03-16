// CanvasSync v5 — stickers fix final
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


// Calcula offset de animação de sticker baseado em tempo real
const SFX_LIST = [
  // ── Reações / Público ─────────────────────────────────────────────────────
  { key:'applause',  emoji:'👏', name:'Aplausos',     dur:2.5 },
  { key:'crowd',     emoji:'🎉', name:'Multidão',     dur:2.5 },
  { key:'laugh',     emoji:'😂', name:'Risadas',      dur:2.2 },
  { key:'boo',       emoji:'👎', name:'Vaias',        dur:1.8 },
  { key:'gasp',      emoji:'😱', name:'Suspiro',      dur:0.8 },
  { key:'woah',      emoji:'😮', name:'Woah',         dur:0.9 },
  // ── Música / Ritmo ────────────────────────────────────────────────────────
  { key:'kick',      emoji:'🥁', name:'Bumbo',        dur:0.6 },
  { key:'drums',     emoji:'🎵', name:'Bateria',      dur:1.6 },
  { key:'snare',     emoji:'🪘', name:'Caixa',        dur:0.4 },
  { key:'hihat',     emoji:'🎶', name:'Hi-Hat',       dur:0.3 },
  { key:'bass',      emoji:'🎸', name:'Baixo',        dur:1.0 },
  { key:'fanfare',   emoji:'🎺', name:'Fanfarra',     dur:2.2 },
  { key:'horn',      emoji:'📯', name:'Buzina',       dur:1.0 },
  { key:'vinyl',     emoji:'💿', name:'Vinil',        dur:1.2 },
  // ── Ações / Impacto ───────────────────────────────────────────────────────
  { key:'explosion', emoji:'💥', name:'Explosão',     dur:2.0 },
  { key:'punch',     emoji:'👊', name:'Soco',         dur:0.4 },
  { key:'whoosh',    emoji:'💨', name:'Whoosh',       dur:0.8 },
  { key:'swoosh',    emoji:'⚡', name:'Swoosh',       dur:0.4 },
  { key:'thunder',   emoji:'⛈️', name:'Trovão',      dur:3.0 },
  { key:'gunshot',   emoji:'🔫', name:'Tiro',         dur:0.5 },
  { key:'glass_break',emoji:'🔨',name:'Vidro',        dur:1.0 },
  { key:'thud',      emoji:'🪨', name:'Impacto',      dur:0.5 },
  // ── Interface / Feedback ──────────────────────────────────────────────────
  { key:'success',   emoji:'✅', name:'Sucesso',      dur:1.0 },
  { key:'error',     emoji:'❌', name:'Erro',         dur:0.6 },
  { key:'notify',    emoji:'🔕', name:'Notificação',  dur:0.5 },
  { key:'bell',      emoji:'🔔', name:'Sino',         dur:1.8 },
  { key:'coin',      emoji:'🪙', name:'Moeda',        dur:0.6 },
  { key:'powerup',   emoji:'🎮', name:'Power Up',     dur:1.2 },
  { key:'levelup',   emoji:'⬆️', name:'Level Up',    dur:1.5 },
  { key:'pop',       emoji:'🎈', name:'Pop',          dur:0.3 },
  { key:'click',     emoji:'🖱️', name:'Click',       dur:0.15 },
  { key:'swipe',     emoji:'👆', name:'Swipe',        dur:0.3 },
  // ── Natureza / Ambiente ───────────────────────────────────────────────────
  { key:'drop',      emoji:'💧', name:'Gota',         dur:0.6 },
  { key:'rain',      emoji:'🌧️', name:'Chuva',       dur:2.0 },
  { key:'wind',      emoji:'🌬️', name:'Vento',       dur:2.0 },
  { key:'fire',      emoji:'🔥', name:'Fogo',         dur:2.0 },
  { key:'ocean',     emoji:'🌊', name:'Oceano',       dur:3.0 },
  // ── Especiais ─────────────────────────────────────────────────────────────
  { key:'laser',     emoji:'🔆', name:'Laser',        dur:0.7 },
  { key:'glitch',    emoji:'📺', name:'Glitch',       dur:0.6 },
  { key:'rewind',    emoji:'⏪', name:'Rebobinar',    dur:0.8 },
  { key:'heartbeat', emoji:'💓', name:'Coração',      dur:1.2 },
  { key:'glass',     emoji:'🥂', name:'Brinde',       dur:2.0 },
  { key:'cash',      emoji:'💰', name:'Dinheiro',     dur:1.0 },
];

const synthesizeSfxBuffer = async (key) => {
  const SR = 44100;
  const dur = (SFX_LIST.find(s => s.key === key) || {dur:1}).dur;
  const len = Math.ceil(SR * dur);
  const ctx = new OfflineAudioContext(2, len, SR);
  const dest = ctx.destination;

  const osc = (type, freq, gainVal, startT, stopT, freqEnd) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, startT);
    if (freqEnd !== undefined) o.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), stopT);
    g.gain.setValueAtTime(gainVal, startT);
    o.connect(g); g.connect(dest);
    o.start(startT); o.stop(stopT);
    return g;
  };
  const env = (gainNode, a, d, s, r, startT) => {
    const g = gainNode.gain;
    g.setValueAtTime(0, startT);
    g.linearRampToValueAtTime(1, startT + a);
    g.linearRampToValueAtTime(s, startT + a + d);
    g.setValueAtTime(s, startT + a + d);
    g.linearRampToValueAtTime(0, startT + a + d + r);
  };
  const noise = (gainVal, startT, stopT, filterType, filterFreq) => {
    const bufLen = Math.ceil(SR * (stopT - startT));
    const nb = ctx.createBuffer(1, bufLen, SR);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < bufLen; i++) nd[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = nb;
    const g = ctx.createGain(); g.gain.value = gainVal;
    if (filterType) {
      const f = ctx.createBiquadFilter();
      f.type = filterType; f.frequency.value = filterFreq || 1000;
      src.connect(f); f.connect(g);
    } else { src.connect(g); }
    g.connect(dest);
    src.start(startT); src.stop(stopT);
    return g;
  };

  switch (key) {
    case 'applause': {
      const g = noise(0, 0, dur, 'bandpass', 2200);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.5, 0.4);
      g.gain.setValueAtTime(0.5, dur - 0.6);
      g.gain.linearRampToValueAtTime(0, dur);
      noise(0.15, 0, dur, 'highpass', 4000);
      break;
    }
    case 'explosion': {
      const g = noise(0, 0, dur, 'lowpass', 300);
      g.gain.setValueAtTime(0.8, 0);
      g.gain.exponentialRampToValueAtTime(0.01, dur);
      const g2 = noise(0, 0, 0.2, null, 0);
      g2.gain.setValueAtTime(0.6, 0);
      g2.gain.exponentialRampToValueAtTime(0.01, 0.2);
      const og = osc('sine', 80, 0.6, 0, 0.3, 30);
      og.gain.exponentialRampToValueAtTime(0.01, 0.3);
      break;
    }
    case 'whoosh': {
      const g = noise(0.5, 0, dur, 'bandpass', 3000);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.6, dur * 0.3);
      g.gain.linearRampToValueAtTime(0, dur);
      break;
    }
    case 'bell': {
      const freqs = [880, 1320, 2200, 3520];
      const vols  = [0.5, 0.25, 0.12, 0.06];
      freqs.forEach((f, i) => {
        const g = osc('sine', f, vols[i], 0, dur);
        g.gain.setValueAtTime(vols[i], 0);
        g.gain.exponentialRampToValueAtTime(0.001, dur);
      });
      break;
    }
    case 'kick': {
      const og = osc('sine', 150, 0.8, 0, 0.5, 40);
      og.gain.setValueAtTime(0.8, 0);
      og.gain.exponentialRampToValueAtTime(0.01, 0.4);
      const ng = noise(0, 0, 0.06, 'highpass', 3000);
      ng.gain.setValueAtTime(0.4, 0);
      ng.gain.exponentialRampToValueAtTime(0.01, 0.06);
      break;
    }
    case 'fanfare': {
      const notes = [[523,0],[659,0.3],[784,0.6],[1047,0.9]];
      notes.forEach(([f,t]) => {
        const g = osc('sawtooth', f, 0.15, t, t+0.6);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.2, t+0.05);
        g.gain.setValueAtTime(0.2, t+0.4);
        g.gain.linearRampToValueAtTime(0, t+0.6);
      });
      // final chord
      [523,659,784].forEach(f => {
        const g = osc('sawtooth', f, 0.12, 1.2, dur);
        g.gain.setValueAtTime(0.12, 1.2);
        g.gain.linearRampToValueAtTime(0, dur);
      });
      break;
    }
    case 'laser': {
      const g = osc('sawtooth', 1200, 0.4, 0, dur, 150);
      g.gain.setValueAtTime(0.4, 0);
      g.gain.exponentialRampToValueAtTime(0.01, dur);
      break;
    }
    case 'success': {
      [[523,0],[659,0.15],[784,0.3],[1047,0.45]].forEach(([f,t]) => {
        const g = osc('sine', f, 0.4, t, t+0.35);
        g.gain.setValueAtTime(0.4, t);
        g.gain.linearRampToValueAtTime(0, t+0.35);
      });
      break;
    }
    case 'error': {
      [[440,0],[330,0.2]].forEach(([f,t]) => {
        const g = osc('sawtooth', f, 0.35, t, t+0.25);
        g.gain.setValueAtTime(0.35, t);
        g.gain.linearRampToValueAtTime(0, t+0.25);
        noise(0.05, t, t+0.25, 'highpass', 2000);
      });
      break;
    }
    case 'notify': {
      [[880,0],[1047,0.18]].forEach(([f,t]) => {
        const g = osc('sine', f, 0.4, t, t+0.15);
        g.gain.setValueAtTime(0.4, t);
        g.gain.linearRampToValueAtTime(0, t+0.15);
      });
      break;
    }
    case 'coin': {
      [[1200,0],[1400,0.08],[1600,0.16]].forEach(([f,t]) => {
        const g = osc('sine', f, 0.35, t, t+0.2);
        g.gain.setValueAtTime(0.35, t);
        g.gain.exponentialRampToValueAtTime(0.001, t+0.2);
      });
      break;
    }
    case 'punch': {
      const og = osc('sine', 120, 0.6, 0, 0.3, 40);
      og.gain.setValueAtTime(0.6, 0);
      og.gain.exponentialRampToValueAtTime(0.01, 0.3);
      const ng = noise(0, 0, 0.08, 'lowpass', 500);
      ng.gain.setValueAtTime(0.5, 0);
      ng.gain.exponentialRampToValueAtTime(0.01, 0.08);
      break;
    }
    case 'glass': {
      [2093,2637,3136].forEach((f,i) => {
        const g = osc('sine', f, 0.2-i*0.05, 0, dur);
        g.gain.setValueAtTime(0.2-i*0.05, 0.005);
        g.gain.exponentialRampToValueAtTime(0.001, dur);
      });
      noise(0.08, 0, 0.05, 'highpass', 5000);
      break;
    }
    case 'powerup': {
      const g = osc('square', 220, 0.2, 0, 0.8, 880);
      g.gain.setValueAtTime(0.2, 0);
      g.gain.setValueAtTime(0.2, 0.7);
      g.gain.linearRampToValueAtTime(0, 0.8);
      [[880,0.8],[1047,0.9],[1319,1.0]].forEach(([f,t]) => {
        const g2 = osc('square', f, 0.25, t, t+0.2);
        g2.gain.setValueAtTime(0.25, t);
        g2.gain.linearRampToValueAtTime(0, t+0.2);
      });
      break;
    }
    case 'pop': {
      const og = osc('sine', 800, 0.6, 0, 0.15, 80);
      og.gain.setValueAtTime(0.6, 0);
      og.gain.exponentialRampToValueAtTime(0.01, 0.15);
      noise(0.3, 0, 0.04, null, 0);
      break;
    }
    case 'thunder': {
      const g1 = noise(0, 0, dur, 'lowpass', 200);
      g1.gain.setValueAtTime(0.01, 0);
      g1.gain.linearRampToValueAtTime(0.9, 0.05);
      g1.gain.exponentialRampToValueAtTime(0.1, 1.5);
      g1.gain.linearRampToValueAtTime(0, dur);
      noise(0.4, 0, 0.1, 'highpass', 2000);
      osc('sine', 60, 0.3, 0, 0.8, 30);
      break;
    }
    case 'heartbeat': {
      const beat = (t) => {
        const og = osc('sine', 100, 0.5, t, t+0.12, 40);
        og.gain.setValueAtTime(0.5, t);
        og.gain.exponentialRampToValueAtTime(0.01, t+0.12);
        const og2 = osc('sine', 80, 0.3, t+0.14, t+0.24, 35);
        og2.gain.setValueAtTime(0.3, t+0.14);
        og2.gain.exponentialRampToValueAtTime(0.01, t+0.24);
      };
      beat(0); beat(0.6);
      break;
    }
    case 'swoosh': {
      const g = noise(0, 0, dur, 'bandpass', 5000);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.7, dur * 0.2);
      g.gain.linearRampToValueAtTime(0, dur);
      break;
    }
    case 'horn': {
      const g = osc('sawtooth', 220, 0, 0, dur);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.4, 0.1);
      g.gain.setValueAtTime(0.4, dur-0.2);
      g.gain.linearRampToValueAtTime(0, dur);
      osc('sawtooth', 330, 0.15, 0, dur);
      break;
    }
    case 'crowd': {
      const g = noise(0, 0, dur, 'bandpass', 1800);
      g.gain.setValueAtTime(0.2, 0);
      g.gain.linearRampToValueAtTime(0.55, 0.5);
      g.gain.setValueAtTime(0.55, dur-0.5);
      g.gain.linearRampToValueAtTime(0.1, dur);
      noise(0.1, 0, dur, 'highpass', 3500);
      break;
    }
    case 'drop': {
      const g = osc('sine', 880, 0.5, 0, dur, 110);
      g.gain.setValueAtTime(0.5, 0);
      g.gain.exponentialRampToValueAtTime(0.001, dur);
      break;
    }
    case 'drums': {
      // kick at 0, 0.4, 0.8; snare at 0.2, 0.6, 1.0, 1.4
      [0, 0.4, 0.8, 1.2].forEach(t => {
        const og = osc('sine', 150, 0.7, t, t+0.3, 40);
        og.gain.setValueAtTime(0.7, t);
        og.gain.exponentialRampToValueAtTime(0.01, t+0.25);
      });
      [0.2, 0.6, 1.0, 1.4].forEach(t => {
        const ng = noise(0, t, t+0.15, 'bandpass', 3000);
        ng.gain.setValueAtTime(0.4, t);
        ng.gain.exponentialRampToValueAtTime(0.01, t+0.15);
      });
      break;
    }
    case 'woah': {
      const g = osc('sine', 200, 0.4, 0, dur, 800);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.4, 0.05);
      g.gain.setValueAtTime(0.4, dur-0.1);
      g.gain.linearRampToValueAtTime(0, dur);
      break;
    }
    case 'cash': {
      [[800,0],[1000,0.1],[1200,0.2],[1600,0.35],[2000,0.5]].forEach(([f,t]) => {
        const g = osc('triangle', f, 0.3, t, t+0.15);
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.001, t+0.15);
      });
      noise(0.1, 0, 0.05, 'highpass', 5000);
      break;
    }
    // ── Novos sons ────────────────────────────────────────────────────────────
    case 'laugh': {
      // Risadas: modulação de frequência em grupos de 3
      for (let i = 0; i < 6; i++) {
        const t0 = i * 0.35; const f = 300 + Math.random() * 200;
        const g = noise(0, t0, t0 + 0.25, 'bandpass', f);
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.4, t0 + 0.06);
        g.gain.linearRampToValueAtTime(0, t0 + 0.25);
      }
      break;
    }
    case 'boo': {
      const g = noise(0, 0, dur, 'bandpass', 800);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.5, 0.3);
      g.gain.setValueAtTime(0.5, dur - 0.4);
      g.gain.linearRampToValueAtTime(0, dur);
      const og = osc('sawtooth', 180, 0.15, 0, dur);
      og.gain.setValueAtTime(0.15, 0);
      og.gain.linearRampToValueAtTime(0, dur);
      break;
    }
    case 'gasp': {
      const g = noise(0, 0, 0.4, 'highpass', 1200);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.5, 0.1);
      g.gain.linearRampToValueAtTime(0, 0.4);
      osc('sine', 600, 0.2, 0.1, 0.4, 400);
      break;
    }
    case 'snare': {
      const ng = noise(0, 0, 0.2, 'bandpass', 3000);
      ng.gain.setValueAtTime(0.6, 0); ng.gain.exponentialRampToValueAtTime(0.001, 0.2);
      const og = osc('sine', 200, 0.4, 0, 0.1, 60);
      og.gain.setValueAtTime(0.4, 0); og.gain.exponentialRampToValueAtTime(0.001, 0.1);
      break;
    }
    case 'hihat': {
      const ng = noise(0, 0, 0.08, 'highpass', 8000);
      ng.gain.setValueAtTime(0.5, 0); ng.gain.exponentialRampToValueAtTime(0.001, 0.08);
      break;
    }
    case 'bass': {
      const og = osc('sine', 60, 0.7, 0, dur, 40);
      og.gain.setValueAtTime(0, 0);
      og.gain.linearRampToValueAtTime(0.7, 0.02);
      og.gain.setValueAtTime(0.7, 0.4);
      og.gain.linearRampToValueAtTime(0, dur);
      osc('sawtooth', 60, 0.1, 0, 0.05);
      break;
    }
    case 'vinyl': {
      // Crackle de vinil
      noise(0.15, 0, dur, 'highpass', 3000);
      for (let i = 0; i < 8; i++) {
        const t0 = i * dur / 8;
        const ng = noise(0, t0, t0 + 0.05, 'bandpass', 2000 + Math.random() * 3000);
        ng.gain.setValueAtTime(0.3 * Math.random(), t0);
        ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
      }
      break;
    }
    case 'gunshot': {
      const ng = noise(0, 0, 0.3, 'lowpass', 400);
      ng.gain.setValueAtTime(0.9, 0); ng.gain.exponentialRampToValueAtTime(0.001, 0.3);
      noise(0.4, 0, 0.08, null, 0);
      osc('sine', 100, 0.5, 0, 0.15, 30);
      break;
    }
    case 'glass_break': {
      noise(0.5, 0, 0.1, null, 0);
      for (let i = 0; i < 5; i++) {
        const t0 = 0.05 + i * 0.15; const f = 2000 + Math.random() * 4000;
        const ng = noise(0, t0, t0 + 0.2, 'highpass', f);
        ng.gain.setValueAtTime(0.3, t0); ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);
      }
      break;
    }
    case 'thud': {
      const og = osc('sine', 100, 0.7, 0, 0.4, 30);
      og.gain.setValueAtTime(0.7, 0); og.gain.exponentialRampToValueAtTime(0.001, 0.4);
      noise(0.3, 0, 0.08, 'lowpass', 300);
      break;
    }
    case 'levelup': {
      [[261,0],[329,0.2],[392,0.4],[523,0.6],[659,0.8],[784,1.0]].forEach(([f,t]) => {
        const g = osc('square', f, 0.2, t, t + 0.25);
        g.gain.setValueAtTime(0.2, t); g.gain.linearRampToValueAtTime(0, t + 0.25);
      });
      break;
    }
    case 'click': {
      const og = osc('sine', 1200, 0.5, 0, 0.05);
      og.gain.setValueAtTime(0.5, 0); og.gain.exponentialRampToValueAtTime(0.001, 0.05);
      break;
    }
    case 'swipe': {
      const g = noise(0.4, 0, 0.2, 'bandpass', 2000);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.4, 0.05);
      g.gain.linearRampToValueAtTime(0, 0.2);
      const og = osc('sine', 800, 0.2, 0, 0.2, 1600);
      og.gain.setValueAtTime(0.2, 0); og.gain.linearRampToValueAtTime(0, 0.2);
      break;
    }
    case 'rain': {
      noise(0.25, 0, dur, 'highpass', 4000);
      noise(0.1, 0, dur, 'bandpass', 1500);
      for (let i = 0; i < 12; i++) {
        const t0 = Math.random() * dur;
        const ng = noise(0, t0, t0 + 0.04, 'highpass', 5000 + Math.random() * 3000);
        ng.gain.setValueAtTime(0.15, t0); ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04);
      }
      break;
    }
    case 'wind': {
      const g = noise(0.3, 0, dur, 'bandpass', 600);
      g.gain.setValueAtTime(0.1, 0);
      g.gain.linearRampToValueAtTime(0.4, dur * 0.3);
      g.gain.linearRampToValueAtTime(0.2, dur * 0.7);
      g.gain.linearRampToValueAtTime(0.1, dur);
      noise(0.1, 0, dur, 'highpass', 2000);
      break;
    }
    case 'fire': {
      noise(0.25, 0, dur, 'bandpass', 800);
      noise(0.1, 0, dur, 'bandpass', 300);
      for (let i = 0; i < 10; i++) {
        const t0 = Math.random() * dur;
        const ng = noise(0, t0, t0 + 0.1, 'bandpass', 1000 + Math.random() * 1000);
        ng.gain.setValueAtTime(0.2, t0); ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.1);
      }
      break;
    }
    case 'ocean': {
      const g = noise(0.3, 0, dur, 'bandpass', 400);
      // Onda lenta
      for (let i = 0; i < 3; i++) {
        const t0 = i * (dur / 3);
        g.gain.setValueAtTime(0.15, t0);
        g.gain.linearRampToValueAtTime(0.35, t0 + dur/6);
        g.gain.linearRampToValueAtTime(0.15, t0 + dur/3);
      }
      noise(0.1, 0, dur, 'highpass', 2000);
      break;
    }
    case 'glitch': {
      for (let i = 0; i < 8; i++) {
        const t0 = i * 0.07; const f = 200 + Math.random() * 2000;
        const g = osc(i%2===0?'square':'sawtooth', f, 0.3, t0, t0 + 0.05);
        g.gain.setValueAtTime(0.3, t0); g.gain.exponentialRampToValueAtTime(0.001, t0+0.05);
      }
      noise(0.2, 0, 0.1, 'highpass', 3000);
      break;
    }
    case 'rewind': {
      const g = noise(0.3, 0, 0.6, 'bandpass', 2000);
      g.gain.setValueAtTime(0, 0);
      g.gain.linearRampToValueAtTime(0.4, 0.1);
      g.gain.setValueAtTime(0.4, 0.5);
      g.gain.linearRampToValueAtTime(0, 0.6);
      const og = osc('sawtooth', 1200, 0.15, 0, 0.6, 200);
      og.gain.setValueAtTime(0.15, 0); og.gain.linearRampToValueAtTime(0, 0.6);
      break;
    }
  }

  try { return await ctx.startRendering(); }
  catch(e) { console.error('[SFX synth]', key, e); return null; }
};

const getStickerAnimTransform = (anim, t, size) => {
  switch (anim) {
    case 'bounce':  return { dy: Math.sin(t * 5) * size * 0.12, s: 1, r: 0, a: 1 };
    case 'pulse':   return { dy: 0, s: 1 + Math.sin(t * 3.5) * 0.18, r: 0, a: 1 };
    case 'spin':    return { dy: 0, s: 1, r: t * 1.8, a: 1 };
    case 'shake':   return { dy: 0, s: 1, r: Math.sin(t * 9) * 0.25, a: 1 };
    case 'float':   return { dy: Math.sin(t * 2) * size * 0.08, s: 1, r: 0, a: 0.82 + Math.sin(t * 2.5) * 0.18 };
    default:        return { dy: 0, s: 1, r: 0, a: 1 };
  }
};

// ── DADOS DOS TEMPLATES ────────────────────────────────────────────────────
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
    desc:'Legenda inferior esquerda estilo noticiário',
    descEn:'Lower-left caption, news broadcast style',
    settings:{ fontSize:52, fontFamily:'Montserrat', textColor:'#ffffff',
      gradientEnabled:false, shadowEnabled:true, shadowBlur:16, shadowColor:'rgba(0,0,0,0.9)', shadowOffsetX:0, shadowOffsetY:2, zoom:55 },
    extraTexts:[
      { rx:0.08, ry:0.84, text:'Nome do Artista', textEn:'Artist Name', fs:42, ff:'Bebas Neue', color:'#fbbf24' },
      { rx:0.08, ry:0.93, text:'feat. Colaborador • 2024', textEn:'feat. Collaborator • 2024', fs:20, ff:'Poppins', color:'rgba(255,255,255,0.65)' },
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
  const [exportFormat, setExportFormat] = useState('mp4');
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
  const [soundEffects, setSoundEffects] = useState([]);     // [{id,key,name,emoji,startTime,volume}]
  const [showSfxPanel, setShowSfxPanel] = useState(false);
  const [sfxPanelPos, setSfxPanelPos]   = useState({ top: 80, left: 0 });
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [bgSearch, setBgSearch] = useState('');
  const [bgSearchResults, setBgSearchResults] = useState([]);
  const [bgSearchLoading, setBgSearchLoading] = useState(false);
  const [bgTab, setBgTab] = useState('gradients');
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
      if (e.key === 'Escape') { setIsFullscreen(false); setShowStickerPanel(false); setShowTemplatePanel(false); }
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
      // source.unsplash.com foi desativado em 2024 — usando picsum.photos
      // seed = termo + índice → imagens diferentes a cada busca, sempre disponíveis
      const terms = query.trim().toLowerCase().replace(/\s+/g, '-');
      const results = Array.from({ length: 12 }, (_, i) => ({
        id: `${terms}_${i}`,
        thumb: `https://picsum.photos/seed/${terms}${i}/300/500`,
        full:  `https://picsum.photos/seed/${terms}${i}/720/1280`,
        credit: 'Picsum Photos',
      }));
      setBgSearchResults(results);
    } catch(e) {
      console.error('[BgSearch]', e);
    } finally {
      setBgSearchLoading(false);
    }
  };

  const applyBgFromUrl = (url) => {
    // fetch() falha por CORS em serviços externos — carrega via Image com crossOrigin
    // e exporta para dataURL via canvas (sem taint, desde que o servidor envie CORS headers)
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const cw = img.naturalWidth  || 720;
        const ch = img.naturalHeight || 1280;
        const cv = document.createElement('canvas');
        cv.width = cw; cv.height = ch;
        cv.getContext('2d').drawImage(img, 0, 0, cw, ch);
        const dataUrl = cv.toDataURL('image/jpeg', 0.92);
        setImageSrc(dataUrl);
        const loaded = new Image();
        loaded.onload = () => setImage(loaded);
        loaded.src = dataUrl;
        setShowBgPanel(false);
      } catch(e) {
        // Fallback: usa a imagem diretamente se o canvas falhar (taint de segurança)
        setImage(img);
        setShowBgPanel(false);
      }
    };
    img.onerror = () => alert('Erro ao carregar imagem. Tente outra.');
    img.src = url;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
          return [...prev, { id, src: finalSrc || src, videoEl, audioBuffer, start, end, x, y, width: w, height: h, radius: 12, muted: false, vidVolume: projectVolumeRef.current ?? 1, vidSpeed: initSpeed, rawDuration: finalDuration }];
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
      setLyrics(prevLyrics => [...prevLyrics, newLine].sort((a, b) => a.start - b.start));
      return prev + 1;
    });
  }, []);

  // Função para adicionar novo texto fixo na tela
  const addExtraText = () => {
    if (!newExtraInput.trim()) return;
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
    setExtraTexts(extraTexts.filter(t => t.id !== id));
  };



  const addSticker = (type, content, animStyle = null) => {
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

  const removeSticker = (id) => setStickers(prev => prev.filter(s => s.id !== id));

  const removeLyric = (id) => {
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
    setActiveVideoId(null);
    setExtraTexts([]);
    setStickers([]);
    setNewExtraInput('');
    setTextLines([]);
    setCurrentLineIndex(0);
    setImage(null);
    setImageSrc(null);
    setAudioSrc(null);
    setAudioFile(null);
    setAudioBase64(null);
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
      if (activeVideoId && !activeImageId && !activeLyricId && !activeExtraTextId) {
        setVideos(prev => { const v = prev.find(vv => vv.id === activeVideoId); if (v?.videoEl) { v.videoEl.pause(); if (v.videoEl.parentNode) v.videoEl.parentNode.removeChild(v.videoEl); URL.revokeObjectURL(v.src); } return prev.filter(vv => vv.id !== activeVideoId); });
        setActiveVideoId(null);
        return;
      }
      if (activeImageId) {
        setImages(prev => prev.filter(img => img.id !== activeImageId));
        setActiveImageId(null);
        return;
      }
      if (activeLyricId) {
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

  // ── Desenha efeito de fundo atrás do texto ─────────────────────────────────
  const drawTextBgEffectRef = useRef(null);
  const _drawTextBgEffectImpl = (ctx, effect, lines, lFontSize, lineH, totalH) => {
    if (!effect || effect === 'none') return;
    // Usa Date.now() para animações — funciona mesmo sem áudio tocando
    const phase = Date.now() / 1000;
    const maxW = Math.max(20, lines.reduce((m, l) => {
      const str = typeof l === 'string' ? l : String(l);
      return Math.max(m, ctx.measureText(str.toUpperCase()).width);
    }, 0));
    const padX = lFontSize * 0.55, padY = lFontSize * 0.3;
    const bx = -maxW / 2 - padX, by = -totalH / 2 - padY;
    const bw = maxW + padX * 2,  bh = totalH + padY * 2;
    const r  = Math.min(lFontSize * 0.2, bw / 2, bh / 2);

    // Cria o path arredondado
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

    // Cada case usa save/restore próprio — garante que ctx fica limpo mesmo se houver erro
    ctx.save();
    try {
      ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
      ctx.globalAlpha = 1; ctx.filter = 'none';
      switch (effect) {
        case 'black':
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(0,0,0,0.78)'; ctx.fill(); break;

        case 'white':
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(255,255,255,0.84)'; ctx.fill(); break;

        case 'blur': {
          // ctx.filter seguro aqui — o try/finally garante ctx.filter='none' mesmo em erro
          rr(bx - 8, by - 8, bw + 16, bh + 16, r + 8);
          ctx.filter = 'blur(14px)';
          ctx.fillStyle = 'rgba(30,30,30,0.9)';
          ctx.fill();
          ctx.filter = 'none';
          // Camada fina semitransparente por cima para suavizar a borda
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.fill();
          break;
        }

        case 'dark_blur': {
          rr(bx - 10, by - 10, bw + 20, bh + 20, r + 10);
          ctx.filter = 'blur(18px)';
          ctx.fillStyle = 'rgba(0,0,0,0.95)';
          ctx.fill();
          ctx.filter = 'none';
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(0,0,0,0.6)';
          ctx.fill();
          break;
        }

        case 'fire': {
          const p = phase * 2;
          const mid1 = Math.max(0.05, Math.min(0.55, 0.35 + 0.12 * Math.sin(p)));
          const mid2 = Math.max(mid1 + 0.1, Math.min(0.9, 0.65 + 0.08 * Math.cos(p * 1.3)));
          const g = ctx.createLinearGradient(bx, by + bh, bx, by);
          g.addColorStop(0,    '#cc0000');
          g.addColorStop(mid1, '#ff5500');
          g.addColorStop(mid2, '#ffaa00');
          g.addColorStop(1,    '#ffee00');
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = g; ctx.fill();
          ctx.shadowBlur = 16; ctx.shadowColor = 'rgba(255,80,0,0.7)';
          ctx.strokeStyle = 'rgba(255,150,0,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
          break;
        }

        case 'water': {
          const p2 = phase * 1.5;
          const w1 = Math.max(0.05, Math.min(0.45, 0.25 + 0.1 * Math.sin(p2)));
          const w2 = Math.max(w1 + 0.15, Math.min(0.85, 0.6 + 0.08 * Math.cos(p2 * 1.2)));
          const g2 = ctx.createLinearGradient(bx, by, bx, by + bh);
          g2.addColorStop(0,   'rgba(0,210,255,0.3)');
          g2.addColorStop(w1,  'rgba(0,140,230,0.7)');
          g2.addColorStop(w2,  'rgba(0,70,200,0.82)');
          g2.addColorStop(1,   'rgba(0,20,140,0.9)');
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = g2; ctx.fill();
          ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(0,180,255,0.6)';
          ctx.strokeStyle = 'rgba(80,220,255,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
          break;
        }

        case 'neon': {
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = 'rgba(0,0,0,0.88)'; ctx.fill();
          // Alterna cor com sin para animação suave sem flicker
          const hue = ((phase * 60) % 360);
          const nc = `hsl(${hue},100%,60%)`;
          ctx.shadowBlur = 20; ctx.shadowColor = nc;
          ctx.strokeStyle = nc; ctx.lineWidth = 2; ctx.stroke();
          break;
        }

        case 'rainbow': {
          // Gradiente linear ordenado — sem % que quebra a ordem
          const shift = (phase * 0.25) % 1;
          // Usa 7 stops ordenados 0→1, color shift via hue rotate
          const rg = ctx.createLinearGradient(bx, by, bx + bw, by);
          const hues = [0, 42, 60, 120, 210, 270, 300, 360];
          hues.forEach((h, i) => {
            const adjustedH = (h + shift * 360) % 360;
            rg.addColorStop(i / (hues.length - 1), `hsl(${adjustedH},100%,55%)`);
          });
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = rg;
          ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
          break;
        }

        case 'gold': {
          const gp = phase * 0.8;
          const gs = Math.max(0.1, Math.min(0.45, 0.3 + 0.15 * Math.sin(gp)));
          const gg = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
          gg.addColorStop(0,   'rgba(160,110,0,0.95)');
          gg.addColorStop(gs,  'rgba(255,215,0,1)');
          gg.addColorStop(1,   'rgba(160,110,0,0.95)');
          rr(bx, by, bw, bh, r);
          ctx.fillStyle = gg; ctx.fill();
          ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(255,200,0,0.7)';
          ctx.strokeStyle = 'rgba(255,240,120,0.6)'; ctx.lineWidth = 1.5; ctx.stroke();
          break;
        }

        default: break;
      }
    } finally {
      // Garante reset SEMPRE — mesmo se o switch lançar erro
      ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
      ctx.globalAlpha = 1; ctx.filter = 'none';
      ctx.restore();
    }
  };
  // Armazena a implementação no ref para que draw() (useCallback) sempre acesse a versão mais recente
  drawTextBgEffectRef.current = _drawTextBgEffectImpl;

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
      // Pausa se atingiu o fim real do vídeo — já gerenciado pelo sync loop RAF
      const vRot = (v.rotation || 0) * Math.PI / 180;
      const _vf  = buildFilterString(v.filters);
      const _vtr = getTransitionTransform(v, time);
      ctx.save();
      if (_vtr) { _applyTr(ctx, _vtr, _vf, v); }
      else if (_vf !== 'none') { ctx.filter = _vf; }
      drawRotatedElement(ctx, () => drawRoundedImage(ctx, v.videoEl, v.x, v.y, v.width, v.height, v.radius ?? 12), v.x, v.y, v.width, v.height, v.rotation);
      ctx.filter = 'none'; ctx.restore();
      if (activeVideoId === v.id) {
        const cx = v.x + v.width / 2, cy = v.y + v.height / 2;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(vRot); ctx.translate(-cx, -cy);
        ctx.strokeStyle = 'rgba(167,139,250,0.9)';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, v.x, v.y, v.width, v.height, (v.radius ?? 12) + 2);
        ctx.stroke();
        drawResizeHandles(ctx, v.x, v.y, v.width, v.height);
        ctx.restore();
      }
    });

    // Desenha TODAS as imagens ativas no instante (camadas simultâneas)
    const overlayImages = getImagesForTime(time);
    overlayImages.forEach(overlayImage => {
      const iRot = (overlayImage.rotation || 0) * Math.PI / 180;
      const _if  = buildFilterString(overlayImage.filters);
      const _itr = getTransitionTransform(overlayImage, time);
      ctx.save();
      if (_itr) { _applyTr(ctx, _itr, _if, overlayImage); }
      else if (_if !== 'none') { ctx.filter = _if; }
      drawRotatedElement(ctx, () => drawRoundedImage(ctx, overlayImage.img, overlayImage.x, overlayImage.y, overlayImage.width, overlayImage.height, overlayImage.radius ?? 18), overlayImage.x, overlayImage.y, overlayImage.width, overlayImage.height, overlayImage.rotation);
      ctx.filter = 'none'; ctx.restore();
      if (activeImageId === overlayImage.id) {
        const cx = overlayImage.x + overlayImage.width / 2, cy = overlayImage.y + overlayImage.height / 2;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(iRot); ctx.translate(-cx, -cy);
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.9)';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, overlayImage.x, overlayImage.y, overlayImage.width, overlayImage.height, (overlayImage.radius ?? 18) + 2);
        ctx.stroke();
        drawResizeHandles(ctx, overlayImage.x, overlayImage.y, overlayImage.width, overlayImage.height);
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
    // Não agenda mais RAF aqui — o loop unificado abaixo cuida disso
  }, [activeImageId, activeVideoId, activeExtraTextId, activeLyricId, editingLyricId, drawRotatedElement, drawRoundedImage, drawRoundedRect, drawResizeHandles, extraTextColor, extraTextFontFamily, extraTextFontSize, extraTexts, fontFamily, fontSize, getImagesForTime, getVideosForTime, image, lyrics, textColor, wrapLyricText, videos, shadowEnabled, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, gradientEnabled, gradientColor1, gradientColor2, zoom]);


  // ── Sync de vídeos via função chamada pelo loop RAF ──────────────────────
  // Não usa useEffect reativo — evita closure stale de isPlaying
  const syncVideosInRAF = useCallback(() => {
    // Durante exports offline (frame-a-frame) o renderAtTimeToCanvas controla
    // os vídeos diretamente — interferir aqui corrompe os frames exportados
    if (offlineExportRef.current) return;
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
      const _evf = buildFilterString(v.filters);
      const _etr = getTransitionTransform(v, t);
      ctx.save();
      if (_etr) { _applyTr(ctx, _etr, _evf, v); } else if(_evf!=='none'){ctx.filter=_evf;}
      drawRotatedElement(ctx, () => drawRoundedImage(ctx, v.videoEl, v.x, v.y, v.width, v.height, v.radius ?? 12), v.x, v.y, v.width, v.height, v.rotation);
      ctx.filter='none'; ctx.restore();
    });
    // Renderiza TODAS as imagens ativas no instante t (usa ref para evitar closure stale)
    const activeImgs = (imagesRef.current || []).filter(item => item?.img && t >= item.start && t <= item.end);
    activeImgs.forEach(overlayImage => {
      const _eif = buildFilterString(overlayImage.filters);
      const _eit = getTransitionTransform(overlayImage, t);
      ctx.save();
      if (_eit) { _applyTr(ctx, _eit, _eif, overlayImage); } else if(_eif!=='none'){ctx.filter=_eif;}
      drawRotatedElement(ctx, () => drawRoundedImage(ctx, overlayImage.img, overlayImage.x, overlayImage.y, overlayImage.width, overlayImage.height, overlayImage.radius ?? 18), overlayImage.x, overlayImage.y, overlayImage.width, overlayImage.height, overlayImage.rotation);
      ctx.filter='none'; ctx.restore();
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
        // Velocidade e volume individuais por vídeo
        v.videoEl.playbackRate = Math.max(0.25, Math.min(4, _spd1 * (v.vidSpeed ?? 1)));
        v.videoEl.volume = Math.max(0, Math.min(1, _vol1 * (v.vidVolume ?? 1)));
        v.videoEl.currentTime = 0;
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
            const rel = Math.max(0, vt - v.start);
            v.videoEl.currentTime = rel;
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
          v.videoEl.playbackRate = Math.max(0.25, Math.min(4, spd * (v.vidSpeed ?? 1)));
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
      `}</style>
      
      {/* HEADER CONTROLS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 18px', background: 'rgba(8,8,8,0.97)', borderBottom: '1px solid rgba(0,191,255,0.12)', fontSize: '12px', width: '100%', boxSizing: 'border-box', backdropFilter: 'blur(12px)', boxShadow: '0 1px 0 rgba(0,191,255,0.08)' }}>
        {/* Linha 1: imports de mídia + formato + exportar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 600, letterSpacing: '0.5px' }}>{t('ed_background')}</label>
              {imageSrc && (
                <button onClick={() => { setImageSrc(null); setImage(null); if (bgInputRef.current) bgInputRef.current.value = ''; }} title="Remover fundo" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '1px 7px', fontSize: '11px', color: '#f87171', cursor: 'pointer', lineHeight: 1.6 }}>✕</button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <input ref={bgInputRef} type="file" onChange={handleImageChange} accept="image/*" style={{ color: '#f8fafc', fontSize: '11px' }} />
              <div style={{ position: 'relative' }}>
                <button
                  ref={bgBtnRef}
                  onClick={() => { const r = bgBtnRef.current?.getBoundingClientRect(); if (r) setShowBgPanel(v => !v); }}
                  style={{ background: showBgPanel ? 'rgba(0,191,255,0.2)' : 'rgba(0,191,255,0.07)', border: `1px solid ${showBgPanel ? 'rgba(0,191,255,0.6)' : 'rgba(0,191,255,0.25)'}`, borderRadius: 8, padding: '3px 9px', cursor: 'pointer', fontSize: 11, color: '#00BFFF', fontWeight: 700, whiteSpace: 'nowrap' }}
                >🎨 Fundos</button>
                {showBgPanel && (() => {
                  const rect = bgBtnRef.current?.getBoundingClientRect();
                  return createPortal(
                    <div data-bg-portal="true" style={{ position: 'fixed', top: (rect?.bottom ?? 60) + 6, left: Math.max(8, (rect?.left ?? 0)), zIndex: 99999, background: '#0f172a', border: '1px solid rgba(0,191,255,0.25)', borderRadius: 16, width: 420, maxHeight: '80vh', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      {/* Header */}
                      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#00BFFF' }}>🎨 Fundos</span>
                        <button onClick={() => setShowBgPanel(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 16 }}>✕</button>
                      </div>

                      {/* Tabs */}
                      {(() => {
                        const GRADIENTS = [
                          { id:'g1', label:'Noite', css:'linear-gradient(160deg,#0a0a2e 0%,#1a0a3e 50%,#0d1b4b 100%)' },
                          { id:'g2', label:'Pôr do Sol', css:'linear-gradient(160deg,#ff6b6b 0%,#feca57 50%,#ff9ff3 100%)' },
                          { id:'g3', label:'Oceano', css:'linear-gradient(160deg,#0575e6 0%,#021b79 100%)' },
                          { id:'g4', label:'Floresta', css:'linear-gradient(160deg,#134e5e 0%,#71b280 100%)' },
                          { id:'g5', label:'Fogo', css:'linear-gradient(160deg,#f83600 0%,#f9d423 100%)' },
                          { id:'g6', label:'Aurora', css:'linear-gradient(160deg,#00c3ff 0%,#7b2ff7 50%,#f64f59 100%)' },
                          { id:'g7', label:'Rosa Neon', css:'linear-gradient(160deg,#f953c6 0%,#b91d73 100%)' },
                          { id:'g8', label:'Menta', css:'linear-gradient(160deg,#0ba360 0%,#3cba92 100%)' },
                          { id:'g9', label:'Carvão', css:'linear-gradient(160deg,#232526 0%,#414345 100%)' },
                          { id:'g10', label:'Roxo', css:'linear-gradient(160deg,#4776e6 0%,#8e54e9 100%)' },
                          { id:'g11', label:'Cobre', css:'linear-gradient(160deg,#b79891 0%,#94716b 100%)' },
                          { id:'g12', label:'Cyber', css:'linear-gradient(160deg,#00f2fe 0%,#4facfe 50%,#0ef 100%)' },
                          { id:'s1', label:'Preto', css:'#000000' },
                          { id:'s2', label:'Branco', css:'#ffffff' },
                          { id:'s3', label:'Cinza', css:'#1a1a2e' },
                          { id:'s4', label:'Azul', css:'#0d1b2a' },
                        ];
                        const applyGradient = (css) => {
                          const cw = 720, ch = 1280;
                          const c = document.createElement('canvas'); c.width = cw; c.height = ch;
                          const ctx2 = c.getContext('2d');
                          if (css.startsWith('linear') || css.startsWith('#')) {
                            if (css.startsWith('linear')) {
                              // Parse gradient
                              const stops = css.match(/#[a-fA-F0-9]{3,6}|rgba?\([^)]+\)/g) || [];
                              const grad = ctx2.createLinearGradient(0, 0, cw * 0.3, ch);
                              stops.forEach((c2, i) => grad.addColorStop(i / Math.max(1, stops.length - 1), c2));
                              ctx2.fillStyle = grad;
                            } else {
                              ctx2.fillStyle = css;
                            }
                            ctx2.fillRect(0, 0, cw, ch);
                          }
                          const dataUrl = c.toDataURL('image/jpeg', 0.95);
                          setImageSrc(dataUrl);
                          const img = new Image(); img.onload = () => setImage(img); img.src = dataUrl;
                          setShowBgPanel(false);
                        };
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                            {/* Tab buttons */}
                            <div style={{ display: 'flex', gap: 4, padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                              {[['gradients','🎨 Gradientes'],['unsplash','🔍 Fotos'],['generate','⚡ Gerar']].map(([tab,label]) => (
                                <button key={tab} onClick={() => setBgTab(tab)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: bgTab===tab ? '#00BFFF' : 'rgba(255,255,255,0.06)', color: bgTab===tab ? '#000' : '#888' }}>{label}</button>
                              ))}
                            </div>

                            {/* Gradients tab */}
                            {bgTab === 'gradients' && (
                              <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, overflowY: 'auto', maxHeight: 340 }}>
                                {GRADIENTS.map(g => (
                                  <div key={g.id} onClick={() => applyGradient(g.css)} style={{ aspectRatio: '9/16', background: g.css, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 4, border: '2px solid rgba(255,255,255,0.08)', transition: 'transform 0.15s', ':hover': { transform: 'scale(1.05)' } }}>
                                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.8)', whiteSpace: 'nowrap' }}>{g.label}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Unsplash tab */}
                            {bgTab === 'unsplash' && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <input
                                    value={bgSearch}
                                    onChange={e => setBgSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && searchUnsplash(bgSearch)}
                                    placeholder="Ex: natureza, cidade, abstrato..."
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 10px', fontSize: 12, color: '#f0f0f0', outline: 'none' }}
                                  />
                                  <button onClick={() => searchUnsplash(bgSearch)} disabled={bgSearchLoading} style={{ background: '#00BFFF', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, color: '#000', fontWeight: 700, cursor: 'pointer' }}>
                                    {bgSearchLoading ? '...' : '🔍'}
                                  </button>
                                </div>
                                {bgSearchResults.length > 0 && (
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, overflowY: 'auto', maxHeight: 280 }}>
                                    {bgSearchResults.map(r => (
                                      <img key={r.id} src={r.thumb} onClick={() => applyBgFromUrl(r.full)} style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: '2px solid transparent', transition: 'border 0.15s' }} onMouseEnter={e => e.target.style.border='2px solid #00BFFF'} onMouseLeave={e => e.target.style.border='2px solid transparent'} alt="" />
                                    ))}
                                  </div>
                                )}
                                {bgSearchResults.length === 0 && !bgSearchLoading && (
                                  <div style={{ color: '#555', fontSize: 12, textAlign: 'center', padding: '20px 0' }}>Digite um termo e pressione Enter ou 🔍</div>
                                )}
                              </div>
                            )}

                            {/* Generate tab */}
                            {bgTab === 'generate' && (() => {
                              const GEN_LIST = [
                                { id:'p1', label:'Partículas',
                                  preview:'radial-gradient(ellipse at 20% 30%,rgba(0,191,255,0.5) 0%,transparent 55%),radial-gradient(ellipse at 75% 65%,rgba(100,50,255,0.4) 0%,transparent 55%),#050510',
                                  gen:(c,w,h)=>{ c.fillStyle='#050510';c.fillRect(0,0,w,h);for(let i=0;i<300;i++){c.beginPath();c.arc(Math.random()*w,Math.random()*h,Math.random()*2.5+0.5,0,6.28);c.fillStyle=`rgba(0,191,255,${Math.random()*0.8+0.2})`;c.fill();} } },
                                { id:'p2', label:'Grade Neon',
                                  preview:'linear-gradient(180deg,#000 0%,#001200 100%)',
                                  gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);c.strokeStyle='rgba(0,255,100,0.3)';c.lineWidth=1;for(let x=0;x<w;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(let y=0;y<h;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();} } },
                                { id:'p3', label:'Bokeh',
                                  preview:'radial-gradient(ellipse at 30% 40%,rgba(123,47,247,0.7) 0%,transparent 50%),radial-gradient(ellipse at 70% 60%,rgba(0,195,255,0.5) 0%,transparent 50%),#1a0533',
                                  gen:(c,w,h)=>{ const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#1a0533');g.addColorStop(1,'#0a1a4e');c.fillStyle=g;c.fillRect(0,0,w,h);for(let i=0;i<50;i++){const x=Math.random()*w,y=Math.random()*h,r=Math.random()*80+20;const cg=c.createRadialGradient(x,y,0,x,y,r);const hue=Math.random()*80+200;cg.addColorStop(0,`hsla(${hue},80%,70%,${Math.random()*0.2+0.05})`);cg.addColorStop(1,'transparent');c.fillStyle=cg;c.beginPath();c.arc(x,y,r,0,6.28);c.fill();} } },
                                { id:'p4', label:'Ondas',
                                  preview:'linear-gradient(180deg,#000d1a 0%,#001a33 100%)',
                                  gen:(c,w,h)=>{ c.fillStyle='#000d1a';c.fillRect(0,0,w,h);for(let i=0;i<8;i++){c.beginPath();c.strokeStyle=`rgba(0,191,255,${0.05+i*0.05})`;c.lineWidth=2;for(let x=0;x<w;x+=2){const y2=h/2+Math.sin((x+i*50)/80)*60*(i+1)*0.3+i*30;x===0?c.moveTo(x,y2):c.lineTo(x,y2);}c.stroke();} } },
                                { id:'p5', label:'Hexágonos',
                                  preview:'linear-gradient(160deg,#0a0a1a 0%,#0a1040 100%)',
                                  gen:(c,w,h)=>{ c.fillStyle='#0a0a1a';c.fillRect(0,0,w,h);const s=50;for(let row=0;row<h/s+2;row++){for(let col=0;col<w/s+2;col++){const x2=col*s*1.5,y2=row*s*Math.sqrt(3)+(col%2)*s*Math.sqrt(3)/2;c.beginPath();for(let k=0;k<6;k++){const a2=Math.PI/3*k;c.lineTo(x2+s*0.45*Math.cos(a2),y2+s*0.45*Math.sin(a2));}c.closePath();c.strokeStyle='rgba(100,200,255,0.2)';c.lineWidth=1;c.stroke();}} } },
                                { id:'p6', label:'Nebulosa',
                                  preview:'radial-gradient(ellipse at 50% 50%,rgba(123,47,247,0.6) 0%,rgba(249,83,198,0.4) 40%,rgba(0,195,255,0.3) 70%,transparent 100%),#000',
                                  gen:(c,w,h)=>{ c.fillStyle='#000';c.fillRect(0,0,w,h);const cs=['#7b2ff7','#f953c6','#00c3ff','#ff6b6b'];for(let i=0;i<8;i++){const x2=Math.random()*w,y2=Math.random()*h,r=Math.random()*250+100;const rg=c.createRadialGradient(x2,y2,0,x2,y2,r);rg.addColorStop(0,cs[i%4]+'44');rg.addColorStop(1,'transparent');c.fillStyle=rg;c.fillRect(0,0,w,h);} } },
                              ];
                              const applyGen = (genFn) => {
                                const cw=720, ch=1280;
                                const cv = document.createElement('canvas'); cv.width=cw; cv.height=ch;
                                genFn(cv.getContext('2d'), cw, ch);
                                const dataUrl = cv.toDataURL('image/jpeg', 0.95);
                                setImageSrc(dataUrl);
                                const img = new Image(); img.onload = () => setImage(img); img.src = dataUrl;
                                setShowBgPanel(false);
                              };
                              return (
                                <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, overflowY: 'auto', maxHeight: 340 }}>
                                  {GEN_LIST.map(p => (
                                    <div key={p.id} onClick={() => applyGen(p.gen)}
                                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:'pointer' }}>
                                      <div style={{ width:'100%', aspectRatio:'9/16', background:p.preview, borderRadius:8,
                                        border:'2px solid rgba(255,255,255,0.08)', transition:'border-color 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(0,191,255,0.7)'}
                                        onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}
                                      />
                                      <span style={{ fontSize:9, color:'#888' }}>{p.label}</span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })()}
                    </div>,
                    document.body
                  );
                })()}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 600, letterSpacing: '0.5px' }}>{t('ed_images')}</label>
            <input ref={imagesInputRef} type="file" onChange={handleImagesChange} accept="image/*" multiple style={{ color: '#aaa', fontSize: '11px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 600, letterSpacing: '0.5px' }}>{t('ed_audio')}</label>
            <input ref={audioInputRef} type="file" onChange={handleAudioChange} accept="audio/*" style={{ color: '#f8fafc', fontSize: '11px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.5px' }}>🎬 {t('ed_videos')}</label>
            <input ref={videoInputRef} type="file" onChange={handleVideoUpload} accept="video/*" multiple style={{ color: '#aaa', fontSize: '11px' }} />
          </div>
          <input ref={fontInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" style={{ display: 'none' }} onChange={handleFontUpload} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <label style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.5px' }}>📐 {t('ed_canvas_label')}</label>
            <select value={canvasFormat} onChange={(e) => setCanvasFormat(e.target.value)} style={{ backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '14px', padding: '7px 10px', fontSize: '12px' }}>
              {Object.entries(CANVAS_FORMATS).map(([key, val]) => (
                <option key={key} value={key}>{key} — {val.width}×{val.height}</option>
              ))}
            </select>
          </div>
          <LangToggle style={{ marginLeft: 'auto' }} />
        </div>
        {/* Linha 2: salvar · exportar projeto · importar projeto · limpar projeto */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Formato + nome do arquivo + Salvar */}
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} style={{ backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(0,191,255,0.2)', borderRadius: '14px', padding: '7px 10px', fontSize: '12px' }}>
            <option value="webm_offline_audio">🎬 {t('fmt_webm')}</option>
            <option value="mp4">🎬 {t('fmt_mp4')}</option>
            <option value="webm_hd">✨ {t('fmt_webm_hd')}</option>
            <option value="mp4_hd">✨ {t('fmt_mp4_hd')}</option>
            <option value="png">🖼️ PNG</option>
            <option value="jpg">🖼️ JPG</option>
          </select>

          {/* Salvar + indicador de progresso */}
          <button onClick={handleSave} disabled={isExporting} style={{ background: isExporting ? '#0a1a1a' : '#00BFFF', border: 'none', padding: '8px 18px', borderRadius: '14px', cursor: isExporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '12px', color: isExporting ? '#555' : '#000', boxShadow: isExporting ? 'none' : '0 4px 16px rgba(0,191,255,0.3)', whiteSpace: 'nowrap' }}>
            {t('ed_save')}
          </button>
          {isExporting && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:120, height:6, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${Math.round(exportProgress*100)}%`, background:'#00BFFF', borderRadius:4, transition:'width 0.2s' }} />
              </div>
              <span style={{ fontSize:11, color:'#00BFFF', fontWeight:700, whiteSpace:'nowrap' }}>{t('ed_exporting')} {Math.round(exportProgress*100)}%</span>
            </div>
          )}
          {/* Separador */}
          <div style={{ width:1, height:28, background:'rgba(255,255,255,0.07)' }} />
          <button onClick={exportProject} style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', padding: '7px 14px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#00BFFF' }}>
            {t('ed_export_project')}
          </button>
          <input ref={importInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={(e) => importProjectFromFile(e.target.files[0])} />
          <button onClick={() => importInputRef.current && importInputRef.current.click()} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '7px 14px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#888' }}>
            {t('ed_import_project')}
          </button>
          <button onClick={handleClearProject} style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', padding: '7px 14px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#f87171' }}>
            {t('ed_clear_project')}
          </button>

          {/* ── Botão Templates ── */}
          <div style={{ position: 'relative' }}>
            <button
              ref={templateBtnRef}
              onClick={() => {
                const rect = templateBtnRef.current?.getBoundingClientRect();
                if (rect) setTemplatePanelPos({
                  top:  rect.bottom + 8,
                  left: Math.max(10, Math.min(rect.left, window.innerWidth - 750)),
                });
                setTemplateFormatTab(canvasFormat);
                setShowTemplatePanel(v => !v);
              }}
              style={{
                background: showTemplatePanel ? 'rgba(16,185,129,0.22)' : 'rgba(16,185,129,0.08)',
                border: `1px solid ${showTemplatePanel ? 'rgba(16,185,129,0.7)' : 'rgba(16,185,129,0.25)'}`,
                borderRadius: 14, padding: '7px 14px', cursor: 'pointer',
                fontWeight: 700, fontSize: 13, color: '#10b981',
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}
            >🎨 Templates</button>

            {showTemplatePanel && createPortal(
              <>
                {/* Overlay fecha ao clicar fora — nativo, sem problemas de propagação */}
                <div onClick={() => setShowTemplatePanel(false)} style={{ position:'fixed', inset:0, zIndex:99998 }} />
                <div
                  ref={templatePortalRef}
                  style={{
                    position: 'fixed',
                    top:  templatePanelPos.top,
                    left: templatePanelPos.left,
                    zIndex: 99999,
                    background: '#0f172a',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 20,
                    width: 740,
                    maxHeight: '82vh',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                {/* Header do painel */}
                <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>🎨 Templates</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                      {t('tpl_subtitle')}
                    </div>
                  </div>
                  <button onClick={() => setShowTemplatePanel(false)} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '5px 12px', color: '#f87171', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✕</button>
                </div>

                {/* Abas de formato */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}>
                  {['16:9','9:16','1:1','4:3'].map(fmt => {
                    const icons = {'16:9':'🖥️','9:16':'📱','1:1':'⬜','4:3':'📺'};
                    const count = CANVAS_TEMPLATES.filter(t => t.format === fmt).length;
                    return (
                      <button key={fmt} onClick={() => setTemplateFormatTab(fmt)} style={{
                        flex: 1, padding: '10px 4px', background: templateFormatTab === fmt ? 'rgba(16,185,129,0.12)' : 'transparent',
                        border: 'none', borderBottom: templateFormatTab === fmt ? '2px solid #10b981' : '2px solid transparent',
                        color: templateFormatTab === fmt ? '#10b981' : '#555', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      }}>
                        <span style={{ fontSize: 16 }}>{icons[fmt]}</span>
                        <span>{fmt}</span>
                        <span style={{ fontSize: 9, color: templateFormatTab === fmt ? 'rgba(16,185,129,0.7)' : '#333' }}>{count} {t('tpl_count')}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Grid de templates */}
                <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {CANVAS_TEMPLATES.filter(t => t.format === templateFormatTab).map(tpl => {
                    const s = tpl.settings;
                    // Mini-canvas proporcional dentro de um preview fixo 210×118
                    const previewW = 210, previewH = 118;
                    const fmtRatios = {'16:9':[16,9],'9:16':[9,16],'1:1':[1,1],'4:3':[4,3]};
                    const [rw, rh] = fmtRatios[tpl.format] || [16,9];
                    // Dimensões da mini-tela dentro do preview (letterbox/pillarbox)
                    let mw = previewW * 0.88, mh = mw * (rh / rw);
                    if (mh > previewH * 0.88) { mh = previewH * 0.88; mw = mh * (rw / rh); }
                    mw = Math.round(mw); mh = Math.round(mh);
                    return (
                      <div key={tpl.id} style={{
                        background: '#0a0f1e',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 14,
                        cursor: 'pointer', transition: 'border 0.15s, background 0.15s',
                        display: 'flex', flexDirection: 'column',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${tpl.accent}70`; e.currentTarget.style.background = '#0e1628'; }}
                        onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#0a0f1e'; }}
                      >
                        {/* Preview — altura fixa 118px para todos os formatos */}
                        <div style={{
                          width: '100%', height: 118, background: '#060c18', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                          borderRadius: '14px 14px 0 0', overflow: 'hidden',
                        }}>
                          {/* Mini-tela proporcional ao formato */}
                          <div style={{
                            width: mw, height: mh, position: 'relative', borderRadius: 4, overflow: 'hidden',
                            background: `radial-gradient(ellipse at 50% 50%, ${tpl.accent}20 0%, #080818 70%)`,
                            boxShadow: s.shadowEnabled ? `0 0 14px ${tpl.accent}50` : 'none',
                            border: `1px solid ${tpl.accent}30`,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                          }}>
                            {/* Linha topo extra */}
                            <div style={{ width: '55%', height: 2, borderRadius: 1, background: tpl.accent, opacity: 0.35 }} />
                            {/* Bloco lyric principal */}
                            <div style={{
                              width: '75%', height: Math.max(5, Math.round(mh * 0.09)), borderRadius: 2,
                              background: s.gradientEnabled
                                ? `linear-gradient(90deg, ${s.gradientColor1}, ${s.gradientColor2})`
                                : s.textColor,
                              boxShadow: s.shadowEnabled ? `0 0 8px ${tpl.accent}80` : 'none',
                            }} />
                            <div style={{
                              width: '55%', height: Math.max(3, Math.round(mh * 0.065)), borderRadius: 2,
                              background: s.gradientEnabled ? s.gradientColor2 : s.textColor, opacity: 0.55,
                            }} />
                            {/* Linha rodapé extra */}
                            <div style={{ width: '50%', height: 2, borderRadius: 1, background: tpl.accent, opacity: 0.25 }} />
                          </div>
                          {/* Badge formato */}
                          <div style={{
                            position: 'absolute', top: 5, right: 6,
                            background: `${tpl.accent}22`, border: `1px solid ${tpl.accent}44`,
                            borderRadius: 4, padding: '1px 5px', fontSize: 8,
                            color: tpl.accent, fontWeight: 700,
                          }}>{tpl.format}</div>
                        </div>

                        {/* Info */}
                        <div style={{ padding: '9px 12px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 7, height: 7, borderRadius: '50%', background: tpl.accent, flexShrink: 0 }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#f1f5f9' }}>{tpl.name}</span>
                          </div>
                          <span style={{ fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>{lang === 'en' && tpl.descEn ? tpl.descEn : tpl.desc}</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '1px 5px', color: '#94a3b8' }}>{s.fontFamily}</span>
                            {s.gradientEnabled && <span style={{ fontSize: 9, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 4, padding: '1px 5px', color: '#a78bfa' }}>gradient</span>}
                            {s.shadowEnabled && <span style={{ fontSize: 9, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 4, padding: '1px 5px', color: '#fbbf24' }}>glow</span>}
                          </div>
                        </div>

                        {/* Botão aplicar */}
                        <button
                          onClick={() => applyTemplate(tpl)}
                          style={{
                            margin: '4px 12px 12px', padding: '8px 0', borderRadius: 9, cursor: 'pointer',
                            background: `${tpl.accent}20`,
                            border: `1px solid ${tpl.accent}55`, color: tpl.accent,
                            fontWeight: 800, fontSize: 12,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${tpl.accent}45`; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = `${tpl.accent}20`; e.currentTarget.style.color = tpl.accent; }}
                        >
                          ✓ {t('tpl_use')}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 10, color: '#334155', textAlign: 'center' }}>
                  {t('tpl_footer')}
                </div>
              </div>
              </>
            , document.body)}
          </div>

          {/* ── Separador ── */}
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />
          <div style={{ position: 'relative' }}>
            <button
              ref={stickerBtnRef}
              onClick={() => {
                const rect = stickerBtnRef.current?.getBoundingClientRect();
                if (rect) setStickerPanelPos({
                  top:  rect.bottom + 8,
                  left: Math.min(rect.left, window.innerWidth - 372),
                });
                setShowStickerPanel(v => !v);
              }}
              style={{
                background: showStickerPanel ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.07)',
                border: `1px solid ${showStickerPanel ? 'rgba(251,191,36,0.6)' : 'rgba(251,191,36,0.2)'}`,
                borderRadius: 14, padding: '7px 14px', cursor: 'pointer',
                fontWeight: 700, fontSize: 13, color: '#fbbf24',
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}
            >✨ Stickers {stickers.length > 0 && <span style={{ background:'#fbbf24',color:'#000',borderRadius:8,padding:'1px 6px',fontSize:10,fontWeight:900 }}>{stickers.length}</span>}</button>

            {showStickerPanel && createPortal(
              <div
                data-sticker-portal
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  top: stickerPanelPos.top,
                  left: stickerPanelPos.left,
                  zIndex: 99999,
                  background: '#111827', border: '1px solid rgba(251,191,36,0.25)',
                  borderRadius: 18, width: 360, boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
                  overflow: 'hidden',
                }}
              >
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {[['emoji','😀 Emojis'],['sticker','✨ Animados']].map(([tab, label]) => (
                    <button key={tab} onClick={() => setStickerTab(tab)} style={{
                      flex: 1, padding: '10px 0', background: stickerTab === tab ? 'rgba(251,191,36,0.12)' : 'transparent',
                      border: 'none', borderBottom: stickerTab === tab ? '2px solid #fbbf24' : '2px solid transparent',
                      color: stickerTab === tab ? '#fbbf24' : '#888', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    }}>{label}</button>
                  ))}
                </div>

                <div style={{ padding: 12, maxHeight: 260, overflowY: 'auto' }}>
                  {stickerTab === 'emoji' && (
                    <div>
                      {EMOJI_LIST.map((row, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: 4, marginBottom: 4, flexWrap: 'wrap' }}>
                          {row.map(em => (
                            <button key={em} onClick={() => { addSticker('emoji', em, null); }}
                              title={`Adicionar ${em}`}
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '6px 4px', fontSize: 22, cursor: 'pointer', lineHeight: 1, width: 44, transition: 'background 0.15s' }}
                              onMouseEnter={e => e.target.style.background='rgba(251,191,36,0.15)'}
                              onMouseLeave={e => e.target.style.background='rgba(255,255,255,0.04)'}
                            >{em}</button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {stickerTab === 'sticker' && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {ANIMATED_STICKERS.map(stk => (
                        <button key={stk.key} onClick={() => { addSticker('sticker', stk.emoji, stk.anim); }}
                          title={stk.label}
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '8px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 68, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background='rgba(251,191,36,0.15)'}
                          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                        >
                          <span style={{ fontSize: 26 }}>{stk.emoji}</span>
                          <span style={{ fontSize: 9, color: '#888', fontWeight: 700, letterSpacing: '0.3px' }}>{stk.label}</span>
                          <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 600 }}>{stk.anim}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>


                <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#555' }}>{t('stk_hint')}</span>
                  {stickers.length > 0 && (
                    <button onClick={() => { setStickers([]); setActiveStickerId(null); }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '3px 10px', fontSize: 10, color: '#f87171', fontWeight: 700, cursor: 'pointer' }}>
                      {t('stk_clear_all')}
                    </button>
                  )}
                </div>
              </div>
            , document.body)}
          </div>

          {/* ── Efeitos Sonoros ── */}
          <div style={{ position: 'relative' }}>
            <button
              ref={sfxBtnRef}
              onClick={() => {
                const rect = sfxBtnRef.current?.getBoundingClientRect();
                if (rect) setSfxPanelPos({ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 380) });
                setShowSfxPanel(v => !v);
              }}
              style={{
                background: showSfxPanel ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.07)',
                border: `1px solid ${showSfxPanel ? 'rgba(16,185,129,0.6)' : 'rgba(16,185,129,0.25)'}`,
                borderRadius: 14, padding: '7px 14px', cursor: 'pointer',
                fontWeight: 700, fontSize: 13, color: '#10b981',
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
              }}
            >🔊 {t('ed_sfx')} {soundEffects.length > 0 && <span style={{ background:'#10b981',color:'#000',borderRadius:8,padding:'1px 6px',fontSize:10,fontWeight:900 }}>{soundEffects.length}</span>}</button>

            {showSfxPanel && createPortal(
              <div data-sfx-portal onClick={e => e.stopPropagation()} style={{
                position: 'fixed', top: sfxPanelPos.top, left: sfxPanelPos.left,
                zIndex: 99999, background: '#111827',
                border: '1px solid rgba(16,185,129,0.25)', borderRadius: 18,
                width: 370, boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontWeight:800, fontSize:13, color:'#10b981' }}>🔊 {t('sfx_title')}</span>
                  <span style={{ fontSize:10, color:'#555' }}>{t('sfx_hint')}</span>
                </div>
                {/* Grid of SFX */}
                <div style={{ padding: '10px 12px', maxHeight: 220, overflowY:'auto', display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:6 }}>
                  {SFX_LIST.map(sfx => (
                    <button key={sfx.key}
                      title={sfx.name}
                      onClick={() => {
                        const audio = document.querySelector('audio');
                        const t = audio ? audio.currentTime : 0;
                        setSoundEffects(prev => [...prev, { id: Date.now() + Math.random(), key: sfx.key, name: sfx.name, emoji: sfx.emoji, startTime: parseFloat(t.toFixed(2)), volume: 1 }]);
                      }}
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:10, padding:'8px 4px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, width:'100%', boxSizing:'border-box' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(16,185,129,0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                    >
                      <span style={{ fontSize:20, lineHeight:1 }}>{sfx.emoji}</span>
                      <span style={{ fontSize:9, color:'#aaa', fontWeight:600, textAlign:'center', lineHeight:1.2, wordBreak:'break-word' }}>{sfx.name}</span>
                    </button>
                  ))}
                </div>
                {/* Placed effects list */}
                {soundEffects.length > 0 && (
                  <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'8px 12px', maxHeight:180, overflowY:'auto' }}>
                    <div style={{ fontSize:9, color:'#555', fontWeight:700, marginBottom:6 }}>{t('sfx_placed')}</div>
                    {soundEffects.map((sfx, i) => (
                      <div key={sfx.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ fontSize:16 }}>{sfx.emoji}</span>
                        <span style={{ fontSize:11, color:'#ccc', fontWeight:600, flex:1 }}>{sfx.name}</span>
                        <span style={{ fontSize:10, color:'#10b981', minWidth:36 }}>{sfx.startTime.toFixed(1)}s</span>
                        <input type="range" min={0.1} max={2} step={0.1}
                          value={sfx.volume}
                          title={`Volume: ${Math.round(sfx.volume*100)}%`}
                          onChange={e => setSoundEffects(prev => prev.map(s => s.id === sfx.id ? {...s, volume: Number(e.target.value)} : s))}
                          style={{ width:60, accentColor:'#10b981', cursor:'pointer' }}
                        />
                        <span style={{ fontSize:9, color:'#555', minWidth:28 }}>{Math.round(sfx.volume*100)}%</span>
                        <button onClick={() => setSoundEffects(prev => prev.filter(s => s.id !== sfx.id))}
                          style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'2px 7px', fontSize:11, color:'#f87171', cursor:'pointer' }}>✕</button>
                      </div>
                    ))}
                    <button onClick={() => setSoundEffects([])} style={{ marginTop:8, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, padding:'4px 12px', fontSize:10, color:'#f87171', fontWeight:700, cursor:'pointer', width:'100%' }}>
                      {t('sfx_remove_all')}
                    </button>
                  </div>
                )}
                {soundEffects.length === 0 && (
                  <div style={{ padding:'10px 16px 14px', fontSize:11, color:'#444', textAlign:'center' }}>
                    {t('sfx_empty')}
                  </div>
                )}
              </div>
            , document.body)}
          </div>
        </div>{/* fim Linha 2 */}
      </div>{/* fim HEADER CONTROLS */}

      <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>
        
        {/* EDITOR ESQUERDA — 520PX */}
        <div style={{ width: '520px', minWidth: '520px', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', background: '#0d0d0d', boxShadow: 'none', overflowY: 'auto' }}>

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
                  <option value='none'>🔲 Sem fundo</option>
                  <option value='black'>⬛ Fundo preto</option>
                  <option value='white'>⬜ Fundo branco</option>
                  <option value='blur'>🌫️ Blur</option>
                  <option value='dark_blur'>🔳 Blur escuro</option>
                  <option value='fire'>🔥 Fogo</option>
                  <option value='water'>💧 Água</option>
                  <option value='neon'>✨ Neon</option>
                  <option value='rainbow'>🌈 Arco-íris</option>
                  <option value='gold'>🏆 Dourado</option>
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
                <option value="none">🔲 Sem fundo</option>
                <option value="black">⬛ Fundo preto</option>
                <option value="white">⬜ Fundo branco</option>
                <option value="blur">🌫️ Blur</option>
                <option value="dark_blur">🔳 Blur escuro</option>
                <option value="fire">🔥 Fogo</option>
                <option value="water">💧 Água</option>
                <option value="neon">✨ Neon</option>
                <option value="rainbow">🌈 Arco-íris</option>
                <option value="gold">🏆 Dourado</option>
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
            width={CANVAS_FORMATS[canvasFormat].width} 
            height={CANVAS_FORMATS[canvasFormat].height} 
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
      <div style={{ 
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
                onContextMenu={(e) => { e.preventDefault(); if (v.videoEl) { v.videoEl.pause(); if (v.videoEl.parentNode) v.videoEl.parentNode.removeChild(v.videoEl); } URL.revokeObjectURL(v.src); setVideos(prev => prev.filter(vv => vv.id !== v.id)); if (activeVideoId === v.id) setActiveVideoId(null); }}
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
