import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SprintColumn } from "@/components/sprint/SprintColumn";
import { SimulationEventModal } from "@/components/sprint/SimulationEventModal";
import { Story, StoryStatus, SimulationEvent, SimulationOption } from "@/types/scrum";
import {
  Target,
  ArrowLeft,
  TrendingUp,
  Heart,
  Calendar,
  Play,
  Pause,
  SkipForward,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock stories data
const initialStories: Story[] = [
  { id: "1", sprint_id: "1", title: "User authentication flow", description: "Implement login/signup with OAuth support", status: "backlog", priority: "critical", points: 8, order: 1, created_at: "" },
  { id: "2", sprint_id: "1", title: "Product listing page", description: "Display products with filtering options", status: "backlog", priority: "high", points: 5, order: 2, created_at: "" },
  { id: "3", sprint_id: "1", title: "Shopping cart functionality", description: "Add/remove items, quantity updates", status: "todo", priority: "high", points: 5, order: 3, created_at: "" },
  { id: "4", sprint_id: "1", title: "Checkout process", description: "Multi-step checkout with payment", status: "todo", priority: "medium", points: 8, order: 4, created_at: "" },
  { id: "5", sprint_id: "1", title: "Order confirmation email", description: "Send transactional emails", status: "in_progress", priority: "medium", points: 3, order: 5, created_at: "" },
  { id: "6", sprint_id: "1", title: "Homepage hero section", description: "Design and implement hero", status: "in_progress", priority: "low", points: 2, order: 6, created_at: "" },
  { id: "7", sprint_id: "1", title: "Footer component", description: "Links and newsletter signup", status: "done", priority: "low", points: 2, order: 7, created_at: "" },
  { id: "8", sprint_id: "1", title: "Mobile navigation", description: "Responsive hamburger menu", status: "done", priority: "medium", points: 3, order: 8, created_at: "" },
];

// Mock simulation events
const mockEvents: SimulationEvent[] = [
  {
    id: "evt1",
    sprint_id: "1",
    type: "scope_change",
    title: "Urgent Feature Request",
    description: "The Product Owner just received a request from a key stakeholder to add a 'Wishlist' feature. They believe it could significantly improve user engagement. How would you like to proceed?",
    options: [
      {
        id: "opt1a",
        label: "Add to Current Sprint",
        description: "Pull in the wishlist feature and extend the sprint scope.",
        velocity_impact: -3,
        morale_impact: -10,
        outcome_description: "Team feels pressured but delivers the feature."
      },
      {
        id: "opt1b",
        label: "Add to Backlog",
        description: "Prioritize for the next sprint, maintain current commitments.",
        velocity_impact: 0,
        morale_impact: 5,
        outcome_description: "Team appreciates the protection of their sprint goals."
      },
      {
        id: "opt1c",
        label: "Negotiate Scope Swap",
        description: "Replace a lower-priority story with the wishlist feature.",
        velocity_impact: -1,
        morale_impact: 0,
        outcome_description: "Balanced approach that satisfies stakeholders and team."
      }
    ],
    occurred_at: "",
    resolved: false
  },
  {
    id: "evt2",
    sprint_id: "1",
    type: "team_absence",
    title: "Team Member Sick",
    description: "Your senior developer has called in sick and will be out for 2 days. They were working on the checkout process story.",
    options: [
      {
        id: "opt2a",
        label: "Reassign Story",
        description: "Have another developer pick up where they left off.",
        velocity_impact: -2,
        morale_impact: -5,
        outcome_description: "Knowledge transfer causes some delays."
      },
      {
        id: "opt2b",
        label: "Pause the Story",
        description: "Wait for them to return and continue.",
        velocity_impact: -1,
        morale_impact: 5,
        outcome_description: "Team focuses on other work without disruption."
      }
    ],
    occurred_at: "",
    resolved: false
  }
];

const SprintBoard = () => {
  const { projectId } = useParams();
  const { toast } = useToast();
  
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [draggedStory, setDraggedStory] = useState<Story | null>(null);
  const [currentEvent, setCurrentEvent] = useState<SimulationEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [sprintDay, setSprintDay] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [velocity, setVelocity] = useState(24);
  const [morale, setMorale] = useState(85);
  const [eventQueue, setEventQueue] = useState<SimulationEvent[]>(mockEvents);

  const totalDays = 10;
  const sprintProgress = (sprintDay / totalDays) * 100;

  const getStoriesByStatus = (status: StoryStatus) => 
    stories.filter(s => s.status === status).sort((a, b) => a.order - b.order);

  const getPointsByStatus = (status: StoryStatus) =>
    getStoriesByStatus(status).reduce((sum, s) => sum + s.points, 0);

  const completedPoints = getPointsByStatus('done');
  const totalPoints = stories.reduce((sum, s) => sum + s.points, 0);

  const handleDragStart = (e: React.DragEvent, story: Story) => {
    setDraggedStory(story);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: StoryStatus) => {
    e.preventDefault();
    if (!draggedStory) return;

    setStories(prev => 
      prev.map(s => 
        s.id === draggedStory.id ? { ...s, status } : s
      )
    );
    setDraggedStory(null);
    
    if (status === 'done') {
      toast({
        title: "Story Completed! 🎉",
        description: `"${draggedStory.title}" moved to Done.`,
      });
    }
  };

  const triggerRandomEvent = () => {
    if (eventQueue.length === 0) return;
    
    const [nextEvent, ...remaining] = eventQueue;
    setEventQueue(remaining);
    setCurrentEvent(nextEvent);
    setIsEventModalOpen(true);
    setIsRunning(false);
  };

  const handleSelectOption = (option: SimulationOption) => {
    setVelocity(prev => Math.max(0, prev + option.velocity_impact));
    setMorale(prev => Math.min(100, Math.max(0, prev + option.morale_impact)));
    
    toast({
      title: "Decision Made",
      description: option.outcome_description,
    });
    
    setIsEventModalOpen(false);
    setCurrentEvent(null);
  };

  const advanceDay = () => {
    if (sprintDay >= totalDays) {
      toast({
        title: "Sprint Complete! 🏁",
        description: `You completed ${completedPoints} of ${totalPoints} points.`,
      });
      return;
    }
    
    setSprintDay(prev => prev + 1);
    
    // Random chance to trigger event
    if (Math.random() > 0.6 && eventQueue.length > 0) {
      setTimeout(triggerRandomEvent, 500);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && sprintDay < totalDays) {
      interval = setInterval(advanceDay, 3000);
    }
    return () => clearInterval(interval);
  }, [isRunning, sprintDay]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold">E-Commerce Platform</h1>
                  <p className="text-xs text-muted-foreground">Sprint 4</p>
                </div>
              </div>
            </div>

            {/* Sprint Controls */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Day <span className="font-semibold">{sprintDay}</span> of {totalDays}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{velocity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">{morale}%</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={isRunning ? "secondary" : "hero"}
                  size="sm"
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={advanceDay}
                  disabled={isRunning || sprintDay >= totalDays}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Sprint Progress</span>
              <span>{completedPoints} / {totalPoints} points completed</span>
            </div>
            <Progress value={sprintProgress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Sprint Board */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SprintColumn
            title="Product Backlog"
            status="backlog"
            stories={getStoriesByStatus('backlog')}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            totalPoints={getPointsByStatus('backlog')}
          />
          <SprintColumn
            title="To Do"
            status="todo"
            stories={getStoriesByStatus('todo')}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            totalPoints={getPointsByStatus('todo')}
          />
          <SprintColumn
            title="In Progress"
            status="in_progress"
            stories={getStoriesByStatus('in_progress')}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            totalPoints={getPointsByStatus('in_progress')}
          />
          <SprintColumn
            title="Done"
            status="done"
            stories={getStoriesByStatus('done')}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            totalPoints={getPointsByStatus('done')}
          />
        </div>

        {/* Event Indicator */}
        {eventQueue.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button
              variant="warning"
              size="lg"
              className="shadow-lg animate-pulse-subtle"
              onClick={triggerRandomEvent}
            >
              <AlertCircle className="w-5 h-5" />
              {eventQueue.length} Event{eventQueue.length > 1 ? 's' : ''} Pending
            </Button>
          </div>
        )}
      </main>

      {/* Event Modal */}
      <SimulationEventModal
        event={currentEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSelectOption={handleSelectOption}
      />
    </div>
  );
};

export default SprintBoard;
