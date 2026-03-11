import React, { createContext, useContext, useState } from 'react';

// ── Dicionário completo PT-BR / EN ────────────────────────────────────────────
const TRANSLATIONS = {
  'pt': {
    // ── Editor — Header mídia ─────────────────────────────────────────────────
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

    // ── Navegação (CanvasSync.jsx) ───────────────────────────────────────────
    nav_features:     'Recursos',
    nav_plans:        'Planos',
    nav_signin:       'Entrar',
    nav_start:        'Começar grátis',

    // Hero
    hero_badge:       '🎬 Editor de vídeo musical',
    hero_title1:      'Crie vídeos com',
    hero_title2:      'letra sincronizada',
    hero_title3:      'em minutos',
    hero_sub:         'Importe sua música, adicione imagens e sincronize a letra no ritmo.',
    hero_sub_bold:    'Sem precisar de nenhum software.',
    hero_cta_primary: 'Criar vídeo grátis',
    hero_cta_demo:    'Ver exemplo',
    hero_trust:       '✓ Grátis para começar · Sem instalar nada · Export em MP4 e WEBM',

    // Features section
    features_label:   'RECURSOS',
    features_title1:  'Tudo que você precisa para',
    features_title2:  'criar conteúdo musical',
    features_sub:     'Do upload ao export em minutos, com ferramentas profissionais acessíveis a todos.',
    feat1_title:      'Sincronização de Letra',
    feat1_desc:       'Marque cada frase no ritmo da música com um clique. A letra aparece automaticamente no momento certo do vídeo.',
    feat2_title:      'Editor Visual Completo',
    feat2_desc:       'Posicione textos, imagens e vídeos livremente no canvas. Gire, redimensione e aplique filtros profissionais.',
    feat3_title:      'Export em Alta Qualidade',
    feat3_desc:       'Exporte em MP4 ou WEBM com áudio sincronizado, em resolução SD ou Full HD 1080p.',
    feat4_title:      'Templates Prontos',
    feat4_desc:       'Escolha entre dezenas de layouts para cada formato: Stories, YouTube, Feed e mais.',
    feat5_title:      'Stickers e Efeitos',
    feat5_desc:       'Adicione emojis animados, stickers e efeitos sonoros para dar vida ao seu conteúdo.',
    feat6_title:      'Múltiplos Formatos',
    feat6_desc:       'Suporte a 16:9, 9:16 (Stories/Reels), 1:1 (Feed) e 4:5 — tudo no mesmo editor.',

    // Testimonials
    testimonials_label:  'DEPOIMENTOS',
    testimonials_title1: 'Criadores que já usam',
    testimonials_title2: 'o CanvasSync',
    test1_name:       'Ana Paula',
    test1_role:       'Cantora independente',
    test1_text:       'Finalmente consegui criar vídeos com letra sincronizada sem gastar horas. Em 15 minutos meu conteúdo estava pronto!',
    test2_name:       'Lucas Mendes',
    test2_role:       'Producer musical',
    test2_text:       'A qualidade do export é incrível. Uso para divulgar minhas beats e o engajamento triplicou nas redes.',
    test3_name:       'Mariana Costa',
    test3_role:       'Influenciadora musical',
    test3_text:       'Interface super intuitiva. Minha equipe não precisou de nenhum treinamento para começar a usar.',

    // Pricing
    pricing_label:    'PLANOS',
    pricing_title1:   'Simples e',
    pricing_title2:   'transparente',
    billing_monthly:  'Mensal',
    billing_annual:   'Anual',
    free_forever:     'Grátis para sempre',
    free_feat1:       'Export de imagem PNG/JPG',
    free_feat2:       'Até 3 imagens por projeto',
    free_feat3:       'Textos extras ilimitados',
    free_feat4:       'Stickers e emojis',
    free_feat5:       'Marca d\'água CanvasSync',
    free_cta:         'Começar grátis',
    pro_per_month:    '/mês',
    pro_per_year:     '/ano',
    pro_monthly_note: 'Cobrado mensalmente',
    pro_annual_note:  'Equivale a R$ 33,25/mês · economize 17%',
    pro_cancel:       'Cancele quando quiser',
    pro_feat1:        'Tudo do plano Free',
    pro_feat2:        'Export em MP4 e WEBM com áudio',
    pro_feat3:        'Full HD 1080p',
    pro_feat4:        'Sincronização de letra musical',
    pro_feat5:        'Imagens e vídeos ilimitados',
    pro_feat6:        'Efeitos sonoros no vídeo',
    pro_feat7:        'Templates prontos para todos os formatos',
    pro_feat8:        'Sem marca d\'água',
    pro_cta:          'Assinar Pro',

    // CTA section
    cta_label:        'COMECE AGORA',
    cta_title1:       'Pronto para criar seu',
    cta_title2:       'próximo vídeo?',
    cta_sub:          'Junte-se a centenas de criadores que já usam o CanvasSync para produzir conteúdo musical profissional.',
    cta_btn:          'Criar vídeo grátis agora',

    // Footer
    footer_rights:    '© 2026 CanvasSync. Todos os direitos reservados.',
    footer_privacy:   'Privacidade',
    footer_terms:     'Termos',
    footer_contact:   'Contato',
    footer_support:   'Suporte',

    // ── Checkout (Checkout.jsx) ──────────────────────────────────────────────
    back_btn:         '← Voltar',
    checkout_title:   'Assine o CanvasSync Pro',
    checkout_sub:     'Desbloqueie export de vídeo, música e muito mais',
    period_label:     'PERÍODO',
    plan_monthly:     'Mensal',
    plan_monthly_sub: 'Cobrado todo mês',
    plan_annual:      'Anual',
    plan_annual_sub:  'Economize 17% · R$ 33,25/mês',
    included_label:   'O QUE ESTÁ INCLUÍDO',
    co_feat1:         'Export MP4 e WEBM com áudio',
    co_feat2:         'Full HD 1080p',
    co_feat3:         'Sincronização de letra musical',
    co_feat4:         'Imagens e vídeos ilimitados',
    co_feat5:         'Sem marca d\'água',
    continue_btn:     'Continuar para pagamento',
    continue_btn2:    'Criar conta e continuar',
    secure_note:      '🔒 Pagamento 100% seguro via Stripe',
    back_to_start:    '← Voltar ao início',
    already_have:     'Já tenho conta',
    payment_title:    'Pagamento',
    logged_as:        'Logado como',
    card_label:       'Cartão de crédito',
    card_sub:         'Processado com segurança pelo Stripe',
    redirecting:      'Redirecionando...',
    pay_card_btn:     'Pagar com cartão',
    secure_note2:     '🔒 Seus dados de pagamento são protegidos pelo Stripe',

    // ── Auth compartilhado (Entrar, Registro, Checkout) ─────────────────────
    google_btn:       'Continuar com Google',
    or_divider:       'ou',
    name_label:       'NOME',
    name_placeholder: 'Seu nome completo',
    email_label:      'E-MAIL',
    email_placeholder:'seu@email.com',
    password_label:   'SENHA',
    pass_placeholder: 'Mínimo 6 caracteres',
    loading_btn:      'Carregando...',
    auth_create:      'Criar conta',
    auth_login:       'Entrar',
    register_tab:     'Criar conta',
    signin_tab:       'Entrar',

    // ── Entrar.jsx ───────────────────────────────────────────────────────────
    signin_title:     'Bem-vindo de volta',
    signin_sub:       'Entre na sua conta para continuar criando',
    register_title:   'Criar sua conta',
    register_sub:     'Comece a criar vídeos musicais gratuitamente',
    signin_btn:       'Entrar',
    register_btn:     'Criar conta',
    fill_fields:      'Preencha e-mail e senha.',
    fill_name:        'Informe seu nome.',
    pass_min:         'A senha deve ter no mínimo 6 caracteres.',
    error_generic:    'Ocorreu um erro. Tente novamente.',
    want_pro:         'Quer recursos avançados?',
    see_pro:          'Ver plano Pro',
    back_home:        '← Voltar ao início',
    terms_note:       'Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.',

    // ── Registro.jsx ─────────────────────────────────────────────────────────
    free_badge:       '✓ Plano Free — sem cartão',
    reg_title_register: 'Crie sua conta grátis',
    reg_title_login:  'Bem-vindo de volta',
    reg_sub_register: 'Comece a criar vídeos musicais agora mesmo',
    reg_sub_login:    'Entre na sua conta para continuar',
    reg_create_btn:   'Criar conta grátis',
    reg_login_btn:    'Entrar',
    free_includes:    'PLANO FREE INCLUI',
    reg_free1:        'Export de imagem PNG/JPG',
    reg_free2:        'Até 3 imagens por projeto',
    reg_free3:        'Stickers, emojis e textos extras',
    reg_free4:        'Canvas em todos os formatos',

    // ── Sucesso.jsx ──────────────────────────────────────────────────────────
    verifying:        'Verificando seu pagamento...',
    pix_pending_title:'Pagamento em análise',
    pix_pending_sub:  'Seu pagamento via PIX está sendo processado. Assim que confirmado, seu plano Pro será ativado automaticamente.',
    pix_tip:          'O PIX costuma ser confirmado em poucos minutos. Se demorar mais de 30 minutos, entre em contato pelo suporte.',
    error_title:      'Algo deu errado',
    error_sub:        'Não conseguimos confirmar seu pagamento. Tente novamente ou entre em contato com o suporte.',
    welcome_pro:      '🎉 Bem-vindo ao Pro!',
    welcome_sub:      'Seu plano foi ativado com sucesso. Agora você tem acesso completo a todos os recursos do CanvasSync.',
    unlocked_label:   'DESBLOQUEADO',
    unlock1:          'Export de vídeo MP4 e WEBM com áudio',
    unlock2:          'Full HD 1080p',
    unlock3:          'Sincronização de letra musical',
    unlock4:          'Imagens e vídeos ilimitados',
    unlock5:          'Sem marca d\'água',
    open_editor:      '⚡ Abrir Editor',
  },

  'en': {
    // ── Editor — Header mídia ─────────────────────────────────────────────────
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

    // ── Navigation (CanvasSync.jsx) ───────────────────────────────────────────
    nav_features:     'Features',
    nav_plans:        'Plans',
    nav_signin:       'Sign in',
    nav_start:        'Get started free',

    // Hero
    hero_badge:       '🎬 Music video editor',
    hero_title1:      'Create videos with',
    hero_title2:      'synced lyrics',
    hero_title3:      'in minutes',
    hero_sub:         'Import your music, add images and sync lyrics to the beat.',
    hero_sub_bold:    'No software needed.',
    hero_cta_primary: 'Create video for free',
    hero_cta_demo:    'See example',
    hero_trust:       '✓ Free to start · Nothing to install · Export MP4 & WEBM',

    // Features section
    features_label:   'FEATURES',
    features_title1:  'Everything you need to',
    features_title2:  'create music content',
    features_sub:     'From upload to export in minutes, with professional tools accessible to everyone.',
    feat1_title:      'Lyric Sync',
    feat1_desc:       'Mark each line to the beat with a single click. Lyrics appear automatically at the right moment.',
    feat2_title:      'Full Visual Editor',
    feat2_desc:       'Freely position texts, images and videos on the canvas. Rotate, resize and apply professional filters.',
    feat3_title:      'High-Quality Export',
    feat3_desc:       'Export in MP4 or WEBM with synced audio, in SD or Full HD 1080p resolution.',
    feat4_title:      'Ready-Made Templates',
    feat4_desc:       'Choose from dozens of layouts for each format: Stories, YouTube, Feed and more.',
    feat5_title:      'Stickers & Effects',
    feat5_desc:       'Add animated emojis, stickers and sound effects to bring your content to life.',
    feat6_title:      'Multiple Formats',
    feat6_desc:       'Support for 16:9, 9:16 (Stories/Reels), 1:1 (Feed) and 4:5 — all in the same editor.',

    // Testimonials
    testimonials_label:  'TESTIMONIALS',
    testimonials_title1: 'Creators already using',
    testimonials_title2: 'CanvasSync',
    test1_name:       'Ana Paula',
    test1_role:       'Independent singer',
    test1_text:       'I finally managed to create videos with synced lyrics without spending hours. In 15 minutes my content was ready!',
    test2_name:       'Lucas Mendes',
    test2_role:       'Music producer',
    test2_text:       'The export quality is amazing. I use it to promote my beats and engagement tripled on social media.',
    test3_name:       'Mariana Costa',
    test3_role:       'Music influencer',
    test3_text:       'Super intuitive interface. My team needed zero training to start using it.',

    // Pricing
    pricing_label:    'PLANS',
    pricing_title1:   'Simple and',
    pricing_title2:   'transparent',
    billing_monthly:  'Monthly',
    billing_annual:   'Annual',
    free_forever:     'Free forever',
    free_feat1:       'PNG/JPG image export',
    free_feat2:       'Up to 3 images per project',
    free_feat3:       'Unlimited extra texts',
    free_feat4:       'Stickers and emojis',
    free_feat5:       'CanvasSync watermark',
    free_cta:         'Get started free',
    pro_per_month:    '/month',
    pro_per_year:     '/year',
    pro_monthly_note: 'Billed monthly',
    pro_annual_note:  'Equivalent to R$ 33.25/mo · save 17%',
    pro_cancel:       'Cancel anytime',
    pro_feat1:        'Everything in Free',
    pro_feat2:        'MP4 and WEBM export with audio',
    pro_feat3:        'Full HD 1080p',
    pro_feat4:        'Music lyric sync',
    pro_feat5:        'Unlimited images and videos',
    pro_feat6:        'Sound effects in video',
    pro_feat7:        'Ready-made templates for all formats',
    pro_feat8:        'No watermark',
    pro_cta:          'Subscribe Pro',

    // CTA section
    cta_label:        'GET STARTED',
    cta_title1:       'Ready to create your',
    cta_title2:       'next video?',
    cta_sub:          'Join hundreds of creators already using CanvasSync to produce professional music content.',
    cta_btn:          'Create video for free now',

    // Footer
    footer_rights:    '© 2026 CanvasSync. All rights reserved.',
    footer_privacy:   'Privacy',
    footer_terms:     'Terms',
    footer_contact:   'Contact',
    footer_support:   'Support',

    // ── Checkout (Checkout.jsx) ──────────────────────────────────────────────
    back_btn:         '← Back',
    checkout_title:   'Subscribe to CanvasSync Pro',
    checkout_sub:     'Unlock video export, music and much more',
    period_label:     'PERIOD',
    plan_monthly:     'Monthly',
    plan_monthly_sub: 'Billed every month',
    plan_annual:      'Annual',
    plan_annual_sub:  'Save 17% · R$ 33.25/month',
    included_label:   "WHAT'S INCLUDED",
    co_feat1:         'MP4 and WEBM export with audio',
    co_feat2:         'Full HD 1080p',
    co_feat3:         'Music lyric sync',
    co_feat4:         'Unlimited images and videos',
    co_feat5:         'No watermark',
    continue_btn:     'Continue to payment',
    continue_btn2:    'Create account and continue',
    secure_note:      '🔒 100% secure payment via Stripe',
    back_to_start:    '← Back to home',
    already_have:     'I already have an account',
    payment_title:    'Payment',
    logged_as:        'Logged in as',
    card_label:       'Credit card',
    card_sub:         'Securely processed by Stripe',
    redirecting:      'Redirecting...',
    pay_card_btn:     'Pay with card',
    secure_note2:     '🔒 Your payment data is protected by Stripe',

    // ── Auth shared (Entrar, Registro, Checkout) ─────────────────────────────
    google_btn:       'Continue with Google',
    or_divider:       'or',
    name_label:       'NAME',
    name_placeholder: 'Your full name',
    email_label:      'EMAIL',
    email_placeholder:'you@email.com',
    password_label:   'PASSWORD',
    pass_placeholder: 'Minimum 6 characters',
    loading_btn:      'Loading...',
    auth_create:      'Create account',
    auth_login:       'Sign in',
    register_tab:     'Create account',
    signin_tab:       'Sign in',

    // ── Entrar.jsx ───────────────────────────────────────────────────────────
    signin_title:     'Welcome back',
    signin_sub:       'Sign in to your account to keep creating',
    register_title:   'Create your account',
    register_sub:     'Start creating music videos for free',
    signin_btn:       'Sign in',
    register_btn:     'Create account',
    fill_fields:      'Please fill in email and password.',
    fill_name:        'Please enter your name.',
    pass_min:         'Password must be at least 6 characters.',
    error_generic:    'Something went wrong. Please try again.',
    want_pro:         'Want advanced features?',
    see_pro:          'See Pro plan',
    back_home:        '← Back to home',
    terms_note:       'By signing in, you agree to our Terms of Use and Privacy Policy.',

    // ── Registro.jsx ─────────────────────────────────────────────────────────
    free_badge:       '✓ Free plan — no credit card',
    reg_title_register: 'Create your free account',
    reg_title_login:  'Welcome back',
    reg_sub_register: 'Start creating music videos right now',
    reg_sub_login:    'Sign in to your account to continue',
    reg_create_btn:   'Create free account',
    reg_login_btn:    'Sign in',
    free_includes:    'FREE PLAN INCLUDES',
    reg_free1:        'PNG/JPG image export',
    reg_free2:        'Up to 3 images per project',
    reg_free3:        'Stickers, emojis and extra texts',
    reg_free4:        'Canvas in all formats',

    // ── Sucesso.jsx ──────────────────────────────────────────────────────────
    verifying:        'Verifying your payment...',
    pix_pending_title:'Payment under review',
    pix_pending_sub:  'Your PIX payment is being processed. Once confirmed, your Pro plan will be activated automatically.',
    pix_tip:          'PIX is usually confirmed within minutes. If it takes more than 30 minutes, please contact support.',
    error_title:      'Something went wrong',
    error_sub:        'We could not confirm your payment. Please try again or contact support.',
    welcome_pro:      '🎉 Welcome to Pro!',
    welcome_sub:      'Your plan has been successfully activated. You now have full access to all CanvasSync features.',
    unlocked_label:   'UNLOCKED',
    unlock1:          'MP4 and WEBM video export with audio',
    unlock2:          'Full HD 1080p',
    unlock3:          'Music lyric sync',
    unlock4:          'Unlimited images and videos',
    unlock5:          'No watermark',
    open_editor:      '⚡ Open Editor',
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
