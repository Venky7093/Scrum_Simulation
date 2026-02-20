export type UserRole = 'scrum_master' | 'developer' | 'product_owner';

export type StoryStatus = 'backlog' | 'todo' | 'in_progress' | 'done';

export type StoryPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  team_velocity: number;
  team_morale: number;
}

export interface Sprint {
  id: string;
  project_id: string;
  name: string;
  goal: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'review' | 'retrospective' | 'completed';
  velocity_planned: number;
  velocity_actual: number;
  created_at: string;
}

export interface Story {
  id: string;
  sprint_id: string | null;
  title: string;
  description: string;
  status: StoryStatus;
  priority: StoryPriority;
  points: number;
  assignee_id?: string;
  created_at: string;
  order: number;
}

export interface SimulationEvent {
  id: string;
  sprint_id: string;
  type: 'scope_change' | 'team_absence' | 'production_bug' | 'stakeholder_feedback' | 'impediment';
  title: string;
  description: string;
  options: SimulationOption[];
  occurred_at: string;
  resolved: boolean;
  chosen_option_id?: string;
}

export interface SimulationOption {
  id: string;
  label: string;
  description: string;
  velocity_impact: number;
  morale_impact: number;
  outcome_description: string;
}

export interface Decision {
  id: string;
  sprint_id: string;
  event_id: string;
  option_id: string;
  velocity_impact: number;
  morale_impact: number;
  created_at: string;
}

export interface SprintMetrics {
  id: string;
  sprint_id: string;
  day: number;
  points_completed: number;
  points_remaining: number;
  team_morale: number;
  created_at: string;
}

export const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13, 21] as const;

export type FibonacciPoint = typeof FIBONACCI_POINTS[number];
