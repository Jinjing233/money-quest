import { useState } from "react";

/**
 * Visual-only pixel segmented control for EN / 中. There is no i18n
 * wiring yet on the Developer Agent's side (no translation strings,
 * no store action to change `language`), so this intentionally keeps
 * its own local display state instead of inventing a second language
 * system -- it demonstrates the control style now, ready to be swapped
 * for a real `value`/`onChange` pair (store's `language` field) once
 * that lands, without any visual change needed.
 */
export function LanguageToggle() {
  const [lang, setLang] = useState<"en" | "zh">("en");

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
