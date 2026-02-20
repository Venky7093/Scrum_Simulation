-- Create enum types
CREATE TYPE public.user_role AS ENUM ('scrum_master', 'developer', 'product_owner');
CREATE TYPE public.story_status AS ENUM ('backlog', 'todo', 'in_progress', 'done');
CREATE TYPE public.story_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_morale INTEGER NOT NULL DEFAULT 80 CHECK (team_morale >= 0 AND team_morale <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sprints table
CREATE TABLE public.sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  goal TEXT,
  sprint_number INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  velocity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stories table
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER CHECK (points IN (1, 2, 3, 5, 8, 13, 21)),
  status story_status NOT NULL DEFAULT 'backlog',
  priority story_priority NOT NULL DEFAULT 'medium',
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create decisions table for simulation choices
CREATE TABLE public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  chosen_option TEXT NOT NULL,
  velocity_impact INTEGER NOT NULL DEFAULT 0,
  morale_impact INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sprint_metrics table
CREATE TABLE public.sprint_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  completed_points INTEGER NOT NULL DEFAULT 0,
  remaining_points INTEGER NOT NULL DEFAULT 0,
  team_morale INTEGER NOT NULL DEFAULT 80,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_metrics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own roles" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = owner_id);

-- Sprints policies (via project ownership)
CREATE POLICY "Users can view sprints of own projects" ON public.sprints FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = sprints.project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Users can create sprints in own projects" ON public.sprints FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Users can update sprints in own projects" ON public.sprints FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = sprints.project_id AND projects.owner_id = auth.uid()));
CREATE POLICY "Users can delete sprints in own projects" ON public.sprints FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = sprints.project_id AND projects.owner_id = auth.uid()));

-- Stories policies (via sprint -> project ownership)
CREATE POLICY "Users can view stories of own projects" ON public.stories FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.sprints 
    JOIN public.projects ON projects.id = sprints.project_id 
    WHERE sprints.id = stories.sprint_id AND projects.owner_id = auth.uid()
  ));
CREATE POLICY "Users can create stories in own projects" ON public.stories FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sprints 
    JOIN public.projects ON projects.id = sprints.project_id 
    WHERE sprints.id = sprint_id AND projects.owner_id = auth.uid()
  ));
CREATE POLICY "Users can update stories in own projects" ON public.stories FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.sprints 
    JOIN public.projects ON projects.id = sprints.project_id 
    WHERE sprints.id = stories.sprint_id AND projects.owner_id = auth.uid()
  ));
CREATE POLICY "Users can delete stories in own projects" ON public.stories FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.sprints 
    JOIN public.projects ON projects.id = sprints.project_id 
    WHERE sprints.id = stories.sprint_id AND projects.owner_id = auth.uid()
  ));

-- Decisions policies
CREATE POLICY "Users can view own decisions" ON public.decisions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own decisions" ON public.decisions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sprint metrics policies (via sprint -> project ownership)
CREATE POLICY "Users can view metrics of own projects" ON public.sprint_metrics FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.sprints 
    JOIN public.projects ON projects.id = sprints.project_id 
    WHERE sprints.id = sprint_metrics.sprint_id AND projects.owner_id = auth.uid()
  ));
CREATE POLICY "Users can create metrics in own projects" ON public.sprint_metrics FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.sprints 
    JOIN public.projects ON projects.id = sprints.project_id 
    WHERE sprints.id = sprint_id AND projects.owner_id = auth.uid()
  ));

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  
  -- Default role is scrum_master for simulation
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'scrum_master');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sprints_updated_at BEFORE UPDATE ON public.sprints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();