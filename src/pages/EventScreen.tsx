import { useGameStore } from "../store/gameStore";
import { EventCard } from "../components/EventCard";
import { FinancialLessonCard } from "../components/FinancialLessonCard";

export function EventScreen() {
  const { activeEvent, pendingLesson, chooseOption, acknowledgeLesson } = useGameStore();

  if (!activeEvent) return null;

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
      {pendingLesson ? (
        <FinancialLessonCard pendingLesson={pendingLesson} onContinue={acknowledgeLesson} />
      ) : (
        <EventCard event={activeEvent} onChoose={chooseOption} />
      )}
    </div>
  );
}
