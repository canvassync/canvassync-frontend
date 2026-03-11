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
    ed_play:          '▶ Play',
    ed_pause:         '⏸ Pause',
    vid_mute:         'Clique para mutar áudio',
    vid_unmute:       'Áudio mudo — clique para ativar',

    // ── Plano Free (exclusivos) ──────────────────────────────────────────────
    free_save:          '💾 Salvar Imagem',
    free_upgrade_msg:   '🚀 Desbloqueie vídeos, música e muito mais',
    free_upgrade_btn:   'Ver Pro',
    free_upgrade_link:  'Upgrade para Pro',
    free_text_limit:    'Limite do plano Free atingido.',
    free_images_comp:   'Imagens na composição',
    free_image_label:   'Imagem',
    free_no_images:     'Nenhuma imagem adicionada ainda',
    free_lyric_sync:    'Sincronização de Letra',
    free_lyric_locked:  'Adicionar música e sincronizar letras é exclusivo do plano Pro.',
    free_see_pro:       'Ver plano Pro',
    free_watermark_msg: '⚡ Marca d\'água removida no plano Pro',
    free_close:         'Fechar',
    free_click_close:   'Clique fora para fechar',

    // ── Landing page — Navegação ─────────────────────────────────────────────
    nav_features:       'Funcionalidades',
    nav_plans:          'Planos',
    nav_signin:         'Entrar',
    nav_start:          'Começar grátis',

    // ── Landing page — Hero ──────────────────────────────────────────────────
    hero_badge:         'Editor de vídeo com letra sincronizada',
    hero_title1:        'Crie vídeos com',
    hero_title2:        'letra sincronizada',
    hero_title3:        'em minutos.',
    hero_sub:           'Suba sua música, cole a letra e sincronize no ritmo com um clique. Exporte em HD sem instalar nada.',
    hero_sub_bold:      'Exporte em HD sem instalar nada',
    hero_cta_primary:   'Criar vídeo grátis',
    hero_cta_demo:      'Ver demo',
    hero_trust:         'Sem cartão de crédito · Plano Free para sempre · Export imediato',

    // ── Landing page — Features ──────────────────────────────────────────────
    features_label:     'O que você pode fazer',
    features_title1:    'Tudo que você precisa',
    features_title2:    'em um só lugar.',
    features_sub:       'Do upload ao export em HD — sem plugins, sem instalação.',

    feat1_title:        'Sincronização de Letras',
    feat1_desc:         'Cole a letra, dê Play e marque cada frase no ritmo com um clique. Sincronização automática em tempo real.',

    feat2_title:        'Export em 4 Formatos',
    feat2_desc:         'WEBM SD/HD e MP4 SD/HD com áudio OLA pitch-preserving. Qualidade profissional direto no navegador.',

    feat3_title:        '24 Templates Prontos',
    feat3_desc:         'Templates profissionais para YouTube (16:9), Stories (9:16), Instagram (1:1) e Broadcast (4:3). Aplicados com um clique.',

    feat4_title:        '16 Transições Animadas',
    feat4_desc:         'Fade, Slide, Zoom, Bounce, Elástico, Roll e mais — com entrada e saída independentes por frase.',

    feat5_title:        '24 Efeitos Sonoros',
    feat5_desc:         'Aplausos, risadas, swoosh, alertas e muito mais. Sintetizados na hora, sem downloads externos.',

    feat6_title:        'Stickers, Emojis e Filtros',
    feat6_desc:         '120 emojis, 32 stickers animados e 10 filtros visuais (P&B, Neon, Cinema…) com sliders de ajuste fino.',

    // ── Landing page — Formatos de Canvas ────────────────────────────────────
    formats_label:      'Formatos de Canvas',
    formats_title1:     '4 formatos para',
    formats_title2:     'todas as plataformas.',
    formats_sub:        'Mude o formato a qualquer momento — seus conteúdos se adaptam automaticamente.',

    // ── Landing page — Testimonials ──────────────────────────────────────────
    testimonials_label: 'Depoimentos',
    testimonials_title1:'Criadores que',
    testimonials_title2:'adoram o CanvasSync.',

    test1_name:         'Lucas Ferreira',
    test1_role:         'Produtor Musical · São Paulo',
    test1_text:         'Consegui criar o lyric video do meu single em menos de 10 minutos. A sincronização ficou perfeita e o export em HD impressionou todo mundo.',

    test2_name:         'Ana Beatriz',
    test2_role:         'Cantora Independente · Belo Horizonte',
    test2_text:         'Os templates prontos são incríveis. Coloquei a música, escolhi o template Viral Reels e exportei para o Stories em minutos. Zero edição manual.',

    test3_name:         'Rafael Matos',
    test3_role:         'DJ & Compositor · Rio de Janeiro',
    test3_text:         'Uso o CanvasSync toda semana pra fazer lyric videos. Os efeitos sonoros e stickers animados dão um toque profissional que meu público adora.',

    // ── Landing page — Pricing ───────────────────────────────────────────────
    pricing_label:      'Planos',
    pricing_title1:     'Simples e',
    pricing_title2:     'transparente.',
    billing_monthly:    'Mensal',
    billing_annual:     'Anual',

    free_forever:       'Para sempre grátis',
    free_feat1:         'Editor de imagem estática (PNG/JPG)',
    free_feat2:         'Sincronização de letra (visualização)',
    free_feat3:         'Stickers e emojis básicos',
    free_feat4:         'Export de imagem PNG',
    free_feat5:         'Marca d\'água CanvasSync',
    free_cta:           'Começar grátis',

    pro_per_month:      '/mês',
    pro_per_year:       '/ano',
    pro_annual_note:    '≈ R$ 33,25/mês · economize R$ 79,80',
    pro_monthly_note:   'Cancele quando quiser',
    pro_feat1:          'Vídeo com áudio — MP4 e WEBM (SD + HD 1080p)',
    pro_feat2:          'Sem marca d\'água',
    pro_feat3:          '24 templates profissionais em 4 formatos',
    pro_feat4:          '16 transições animadas (entrada/saída)',
    pro_feat5:          '24 efeitos sonoros sintetizados',
    pro_feat6:          '120 emojis + 32 stickers animados',
    pro_feat7:          'Filtros CSS com 10 presets + sliders',
    pro_feat8:          'Sincronização de letra em tempo real',
    pro_cta:            'Assinar Pro',
    pro_cancel:         'Cancele quando quiser · sem fidelidade',

    // ── Landing page — CTA Final ─────────────────────────────────────────────
    cta_label:          'Comece agora',
    cta_title1:         'Seu próximo lyric video',
    cta_title2:         'começa aqui.',
    cta_sub:            'Crie, sincronize e exporte em HD — de graça.',
    cta_btn:            'Criar vídeo agora',

    // ── Landing page — Footer ────────────────────────────────────────────────
    footer_terms:       'Termos de Uso',
    footer_privacy:     'Privacidade',
    footer_support:     'Suporte',
    footer_contact:     'Contato',
    footer_rights:      'Todos os direitos reservados.',

    // ── Entrar / Registro — campos e tabs ────────────────────────────────────
    signin_tab:         'Entrar',
    register_tab:       'Criar conta',
    signin_title:       'Bem-vindo de volta',
    signin_sub:         'Entre na sua conta para continuar.',
    register_title:     'Crie sua conta grátis',
    register_sub:       'Sem cartão de crédito. Comece agora.',
    google_btn:         'Continuar com Google',
    or_divider:         'ou',
    name_label:         'Nome',
    name_placeholder:   'Seu nome completo',
    email_label:        'E-mail',
    email_placeholder:  'seu@email.com',
    password_label:     'Senha',
    pass_placeholder:   'Mínimo 6 caracteres',
    loading_btn:        'Carregando...',
    signin_btn:         'Entrar',
    register_btn:       'Criar conta',
    want_pro:           'Quer recursos Pro?',
    see_pro:            'Ver plano Pro',
    back_home:          '← Voltar ao início',
    terms_note:         'Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.',

    // ── Entrar — validações ──────────────────────────────────────────────────
    fill_fields:        'Preencha e-mail e senha.',
    fill_name:          'Preencha seu nome.',
    pass_min:           'A senha deve ter pelo menos 6 caracteres.',
    error_generic:      'Ocorreu um erro. Tente novamente.',

    // ── Registro.jsx — específicos ───────────────────────────────────────────
    free_badge:         '✨ Plano Free — sempre grátis',
    reg_title_register: 'Crie sua conta grátis',
    reg_title_login:    'Bem-vindo de volta',
    reg_sub_register:   'Comece a criar vídeos com letra sincronizada agora.',
    reg_sub_login:      'Entre para continuar criando seus vídeos.',
    reg_create_btn:     'Criar conta grátis',
    reg_login_btn:      'Entrar',
    free_includes:      'Incluído no plano free',
    reg_free1:          'Editor de imagem estática (PNG/JPG)',
    reg_free2:          'Stickers, emojis e filtros básicos',
    reg_free3:          'Textos extras com sombra e gradiente',
    reg_free4:          'Export de imagem PNG',

    // ── Checkout.jsx — específicos ───────────────────────────────────────────
    back_btn:           '← Voltar',
    checkout_title:     'Assine o plano Pro',
    checkout_sub:       'Desbloqueie todo o poder do CanvasSync.',
    period_label:       'Período',
    plan_monthly:       'Mensal',
    plan_monthly_sub:   'Renovação automática todo mês',
    plan_annual:        'Anual',
    plan_annual_sub:    'Melhor custo-benefício · economize R$ 79,80',
    included_label:     'Incluído no Pro',
    co_feat1:           'Vídeo com áudio — MP4 e WEBM (SD + HD 1080p)',
    co_feat2:           'Sem marca d\'água',
    co_feat3:           '24 templates + 16 transições animadas',
    co_feat4:           '24 efeitos sonoros + 120 emojis + 32 stickers',
    co_feat5:           'Sincronização de letra em tempo real',
    continue_btn:       'Continuar para pagamento →',
    continue_btn2:      'Criar conta e assinar →',
    secure_note:        '🔒 Pagamento 100% seguro via Stripe',
    back_to_start:      '← Voltar ao início',
    already_have:       'Já tenho conta',
    auth_create:        'Criar conta e continuar',
    auth_login:         'Entrar e continuar',
    payment_title:      'Finalizar assinatura',
    logged_as:          'Logado como',
    card_label:         'Cartão de crédito',
    card_sub:           'Visa, Mastercard, Elo e outros',
    redirecting:        'Redirecionando...',
    pay_card_btn:       'Pagar com cartão →',
    secure_note2:       '🔒 Redirecionado para o ambiente seguro do Stripe',

    // ── Sucesso.jsx — específicos ────────────────────────────────────────────
    verifying:          'Verificando seu pagamento...',
    pix_pending_title:  'Aguardando confirmação',
    pix_pending_sub:    'Seu pagamento PIX está sendo processado. Assim que confirmado, sua conta será atualizada automaticamente.',
    pix_tip:            'Dica: a confirmação do PIX pode levar até 30 minutos. Você receberá um e-mail assim que o plano Pro for ativado.',
    error_title:        'Algo deu errado',
    error_sub:          'Não conseguimos confirmar seu pagamento. Se o valor foi cobrado, entre em contato com o suporte.',
    welcome_pro:        '🎉 Bem-vindo ao Pro!',
    welcome_sub:        'Sua assinatura está ativa. Você agora tem acesso a todos os recursos profissionais do CanvasSync.',
    unlocked_label:     'Desbloqueado agora',
    unlock1:            'Exportação de vídeo MP4 e WEBM em HD 1080p',
    unlock2:            'Sem marca d\'água',
    unlock3:            '24 templates + 16 transições animadas',
    unlock4:            'Sincronização de letra em tempo real',
    unlock5:            '24 efeitos sonoros sintetizados',
    open_editor:        '🎬 Abrir o editor',
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
    ed_play:          '▶ Play',
    ed_pause:         '⏸ Pause',
    vid_mute:         'Click to mute audio',
    vid_unmute:       'Audio muted — click to enable',

    // ── Free plan (exclusive) ────────────────────────────────────────────────
    free_save:          '💾 Save Image',
    free_upgrade_msg:   '🚀 Unlock videos, music and much more',
    free_upgrade_btn:   'See Pro',
    free_upgrade_link:  'Upgrade to Pro',
    free_text_limit:    'Free plan limit reached.',
    free_images_comp:   'Images in composition',
    free_image_label:   'Image',
    free_no_images:     'No images added yet',
    free_lyric_sync:    'Lyric Sync',
    free_lyric_locked:  'Adding music and syncing lyrics is exclusive to the Pro plan.',
    free_see_pro:       'See Pro plan',
    free_watermark_msg: '⚡ Watermark removed on Pro plan',
    free_close:         'Close',
    free_click_close:   'Click outside to close',

    // ── Landing page — Navigation ────────────────────────────────────────────
    nav_features:       'Features',
    nav_plans:          'Plans',
    nav_signin:         'Sign in',
    nav_start:          'Start for free',

    // ── Landing page — Hero ──────────────────────────────────────────────────
    hero_badge:         'Video editor with synced lyrics',
    hero_title1:        'Create videos with',
    hero_title2:        'synced lyrics',
    hero_title3:        'in minutes.',
    hero_sub:           'Upload your music, paste the lyrics and sync them to the beat with a click. Export in HD with no installs.',
    hero_sub_bold:      'Export in HD with no installs',
    hero_cta_primary:   'Create free video',
    hero_cta_demo:      'Watch demo',
    hero_trust:         'No credit card · Free plan forever · Instant export',

    // ── Landing page — Features ──────────────────────────────────────────────
    features_label:     'What you can do',
    features_title1:    'Everything you need',
    features_title2:    'in one place.',
    features_sub:       'From upload to HD export — no plugins, no installation.',

    feat1_title:        'Lyric Sync',
    feat1_desc:         'Paste the lyrics, hit Play and mark each line on the beat with a click. Real-time automatic synchronization.',

    feat2_title:        'Export in 4 Formats',
    feat2_desc:         'WEBM SD/HD and MP4 SD/HD with OLA pitch-preserving audio. Professional quality straight from the browser.',

    feat3_title:        '24 Ready-made Templates',
    feat3_desc:         'Professional templates for YouTube (16:9), Stories (9:16), Instagram (1:1) and Broadcast (4:3). Applied in one click.',

    feat4_title:        '16 Animated Transitions',
    feat4_desc:         'Fade, Slide, Zoom, Bounce, Elastic, Roll and more — with independent entry and exit per lyric line.',

    feat5_title:        '24 Sound Effects',
    feat5_desc:         'Applause, laughter, swoosh, alerts and much more. Synthesized on the fly, no external downloads.',

    feat6_title:        'Stickers, Emojis & Filters',
    feat6_desc:         '120 emojis, 32 animated stickers and 10 visual filters (B&W, Neon, Cinema…) with fine-tune sliders.',

    // ── Landing page — Canvas Formats ────────────────────────────────────────
    formats_label:      'Canvas Formats',
    formats_title1:     '4 formats for',
    formats_title2:     'every platform.',
    formats_sub:        'Change the format at any time — your content adapts automatically.',

    // ── Landing page — Testimonials ──────────────────────────────────────────
    testimonials_label: 'Testimonials',
    testimonials_title1:'Creators who',
    testimonials_title2:'love CanvasSync.',

    test1_name:         'Lucas Ferreira',
    test1_role:         'Music Producer · São Paulo',
    test1_text:         'I created the lyric video for my single in under 10 minutes. The sync was perfect and the HD export impressed everyone.',

    test2_name:         'Ana Beatriz',
    test2_role:         'Independent Singer · Belo Horizonte',
    test2_text:         'The ready-made templates are amazing. I uploaded the song, picked the Viral Reels template and exported to Stories in minutes. Zero manual editing.',

    test3_name:         'Rafael Matos',
    test3_role:         'DJ & Composer · Rio de Janeiro',
    test3_text:         'I use CanvasSync every week to make lyric videos. The sound effects and animated stickers add a professional touch my audience loves.',

    // ── Landing page — Pricing ───────────────────────────────────────────────
    pricing_label:      'Pricing',
    pricing_title1:     'Simple and',
    pricing_title2:     'transparent.',
    billing_monthly:    'Monthly',
    billing_annual:     'Annual',

    free_forever:       'Free forever',
    free_feat1:         'Static image editor (PNG/JPG)',
    free_feat2:         'Lyric sync (preview only)',
    free_feat3:         'Basic stickers and emojis',
    free_feat4:         'PNG image export',
    free_feat5:         'CanvasSync watermark',
    free_cta:           'Start for free',

    pro_per_month:      '/mo',
    pro_per_year:       '/yr',
    pro_annual_note:    '≈ R$ 33.25/mo · save R$ 79.80',
    pro_monthly_note:   'Cancel anytime',
    pro_feat1:          'Video with audio — MP4 & WEBM (SD + HD 1080p)',
    pro_feat2:          'No watermark',
    pro_feat3:          '24 professional templates in 4 formats',
    pro_feat4:          '16 animated transitions (entry/exit)',
    pro_feat5:          '24 synthesized sound effects',
    pro_feat6:          '120 emojis + 32 animated stickers',
    pro_feat7:          'CSS filters with 10 presets + sliders',
    pro_feat8:          'Real-time lyric synchronization',
    pro_cta:            'Subscribe Pro',
    pro_cancel:         'Cancel anytime · no commitment',

    // ── Landing page — Final CTA ─────────────────────────────────────────────
    cta_label:          'Get started',
    cta_title1:         'Your next lyric video',
    cta_title2:         'starts here.',
    cta_sub:            'Create, sync and export in HD — for free.',
    cta_btn:            'Create video now',

    // ── Landing page — Footer ────────────────────────────────────────────────
    footer_terms:       'Terms of Use',
    footer_privacy:     'Privacy',
    footer_support:     'Support',
    footer_contact:     'Contact',
    footer_rights:      'All rights reserved.',

    // ── Entrar / Registro — fields and tabs ──────────────────────────────────
    signin_tab:         'Sign in',
    register_tab:       'Create account',
    signin_title:       'Welcome back',
    signin_sub:         'Sign in to your account to continue.',
    register_title:     'Create your free account',
    register_sub:       'No credit card required. Get started now.',
    google_btn:         'Continue with Google',
    or_divider:         'or',
    name_label:         'Name',
    name_placeholder:   'Your full name',
    email_label:        'Email',
    email_placeholder:  'your@email.com',
    password_label:     'Password',
    pass_placeholder:   'Minimum 6 characters',
    loading_btn:        'Loading...',
    signin_btn:         'Sign in',
    register_btn:       'Create account',
    want_pro:           'Want Pro features?',
    see_pro:            'See Pro plan',
    back_home:          '← Back to home',
    terms_note:         'By continuing, you agree to our Terms of Use and Privacy Policy.',

    // ── Entrar — validation ──────────────────────────────────────────────────
    fill_fields:        'Please fill in your email and password.',
    fill_name:          'Please fill in your name.',
    pass_min:           'Password must be at least 6 characters.',
    error_generic:      'An error occurred. Please try again.',

    // ── Registro.jsx — specific ──────────────────────────────────────────────
    free_badge:         '✨ Free Plan — always free',
    reg_title_register: 'Create your free account',
    reg_title_login:    'Welcome back',
    reg_sub_register:   'Start creating lyric videos right now.',
    reg_sub_login:      'Sign in to continue creating your videos.',
    reg_create_btn:     'Create free account',
    reg_login_btn:      'Sign in',
    free_includes:      'Included in the free plan',
    reg_free1:          'Static image editor (PNG/JPG)',
    reg_free2:          'Stickers, emojis and basic filters',
    reg_free3:          'Extra texts with shadow and gradient',
    reg_free4:          'PNG image export',

    // ── Checkout.jsx — specific ──────────────────────────────────────────────
    back_btn:           '← Back',
    checkout_title:     'Subscribe to Pro',
    checkout_sub:       'Unlock the full power of CanvasSync.',
    period_label:       'Billing period',
    plan_monthly:       'Monthly',
    plan_monthly_sub:   'Automatic renewal every month',
    plan_annual:        'Annual',
    plan_annual_sub:    'Best value · save R$ 79.80',
    included_label:     'Included in Pro',
    co_feat1:           'Video with audio — MP4 & WEBM (SD + HD 1080p)',
    co_feat2:           'No watermark',
    co_feat3:           '24 templates + 16 animated transitions',
    co_feat4:           '24 sound effects + 120 emojis + 32 stickers',
    co_feat5:           'Real-time lyric synchronization',
    continue_btn:       'Continue to payment →',
    continue_btn2:      'Create account & subscribe →',
    secure_note:        '🔒 100% secure payment via Stripe',
    back_to_start:      '← Back to home',
    already_have:       'I already have an account',
    auth_create:        'Create account and continue',
    auth_login:         'Sign in and continue',
    payment_title:      'Complete subscription',
    logged_as:          'Logged in as',
    card_label:         'Credit card',
    card_sub:           'Visa, Mastercard and others',
    redirecting:        'Redirecting...',
    pay_card_btn:       'Pay with card →',
    secure_note2:       '🔒 Redirected to Stripe\'s secure environment',

    // ── Sucesso.jsx — specific ───────────────────────────────────────────────
    verifying:          'Verifying your payment...',
    pix_pending_title:  'Awaiting confirmation',
    pix_pending_sub:    'Your PIX payment is being processed. Once confirmed, your account will be updated automatically.',
    pix_tip:            'Tip: PIX confirmation may take up to 30 minutes. You\'ll receive an email once your Pro plan is activated.',
    error_title:        'Something went wrong',
    error_sub:          'We could not confirm your payment. If you were charged, please contact support.',
    welcome_pro:        '🎉 Welcome to Pro!',
    welcome_sub:        'Your subscription is active. You now have access to all professional CanvasSync features.',
    unlocked_label:     'Unlocked now',
    unlock1:            'MP4 and WEBM video export in HD 1080p',
    unlock2:            'No watermark',
    unlock3:            '24 templates + 16 animated transitions',
    unlock4:            'Real-time lyric synchronization',
    unlock5:            '24 synthesized sound effects',
    open_editor:        '🎬 Open the editor',
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

export function useLanguage() {
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
