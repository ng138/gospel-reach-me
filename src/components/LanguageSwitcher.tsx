interface LanguageSwitcherProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'French' },
  { code: 'IT', name: 'Italian' },
  { code: 'ES', name: 'Spanish' },
  { code: 'DE', name: 'German' }
];

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {LANGUAGES.map(({ code, name }) => (
        <button
          key={code}
          className={`language-button ${currentLanguage === code ? 'active' : ''}`}
          onClick={() => onLanguageChange(code)}
          aria-label={`Switch to ${name}`}
          aria-pressed={currentLanguage === code}
        >
          {code}
        </button>
      ))}
    </div>
  );
}