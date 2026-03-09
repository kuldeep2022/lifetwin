import { create } from 'zustand';
import { LifeProfile, Simulation, Dimension } from './types';
import { defaultProfile } from './mock-profile';
import { simulateScenario } from './simulator';

interface LifeTwinStore {
  profile: LifeProfile;
  simulations: Simulation[];
  activeSimulation: Simulation | null;
  selectedDimension: Dimension;
  isSimulating: boolean;
  timelineMonth: number;
  updateProfile: (profile: Partial<LifeProfile>) => void;
  startSimulation: (scenario: string, months: number) => void;
  setDimension: (dimension: Dimension) => void;
  setTimelineMonth: (month: number) => void;
  completeSimulation: () => void;
  setActiveSimulation: (sim: Simulation | null) => void;
}

export const useStore = create<LifeTwinStore>((set, get) => ({
  profile: defaultProfile,
  simulations: [],
  activeSimulation: null,
  selectedDimension: 'overview',
  isSimulating: false,
  timelineMonth: 0,

  updateProfile: (partial) =>
    set((state) => ({
      profile: { ...state.profile, ...partial },
    })),

  startSimulation: (scenario, months) => {
    set({ isSimulating: true, timelineMonth: 0 });
    const profile = get().profile;
    // Simulate with a small delay for UX
    setTimeout(() => {
      const simulation = simulateScenario(profile, scenario, months);
      set((state) => ({
        simulations: [...state.simulations, simulation],
        activeSimulation: simulation,
        isSimulating: false,
        timelineMonth: simulation.timeline.length,
      }));
    }, 1500);
  },

  setDimension: (dimension) => set({ selectedDimension: dimension }),

  setTimelineMonth: (month) => set({ timelineMonth: month }),

  completeSimulation: () =>
    set((state) => ({
      activeSimulation: state.activeSimulation
        ? { ...state.activeSimulation, status: 'complete' as const }
        : null,
      isSimulating: false,
    })),

  setActiveSimulation: (sim) => set({ activeSimulation: sim }),
}));
