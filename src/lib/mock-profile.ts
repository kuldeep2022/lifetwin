import { LifeProfile } from './types';

export const defaultProfile: LifeProfile = {
  id: 'profile-001',
  name: 'Alex Chen',
  age: 28,
  occupation: 'Software Engineer',
  currentState: {
    health: {
      overall: 75,
      sleep: 7,
      exercise: 3,
      nutrition: 70,
      stress: 45,
      heartRate: 72,
      bmi: 23.5,
    },
    finance: {
      netWorth: 85000,
      income: 145000,
      expenses: 6000,
      savings: 2000,
      investments: 45000,
      debtRatio: 0.15,
      creditScore: 740,
    },
    career: {
      satisfaction: 72,
      skills: [
        { name: 'TypeScript', level: 85, category: 'Technical' },
        { name: 'React', level: 80, category: 'Technical' },
        { name: 'Python', level: 70, category: 'Technical' },
        { name: 'System Design', level: 65, category: 'Architecture' },
        { name: 'Leadership', level: 50, category: 'Soft Skills' },
      ],
      level: 'Mid-Level',
      yearsExperience: 5,
      productivity: 75,
    },
    wellness: {
      happiness: 70,
      socialConnections: 12,
      hobbies: 3,
      workLifeBalance: 60,
      mindfulness: 40,
    },
    timestamp: new Date().toISOString(),
  },
};
