import React, { createContext, useContext, useState } from 'react';

// ── Dicionário completo PT-BR / EN ────────────────────────────────────────────
const TRANSLATIONS = {
  'pt': {
    // Header — mídia
    ed_background:    'Fundo',
    ed_images:        'Imagens',
    ed_audio:         'Áudio',
    ed_videos:        'Vídeos',

    // Formatos de exportação
    fmt_webm:         'WEBM + Áudio',
    fmt_mp4:          'MP4 + Áudio',
    fmt_webm_hd:      'HD 1080p WEBM',
    fmt_mp4_hd:       'HD 1080p MP4',

    // Header — controles
    ed_canvas_label:  'CANVAS',
    ed_vol:           'Vol',
    ed_speed:         'Vel',
    ed_save:          '💾 Salvar Vídeo',
    ed_exporting:     'Exportando',
    ed_export_project:'📦 Exportar Projeto',
    ed_import_project:'📂 Importar Projeto',
    ed_clear_project: '🗑️ Limpar Tudo',

    // Templates
    tpl_subtitle:     'Escolha um template — fontes, cores, textos e layout aplicados automaticamente',
    tpl_use:          'Usar template',
    tpl_footer:       'O template não altera suas mídias (fundo, imagens, áudio, vídeos) nem as letras da música',
    tpl_count:        'templates',

    // Stickers
    ed_sfx:           'Efeitos',
    stk_hint:         'Clique para selecionar · arraste para mover · botão direito remove',
    stk_clear_all:    'Limpar todos',

    // Efeitos sonoros
    sfx_title:        'Efeitos Sonoros',
    sfx_hint:         'Clique p/ adicionar na posição atual',
    sfx_placed:       'COLOCADOS NO VÍDEO',
    sfx_remove_all:   'Remover todos',
    sfx_empty:        'Pausa o vídeo na posição desejada e clique em um efeito',

    // Imagem / Vídeo selecionado
    sel_image:        '🖼️ IMAGEM SELECIONADA',
    sel_video:        '🎬 VÍDEO SELECIONADO',
    ed_rotation:      'Rotação',
    ed_size:          'Tamanho',

    // Filtros
    ed_filters:       'FILTROS',
    ed_reset:         'Resetar',
    prs_original:     'Original',
    prs_bw:           'P&B',
    prs_sepia:        'Sépia',
    prs_cinema:       'Cinema',
    prs_neon:         'Neon',
    prs_vintage:      'Vintage',
    prs_cold:         'Frio',
    prs_warm:         'Quente',
    prs_fade:         'Fade',
    prs_dramatic:     'Dramático',
    flt_brightness:   'Brilho',
    flt_contrast:     'Contraste',
    flt_saturate:     'Saturação',
    flt_hue:          'Matiz',
    flt_blur:         'Desfoque',
    flt_sepia:        'Sépia',
    flt_bw:           'P&B',
    flt_opacity:      'Opacidade',

    // Transições
    ed_transitions:   'TRANSIÇÕES',
    tr_in:            'ENTRADA',
    tr_out:           'SAÍDA',
    tr_both:          'Ambos',
    ed_duration:      'Duração',
    tr_elastic:       'Elástico',

    // Textos extras
    ed_extra_texts:   '✏️ TEXTOS EXTRAS',
    ed_add_font:      'Fonte',
    ed_shadow:        'SOMBRA',
    ed_gradient:      'GRADIENTE',
    et_placeholder:   'Ex: Nome da Banda\nUse Enter para nova linha',
    et_hint:          'Arraste para mover • Círculo roxo para girar • Botão direito para remover',

    // Letra da música
    ed_lyrics_title:  'LETRA DA MÚSICA',
    ed_selected:      'selecionada',
    ed_animation:     'ANIMAÇÃO',
    anim_none:        'Nenhuma',
    ed_speed_anim:    'Vel.',
    ed_paste_lyrics:  'Cole a letra aqui, uma frase por linha...',
    ed_next_line:     'PRÓXIMA FRASE',
    ed_paste_lyrics_short: 'Cole a letra acima',
    ed_all_marked:    'Todas as frases marcadas!',
    ed_all_done:      '✓ Concluído',
    ed_mark_now:      '🎯 MARCAR',
    ed_lyrics_hint:   'Dê Play • clique MARCAR no ritmo para sincronizar. Na timeline: clique na marcação para selecionar no vídeo, duplo-clique no vídeo para editar o texto.',
    ed_add_font_ttf:  'Fonte TTF/OTF',

    // Canvas / Preview
    ed_fullscreen:    'Tela Cheia',
    ed_inline_hint:   'Enter = nova linha • Esc = fechar',
    ed_delete:        'Apagar',

    // Timeline
    ed_stop:          '⏹ Stop',
    ed_zoom:          'Zoom',

    // Vídeo na timeline
    vid_mute:         'Clique para mutar áudio',
    vid_unmute:       'Áudio mudo — clique para ativar',
  },

  'en': {
    // Header — mídia
    ed_background:    'Background',
    ed_images:        'Images',
    ed_audio:         'Audio',
    ed_videos:        'Videos',

    // Export formats
    fmt_webm:         'WEBM + Audio',
    fmt_mp4:          'MP4 + Audio',
    fmt_webm_hd:      'HD 1080p WEBM',
    fmt_mp4_hd:       'HD 1080p MP4',

    // Header — controls
    ed_canvas_label:  'CANVAS',
    ed_vol:           'Vol',
    ed_speed:         'Speed',
    ed_save:          '💾 Export Video',
    ed_exporting:     'Exporting',
    ed_export_project:'📦 Export Project',
    ed_import_project:'📂 Import Project',
    ed_clear_project: '🗑️ Clear All',

    // Templates
    tpl_subtitle:     'Choose a template — fonts, colors, texts and layout applied automatically',
    tpl_use:          'Use template',
    tpl_footer:       'The template does not change your media (background, images, audio, videos) or the song lyrics',
    tpl_count:        'templates',

    // Stickers
    ed_sfx:           'Effects',
    stk_hint:         'Click to select · drag to move · right-click to remove',
    stk_clear_all:    'Clear all',

    // Sound effects
    sfx_title:        'Sound Effects',
    sfx_hint:         'Click to add at current position',
    sfx_placed:       'PLACED IN VIDEO',
    sfx_remove_all:   'Remove all',
    sfx_empty:        'Pause the video at the desired position and click an effect',

    // Image / Video selected
    sel_image:        '🖼️ IMAGE SELECTED',
    sel_video:        '🎬 VIDEO SELECTED',
    ed_rotation:      'Rotation',
    ed_size:          'Size',

    // Filters
    ed_filters:       'FILTERS',
    ed_reset:         'Reset',
    prs_original:     'Original',
    prs_bw:           'B&W',
    prs_sepia:        'Sepia',
    prs_cinema:       'Cinema',
    prs_neon:         'Neon',
    prs_vintage:      'Vintage',
    prs_cold:         'Cold',
    prs_warm:         'Warm',
    prs_fade:         'Fade',
    prs_dramatic:     'Dramatic',
    flt_brightness:   'Brightness',
    flt_contrast:     'Contrast',
    flt_saturate:     'Saturation',
    flt_hue:          'Hue',
    flt_blur:         'Blur',
    flt_sepia:        'Sepia',
    flt_bw:           'B&W',
    flt_opacity:      'Opacity',

    // Transitions
    ed_transitions:   'TRANSITIONS',
    tr_in:            'ENTRY',
    tr_out:           'EXIT',
    tr_both:          'Both',
    ed_duration:      'Duration',
    tr_elastic:       'Elastic',

    // Extra texts
    ed_extra_texts:   '✏️ EXTRA TEXTS',
    ed_add_font:      'Font',
    ed_shadow:        'SHADOW',
    ed_gradient:      'GRADIENT',
    et_placeholder:   'e.g.: Band Name\nUse Enter for a new line',
    et_hint:          'Drag to move • Purple circle to rotate • Right-click to remove',

    // Lyrics
    ed_lyrics_title:  'SONG LYRICS',
    ed_selected:      'selected',
    ed_animation:     'ANIMATION',
    anim_none:        'None',
    ed_speed_anim:    'Speed',
    ed_paste_lyrics:  'Paste lyrics here, one phrase per line...',
    ed_next_line:     'NEXT LINE',
    ed_paste_lyrics_short: 'Paste lyrics above',
    ed_all_marked:    'All lines marked!',
    ed_all_done:      '✓ Done',
    ed_mark_now:      '🎯 MARK',
    ed_lyrics_hint:   'Press Play • click MARK on the beat to sync. On timeline: click to select, double-click to edit text.',
    ed_add_font_ttf:  'Font TTF/OTF',

    // Canvas / Preview
    ed_fullscreen:    'Fullscreen',
    ed_inline_hint:   'Enter = new line • Esc = close',
    ed_delete:        'Delete',

    // Timeline
    ed_stop:          '⏹ Stop',
    ed_zoom:          'Zoom',

    // Video in timeline
    vid_mute:         'Click to mute audio',
    vid_unmute:       'Audio muted — click to enable',
  },
};

// ── Context ───────────────────────────────────────────────────────────────────
const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('cs_lang') || 'pt'; } catch { return 'pt'; }
  });

  const toggleLang = () => {
    const next = lang === 'pt' ? 'en' : 'pt';
    setLang(next);
    try { localStorage.setItem('cs_lang', next); } catch {}
  };

  const t = (key) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['pt'];
    return dict[key] ?? TRANSLATIONS['pt'][key] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

// Alias para compatibilidade com main.jsx existente
export { LangProvider as LanguageProvider };

  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used inside LangProvider');
  return ctx;
}

// ── Botão de alternância de idioma ────────────────────────────────────────────
export function LangToggle({ style }) {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        padding: '5px 12px',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 700,
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        transition: 'background 0.15s',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
    >
      {lang === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
    </button>
  );
}
