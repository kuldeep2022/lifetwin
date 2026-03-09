export interface HealthMetrics {
  overall: number;
  sleep: number;
  exercise: number;
  nutrition: number;
  stress: number;
  heartRate: number;
  bmi: number;
}

export interface FinanceMetrics {
  netWorth: number;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  debtRatio: number;
  creditScore: number;
}

export interface Skill {
  name: string;
  level: number;
  category: string;
}

export interface CareerMetrics {
  satisfaction: number;
  skills: Skill[];
  level: string;
  yearsExperience: number;
  productivity: number;
}

export interface WellnessMetrics {
  happiness: number;
  socialConnections: number;
  hobbies: number;
  workLifeBalance: number;
  mindfulness: number;
}

export interface LifeState {
  health: HealthMetrics;
  finance: FinanceMetrics;
  career: CareerMetrics;
  wellness: WellnessMetrics;
  timestamp: string;
}

export interface LifeProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  currentState: LifeState;
}

export interface SimulationPoint {
  month: number;
  health: HealthMetrics;
  finance: FinanceMetrics;
  career: CareerMetrics;
  wellness: WellnessMetrics;
  events: string[];
}

export interface Simulation {
  id: string;
  scenario: string;
  timeline: SimulationPoint[];
  status: 'idle' | 'running' | 'complete';
}

export interface LifeEvent {
  id: string;
  type: 'health' | 'finance' | 'career' | 'wellness';
  description: string;
  impact: Record<string, number>;
  month: number;
}

export type Dimension = 'health' | 'finance' | 'career' | 'wellness' | 'overview';
