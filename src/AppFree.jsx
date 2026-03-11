import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage, LangToggle } from './hooks/useLanguage.jsx';

// ── Constantes de stickers ────────────────────────────────────────────────────
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

// ── Formatos de canvas ────────────────────────────────────────────────────────
const CANVAS_FORMATS = {
  '16:9': { width: 1280, height: 720  },
  '9:16': { width: 720,  height: 1280 },
  '1:1':  { width: 1080, height: 1080 },
  '4:3':  { width: 1024, height: 768  },
};

function AppFree() {
  const { t, lang } = useLanguage();

  // ── Mídia ────────────────────────────────────────────────────────────────────
  const [image, setImage]             = useState(null);
  const [imageSrc, setImageSrc]       = useState(null);
  const [images, setImages]           = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const bgInputRef   = useRef(null);
  const imgInputRef  = useRef(null);
  const importInputRef = useRef(null);

  // ── Formato do canvas ────────────────────────────────────────────────────────
  const [canvasFormat, setCanvasFormat] = useState('9:16');

  // ── Textos extras ─────────────────────────────────────────────────────────────
  const [extraTexts, setExtraTexts]         = useState([]);
  const [newExtraInput, setNewExtraInput]   = useState('');
  const [activeExtraTextId, setActiveExtraTextId] = useState(null);
  const [draggingExtraIndex, setDraggingExtraIndex] = useState(null);
  const [extraTextColor, setExtraTextColor]         = useState('#ffffff');
  const [extraTextFontFamily, setExtraTextFontFamily] = useState('Poppins');
  const [extraTextFontSize, setExtraTextFontSize]   = useState(28);

  // ── Stickers ─────────────────────────────────────────────────────────────────
  const [stickers, setStickers]             = useState([]);
  const [activeStickerId, setActiveStickerId] = useState(null);
  const [showStickerPanel, setShowStickerPanel] = useState(false);
  const [stickerPanelPos, setStickerPanelPos] = useState({ top: 80, left: 0 });
  const [stickerTab, setStickerTab]         = useState('emoji');
  const activeStickerRef = useRef(null);
  const stickerBtnRef    = useRef(null);

  // ── Exportação e UI ──────────────────────────────────────────────────────────
  const [exportFormat, setExportFormat] = useState('png');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Drag ─────────────────────────────────────────────────────────────────────
  const [dragging, setDragging] = useState(null);

  // ── Refs de canvas ────────────────────────────────────────────────────────────
  const canvasRef          = useRef(null);
  const canvasContainerRef = useRef(null);
  const stickersRef        = useRef([]);
  useEffect(() => { stickersRef.current = stickers; }, [stickers]);

  // ── Google Fonts ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=Montserrat:wght@700&family=Poppins:wght@700&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&family=Raleway:wght@700&family=Playfair+Display:wght@700&family=Lora:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // ── Tamanho do canvas conforme formato ───────────────────────────────────────
  const canvasW = CANVAS_FORMATS[canvasFormat]?.width  || 720;
  const canvasH = CANVAS_FORMATS[canvasFormat]?.height || 1280;

  // ── Helpers de canvas ────────────────────────────────────────────────────────
  const buildImagePlacement = useCallback((img) => {
    const maxW = canvasW * 0.72;
    const maxH = canvasH * 0.72;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const width  = Math.max(40, img.width  * scale);
    const height = Math.max(40, img.height * scale);
    return { x: (canvasW - width) / 2, y: (canvasH - height) / 2, width, height, radius: 18 };
  }, [canvasW, canvasH]);

  const drawRoundedImage = useCallback((ctx, img, x, y, w, h, r) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
  }, []);

  const drawRoundedRect = useCallback((ctx, x, y, w, h, r) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }, []);

  const drawResizeHandles = useCallback((ctx, x, y, w, h) => {
    const s = 14;
    ctx.fillStyle = '#00BFFF'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([hx,hy]) => {
      ctx.strokeRect(hx - s/2, hy - s/2, s, s);
      ctx.fillRect(hx - s/2, hy - s/2, s, s);
    });
  }, []);

  // ── Texto extra helpers ───────────────────────────────────────────────────────
  const getExtraTextBounds = useCallback((txt, ctx) => {
    const fs = txt.fontSize   || extraTextFontSize;
    const ff = txt.fontFamily || extraTextFontFamily;
    const lines = txt.text.split('\n');
    const lineH = fs * 1.25;
    ctx.font = `bold ${fs}px ${ff}`;
    const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
    return { halfW: maxW / 2 + 10, halfH: (lines.length * lineH) / 2 + 8, lineH, lines };
  }, [extraTextFontSize, extraTextFontFamily]);

  const toLocalSpace = (px, py, cx, cy, rot) => {
    const cos = Math.cos(-rot), sin = Math.sin(-rot);
    return { lx: (px - cx) * cos - (py - cy) * sin, ly: (px - cx) * sin + (py - cy) * cos };
  };

  // ── Handlers de arquivo ───────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => setImage(img);
      img.src = ev.target.result;
      setImageSrc(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const readFileAsDataUrl = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (ev) => res(ev.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const results = await Promise.all(files.map(readFileAsDataUrl));
    const loaded = await Promise.all(results.map((src, i) => new Promise(resolve => {
      const img = new Image();
      const id  = Date.now() + i;
      img.onload  = () => { const pl = buildImagePlacement(img); resolve({ id, src, img, ...pl }); };
      img.onerror = () => resolve({ id, src, img, x: 40, y: 60, width: 180, height: 180, radius: 18 });
      img.src = src;
    })));
    setImages(prev => [...prev, ...loaded]);
    e.target.value = '';
  };

  // ── Textos extras ─────────────────────────────────────────────────────────────
  const addExtraText = () => {
    if (!newExtraInput.trim()) return;
    if (extraTexts.length >= 1) {
      alert(lang === 'en'
        ? 'Free plan: only 1 extra text allowed.\nUpgrade to Pro for unlimited texts!'
        : 'No plano Free você pode adicionar apenas 1 texto extra.\nUpgrade para o plano Pro para adicionar mais!');
      return;
    }
    const cx = Math.round(canvasW / 2), cy = Math.round(canvasH * 0.18);
    setExtraTexts([{ id: Date.now(), text: newExtraInput, x: cx, y: cy, rotation: 0, color: extraTextColor, fontFamily: extraTextFontFamily, fontSize: extraTextFontSize }]);
    setNewExtraInput('');
  };

  const removeExtraText = (id) => setExtraTexts(extraTexts.filter(t => t.id !== id));

  // ── Stickers ──────────────────────────────────────────────────────────────────
  const addSticker = (type, content, animStyle = null) => {
    const size = Math.round(Math.min(canvasW, canvasH) * 0.12);
    setStickers(prev => [...prev, {
      id: Date.now() + Math.random(), type, content, animStyle, size, rotation: 0,
      x: Math.round(canvasW / 2 + (Math.random() - 0.5) * canvasW * 0.3),
      y: Math.round(canvasH / 2 + (Math.random() - 0.5) * canvasH * 0.3),
    }]);
  };

  // ── Mouse down ────────────────────────────────────────────────────────────────
  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top)  * scaleY;
    const ctx = canvas.getContext('2d');

    // ── Stickers ──
    for (let i = stickersRef.current.length - 1; i >= 0; i--) {
      const stk  = stickersRef.current[i];
      const half = (stk.size || 80) / 2 + 8;
      if (Math.abs(mx - stk.x) <= half && Math.abs(my - stk.y) <= half) {
        activeStickerRef.current = stk.id;
        setActiveStickerId(stk.id);
        setDragging({ type: 'sticker', id: stk.id, offsetX: mx - stk.x, offsetY: my - stk.y });
        return;
      }
    }
    activeStickerRef.current = null;
    setActiveStickerId(null);

    // ── Extra texts ──
    for (let i = extraTexts.length - 1; i >= 0; i--) {
      const txt = extraTexts[i];
      const rot = (txt.rotation || 0) * Math.PI / 180;
      const { halfW, halfH } = getExtraTextBounds(txt, ctx);
      const handleDist = halfH + 20;
      const hx = txt.x + Math.sin(rot) * (-handleDist);
      const hy = txt.y - Math.cos(rot) * handleDist;
      if (Math.hypot(mx - hx, my - hy) <= 10) {
        setActiveExtraTextId(txt.id);
        setDragging({ type: 'extra-rotate', id: txt.id, cx: txt.x, cy: txt.y, startAngle: Math.atan2(my - txt.y, mx - txt.x), startRotation: txt.rotation || 0 });
        return;
      }
      const { lx, ly } = toLocalSpace(mx, my, txt.x, txt.y, rot);
      if (Math.abs(lx) <= halfW && Math.abs(ly) <= halfH) {
        setActiveExtraTextId(txt.id);
        setDraggingExtraIndex(i);
        setDragging({ type: 'extra', id: txt.id, offsetX: mx - txt.x, offsetY: my - txt.y });
        return;
      }
    }
    setActiveExtraTextId(null);

    // ── Images ──
    const hs = 10;
    const clickedImage = images.slice().reverse().find(item => {
      if (!item?.img) return false;
      return mx >= item.x - hs && mx <= item.x + item.width + hs &&
             my >= item.y - hs && my <= item.y + item.height + hs;
    });
    if (!clickedImage) { setActiveImageId(null); return; }
    setActiveImageId(clickedImage.id);
    const s = 12;
    const nL = Math.abs(mx - clickedImage.x) <= s;
    const nR = Math.abs(mx - (clickedImage.x + clickedImage.width)) <= s;
    const nT = Math.abs(my - clickedImage.y) <= s;
    const nB = Math.abs(my - (clickedImage.y + clickedImage.height)) <= s;
    const corner = `${nT ? 'n' : ''}${nB ? 's' : ''}${nL ? 'w' : ''}${nR ? 'e' : ''}`;
    if (corner.length >= 2) {
      setDragging({ itemKind: 'canvas-image', type: 'resize', id: clickedImage.id, corner, startX: mx, startY: my, startWidth: clickedImage.width, startHeight: clickedImage.height, startXPos: clickedImage.x, startYPos: clickedImage.y });
    } else {
      setDragging({ itemKind: 'canvas-image', type: 'move', id: clickedImage.id, offsetX: mx - clickedImage.x, offsetY: my - clickedImage.y });
    }
  };

  // ── Mouse move ────────────────────────────────────────────────────────────────
  const handleGlobalMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect   = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width  / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);

    if (dragging?.type === 'sticker') {
      setStickers(prev => prev.map(s => s.id === dragging.id ? { ...s, x: mx - dragging.offsetX, y: my - dragging.offsetY } : s));
      return;
    }
    if (dragging?.type === 'extra-rotate') {
      const angle = Math.atan2(my - dragging.cy, mx - dragging.cx);
      const newRotation = dragging.startRotation + (angle - dragging.startAngle) * (180 / Math.PI);
      setExtraTexts(prev => prev.map(t => t.id === dragging.id ? { ...t, rotation: newRotation } : t));
      return;
    }
    if (dragging?.type === 'extra') {
      setExtraTexts(prev => prev.map(t => t.id === dragging.id ? { ...t, x: mx - dragging.offsetX, y: my - dragging.offsetY } : t));
      return;
    }
    if (dragging?.itemKind === 'canvas-image' && dragging.type === 'move') {
      setImages(prev => prev.map(item => item.id === dragging.id ? { ...item, x: mx - dragging.offsetX, y: my - dragging.offsetY } : item));
      return;
    }
    if (dragging?.itemKind === 'canvas-image' && dragging.type === 'resize') {
      const { id, corner, startX, startY, startWidth, startHeight, startXPos, startYPos } = dragging;
      const dx = mx - startX, dy = my - startY;
      const ar = startWidth / startHeight;
      let newW = startWidth, newH = startHeight, newX = startXPos, newY = startYPos;
      if (corner.includes('e')) newW = Math.max(20, startWidth + dx);
      if (corner.includes('s')) newH = Math.max(20, startHeight + dy);
      if (corner.includes('w')) { newW = Math.max(20, startWidth - dx); newX = startXPos + startWidth - newW; }
      if (corner.includes('n')) { newH = Math.max(20, startHeight - dy); newY = startYPos + startHeight - newH; }
      if ((corner.includes('e') || corner.includes('w')) && !corner.includes('s') && !corner.includes('n')) {
        newH = newW / ar;
        if (corner.includes('n')) newY = startYPos + startHeight - newH;
      } else if ((corner.includes('s') || corner.includes('n')) && !corner.includes('e') && !corner.includes('w')) {
        newW = newH * ar;
        if (corner.includes('w')) newX = startXPos + startWidth - newW;
      }
      if (newW < 20) newW = 20;
      if (newH < 20) newH = 20;
      if (corner.includes('w')) newX = startXPos + startWidth - newW;
      if (corner.includes('n')) newY = startYPos + startHeight - newH;
      setImages(prev => prev.map(item => item.id === id ? { ...item, x: newX, y: newY, width: newW, height: newH } : item));
    }
  }, [dragging]);

  const handleGlobalMouseUp = useCallback(() => {
    setDragging(null);
    setDraggingExtraIndex(null);
  }, []);

  // ── Teclas ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setIsFullscreen(false); setShowStickerPanel(false); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const el = document.activeElement;
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
        if (activeStickerId) { setStickers(prev => prev.filter(s => s.id !== activeStickerId)); activeStickerRef.current = null; setActiveStickerId(null); }
        else if (activeImageId) { setImages(prev => prev.filter(img => img.id !== activeImageId)); setActiveImageId(null); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeImageId, activeStickerId]);

  // ── DRAW ──────────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Imagens sobrepostas
    images.forEach(item => {
      if (!item?.img || !item.img.complete || item.img.naturalWidth === 0) return;
      const rot = (item.rotation || 0) * Math.PI / 180;
      ctx.save();
      if (rot) {
        const cx = item.x + item.width / 2, cy = item.y + item.height / 2;
        ctx.translate(cx, cy); ctx.rotate(rot); ctx.translate(-cx, -cy);
      }
      drawRoundedImage(ctx, item.img, item.x, item.y, item.width, item.height, item.radius ?? 18);
      if (activeImageId === item.id) {
        ctx.strokeStyle = 'rgba(248,250,252,0.9)'; ctx.lineWidth = 2;
        drawRoundedRect(ctx, item.x, item.y, item.width, item.height, (item.radius ?? 18) + 2);
        ctx.stroke();
        drawResizeHandles(ctx, item.x, item.y, item.width, item.height);
      }
      ctx.restore();
    });

    // Stickers
    const _now = Date.now() / 1000;
    stickersRef.current.forEach(stk => {
      const sz = stk.size || 80;
      const { dy, s, r, a } = getStickerAnimTransform(stk.animStyle, _now, sz);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(stk.x, stk.y + dy);
      ctx.rotate((stk.rotation || 0) * Math.PI / 180 + r);
      ctx.scale(s, s);
      ctx.font = `${sz}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(stk.content, 0, 0);
      if (activeStickerRef.current === stk.id) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(167,139,250,0.85)';
        ctx.lineWidth = 2 / s;
        ctx.setLineDash([5, 4]);
        const bx = -sz/2 - 8, by = -sz/2 - 8, bw = sz + 16, bh = sz + 16;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.setLineDash([]);
        const hs = 9 / s;
        ctx.fillStyle = '#a78bfa';
        [[bx,by],[bx+bw,by],[bx,by+bh],[bx+bw,by+bh]].forEach(([hx,hy]) => ctx.fillRect(hx - hs/2, hy - hs/2, hs, hs));
      }
      ctx.restore();
    });

    // Textos extras
    extraTexts.forEach(txt => {
      const tColor = txt.color      || extraTextColor;
      const tFont  = txt.fontFamily || extraTextFontFamily;
      const tSize  = txt.fontSize   || extraTextFontSize;
      const lines  = txt.text.split('\n');
      const lineH  = tSize * 1.25;
      const rot    = (txt.rotation || 0) * Math.PI / 180;
      ctx.save();
      ctx.translate(txt.x, txt.y);
      ctx.rotate(rot);
      ctx.font = `bold ${tSize}px ${tFont}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      // Gradiente
      if (txt.gradientEnabled && txt.gradientColor1 && txt.gradientColor2) {
        const totalH = lines.length * lineH;
        const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
        const grad = ctx.createLinearGradient(-maxW/2, -totalH/2, maxW/2, totalH/2);
        grad.addColorStop(0, txt.gradientColor1);
        grad.addColorStop(1, txt.gradientColor2);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = tColor;
      }

      const totalH = lines.length * lineH;
      lines.forEach((line, li) => {
        if (txt.shadowEnabled !== false) { ctx.shadowBlur = txt.shadowBlur ?? 10; ctx.shadowColor = txt.shadowColor || 'rgba(0,0,0,0.8)'; }
        ctx.fillText(line, 0, -totalH / 2 + li * lineH + lineH / 2);
      });
      ctx.shadowBlur = 0;

      // Seleção
      if (activeExtraTextId === txt.id) {
        ctx.font = `bold ${tSize}px ${tFont}`;
        const maxW = lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
        const hw = maxW / 2 + 10, hh = totalH / 2 + 8;
        ctx.strokeStyle = 'rgba(0,191,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(-hw, -hh, hw * 2, hh * 2);
        ctx.setLineDash([]);
        const handleDist = hh + 20;
        ctx.beginPath(); ctx.arc(0, -handleDist, 7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.9)'; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -hh); ctx.lineTo(0, -handleDist + 7);
        ctx.strokeStyle = 'rgba(167,139,250,0.6)'; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();
    });

    // ── Marca d'água ─────────────────────────────────────────────────────────
    ctx.save();
    ctx.globalAlpha = 0.55;
    const badgeW = 140, badgeH = 24;
    const bx = canvas.width - badgeW - 10;
    const by = canvas.height - badgeH - 10;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 7);
    ctx.fill();
    ctx.font = `bold ${Math.max(10, Math.round(canvas.width * 0.012))}px DM Sans, Poppins, sans-serif`;
    ctx.fillStyle = '#00BFFF';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.shadowBlur = 0;
    ctx.fillText('⚡ CanvasSync Free', bx + 9, by + 12);
    ctx.restore();
  }, [image, images, extraTexts, extraTextColor, extraTextFontFamily, extraTextFontSize,
      activeImageId, activeExtraTextId, drawRoundedImage, drawRoundedRect, drawResizeHandles]);

  // ── RAF loop ─────────────────────────────────────────────────────────────────
  const drawRef = useRef(draw);
  useEffect(() => { drawRef.current = draw; }, [draw]);
  useEffect(() => {
    let rafId;
    const loop = () => { if (drawRef.current) drawRef.current(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Salvar imagem ─────────────────────────────────────────────────────────────
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setActiveImageId(null); setActiveExtraTextId(null); activeStickerRef.current = null; setActiveStickerId(null);
    setTimeout(() => {
      const isPng = exportFormat === 'png';
      const dataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = isPng ? 'canvas-free.png' : 'canvas-free.jpg';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }, 80);
  };

  // ── Limpar projeto ────────────────────────────────────────────────────────────
  const handleClearProject = () => {
    if (!window.confirm(lang === 'en' ? 'Clear all project data?' : 'Limpar todo o projeto?')) return;
    setImage(null); setImageSrc(null); setImages([]); setExtraTexts([]);
    setStickers([]); setNewExtraInput(''); setActiveImageId(null);
    setActiveExtraTextId(null); activeStickerRef.current = null; setActiveStickerId(null);
    setExtraTextColor('#ffffff'); setExtraTextFontFamily('Poppins'); setExtraTextFontSize(28);
    setExportFormat('png'); setCanvasFormat('9:16');
    if (bgInputRef.current) bgInputRef.current.value = '';
    if (imgInputRef.current) imgInputRef.current.value = '';
    try { localStorage.removeItem('gc_free_project'); } catch {}
  };

  // ── Exportar projeto ──────────────────────────────────────────────────────────
  const exportProject = () => {
    const payload = {
      version: 'free-1',
      canvasFormat,
      exportFormat,
      imageSrc,
      images: images.map(({ id, src, x, y, width, height, radius, rotation }) => ({ id, src, x, y, width, height, radius, rotation })),
      extraTexts,
      stickers: stickers.map(({ id, type, content, animStyle, size, rotation, x, y }) => ({ id, type, content, animStyle, size, rotation, x, y })),
      extraTextColor,
      extraTextFontFamily,
      extraTextFontSize,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'projeto-free.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Importar projeto ──────────────────────────────────────────────────────────
  const importProjectFromFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const p = JSON.parse(ev.target.result);
        if (p.canvasFormat) setCanvasFormat(p.canvasFormat);
        if (p.exportFormat) setExportFormat(p.exportFormat);
        if (p.extraTextColor)      setExtraTextColor(p.extraTextColor);
        if (p.extraTextFontFamily) setExtraTextFontFamily(p.extraTextFontFamily);
        if (p.extraTextFontSize)   setExtraTextFontSize(p.extraTextFontSize);
        if (p.imageSrc) {
          setImageSrc(p.imageSrc);
          const img = new Image(); img.onload = () => setImage(img); img.src = p.imageSrc;
        }
        if (Array.isArray(p.images)) {
          const loaded = p.images.map(item => {
            const img = new Image();
            const id  = item.id || Date.now() + Math.random();
            img.src = item.src;
            return { id, src: item.src, img, x: item.x ?? 40, y: item.y ?? 60, width: item.width ?? 180, height: item.height ?? 180, radius: item.radius ?? 18, rotation: item.rotation ?? 0 };
          });
          setImages(loaded);
        }
        if (Array.isArray(p.extraTexts)) setExtraTexts(p.extraTexts.slice(0, 1));
        if (Array.isArray(p.stickers))   setStickers(p.stickers);
      } catch { alert(lang === 'en' ? 'Error importing project.' : 'Erro ao importar projeto.'); }
    };
    reader.readAsText(file);
  };

  // ── Persistência local ────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gc_free_project');
      if (!saved) return;
      const p = JSON.parse(saved);
      if (p.canvasFormat) setCanvasFormat(p.canvasFormat);
      if (p.extraTextColor)      setExtraTextColor(p.extraTextColor);
      if (p.extraTextFontFamily) setExtraTextFontFamily(p.extraTextFontFamily);
      if (p.extraTextFontSize)   setExtraTextFontSize(p.extraTextFontSize);
      if (p.imageSrc) { setImageSrc(p.imageSrc); const img = new Image(); img.onload = () => setImage(img); img.src = p.imageSrc; }
      if (Array.isArray(p.images)) {
        setImages(p.images.map(item => {
          const img = new Image(); img.src = item.src;
          return { id: item.id || Date.now() + Math.random(), src: item.src, img, x: item.x ?? 40, y: item.y ?? 60, width: item.width ?? 180, height: item.height ?? 180, radius: item.radius ?? 18, rotation: item.rotation ?? 0 };
        }));
      }
      if (Array.isArray(p.extraTexts)) setExtraTexts(p.extraTexts.slice(0, 1));
      if (Array.isArray(p.stickers))   setStickers(p.stickers);
    } catch {}
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('gc_free_project', JSON.stringify({
          canvasFormat, exportFormat, imageSrc, extraTextColor, extraTextFontFamily, extraTextFontSize,
          images: images.map(({ id, src, x, y, width, height, radius, rotation }) => ({ id, src, x, y, width, height, radius, rotation })),
          extraTexts,
          stickers: stickers.map(({ id, type, content, animStyle, size, rotation, x, y }) => ({ id, type, content, animStyle, size, rotation, x, y })),
        }));
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [images, extraTexts, stickers, canvasFormat, exportFormat, imageSrc, extraTextColor, extraTextFontFamily, extraTextFontSize]);

  // ── Fullscreen canvas mirror ──────────────────────────────────────────────────
  const fullscreenCanvasRef = useRef(null);
  useEffect(() => {
    if (!isFullscreen) return;
    let rafId;
    const mirror = () => {
      const src  = canvasRef.current;
      const dest = fullscreenCanvasRef.current;
      if (!src || !dest) { rafId = requestAnimationFrame(mirror); return; }
      dest.width  = src.width;
      dest.height = src.height;
      dest.getContext('2d').drawImage(src, 0, 0);
      rafId = requestAnimationFrame(mirror);
    };
    rafId = requestAnimationFrame(mirror);
    return () => cancelAnimationFrame(rafId);
  }, [isFullscreen]);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#080808', color: '#f0f0f0', fontFamily: "'DM Sans', 'Poppins', system-ui, sans-serif", overflowX: 'hidden', overflowY: 'auto', position: 'fixed', top: 0, left: 0 }}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onTouchMove={e => { const tt = e.touches[0]; handleGlobalMouseMove({ clientX: tt.clientX, clientY: tt.clientY }); }}
      onTouchEnd={handleGlobalMouseUp}
    >
      <style>{`
        .free-scrollbar::-webkit-scrollbar { width: 6px; }
        .free-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 10px; }
        .free-scrollbar::-webkit-scrollbar-thumb { background: #00BFFF; border-radius: 10px; border: 2px solid #0a0a0a; }
        @media (max-width: 700px) {
          .free-body { flex-direction: column !important; overflow-y: auto !important; overflow-x: hidden !important; }
          .free-panel { width: 100% !important; min-width: 0 !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07) !important; max-height: 55vh !important; }
          .free-canvas-area { flex: none !important; width: 100% !important; min-height: 55vw !important; padding: 12px 0 !important; }
          .free-canvas-area canvas { max-height: 70vw !important; max-width: 90vw !important; }
          .free-header-scroll { overflow-x: auto !important; flex-wrap: nowrap !important; }
        }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <div className="free-header-scroll" style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px 16px',
        background: 'rgba(8,8,8,0.97)', borderBottom: '1px solid rgba(0,191,255,0.12)',
        fontSize: '12px', alignItems: 'center', width: '100%', boxSizing: 'border-box',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#00BFFF,#0070ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg,#fff 30%,#00BFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CanvasSync</span>
          <span style={{ background: 'rgba(0,191,255,0.1)', border: '1px solid rgba(0,191,255,0.25)', borderRadius: 999, padding: '2px 8px', fontSize: 10, color: '#00BFFF', fontWeight: 700, letterSpacing: 1 }}>FREE</span>
        </div>

        <LangToggle />
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)' }} />

        {/* Fundo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 600, letterSpacing: '0.5px' }}>{t('ed_background')}</label>
          <input ref={bgInputRef} type="file" onChange={handleImageChange} accept="image/*" style={{ color: '#aaa', fontSize: '11px' }} />
        </div>

        {/* Imagens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 600, letterSpacing: '0.5px' }}>{t('ed_images')}</label>
          <input ref={imgInputRef} type="file" onChange={handleImagesChange} accept="image/*" multiple style={{ color: '#aaa', fontSize: '11px' }} />
        </div>

        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.07)' }} />

        {/* Formato de canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <label style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.5px' }}>📐 {t('ed_canvas_label')}</label>
          <select value={canvasFormat} onChange={e => setCanvasFormat(e.target.value)}
            style={{ backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 12, padding: '6px 10px', fontSize: '12px' }}>
            {Object.entries(CANVAS_FORMATS).map(([key, val]) => (
              <option key={key} value={key}>{key} — {val.width}×{val.height}</option>
            ))}
          </select>
        </div>

        {/* Formato de exportação */}
        <select value={exportFormat} onChange={e => setExportFormat(e.target.value)}
          style={{ backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '7px 10px', fontSize: '12px' }}>
          <option value="png">🖼️ PNG</option>
          <option value="jpg">🖼️ JPG</option>
        </select>

        {/* Salvar */}
        <button onClick={handleSave}
          style={{ background: '#00BFFF', border: 'none', padding: '8px 18px', borderRadius: 14, cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', color: '#000', boxShadow: '0 4px 16px rgba(0,191,255,0.3)', whiteSpace: 'nowrap' }}>
          {t('free_save')}
        </button>

        {/* Exportar projeto */}
        <button onClick={exportProject}
          style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', padding: '7px 12px', borderRadius: 14, cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#00BFFF', whiteSpace: 'nowrap' }}>
          {t('ed_export_project')}
        </button>

        {/* Importar projeto */}
        <input ref={importInputRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={e => importProjectFromFile(e.target.files[0])} />
        <button onClick={() => importInputRef.current?.click()}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '7px 12px', borderRadius: 14, cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#888', whiteSpace: 'nowrap' }}>
          {t('ed_import_project')}
        </button>

        {/* Limpar */}
        <button onClick={handleClearProject}
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', padding: '7px 12px', borderRadius: 14, cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', color: '#f87171', whiteSpace: 'nowrap' }}>
          {t('ed_clear_project')}
        </button>

        {/* Stickers */}
        <div style={{ position: 'relative' }}>
          <button ref={stickerBtnRef}
            onClick={() => {
              const rect = stickerBtnRef.current?.getBoundingClientRect();
              if (rect) setStickerPanelPos({ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 372) });
              setShowStickerPanel(v => !v);
            }}
            style={{
              background: showStickerPanel ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.07)',
              border: `1px solid ${showStickerPanel ? 'rgba(251,191,36,0.6)' : 'rgba(251,191,36,0.2)'}`,
              borderRadius: 14, padding: '7px 14px', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, color: '#fbbf24',
              display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
            }}>
            ✨ Stickers {stickers.length > 0 && <span style={{ background: '#fbbf24', color: '#000', borderRadius: 8, padding: '1px 6px', fontSize: 10, fontWeight: 900 }}>{stickers.length}</span>}
          </button>

          {showStickerPanel && createPortal(
            <div onClick={e => e.stopPropagation()} style={{
              position: 'fixed', top: stickerPanelPos.top, left: stickerPanelPos.left,
              zIndex: 99999, background: '#111827', border: '1px solid rgba(251,191,36,0.25)',
              borderRadius: 18, width: 360, boxShadow: '0 16px 48px rgba(0,0,0,0.8)', overflow: 'hidden',
            }}>
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
                          <button key={em} onClick={() => addSticker('emoji', em, null)}
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '6px 4px', fontSize: 22, cursor: 'pointer', lineHeight: 1, width: 44 }}
                            onMouseEnter={e => e.target.style.background = 'rgba(251,191,36,0.15)'}
                            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.04)'}
                          >{em}</button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {stickerTab === 'sticker' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {ANIMATED_STICKERS.map(stk => (
                      <button key={stk.key} onClick={() => addSticker('sticker', stk.emoji, stk.anim)}
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '8px 6px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 68 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      >
                        <span style={{ fontSize: 26 }}>{stk.emoji}</span>
                        <span style={{ fontSize: 9, color: '#888', fontWeight: 700 }}>{stk.label}</span>
                        <span style={{ fontSize: 8, color: '#fbbf24', fontWeight: 600 }}>{stk.anim}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: '#555' }}>{t('stk_hint')}</span>
                {stickers.length > 0 && (
                  <button onClick={() => { setStickers([]); activeStickerRef.current = null; setActiveStickerId(null); }}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '3px 10px', fontSize: 10, color: '#f87171', fontWeight: 700, cursor: 'pointer' }}>
                    {t('stk_clear_all')}
                  </button>
                )}
              </div>
            </div>
          , document.body)}
        </div>

        {/* Banner upgrade — à direita */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.15)', borderRadius: 12, padding: '6px 14px', flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: '#888' }}>{t('free_upgrade_msg')}</span>
          <button onClick={() => window.location.href = '/planos'}
            style={{ background: '#00BFFF', border: 'none', borderRadius: 999, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#000', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t('free_upgrade_btn')}
          </button>
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════════════ */}
      <div className="free-body free-scrollbar" style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>

        {/* ── PAINEL ESQUERDO ────────────────────────────────────────────────── */}
        <div className="free-panel free-scrollbar" style={{
          width: '380px', minWidth: '380px',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          background: '#0d0d0d', overflowY: 'auto',
        }}>

          {/* ── TEXTO EXTRA — limite 1 no Free ─────────────────────────────── */}
          <div style={{ padding: '14px 18px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.6px' }}>{t('ed_extra_texts')}</label>
                <span style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', borderRadius: 999, padding: '2px 8px', fontSize: 10, color: '#00BFFF' }}>{extraTexts.length}/1</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Cor */}
                <input type="color"
                  value={activeExtraTextId ? (extraTexts.find(t => t.id === activeExtraTextId)?.color || extraTextColor) : extraTextColor}
                  onChange={e => { setExtraTextColor(e.target.value); if (activeExtraTextId) setExtraTexts(prev => prev.map(t => t.id === activeExtraTextId ? { ...t, color: e.target.value } : t)); }}
                  style={{ width: 28, height: 28, padding: 0, border: '1px solid rgba(0,191,255,0.2)', background: '#111', borderRadius: 8, cursor: 'pointer' }} />
                {/* Fonte */}
                <select
                  value={activeExtraTextId ? (extraTexts.find(t => t.id === activeExtraTextId)?.fontFamily || extraTextFontFamily) : extraTextFontFamily}
                  onChange={e => { setExtraTextFontFamily(e.target.value); if (activeExtraTextId) setExtraTexts(prev => prev.map(t => t.id === activeExtraTextId ? { ...t, fontFamily: e.target.value } : t)); }}
                  style={{ fontSize: '11px', backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '5px 8px' }}>
                  <option value="Poppins">Poppins</option>
                  <option value="Bebas Neue">Bebas Neue</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Roboto Condensed">Roboto Condensed</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Playfair Display">Playfair</option>
                  <option value="Lora">Lora</option>
                </select>
                {/* Tamanho */}
                <span style={{ fontSize: 10, color: '#94a3b8' }}>
                  {activeExtraTextId ? (extraTexts.find(t => t.id === activeExtraTextId)?.fontSize || extraTextFontSize) : extraTextFontSize}px
                </span>
                <input type="range" min="10" max="120"
                  value={activeExtraTextId ? (extraTexts.find(t => t.id === activeExtraTextId)?.fontSize || extraTextFontSize) : extraTextFontSize}
                  onChange={e => { const v = parseInt(e.target.value); setExtraTextFontSize(v); if (activeExtraTextId) setExtraTexts(prev => prev.map(t => t.id === activeExtraTextId ? { ...t, fontSize: v } : t)); }}
                  style={{ width: 80, accentColor: '#00BFFF' }} />
              </div>
            </div>

            {/* Sombra + Gradiente */}
            {(() => {
              const tid = activeExtraTextId || (extraTexts.length ? extraTexts[extraTexts.length - 1]?.id : null);
              const sel = extraTexts.find(t => t.id === tid);
              if (!sel) return null;
              const setP = (prop, val) => setExtraTexts(prev => prev.map(t => t.id === tid ? { ...t, [prop]: val } : t));
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: 'rgba(0,191,255,0.03)', border: '1px solid rgba(0,191,255,0.08)', borderRadius: 10, padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>{t('ed_shadow')}</span>
                    <input type="checkbox" checked={sel.shadowEnabled ?? true} onChange={e => setP('shadowEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {(sel.shadowEnabled ?? true) && <>
                      <input type="color" value={(sel.shadowColor || '#000000').replace(/rgba?\([^)]+\)/, '#000000')} onChange={e => setP('shadowColor', e.target.value)} style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                      <input type="range" min="0" max="30" value={sel.shadowBlur ?? 10} onChange={e => setP('shadowBlur', +e.target.value)} style={{ width: 60, accentColor: '#00BFFF' }} />
                    </>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>{t('ed_gradient')}</span>
                    <input type="checkbox" checked={sel.gradientEnabled ?? false} onChange={e => setP('gradientEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {(sel.gradientEnabled ?? false) && <>
                      <input type="color" value={sel.gradientColor1 || '#ffffff'} onChange={e => setP('gradientColor1', e.target.value)} style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                      <input type="color" value={sel.gradientColor2 || '#00BFFF'} onChange={e => setP('gradientColor2', e.target.value)} style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                    </>}
                  </div>
                </div>
              );
            })()}

            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                placeholder={t('et_placeholder')}
                value={newExtraInput}
                onChange={e => setNewExtraInput(e.target.value)}
                rows={3}
                style={{ flex: 1, padding: '10px 12px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f0', borderRadius: 14, fontSize: 12, resize: 'none', lineHeight: 1.5, fontFamily: 'inherit' }}
              />
              <button onClick={addExtraText} disabled={extraTexts.length >= 1}
                style={{ padding: '0 16px', height: 56, background: extraTexts.length >= 1 ? 'rgba(255,255,255,0.04)' : '#00BFFF', border: extraTexts.length >= 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', borderRadius: 14, cursor: extraTexts.length >= 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', color: extraTexts.length >= 1 ? '#333' : '#000', boxShadow: extraTexts.length >= 1 ? 'none' : '0 4px 16px rgba(0,191,255,0.25)', fontSize: 22 }}>+</button>
            </div>

            {extraTexts.length >= 1 && (
              <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {t('free_text_limit')}
                <button onClick={() => window.location.href = '/planos'}
                  style={{ background: 'none', border: 'none', color: '#00BFFF', cursor: 'pointer', fontWeight: 700, fontSize: 11, padding: 0 }}>
                  {t('free_upgrade_link')} →
                </button>
              </div>
            )}

            {extraTexts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {extraTexts.map(txt => (
                  <div key={txt.id}
                    onClick={() => setActiveExtraTextId(txt.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: activeExtraTextId === txt.id ? 'rgba(0,191,255,0.08)' : 'rgba(0,191,255,0.03)', border: `1px solid ${activeExtraTextId === txt.id ? 'rgba(0,191,255,0.35)' : 'rgba(0,191,255,0.12)'}`, borderRadius: 10, padding: '8px 12px', cursor: 'pointer' }}>
                    <span style={{ flex: 1, fontSize: 12, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txt.text}</span>
                    <button onClick={e => { e.stopPropagation(); removeExtraText(txt.id); }}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{t('et_hint')}</span>
          </div>

          {/* ── IMAGENS NA COMPOSIÇÃO ────────────────────────────────────────── */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.6px' }}>
              {t('free_images_comp')} <span style={{ marginLeft: 6, color: '#555', fontWeight: 400 }}>({images.length})</span>
            </label>

            {/* Barra de controle da imagem selecionada */}
            {activeImageId && (() => {
              const sel = images.find(i => i.id === activeImageId);
              if (!sel) return null;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, minWidth: 52 }}>{t('ed_rotation')}</span>
                    <input type="range" min="-180" max="180" value={sel.rotation ?? 0}
                      onChange={e => setImages(prev => prev.map(i => i.id === activeImageId ? { ...i, rotation: +e.target.value } : i))}
                      onMouseDown={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}
                      style={{ flex: 1, accentColor: '#fbbf24' }} />
                    <span style={{ fontSize: 10, color: '#fbbf24', minWidth: 34 }}>{Math.round(sel.rotation ?? 0)}°</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, minWidth: 52 }}>W</span>
                    <input type="range" min="20" max={canvasW}
                      value={Math.round(sel.width || 180)}
                      onChange={e => setImages(prev => prev.map(i => i.id === activeImageId ? { ...i, width: +e.target.value } : i))}
                      onMouseDown={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}
                      style={{ flex: 1, accentColor: '#fbbf24' }} />
                    <span style={{ fontSize: 10, color: '#fbbf24', minWidth: 34 }}>{Math.round(sel.width || 180)}px</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 700, minWidth: 52 }}>H</span>
                    <input type="range" min="20" max={canvasH}
                      value={Math.round(sel.height || 180)}
                      onChange={e => setImages(prev => prev.map(i => i.id === activeImageId ? { ...i, height: +e.target.value } : i))}
                      onMouseDown={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}
                      style={{ flex: 1, accentColor: '#fbbf24' }} />
                    <span style={{ fontSize: 10, color: '#fbbf24', minWidth: 34 }}>{Math.round(sel.height || 180)}px</span>
                  </div>
                </div>
              );
            })()}

            {images.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {images.map((item, i) => (
                  <div key={item.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: activeImageId === item.id ? 'rgba(0,191,255,0.08)' : 'rgba(255,255,255,0.03)', border: activeImageId === item.id ? '1px solid rgba(0,191,255,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '7px 10px', cursor: 'pointer' }}
                    onClick={() => setActiveImageId(item.id)}>
                    <img src={item.src} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                    <span style={{ flex: 1, fontSize: 11, color: '#888' }}>{t('free_image_label')} {i + 1}</span>
                    <button onClick={e => { e.stopPropagation(); setImages(prev => prev.filter(img => img.id !== item.id)); if (activeImageId === item.id) setActiveImageId(null); }}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>{t('free_no_images')}</p>
            )}
          </div>

          {/* ── RECURSO BLOQUEADO — MÚSICA ──────────────────────────────────── */}
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: '11px', color: '#444', fontWeight: '700', letterSpacing: '0.6px' }}>{t('free_lyric_sync')}</label>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 28, opacity: 0.3 }}>🎵</div>
              <p style={{ fontSize: 12, color: '#444', margin: 0, lineHeight: 1.6 }}>{t('free_lyric_locked')}</p>
              <button onClick={() => window.location.href = '/planos'}
                style={{ background: '#00BFFF', border: 'none', borderRadius: 999, padding: '8px 20px', fontSize: 12, fontWeight: 700, color: '#000', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,191,255,0.25)' }}>
                {t('free_see_pro')}
              </button>
            </div>
          </div>
        </div>

        {/* ── PREVIEW CENTRO ──────────────────────────────────────────────────── */}
        <div className="free-canvas-area" ref={canvasContainerRef}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#141b34 0%,#0b1024 100%)', position: 'relative' }}>

          {/* Botão tela cheia */}
          <button onClick={() => setIsFullscreen(true)}
            style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,191,255,0.12)', border: '1px solid rgba(0,191,255,0.3)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', fontSize: 13, color: '#00BFFF', fontWeight: 700, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 6 }}>
            ⛶ {t('ed_fullscreen')}
          </button>

          {/* Badge de formato */}
          <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#a78bfa', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
            {canvasFormat} · {canvasW}×{canvasH}
          </div>

          <canvas
            ref={canvasRef}
            width={canvasW}
            height={canvasH}
            onMouseDown={handleCanvasMouseDown}
            onTouchStart={e => { e.preventDefault(); const tt = e.touches[0]; handleCanvasMouseDown({ clientX: tt.clientX, clientY: tt.clientY, preventDefault: () => {} }); }}
            onContextMenu={e => {
              e.preventDefault();
              const canvas = canvasRef.current;
              const rect   = canvas.getBoundingClientRect();
              const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
              const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
              const ctx = canvas.getContext('2d');
              // Right-click sticker
              for (let i = stickersRef.current.length - 1; i >= 0; i--) {
                const stk = stickersRef.current[i];
                if (Math.abs(mx - stk.x) <= (stk.size || 80) / 2 + 8 && Math.abs(my - stk.y) <= (stk.size || 80) / 2 + 8) {
                  setStickers(prev => prev.filter(s => s.id !== stk.id));
                  if (activeStickerRef.current === stk.id) { activeStickerRef.current = null; setActiveStickerId(null); }
                  return;
                }
              }
              // Right-click extra text
              extraTexts.forEach(txt => {
                const rot = (txt.rotation || 0) * Math.PI / 180;
                const { halfW, halfH } = getExtraTextBounds(txt, ctx);
                const { lx, ly } = toLocalSpace(mx, my, txt.x, txt.y, rot);
                if (Math.abs(lx) <= halfW && Math.abs(ly) <= halfH) removeExtraText(txt.id);
              });
            }}
            style={{ border: '1px solid rgba(0,191,255,0.15)', borderRadius: 14, maxHeight: '88%', maxWidth: '92%', cursor: 'move', boxShadow: '0 24px 50px rgba(0,0,0,0.55)' }}
          />

          {/* Dica de marca d'água */}
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '5px 14px', fontSize: 11, color: '#555', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
            {t('free_watermark_msg')}
          </div>
        </div>
      </div>

      {/* ══ TELA CHEIA ══════════════════════════════════════════════════════════ */}
      {isFullscreen && (
        <div onClick={() => setIsFullscreen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, backdropFilter: 'blur(6px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13 }}>{canvasFormat} · {canvasW}×{canvasH}</span>
            <button onClick={() => setIsFullscreen(false)}
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 10, padding: '6px 16px', color: '#f87171', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              ✕ {t('free_close')}
            </button>
          </div>
          <canvas
            ref={fullscreenCanvasRef}
            style={{ maxWidth: '92vw', maxHeight: '80vh', borderRadius: 14, boxShadow: '0 32px 80px rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}
          />
          <span style={{ fontSize: 11, color: '#334155' }}>{t('free_click_close')}</span>
        </div>
      )}
    </div>
  );
}

export default AppFree;
