import type { Lesson } from "../../models/LessonModel";

declare function MonthView({
  monthName,
  mesIdx,
  lessons,
  colors,
  gradoActive,
  gradoLabel,
  onOpenLesson,
}: {
  monthName?: string;
  mesIdx?: number;
  lessons?: Lesson[];
  colors?: Record<string, string>;
  gradoActive?: boolean;
  gradoLabel?: string;
  onOpenLesson?: (lesson: Lesson) => void;
}): import("react").ReactElement;

export default MonthView;
