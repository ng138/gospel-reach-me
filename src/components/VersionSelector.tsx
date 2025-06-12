interface VersionSelectorProps {
  currentLanguage: string;
  currentVersion: string;
  onVersionChange: (version: string) => void;
}

const BIBLE_VERSIONS: Record<string, string[]> = {
  EN: ['KJV', 'NIV', 'ESV'],
  FR: ['LSG', 'BDS'],
  IT: ['CEI', 'NR94'],
  ES: ['RVR60', 'NVI'],
  DE: ['LUTH2017', 'ELB']
};

export function VersionSelector({ currentLanguage, currentVersion, onVersionChange }: VersionSelectorProps) {
  const versions = BIBLE_VERSIONS[currentLanguage] || [];
  
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {versions.map((version) => (
        <button
          key={version}
          className={`language-button ${currentVersion === version ? 'active' : ''}`}
          onClick={() => onVersionChange(version)}
          aria-label={`Switch to ${version}`}
          aria-pressed={currentVersion === version}
        >
          {version}
        </button>
      ))}
    </div>
  );
}