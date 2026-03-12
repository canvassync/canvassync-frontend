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
  { key:'applause',  emoji:'👏', name:'Aplausos',    dur:2.5 },
  { key:'explosion', emoji:'💥', name:'Explosão',    dur:2.0 },
  { key:'whoosh',    emoji:'💨', name:'Whoosh',      dur:0.8 },
  { key:'bell',      emoji:'🔔', name:'Sino',        dur:1.8 },
  { key:'kick',      emoji:'🥁', name:'Bumbo',       dur:0.6 },
  { key:'fanfare',   emoji:'🎺', name:'Fanfarra',    dur:2.2 },
  { key:'laser',     emoji:'🔫', name:'Laser',       dur:0.7 },
  { key:'success',   emoji:'✅', name:'Sucesso',     dur:1.0 },
  { key:'error',     emoji:'❌', name:'Erro',        dur:0.6 },
  { key:'notify',    emoji:'🔕', name:'Notificação', dur:0.5 },
  { key:'coin',      emoji:'🪙', name:'Moeda',       dur:0.6 },
  { key:'punch',     emoji:'👊', name:'Soco',        dur:0.4 },
  { key:'glass',     emoji:'🥂', name:'Brinde',      dur:2.0 },
  { key:'powerup',   emoji:'🎮', name:'Power Up',    dur:1.2 },
  { key:'pop',       emoji:'🎈', name:'Pop',         dur:0.3 },
  { key:'thunder',   emoji:'⛈️', name:'Trovão',     dur:3.0 },
  { key:'heartbeat', emoji:'💓', name:'Coração',     dur:1.2 },
  { key:'swoosh',    emoji:'⚡', name:'Swoosh',      dur:0.4 },
  { key:'horn',      emoji:'📯', name:'Buzina',      dur:1.0 },
  { key:'crowd',     emoji:'🎉', name:'Multidão',    dur:2.5 },
  { key:'drop',      emoji:'💧', name:'Gota',        dur:0.6 },
  { key:'drums',     emoji:'🎵', name:'Bateria',     dur:1.6 },
  { key:'woah',      emoji:'😮', name:'Woah',        dur:0.9 },
  { key:'cash',      emoji:'💰', name:'Dinheiro',    dur:1.0 },
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [textLines, setTextLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const [fontSize, setFontSize] = useState(35);
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Poppins');
  const [exportFormat, setExportFormat] = useState('webm_offline_audio');

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
  const [stickerPanelPos, setStickerPanelPos] = useState({ top: 80, left: 0 });
  const [stickerTab, setStickerTab] = useState('emoji');  // 'emoji'|'sticker'|'gif'
  const activeStickerRef = useRef(null);                  // id do sticker selecionado (sem re-render)
  const [activeStickerId, setActiveStickerId] = useState(null);
  const stickerBtnRef   = useRef(null);                   // posição real do botão para painel fixed
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
  const [chatOpen,  setChatOpen]  = useState(false);
  const [chatTopic, setChatTopic] = useState(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [editingLyricId, setEditingLyricId] = useState(null);
  const [editingExtraTextId, setEditingExtraTextId] = useState(null);

  // ── UNDO / REDO ────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=Montserrat:wght@700&family=Poppins:wght@700&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&family=Raleway:wght@700&family=Playfair+Display:wght@700&family=Lora:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Fecha tela cheia com ESC; fecha painel sticker com ESC ou clique fora
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setIsFullscreen(false); setShowStickerPanel(false); setShowTemplatePanel(false); }
    };
    const onClickOut = (e) => {
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
  }, [showStickerPanel, showSfxPanel, showTemplatePanel]);

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
      const src = URL.createObjectURL(file);
      const videoEl = document.createElement('video');
      videoEl.src = src;
      videoEl.muted = false;        // áudio ativo por padrão
      videoEl.playsInline = true;
      videoEl.preload = 'auto';
      // Precisa estar no DOM para o browser liberar reprodução de áudio
      videoEl.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px';
      document.body.appendChild(videoEl);
      const id = Date.now() + index;
      videoEl.onloadedmetadata = () => {
        const vidDuration = videoEl.duration || 3;
        const audioDuration = audioRef.current?.duration || duration;
        // Posiciona após o último item existente
        const lastEnd = videos.reduce((max, v) => Math.max(max, v.end || 0), 0);
        const start = lastEnd;
        const end   = start + vidDuration;
        // Tamanho inicial: ocupa ~70% do canvas mantendo aspect ratio
        const canvas = canvasRef.current;
        const cW = canvas?.width || 270;
        const cH = canvas?.height || 480;
        const aspectRatio = videoEl.videoWidth / videoEl.videoHeight || 1;
        const maxW = cW * 0.72;
        const maxH = cH * 0.72;
        const scale = Math.min(maxW / videoEl.videoWidth, maxH / videoEl.videoHeight, 1);
        const w = Math.max(40, videoEl.videoWidth * scale);
        const h = Math.max(40, videoEl.videoHeight * scale);
        const x = (cW - w) / 2;
        const y = (cH - h) / 2;
        setVideos(prev => [...prev, {
          id, src, videoEl, start, end,
          x, y, width: w, height: h, radius: 12, muted: false,
        }]);
      };
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
      // Usa tempo do áudio se disponível, senão usa o relógio virtual
      const startTime = audioRef.current ? audioRef.current.currentTime : virtualTimeRef.current;
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
    setStickers(prev => [...prev, {
      id: Date.now() + Math.random(),
      type, content, animStyle, size, rotation: 0,
      x: Math.round(cw / 2 + (Math.random() - 0.5) * cw * 0.3),
      y: Math.round(ch / 2 + (Math.random() - 0.5) * ch * 0.3),
    }]);
  };

  const removeSticker = (id) => setStickers(prev => prev.filter(s => s.id !== id));

  const removeLyric = (id) => {
    setLyrics(lyrics.filter(l => l.id !== id));
  };

  const handleStopPlayback = () => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    if (clockIntervalRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; }
    virtualTimeRef.current = 0;
    setIsPlaying(false);
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
    setDragging({ id, type, initialX: e.clientX, itemKind: 'lyric',
      initialStart: lyric?.start ?? 0, initialEnd: lyric?.end ?? 3 });
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
    setDragging({ id, type, initialX: e.clientX, itemKind: 'image', initialStart: item?.start ?? 0, initialEnd: item?.end ?? 3 });
  };

  const handleVideoTimelineMouseDown = (id, type, e) => {
    e.stopPropagation();
    setActiveVideoId(id);
    const item = videos.find(v => v.id === id);
    if (item) {
      const seekTo = item.start + 0.05;
      if (audioRef.current) audioRef.current.currentTime = seekTo;
      virtualTimeRef.current = seekTo;
      setCurrentTime(seekTo);
      if (playheadRef.current) playheadRef.current.style.transform = `translateX(${seekTo * zoom}px)`;
    }
    setDragging({ id, type, initialX: e.clientX, itemKind: 'video', initialStart: item?.start ?? 0, initialEnd: item?.end ?? 3 });
  };

  const scrubToClientX = (clientX) => {
    const container = timelineScrollRef.current;
    const audio = audioRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const rawX = clientX - rect.left + container.scrollLeft;
    const lyricMax = lyrics.reduce((max, l) => Math.max(max, l.end || 0), 0);
    const imageMax = images.reduce((max, item) => Math.max(max, item.end || 0), 0);
    const maxTime = Math.max(duration, lyricMax, imageMax);
    const nextTime = Math.max(0, Math.min(maxTime, rawX / zoom));
    if (audio) audio.currentTime = nextTime;
    virtualTimeRef.current = nextTime;
    setCurrentTime(nextTime);
    if (playheadRef.current) {
      playheadRef.current.style.transform = `translateX(${nextTime * zoom}px)`;
    }
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
        setDragging({ type: 'sticker', id: stk.id, offsetX: mouseX - stk.x, offsetY: mouseY - stk.y });
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
        setDragging({
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
        setDragging({ type: 'extra', id: txt.id, offsetX: mouseX - txt.x, offsetY: mouseY - txt.y });
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
          setDragging({ type: 'lyric-rotate', id: visibleLyric.id, cx: lx, cy: ly,
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
        setDragging({ type: 'lyric-canvas', id: visibleLyric.id, offsetX: mouseX - lx, offsetY: mouseY - ly });
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
        setDragging({ itemKind: 'canvas-image', type: 'resize', id: clickedItem.id, corner,
          startX: mouseX, startY: mouseY,
          startWidth: clickedItem.width, startHeight: clickedItem.height,
          startXPos: clickedItem.x, startYPos: clickedItem.y });
      } else {
        setDragging({ itemKind: 'canvas-image', type: 'move', id: clickedItem.id,
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
        setDragging({ itemKind: 'canvas-video', type: 'resize', id: clickedVideo.id, corner,
          startX: mouseX, startY: mouseY,
          startWidth: clickedVideo.width, startHeight: clickedVideo.height,
          startXPos: clickedVideo.x, startYPos: clickedVideo.y });
      } else {
        setDragging({ itemKind: 'canvas-video', type: 'move', id: clickedVideo.id,
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
        const newStart = Math.max(0, Math.min(dragging.initialStart + dx, dragging.initialEnd - 0.1));
        setVideos(prev => prev.map(v => v.id === dragging.id ? { ...v, start: newStart } : v));
      } else if (dragging.type === 'resize-end') {
        const newEnd = Math.max(dragging.initialStart + 0.1, dragging.initialEnd + dx);
        setVideos(prev => prev.map(v => v.id === dragging.id ? { ...v, end: newEnd } : v));
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
    setDragging(null);
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

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const time = audioRef.current ? audioRef.current.currentTime : virtualTimeRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Desenha TODOS os vídeos ativos (abaixo das imagens)
    getVideosForTime(time).forEach(v => {
      if (!v.videoEl || v.videoEl.readyState < 1) return;
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
    stickersRef.current.forEach(stk => {
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
    const audio = audioRef.current;
    const t = audio ? audio.currentTime : virtualTimeRef.current;
    const playing = isPlayingRef.current;
    videosRef.current.forEach(v => {
      if (!v.videoEl) return;
      const active = t >= v.start && t <= v.end;
      const relTime = Math.max(0, Math.min(t - v.start, v.videoEl.duration || 0));
      if (active) {
        // Só faz seek quando pausado ou com desvio grande (>1s)
        // Fazer seek enquanto tocando interrompe o áudio
        if (v.videoEl.paused && Math.abs(v.videoEl.currentTime - relTime) > 0.1) {
          v.videoEl.currentTime = relTime;
        } else if (!v.videoEl.paused && Math.abs(v.videoEl.currentTime - relTime) > 1.0) {
          v.videoEl.currentTime = relTime;
        }
        if (playing && v.videoEl.paused) {
          v.videoEl.muted = v.muted || false;
          v.videoEl.play().catch(() => {});
        } else if (!playing && !v.videoEl.paused) {
          v.videoEl.pause();
        }
      } else {
        if (!v.videoEl.paused) v.videoEl.pause();
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
      const t_now = audio ? audio.currentTime : virtualTimeRef.current;
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
    const onTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('timeupdate', onTime);
    return () => audio.removeEventListener('timeupdate', onTime);
  }, [audioSrc]);

  // Aplica volume/speed no elemento <audio> ao mudar (ref já atualizado pelo wrapper)
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, projectVolume));
  }, [projectVolume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = Math.max(0.25, Math.min(4, projectSpeed));
  }, [projectSpeed]);

  const renderAtTimeToCanvas = async (targetCanvas, t, scale = 1) => {
    const ctx = targetCanvas.getContext('2d');
    // ⚠️ Reseta transform antes de cada frame para não acumular ctx.scale entre chamadas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    // Aplica escala HD: coordenadas lógicas (270×480) × scale = resolução final
    ctx.scale(scale, scale);
    const logicalW = targetCanvas.width / scale;
    const logicalH = targetCanvas.height / scale;
    if (image) {
      ctx.drawImage(image, 0, 0, logicalW, logicalH);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, logicalW, logicalH);
    }
    // Renderiza TODOS os vídeos ativos no instante t (seek assíncrono robusto)
    const activeVids = getVideosForTime(t);
    await Promise.all(activeVids.map(v => new Promise(resolve => {
      if (!v.videoEl) return resolve();
      const relTime = Math.max(0, Math.min(t - v.start, v.videoEl.duration || 0));
      v.videoEl.pause();
      // Se já está próximo o suficiente E tem dados, desenha direto
      if (Math.abs(v.videoEl.currentTime - relTime) < 0.1 && v.videoEl.readyState >= 2) return resolve();
      // Aguarda seeked + readyState >= 2
      const done = () => { v.videoEl.removeEventListener('seeked', onSeeked); clearTimeout(timeout); resolve(); };
      const onSeeked = () => {
        if (v.videoEl.readyState >= 2) { done(); return; }
        // readyState ainda baixo: aguarda mais um pouco
        const wait = setTimeout(() => done(), 200);
        v.videoEl.addEventListener('canplay', () => { clearTimeout(wait); done(); }, { once: true });
      };
      const timeout = setTimeout(() => done(), 600);
      v.videoEl.addEventListener('seeked', onSeeked, { once: true });
      v.videoEl.currentTime = relTime;
    })));
    activeVids.forEach(v => {
      if (!v.videoEl || v.videoEl.readyState < 1) return;
      const _evf = buildFilterString(v.filters);
      const _etr = getTransitionTransform(v, t);
      ctx.save();
      if (_etr) { _applyTr(ctx, _etr, _evf, v); } else if(_evf!=='none'){ctx.filter=_evf;}
      drawRotatedElement(ctx, () => drawRoundedImage(ctx, v.videoEl, v.x, v.y, v.width, v.height, v.radius ?? 12), v.x, v.y, v.width, v.height, v.rotation);
      ctx.filter='none'; ctx.restore();
    });
    // Renderiza TODAS as imagens ativas no instante t
    getImagesForTime(t).forEach(overlayImage => {
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
    extraTexts.forEach((txt) => {
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
    const activeLine = lyrics.find(l => t >= l.start && t <= l.end);
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
    stickersRef.current.forEach(stk => {
      const sz = stk.size || 80;
      const { dy, s, r, a } = getStickerAnimTransform(stk.animStyle, t, sz);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(stk.x * scaleX, (stk.y + dy) * scaleY);
      ctx.rotate((stk.rotation || 0) * Math.PI / 180 + r);
      ctx.scale(s * scaleX, s * scaleY);
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

  // ════════════════════════════════════════════════════════════════
  // saveWithPicker — diálogo nativo para nome e pasta do arquivo
  // Usa File System Access API (Chrome/Edge); fallback automático.
  // ════════════════════════════════════════════════════════════════
  const saveWithPicker = async (blobOrDataUrl, suggestedName, mimeType, extensions) => {
    // Normaliza para Blob
    let blob;
    if (typeof blobOrDataUrl === 'string' && blobOrDataUrl.startsWith('data:')) {
      const res = await fetch(blobOrDataUrl);
      blob = await res.blob();
    } else {
      blob = blobOrDataUrl instanceof Blob ? blobOrDataUrl : new Blob([blobOrDataUrl], { type: mimeType });
    }

    // Tenta File System Access API (Chrome 86+, Edge 86+)
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [{ description: mimeType, accept: { [mimeType]: extensions } }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // usuário cancelou — não faz nada
        // Outro erro: cai no fallback abaixo
      }
    }

    // Fallback: download clássico via <a>
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleSaveWebmOffline = async () => {
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;
    const effectiveDuration = (() => {
      if (duration && duration > 0) return duration;
      if (lyrics && lyrics.length) return Math.max(...lyrics.map(l => l.end || 0));
      if (images && images.length) return Math.max(...images.map(i => i.end || 0));
      if (videos && videos.length) return Math.max(...videos.map(v => v.end || 0));
      return 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;
    setIsExporting(true);
    setExportProgress(0);
    try {
      const { default: WebMWriter } = await import('webm-writer');
      const offCanvas = document.createElement('canvas');
      offCanvas.width = baseCanvas.width;
      offCanvas.height = baseCanvas.height;
      const fps = 30;
      const totalFrames = Math.ceil(effectiveDuration * fps);
      const writer = new WebMWriter({ frameRate: fps, quality: 0.95 });
      for (let i = 0; i < totalFrames; i++) {
        const t = i / fps;
        await renderAtTimeToCanvas(offCanvas, t);
        writer.addFrame(offCanvas);
        setExportProgress(((i + 1) / totalFrames));
        await new Promise(r => setTimeout(r, 0));
      }
      const blob = await writer.complete();
      await saveWithPicker(blob, 'canvas.webm', 'video/webm', ['.webm']);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleSaveWebmOfflineWithAudio = async () => {
    if (!window.VideoEncoder || !window.AudioEncoder) {
      alert('Recurso disponível apenas em Chrome/Edge (WebCodecs).');
      return;
    }
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;
    const effectiveDuration = (() => {
      if (duration && duration > 0) return duration;
      if (lyrics && lyrics.length) return Math.max(...lyrics.map(l => l.end || 0));
      if (images && images.length) return Math.max(...images.map(i => i.end || 0));
      if (videos && videos.length) return Math.max(...videos.map(v => v.end || 0));
      return 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;
    const _spd1 = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    const _vol1 = Math.max(0, Math.min(1, projectVolumeRef.current));
    const outputDuration1 = effectiveDuration / _spd1;
    // Pausa todos os vídeos antes de exportar
    videosRef.current.forEach(v => { if (v.videoEl && !v.videoEl.paused) v.videoEl.pause(); });
    setIsExporting(true);
    setExportProgress(0);
    try {
      const { Muxer, ArrayBufferTarget } = await import('webm-muxer');
      const offCanvas = document.createElement('canvas');
      offCanvas.width = baseCanvas.width;
      offCanvas.height = baseCanvas.height;
      const fps = 30;
      const totalFrames = Math.ceil(outputDuration1 * fps);
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({
        target,
        video: { codec: 'V_VP8', width: offCanvas.width, height: offCanvas.height, frameRate: fps },
        audio: (audioFile || audioBase64) ? { codec: 'A_OPUS', sampleRate: 48000, numberOfChannels: 2 } : undefined
      });
      const vEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: () => {}
      });
      vEncoder.configure({ codec: 'vp8', width: offCanvas.width, height: offCanvas.height, bitrate: 2_000_000 });
      let aEncoder = null;
      if (audioFile || audioBase64) {
        try {
          aEncoder = new AudioEncoder({
            output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
            error: () => {}
          });
          aEncoder.configure({ codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 });
          let audioBufferData;
          if (audioFile) {
            audioBufferData = await audioFile.arrayBuffer();
          } else {
            // Reconstrói do base64 (projeto importado)
            const b64 = audioBase64.split(',')[1];
            const binary = atob(b64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            audioBufferData = bytes.buffer;
          }
          // Decodifica audio
          const _tmpAc1 = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
          const _rawBuf1 = await _tmpAc1.decodeAudioData(audioBufferData);
          _tmpAc1.close();
          const [_out01, _out11] = await _renderAudioStretched(_rawBuf1, _spd1, _vol1, 48000);
          await _mixSfxIntoBuffers(_out01, _out11, soundEffects, 48000);
          const _blk1 = 4096;
          for (let _op1 = 0; _op1 < _out01.length; _op1 += _blk1) {
            const _bl1 = Math.min(_blk1, _out01.length - _op1);
            const _pl1 = new Float32Array(_bl1 * 2);
            for (let _i = 0; _i < _bl1; _i++) {
              _pl1[_i]              = _out01[_op1+_i] || 0;
              _pl1[_bl1+_i]    = _out11[_op1+_i] || 0;
            }
            const _ad1 = new AudioData({ format:'f32-planar', sampleRate:48000, numberOfChannels:2,
              numberOfFrames:_bl1, timestamp:Math.round((_op1/48000)*1_000_000), data:_pl1.buffer });
            aEncoder.encode(_ad1); _ad1.close();
          }
          await aEncoder.flush();
        } catch(e) {
          console.error('[WEBM SD Audio]', e);
          aEncoder = null;
        }
      }
      for (let i = 0; i < totalFrames; i++) {
        const t = i / fps * _spd1;
        await renderAtTimeToCanvas(offCanvas, t);
        const bitmap = await createImageBitmap(offCanvas);
        const videoFrame = new VideoFrame(bitmap, { timestamp: Math.round((i / fps) * 1_000_000) });
        vEncoder.encode(videoFrame);
        videoFrame.close();
        bitmap.close();
        setExportProgress((i + 1) / totalFrames);
        await new Promise(r => setTimeout(r, 0));
      }
      await vEncoder.flush();
      muxer.finalize();
      const blob = new Blob([target.buffer], { type: 'video/webm' });
      await saveWithPicker(blob, 'canvas.webm', 'video/webm', ['.webm']);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

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
      saveWithPicker(blob, 'canvas.webm', 'video/webm', ['.webm']);
    };
    recorder.start();
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      const onAudioEnded = () => {
        recorder.stop();
        audio.removeEventListener('ended', onAudioEnded);
      };
      audio.addEventListener('ended', onAudioEnded);
    } else {
      setTimeout(() => recorder.stop(), 3000);
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
              videoEl.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px';
              document.body.appendChild(videoEl);
              await new Promise(res2 => {
                videoEl.onloadedmetadata = res2;
                videoEl.onerror = res2;
                setTimeout(res2, 3000);
              });
              loadedVideos.push({
                id: vData.id || Date.now() + Math.random(),
                src, videoEl,
                start: vData.start ?? 0, end: vData.end ?? 3,
                x: vData.x ?? 0, y: vData.y ?? 0,
                width: vData.width ?? 200, height: vData.height ?? 200,
                radius: vData.radius ?? 12, rotation: vData.rotation ?? 0,
                muted: vData.muted || false,
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
  const handleSaveMp4 = async () => {
    if (!window.VideoEncoder) {
      alert('Exportação MP4 disponível apenas em Chrome/Edge.');
      return;
    }
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;
    const effectiveDuration = (() => {
      if (duration && duration > 0) return duration;
      if (lyrics.length) return Math.max(...lyrics.map(l => l.end || 0));
      if (images.length) return Math.max(...images.map(i => i.end || 0));
      if (videos.length) return Math.max(...videos.map(v => v.end || 0));
      return 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;
    const _spd2 = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    const _vol2 = Math.max(0, Math.min(1, projectVolumeRef.current));
    const outputDuration2 = effectiveDuration / _spd2;
    setIsExporting(true); setExportProgress(0);
    try {
      const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
      const W = baseCanvas.width, H = baseCanvas.height;
      const FPS = 30, TOTAL = Math.ceil(outputDuration2 * FPS);
      // Pré-decodifica áudio (suporta audioFile e audioBase64)
      let _abSD = null;
      if ((audioFile || audioBase64) && window.AudioEncoder) {
        try {
          let _buf;
          if (audioFile) {
            _buf = await audioFile.arrayBuffer();
          } else {
            const _b = atob(audioBase64.split(',')[1]);
            const _by = new Uint8Array(_b.length);
            for (let _i = 0; _i < _b.length; _i++) _by[_i] = _b.charCodeAt(_i);
            _buf = _by.buffer;
          }
          const _ac2 = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
          _abSD = await _ac2.decodeAudioData(_buf);
          _ac2.close();
        } catch(_e) { console.error('[MP4 SD decode]', _e); }
      }
      const _sdRate = 44100;
      const _outSampSD = Math.floor(_sdRate * outputDuration2);
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({ target, video: { codec: 'avc', width: W, height: H },
        audio: _abSD ? { codec: 'aac', sampleRate: _sdRate, numberOfChannels: 2 } : undefined,
        fastStart: 'in-memory' });
      // ── Áudio PRIMEIRO (igual ao WEBM) → mp4-muxer recebe chunks em ordem ──
      if (_abSD) {
        try {
          const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: console.error });
          aenc.configure({ codec: 'mp4a.40.2', sampleRate: _sdRate, numberOfChannels: 2, bitrate: 192000 });
          const [_out02, _out12] = await _renderAudioStretched(_abSD, _spd2, _vol2, _sdRate);
          await _mixSfxIntoBuffers(_out02, _out12, soundEffects, _sdRate);
          const _blk2 = 4096;
          for (let _op2 = 0; _op2 < _out02.length; _op2 += _blk2) {
            const _bl2 = Math.min(_blk2, _out02.length - _op2);
            const _pl2 = new Float32Array(_bl2 * 2);
            for (let _i = 0; _i < _bl2; _i++) {
              _pl2[_i]         = _out02[_op2+_i] || 0;
              _pl2[_bl2+_i]    = _out12[_op2+_i] || 0;
            }
            const _ad2 = new AudioData({ format:'f32-planar', sampleRate:_sdRate, numberOfChannels:2,
              numberOfFrames:_bl2, timestamp:Math.round((_op2/_sdRate)*1_000_000), data:_pl2.buffer });
            aenc.encode(_ad2); _ad2.close();
          }
          await aenc.flush();
        } catch(e) { console.error('[MP4 SD Audio]', e); }
      }
      // ── Vídeo depois ──────────────────────────────────────────────────────
      const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: console.error });
      venc.configure({ codec: 'avc1.42001f', width: W, height: H, bitrate: 4_000_000, framerate: FPS });
      const offCanvas = new OffscreenCanvas(W, H);
      for (let fi = 0; fi < TOTAL; fi++) {
        const t = fi / FPS * _spd2;
        await renderAtTimeToCanvas(offCanvas, t);
        const frame = new VideoFrame(offCanvas, { timestamp: Math.round(fi * 1_000_000 / FPS), duration: Math.round(1_000_000 / FPS) });
        venc.encode(frame, { keyFrame: fi % 60 === 0 });
        frame.close();
        setExportProgress(fi / TOTAL);
      }
      await venc.flush();
      muxer.finalize();
      setExportProgress(1);
      const blob = new Blob([target.buffer], { type: 'video/mp4' });
      await saveWithPicker(blob, 'canvas.mp4', 'video/mp4', ['.mp4']);
    } catch(err) {
      console.error('[MP4 Export]', err);
      alert('Erro ao exportar MP4: ' + err.message);
    } finally { setIsExporting(false); setExportProgress(0); }
  };

  // ── Exportação MP4 HD 1080×1920 ─────────────────────────────────────────────
  const handleSaveMp4HD = async () => {
    if (!window.VideoEncoder) {
      alert('Exportação MP4 HD disponível apenas em Chrome/Edge.');
      return;
    }
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;
    const effectiveDuration = (() => {
      if (duration && duration > 0) return duration;
      if (lyrics.length) return Math.max(...lyrics.map(l => l.end || 0));
      if (images.length) return Math.max(...images.map(i => i.end || 0));
      if (videos.length) return Math.max(...videos.map(v => v.end || 0));
      return 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;
    const _spd3 = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    const _vol3 = Math.max(0, Math.min(1, projectVolumeRef.current));
    const outputDuration3 = effectiveDuration / _spd3;
    setIsExporting(true); setExportProgress(0);
    try {
      const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
      const SCALE = 1080 / baseCanvas.width;
      const W = 1080, H = Math.round(baseCanvas.height * SCALE);
      const FPS = 30, TOTAL = Math.ceil(outputDuration3 * FPS);
      // Pré-decodifica áudio (suporta audioFile e audioBase64)
      let _abHD = null;
      if ((audioFile || audioBase64) && window.AudioEncoder) {
        try {
          let _buf;
          if (audioFile) {
            _buf = await audioFile.arrayBuffer();
          } else {
            const _b = atob(audioBase64.split(',')[1]);
            const _by = new Uint8Array(_b.length);
            for (let _i = 0; _i < _b.length; _i++) _by[_i] = _b.charCodeAt(_i);
            _buf = _by.buffer;
          }
          const _ac3 = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
          _abHD = await _ac3.decodeAudioData(_buf);
          _ac3.close();
        } catch(_e) { console.error('[MP4 HD decode]', _e); }
      }
      const _hdRate = 44100;
      const _outSampHD = Math.floor(_hdRate * outputDuration3);
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({ target, video: { codec: 'avc', width: W, height: H },
        audio: _abHD ? { codec: 'aac', sampleRate: _hdRate, numberOfChannels: 2 } : undefined,
        fastStart: 'in-memory' });
      // ── Áudio PRIMEIRO (igual ao WEBM) → mp4-muxer recebe chunks em ordem ──
      if (_abHD) {
        try {
          const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: console.error });
          aenc.configure({ codec: 'mp4a.40.2', sampleRate: _hdRate, numberOfChannels: 2, bitrate: 192000 });
          const [_out03, _out13] = await _renderAudioStretched(_abHD, _spd3, _vol3, _hdRate);
          await _mixSfxIntoBuffers(_out03, _out13, soundEffects, _hdRate);
          const _blk3 = 4096;
          for (let _op3 = 0; _op3 < _out03.length; _op3 += _blk3) {
            const _bl3 = Math.min(_blk3, _out03.length - _op3);
            const _pl3 = new Float32Array(_bl3 * 2);
            for (let _i = 0; _i < _bl3; _i++) {
              _pl3[_i]         = _out03[_op3+_i] || 0;
              _pl3[_bl3+_i]    = _out13[_op3+_i] || 0;
            }
            const _ad3 = new AudioData({ format:'f32-planar', sampleRate:_hdRate, numberOfChannels:2,
              numberOfFrames:_bl3, timestamp:Math.round((_op3/_hdRate)*1_000_000), data:_pl3.buffer });
            aenc.encode(_ad3); _ad3.close();
          }
          await aenc.flush();
        } catch(e) { console.error('[MP4 HD Audio]', e); }
      }
      // ── Vídeo depois ──────────────────────────────────────────────────────
      const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: console.error });
      // avc1.640034 = H.264 High Profile Level 5.2 — suporta até 4K (resolve erro Level 3.1)
      venc.configure({ codec: 'avc1.640034', width: W, height: H, bitrate: 8_000_000, framerate: FPS });
      const offCanvas = new OffscreenCanvas(W, H);
      for (let fi = 0; fi < TOTAL; fi++) {
        const t = fi / FPS * _spd3;
        await renderAtTimeToCanvas(offCanvas, t, SCALE);
        const frame = new VideoFrame(offCanvas, { timestamp: Math.round(fi * 1_000_000 / FPS), duration: Math.round(1_000_000 / FPS) });
        venc.encode(frame, { keyFrame: fi % 60 === 0 });
        frame.close();
        setExportProgress(fi / TOTAL);
      }
      await venc.flush();
      muxer.finalize();
      setExportProgress(1);
      const blob = new Blob([target.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      await saveWithPicker(new Blob([target.buffer], { type: 'video/mp4' }), 'canvas_hd_1080.mp4', 'video/mp4', ['.mp4']);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch(err) {
      console.error('[MP4 HD Export]', err);
      alert('Erro ao exportar MP4 HD: ' + err.message);
    } finally { setIsExporting(false); setExportProgress(0); }
  };


  // ── Exportação HD 1080×1920 — WebCodecs, VP8, 8 Mbps ──────────────────────
  const handleSaveHD = async () => {
    if (!window.VideoEncoder || !window.AudioEncoder) {
      alert('Exportação HD disponível apenas em Chrome/Edge.');
      return;
    }
    const baseCanvas = canvasRef.current;
    if (!baseCanvas) return;
    const effectiveDuration = (() => {
      if (duration && duration > 0) return duration;
      if (lyrics && lyrics.length) return Math.max(...lyrics.map(l => l.end || 0));
      if (images && images.length) return Math.max(...images.map(i => i.end || 0));
      if (videos && videos.length) return Math.max(...videos.map(v => v.end || 0));
      return 3;
    })();
    if (!effectiveDuration || effectiveDuration <= 0) return;
    const _spd4 = Math.max(0.25, Math.min(4, projectSpeedRef.current));
    const _vol4 = Math.max(0, Math.min(1, projectVolumeRef.current));
    const outputDuration4 = effectiveDuration / _spd4;

    const SCALE = 4; // 270×480 → 1080×1920
    const hdW   = baseCanvas.width  * SCALE;
    const hdH   = baseCanvas.height * SCALE;

    // Pausa todos os vídeos antes de exportar HD
    videosRef.current.forEach(v => { if (v.videoEl && !v.videoEl.paused) v.videoEl.pause(); });
    setIsExporting(true);
    setExportProgress(0);
    try {
      const { Muxer, ArrayBufferTarget } = await import('webm-muxer');
      const offCanvas    = document.createElement('canvas');
      offCanvas.width    = hdW;
      offCanvas.height   = hdH;
      const fps          = 30;
      const totalFrames  = Math.ceil(outputDuration4 * fps);
      const target       = new ArrayBufferTarget();

      const muxer = new Muxer({
        target,
        video: { codec: 'V_VP8', width: hdW, height: hdH, frameRate: fps },
        audio: (audioFile || audioBase64)
          ? { codec: 'A_OPUS', sampleRate: 48000, numberOfChannels: 2 }
          : undefined,
      });

      const vEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error:  () => {},
      });
      vEncoder.configure({ codec: 'vp8', width: hdW, height: hdH, bitrate: 8_000_000 });

      // Áudio
      let aEncoder = null;
      if (audioFile || audioBase64) {
        try {
          aEncoder = new AudioEncoder({
            output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
            error:  () => {},
          });
          aEncoder.configure({ codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 192000 });

          let audioBufferData;
          if (audioFile) {
            audioBufferData = await audioFile.arrayBuffer();
          } else {
            const b64    = audioBase64.split(',')[1];
            const binary = atob(b64);
            const bytes  = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            audioBufferData = bytes.buffer;
          }

          const ac     = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
          const buffer = await ac.decodeAudioData(audioBufferData);
          ac.close();
          const [_out04, _out14] = await _renderAudioStretched(buffer, _spd4, _vol4, 48000);
          await _mixSfxIntoBuffers(_out04, _out14, soundEffects, 48000);
          const _blk4 = 4096;
          for (let _op4 = 0; _op4 < _out04.length; _op4 += _blk4) {
            const _bl4 = Math.min(_blk4, _out04.length - _op4);
            const _pl4 = new Float32Array(_bl4 * 2);
            for (let _i = 0; _i < _bl4; _i++) {
              _pl4[_i]              = _out04[_op4+_i] || 0;
              _pl4[_bl4+_i]    = _out14[_op4+_i] || 0;
            }
            const _ad4 = new AudioData({ format:'f32-planar', sampleRate:48000, numberOfChannels:2,
              numberOfFrames:_bl4, timestamp:Math.round((_op4/48000)*1_000_000), data:_pl4.buffer });
            aEncoder.encode(_ad4); _ad4.close();
          }
          await aEncoder.flush();
        } catch(e) {
          console.error('[WEBM HD Audio]', e);
          aEncoder = null;
        }
      }

      // Frames HD
      for (let i = 0; i < totalFrames; i++) {
        const t = i / fps * _spd4;
        await renderAtTimeToCanvas(offCanvas, t, SCALE);
        const bitmap     = await createImageBitmap(offCanvas);
        const videoFrame = new VideoFrame(bitmap, { timestamp: Math.round((i / fps) * 1_000_000) });
        vEncoder.encode(videoFrame);
        videoFrame.close();
        bitmap.close();
        setExportProgress((i + 1) / totalFrames);
        await new Promise(r => setTimeout(r, 0));
      }

      await vEncoder.flush();
      muxer.finalize();

      const blob = new Blob([target.buffer], { type: 'video/webm' });
      await saveWithPicker(blob, 'canvas_hd_1080.webm', 'video/webm', ['.webm']);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
            <input ref={bgInputRef} type="file" onChange={handleImageChange} accept="image/*" style={{ color: '#f8fafc', fontSize: '11px' }} />
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
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} style={{ backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '7px 10px', fontSize: '12px' }}>
            <option value="webm_offline_audio">🎬 {t('fmt_webm')}</option>
            <option value="mp4">🎬 {t('fmt_mp4')}</option>
            <option value="webm_hd">✨ {t('fmt_webm_hd')}</option>
            <option value="mp4_hd">✨ {t('fmt_mp4_hd')}</option>
            <option value="png">🖼️ PNG</option>
            <option value="jpg">🖼️ JPG</option>
          </select>
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

          {/* ── Separador vertical ── */}
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />

          {/* Volume do projeto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#00BFFF', fontWeight: 700, whiteSpace: 'nowrap' }}>
              {projectVolume === 0 ? '🔇' : projectVolume < 0.5 ? '🔉' : '🔊'} {t('ed_vol')}
            </span>
            <input type="range" min={0} max={1} step={0.01} value={projectVolume}
              onChange={e => setVolume(+e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              onPointerDown={e => e.stopPropagation()}
              style={{ width: 90, accentColor: '#00BFFF' }} />
            <span style={{ fontSize: 10, color: projectVolume !== 1 ? '#00BFFF' : '#555', minWidth: 30, fontWeight: 700 }}>{Math.round(projectVolume * 100)}%</span>
          </div>

          {/* Velocidade do projeto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#00BFFF', fontWeight: 700, whiteSpace: 'nowrap' }}>⚡ {t('ed_speed')}</span>
            <input type="range" min={0.25} max={4} step={0.05} value={projectSpeed}
              onChange={e => setSpeed(+e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              onPointerDown={e => e.stopPropagation()}
              style={{ width: 90, accentColor: '#00BFFF' }} />
            <span style={{ fontSize: 10, color: projectSpeed !== 1 ? '#00BFFF' : '#555', minWidth: 28, fontWeight: 700 }}>{projectSpeed}×</span>
          </div>

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
                  const DurSlider = ({ value, onChange }) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
                      <span style={{ fontSize: 10, color: '#444', minWidth: 54 }}>{t('ed_duration')}</span>
                      <input type="range" min={0.05} max={2} step={0.05} value={value}
                        onChange={e => onChange(+e.target.value)}
                        onMouseDown={e => e.stopPropagation()}
                        onPointerDown={e => e.stopPropagation()}
                        style={{ flex: 1, accentColor: accent }} />
                      <span style={{ fontSize: 10, color: accent, minWidth: 34, textAlign: 'right' }}>{value.toFixed(2)}s</span>
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
                        {trIn !== 'none' && <DurSlider value={durIn} onChange={v => upd({ transitionInDur: v })} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>◀ {t('tr_out')}</span>
                          {trOut !== 'none' && <button onClick={() => upd({ transitionOut: 'none' })} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>}
                        </div>
                        <TrGrid current={trOut} onSelect={v => upd({ transitionOut: v })} />
                        {trOut !== 'none' && <DurSlider value={durOut} onChange={v => upd({ transitionOutDur: v })} />}
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
                  <option value="Poppins">Poppins</option>
                  <option value="Bebas Neue">Bebas Neue</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Roboto Condensed">Roboto Condensed</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Playfair Display">Playfair</option>
                  <option value="Lora">Lora</option>
                  {customFonts.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                  {activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize || extraTextFontSize) : (extraTexts.length ? extraTexts[extraTexts.length-1]?.fontSize || extraTextFontSize : extraTextFontSize)}px
                </span>
                <input type="range" min="10" max="60"
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize || extraTextFontSize) : (extraTexts.length ? extraTexts[extraTexts.length-1]?.fontSize || extraTextFontSize : extraTextFontSize)}
                  onChange={e => { const v=parseInt(e.target.value); setExtraTextFontSize(v); const tid = activeExtraTextId || (extraTexts.length ? extraTexts[extraTexts.length-1].id : null); if(tid) setExtraTexts(prev=>prev.map(t=>t.id===tid?{...t,fontSize:v}:t)); }}
                  style={{ width: '90px', accentColor: '#00BFFF' }} />
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.5px' }}>
                {t('ed_lyrics_title')}
                {activeLyricId && <span style={{ marginLeft: 6, color: 'rgba(0,191,255,0.6)', fontWeight: 400, fontSize: 10 }}>({t('ed_selected')})</span>}
              </label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} title="Cor da letra" style={{ width: '26px', height: '26px', padding: 0, border: '1px solid rgba(0,191,255,0.2)', background: '#111', borderRadius: '7px', cursor: 'pointer' }} />
              <select
                value={activeLyricId ? (lyrics.find(l => l.id === activeLyricId)?.fontFamily || fontFamily) : fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  if (activeLyricId) setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, fontFamily: e.target.value} : l));
                }}
                style={{ fontSize: '11px', backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '5px 8px' }}>
                <option value="Poppins">Poppins</option>
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Oswald">Oswald</option>
                <option value="Roboto Condensed">Roboto Condensed</option>
                <option value="Raleway">Raleway</option>
                <option value="Playfair Display">Playfair</option>
                <option value="Lora">Lora</option>
                {customFonts.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                {activeLyricId ? (lyrics.find(l => l.id === activeLyricId)?.fontSize || fontSize) : fontSize}px
              </span>
              <input type="range" min="15" max="70"
                value={activeLyricId ? (lyrics.find(l => l.id === activeLyricId)?.fontSize || fontSize) : fontSize}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setFontSize(v);
                  if (activeLyricId) setLyrics(prev => prev.map(l => l.id === activeLyricId ? {...l, fontSize: v} : l));
                }}
                style={{ flex: 1, minWidth: '60px', accentColor: '#00BFFF' }} />
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
              onClick={() => setIsFullscreen(false)}
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
                  onClick={() => {
                    const audio = audioRef.current;
                    if (isPlaying) {
                      if (audio) audio.pause();
                      if (clockIntervalRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; }
                      setIsPlaying(false);
                    } else {
                      if (audio) {
                        audio.volume = Math.max(0, Math.min(1, projectVolumeRef.current));
                        audio.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                        audio.play().catch(() => {});
                      } else {
                        const startWall = Date.now(); const startVirt = virtualTimeRef.current;
                        if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
                        clockIntervalRef.current = setInterval(() => {
                          const elapsed = (Date.now() - startWall) / 1000;
                          const newTime = startVirt + elapsed;
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
                  }}
                  style={{ background: isPlaying ? '#00BFFF' : 'rgba(0,191,255,0.12)', border: '1px solid rgba(0,191,255,0.4)', borderRadius: 10, padding: '6px 18px', color: isPlaying ? '#000' : '#00BFFF', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >{isPlaying ? '⏸ Pausar' : '▶ Play'}</button>
                <button
                  onClick={handleStopPlayback}
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '6px 18px', color: '#f87171', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                >⏹ Stop</button>
                <span style={{ fontSize: 13, color: '#00BFFF', fontWeight: 700, minWidth: 100 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '6px 14px', color: '#f87171', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >✕ Fechar</button>
              </div>
              <canvas
                ref={node => {
                  if (!node || !canvasRef.current) return;
                  // Espelha o conteúdo do canvas principal neste canvas de preview
                  const src = canvasRef.current;
                  node.width  = src.width;
                  node.height = src.height;
                  const ctx = node.getContext('2d');
                  const draw = () => {
                    ctx.clearRect(0, 0, node.width, node.height);
                    ctx.drawImage(src, 0, 0);
                    node._rafId = requestAnimationFrame(draw);
                  };
                  if (node._rafId) cancelAnimationFrame(node._rafId);
                  draw();
                  node._cleanup = () => cancelAnimationFrame(node._rafId);
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
            <button onClick={() => {
              const audio = audioRef.current;
              if (isPlaying) {
                // Pausar
                if (audio) audio.pause();
                // Para o clock virtual
                if (clockIntervalRef.current) { clearInterval(clockIntervalRef.current); clockIntervalRef.current = null; }
                setIsPlaying(false);
              } else {
                // Iniciar — dispara play nos vídeos ativos dentro do gesto do usuário
                const tNow = virtualTimeRef.current;
                videosRef.current.forEach(v => {
                  if (!v.videoEl) return;
                  if (tNow >= v.start && tNow <= v.end) {
                    const rel = Math.max(0, Math.min(tNow - v.start, v.videoEl.duration || 0));
                    v.videoEl.currentTime = rel;
                    v.videoEl.muted = v.muted || false;
                    v.videoEl.play().catch(() => {});
                  }
                });
                if (audio) {
                  audio.volume       = Math.max(0, Math.min(1, projectVolumeRef.current));
                  audio.playbackRate = Math.max(0.25, Math.min(4, projectSpeedRef.current));
                  audio.play().catch(() => {});
                } else {
                  // Sem áudio: clock virtual baseado em Date.now()
                  const startWall = Date.now();
                  const startVirt = virtualTimeRef.current;
                  if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
                  clockIntervalRef.current = setInterval(() => {
                    const elapsed = (Date.now() - startWall) / 1000;
                    const newTime = startVirt + elapsed;
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
            <span style={{ fontSize: '12px', color: '#00BFFF', fontWeight: 'bold', minWidth: '85px' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
            
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
            if (e.target === e.currentTarget || e.target.id === 'track-bg' || e.target.id === 'wave-container') {
              setIsScrubbing(true);
              scrubToClientX(e.clientX);
            }
          }}
          onDoubleClick={(e) => {
            if (e.target === e.currentTarget || e.target.id === 'track-bg' || e.target.id === 'wave-container') {
              scrubToClientX(e.clientX);
              const audio = audioRef.current;
              if (audio) {
                audio.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget || e.target.id === 'track-bg' || e.target.id === 'wave-container') {
              scrubToClientX(e.clientX);
            }
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

            {/* FAIXA DE ÁUDIO — canvas estático, sem re-renders */}
            <canvas
              id="wave-container"
              ref={waveformCanvasRef}
              width={Math.ceil(audioPxWidth)}
              height={24}
              style={{ position: 'absolute', top: '118px', left: 0, opacity: 0.65, pointerEvents: 'none' }}
            />

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
