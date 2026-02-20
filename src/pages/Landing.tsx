import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Users, 
  Target, 
  BarChart3, 
  Zap, 
  CheckCircle2,
  Play,
  Calendar,
  MessageSquare,
  TrendingUp
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Scrum Master Simulator</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#learn" className="text-muted-foreground hover:text-foreground transition-colors">Learn Scrum</a>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth?mode=signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Zap className="w-4 h-4" />
              Learn Scrum by Doing
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              Master Scrum Through
              <span className="gradient-text block mt-2">Realistic Simulations</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Experience real sprint scenarios, make critical decisions, and learn how your choices impact team velocity and morale. Perfect for aspiring Scrum Masters.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?mode=signup">
                  Start Simulation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#how-it-works">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </a>
              </Button>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-20 relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-2xl p-2 shadow-glow max-w-5xl mx-auto">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-warning/50" />
                  <div className="w-3 h-3 rounded-full bg-success/50" />
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {['Product Backlog', 'To Do', 'In Progress', 'Done'].map((column, i) => (
                      <div key={column} className={`rounded-xl p-4 ${
                        i === 0 ? 'bg-backlog' : 
                        i === 1 ? 'bg-todo' : 
                        i === 2 ? 'bg-in-progress' : 'bg-done'
                      }`}>
                        <h3 className="font-semibold text-sm mb-3">{column}</h3>
                        <div className="space-y-2">
                          {[1, 2].map((item) => (
                            <div key={item} className="bg-card rounded-lg p-3 shadow-sm">
                              <div className="h-2 bg-muted rounded w-3/4 mb-2" />
                              <div className="h-2 bg-muted rounded w-1/2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Scrum Section */}
      <section id="learn" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What is Scrum?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Scrum is an agile framework that helps teams deliver value incrementally through time-boxed iterations called Sprints.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: "Scrum Team",
                description: "A self-organizing team with a Product Owner, Scrum Master, and Developers working together to deliver value."
              },
              {
                icon: Calendar,
                title: "Sprints",
                description: "Fixed-length iterations (usually 2 weeks) where the team commits to delivering a potentially shippable product increment."
              },
              {
                icon: MessageSquare,
                title: "Ceremonies",
                description: "Regular events including Sprint Planning, Daily Standups, Sprint Review, and Retrospectives to ensure transparency."
              }
            ].map((item, index) => (
              <div key={index} className="metric-card group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simulation Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience every aspect of running a Sprint with realistic scenarios and immediate feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Sprint Planning",
                description: "Select stories, estimate effort, and set achievable Sprint Goals.",
                color: "bg-primary/10 text-primary"
              },
              {
                icon: Users,
                title: "Daily Scrum",
                description: "Navigate impediments and make decisions that impact your team.",
                color: "bg-accent/10 text-accent"
              },
              {
                icon: MessageSquare,
                title: "Sprint Review",
                description: "Present to stakeholders and handle feedback scenarios.",
                color: "bg-success/10 text-success"
              },
              {
                icon: TrendingUp,
                title: "Retrospective",
                description: "Identify improvements and apply learnings to future Sprints.",
                color: "bg-warning/10 text-warning"
              }
            ].map((feature, index) => (
              <div key={index} className="metric-card text-center">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Start your journey to becoming a confident Scrum Master in just a few steps.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Your Project",
                description: "Set up a simulated project with a backlog of user stories. Choose your team composition and starting conditions."
              },
              {
                step: "02",
                title: "Run Sprint Simulations",
                description: "Plan sprints, manage the board, and face realistic challenges like scope changes, team absences, and production bugs."
              },
              {
                step: "03",
                title: "Make Decisions",
                description: "When events occur, choose how to respond. Each decision impacts velocity, team morale, and sprint outcomes."
              },
              {
                step: "04",
                title: "Track & Learn",
                description: "Review your velocity, burndown charts, and success scores. Learn from outcomes and improve your Scrum skills."
              }
            ].map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full hero-gradient flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">{item.step}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="hero-gradient rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Master Scrum?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Start your first simulation today and learn how to lead agile teams effectively.
              </p>
              <Button 
                size="xl" 
                className="bg-card text-foreground hover:bg-card/90 shadow-lg"
                asChild
              >
                <Link to="/auth?mode=signup">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Scrum Master Simulator</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Scrum Master Simulator. Learn Scrum by doing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
