import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Plus,
  Users,
  TrendingUp,
  Heart,
  Calendar,
  BarChart3,
  LogOut,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string | null;
  team_morale: number;
  created_at: string;
}

interface Sprint {
  id: string;
  project_id: string;
  name: string;
  sprint_number: number;
  velocity: number;
  is_active: boolean;
}

const Dashboard = () => {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch projects and sprints
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      } else {
        setProjects(projectsData || []);
      }

      const { data: sprintsData, error: sprintsError } = await supabase
        .from('sprints')
        .select('*')
        .eq('is_active', true);

      if (sprintsError) {
        console.error('Error fetching sprints:', sprintsError);
      } else {
        setSprints(sprintsData || []);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateSimulation = async () => {
    if (!user) return;
    
    setIsCreating(true);
    
    // Create a new project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: `Simulation ${projects.length + 1}`,
        description: 'A new Scrum simulation project',
        owner_id: user.id
      })
      .select()
      .single();

    if (projectError) {
      toast({
        title: "Error creating simulation",
        description: projectError.message,
        variant: "destructive"
      });
      setIsCreating(false);
      return;
    }

    // Create an initial sprint
    const { data: sprint, error: sprintError } = await supabase
      .from('sprints')
      .insert({
        project_id: project.id,
        name: 'Sprint 1',
        goal: 'Complete initial stories',
        sprint_number: 1
      })
      .select()
      .single();

    if (sprintError) {
      toast({
        title: "Error creating sprint",
        description: sprintError.message,
        variant: "destructive"
      });
      setIsCreating(false);
      return;
    }

    toast({
      title: "Simulation created!",
      description: "Starting your new Scrum simulation...",
    });

    navigate(`/sprint/${project.id}`);
  };

  const getActiveSprint = (projectId: string) => {
    return sprints.find(s => s.project_id === projectId);
  };

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Scrum Mastery</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{initials}</span>
                </div>
                <span className="text-sm font-medium hidden md:block">{displayName}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}! 👋</h1>
          <p className="text-muted-foreground">
            Continue your Scrum journey or start a new simulation.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Simulations", value: projects.length.toString(), icon: Calendar, color: "text-primary" },
            { label: "Sprints Completed", value: "0", icon: Target, color: "text-success" },
            { label: "Avg Velocity", value: sprints.length > 0 ? Math.round(sprints.reduce((a, s) => a + s.velocity, 0) / sprints.length).toString() : "0", icon: TrendingUp, color: "text-accent" },
            { label: "Team Morale", value: projects.length > 0 ? `${Math.round(projects.reduce((a, p) => a + p.team_morale, 0) / projects.length)}%` : "80%", icon: Heart, color: "text-warning" }
          ].map((stat, index) => (
            <div key={index} className="metric-card">
              <div className="flex items-center gap-3">
                <div className={`${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Your Simulations</h2>
            <Button variant="hero" size="sm" onClick={handleCreateSimulation} disabled={isCreating}>
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              New Simulation
            </Button>
          </div>

          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => {
                const activeSprint = getActiveSprint(project.id);
                return (
                  <Link 
                    key={project.id} 
                    to={`/sprint/${project.id}`}
                    className="group"
                  >
                    <div className="metric-card hover:border-primary/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {project.description || 'No description'}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      {/* Active Sprint */}
                      {activeSprint && (
                        <div className="bg-muted/50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">{activeSprint.name}</span>
                            <span className="text-xs text-muted-foreground">
                              Active
                            </span>
                          </div>
                          <Progress value={0} className="h-2 mb-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>0 stories completed</span>
                            <span>0% complete</span>
                          </div>
                        </div>
                      )}

                      {/* Team Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <div>
                            <p className="text-sm font-medium">{activeSprint?.velocity || 0}</p>
                            <p className="text-xs text-muted-foreground">Velocity</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-warning" />
                          <div>
                            <p className="text-sm font-medium">{project.team_morale}%</p>
                            <p className="text-xs text-muted-foreground">Morale</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="metric-card text-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No simulations yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your first Scrum simulation to begin learning.
              </p>
              <Button variant="hero" onClick={handleCreateSimulation} disabled={isCreating}>
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Simulation
              </Button>
            </div>
          )}
        </div>

        {/* Learning Resources */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Sprint Planning",
                description: "Learn to plan effective sprints",
                icon: Calendar,
                color: "bg-primary/10 text-primary"
              },
              {
                title: "View Metrics",
                description: "Analyze your performance",
                icon: BarChart3,
                color: "bg-accent/10 text-accent"
              },
              {
                title: "Team Management",
                description: "Understand team dynamics",
                icon: Users,
                color: "bg-success/10 text-success"
              }
            ].map((action, index) => (
              <button
                key={index}
                className="metric-card text-left hover:border-primary/30 transition-all group"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
