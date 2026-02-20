import { Story, StoryPriority } from "@/types/scrum";
import { GripVertical, User } from "lucide-react";

interface StoryCardProps {
  story: Story;
  onDragStart: (e: React.DragEvent, story: Story) => void;
}

const priorityColors: Record<StoryPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/10 text-info",
  high: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive"
};

const priorityLabels: Record<StoryPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical"
};

export const StoryCard = ({ story, onDragStart }: StoryCardProps) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, story)}
      className="story-card group"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-medium text-sm leading-tight">{story.title}</h4>
            <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {story.points}
            </span>
          </div>
          
          {story.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {story.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[story.priority]}`}>
              {priorityLabels[story.priority]}
            </span>
            
            {story.assignee_id && (
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
