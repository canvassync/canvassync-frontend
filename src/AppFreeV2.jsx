import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage, LangToggle } from './hooks/useLanguage.jsx';

// ── Constantes ────────────────────────────────────────────────────────────────
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
  { key:'fire', emoji:'🔥', anim:'bounce', label:'Fogo' },
  { key:'star', emoji:'⭐', anim:'spin',   label:'Estrela' },
  { key:'heart', emoji:'❤️', anim:'pulse', label:'Coração' },
  { key:'party', emoji:'🎉', anim:'shake', label:'Festa' },
  { key:'sparkle', emoji:'✨', anim:'float', label:'Brilho' },
  { key:'crown', emoji:'👑', anim:'bounce', label:'Coroa' },
  { key:'music', emoji:'🎵', anim:'pulse',  label:'Música' },
  { key:'rainbow', emoji:'🌈', anim:'float', label:'Arco-íris' },
  { key:'lightning', emoji:'⚡', anim:'spin', label:'Raio' },
  { key:'diamond', emoji:'💎', anim:'pulse', label:'Diamante' },
  { key:'rocket', emoji:'🚀', anim:'float', label:'Foguete' },
  { key:'dragon', emoji:'🐉', anim:'bounce', label:'Dragão' },
  { key:'trophy', emoji:'🏆', anim:'shake', label:'Troféu' },
  { key:'unicorn', emoji:'🦄', anim:'bounce', label:'Unicórnio' },
  { key:'explosion', emoji:'💥', anim:'pulse', label:'Explosão' },
  { key:'confetti', emoji:'🎊', anim:'shake', label:'Confete' },
  { key:'money', emoji:'💰', anim:'bounce', label:'Dinheiro' },
  { key:'mic', emoji:'🎤', anim:'pulse', label:'Microfone' },
  { key:'camera', emoji:'📸', anim:'shake', label:'Câmera' },
  { key:'clapper', emoji:'🎬', anim:'bounce', label:'Claquete' },
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

const CANVAS_FORMATS = {
  '9:16': { width: 720,  height: 1280 },
  '16:9': { width: 1280, height: 720  },
  '1:1':  { width: 1080, height: 1080 },
  '4:3':  { width: 1024, height: 768  },
};

// Efeitos de tela liberados no Free (2 apenas)
const FREE_SCREEN_EFFECTS = [
  { id: 'vignette',   label: 'Vinheta',     icon: '🌑', preview: 'radial-gradient(#111,#000)' },
  { id: 'film_grain', label: 'Grão de Filme', icon: '📽️', preview: 'linear-gradient(135deg,#111,#1a1a0a)' },
];

// Efeitos bloqueados — mostrados com 🔒
const LOCKED_SCREEN_EFFECTS = [
  { id: 'neon_glow', label: 'Neon Glow', icon: '💡' },
  { id: 'glitch',    label: 'Glitch',    icon: '⚡' },
  { id: 'rain',      label: 'Chuva',     icon: '🌧️' },
  { id: 'fire',      label: 'Fogo',      icon: '🔥' },
  { id: 'matrix',    label: 'Matrix',    icon: '💚' },
  { id: 'aurora',    label: 'Aurora',    icon: '🌌' },
  { id: 'confetti',  label: 'Confete',   icon: '🎊' },
  { id: 'particles', label: 'Partículas', icon: '✨' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '🤖' },
  { id: 'smoke',     label: 'Fumaça',    icon: '💨' },
];

function AppFreeV2() {
  const { t, lang } = useLanguage();

  // ── PWA ──────────────────────────────────────────────────────────────────────
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

  // ── Mídia ────────────────────────────────────────────────────────────────────
  const [image, setImage]       = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [images, setImages]     = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);

  // ── Vídeo overlay (max 1) ────────────────────────────────────────────────────
  const [videoOverlay, setVideoOverlay] = useState(null); // { el, src, x, y, w, h, radius, opacity }
  const [activeVideoOverlay, setActiveVideoOverlay] = useState(false);

  // ── Formato ──────────────────────────────────────────────────────────────────
  const [canvasFormat, setCanvasFormat] = useState('9:16');
  const canvasW = CANVAS_FORMATS[canvasFormat]?.width  || 720;
  const canvasH = CANVAS_FORMATS[canvasFormat]?.height || 1280;

  // ── Textos extras (max 1) ─────────────────────────────────────────────────────
  const [extraTexts, setExtraTexts]             = useState([]);
  const [newExtraInput, setNewExtraInput]       = useState('');
  const [activeExtraTextId, setActiveExtraTextId] = useState(null);
  const [extraTextColor, setExtraTextColor]     = useState('#ffffff');
  const [extraTextFontFamily, setExtraTextFontFamily] = useState('Poppins');
  const [extraTextFontSize, setExtraTextFontSize]     = useState(28);
  const [extraTextShadowEnabled,  setExtraTextShadowEnabled]  = useState(true);
  const [extraTextShadowColor,    setExtraTextShadowColor]    = useState('#000000');
  const [extraTextShadowBlur,     setExtraTextShadowBlur]     = useState(10);
  const [extraTextGradientEnabled, setExtraTextGradientEnabled] = useState(false);
  const [extraTextGradientColor1,  setExtraTextGradientColor1]  = useState('#ffffff');
  const [extraTextGradientColor2,  setExtraTextGradientColor2]  = useState('#00BFFF');

  // ── Letra da música (max 3 frases) ───────────────────────────────────────────
  const [lyrics, setLyrics]           = useState([]);
  const [activeLyricId, setActiveLyricId] = useState(null);
  const [newLyricText, setNewLyricText]   = useState('');
  const [lyricFontSize, setLyricFontSize] = useState(48);
  const [lyricColor, setLyricColor]       = useState('#ffffff');
  const [lyricFontFamily, setLyricFontFamily] = useState('Bebas Neue');
  const [lyricShadowEnabled, setLyricShadowEnabled] = useState(true);
  const [lyricShadowBlur, setLyricShadowBlur]       = useState(12);
  const [showLyricList, setShowLyricList] = useState(true);

  // ── Efeitos de tela ──────────────────────────────────────────────────────────
  const [screenEffect, setScreenEffect] = useState('none');
  const drawScreenEffectRef = useRef(null);

  // ── Stickers ──────────────────────────────────────────────────────────────────
  const [stickers, setStickers]               = useState([]);
  const [activeStickerId, setActiveStickerId] = useState(null);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [stickerPanelPos, setStickerPanelPos]   = useState({ top: 60, left: 0 });
  const [stickerTab, setStickerTab]             = useState('emoji');
  const activeStickerRef = useRef(null);
  const stickersRef      = useRef([]);
  useEffect(() => { stickersRef.current = stickers; }, [stickers]);

  // ── UI panels ────────────────────────────────────────────────────────────────
  const [showMidiasPanel, setShowMidiasPanel]   = useState(false);
  const [showFxPanel, setShowFxPanel]           = useState(false);
  const [showProjetoPanel, setShowProjetoPanel] = useState(false);
  const [showExportPanel, setShowExportPanel]   = useState(false);
  const [isFullscreen, setIsFullscreen]         = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // ── Exportação ───────────────────────────────────────────────────────────────
  const [exportFormat, setExportFormat] = useState('png');

  // ── Drag ─────────────────────────────────────────────────────────────────────
  const [dragging, setDragging] = useState(null);

  // ── Fontes ───────────────────────────────────────────────────────────────────
  const [customFonts, setCustomFonts] = useState([]);
  const fontInputRef = useRef(null);

  // ── Refs ──────────────────────────────────────────────────────────────────────
  const canvasRef          = useRef(null);
  const canvasContainerRef = useRef(null);
  const fullscreenCanvasRef = useRef(null);
  const bgInputRef         = useRef(null);
  const imgInputRef        = useRef(null);
  const videoInputRef      = useRef(null);
  const importInputRef     = useRef(null);
  const stickerBtnRef      = useRef(null);
  const midiaBtnRef        = useRef(null);
  const fxBtnRef           = useRef(null);
  const projetoBtnRef      = useRef(null);
  const exportBtnRef       = useRef(null);

  // ── Google Fonts ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=Montserrat:wght@700&family=Poppins:wght@700&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&family=Raleway:wght@700&family=Playfair+Display:wght@700&family=Lora:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // ── Teclado ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setIsFullscreen(false); setShowStickerPanel(false); setShowMidiasPanel(false); setShowFxPanel(false); setShowProjetoPanel(false); setShowExportPanel(false); setShowUpgradeModal(false); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        if (activeStickerId) { setStickers(p => p.filter(s => s.id !== activeStickerId)); activeStickerRef.current = null; setActiveStickerId(null); }
        else if (activeImageId) { setImages(p => p.filter(i => i.id !== activeImageId)); setActiveImageId(null); }
        else if (activeVideoOverlay) { clearVideoOverlay(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeImageId, activeStickerId, activeVideoOverlay]);

  // ── Font upload ───────────────────────────────────────────────────────────────
  const handleFontUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const url  = URL.createObjectURL(file);
    const face = new FontFace(name, `url("${url}")`);
    await face.load(); document.fonts.add(face);
    setCustomFonts(prev => [...prev, { name }]); e.target.value = '';
  };

  // ── Helpers canvas ────────────────────────────────────────────────────────────
  const buildImagePlacement = useCallback((img) => {
    const maxW = canvasW * 0.72, maxH = canvasH * 0.72;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const width = Math.max(40, img.width * scale), height = Math.max(40, img.height * scale);
    return { x: (canvasW - width) / 2, y: (canvasH - height) / 2, width, height, radius: 18 };
  }, [canvasW, canvasH]);

  const drawRoundedImage = useCallback((ctx, img, x, y, w, h, r) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.save(); ctx.beginPath();
    ctx.moveTo(x + rr, y); ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr); ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr); ctx.closePath(); ctx.clip();
    ctx.drawImage(img, x, y, w, h); ctx.restore();
  }, []);

  const drawRoundedRect = useCallback((ctx, x, y, w, h, r) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + rr, y); ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr); ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr); ctx.closePath();
  }, []);

  const drawResizeHandles = useCallback((ctx, x, y, w, h) => {
    const s = 14;
    ctx.fillStyle = '#00BFFF'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([hx,hy]) => { ctx.strokeRect(hx-s/2,hy-s/2,s,s); ctx.fillRect(hx-s/2,hy-s/2,s,s); });
  }, []);

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

  const wrapLyricText = useCallback((text, ctx, maxWidth) => {
    const manualLines = text.split('\n').filter(l => l.trim() !== '');
    if (manualLines.length > 1) return manualLines;
    const words = text.split(' ');
    if (words.length <= 4) return [text];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }, []);

  // ── Screen effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    drawScreenEffectRef.current = (ctx, effect, W, H, t) => {
      if (!effect || effect === 'none') return;
      ctx.save();
      try {
        switch(effect) {
          case 'vignette': {
            const vg = ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.15,W/2,H/2,Math.max(W,H)*0.72);
            vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(0.5,'rgba(0,0,0,0.3)'); vg.addColorStop(1,'rgba(0,0,0,0.92)');
            ctx.fillStyle = vg; ctx.fillRect(0,0,W,H); break;
          }
          case 'film_grain': {
            for(let i=0;i<1500;i++){const gx=Math.random()*W,gy=Math.random()*H,gs=Math.random()<0.7?1:2;const gv=Math.random();ctx.fillStyle=gv>0.5?`rgba(255,255,255,${0.15+Math.random()*0.35})`:`rgba(0,0,0,${0.1+Math.random()*0.25})`;ctx.fillRect(gx,gy,gs,gs);}
            const fvg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.75);fvg.addColorStop(0,'transparent');fvg.addColorStop(1,'rgba(0,0,0,0.55)');ctx.fillStyle=fvg;ctx.fillRect(0,0,W,H);
            ctx.fillStyle='rgba(40,25,5,0.12)';ctx.fillRect(0,0,W,H); break;
          }
          default: break;
        }
      } catch(e) {}
      ctx.restore();
    };
  }, []);

  // ── Handlers de mídia ─────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target.result);
      const img = new Image(); img.onload = () => setImage(img); img.src = ev.target.result;
    };
    reader.readAsDataURL(file); e.target.value = '';
  };

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files); if (!files.length) return;
    const loaded = await Promise.all(files.map(file => new Promise(res => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        const id  = Date.now() + Math.random();
        img.onload = () => res({ id, src: ev.target.result, img, ...buildImagePlacement(img), rotation: 0, filters: {} });
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    })));
    setImages(prev => [...prev, ...loaded]); e.target.value = '';
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    if (videoOverlay) clearVideoOverlay();
    // Usa blob URL mas NÃO expõe diretamente ao DOM como src visível
    const blobUrl = URL.createObjectURL(file);
    const el = document.createElement('video');
    el.src = blobUrl; el.loop = true; el.muted = true; el.playsInline = true;
    el.style.cssText = 'position:fixed;width:1px;height:1px;top:-9999px;left:-9999px;visibility:hidden;pointer-events:none;';
    document.body.appendChild(el);
    el.onloadedmetadata = () => {
      const aspect = el.videoWidth / (el.videoHeight || 1);
      const h = Math.round(canvasH * 0.5), w = Math.round(h * aspect);
      setVideoOverlay({ el, blobUrl, x: (canvasW - w) / 2, y: (canvasH - h) / 2, w, h, radius: 12, opacity: 1 });
      el.play().catch(() => {});
    };
    e.target.value = '';
  };

  const clearVideoOverlay = () => {
    if (videoOverlay) {
      videoOverlay.el?.pause();
      if (videoOverlay.el?.parentNode) videoOverlay.el.parentNode.removeChild(videoOverlay.el);
      URL.revokeObjectURL(videoOverlay.blobUrl);
      setVideoOverlay(null); setActiveVideoOverlay(false);
    }
  };

  // ── Stickers ──────────────────────────────────────────────────────────────────
  const addSticker = (type, content, animStyle = null) => {
    const id = Date.now() + Math.random();
    setStickers(prev => [...prev, { id, type, content, animStyle, size: 80, rotation: 0, x: canvasW / 2, y: canvasH / 2 }]);
    activeStickerRef.current = id; setActiveStickerId(id);
  };

  // ── Extra texts ───────────────────────────────────────────────────────────────
  const addExtraText = () => {
    if (!newExtraInput.trim() || extraTexts.length >= 1) return;
    const id = Date.now() + Math.random();
    setExtraTexts(prev => [...prev, {
      id, text: newExtraInput.trim(), x: canvasW / 2, y: canvasH * 0.85,
      color: extraTextColor, fontFamily: extraTextFontFamily, fontSize: extraTextFontSize,
      shadowEnabled: extraTextShadowEnabled, shadowColor: extraTextShadowColor, shadowBlur: extraTextShadowBlur,
      gradientEnabled: extraTextGradientEnabled, gradientColor1: extraTextGradientColor1, gradientColor2: extraTextGradientColor2,
      rotation: 0,
    }]);
    setNewExtraInput(''); setActiveExtraTextId(id);
  };

  // ── Lyrics ────────────────────────────────────────────────────────────────────
  const addLyric = () => {
    if (!newLyricText.trim() || lyrics.length >= 3) return;
    const id = Date.now() + Math.random();
    setLyrics(prev => [...prev, {
      id, text: newLyricText.trim(),
      x: canvasW / 2, y: canvasH * 0.72,
      fontSize: lyricFontSize, fontFamily: lyricFontFamily, color: lyricColor,
      shadowEnabled: lyricShadowEnabled, shadowBlur: lyricShadowBlur,
      rotation: 0,
    }]);
    setNewLyricText(''); setActiveLyricId(id);
  };

  // ── Canvas mouse ──────────────────────────────────────────────────────────────
  const toCanvasCoords = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current; if (!canvas) return { mx: 0, my: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      mx: (clientX - rect.left) * (canvas.width / rect.width),
      my: (clientY - rect.top)  * (canvas.height / rect.height),
    };
  }, []);

  const handleCanvasMouseDown = useCallback((e) => {
    e.preventDefault();
    const { mx, my } = toCanvasCoords(e.clientX, e.clientY);

    // Stickers
    for (let i = stickersRef.current.length - 1; i >= 0; i--) {
      const stk = stickersRef.current[i];
      const sz = (stk.size || 80) / 2 + 12;
      if (Math.abs(mx - stk.x) <= sz && Math.abs(my - stk.y) <= sz) {
        activeStickerRef.current = stk.id; setActiveStickerId(stk.id);
        setDragging({ type: 'sticker', id: stk.id, ox: mx - stk.x, oy: my - stk.y });
        return;
      }
    }

    // Video overlay
    if (videoOverlay) {
      const v = videoOverlay;
      if (mx >= v.x && mx <= v.x + v.w && my >= v.y && my <= v.y + v.h) {
        setActiveVideoOverlay(true); setActiveImageId(null); activeStickerRef.current = null; setActiveStickerId(null);
        setDragging({ type: 'video', ox: mx - v.x, oy: my - v.y });
        return;
      }
      setActiveVideoOverlay(false);
    }

    // Images
    for (let i = images.length - 1; i >= 0; i--) {
      const item = images[i];
      if (mx >= item.x && mx <= item.x + item.width && my >= item.y && my <= item.y + item.height) {
        setActiveImageId(item.id); activeStickerRef.current = null; setActiveStickerId(null); setActiveVideoOverlay(false);
        setDragging({ type: 'image', id: item.id, ox: mx - item.x, oy: my - item.y });
        return;
      }
    }

    setActiveImageId(null); setActiveExtraTextId(null); activeStickerRef.current = null; setActiveStickerId(null); setActiveVideoOverlay(false);
  }, [images, videoOverlay, toCanvasCoords]);

  const handleGlobalMouseMove = useCallback((e) => {
    if (!dragging) return;
    const { mx, my } = toCanvasCoords(e.clientX, e.clientY);
    if (dragging.type === 'sticker') {
      setStickers(prev => prev.map(s => s.id === dragging.id ? { ...s, x: mx - dragging.ox, y: my - dragging.oy } : s));
    } else if (dragging.type === 'image') {
      setImages(prev => prev.map(i => i.id === dragging.id ? { ...i, x: mx - dragging.ox, y: my - dragging.oy } : i));
    } else if (dragging.type === 'video') {
      setVideoOverlay(prev => prev ? { ...prev, x: mx - dragging.ox, y: my - dragging.oy } : prev);
    }
  }, [dragging, toCanvasCoords]);

  const handleGlobalMouseUp = useCallback(() => { setDragging(null); }, []);

  // ── Screen effect draw ────────────────────────────────────────────────────────
  // ── Draw ─────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo
    if (image) { ctx.drawImage(image, 0, 0, canvas.width, canvas.height); }
    else { ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, canvas.width, canvas.height); }

    // Imagens overlay
    images.forEach(item => {
      if (!item?.img || !item.img.complete || item.img.naturalWidth === 0) return;
      const rot = (item.rotation || 0) * Math.PI / 180;
      const _if = buildFilterString(item.filters);
      ctx.save();
      if (_if !== 'none') ctx.filter = _if;
      if (rot) { const cx = item.x + item.width / 2, cy = item.y + item.height / 2; ctx.translate(cx, cy); ctx.rotate(rot); ctx.translate(-cx, -cy); }
      drawRoundedImage(ctx, item.img, item.x, item.y, item.width, item.height, item.radius ?? 18);
      ctx.filter = 'none'; ctx.globalAlpha = 1;
      if (activeImageId === item.id) {
        ctx.strokeStyle = 'rgba(248,250,252,0.9)'; ctx.lineWidth = 2;
        drawRoundedRect(ctx, item.x, item.y, item.width, item.height, (item.radius ?? 18) + 2); ctx.stroke();
        drawResizeHandles(ctx, item.x, item.y, item.width, item.height);
      }
      ctx.restore();
    });

    // Vídeo overlay (draw do frame atual)
    if (videoOverlay?.el && videoOverlay.el.readyState >= 2) {
      const v = videoOverlay;
      ctx.save();
      ctx.globalAlpha = v.opacity ?? 1;
      const rr = Math.min(v.radius ?? 12, v.w / 2, v.h / 2);
      ctx.beginPath();
      ctx.moveTo(v.x + rr, v.y); ctx.arcTo(v.x + v.w, v.y, v.x + v.w, v.y + v.h, rr);
      ctx.arcTo(v.x + v.w, v.y + v.h, v.x, v.y + v.h, rr); ctx.arcTo(v.x, v.y + v.h, v.x, v.y, rr);
      ctx.arcTo(v.x, v.y, v.x + v.w, v.y, rr); ctx.closePath(); ctx.clip();
      ctx.drawImage(v.el, v.x, v.y, v.w, v.h);
      ctx.globalAlpha = 1;
      if (activeVideoOverlay) {
        ctx.restore(); ctx.save();
        ctx.strokeStyle = 'rgba(167,139,250,0.9)'; ctx.lineWidth = 2;
        drawRoundedRect(ctx, v.x, v.y, v.w, v.h, (v.radius ?? 12) + 2); ctx.stroke();
        drawResizeHandles(ctx, v.x, v.y, v.w, v.h);
      }
      ctx.restore();
    }

    // Stickers
    const _now = Date.now() / 1000;
    stickersRef.current.forEach(stk => {
      const sz = stk.size || 80;
      const { dy, s, r, a } = getStickerAnimTransform(stk.animStyle, _now, sz);
      ctx.save();
      ctx.globalAlpha = a; ctx.translate(stk.x, stk.y + dy);
      ctx.rotate((stk.rotation || 0) * Math.PI / 180 + r); ctx.scale(s, s);
      ctx.font = `${sz}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(stk.content, 0, 0);
      if (activeStickerRef.current === stk.id) {
        ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(167,139,250,0.85)'; ctx.lineWidth = 2 / s;
        ctx.setLineDash([5, 4]);
        const bx = -sz/2-8, by = -sz/2-8, bw = sz+16, bh = sz+16;
        ctx.strokeRect(bx, by, bw, bh); ctx.setLineDash([]);
        ctx.fillStyle = '#a78bfa';
        [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([hx,hy]) => ctx.fillRect(hx-4.5,hy-4.5,9,9));
      }
      ctx.restore();
    });

    // Letra da música
    lyrics.forEach(lyric => {
      const lx = lyric.x ?? canvas.width / 2;
      const ly = lyric.y ?? canvas.height * 0.72;
      const lFontSize = lyric.fontSize || lyricFontSize;
      const lFontFamily = lyric.fontFamily || lyricFontFamily;
      ctx.font = `bold ${lFontSize}px "${lFontFamily}"`;
      const lines = wrapLyricText(lyric.text, ctx, canvas.width - 40);
      const lineH = lFontSize * 1.3;
      const totalH = lines.length * lineH;
      ctx.save();
      ctx.translate(lx, ly); ctx.rotate((lyric.rotation || 0) * Math.PI / 180);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (lyric.shadowEnabled !== false) { ctx.shadowBlur = lyric.shadowBlur ?? 12; ctx.shadowColor = 'rgba(0,0,0,0.85)'; }
      ctx.fillStyle = lyric.color || lyricColor;
      lines.forEach((line, li) => {
        const lineY = -totalH / 2 + li * lineH + lineH / 2;
        ctx.fillText(line.toUpperCase(), 0, lineY);
      });
      ctx.shadowBlur = 0;
      if (activeLyricId === lyric.id) {
        ctx.font = `bold ${lFontSize}px "${lFontFamily}"`;
        const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l.toUpperCase()).width), 0);
        const hw = maxW / 2 + 14, hh = totalH / 2 + 10;
        ctx.strokeStyle = 'rgba(0,191,255,0.85)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
        ctx.strokeRect(-hw, -hh, hw * 2, hh * 2); ctx.setLineDash([]);
      }
      ctx.restore();
    });

    // Textos extras
    extraTexts.forEach(txt => {
      const tColor = txt.color || extraTextColor, tFont = txt.fontFamily || extraTextFontFamily, tSize = txt.fontSize || extraTextFontSize;
      const lines = txt.text.split('\n'), lineH = tSize * 1.25;
      const rot = (txt.rotation || 0) * Math.PI / 180;
      ctx.save(); ctx.translate(txt.x, txt.y); ctx.rotate(rot);
      ctx.font = `bold ${tSize}px ${tFont}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (txt.gradientEnabled && txt.gradientColor1 && txt.gradientColor2) {
        const tw = lines.reduce((m,l) => Math.max(m, ctx.measureText(l).width), 0);
        const th = lines.length * lineH;
        const grad = ctx.createLinearGradient(-tw/2,-th/2,tw/2,th/2);
        grad.addColorStop(0, txt.gradientColor1); grad.addColorStop(1, txt.gradientColor2);
        ctx.fillStyle = grad;
      } else { ctx.fillStyle = tColor; }
      const totalH = lines.length * lineH;
      lines.forEach((line, li) => {
        if (txt.shadowEnabled !== false) { ctx.shadowBlur = txt.shadowBlur ?? 10; ctx.shadowColor = txt.shadowColor || 'rgba(0,0,0,0.8)'; }
        ctx.fillText(line, 0, -totalH/2 + li*lineH + lineH/2);
      });
      ctx.shadowBlur = 0;
      if (activeExtraTextId === txt.id) {
        const mw = lines.reduce((m,l) => Math.max(m, ctx.measureText(l).width), 0);
        ctx.strokeStyle = 'rgba(0,191,255,0.85)'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]);
        ctx.strokeRect(-mw/2-10,-totalH/2-8,mw+20,totalH+16); ctx.setLineDash([]);
      }
      ctx.restore();
    });

    // Efeito de tela
    if (screenEffect && screenEffect !== 'none') {
      drawScreenEffectRef.current?.(ctx, screenEffect, canvas.width, canvas.height, Date.now()/1000);
    }

    // Marca d'água
    ctx.save(); ctx.globalAlpha = 0.55;
    const wFontSize = Math.max(14, Math.round(Math.min(canvas.width, canvas.height) * 0.038));
    const wText = '⚡ CanvasSync Free';
    ctx.font = `bold ${wFontSize}px DM Sans, Poppins, sans-serif`;
    const textW = ctx.measureText(wText).width, badgeW = textW + 20, badgeH = wFontSize + 10;
    const bx = canvas.width - badgeW - 10, by = canvas.height - badgeH - 10;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath(); ctx.roundRect(bx, by, badgeW, badgeH, 7); ctx.fill();
    ctx.fillStyle = '#00BFFF'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
    ctx.fillText(wText, bx + 10, by + badgeH / 2);
    ctx.restore();
  }, [image, images, extraTexts, lyrics, stickers, videoOverlay, screenEffect,
      activeImageId, activeExtraTextId, activeLyricId, activeVideoOverlay,
      extraTextColor, extraTextFontFamily, extraTextFontSize,
      lyricFontSize, lyricFontFamily, lyricColor,
      drawRoundedImage, drawRoundedRect, drawResizeHandles, wrapLyricText, buildFilterString]);

  const drawRef = useRef(draw);
  useEffect(() => { drawRef.current = draw; }, [draw]);
  useEffect(() => {
    let rafId;
    const loop = () => { try { if (drawRef.current) drawRef.current(); } catch(e){} rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Fullscreen mirror ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isFullscreen) return;
    let rafId;
    const mirror = () => {
      const src = canvasRef.current, dest = fullscreenCanvasRef.current;
      if (!src || !dest) { rafId = requestAnimationFrame(mirror); return; }
      dest.width = src.width; dest.height = src.height;
      dest.getContext('2d').drawImage(src, 0, 0);
      rafId = requestAnimationFrame(mirror);
    };
    rafId = requestAnimationFrame(mirror);
    return () => cancelAnimationFrame(rafId);
  }, [isFullscreen]);

  // ── saveWithPicker ────────────────────────────────────────────────────────────
  const saveWithPicker = async (blobOrDataUrl, suggestedName, mimeType, extensions) => {
    let blob;
    if (typeof blobOrDataUrl === 'string') {
      const res = await fetch(blobOrDataUrl); blob = await res.blob();
    } else { blob = blobOrDataUrl; }
    if (window.showSaveFilePicker) {
      try {
        const fh = await window.showSaveFilePicker({ suggestedName, types: [{ description: mimeType, accept: { [mimeType]: extensions } }] });
        const ws = await fh.createWritable(); await ws.write(blob); await ws.close(); return;
      } catch(e) { if (e.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = suggestedName; document.body.appendChild(a); a.click();
    document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current; if (!canvas) return;
    setActiveImageId(null); setActiveExtraTextId(null); setActiveLyricId(null);
    activeStickerRef.current = null; setActiveStickerId(null); setActiveVideoOverlay(false);
    setTimeout(async () => {
      const isPng = exportFormat === 'png';
      const dataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92);
      const mime = isPng ? 'image/png' : 'image/jpeg';
      await saveWithPicker(dataUrl, isPng ? 'canvassync-free.png' : 'canvassync-free.jpg', mime, isPng ? ['.png'] : ['.jpg','.jpeg']);
    }, 80);
  };

  const handleClearProject = () => {
    if (!window.confirm(lang === 'en' ? 'Clear all project data?' : 'Limpar todo o projeto?')) return;
    setImage(null); setImageSrc(null); setImages([]); setExtraTexts([]);
    setLyrics([]); setStickers([]); clearVideoOverlay();
    setNewExtraInput(''); setNewLyricText(''); setActiveImageId(null);
    setActiveExtraTextId(null); setActiveLyricId(null);
    activeStickerRef.current = null; setActiveStickerId(null); setActiveVideoOverlay(false);
    setScreenEffect('none'); setCanvasFormat('9:16');
    if (bgInputRef.current) bgInputRef.current.value = '';
    if (imgInputRef.current) imgInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    try { localStorage.removeItem('gc_freev2_project'); } catch {}
  };

  const exportProject = async () => {
    const payload = { version: 'freev2-1', canvasFormat, exportFormat, imageSrc,
      images: images.map(({ id, src, x, y, width, height, radius, rotation, filters }) => ({ id, src, x, y, width, height, radius, rotation, filters })),
      extraTexts, lyrics, stickers: stickers.map(({ id, type, content, animStyle, size, rotation, x, y }) => ({ id, type, content, animStyle, size, rotation, x, y })),
      screenEffect, extraTextColor, extraTextFontFamily, extraTextFontSize,
      lyricFontSize, lyricColor, lyricFontFamily,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    await saveWithPicker(blob, 'projeto-free.json', 'application/json', ['.json']);
  };

  const importProjectFromFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const p = JSON.parse(ev.target.result);
        if (p.canvasFormat) setCanvasFormat(p.canvasFormat);
        if (p.extraTextColor)      setExtraTextColor(p.extraTextColor);
        if (p.extraTextFontFamily) setExtraTextFontFamily(p.extraTextFontFamily);
        if (p.extraTextFontSize)   setExtraTextFontSize(p.extraTextFontSize);
        if (p.lyricFontSize)   setLyricFontSize(p.lyricFontSize);
        if (p.lyricColor)      setLyricColor(p.lyricColor);
        if (p.lyricFontFamily) setLyricFontFamily(p.lyricFontFamily);
        if (p.screenEffect)    setScreenEffect(p.screenEffect);
        if (p.imageSrc) { setImageSrc(p.imageSrc); const img = new Image(); img.onload = () => setImage(img); img.src = p.imageSrc; }
        if (Array.isArray(p.images)) {
          setImages(p.images.map(item => { const img = new Image(); img.src = item.src; return { ...item, img }; }));
        }
        if (Array.isArray(p.extraTexts)) setExtraTexts(p.extraTexts.slice(0, 1));
        if (Array.isArray(p.lyrics))    setLyrics(p.lyrics.slice(0, 3));
        if (Array.isArray(p.stickers))  setStickers(p.stickers);
      } catch { alert(lang === 'en' ? 'Error importing project.' : 'Erro ao importar projeto.'); }
    };
    reader.readAsText(file);
  };

  // ── Persistência ─────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gc_freev2_project'); if (!saved) return;
      const p = JSON.parse(saved);
      if (p.canvasFormat) setCanvasFormat(p.canvasFormat);
      if (p.extraTextColor) setExtraTextColor(p.extraTextColor);
      if (p.screenEffect)   setScreenEffect(p.screenEffect);
      if (p.lyricFontSize)  setLyricFontSize(p.lyricFontSize);
      if (p.lyricColor)     setLyricColor(p.lyricColor);
      if (p.imageSrc) { setImageSrc(p.imageSrc); const img = new Image(); img.onload = () => setImage(img); img.src = p.imageSrc; }
      if (Array.isArray(p.images)) setImages(p.images.map(item => { const img = new Image(); img.src = item.src; return { ...item, img }; }));
      if (Array.isArray(p.extraTexts)) setExtraTexts(p.extraTexts.slice(0, 1));
      if (Array.isArray(p.lyrics))    setLyrics(p.lyrics.slice(0, 3));
      if (Array.isArray(p.stickers))  setStickers(p.stickers);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem('gc_freev2_project', JSON.stringify({
          canvasFormat, screenEffect, imageSrc, extraTextColor, extraTextFontFamily, extraTextFontSize,
          lyricFontSize, lyricColor, lyricFontFamily,
          images: images.map(({ id, src, x, y, width, height, radius, rotation, filters }) => ({ id, src, x, y, width, height, radius, rotation, filters })),
          extraTexts, lyrics, stickers: stickers.map(({ id, type, content, animStyle, size, rotation, x, y }) => ({ id, type, content, animStyle, size, rotation, x, y })),
        }));
      } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [images, extraTexts, lyrics, stickers, canvasFormat, imageSrc, screenEffect, extraTextColor, extraTextFontFamily, extraTextFontSize, lyricFontSize, lyricColor, lyricFontFamily]);

  // ── Modal de upgrade ──────────────────────────────────────────────────────────
  const UpgradeModal = () => (
    <div style={{ position:'fixed', inset:0, zIndex:99999, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}
      onClick={() => setShowUpgradeModal(false)}>
      <div onClick={e => e.stopPropagation()} style={{ background:'linear-gradient(135deg,#0f172a,#0a0f1a)', border:'1px solid rgba(0,191,255,0.3)', borderRadius:24, padding:'36px 32px', maxWidth:420, width:'92vw', textAlign:'center', boxShadow:'0 32px 80px rgba(0,0,0,0.9)' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🚀</div>
        <h2 style={{ color:'#fff', fontSize:22, fontWeight:800, margin:'0 0 8px' }}>Desbloqueie o CanvasSync Pro</h2>
        <p style={{ color:'#64748b', fontSize:14, lineHeight:1.6, margin:'0 0 24px' }}>
          Exporte em <strong style={{color:'#00BFFF'}}>MP4 / WebM</strong>, adicione <strong style={{color:'#a78bfa'}}>frases ilimitadas</strong>, use todos os <strong style={{color:'#fbbf24'}}>efeitos</strong>, narração com IA, templates e muito mais.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={() => window.location.href = '/planos'}
            style={{ background:'linear-gradient(135deg,#00BFFF,#0070ff)', border:'none', borderRadius:14, padding:'14px 0', fontSize:15, fontWeight:800, color:'#000', cursor:'pointer', boxShadow:'0 8px 24px rgba(0,191,255,0.4)' }}>
            ✨ Ver Planos Pro
          </button>
          <button onClick={() => setShowUpgradeModal(false)}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:'10px 0', fontSize:13, color:'#555', cursor:'pointer' }}>
            Continuar no Free
          </button>
        </div>
      </div>
    </div>
  );

  // ── Lock badge helper ─────────────────────────────────────────────────────────
  const LockBadge = ({ text = '' }) => (
    <div onClick={() => setShowUpgradeModal(true)} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:10, padding:'8px 14px', cursor:'pointer', transition:'background 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.background='rgba(251,191,36,0.15)'}
      onMouseLeave={e => e.currentTarget.style.background='rgba(251,191,36,0.08)'}>
      <span style={{ fontSize:16 }}>🔒</span>
      <span style={{ fontSize:11, color:'#fbbf24', fontWeight:700 }}>{text || 'Recurso Pro'}</span>
      <span style={{ fontSize:10, color:'#00BFFF', fontWeight:700 }}>Assinar →</span>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', width:'100vw', background:'#080808', color:'#f0f0f0', fontFamily:"'DM Sans','Poppins',system-ui,sans-serif", overflow:'hidden', position:'fixed', top:0, left:0 }}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onTouchMove={e => { const tt = e.touches[0]; handleGlobalMouseMove({ clientX: tt.clientX, clientY: tt.clientY }); }}
      onTouchEnd={handleGlobalMouseUp}
    >
      <style>{`
        .cs-header { overflow-x: auto; scrollbar-width: none; }
        .cs-header::-webkit-scrollbar { display: none; }
        .cs-panel { scrollbar-width: thin; scrollbar-color: #00BFFF #0a0a0a; }
        .cs-panel::-webkit-scrollbar { width: 5px; }
        .cs-panel::-webkit-scrollbar-thumb { background: #00BFFF; border-radius: 10px; }
        @media (max-width: 768px) {
          .cs-left-panel { display: none !important; }
        }
      `}</style>

      {/* ══ HEADER — layout idêntico ao Pro ══════════════════════════════════════ */}
      <div className="cs-header" style={{ display:'flex', alignItems:'center', gap:4, padding:'0 10px', height:52, background:'linear-gradient(180deg,#0d1117 0%,#090d13 100%)', borderBottom:'1px solid rgba(255,255,255,0.07)', width:'100%', boxSizing:'border-box', flexShrink:0, zIndex:100 }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginRight:6, flexShrink:0 }}>
          <div style={{ width:24, height:24, borderRadius:7, background:'linear-gradient(135deg,#00BFFF,#7b2ff7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>▶</div>
          <span style={{ fontSize:12, fontWeight:800, color:'#f0f0f0', whiteSpace:'nowrap' }}>Canvas<span style={{color:'#00BFFF'}}>Sync</span></span>
          <span style={{ background:'rgba(0,191,255,0.1)', border:'1px solid rgba(0,191,255,0.25)', borderRadius:999, padding:'1px 7px', fontSize:9, color:'#00BFFF', fontWeight:700, letterSpacing:1 }}>FREE</span>
        </div>

        <div style={{ width:1, height:28, background:'rgba(255,255,255,0.07)', flexShrink:0, marginRight:2 }} />

        {/* ── Mídias dropdown ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={midiaBtnRef}
            onClick={() => { setShowMidiasPanel(v=>!v); setShowFxPanel(false); setShowProjetoPanel(false); setShowExportPanel(false); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showMidiasPanel?'rgba(0,191,255,0.18)':'transparent', border:`1px solid ${showMidiasPanel?'rgba(0,191,255,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showMidiasPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showMidiasPanel)e.currentTarget.style.background='transparent'}}
          >
            <span style={{fontSize:13}}>📂</span> Mídias <span style={{fontSize:9,opacity:0.6}}>▾</span>
          </button>
          {showMidiasPanel && createPortal(
            <>
              <div onClick={()=>setShowMidiasPanel(false)} style={{position:'fixed',inset:0,zIndex:99997}} />
              <div style={{ position:'fixed', top:(midiaBtnRef.current?.getBoundingClientRect().bottom??52)+4, left:Math.max(8,midiaBtnRef.current?.getBoundingClientRect().left??0), zIndex:99998, background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, width:240, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', padding:'6px 0' }}>
                <div style={{padding:'8px 14px 4px',fontSize:10,color:'#555',fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase'}}>Importar Mídia</div>
                {[
                  { icon:'🖼️', label:'Fundo / Background', color:'#00BFFF', action:()=>{ bgInputRef.current?.click(); setShowMidiasPanel(false); } },
                  { icon:'🏞️', label:'Imagens overlay', color:'#00BFFF', action:()=>{ imgInputRef.current?.click(); setShowMidiasPanel(false); } },
                  { icon:'🎬', label:`Vídeo overlay ${videoOverlay ? '(1/1)' : '(0/1)'}`, color:'#a78bfa', action:()=>{ videoInputRef.current?.click(); setShowMidiasPanel(false); } },
                ].map(item=>(
                  <div key={item.label} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', cursor:'pointer', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span style={{fontSize:16}}>{item.icon}</span>
                    <span style={{fontSize:12,color:item.color,fontWeight:500}}>{item.label}</span>
                  </div>
                ))}
                <div style={{height:1,background:'rgba(255,255,255,0.06)',margin:'4px 0'}} />
                {/* Itens bloqueados */}
                {[
                  { icon:'🎵', label:'Música / Áudio' },
                  { icon:'🎙️', label:'Narração (TTS)' },
                  { icon:'🎼', label:'Trilhas' },
                ].map(item=>(
                  <div key={item.label} onClick={()=>{ setShowMidiasPanel(false); setShowUpgradeModal(true); }} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', cursor:'pointer', opacity:0.5 }}
                    onMouseEnter={e=>e.currentTarget.style.opacity='0.8'}
                    onMouseLeave={e=>e.currentTarget.style.opacity='0.5'}>
                    <span style={{fontSize:16}}>{item.icon}</span>
                    <span style={{fontSize:12,color:'#888',fontWeight:500}}>{item.label}</span>
                    <span style={{marginLeft:'auto',fontSize:11}}>🔒</span>
                  </div>
                ))}
              </div>
            </>,
            document.body
          )}
        </div>

        {/* ── Templates 🔒 ── */}
        <button onClick={() => setShowUpgradeModal(true)}
          style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:'transparent', border:'1px solid transparent', cursor:'pointer', color:'#444', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          title="Recurso Pro">
          <span style={{fontSize:13}}>⚡</span> Templates <span style={{fontSize:12}}>🔒</span>
        </button>

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
            <div onClick={e=>e.stopPropagation()} style={{ position:'fixed', top:stickerPanelPos.top, left:stickerPanelPos.left, zIndex:99999, background:'#111827', border:'1px solid rgba(251,191,36,0.25)', borderRadius:18, width:360, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', maxHeight:'75vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>
              <div style={{ padding:'12px 16px 8px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:800, fontSize:14, color:'#fbbf24' }}>✨ Stickers</span>
                <button onClick={()=>setShowStickerPanel(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:16 }}>✕</button>
              </div>
              <div style={{ display:'flex', gap:6, padding:'8px 12px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                {[['emoji','😀 Emojis'],['sticker','✨ Animados']].map(([tab,label])=>(
                  <button key={tab} onClick={()=>setStickerTab(tab)} style={{ padding:'4px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, background:stickerTab===tab?'#fbbf24':'rgba(255,255,255,0.06)', color:stickerTab===tab?'#000':'#888' }}>{label}</button>
                ))}
              </div>
              <div style={{ overflowY:'auto', flex:1, padding:8 }}>
                {stickerTab==='emoji'&&(
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:4 }}>
                    {EMOJI_LIST.flat().map((em, idx) => (
                      <button key={`${em}_${idx}`} onClick={()=>{ addSticker('emoji',em,null); setShowStickerPanel(false); }}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9, padding:'5px 2px', fontSize:22, cursor:'pointer', width:'100%', aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center' }}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(251,191,36,0.15)'}
                        onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      >{em}</button>
                    ))}
                  </div>
                )}
                {stickerTab==='sticker'&&(
                  <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                    {ANIMATED_STICKERS.map(stk=>(
                      <button key={stk.key} onClick={()=>{ addSticker('sticker',stk.emoji,stk.anim); setShowStickerPanel(false); }}
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:11, padding:'7px 5px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, width:64 }}
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
                  <button onClick={()=>{ setStickers([]); setActiveStickerId(null); }} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'3px 10px', fontSize:10, color:'#f87171', fontWeight:700, cursor:'pointer' }}>Remover todos</button>
                </div>
              )}
            </div>,
            document.body
          )}
        </div>

        {/* ── Efeitos ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={fxBtnRef}
            onClick={()=>{ setShowFxPanel(v=>!v); setShowMidiasPanel(false); setShowProjetoPanel(false); setShowExportPanel(false); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showFxPanel||screenEffect!=='none'?'rgba(167,139,250,0.18)':'transparent', border:`1px solid ${showFxPanel||screenEffect!=='none'?'rgba(167,139,250,0.5)':'transparent'}`, cursor:'pointer', color:'#ccc', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showFxPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showFxPanel)e.currentTarget.style.background=showFxPanel||screenEffect!=='none'?'rgba(167,139,250,0.18)':'transparent'}}
          >
            <span style={{fontSize:13}}>🎬</span> Efeitos {screenEffect!=='none'&&<span style={{background:'#a78bfa',borderRadius:4,width:6,height:6,display:'inline-block',marginLeft:2}} />}
          </button>
          {showFxPanel && createPortal(
            <>
              <div onClick={()=>setShowFxPanel(false)} style={{position:'fixed',inset:0,zIndex:99997}} />
              <div style={{ position:'fixed', top:(fxBtnRef.current?.getBoundingClientRect().bottom??52)+4, left:Math.max(8,fxBtnRef.current?.getBoundingClientRect().left??80), zIndex:99998, background:'#0f172a', border:'1px solid rgba(167,139,250,0.3)', borderRadius:16, width:320, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', padding:14 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontWeight:800, fontSize:13, color:'#a78bfa' }}>🎬 Efeitos de Tela</span>
                  {screenEffect!=='none'&&<button onClick={()=>setScreenEffect('none')} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, padding:'3px 10px', color:'#f87171', fontSize:10, cursor:'pointer', fontWeight:700 }}>Remover</button>}
                </div>
                {/* Liberados */}
                <div style={{ fontSize:10, color:'#555', fontWeight:700, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:6 }}>Disponíveis no Free</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
                  {FREE_SCREEN_EFFECTS.map(fx=>(
                    <div key={fx.id} onClick={()=>{ setScreenEffect(fx.id===screenEffect?'none':fx.id); setShowFxPanel(false); }}
                      style={{ background:screenEffect===fx.id?'rgba(167,139,250,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${screenEffect===fx.id?'rgba(167,139,250,0.6)':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'10px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.15s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(167,139,250,0.12)'}
                      onMouseLeave={e=>e.currentTarget.style.background=screenEffect===fx.id?'rgba(167,139,250,0.2)':'rgba(255,255,255,0.04)'}
                    >
                      <span style={{fontSize:20}}>{fx.icon}</span>
                      <span style={{fontSize:11,color:'#ccc',fontWeight:600}}>{fx.label}</span>
                    </div>
                  ))}
                </div>
                {/* Bloqueados */}
                <div style={{ fontSize:10, color:'#555', fontWeight:700, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:6 }}>Somente Pro 🔒</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
                  {LOCKED_SCREEN_EFFECTS.map(fx=>(
                    <div key={fx.id} onClick={()=>{ setShowFxPanel(false); setShowUpgradeModal(true); }}
                      style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'8px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:7, opacity:0.55, transition:'opacity 0.15s' }}
                      onMouseEnter={e=>e.currentTarget.style.opacity='0.85'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='0.55'}
                    >
                      <span style={{fontSize:18}}>{fx.icon}</span>
                      <span style={{fontSize:10,color:'#888'}}>{fx.label}</span>
                      <span style={{marginLeft:'auto',fontSize:11}}>🔒</span>
                    </div>
                  ))}
                </div>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* ── SFX 🔒 ── */}
        <button onClick={() => setShowUpgradeModal(true)}
          style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:'transparent', border:'1px solid transparent', cursor:'pointer', color:'#444', fontSize:11, fontWeight:600, whiteSpace:'nowrap' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          title="Recurso Pro">
          <span style={{fontSize:13}}>🎵</span> SFX <span style={{fontSize:12}}>🔒</span>
        </button>

        {/* Divisor */}
        <div style={{ width:1, height:28, background:'rgba(255,255,255,0.07)', flexShrink:0, margin:'0 4px' }} />

        {/* ── Limpar ── */}
        <button onClick={handleClearProject}
          style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:'transparent', border:'1px solid transparent', cursor:'pointer', color:'#f87171', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
        >
          <span style={{fontSize:13}}>🗑️</span> Limpar
        </button>

        {/* ── Projeto ── */}
        <div style={{ position:'relative', flexShrink:0 }}>
          <button ref={projetoBtnRef}
            onClick={()=>{ setShowProjetoPanel(v=>!v); setShowMidiasPanel(false); setShowFxPanel(false); setShowExportPanel(false); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 8px', borderRadius:7, background:showProjetoPanel?'rgba(255,255,255,0.12)':'transparent', border:`1px solid ${showProjetoPanel?'rgba(255,255,255,0.2)':'transparent'}`, cursor:'pointer', color:'#888', fontSize:11, fontWeight:600, whiteSpace:'nowrap', transition:'all 0.15s' }}
            onMouseEnter={e=>{if(!showProjetoPanel)e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
            onMouseLeave={e=>{if(!showProjetoPanel)e.currentTarget.style.background='transparent'}}
          >
            <span style={{fontSize:13}}>📁</span> Projeto <span style={{fontSize:9,opacity:0.6}}>▾</span>
          </button>
          {showProjetoPanel && createPortal(
            <>
              <div onClick={()=>setShowProjetoPanel(false)} style={{position:'fixed',inset:0,zIndex:99997}} />
              <div style={{ position:'fixed', top:(projetoBtnRef.current?.getBoundingClientRect().bottom??52)+4, left:Math.max(8,projetoBtnRef.current?.getBoundingClientRect().left??0), zIndex:99998, background:'#0f172a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, width:200, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', padding:'6px 0' }}>
                <div style={{padding:'8px 14px 4px',fontSize:10,color:'#555',fontWeight:700,letterSpacing:'0.8px',textTransform:'uppercase'}}>Projeto</div>
                {[
                  { icon:'⬆️', label:'Exportar Projeto', action:()=>{ exportProject(); setShowProjetoPanel(false); } },
                  { icon:'⬇️', label:'Importar Projeto', action:()=>{ importInputRef.current?.click(); setShowProjetoPanel(false); } },
                ].map(item=>(
                  <div key={item.label} onClick={item.action} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', cursor:'pointer', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span style={{fontSize:15}}>{item.icon}</span>
                    <span style={{fontSize:12,color:'#ccc'}}>{item.label}</span>
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
            onClick={()=>{ setShowExportPanel(v=>!v); setShowMidiasPanel(false); setShowFxPanel(false); setShowProjetoPanel(false); }}
            style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:7, background:showExportPanel?'rgba(0,191,255,0.22)':'rgba(0,191,255,0.1)', border:`1px solid ${showExportPanel?'rgba(0,191,255,0.6)':'rgba(0,191,255,0.25)'}`, cursor:'pointer', color:'#00BFFF', fontSize:11, fontWeight:700, whiteSpace:'nowrap', transition:'all 0.15s' }}
          >
            <span style={{fontSize:13}}>💾</span> Salvar
          </button>
          {showExportPanel && createPortal(
            <>
              <div onClick={()=>setShowExportPanel(false)} style={{position:'fixed',inset:0,zIndex:99997}} />
              <div style={{ position:'fixed', top:(exportBtnRef.current?.getBoundingClientRect().bottom??52)+4, right:Math.max(8,window.innerWidth-(exportBtnRef.current?.getBoundingClientRect().right??200)), zIndex:99998, background:'#0f172a', border:'1px solid rgba(0,191,255,0.25)', borderRadius:16, width:260, boxShadow:'0 16px 48px rgba(0,0,0,0.8)', padding:14 }}>
                <div style={{ fontWeight:800, fontSize:13, color:'#00BFFF', marginBottom:10 }}>💾 Exportar</div>
                {/* PNG / JPG */}
                <div style={{ fontSize:10, color:'#555', fontWeight:700, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:6 }}>Imagem</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
                  {[{fmt:'png',label:'PNG — Alta qualidade'},{fmt:'jpg',label:'JPG — Comprimido'}].map(({fmt,label})=>(
                    <div key={fmt} onClick={()=>{ setExportFormat(fmt); }}
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:exportFormat===fmt?'rgba(0,191,255,0.12)':'rgba(255,255,255,0.04)', border:`1px solid ${exportFormat===fmt?'rgba(0,191,255,0.4)':'rgba(255,255,255,0.06)'}`, borderRadius:10, cursor:'pointer', transition:'all 0.15s' }}>
                      <span style={{fontSize:16}}>🖼️</span>
                      <span style={{fontSize:12,color:exportFormat===fmt?'#00BFFF':'#ccc',fontWeight:exportFormat===fmt?700:400}}>{label}</span>
                      {exportFormat===fmt&&<span style={{marginLeft:'auto',color:'#00BFFF',fontWeight:800,fontSize:14}}>✓</span>}
                    </div>
                  ))}
                  <button onClick={()=>{ handleSave(); setShowExportPanel(false); }}
                    style={{ background:'linear-gradient(135deg,#00BFFF,#0070ff)', border:'none', borderRadius:10, padding:'11px 0', fontSize:13, fontWeight:800, color:'#000', cursor:'pointer', marginTop:2 }}>
                    ⬇ Baixar como {exportFormat.toUpperCase()}
                  </button>
                </div>
                {/* Vídeo — bloqueado */}
                <div style={{ fontSize:10, color:'#555', fontWeight:700, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:8 }}>Vídeo — Somente Pro 🔒</div>
                {[{label:'MP4 SD',icon:'🎬'},{label:'MP4 HD',icon:'🎥'},{label:'WebM',icon:'🎞️'}].map(({label,icon})=>(
                  <div key={label} onClick={()=>{ setShowExportPanel(false); setShowUpgradeModal(true); }}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10, cursor:'pointer', opacity:0.5, marginBottom:5, transition:'opacity 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.opacity='0.8'}
                    onMouseLeave={e=>e.currentTarget.style.opacity='0.5'}>
                    <span style={{fontSize:16}}>{icon}</span>
                    <span style={{fontSize:12,color:'#888'}}>{label}</span>
                    <span style={{marginLeft:'auto',fontSize:12}}>🔒</span>
                  </div>
                ))}
              </div>
            </>,
            document.body
          )}
        </div>

        {/* PWA */}
        {pwaPrompt && !pwaInstalled && (
          <button onClick={async()=>{ await pwaPrompt.prompt(); const {outcome}=await pwaPrompt.userChoice; if(outcome==='accepted'){setPwaInstalled(true);setPwaPrompt(null);} }}
            style={{ marginLeft:4, display:'flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:7, background:'rgba(0,191,255,0.12)', border:'1px solid rgba(0,191,255,0.35)', cursor:'pointer', color:'#00BFFF', fontSize:10, fontWeight:700, flexShrink:0, whiteSpace:'nowrap' }}>
            ⬇ App
          </button>
        )}

        {/* Lang */}
        <div style={{ marginLeft:'auto', flexShrink:0 }}><LangToggle /></div>

        {/* Banner upgrade */}
        <div style={{ flexShrink:0, display:'flex', alignItems:'center', gap:8, background:'rgba(0,191,255,0.05)', border:'1px solid rgba(0,191,255,0.15)', borderRadius:10, padding:'4px 10px', marginLeft:6 }}>
          <span style={{ fontSize:10, color:'#555', whiteSpace:'nowrap' }}>Mais recursos?</span>
          <button onClick={()=>window.location.href='/planos'}
            style={{ background:'linear-gradient(135deg,#00BFFF,#0070ff)', border:'none', borderRadius:999, padding:'4px 12px', fontSize:10, fontWeight:800, color:'#000', cursor:'pointer', whiteSpace:'nowrap' }}>
            🚀 Assinar Pro
          </button>
        </div>
      </div>

      {/* ══ BODY ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ display:'flex', flex:1, width:'100%', overflow:'hidden' }}>

        {/* ── PAINEL ESQUERDO ──────────────────────────────────────────────────── */}
        <div className="cs-left-panel cs-panel" style={{ width:420, minWidth:420, borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', background:'#0d0d0d', overflowY:'auto', flexShrink:0 }}>

          {/* ── LETRA DA MÚSICA (max 3) ─────────────────────────────────────────── */}
          <div style={{ padding:'14px 16px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:11, color:'#00BFFF', fontWeight:800, letterSpacing:'0.6px' }}>🎵 LETRA DA MÚSICA</span>
                <span style={{ background:`rgba(0,191,255,${lyrics.length>=3?'0.2':'0.08'})`, border:`1px solid rgba(0,191,255,${lyrics.length>=3?'0.5':'0.2'})`, borderRadius:999, padding:'2px 8px', fontSize:10, color:'#00BFFF' }}>{lyrics.length}/3</span>
              </div>
              <button onClick={()=>setShowLyricList(v=>!v)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:12 }}>{showLyricList?'▲':'▼'}</button>
            </div>

            {/* Controles de estilo */}
            <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
              <input type="color" value={lyricColor} onChange={e=>{ setLyricColor(e.target.value); if(activeLyricId) setLyrics(p=>p.map(l=>l.id===activeLyricId?{...l,color:e.target.value}:l)); }}
                style={{ width:28, height:28, padding:0, border:'1px solid rgba(0,191,255,0.2)', background:'#111', borderRadius:8, cursor:'pointer' }} title="Cor" />
              <select value={activeLyricId?(lyrics.find(l=>l.id===activeLyricId)?.fontFamily||lyricFontFamily):lyricFontFamily}
                onChange={e=>{ setLyricFontFamily(e.target.value); if(activeLyricId) setLyrics(p=>p.map(l=>l.id===activeLyricId?{...l,fontFamily:e.target.value}:l)); }}
                style={{ fontSize:11, backgroundColor:'#111', color:'#f0f0f0', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'5px 8px', flex:1 }}>
                <option value="Bebas Neue">Bebas Neue</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Oswald">Oswald</option>
                <option value="Raleway">Raleway</option>
                <option value="Roboto Condensed">Roboto Condensed</option>
                <option value="Playfair Display">Playfair Display</option>
                {customFonts.map(f=><option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
              <span style={{ fontSize:10, color:'#94a3b8' }}>{activeLyricId?(lyrics.find(l=>l.id===activeLyricId)?.fontSize||lyricFontSize):lyricFontSize}px</span>
              <input type="range" min="16" max="120" value={activeLyricId?(lyrics.find(l=>l.id===activeLyricId)?.fontSize||lyricFontSize):lyricFontSize}
                onChange={e=>{ const v=+e.target.value; setLyricFontSize(v); if(activeLyricId) setLyrics(p=>p.map(l=>l.id===activeLyricId?{...l,fontSize:v}:l)); }}
                style={{ width:70, accentColor:'#00BFFF' }} />
            </div>

            {/* Sombra */}
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(0,191,255,0.03)', border:'1px solid rgba(0,191,255,0.08)', borderRadius:10, padding:'7px 10px' }}>
              <span style={{ fontSize:10, color:'#64748b', fontWeight:700 }}>Sombra</span>
              <input type="checkbox" checked={lyricShadowEnabled} onChange={e=>setLyricShadowEnabled(e.target.checked)} style={{ accentColor:'#00BFFF' }} />
              {lyricShadowEnabled && <>
                <input type="range" min="0" max="30" value={lyricShadowBlur} onChange={e=>setLyricShadowBlur(+e.target.value)} style={{ width:60, accentColor:'#00BFFF' }} />
                <span style={{ fontSize:10, color:'#64748b' }}>{lyricShadowBlur}px</span>
              </>}
              <button onClick={()=>fontInputRef.current?.click()} style={{ marginLeft:'auto', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:8, padding:'3px 9px', fontSize:10, color:'#f59e0b', cursor:'pointer' }}>+ Fonte TTF</button>
            </div>

            {/* Textarea + botão */}
            <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
              <textarea placeholder="Digite uma frase da letra..." value={newLyricText} onChange={e=>setNewLyricText(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); addLyric(); } }}
                rows={2}
                style={{ flex:1, padding:'10px 12px', backgroundColor:'#111', border:'1px solid rgba(255,255,255,0.08)', color:'#f0f0f0', borderRadius:14, fontSize:12, resize:'none', lineHeight:1.5, fontFamily:'inherit' }} />
              <button onClick={addLyric} disabled={lyrics.length>=3||!newLyricText.trim()}
                style={{ padding:'0 16px', height:52, background:lyrics.length>=3||!newLyricText.trim()?'rgba(255,255,255,0.04)':'#00BFFF', border:lyrics.length>=3?'1px solid rgba(255,255,255,0.08)':'none', borderRadius:14, cursor:lyrics.length>=3?'not-allowed':'pointer', fontWeight:'bold', color:lyrics.length>=3?'#333':'#000', fontSize:22 }}>+</button>
            </div>

            {/* Aviso de limite */}
            {lyrics.length >= 3 && (
              <div style={{ background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:10, padding:'8px 12px', fontSize:11, color:'#fbbf24', display:'flex', alignItems:'center', gap:8 }}>
                ⚠️ Limite de 3 frases no Free.
                <button onClick={()=>setShowUpgradeModal(true)} style={{ background:'none', border:'none', color:'#00BFFF', cursor:'pointer', fontWeight:700, fontSize:11, padding:0 }}>Frases ilimitadas no Pro →</button>
              </div>
            )}

            {/* Lista de frases */}
            {showLyricList && lyrics.length > 0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {lyrics.map(lyric => (
                  <div key={lyric.id} onClick={()=>setActiveLyricId(lyric.id===activeLyricId?null:lyric.id)}
                    style={{ display:'flex', alignItems:'center', gap:8, background:activeLyricId===lyric.id?'rgba(0,191,255,0.1)':'rgba(0,191,255,0.03)', border:`1px solid ${activeLyricId===lyric.id?'rgba(0,191,255,0.4)':'rgba(0,191,255,0.12)'}`, borderRadius:10, padding:'8px 12px', cursor:'pointer' }}>
                    <span style={{ flex:1, fontSize:12, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lyric.text}</span>
                    <button onClick={e=>{ e.stopPropagation(); setLyrics(p=>p.filter(l=>l.id!==lyric.id)); if(activeLyricId===lyric.id) setActiveLyricId(null); }}
                      style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:8, padding:'3px 8px', fontSize:11, cursor:'pointer', flexShrink:0 }}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Gerar com IA — bloqueado */}
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setShowUpgradeModal(true)}
                style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'9px 0', background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:12, cursor:'pointer', fontSize:11, color:'#555', fontWeight:700, transition:'all 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(139,92,246,0.12)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(139,92,246,0.06)'}>
                <span style={{fontSize:14}}>🤖</span> Gerar Letra com IA <span style={{fontSize:13}}>🔒</span>
              </button>
            </div>

            <span style={{ fontSize:10, color:'rgba(255,255,255,0.22)' }}>Arraste as frases no canvas para posicionar</span>
          </div>

          {/* ── TEXTO EXTRA (max 1) ─────────────────────────────────────────────── */}
          <div style={{ padding:'14px 16px 12px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <label style={{ fontSize:11, color:'#00BFFF', fontWeight:700, letterSpacing:'0.6px' }}>TEXTO EXTRA</label>
                <span style={{ background:`rgba(0,191,255,${extraTexts.length>=1?'0.2':'0.08'})`, border:`1px solid rgba(0,191,255,${extraTexts.length>=1?'0.5':'0.2'})`, borderRadius:999, padding:'2px 8px', fontSize:10, color:'#00BFFF' }}>{extraTexts.length}/1</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <input type="color"
                  value={activeExtraTextId?(extraTexts.find(t=>t.id===activeExtraTextId)?.color||extraTextColor):extraTextColor}
                  onChange={e=>{ setExtraTextColor(e.target.value); if(activeExtraTextId) setExtraTexts(p=>p.map(t=>t.id===activeExtraTextId?{...t,color:e.target.value}:t)); }}
                  style={{ width:26, height:26, padding:0, border:'1px solid rgba(0,191,255,0.2)', background:'#111', borderRadius:7, cursor:'pointer' }} />
                <select value={activeExtraTextId?(extraTexts.find(t=>t.id===activeExtraTextId)?.fontFamily||extraTextFontFamily):extraTextFontFamily}
                  onChange={e=>{ setExtraTextFontFamily(e.target.value); if(activeExtraTextId) setExtraTexts(p=>p.map(t=>t.id===activeExtraTextId?{...t,fontFamily:e.target.value}:t)); }}
                  style={{ fontSize:11, backgroundColor:'#111', color:'#f0f0f0', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'5px 8px' }}>
                  <option value="Poppins">Poppins</option><option value="Bebas Neue">Bebas Neue</option>
                  <option value="Montserrat">Montserrat</option><option value="Oswald">Oswald</option>
                  <option value="Raleway">Raleway</option><option value="Playfair Display">Playfair</option>
                  <option value="Lora">Lora</option>
                  {customFonts.map(f=><option key={f.name} value={f.name}>{f.name}</option>)}
                </select>
                <span style={{ fontSize:10, color:'#94a3b8' }}>{activeExtraTextId?(extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize||extraTextFontSize):extraTextFontSize}px</span>
                <input type="range" min="10" max="120"
                  value={activeExtraTextId?(extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize||extraTextFontSize):extraTextFontSize}
                  onChange={e=>{ const v=+e.target.value; setExtraTextFontSize(v); if(activeExtraTextId) setExtraTexts(p=>p.map(t=>t.id===activeExtraTextId?{...t,fontSize:v}:t)); }}
                  style={{ width:70, accentColor:'#00BFFF' }} />
              </div>
            </div>

            {/* Sombra + Gradiente */}
            {(()=>{
              const sel = extraTexts.find(t=>t.id===(activeExtraTextId||(extraTexts.length?extraTexts[extraTexts.length-1]?.id:null)));
              const shOn = sel?(sel.shadowEnabled??extraTextShadowEnabled):extraTextShadowEnabled;
              const shBl = sel?(sel.shadowBlur??extraTextShadowBlur):extraTextShadowBlur;
              const grOn = sel?(sel.gradientEnabled??extraTextGradientEnabled):extraTextGradientEnabled;
              const gr1  = sel?(sel.gradientColor1||extraTextGradientColor1):extraTextGradientColor1;
              const gr2  = sel?(sel.gradientColor2||extraTextGradientColor2):extraTextGradientColor2;
              const setP = (prop, val, setter) => { setter(val); if(sel) setExtraTexts(p=>p.map(t=>t.id===sel.id?{...t,[prop]:val}:t)); };
              return (
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'nowrap', background:'rgba(0,191,255,0.03)', border:'1px solid rgba(0,191,255,0.08)', borderRadius:10, padding:'7px 10px', overflowX:'auto' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                    <span style={{ fontSize:10, color:'#64748b', fontWeight:700 }}>Sombra</span>
                    <input type="checkbox" checked={shOn} onChange={e=>setP('shadowEnabled',e.target.checked,setExtraTextShadowEnabled)} style={{ accentColor:'#00BFFF' }} />
                    {shOn&&<><input type="range" min="0" max="30" value={shBl} onChange={e=>setP('shadowBlur',+e.target.value,setExtraTextShadowBlur)} style={{ width:60, accentColor:'#00BFFF' }} /><span style={{fontSize:10,color:'#64748b',minWidth:22}}>{shBl}px</span></>}
                  </div>
                  <div style={{ width:1, height:18, background:'rgba(255,255,255,0.08)', flexShrink:0 }} />
                  <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                    <span style={{ fontSize:10, color:'#64748b', fontWeight:700 }}>Gradiente</span>
                    <input type="checkbox" checked={grOn} onChange={e=>setP('gradientEnabled',e.target.checked,setExtraTextGradientEnabled)} style={{ accentColor:'#00BFFF' }} />
                    {grOn&&<>
                      <input type="color" value={gr1} onChange={e=>setP('gradientColor1',e.target.value,setExtraTextGradientColor1)} style={{ width:22, height:22, padding:0, border:'none', background:'none', cursor:'pointer' }} />
                      <input type="color" value={gr2} onChange={e=>setP('gradientColor2',e.target.value,setExtraTextGradientColor2)} style={{ width:22, height:22, padding:0, border:'none', background:'none', cursor:'pointer' }} />
                    </>}
                  </div>
                </div>
              );
            })()}

            <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
              <textarea placeholder="Texto extra (ex: @usuario, #hashtag...)" value={newExtraInput} onChange={e=>setNewExtraInput(e.target.value)} rows={3}
                style={{ flex:1, padding:'10px 12px', backgroundColor:'#111', border:'1px solid rgba(255,255,255,0.08)', color:'#f0f0f0', borderRadius:14, fontSize:12, resize:'none', lineHeight:1.5, fontFamily:'inherit' }} />
              <button onClick={addExtraText} disabled={extraTexts.length>=1||!newExtraInput.trim()}
                style={{ padding:'0 16px', height:56, background:extraTexts.length>=1?'rgba(255,255,255,0.04)':'#00BFFF', border:extraTexts.length>=1?'1px solid rgba(255,255,255,0.08)':'none', borderRadius:14, cursor:extraTexts.length>=1?'not-allowed':'pointer', fontWeight:'bold', color:extraTexts.length>=1?'#333':'#000', boxShadow:extraTexts.length>=1?'none':'0 4px 16px rgba(0,191,255,0.25)', fontSize:22 }}>+</button>
            </div>

            {extraTexts.length>=1&&(
              <div style={{ background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:10, padding:'8px 12px', fontSize:11, color:'#fbbf24', display:'flex', alignItems:'center', gap:8 }}>
                ⚠️ Limite de 1 texto no Free.
                <button onClick={()=>setShowUpgradeModal(true)} style={{ background:'none', border:'none', color:'#00BFFF', cursor:'pointer', fontWeight:700, fontSize:11, padding:0 }}>Textos ilimitados no Pro →</button>
              </div>
            )}

            {extraTexts.length>0&&(
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {extraTexts.map(txt=>(
                  <div key={txt.id} onClick={()=>setActiveExtraTextId(txt.id)}
                    style={{ display:'flex', alignItems:'center', gap:8, background:activeExtraTextId===txt.id?'rgba(0,191,255,0.08)':'rgba(0,191,255,0.03)', border:`1px solid ${activeExtraTextId===txt.id?'rgba(0,191,255,0.35)':'rgba(0,191,255,0.12)'}`, borderRadius:10, padding:'8px 12px', cursor:'pointer' }}>
                    <span style={{ flex:1, fontSize:12, color:'#ccc', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{txt.text}</span>
                    <button onClick={e=>{ e.stopPropagation(); setExtraTexts(p=>p.filter(t=>t.id!==txt.id)); if(activeExtraTextId===txt.id) setActiveExtraTextId(null); }}
                      style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:8, padding:'3px 8px', fontSize:11, cursor:'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── IMAGENS NA COMPOSIÇÃO ─────────────────────────────────────────────── */}
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', gap:10 }}>
            <label style={{ fontSize:11, color:'#00BFFF', fontWeight:700, letterSpacing:'0.6px' }}>
              IMAGENS OVERLAY <span style={{ color:'#555', fontWeight:400 }}>({images.length})</span>
            </label>

            {activeImageId&&(()=>{
              const sel = images.find(i=>i.id===activeImageId); if(!sel) return null;
              const rot = sel.rotation??0;
              const flt = sel.filters||{};
              const setF = (prop,val) => setImages(p=>p.map(i=>i.id===sel.id?{...i,filters:{...(i.filters||{}),[prop]:val}}:i));
              const PRESETS = [
                {label:'Original',f:{}},{label:'P&B',f:{grayscale:100}},{label:'Sépia',f:{sepia:80}},
                {label:'Cinema',f:{contrast:115,saturate:80,brightness:95}},{label:'Neon',f:{saturate:200,brightness:110,contrast:120}},
                {label:'Vintage',f:{sepia:40,contrast:90,brightness:105,saturate:80}},{label:'Frio',f:{hueRotate:190,saturate:120}},
                {label:'Quente',f:{hueRotate:340,saturate:130,brightness:105}},
              ];
              return (
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, color:'#fbbf24', fontWeight:700 }}>Imagem selecionada</span>
                    <button onClick={()=>setActiveImageId(null)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:14 }}>✕</button>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:10, color:'#888', minWidth:52 }}>Rotação</span>
                    <input type="range" min="-180" max="180" value={rot}
                      onChange={e=>setImages(p=>p.map(i=>i.id===sel.id?{...i,rotation:+e.target.value}:i))}
                      onMouseDown={e=>e.stopPropagation()} style={{ flex:1, accentColor:'#fbbf24' }} />
                    <span style={{ fontSize:11, color:'#ccc', minWidth:38 }}>{rot}°</span>
                    <button onClick={()=>setImages(p=>p.map(i=>i.id===sel.id?{...i,rotation:0}:i))} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'3px 8px', fontSize:11, color:'#888', cursor:'pointer' }}>0°</button>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {PRESETS.map(({label,f})=>{
                      const isActive = JSON.stringify(flt)===JSON.stringify(f);
                      return <button key={label} onClick={()=>setImages(p=>p.map(i=>i.id===sel.id?{...i,filters:f}:i))}
                        style={{ padding:'3px 9px', fontSize:10, borderRadius:8, cursor:'pointer', fontWeight:600, background:isActive?'rgba(251,191,36,0.25)':'rgba(255,255,255,0.04)', border:`1px solid ${isActive?'rgba(251,191,36,0.6)':'rgba(255,255,255,0.08)'}`, color:isActive?'#fbbf24':'#666' }}>{label}</button>;
                    })}
                  </div>
                  {[
                    {key:'brightness',label:'Brilho',min:0,max:200,def:100,unit:'%'},
                    {key:'contrast',  label:'Contraste',min:0,max:200,def:100,unit:'%'},
                    {key:'saturate',  label:'Saturação',min:0,max:300,def:100,unit:'%'},
                    {key:'opacity',   label:'Opacidade',min:0,max:100,def:100,unit:'%'},
                    {key:'blur',      label:'Blur',min:0,max:20,def:0,unit:'px'},
                    {key:'grayscale', label:'P&B',min:0,max:100,def:0,unit:'%'},
                    {key:'sepia',     label:'Sépia',min:0,max:100,def:0,unit:'%'},
                  ].map(({key,label,min,max,def,unit})=>{
                    const val = flt[key]!==undefined?flt[key]:def, changed=val!==def;
                    return (
                      <div key={key} style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:10, color:changed?'#fbbf24':'#555', minWidth:60, fontWeight:changed?700:400 }}>{label}</span>
                        <input type="range" min={min} max={max} value={val} onMouseDown={e=>e.stopPropagation()}
                          onChange={e=>setF(key,+e.target.value)} style={{ flex:1, accentColor:'#fbbf24', height:3 }} />
                        <span style={{ fontSize:10, color:changed?'#fbbf24':'#555', minWidth:36, textAlign:'right' }}>{val}{unit}</span>
                        {changed&&<button onClick={()=>setF(key,def)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:12, padding:'0 2px' }}>↺</button>}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {images.length>0?(
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {images.map((item,i)=>(
                  <div key={item.id} onClick={()=>setActiveImageId(item.id)}
                    style={{ display:'flex', alignItems:'center', gap:8, background:activeImageId===item.id?'rgba(0,191,255,0.08)':'rgba(255,255,255,0.03)', border:activeImageId===item.id?'1px solid rgba(0,191,255,0.3)':'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'7px 10px', cursor:'pointer' }}>
                    <img src={item.src} alt="" style={{ width:32, height:32, borderRadius:6, objectFit:'cover' }} />
                    <span style={{ flex:1, fontSize:11, color:'#888' }}>Imagem {i+1}</span>
                    <button onClick={e=>{ e.stopPropagation(); setImages(p=>p.filter(img=>img.id!==item.id)); if(activeImageId===item.id) setActiveImageId(null); }}
                      style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:8, padding:'3px 8px', fontSize:11, cursor:'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            ):(
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.2)', margin:0 }}>Nenhuma imagem adicionada</p>
            )}
          </div>

          {/* ── VÍDEO OVERLAY (max 1) ────────────────────────────────────────────── */}
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <label style={{ fontSize:11, color:'#a78bfa', fontWeight:700, letterSpacing:'0.6px' }}>🎬 VÍDEO OVERLAY</label>
              <span style={{ background:`rgba(167,139,250,${videoOverlay?'0.2':'0.08'})`, border:`1px solid rgba(167,139,250,${videoOverlay?'0.5':'0.2'})`, borderRadius:999, padding:'2px 8px', fontSize:10, color:'#a78bfa' }}>{videoOverlay?'1':'0'}/1</span>
            </div>
            {videoOverlay?(
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.25)', borderRadius:10, padding:'8px 12px' }}>
                  <span style={{ fontSize:18 }}>🎬</span>
                  <span style={{ flex:1, fontSize:11, color:'#c4b5fd' }}>Vídeo overlay ativo</span>
                  <button onClick={clearVideoOverlay} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171', borderRadius:8, padding:'3px 8px', fontSize:11, cursor:'pointer' }}>✕</button>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:10, color:'#888', minWidth:56 }}>Opacidade</span>
                  <input type="range" min="0" max="1" step="0.05" value={videoOverlay.opacity??1}
                    onChange={e=>setVideoOverlay(p=>p?{...p,opacity:+e.target.value}:p)}
                    onMouseDown={e=>e.stopPropagation()} style={{ flex:1, accentColor:'#a78bfa' }} />
                  <span style={{ fontSize:10, color:'#c4b5fd', minWidth:34 }}>{Math.round((videoOverlay.opacity??1)*100)}%</span>
                </div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)' }}>O vídeo aparece apenas no canvas — não é exportado em vídeo no Free.</div>
              </div>
            ):(
              <button onClick={()=>videoInputRef.current?.click()} style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.25)', borderRadius:12, padding:'10px 0', fontSize:12, color:'#c4b5fd', cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <span style={{fontSize:16}}>🎬</span> Adicionar Vídeo Overlay
              </button>
            )}
            <div style={{ background:'rgba(251,191,36,0.05)', border:'1px solid rgba(251,191,36,0.15)', borderRadius:10, padding:'8px 12px', fontSize:10, color:'#888', display:'flex', alignItems:'center', gap:6 }}>
              <span>🔒</span> <span>Para exportar em vídeo com o overlay, <button onClick={()=>setShowUpgradeModal(true)} style={{ background:'none', border:'none', color:'#00BFFF', cursor:'pointer', fontWeight:700, fontSize:10, padding:0 }}>assine o Pro →</button></span>
            </div>
          </div>

          {/* ── FORMATO / CANVAS ─────────────────────────────────────────────────── */}
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
            <label style={{ fontSize:11, color:'#a78bfa', fontWeight:700, letterSpacing:'0.6px' }}>📐 FORMATO DO CANVAS</label>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {Object.entries(CANVAS_FORMATS).map(([key,val])=>(
                <button key={key} onClick={()=>setCanvasFormat(key)}
                  style={{ padding:'5px 12px', borderRadius:9, border:`1px solid ${canvasFormat===key?'rgba(167,139,250,0.6)':'rgba(255,255,255,0.08)'}`, background:canvasFormat===key?'rgba(167,139,250,0.15)':'rgba(255,255,255,0.03)', color:canvasFormat===key?'#c4b5fd':'#666', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  {key}
                </button>
              ))}
            </div>
            <span style={{ fontSize:10, color:'#444' }}>{canvasW}×{canvasH}px</span>
          </div>
        </div>

        {/* ── ÁREA DO CANVAS ──────────────────────────────────────────────────────── */}
        <div ref={canvasContainerRef} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#141b34 0%,#0b1024 100%)', position:'relative', overflow:'hidden' }}>

          <button onClick={()=>setIsFullscreen(true)}
            style={{ position:'absolute', top:12, right:12, zIndex:10, background:'rgba(0,191,255,0.12)', border:'1px solid rgba(0,191,255,0.3)', borderRadius:10, padding:'6px 12px', cursor:'pointer', fontSize:13, color:'#00BFFF', fontWeight:700, backdropFilter:'blur(8px)', display:'flex', alignItems:'center', gap:6 }}>
            ⛶ Tela Cheia
          </button>

          <div style={{ position:'absolute', top:12, left:12, zIndex:10, background:'rgba(167,139,250,0.15)', border:'1px solid rgba(167,139,250,0.3)', borderRadius:8, padding:'4px 10px', fontSize:11, color:'#a78bfa', fontWeight:700 }}>
            {canvasFormat} · {canvasW}×{canvasH}
          </div>

          <canvas
            ref={canvasRef}
            width={canvasW} height={canvasH}
            onMouseDown={handleCanvasMouseDown}
            onTouchStart={e=>{ e.preventDefault(); const tt=e.touches[0]; handleCanvasMouseDown({ clientX:tt.clientX, clientY:tt.clientY, preventDefault:()=>{} }); }}
            onContextMenu={e=>{ e.preventDefault(); }}
            style={{ border:'1px solid rgba(0,191,255,0.15)', borderRadius:14, maxHeight:'88%', maxWidth:'92%', cursor:'move', boxShadow:'0 24px 50px rgba(0,0,0,0.55)' }}
          />

          {/* Barra de sticker selecionado */}
          {stickers.filter(s=>s.id===activeStickerId).map(sel=>(
            <div key={sel.id} style={{ position:'absolute', bottom:48, left:'50%', transform:'translateX(-50%)', zIndex:100, background:'rgba(10,12,28,0.93)', border:'1px solid rgba(251,191,36,0.45)', borderRadius:12, padding:'7px 14px', display:'flex', alignItems:'center', gap:10, backdropFilter:'blur(8px)', minWidth:240 }}>
              <span style={{ fontSize:10, color:'#fbbf24', fontWeight:700 }}>📐 Tamanho</span>
              <input type="range" min={20} max={400} step={4} value={sel.size||80}
                onMouseDown={e=>e.stopPropagation()}
                onChange={e=>setStickers(p=>p.map(s=>s.id===sel.id?{...s,size:+e.target.value}:s))}
                style={{ flex:1, accentColor:'#fbbf24' }} />
              <span style={{ fontSize:11, color:'#fbbf24', fontWeight:700, minWidth:34 }}>{Math.round(sel.size||80)}px</span>
              <button onClick={()=>{ activeStickerRef.current=null; setActiveStickerId(null); }} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:16 }}>✕</button>
            </div>
          ))}

          {/* Barra de imagem selecionada */}
          {(()=>{
            const selImg = activeImageId?images.find(i=>i.id===activeImageId):null;
            if (!selImg||activeStickerId) return null;
            return (
              <div style={{ position:'absolute', bottom:48, left:'50%', transform:'translateX(-50%)', zIndex:100, background:'rgba(10,12,28,0.93)', border:'1px solid rgba(251,191,36,0.5)', borderRadius:14, padding:'8px 16px', display:'flex', alignItems:'center', gap:14, backdropFilter:'blur(10px)', minWidth:300 }}>
                <span style={{ fontSize:10, color:'#fbbf24', fontWeight:700, whiteSpace:'nowrap' }}>🖼️ Tamanho</span>
                <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
                  <span style={{ fontSize:10, color:'#888' }}>W</span>
                  <input type="range" min={20} max={canvasW} step={2} value={Math.round(selImg.width||100)}
                    onMouseDown={e=>e.stopPropagation()}
                    onChange={e=>setImages(p=>p.map(i=>i.id===selImg.id?{...i,width:+e.target.value}:i))}
                    style={{ flex:1, accentColor:'#fbbf24' }} />
                  <span style={{ fontSize:10, color:'#fbbf24', fontWeight:700, minWidth:36 }}>{Math.round(selImg.width||100)}px</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, flex:1 }}>
                  <span style={{ fontSize:10, color:'#888' }}>H</span>
                  <input type="range" min={20} max={canvasH} step={2} value={Math.round(selImg.height||100)}
                    onMouseDown={e=>e.stopPropagation()}
                    onChange={e=>setImages(p=>p.map(i=>i.id===selImg.id?{...i,height:+e.target.value}:i))}
                    style={{ flex:1, accentColor:'#fbbf24' }} />
                  <span style={{ fontSize:10, color:'#fbbf24', fontWeight:700, minWidth:36 }}>{Math.round(selImg.height||100)}px</span>
                </div>
                <button onClick={()=>setActiveImageId(null)} style={{ background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:16 }}>✕</button>
              </div>
            );
          })()}

          <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', background:'rgba(0,0,0,0.65)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'5px 14px', fontSize:11, color:'#555', whiteSpace:'nowrap', pointerEvents:'none' }}>
            CanvasSync Free — Exporte em vídeo no Pro
          </div>
        </div>
      </div>

      {/* ══ TELA CHEIA ══ */}
      {isFullscreen&&(
        <div onClick={()=>setIsFullscreen(false)} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, backdropFilter:'blur(6px)' }}>
          <div onClick={e=>e.stopPropagation()} style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ color:'#a78bfa', fontWeight:700, fontSize:13 }}>{canvasFormat} · {canvasW}×{canvasH}</span>
            <button onClick={()=>setIsFullscreen(false)} style={{ background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:10, padding:'6px 16px', color:'#f87171', fontWeight:700, fontSize:13, cursor:'pointer' }}>✕ Fechar</button>
          </div>
          <canvas ref={fullscreenCanvasRef} style={{ maxWidth:'92vw', maxHeight:'80vh', borderRadius:14, boxShadow:'0 32px 80px rgba(0,0,0,0.9)', border:'1px solid rgba(255,255,255,0.06)' }} />
          <span style={{ fontSize:11, color:'#334155' }}>Clique fora para fechar</span>
        </div>
      )}

      {/* ══ MODAL UPGRADE ══ */}
      {showUpgradeModal && <UpgradeModal />}

      {/* ── inputs ocultos ── */}
      <input ref={bgInputRef}    type="file" onChange={handleImageChange}  accept="image/*"           style={{display:'none'}} />
      <input ref={imgInputRef}   type="file" onChange={handleImagesChange} accept="image/*" multiple  style={{display:'none'}} />
      <input ref={videoInputRef} type="file" onChange={handleVideoUpload}  accept="video/*"            style={{display:'none'}} />
      <input ref={importInputRef} type="file" accept="application/json"    style={{display:'none'}} onChange={e=>importProjectFromFile(e.target.files[0])} />
      <input ref={fontInputRef}  type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} style={{display:'none'}} />
    </div>
  );
}

export default AppFreeV2;
