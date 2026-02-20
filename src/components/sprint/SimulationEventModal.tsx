import { SimulationEvent, SimulationOption } from "@/types/scrum";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, TrendingUp, Heart, ArrowRight } from "lucide-react";

interface SimulationEventModalProps {
  event: SimulationEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: SimulationOption) => void;
}

const eventTypeIcons = {
  scope_change: "📋",
  team_absence: "👤",
  production_bug: "🐛",
  stakeholder_feedback: "💬",
  impediment: "🚧"
};

export const SimulationEventModal = ({
  event,
  isOpen,
  onClose,
  onSelectOption
}: SimulationEventModalProps) => {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-2xl">
              {eventTypeIcons[event.type]}
            </div>
            <div>
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
              <DialogDescription className="text-warning font-medium">
                Sprint Event
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-muted-foreground mb-6">{event.description}</p>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Choose Your Response:</h4>
            {event.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onSelectOption(option)}
                className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-medium mb-1 group-hover:text-primary transition-colors">
                      {option.label}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
                
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className={`w-4 h-4 ${option.velocity_impact >= 0 ? 'text-success' : 'text-destructive'}`} />
                    <span className={`text-xs font-medium ${option.velocity_impact >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {option.velocity_impact >= 0 ? '+' : ''}{option.velocity_impact} velocity
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart className={`w-4 h-4 ${option.morale_impact >= 0 ? 'text-success' : 'text-destructive'}`} />
                    <span className={`text-xs font-medium ${option.morale_impact >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {option.morale_impact >= 0 ? '+' : ''}{option.morale_impact}% morale
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
