import { useGameStore } from "../store/gameStore";
import { EventCard } from "../components/EventCard";
import { FinancialLessonCard } from "../components/FinancialLessonCard";
import { localizeEvent } from "../i18n/localize";

export function EventScreen() {
  const { activeEvent, showLesson, language, chooseOption, acknowledgeLesson } = useGameStore();

  if (!activeEvent) return null;

  const event = localizeEvent(activeEvent, language);

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
      {showLesson ? (
        <FinancialLessonCard
          pendingLesson={{ eventTitle: event.title, lesson: event.lesson }}
          onContinue={acknowledgeLesson}
          language={language}
        />
      ) : (
        <EventCard event={event} onChoose={chooseOption} />
      )}
    </div>
  );
}
