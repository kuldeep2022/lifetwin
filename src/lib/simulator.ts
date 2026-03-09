import {
  LifeProfile,
  Simulation,
  SimulationPoint,
  HealthMetrics,
  FinanceMetrics,
  CareerMetrics,
  WellnessMetrics,
} from './types';
import { v4 as uuidv4 } from 'uuid';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

const LIFE_EVENTS: Record<string, { description: string; type: string; probability: number }[]> = {
  health: [
    { description: 'Started a new fitness routine', type: 'health', probability: 0.08 },
    { description: 'Caught a bad flu, out for a week', type: 'health', probability: 0.05 },
    { description: 'Started meditation practice', type: 'health', probability: 0.06 },
    { description: 'Burnout episode — took mental health break', type: 'health', probability: 0.04 },
    { description: 'Completed a marathon', type: 'health', probability: 0.02 },
    { description: 'Improved diet with meal prep', type: 'health', probability: 0.07 },
  ],
  finance: [
    { description: 'Market rally — portfolio up 8%', type: 'finance', probability: 0.06 },
    { description: 'Market crash — portfolio down 15%', type: 'finance', probability: 0.03 },
    { description: 'Received annual bonus', type: 'finance', probability: 0.04 },
    { description: 'Unexpected car repair — $2,500', type: 'finance', probability: 0.05 },
    { description: 'Started a side income stream', type: 'finance', probability: 0.03 },
    { description: 'Refinanced student loans', type: 'finance', probability: 0.02 },
  ],
  career: [
    { description: 'Got promoted!', type: 'career', probability: 0.03 },
    { description: 'Completed a high-impact project', type: 'career', probability: 0.07 },
    { description: 'Gave a tech talk at a conference', type: 'career', probability: 0.03 },
    { description: 'Side project launched successfully', type: 'career', probability: 0.04 },
    { description: 'Took on a mentorship role', type: 'career', probability: 0.05 },
    { description: 'Had a tough performance review', type: 'career', probability: 0.03 },
  ],
  wellness: [
    { description: 'Relationship milestone — moved in together', type: 'wellness', probability: 0.02 },
    { description: 'Joined a new social club', type: 'wellness', probability: 0.05 },
    { description: 'Took a rejuvenating vacation', type: 'wellness', probability: 0.04 },
    { description: 'Picked up a creative hobby', type: 'wellness', probability: 0.06 },
    { description: 'Experienced a friendship fallout', type: 'wellness', probability: 0.03 },
    { description: 'Adopted a pet', type: 'wellness', probability: 0.02 },
  ],
};

interface ScenarioModifiers {
  health: (h: HealthMetrics, month: number) => HealthMetrics;
  finance: (f: FinanceMetrics, month: number) => FinanceMetrics;
  career: (c: CareerMetrics, month: number) => CareerMetrics;
  wellness: (w: WellnessMetrics, month: number) => WellnessMetrics;
}

const scenarios: Record<string, ScenarioModifiers> = {
  'Optimize for health': {
    health: (h, _m) => ({
      ...h,
      overall: clamp(h.overall + rand(0.5, 1.5), 0, 100),
      sleep: clamp(h.sleep + rand(0, 0.1), 4, 9),
      exercise: clamp(h.exercise + rand(0.1, 0.3), 0, 7),
      nutrition: clamp(h.nutrition + rand(0.5, 1.5), 0, 100),
      stress: clamp(h.stress - rand(0.5, 1.5), 0, 100),
      heartRate: clamp(h.heartRate - rand(0, 0.3), 55, 100),
      bmi: clamp(h.bmi - rand(0, 0.05), 18, 35),
    }),
    finance: (f, _m) => ({
      ...f,
      expenses: f.expenses + rand(50, 200),
      netWorth: f.netWorth + f.savings * 0.9,
      savings: f.savings * 0.9,
      investments: f.investments * (1 + rand(-0.01, 0.02)),
    }),
    career: (c, _m) => ({
      ...c,
      satisfaction: clamp(c.satisfaction + rand(-0.3, 0.5), 0, 100),
      productivity: clamp(c.productivity + rand(-0.5, 0.3), 0, 100),
      skills: c.skills.map((s) => ({ ...s, level: clamp(s.level + rand(0, 0.3), 0, 100) })),
    }),
    wellness: (w, _m) => ({
      ...w,
      happiness: clamp(w.happiness + rand(0.3, 1.0), 0, 100),
      workLifeBalance: clamp(w.workLifeBalance + rand(0.3, 0.8), 0, 100),
      mindfulness: clamp(w.mindfulness + rand(0.5, 1.2), 0, 100),
    }),
  },
  'Aggressive career growth': {
    health: (h, _m) => ({
      ...h,
      overall: clamp(h.overall - rand(0.2, 0.8), 0, 100),
      sleep: clamp(h.sleep - rand(0, 0.05), 4, 9),
      exercise: clamp(h.exercise - rand(0, 0.1), 0, 7),
      stress: clamp(h.stress + rand(0.3, 1.0), 0, 100),
      heartRate: clamp(h.heartRate + rand(0, 0.2), 55, 100),
      nutrition: clamp(h.nutrition - rand(0, 0.5), 0, 100),
      bmi: h.bmi,
    }),
    finance: (f, m) => ({
      ...f,
      income: f.income * (1 + (m % 6 === 0 ? rand(0.02, 0.08) : 0)),
      netWorth: f.netWorth + f.savings + rand(500, 2000),
      savings: f.savings + rand(100, 500),
      investments: f.investments * (1 + rand(-0.01, 0.03)),
      expenses: f.expenses + rand(0, 100),
      creditScore: clamp(f.creditScore + rand(-1, 2), 300, 850),
      debtRatio: f.debtRatio,
    }),
    career: (c, m) => ({
      ...c,
      satisfaction: clamp(c.satisfaction + rand(0.2, 1.0), 0, 100),
      productivity: clamp(c.productivity + rand(0.3, 1.2), 0, 100),
      skills: c.skills.map((s) => ({ ...s, level: clamp(s.level + rand(0.3, 0.8), 0, 100) })),
      level: m > 0 && m % 18 === 0 ? promoteLevel(c.level) : c.level,
      yearsExperience: c.yearsExperience + 1 / 12,
    }),
    wellness: (w, _m) => ({
      ...w,
      happiness: clamp(w.happiness - rand(0, 0.5), 0, 100),
      workLifeBalance: clamp(w.workLifeBalance - rand(0.3, 0.8), 0, 100),
      socialConnections: clamp(w.socialConnections - rand(0, 0.1), 0, 50),
      mindfulness: clamp(w.mindfulness - rand(0, 0.3), 0, 100),
      hobbies: w.hobbies,
    }),
  },
  'Financial independence': {
    health: (h, _m) => ({
      ...h,
      overall: clamp(h.overall + rand(-0.2, 0.3), 0, 100),
      sleep: h.sleep,
      exercise: h.exercise,
      stress: clamp(h.stress - rand(0, 0.3), 0, 100),
      nutrition: clamp(h.nutrition - rand(0, 0.3), 0, 100),
      heartRate: h.heartRate,
      bmi: h.bmi,
    }),
    finance: (f, _m) => ({
      ...f,
      expenses: f.expenses * 0.995,
      savings: f.savings * 1.02,
      netWorth: f.netWorth + f.savings * 1.1 + f.investments * rand(0.002, 0.01),
      investments: f.investments * (1 + rand(0.003, 0.012)),
      creditScore: clamp(f.creditScore + rand(0, 1), 300, 850),
      debtRatio: clamp(f.debtRatio - rand(0, 0.005), 0, 1),
      income: f.income,
    }),
    career: (c, _m) => ({
      ...c,
      satisfaction: clamp(c.satisfaction + rand(-0.2, 0.3), 0, 100),
      productivity: clamp(c.productivity + rand(-0.1, 0.2), 0, 100),
      skills: c.skills.map((s) => ({ ...s, level: clamp(s.level + rand(0, 0.2), 0, 100) })),
      level: c.level,
      yearsExperience: c.yearsExperience + 1 / 12,
    }),
    wellness: (w, _m) => ({
      ...w,
      happiness: clamp(w.happiness + rand(0, 0.4), 0, 100),
      workLifeBalance: clamp(w.workLifeBalance + rand(0, 0.2), 0, 100),
      mindfulness: clamp(w.mindfulness + rand(0, 0.2), 0, 100),
      socialConnections: w.socialConnections,
      hobbies: w.hobbies,
    }),
  },
  'Balanced lifestyle': {
    health: (h, _m) => ({
      ...h,
      overall: clamp(h.overall + rand(0.1, 0.5), 0, 100),
      sleep: clamp(h.sleep + rand(0, 0.03), 4, 9),
      exercise: clamp(h.exercise + rand(0, 0.05), 0, 7),
      nutrition: clamp(h.nutrition + rand(0.1, 0.4), 0, 100),
      stress: clamp(h.stress - rand(0.1, 0.5), 0, 100),
      heartRate: clamp(h.heartRate - rand(0, 0.1), 55, 100),
      bmi: clamp(h.bmi - rand(0, 0.02), 18, 35),
    }),
    finance: (f, _m) => ({
      ...f,
      netWorth: f.netWorth + f.savings + f.investments * rand(0.001, 0.006),
      savings: f.savings + rand(0, 100),
      investments: f.investments * (1 + rand(0.001, 0.006)),
      expenses: f.expenses + rand(-50, 50),
      creditScore: clamp(f.creditScore + rand(0, 0.5), 300, 850),
      income: f.income,
      debtRatio: f.debtRatio,
    }),
    career: (c, m) => ({
      ...c,
      satisfaction: clamp(c.satisfaction + rand(0.1, 0.5), 0, 100),
      productivity: clamp(c.productivity + rand(0.1, 0.4), 0, 100),
      skills: c.skills.map((s) => ({ ...s, level: clamp(s.level + rand(0.1, 0.4), 0, 100) })),
      level: m > 0 && m % 24 === 0 ? promoteLevel(c.level) : c.level,
      yearsExperience: c.yearsExperience + 1 / 12,
    }),
    wellness: (w, _m) => ({
      ...w,
      happiness: clamp(w.happiness + rand(0.2, 0.6), 0, 100),
      workLifeBalance: clamp(w.workLifeBalance + rand(0.2, 0.6), 0, 100),
      mindfulness: clamp(w.mindfulness + rand(0.2, 0.5), 0, 100),
      socialConnections: clamp(w.socialConnections + rand(0, 0.1), 0, 50),
      hobbies: clamp(w.hobbies + (Math.random() > 0.95 ? 1 : 0), 0, 10),
    }),
  },
  'Start a startup': {
    health: (h, m) => ({
      ...h,
      overall: clamp(h.overall - rand(0.3, 1.0) + (m > 24 ? rand(0, 0.5) : 0), 0, 100),
      sleep: clamp(h.sleep - rand(0, 0.08), 4, 9),
      exercise: clamp(h.exercise - rand(0, 0.15), 0, 7),
      stress: clamp(h.stress + rand(0.5, 2.0) - (m > 24 ? rand(0, 1.0) : 0), 0, 100),
      nutrition: clamp(h.nutrition - rand(0.2, 0.8), 0, 100),
      heartRate: clamp(h.heartRate + rand(0, 0.3), 55, 100),
      bmi: h.bmi,
    }),
    finance: (f, m) => {
      const startupPhase = m < 12;
      const growthPhase = m >= 12 && m < 24;
      const successRoll = Math.random();
      let netWorthDelta = -rand(2000, 5000);
      if (growthPhase) netWorthDelta = rand(-3000, 5000);
      if (m >= 24 && successRoll > 0.3) netWorthDelta = rand(2000, 15000);
      return {
        ...f,
        netWorth: f.netWorth + netWorthDelta,
        income: startupPhase ? f.income * 0.98 : f.income * (1 + rand(-0.02, 0.05)),
        expenses: f.expenses + rand(100, 500),
        savings: clamp(f.savings - rand(200, 800), 0, Infinity),
        investments: f.investments * (1 + rand(-0.02, 0.03)),
        creditScore: clamp(f.creditScore + rand(-2, 1), 300, 850),
        debtRatio: clamp(f.debtRatio + rand(-0.01, 0.02), 0, 1),
      };
    },
    career: (c, m) => ({
      ...c,
      satisfaction: clamp(c.satisfaction + rand(-1.0, 2.0), 0, 100),
      productivity: clamp(c.productivity + rand(-0.5, 1.5), 0, 100),
      skills: c.skills.map((s) => ({
        ...s,
        level: clamp(s.level + rand(0.2, 0.8), 0, 100),
      })),
      level: m >= 12 ? 'Founder' : c.level,
      yearsExperience: c.yearsExperience + 1 / 12,
    }),
    wellness: (w, m) => ({
      ...w,
      happiness: clamp(w.happiness + rand(-1.5, 1.5) + (m > 24 ? rand(0, 1.0) : 0), 0, 100),
      workLifeBalance: clamp(w.workLifeBalance - rand(0.5, 1.5), 0, 100),
      socialConnections: clamp(w.socialConnections - rand(0, 0.2), 0, 50),
      mindfulness: clamp(w.mindfulness - rand(0, 0.5), 0, 100),
      hobbies: clamp(w.hobbies - (Math.random() > 0.9 ? 1 : 0), 0, 10),
    }),
  },
};

function promoteLevel(current: string): string {
  const ladder = ['Junior', 'Mid-Level', 'Senior', 'Staff', 'Principal'];
  const idx = ladder.indexOf(current);
  if (idx >= 0 && idx < ladder.length - 1) return ladder[idx + 1];
  return current;
}

function generateEvents(month: number): string[] {
  const events: string[] = [];
  for (const category of Object.values(LIFE_EVENTS)) {
    for (const event of category) {
      if (Math.random() < event.probability) {
        events.push(event.description);
      }
    }
  }
  if (events.length === 0 && month % 3 === 0) {
    events.push('Quiet month — steady progress');
  }
  return events;
}

export function simulateScenario(
  profile: LifeProfile,
  scenario: string,
  months: number
): Simulation {
  const mods = scenarios[scenario];
  if (!mods) {
    return {
      id: uuidv4(),
      scenario,
      timeline: [],
      status: 'complete',
    };
  }

  const timeline: SimulationPoint[] = [];
  let health = { ...profile.currentState.health };
  let finance = { ...profile.currentState.finance };
  let career = { ...profile.currentState.career, skills: profile.currentState.career.skills.map((s) => ({ ...s })) };
  let wellness = { ...profile.currentState.wellness };

  for (let m = 1; m <= months; m++) {
    health = mods.health(health, m);
    finance = mods.finance(finance, m);
    career = mods.career(career, m);
    wellness = mods.wellness(wellness, m);

    const events = generateEvents(m);

    timeline.push({
      month: m,
      health: { ...health },
      finance: { ...finance },
      career: { ...career, skills: career.skills.map((s) => ({ ...s })) },
      wellness: { ...wellness },
      events,
    });
  }

  return {
    id: uuidv4(),
    scenario,
    timeline,
    status: 'complete',
  };
}

export const scenarioDescriptions: Record<string, { icon: string; description: string; risk: string }> = {
  'Optimize for health': {
    icon: 'Heart',
    description: 'Focus on physical and mental health. More exercise, better sleep, less stress.',
    risk: 'Low',
  },
  'Aggressive career growth': {
    icon: 'TrendingUp',
    description: 'Push hard for promotions, skill growth, and income. Sacrifice work-life balance.',
    risk: 'Medium',
  },
  'Financial independence': {
    icon: 'DollarSign',
    description: 'Maximize savings rate, reduce expenses, grow investments toward FIRE.',
    risk: 'Low',
  },
  'Balanced lifestyle': {
    icon: 'Scale',
    description: 'Moderate improvements across all dimensions. Sustainable long-term growth.',
    risk: 'Low',
  },
  'Start a startup': {
    icon: 'Rocket',
    description: 'Leave stability behind. High risk, high reward. Build something from scratch.',
    risk: 'High',
  },
};
