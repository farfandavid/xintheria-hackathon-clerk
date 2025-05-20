import { uiIndex, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in uiIndex) return lang as keyof typeof uiIndex;
    return defaultLang;
}

export function useTranslations(lang: keyof typeof uiIndex) {
    return function t(key: keyof (typeof uiIndex)[typeof defaultLang]) {
        const translation = uiIndex[lang][key] || uiIndex[defaultLang][key];
        if (typeof translation === 'object' && !Array.isArray(translation)) {
            return translation;
        }
        return translation;
    };
}

