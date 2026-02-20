import { Story, StoryStatus } from "@/types/scrum";
import { StoryCard } from "./StoryCard";

interface SprintColumnProps {
  title: string;
  status: StoryStatus;
  stories: Story[];
  onDragStart: (e: React.DragEvent, story: Story) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: StoryStatus) => void;
  totalPoints: number;
}

const columnStyles: Record<StoryStatus, string> = {
  backlog: "sprint-column-backlog",
  todo: "sprint-column-todo",
  in_progress: "sprint-column-in-progress",
  done: "sprint-column-done"
};

export const SprintColumn = ({
  title,
  status,
  stories,
  onDragStart,
  onDragOver,
  onDrop,
  totalPoints
}: SprintColumnProps) => {
  return (
    <div
      className={`sprint-column ${columnStyles[status]}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground bg-card px-2 py-0.5 rounded-full">
            {stories.length}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {totalPoints} pts
        </span>
      </div>
      
      <div className="space-y-3">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onDragStart={onDragStart}
          />
        ))}
        
        {stories.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Drop stories here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
