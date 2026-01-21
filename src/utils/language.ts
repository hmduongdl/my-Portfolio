import { Language, translations } from '../i18n/translations';

type Listener = (lang: Language) => void;

class LanguageManager {
    private currentLang: Language = 'en';
    private listeners: Listener[] = [];
    private static instance: LanguageManager;

    private constructor() {
        // Load from local storage or default to 'en'
        const saved = localStorage.getItem('portfolio_lang') as Language;
        if (saved && (saved === 'en' || saved === 'vn')) {
            this.currentLang = saved;
        }
    }

    static getInstance(): LanguageManager {
        if (!LanguageManager.instance) {
            LanguageManager.instance = new LanguageManager();
        }
        return LanguageManager.instance;
    }

    getLanguage(): Language {
        return this.currentLang;
    }

    setLanguage(lang: Language) {
        if (this.currentLang === lang) return;
        this.currentLang = lang;
        localStorage.setItem('portfolio_lang', lang);
        this.notifyListeners();
    }

    toggleLanguage() {
        this.setLanguage(this.currentLang === 'en' ? 'vn' : 'en');
    }

    getText<K extends keyof typeof translations['en']>(key: K): typeof translations['en'][K] {
        return translations[this.currentLang][key];
    }

    subscribe(listener: Listener) {
        this.listeners.push(listener);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l(this.currentLang));
    }
}

export const languageManager = LanguageManager.getInstance();
