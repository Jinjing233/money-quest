import { PixelButton } from "../components/PixelButton";
import { LanguageToggle } from "../components/LanguageToggle";
import { useGameStore } from "../store/gameStore";
import { translateUI } from "../i18n/ui";

interface WelcomeScreenProps {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
}

export function WelcomeScreen({ hasSave, onStart, onContinue }: WelcomeScreenProps) {
  const language = useGameStore((s) => s.language);
  const t = (key: Parameters<typeof translateUI>[0]) => translateUI(key, language);

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>

      <div className="enter-up">
        <h1 className="font-pixel text-2xl leading-relaxed text-brown sm:text-3xl">{t("welcome.title")}</h1>
        <p className="font-pixel mt-3 text-[11px] text-sage-dark">{t("welcome.subtitle")}</p>
      </div>

      <p className="enter-up enter-delay-1 max-w-xs text-sm text-brown-light">{t("welcome.body")}</p>

      <div className="enter-up enter-delay-2 flex w-full max-w-xs flex-col gap-3">
        <PixelButton onClick={onStart}>{t("welcome.start")}</PixelButton>
        <PixelButton variant="secondary" onClick={onContinue} disabled={!hasSave}>
          {t("welcome.continue")}
        </PixelButton>
      </div>

      <img
        src="/assets/pixel/scenes/welcome_bg.png"
        alt=""
        className="pixel-img enter-up enter-delay-3 mt-2 w-full max-w-xs pixel-border"
      />
    </div>
  );
}
