import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './hooks/useAuth.jsx';
import { useLanguage, LangToggle } from './hooks/useLanguage.jsx';

function App() {
  const { user, isLoggedIn, isPro, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [image, setImage] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const [projectVolume, setProjectVolume] = useState(1);    // 0–1
  const [projectSpeed,  setProjectSpeed]  = useState(1);    // 0.25–4
  const projectVolumeRef = useRef(1);
  const projectSpeedRef  = useRef(1);
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
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [editingLyricId, setEditingLyricId] = useState(null);

  // ── UNDO / REDO ────────────────────────────────────────────────────────────
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&family=Montserrat:wght@700&family=Poppins:wght@700&family=Oswald:wght@700&family=Roboto+Condensed:wght@700&family=Raleway:wght@700&family=Playfair+Display:wght@700&family=Lora:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

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
    const canvas = canvasRef.current;
    return { width: canvas?.width || 270, height: canvas?.height || 480 };
  }, []);

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
        if (p.projectVolume !== undefined) setProjectVolume(p.projectVolume);
        if (p.projectSpeed  !== undefined) setProjectSpeed(p.projectSpeed);
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
    if (!audioRef.current) return;
    const lines = textLinesRef.current;
    setCurrentLineIndex(prev => {
      if (prev >= lines.length) return prev;
      const startTime = audioRef.current.currentTime;
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
    if (type === 'move' && lyric && audioRef.current) {
      const seekTo = lyric.start + 0.05;
      audioRef.current.currentTime = seekTo;
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
    if (item && audioRef.current) {
      const seekTo = item.start + (item.end - item.start) * 0.01;
      audioRef.current.currentTime = seekTo;
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
    if (item && audioRef.current) {
      const seekTo = item.start + 0.05;
      audioRef.current.currentTime = seekTo;
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

    // ── Vídeos verificados PRIMEIRO (permitem seleção mesmo sob imagens) ────
    const s = 14;
    const clickedVideo = videos.slice().reverse().find(v => {
      if (!v.videoEl) return false;
      return time >= v.start && time <= v.end &&
        mouseX >= v.x - s && mouseX <= v.x + v.width + s &&
        mouseY >= v.y - s && mouseY <= v.y + v.height + s;
    });
    if (clickedVideo) {
      setActiveVideoId(clickedVideo.id);
      setActiveImageId(null);
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

    // ── Imagens (verificadas após vídeos) ────────────────────────────────────
    const clickedItem = images.slice().reverse().find((item) => {
      if (!item || !item.img) return false;
      return time >= item.start && time <= item.end &&
        mouseX >= item.x - hs && mouseX <= item.x + item.width + hs &&
        mouseY >= item.y - hs && mouseY <= item.y + item.height + hs;
    });
    if (clickedItem) {
      setActiveImageId(clickedItem.id);
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
    if (!duration) return [];
    const minPxGap = 80;
    const niceIntervals = [1, 2, 5, 10, 15, 30, 60, 120, 300];
    const rawGap = minPxGap / zoom;
    const interval = niceIntervals.find(i => i >= rawGap) || 300;
    const markers = [];
    for (let t = 0; t <= duration; t += interval) {
      markers.push(t);
    }
    return markers;
  }, [duration, zoom]);

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
    // Não agenda mais RAF aqui — o loop unificado abaixo cuida disso
  }, [activeImageId, activeVideoId, activeExtraTextId, activeLyricId, editingLyricId, drawRotatedElement, drawRoundedImage, drawRoundedRect, drawResizeHandles, extraTextColor, extraTextFontFamily, extraTextFontSize, extraTexts, fontFamily, fontSize, getImagesForTime, getVideosForTime, image, lyrics, textColor, wrapLyricText, videos, shadowEnabled, shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY, gradientEnabled, gradientColor1, gradientColor2]);


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

  // Mantém refs sempre atualizados + aplica imediatamente no elemento <audio>
  useEffect(() => {
    projectVolumeRef.current = projectVolume;
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, projectVolume));
  }, [projectVolume]);

  useEffect(() => {
    projectSpeedRef.current = projectSpeed;
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
          aEncoder.configure({ codec: 'opus', sampleRate: 48000, numberOfChannels: 2, bitrate: 128000 });
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
          // Decodifica → aplica velocidade + volume via OfflineAudioContext+GainNode
          const tmpAc1 = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 48000 });
          const rawBuf1 = await tmpAc1.decodeAudioData(audioBufferData);
          tmpAc1.close();
          const outSamp1 = Math.floor(48000 * outputDuration1);
          const offAc1 = new OfflineAudioContext(2, outSamp1, 48000);
          const bsrc1 = offAc1.createBufferSource();
          bsrc1.buffer = rawBuf1;
          bsrc1.playbackRate.value = _spd1;
          const gnd1 = offAc1.createGain();
          gnd1.gain.value = _vol1;
          bsrc1.connect(gnd1); gnd1.connect(offAc1.destination);
          bsrc1.start(0);
          const procBuf1 = await offAc1.startRendering();
          const pc0_1 = procBuf1.getChannelData(0);
          const pc1_1 = procBuf1.numberOfChannels > 1 ? procBuf1.getChannelData(1) : pc0_1;
          const block = 1200;
          for (let pos = 0; pos < outSamp1; pos += block) {
            const len = Math.min(block, outSamp1 - pos);
            const interleaved = new Float32Array(len * 2);
            for (let i = 0; i < len; i++) {
              interleaved[i * 2]     = pc0_1[pos + i] || 0;
              interleaved[i * 2 + 1] = pc1_1[pos + i] || 0;
            }
            const audioDataObj = new AudioData({
              format: 'f32', sampleRate: 48000, numberOfChannels: 2,
              numberOfFrames: len,
              timestamp: Math.round((pos / 48000) * 1_000_000),
              data: interleaved.buffer
            });
            aEncoder.encode(audioDataObj);
            audioDataObj.close();
          }
          await aEncoder.flush();
        } catch {
          aEncoder = null;
        }
      }
      for (let i = 0; i < totalFrames; i++) {
        const t = i / fps * _spd1;
        await renderAtTimeToCanvas(offCanvas, t);
        const bitmap = await createImageBitmap(offCanvas);
        const videoFrame = new VideoFrame(bitmap, { timestamp: Math.round((t) * 1_000_000) });
        vEncoder.encode(videoFrame);
        videoFrame.close();
        bitmap.close();
        setExportProgress((i + 1) / totalFrames);
        await new Promise(r => setTimeout(r, 0));
      }
      await vEncoder.flush();
      muxer.finalize();
      const blob = new Blob([target.buffer], { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'canvas.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projeto.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        if (p.projectVolume !== undefined) setProjectVolume(p.projectVolume);
        if (p.projectSpeed  !== undefined) setProjectSpeed(p.projectSpeed);
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
          const _ac = new OfflineAudioContext(2, Math.ceil(effectiveDuration * 44100), 44100);
          const _rawSD = await _ac.decodeAudioData(_buf);
          // Aplica velocidade + volume via OfflineAudioContext+GainNode
          const _outSampSDtmp = Math.floor(44100 * outputDuration2);
          const _offSD = new OfflineAudioContext(2, _outSampSDtmp, 44100);
          const _bsrcSD = _offSD.createBufferSource();
          _bsrcSD.buffer = _rawSD; _bsrcSD.playbackRate.value = _spd2;
          const _gndSD = _offSD.createGain(); _gndSD.gain.value = _vol2;
          _bsrcSD.connect(_gndSD); _gndSD.connect(_offSD.destination);
          _bsrcSD.start(0);
          _abSD = await _offSD.startRendering();
        } catch(_e) { console.warn('Audio decode SD:', _e); }
      }
      const _nChSD = _abSD ? Math.min(_abSD.numberOfChannels, 2) : 2;
      const _outSampSD = _abSD ? _abSD.length : Math.floor(44100 * outputDuration2);
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({ target, video: { codec: 'avc', width: W, height: H },
        audio: _abSD ? { codec: 'aac', sampleRate: 44100, numberOfChannels: _nChSD } : undefined,
        fastStart: 'in-memory' });
      const venc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: console.error });
      venc.configure({ codec: 'avc1.42001f', width: W, height: H, bitrate: 4_000_000, framerate: FPS });
      const offCanvas = new OffscreenCanvas(W, H);
      for (let fi = 0; fi < TOTAL; fi++) {
        const t = fi / FPS * _spd2;
        await renderAtTimeToCanvas(offCanvas, t);
        const frame = new VideoFrame(offCanvas, { timestamp: Math.round(fi * 1_000_000 / FPS), duration: Math.round(1_000_000 / FPS) });
        venc.encode(frame, { keyFrame: fi % 60 === 0 });
        frame.close();
        setExportProgress(fi / TOTAL * (_abSD ? 0.85 : 1));
      }
      await venc.flush();
      if (_abSD) {
        try {
          const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: console.error });
          aenc.configure({ codec: 'mp4a.40.2', sampleRate: 44100, numberOfChannels: _nChSD, bitrate: 128000 });
          const CHUNK = 4096;
          for (let i = 0; i < _outSampSD; i += CHUNK) {
            const len = Math.min(CHUNK, _outSampSD - i);
            const planar = new Float32Array(len * _nChSD);
            for (let c = 0; c < _nChSD; c++) {
              const ch = _abSD.getChannelData(c);
              for (let s = 0; s < len; s++) planar[c * len + s] = ch[i + s] || 0;
            }
            const aframe = new AudioData({ format: 'f32-planar', sampleRate: 44100, numberOfFrames: len,
              numberOfChannels: _nChSD, timestamp: Math.round(i / 44100 * 1_000_000), data: planar });
            aenc.encode(aframe); aframe.close();
          }
          await aenc.flush();
        } catch(e) { console.warn('Audio MP4 encode failed:', e); }
      }
      muxer.finalize();
      setExportProgress(1);
      const blob = new Blob([target.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'canvas.mp4';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
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
          const _ac = new OfflineAudioContext(2, Math.ceil(effectiveDuration * 44100), 44100);
          const _rawHD = await _ac.decodeAudioData(_buf);
          const _outSampHDtmp = Math.floor(44100 * outputDuration3);
          const _offHD = new OfflineAudioContext(2, _outSampHDtmp, 44100);
          const _bsrcHD = _offHD.createBufferSource();
          _bsrcHD.buffer = _rawHD; _bsrcHD.playbackRate.value = _spd3;
          const _gndHD = _offHD.createGain(); _gndHD.gain.value = _vol3;
          _bsrcHD.connect(_gndHD); _gndHD.connect(_offHD.destination);
          _bsrcHD.start(0);
          _abHD = await _offHD.startRendering();
        } catch(_e) { console.warn('Audio decode HD:', _e); }
      }
      const _nChHD = _abHD ? Math.min(_abHD.numberOfChannels, 2) : 2;
      const _outSampHD = _abHD ? _abHD.length : Math.floor(44100 * outputDuration3);
      const target = new ArrayBufferTarget();
      const muxer = new Muxer({ target, video: { codec: 'avc', width: W, height: H },
        audio: _abHD ? { codec: 'aac', sampleRate: 44100, numberOfChannels: _nChHD } : undefined,
        fastStart: 'in-memory' });
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
        setExportProgress(fi / TOTAL * (_abHD ? 0.85 : 1));
      }
      await venc.flush();
      if (_abHD) {
        try {
          const aenc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: console.error });
          aenc.configure({ codec: 'mp4a.40.2', sampleRate: 44100, numberOfChannels: _nChHD, bitrate: 128000 });
          const CHUNK = 4096;
          for (let i = 0; i < _outSampHD; i += CHUNK) {
            const len = Math.min(CHUNK, _outSampHD - i);
            const planar = new Float32Array(len * _nChHD);
            for (let c = 0; c < _nChHD; c++) {
              const ch = _abHD.getChannelData(c);
              for (let s = 0; s < len; s++) planar[c * len + s] = ch[i + s] || 0;
            }
            const aframe = new AudioData({ format: 'f32-planar', sampleRate: 44100, numberOfFrames: len,
              numberOfChannels: _nChHD, timestamp: Math.round(i / 44100 * 1_000_000), data: planar });
            aenc.encode(aframe); aframe.close();
          }
          await aenc.flush();
        } catch(e) { console.warn('Audio HD MP4 encode failed:', e); }
      }
      muxer.finalize();
      setExportProgress(1);
      const blob = new Blob([target.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'canvas_hd_1080.mp4';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
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
          // Decodifica → aplica velocidade + volume via OfflineAudioContext+GainNode
          ac.close();
          const outSamp4 = Math.floor(48000 * outputDuration4);
          const offAc4 = new OfflineAudioContext(2, outSamp4, 48000);
          const bsrc4 = offAc4.createBufferSource();
          bsrc4.buffer = buffer;
          bsrc4.playbackRate.value = _spd4;
          const gnd4 = offAc4.createGain();
          gnd4.gain.value = _vol4;
          bsrc4.connect(gnd4); gnd4.connect(offAc4.destination);
          bsrc4.start(0);
          const procBuf4 = await offAc4.startRendering();
          const pc0_4 = procBuf4.getChannelData(0);
          const pc1_4 = procBuf4.numberOfChannels > 1 ? procBuf4.getChannelData(1) : pc0_4;
          const block4 = 1200;
          for (let pos = 0; pos < outSamp4; pos += block4) {
            const len = Math.min(block4, outSamp4 - pos);
            const interleaved = new Float32Array(len * 2);
            for (let i = 0; i < len; i++) {
              interleaved[i * 2]     = pc0_4[pos + i] || 0;
              interleaved[i * 2 + 1] = pc1_4[pos + i] || 0;
            }
            const audioDataObj = new AudioData({
              format: 'f32', sampleRate: 48000, numberOfChannels: 2,
              numberOfFrames: len,
              timestamp: Math.round((pos / 48000) * 1_000_000),
              data: interleaved.buffer,
            });
            aEncoder.encode(audioDataObj);
            audioDataObj.close();
          }
          await aEncoder.flush();
        } catch { aEncoder = null; }
      }

      // Frames HD
      for (let i = 0; i < totalFrames; i++) {
        const t = i / fps * _spd4;
        await renderAtTimeToCanvas(offCanvas, t, SCALE);
        const bitmap     = await createImageBitmap(offCanvas);
        const videoFrame = new VideoFrame(bitmap, { timestamp: Math.round(t * 1_000_000) });
        vEncoder.encode(videoFrame);
        videoFrame.close();
        bitmap.close();
        setExportProgress((i + 1) / totalFrames);
        await new Promise(r => setTimeout(r, 0));
      }

      await vEncoder.flush();
      muxer.finalize();

      const blob = new Blob([target.buffer], { type: 'video/webm' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'canvas_hd_1080.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleSave = () => {
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
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = isPng ? 'canvas.png' : 'canvas.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <label style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600, letterSpacing: '0.5px' }}>🎬 Vídeos</label>
            <input ref={videoInputRef} type="file" onChange={handleVideoUpload} accept="video/*" multiple style={{ color: '#aaa', fontSize: '11px' }} />
          </div>
          <input ref={fontInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" style={{ display: 'none' }} onChange={handleFontUpload} />
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} style={{ backgroundColor: '#111', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '7px 10px', fontSize: '12px' }}>
            <option value="webm_offline_audio">🎬 WEBM + Áudio</option>
            <option value="mp4">🎬 MP4 + Áudio</option>
            <option value="webm_hd">✨ HD 1080p WEBM</option>
            <option value="mp4_hd">✨ HD 1080p MP4</option>
            <option value="png">🖼️ PNG</option>
            <option value="jpg">🖼️ JPG</option>
          </select>
          <button onClick={handleSave} disabled={isExporting} style={{ background: isExporting ? '#0a1a1a' : '#00BFFF', border: 'none', padding: '10px 18px', borderRadius: '18px', cursor: isExporting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '12px', color: isExporting ? '#555' : '#000', boxShadow: isExporting ? 'none' : '0 6px 20px rgba(0,191,255,0.3)', opacity: 1 }}>
            {isExporting ? `${t('ed_exporting')} ${Math.round(exportProgress * 100)}%` : t('ed_save')}
          </button>
          <LangToggle style={{ marginLeft: 'auto' }} />
        </div>
        {/* Linha 2: exportar projeto · importar projeto · limpar projeto */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
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
              {projectVolume === 0 ? '🔇' : projectVolume < 0.5 ? '🔉' : '🔊'} Vol
            </span>
            <input type="range" min={0} max={1} step={0.01} value={projectVolume}
              onChange={e => setProjectVolume(+e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              onPointerDown={e => e.stopPropagation()}
              style={{ width: 90, accentColor: '#00BFFF' }} />
            <span style={{ fontSize: 10, color: projectVolume !== 1 ? '#00BFFF' : '#555', minWidth: 30, fontWeight: 700 }}>{Math.round(projectVolume * 100)}%</span>
          </div>

          {/* Velocidade do projeto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#00BFFF', fontWeight: 700, whiteSpace: 'nowrap' }}>⚡ Vel</span>
            <input type="range" min={0.25} max={4} step={0.05} value={projectSpeed}
              onChange={e => setProjectSpeed(+e.target.value)}
              onMouseDown={e => e.stopPropagation()}
              onPointerDown={e => e.stopPropagation()}
              style={{ width: 90, accentColor: '#00BFFF' }} />
            <span style={{ fontSize: 10, color: projectSpeed !== 1 ? '#00BFFF' : '#555', minWidth: 28, fontWeight: 700 }}>{projectSpeed}×</span>
          </div>
        </div>
      </div>

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
                    {isVid ? '🎬 VÍDEO SELECIONADO' : '🖼️ IMAGEM SELECIONADA'}
                  </label>
                  <button onClick={() => { if (isVid) setActiveVideoId(null); else setActiveImageId(null); }}
                    style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14 }}>✕</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#888', minWidth: 52 }}>Rotação</span>
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
                    { label: 'Original', f: {} },
                    { label: 'P&B',      f: { grayscale: 100 } },
                    { label: 'Sépia',    f: { sepia: 80 } },
                    { label: 'Cinema',   f: { contrast: 115, saturate: 80, brightness: 95 } },
                    { label: 'Neon',     f: { saturate: 200, brightness: 110, contrast: 120 } },
                    { label: 'Vintage',  f: { sepia: 40, contrast: 90, brightness: 105, saturate: 80 } },
                    { label: 'Frio',     f: { hueRotate: 190, saturate: 120 } },
                    { label: 'Quente',   f: { hueRotate: 340, saturate: 130, brightness: 105 } },
                    { label: 'Fade',     f: { brightness: 130, saturate: 60, contrast: 85 } },
                    { label: 'Dramático',f: { contrast: 150, saturate: 50, brightness: 90 } },
                  ];
                  const SLIDERS = [
                    { key: 'brightness', label: 'Brilho',    min: 0,   max: 200, def: 100, unit: '%' },
                    { key: 'contrast',   label: 'Contraste', min: 0,   max: 200, def: 100, unit: '%' },
                    { key: 'saturate',   label: 'Saturação', min: 0,   max: 300, def: 100, unit: '%' },
                    { key: 'hueRotate',  label: 'Matiz',     min: 0,   max: 360, def: 0,   unit: '°' },
                    { key: 'blur',       label: 'Desfoque',  min: 0,   max: 20,  def: 0,   unit: 'px' },
                    { key: 'sepia',      label: 'Sépia',     min: 0,   max: 100, def: 0,   unit: '%' },
                    { key: 'grayscale',  label: 'P&B',       min: 0,   max: 100, def: 0,   unit: '%' },
                    { key: 'opacity',    label: 'Opacidade', min: 0,   max: 100, def: 100, unit: '%' },
                  ];
                  const isPreset = (pf) => JSON.stringify(flt) === JSON.stringify(pf);
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: `${accentBg}0.04)`, border: `1px solid ${accentBg}0.18)`, borderRadius: 12, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: accent, fontWeight: 700, letterSpacing: '0.5px' }}>🎨 FILTROS</span>
                        <button onClick={resetF} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 8px', fontSize: 10, color: '#666', cursor: 'pointer' }}>Resetar</button>
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
                    { value: 'elastic',     label: 'Elástico' },
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
                      <span style={{ fontSize: 10, color: '#444', minWidth: 54 }}>Duração</span>
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
                      <span style={{ fontSize: 11, color: accent, fontWeight: 700, letterSpacing: '0.5px' }}>✨ TRANSIÇÕES</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>▶ ENTRADA</span>
                          {trIn !== 'none' && <button onClick={() => upd({ transitionIn: 'none' })} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>}
                        </div>
                        <TrGrid current={trIn} onSelect={v => upd({ transitionIn: v })} />
                        {trIn !== 'none' && <DurSlider value={durIn} onChange={v => upd({ transitionInDur: v })} />}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, color: accent, fontWeight: 700 }}>◀ SAÍDA</span>
                          {trOut !== 'none' && <button onClick={() => upd({ transitionOut: 'none' })} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 11, padding: 0, lineHeight: 1 }}>✕</button>}
                        </div>
                        <TrGrid current={trOut} onSelect={v => upd({ transitionOut: v })} />
                        {trOut !== 'none' && <DurSlider value={durOut} onChange={v => upd({ transitionOutDur: v })} />}
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: '#444' }}>Ambos:</span>
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
                <button onClick={() => fontInputRef.current?.click()} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', padding: '3px 9px', fontSize: '10px', color: '#f59e0b', cursor: 'pointer' }}>+ Fonte</button>
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
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>SOMBRA</span>
                    <input type="checkbox" checked={sel.shadowEnabled ?? true} onChange={e => setP('shadowEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {(sel.shadowEnabled ?? true) && <>
                      <input type="color" value={(sel.shadowColor || '#000000').replace(/rgba?\([^)]+\)/, '#000000')} onChange={e => setP('shadowColor', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} />
                      <input type="range" min="0" max="30" value={sel.shadowBlur ?? 10} onChange={e => setP('shadowBlur', +e.target.value)} style={{ width: '60px', accentColor: '#00BFFF' }} />
                    </>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>GRADIENTE</span>
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
                placeholder={"Ex: Nome da Banda\nUse Enter para nova linha"}
                value={newExtraInput}
                onChange={(e) => setNewExtraInput(e.target.value)}
                rows={3}
                style={{ flex: 1, padding: '10px 12px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#f0f0f0', borderRadius: '14px', fontSize: '12px', resize: 'none', lineHeight: '1.5', fontFamily: 'inherit' }}
              />
              <button onClick={addExtraText} style={{ padding: '0 16px', height: '56px', background: '#00BFFF', border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', color: '#000', boxShadow: '0 4px 16px rgba(0,191,255,0.25)', fontSize: '22px' }}>+</button>
            </div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginTop: '-4px' }}>Arraste para mover • Círculo roxo para girar • Botão direito para remover</span>
          </div>

          {/* ══ SEÇÃO LETRA DA MÚSICA ══ */}
          <div style={{ flex: 1, padding: '14px 18px 14px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: 0 }}>
            
            {/* Linha config letra — por lyric selecionada ou padrão global */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '11px', color: '#00BFFF', fontWeight: '700', letterSpacing: '0.5px' }}>
                LETRA DA MÚSICA
                {activeLyricId && <span style={{ marginLeft: 6, color: 'rgba(0,191,255,0.6)', fontWeight: 400, fontSize: 10 }}>(selecionada)</span>}
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
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>SOMBRA</span>
                    <input type="checkbox" checked={uiShOn} onChange={e => applyLP('shadowEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {uiShOn && <>
                      <input type="color" value={uiShCol.startsWith('rgba') ? '#000000' : uiShCol} onChange={e => applyLP('shadowColor', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} title="Cor da sombra" />
                      <input type="range" min="0" max="30" value={uiShBlur} onChange={e => applyLP('shadowBlur', +e.target.value)} style={{ width: '60px', accentColor: '#00BFFF' }} title="Intensidade" />
                    </>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>GRADIENTE</span>
                    <input type="checkbox" checked={uiGrOn} onChange={e => applyLP('gradientEnabled', e.target.checked)} style={{ accentColor: '#00BFFF' }} />
                    {uiGrOn && <>
                      <input type="color" value={uiGr1} onChange={e => applyLP('gradientColor1', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} title="Cor 1" />
                      <input type="color" value={uiGr2} onChange={e => applyLP('gradientColor2', e.target.value)} style={{ width: '22px', height: '22px', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} title="Cor 2" />
                    </>}
                  </div>
                  <button onClick={() => fontInputRef.current?.click()} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', padding: '3px 9px', fontSize: '10px', color: '#f59e0b', cursor: 'pointer' }}>+ Fonte TTF/OTF</button>
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
                  <span style={{ fontSize:'10px', color:'#a78bfa', fontWeight:700, marginRight:2 }}>ANIMAÇÃO</span>
                  {[['none','Nenhuma'],['fade','Fade'],['slide','Slide'],['typewriter','Typewriter']].map(([v, label]) => (
                    <button key={v} onClick={() => setAnim(v)} style={{
                      padding:'3px 10px', fontSize:'10px', borderRadius:'8px', cursor:'pointer', fontWeight:600,
                      background: curAnim === v ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${curAnim === v ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.1)'}`,
                      color: curAnim === v ? '#c4b5fd' : '#666',
                    }}>{label}</button>
                  ))}
                  {curAnim === 'typewriter' && (
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', marginLeft:4 }}>
                      <span style={{ fontSize:'10px', color:'#64748b' }}>Vel.</span>
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
              Dê Play • clique MARCAR no ritmo para sincronizar. Na timeline: clique na marcação para selecionar no vídeo, duplo-clique no vídeo para editar o texto.
            </span>
          </div>
        </div>

        {/* PREVIEW CENTRO */}
        <div ref={canvasContainerRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #141b34 0%, #0b1024 100%)', position: 'relative' }}>
          <canvas 
            ref={canvasRef} 
            width={270} 
            height={480} 
            onMouseDown={handleCanvasMouseDown}
            onContextMenu={(e) => {
              e.preventDefault();
              const canvas = canvasRef.current;
              const rect = canvas.getBoundingClientRect();
              const scaleX = canvas.width / rect.width;
              const scaleY = canvas.height / rect.height;
              const mouseX = (e.clientX - rect.left) * scaleX;
              const mouseY = (e.clientY - rect.top) * scaleY;
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
            style={{ border: '1px solid rgba(0,191,255,0.15)', borderRadius: '26px', maxHeight: '90%', cursor: 'move', boxShadow: '0 24px 50px rgba(10, 12, 24, 0.55)' }} 
          />

          {/* OVERLAY DE EDIÇÃO DE LYRIC */}
          {editingLyricId && (() => {
            const canvas = canvasRef.current;
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
                  >✕ Apagar</button>
                </div>
                <span style={{ fontSize: '10px', color: 'rgba(0,191,255,0.5)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>Enter = nova linha • Esc = fechar</span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* TIMELINE INFERIOR */}
      <div style={{ 
        height: '280px', 
        background: '#080808', 
        borderTop: '1px solid rgba(255,255,255,0.07)', 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        
        {/* CONTROLES E ZOOM */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.07)', width: '100%', boxSizing: 'border-box' }}>
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
                    virtualTimeRef.current = startVirt + elapsed;
                    setCurrentTime(startVirt + elapsed);
                  }, 30);
                }
                setIsPlaying(true);
              }
            }} style={{ background: isPlaying ? '#00BFFF' : 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,191,255,0.25)', padding: '9px 22px', borderRadius: '18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', color: isPlaying ? '#000' : '#f0f0f0', boxShadow: isPlaying ? '0 8px 20px rgba(0,191,255,0.3)' : 'none' }}>
              {isPlaying ? t('ed_pause') : t('ed_play')}
            </button>
            <button onClick={handleStopPlayback} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '9px 22px', borderRadius: '18px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', color: '#f87171', boxShadow: 'none' }}>
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
          <div id="track-bg" style={{ position: 'relative', height: '200px', width: timelineWidth + 'px', background: '#0d0d0d', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)', overflow: 'hidden' }}>

            {/* RÉGUA DE TEMPO */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: audioPxWidth + 'px', height: '18px', pointerEvents: 'none', zIndex: 5 }}>
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
              style={{ position: 'absolute', top: '162px', left: 0, opacity: 0.65, pointerEvents: 'none' }}
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

            <div style={{ position: 'absolute', top: '54px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '104px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '148px', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }} />
            {/* Labels das faixas */}
            <div style={{ position: 'absolute', right: 6, top: 20, fontSize: 9, color: 'rgba(0,191,255,0.4)', pointerEvents: 'none' }}>LETRA</div>
            <div style={{ position: 'absolute', right: 6, top: 72, fontSize: 9, color: 'rgba(251,191,36,0.4)', pointerEvents: 'none' }}>IMG</div>
            <div style={{ position: 'absolute', right: 6, top: 116, fontSize: 9, color: 'rgba(167,139,250,0.4)', pointerEvents: 'none' }}>VID</div>
            
            {lyrics.map((l) => (
              <div 
                key={l.id}
                onMouseDown={(e) => handleTimelineMouseDown(l.id, 'move', e)}
                onContextMenu={(e) => { e.preventDefault(); removeLyric(l.id); }}
                style={{
                  position: 'absolute',
                  left: l.start * zoom + 'px',
                  width: (l.end - l.start) * zoom + 'px',
                  height: '40px',
                  top: '12px',
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
                  height: '34px',
                  top: '108px',
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
                  title={v.muted ? 'Áudio mudo — clique para ativar' : 'Clique para mutar áudio'}
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
                  height: '36px',
                  top: '64px',
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

    </div>
  );
}

export default App;
