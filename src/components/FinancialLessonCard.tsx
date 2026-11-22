import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";

interface FinancialLessonCardProps {
  pendingLesson: { eventTitle: string; lesson: string };
  onContinue: () => void;
}

export function FinancialLessonCard({ pendingLesson, onContinue }: FinancialLessonCardProps) {
  return (
    <PixelCard className="enter-up mx-auto w-full max-w-sm">
      <div className="flex items-center gap-2">
        <img src="/assets/pixel/ui/savings.png" alt="" className="pixel-img h-6 w-6" />
        <p className="font-pixel text-[9px] text-sage-dark">Financial Lesson</p>
      </div>
      <h2 className="font-pixel mt-2 text-xs leading-relaxed text-brown">{pendingLesson.eventTitle}</h2>

      <div className="mt-3 border-l-4 border-sage bg-cream pl-3 py-2">
        <p className="text-sm leading-relaxed text-brown-light">{pendingLesson.lesson}</p>
      </div>

      <PixelButton className="mt-4 w-full" onClick={onContinue}>
        Continue
      </PixelButton>
    </PixelCard>
  );
}
