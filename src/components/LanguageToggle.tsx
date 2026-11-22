import { useGameStore } from "../store/gameStore";

/** Pixel segmented control for EN / 中, backed by the real `language` store field. */
export function LanguageToggle() {
  const lang = useGameStore((s) => s.language);
  const setLang = useGameStore((s) => s.setLanguage);

  return (
    <div className="pixel-border inline-flex bg-cream-light text-[10px]">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`font-pixel px-2 py-1 ${lang === "en" ? "bg-sage text-cream-light" : "text-brown-light"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("zh")}
        className={`font-pixel px-2 py-1 ${lang === "zh" ? "bg-sage text-cream-light" : "text-brown-light"}`}
      >
        中
      </button>
    </div>
  );
}
