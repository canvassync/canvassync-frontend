// src/hooks/useLanguage.jsx
import { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('canvassync_lang') || 'pt-BR';
  });

  const toggle = () => {
    const next = lang === 'pt-BR' ? 'en' : 'pt-BR';
    setLang(next);
    localStorage.setItem('canvassync_lang', next);
  };

  const t = (key) => translations[lang]?.[key] || translations['pt-BR'][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage deve ser usado dentro de <LanguageProvider>');
  return ctx;
}

// Componente botão de troca de idioma reutilizável
export function LangToggle({ style = {} }) {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      title={lang === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '5px 10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        fontWeight: 700,
        color: '#888',
        transition: 'all 0.2s',
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,191,255,0.3)'; e.currentTarget.style.color = '#00BFFF'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#888'; }}
    >
      {lang === 'pt-BR' ? '🇧🇷 PT' : '🇺🇸 EN'}
    </button>
  );
}
