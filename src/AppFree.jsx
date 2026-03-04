import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage, LangToggle } from './hooks/useLanguage.jsx';

function AppFree() {
  const { t } = useLanguage();

  const [image, setImage]                 = useState(null);
  const [imageSrc, setImageSrc]           = useState(null);
  const [images, setImages]               = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);

  const [fontSize, setFontSize]                         = useState(35);
  const [textColor, setTextColor]                       = useState('#ffffff');
  const [fontFamily, setFontFamily]                     = useState('Poppins');
  const [extraTextColor, setExtraTextColor]             = useState('#ffffff');
  const [extraTextFontFamily, setExtraTextFontFamily]   = useState('Poppins');
  const [extraTextFontSize, setExtraTextFontSize]       = useState(18);
  const [exportFormat, setExportFormat]                 = useState('png');

  // Plano Free: máximo 1 texto extra
  const [extraTexts, setExtraTexts]           = useState([]);
  const [newExtraInput, setNewExtraInput]     = useState('');
  const [activeExtraTextId, setActiveExtraTextId] = useState(null);
  const [draggingExtraIndex, setDraggingExtraIndex] = useState(null);

  const [dragging, setDragging] = useState(null);

  const canvasRef           = useRef(null);
  const canvasContainerRef  = useRef(null);
  const requestRef          = useRef();

  // ─── Google Fonts ────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=Montserrat:wght@700&family=Poppins:wght@700&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&family=Raleway:wght@700&family=Playfair+Display:wght@700&family=Lora:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // ─── Canvas helpers ──────────────────────────────────────────────────────────
  const getCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    return { width: canvas?.width || 270, height: canvas?.height || 480 };
  }, []);

  const buildImagePlacement = useCallback((img) => {
    const { width: canvasW, height: canvasH } = getCanvasSize();
    const maxW = canvasW * 0.72;
    const maxH = canvasH * 0.72;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const width  = Math.max(40, img.width  * scale);
    const height = Math.max(40, img.height * scale);
    const x = (canvasW - width)  / 2;
    const y = (canvasH - height) / 2;
    return { x, y, width, height, radius: 18 };
  }, [getCanvasSize]);

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
    const s = 12;
    ctx.fillStyle   = '#00BFFF';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth   = 2;
    [[x, y], [x + width, y], [x, y + height], [x + width, y + height]].forEach(([hx, hy]) => {
      ctx.strokeRect(hx - s / 2, hy - s / 2, s, s);
      ctx.fillRect(hx - s / 2, hy - s / 2, s, s);
    });
  }, []);

  const getHandleCursor = useCallback((x, y, width, height, mx, my) => {
    const s = 12;
    const nL = Math.abs(mx - x) <= s,           nR = Math.abs(mx - (x + width)) <= s;
    const nT = Math.abs(my - y) <= s,           nB = Math.abs(my - (y + height)) <= s;
    if (nT && nL) return 'nwse-resize';
    if (nT && nR) return 'nesw-resize';
    if (nB && nL) return 'nesw-resize';
    if (nB && nR) return 'nwse-resize';
    if (nT || nB) return 'ns-resize';
    if (nL || nR) return 'ew-resize';
    return null;
  }, []);

  // ─── Fundo ───────────────────────────────────────────────────────────────────
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

  // ─── Imagens sobrepostas ─────────────────────────────────────────────────────
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
    setImages(prev => {
      const newItems = results.map((src, index) => {
        const img = new Image();
        const id  = Date.now() + index;
        img.onload = () => {
          const placement = buildImagePlacement(img);
          setImages(prev2 => prev2.map(item => item.id === id ? { ...item, ...placement } : item));
        };
        img.src = src;
        return { id, src, img, x: 40, y: 60, width: 180, height: 180, radius: 18 };
      });
      return [...prev, ...newItems];
    });
    e.target.value = '';
  };

  // ─── Texto extra (máx. 1 no plano Free) ─────────────────────────────────────
  const addExtraText = () => {
    if (!newExtraInput.trim()) return;
    if (extraTexts.length >= 1) {
      alert('No plano Free você pode adicionar apenas 1 texto extra.\nUpgrade para o plano Pro para adicionar mais!');
      return;
    }
    setExtraTexts([{ id: Date.now(), text: newExtraInput, x: 135, y: 80, rotation: 0, color: extraTextColor, fontFamily: extraTextFontFamily, fontSize: extraTextFontSize }]);
    setNewExtraInput('');
  };

  const removeExtraText = (id) => setExtraTexts(extraTexts.filter(t => t.id !== id));

  const getExtraTextBounds = useCallback((txt, ctx) => {
    const fs  = txt.fontSize   || extraTextFontSize;
    const ff  = txt.fontFamily || extraTextFontFamily;
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

  // ─── Canvas mouse down ───────────────────────────────────────────────────────
  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top)  * scaleY;
    const ctx = canvas.getContext('2d');

    // Extra texts
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

    // ── Imagens sobrepostas — hit test inclui área dos handles (hs = margem) ──
    const hs = 10;
    const clickedImage = images.slice().reverse().find(item => {
      if (!item?.img) return false;
      return mx >= item.x - hs && mx <= item.x + item.width + hs &&
             my >= item.y - hs && my <= item.y + item.height + hs;
    });
    if (!clickedImage) {
      setActiveImageId(null);
      return;
    }
    const activeItem = clickedImage;
    setActiveImageId(activeItem.id);
    const s = 12;
    const nL = Math.abs(mx - activeItem.x) <= s,         nR = Math.abs(mx - (activeItem.x + activeItem.width)) <= s;
    const nT = Math.abs(my - activeItem.y) <= s,         nB = Math.abs(my - (activeItem.y + activeItem.height)) <= s;
    const corner = `${nT ? 'n' : ''}${nB ? 's' : ''}${nL ? 'w' : ''}${nR ? 'e' : ''}`;
    if (corner.length >= 2) {
      setDragging({ itemKind: 'canvas-image', type: 'resize', id: activeItem.id, corner, startX: mx, startY: my, startWidth: activeItem.width, startHeight: activeItem.height, startXPos: activeItem.x, startYPos: activeItem.y });
    } else {
      setDragging({ itemKind: 'canvas-image', type: 'move', id: activeItem.id, offsetX: mx - activeItem.x, offsetY: my - activeItem.y });
    }
  };

  // ─── Global mouse move ───────────────────────────────────────────────────────
  const handleGlobalMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top)  * scaleY;

    if (dragging?.type === 'extra-rotate') {
      const angle = Math.atan2(my - dragging.cy, mx - dragging.cx);
      const newRotation = dragging.startRotation + (angle - dragging.startAngle) * (180 / Math.PI);
      setExtraTexts(prev => prev.map(t => t.id === dragging.id ? { ...t, rotation: newRotation } : t));
      return;
    }
    if (dragging?.type === 'extra' && draggingExtraIndex !== null) {
      setExtraTexts(prev => prev.map(t => t.id === dragging.id ? { ...t, x: mx - dragging.offsetX, y: my - dragging.offsetY } : t));
      return;
    }
    if (dragging?.itemKind === 'canvas-image' && dragging.type === 'move') {
      setImages(prev => prev.map(item => item.id === dragging.id ? { ...item, x: mx - dragging.offsetX, y: my - dragging.offsetY } : item));
      return;
    }
    if (dragging?.itemKind === 'canvas-image' && dragging.type === 'resize') {
      const { id, corner, startX, startY, startWidth, startHeight, startXPos, startYPos } = dragging;
      let dx = mx - startX, dy = my - startY;
      let newW = startWidth, newH = startHeight, newX = startXPos, newY = startYPos;
      const aspectRatio = startWidth / startHeight;
      if (corner.includes('e')) newW = Math.max(20, startWidth + dx);
      if (corner.includes('s')) newH = Math.max(20, startHeight + dy);
      if (corner.includes('w')) { newW = Math.max(20, startWidth - dx); newX = startXPos + startWidth - newW; }
      if (corner.includes('n')) { newH = Math.max(20, startHeight - dy); newY = startYPos + startHeight - newH; }
      if ((corner.includes('e') || corner.includes('w')) && !corner.includes('s') && !corner.includes('n')) {
        newH = newW / aspectRatio;
        if (corner.includes('n')) newY = startYPos + startHeight - newH;
      } else if ((corner.includes('s') || corner.includes('n')) && !corner.includes('e') && !corner.includes('w')) {
        newW = newH * aspectRatio;
        if (corner.includes('w')) newX = startXPos + startWidth - newW;
      }
      if (newW < 20) newW = 20;
      if (newH < 20) newH = 20;
      if (corner.includes('w')) newX = startXPos + startWidth - newW;
      if (corner.includes('n')) newY = startYPos + startHeight - newH;
      setImages(prev => prev.map(item => item.id === id ? { ...item, x: newX, y: newY, width: newW, height: newH } : item));
    }
  }, [dragging, draggingExtraIndex]);

  const handleGlobalMouseUp = useCallback(() => {
    setDragging(null);
    setDraggingExtraIndex(null);
  }, []);

  // Delete key
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (activeImageId) { setImages(prev => prev.filter(img => img.id !== activeImageId)); setActiveImageId(null); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeImageId]);

  // ─── DRAW (RAF estável) ───────────────────────────────────────────────────────
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

    // Imagens sobrepostas (todas visíveis — sem timeline no Free)
    images.forEach(item => {
      if (!item?.img) return;
      drawRoundedImage(ctx, item.img, item.x, item.y, item.width, item.height, item.radius ?? 18);
      if (activeImageId === item.id) {
        ctx.save();
        ctx.strokeStyle = 'rgba(248,250,252,0.9)';
        ctx.lineWidth = 2;
        drawRoundedRect(ctx, item.x, item.y, item.width, item.height, (item.radius ?? 18) + 2);
        ctx.stroke();
        ctx.restore();
        drawResizeHandles(ctx, item.x, item.y, item.width, item.height);
      }
    });

    // Textos extras
    extraTexts.forEach(txt => {
      const tColor  = txt.color      || extraTextColor;
      const tFont   = txt.fontFamily || extraTextFontFamily;
      const tSize   = txt.fontSize   || extraTextFontSize;
      const lines = txt.text.split('\n');
      const lineH = tSize * 1.25;
      const rot = (txt.rotation || 0) * Math.PI / 180;
      ctx.save();
      ctx.translate(txt.x, txt.y);
      ctx.rotate(rot);
      ctx.fillStyle   = tColor;
      ctx.font        = `bold ${tSize}px ${tFont}`;
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      const totalH = lines.length * lineH;
      lines.forEach((line, li) => {
        ctx.shadowBlur  = 10;
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
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
        ctx.fillStyle = 'rgba(0,191,255,0.9)'; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -hh); ctx.lineTo(0, -handleDist + 7);
        ctx.strokeStyle = 'rgba(0,191,255,0.6)'; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore();
    });

    // ── MARCA D'ÁGUA ── obrigatória no plano Free ────────────────────────────
    ctx.save();
    ctx.globalAlpha = 0.55;

    // Badge no canto inferior direito
    const badgeW = 110, badgeH = 22;
    const bx = canvas.width  - badgeW - 8;
    const by = canvas.height - badgeH - 8;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, 6);
    ctx.fill();

    ctx.font         = 'bold 11px DM Sans, Poppins, sans-serif';
    ctx.fillStyle    = '#00BFFF';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur   = 0;
    ctx.fillText('⚡ CanvasSync Free', bx + 8, by + 11);

    ctx.restore();
  }, [image, images, extraTexts, extraTextColor, extraTextFontFamily, extraTextFontSize,
      activeImageId, activeExtraTextId, drawRoundedImage, drawRoundedRect, drawResizeHandles]);

  // ─── RAF ref pattern (zero re-criação de loop) ───────────────────────────────
  const drawRef = useRef(draw);
  useEffect(() => { drawRef.current = draw; }, [draw]);

  useEffect(() => {
    let rafId;
    const loop = () => { if (drawRef.current) drawRef.current(); rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ─── Salvar imagem com marca d'água ─────────────────────────────────────────
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Deseleciona tudo antes de salvar para não incluir handles na imagem
    setActiveImageId(null);
    setActiveExtraTextId(null);
    const isPng = exportFormat === 'png';
    const dataUrl = isPng ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.92);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = isPng ? 'canvas-free.png' : 'canvas-free.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClearProject = () => {
    setImage(null); setImageSrc(null); setImages([]);
    setExtraTexts([]); setNewExtraInput('');
    setActiveImageId(null); setActiveExtraTextId(null);
    setFontSize(35); setTextColor('#ffffff'); setFontFamily('Poppins');
    setExtraTextColor('#ffffff'); setExtraTextFontFamily('Poppins'); setExtraTextFontSize(18);
    setExportFormat('png');
    try { localStorage.removeItem('gc_free_project'); } catch { void 0; }
  };

  // ─── Persistência local ──────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gc_free_project');
      if (!saved) return;
      const p = JSON.parse(saved);
      if (Array.isArray(p.images)) {
        setImages(p.images.map(item => {
          const img = new Image();
          const id = item.id || Date.now() + Math.random();
          img.onload = () => { const pl = buildImagePlacement(img); setImages(prev => prev.map(i => i.id === id ? { ...i, ...pl } : i)); };
          img.src = item.src;
          return { id, src: item.src, img, x: item.x ?? 40, y: item.y ?? 60, width: item.width ?? 180, height: item.height ?? 180, radius: item.radius ?? 18 };
        }));
      }
      if (Array.isArray(p.extraTexts)) setExtraTexts(p.extraTexts.slice(0, 1));
      if (p.fontSize)       setFontSize(p.fontSize);
      if (p.textColor)      setTextColor(p.textColor);
      if (p.fontFamily)     setFontFamily(p.fontFamily);
      if (p.imageSrc) { setImageSrc(p.imageSrc); const img = new Image(); img.onload = () => setImage(img); img.src = p.imageSrc; }
    } catch { void 0; }
  }, [buildImagePlacement]);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem('gc_free_project', JSON.stringify({
          images: images.map(({ id, src, x, y, width, height, radius }) => ({ id, src, x, y, width, height, radius })),
          extraTexts, fontSize, textColor, fontFamily, imageSrc,
        }));
      } catch { void 0; }
    }, 400);
    return () => clearTimeout(t);
  }, [images, extraTexts, fontSize, textColor, fontFamily, imageSrc]);

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw',
        background: '#080808', color: '#f0f0f0',
        fontFamily: "'DM Sans', 'Poppins', system-ui, sans-serif",
        overflow: 'hidden', position: 'fixed', top: 0, left: 0,
      }}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
    >
      <style>{`
        .free-scrollbar::-webkit-scrollbar { width: 8px; }
        .free-scrollbar::-webkit-scrollbar-track { background: #0a0a0a; border-radius: 10px; }
        .free-scrollbar::-webkit-scrollbar-thumb { background: #00BFFF; border-radius: 10px; border: 2px solid #0a0a0a; }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '12px 18px',
        background: 'rgba(8,8,8,0.97)', borderBottom: '1px solid rgba(0,191,255,0.12)',
        fontSize: '12px', alignItems: 'center', width: '100%', boxSizing: 'border-box',
        backdropFilter: 'blur(12px)', boxShadow: '0 1px 0 rgba(0,191,255,0.08)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#00BFFF,#0070ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>⚡</div>
          <span style={{ fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg,#fff 30%,#00BFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CanvasSync</span>
          <span style={{ background: 'rgba(0,191,255,0.1)', border: '1px solid rgba(0,191,255,0.25)', borderRadius: 999, padding: '2px 8px', fontSize: 10, color: '#00BFFF', fontWeight: 700, letterSpacing: 1 }}>FREE</span>
        </div>

        <LangToggle />

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

        {/* Fundo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 600, letterSpacing: '0.5px' }}>{t('ed_background')}</label>
          <input type="file" onChange={handleImageChange} accept="image/*" style={{ color: '#aaa', fontSize: '11px' }} />
        </div>

        {/* Imagens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 600, letterSpacing: '0.5px' }}>{t('ed_images')}</label>
          <input type="file" onChange={handleImagesChange} accept="image/*" multiple style={{ color: '#aaa', fontSize: '11px' }} />
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.07)' }} />

        {/* Formato de exportação — apenas PNG e JPG */}
        <select
          value={exportFormat}
          onChange={e => setExportFormat(e.target.value)}
          style={{ backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '7px 10px', fontSize: '12px' }}
        >
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>

        {/* Salvar */}
        <button
          onClick={handleSave}
          style={{ background: '#00BFFF', border: 'none', padding: '10px 18px', borderRadius: '18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', color: '#000', boxShadow: '0 6px 20px rgba(0,191,255,0.3)' }}
        >
          {t('ed_save')}
        </button>

        {/* Limpar */}
        <button
          onClick={handleClearProject}
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', padding: '10px 18px', borderRadius: '18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', color: '#f87171' }}
        >
          {t('ed_clear')}
        </button>

        {/* Banner upgrade */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.15)', borderRadius: 12, padding: '6px 14px' }}>
          <span style={{ fontSize: 11, color: '#888' }}>{t('ed_upgrade_msg')}</span>
          <button
            onClick={() => window.location.href = '/planos'}
            style={{ background: '#00BFFF', border: 'none', borderRadius: 999, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#000', cursor: 'pointer' }}
          >
            {t('ed_upgrade_pro')}
          </button>
        </div>
      </div>

      {/* ══ BODY ════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>

        {/* ── PAINEL ESQUERDO ──────────────────────────────────────────────── */}
        <div className="free-scrollbar" style={{
          width: '360px', minWidth: '360px',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          background: '#0d0d0d', overflowY: 'auto',
        }}>

          {/* TEXTO EXTRA — limite de 1 */}
          <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.6px' }}>{t('ed_extra_text')}</label>
                <span style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', borderRadius: 999, padding: '2px 8px', fontSize: 10, color: '#00BFFF' }}>
                  {extraTexts.length}/1
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="color"
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.color || extraTextColor) : extraTextColor}
                  onChange={e => {
                    setExtraTextColor(e.target.value);
                    if (activeExtraTextId) setExtraTexts(prev => prev.map(t => t.id===activeExtraTextId ? {...t, color: e.target.value} : t));
                  }}
                  style={{ width: 28, height: 28, padding: 0, border: '1px solid rgba(0,191,255,0.2)', background: '#111', borderRadius: 8, cursor: 'pointer' }} />
                <select
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontFamily || extraTextFontFamily) : extraTextFontFamily}
                  onChange={e => {
                    setExtraTextFontFamily(e.target.value);
                    if (activeExtraTextId) setExtraTexts(prev => prev.map(t => t.id===activeExtraTextId ? {...t, fontFamily: e.target.value} : t));
                  }}
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
                <span style={{ fontSize: 10, color: '#555' }}>
                  {activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize || extraTextFontSize) : extraTextFontSize}px
                </span>
                <input type="range" min="10" max="60"
                  value={activeExtraTextId ? (extraTexts.find(t=>t.id===activeExtraTextId)?.fontSize || extraTextFontSize) : extraTextFontSize}
                  onChange={e => {
                    const v = parseInt(e.target.value);
                    setExtraTextFontSize(v);
                    if (activeExtraTextId) setExtraTexts(prev => prev.map(t => t.id===activeExtraTextId ? {...t, fontSize: v} : t));
                  }}
                  style={{ width: 80, accentColor: '#00BFFF' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                placeholder={"Ex: Nome da Banda\nUse Enter para nova linha"}
                value={newExtraInput}
                onChange={e => setNewExtraInput(e.target.value)}
                rows={3}
                style={{ flex: 1, padding: '10px 12px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f0', borderRadius: 14, fontSize: 12, resize: 'none', lineHeight: 1.5, fontFamily: 'inherit' }}
              />
              <button
                onClick={addExtraText}
                disabled={extraTexts.length >= 1}
                style={{
                  padding: '0 16px', height: 56,
                  background: extraTexts.length >= 1 ? 'rgba(255,255,255,0.04)' : '#00BFFF',
                  border: extraTexts.length >= 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  borderRadius: 14, cursor: extraTexts.length >= 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold', color: extraTexts.length >= 1 ? '#333' : '#000',
                  boxShadow: extraTexts.length >= 1 ? 'none' : '0 4px 16px rgba(0,191,255,0.25)',
                  fontSize: 22, transition: 'all 0.2s',
                }}
              >+</button>
            </div>

            {extraTexts.length >= 1 && (
              <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ Limite do plano Free atingido.
                <button onClick={() => window.location.href = '/planos'}
                  style={{ background: 'none', border: 'none', color: '#00BFFF', cursor: 'pointer', fontWeight: 700, fontSize: 11, padding: 0 }}>
                  Upgrade para Pro →
                </button>
              </div>
            )}

            {extraTexts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {extraTexts.map(txt => (
                  <div key={txt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.15)', borderRadius: 10, padding: '8px 12px' }}>
                    <span style={{ flex: 1, fontSize: 12, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txt.text}</span>
                    <button onClick={() => removeExtraText(txt.id)}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>Arraste para mover • Círculo azul para girar • Botão direito para remover</span>
          </div>

          {/* IMAGENS NA COMPOSIÇÃO */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.6px' }}>
              {t('ed_images_in_comp')}
              <span style={{ marginLeft: 8, color: '#555', fontWeight: 400 }}>({images.length} adicionada{images.length !== 1 ? 's' : ''})</span>
            </label>
            {images.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {images.map((item, i) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: activeImageId === item.id ? 'rgba(0,191,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: activeImageId === item.id ? '1px solid rgba(0,191,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10, padding: '7px 10px', cursor: 'pointer',
                  }} onClick={() => setActiveImageId(item.id)}>
                    <img src={item.src} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                    <span style={{ flex: 1, fontSize: 11, color: '#888' }}>Imagem {i + 1}</span>
                    <button onClick={e => { e.stopPropagation(); setImages(prev => prev.filter(img => img.id !== item.id)); if (activeImageId === item.id) setActiveImageId(null); }}
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 8, padding: '3px 8px', fontSize: 11, cursor: 'pointer' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>Nenhuma imagem adicionada ainda</p>
            )}
          </div>

          {/* RECURSO BLOQUEADO — MÚSICA */}
          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: '11px', color: '#444', fontWeight: '700', letterSpacing: '0.6px' }}>{t('ed_lyric_sync')}</label>
            <div style={{
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14, padding: '20px 16px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              <div style={{ fontSize: 28, opacity: 0.3 }}>🎵</div>
              <p style={{ fontSize: 12, color: '#444', margin: 0, lineHeight: 1.6 }}>
                Adicionar música e sincronizar<br />letras é exclusivo do plano Pro.
              </p>
              <button
                onClick={() => window.location.href = '/planos'}
                style={{ background: '#00BFFF', border: 'none', borderRadius: 999, padding: '8px 20px', fontSize: 12, fontWeight: 700, color: '#000', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,191,255,0.25)' }}
              >
                Ver plano Pro
              </button>
            </div>
          </div>
        </div>

        {/* ── PREVIEW CENTRO ───────────────────────────────────────────────── */}
        <div
          ref={canvasContainerRef}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090909', position: 'relative' }}
        >
          <canvas
            ref={canvasRef}
            width={270}
            height={480}
            onMouseDown={handleCanvasMouseDown}
            onContextMenu={e => {
              e.preventDefault();
              const canvas = canvasRef.current;
              const rect = canvas.getBoundingClientRect();
              const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
              const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
              const ctx = canvas.getContext('2d');
              extraTexts.forEach(txt => {
                const rot = (txt.rotation || 0) * Math.PI / 180;
                const { halfW, halfH } = getExtraTextBounds(txt, ctx);
                const { lx, ly } = toLocalSpace(mx, my, txt.x, txt.y, rot);
                if (Math.abs(lx) <= halfW && Math.abs(ly) <= halfH) removeExtraText(txt.id);
              });
            }}
            style={{ border: '1px solid rgba(0,191,255,0.15)', borderRadius: 26, maxHeight: '90%', cursor: 'move', boxShadow: '0 24px 50px rgba(0,0,0,0.55)' }}
          />

          {/* Dica de marca d'água flutuante */}
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '6px 14px', fontSize: 11, color: '#555',
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>
{t('ed_watermark_msg')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppFree;
