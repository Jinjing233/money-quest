import { useEffect, useRef } from "react";

const TRACK_SRC = "/audio/bgm/quiet-village.mp3";
const VOLUME = 0.35;

/** Ambient BGM for the whole session. Mount once at the app root so it keeps playing
 * across every screen. Browsers block audio-with-sound until a user gesture, so
 * playback starts on the first tap/click/keypress rather than on mount. */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUME;

    const startOnFirstInteraction = () => {
      void audio.play().catch(() => {});
    };
    document.addEventListener("pointerdown", startOnFirstInteraction, { once: true });
    document.addEventListener("keydown", startOnFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("pointerdown", startOnFirstInteraction);
      document.removeEventListener("keydown", startOnFirstInteraction);
    };
  }, []);

  return <audio ref={audioRef} src={TRACK_SRC} loop preload="auto" />;
}
