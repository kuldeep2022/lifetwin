'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { scenarioDescriptions } from '@/lib/simulator';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Heart,
  TrendingUp,
  DollarSign,
  Scale,
  Rocket,
  Play,
  Loader2,
} from 'lucide-react';

const SCENARIO_ICONS: Record<string, React.ElementType> = {
  Heart: Heart,
  TrendingUp: TrendingUp,
  DollarSign: DollarSign,
  Scale: Scale,
  Rocket: Rocket,
};

const RISK_COLORS: Record<string, string> = {
  Low: 'text-emerald-400 bg-emerald-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  High: 'text-red-400 bg-red-400/10',
};

export default function SimulationPanel() {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [months, setMonths] = useState(24);
  const isSimulating = useStore((s) => s.isSimulating);
  const startSimulation = useStore((s) => s.startSimulation);
  const activeSimulation = useStore((s) => s.activeSimulation);
  const timelineMonth = useStore((s) => s.timelineMonth);
  const setTimelineMonth = useStore((s) => s.setTimelineMonth);

  const handleRun = () => {
    if (!selectedScenario) return;
    startSimulation(selectedScenario, months);
  };

  const currentEvents =
    activeSimulation && timelineMonth > 0
      ? activeSimulation.timeline[timelineMonth - 1]?.events || []
      : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-4"
    >
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Scenarios</h3>

      <div className="space-y-2">
        {Object.entries(scenarioDescriptions).map(([name, meta]) => {
          const Icon = SCENARIO_ICONS[meta.icon] || Scale;
          const isSelected = selectedScenario === name;
          return (
            <motion.button
              key={name}
              onClick={() => setSelectedScenario(name)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full text-left p-3 rounded-xl border transition-colors',
                isSelected
                  ? 'border-teal-500/50 bg-teal-500/10'
                  : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn('w-4 h-4', isSelected ? 'text-teal-400' : 'text-zinc-500')} />
                <span className={cn('text-xs font-medium', isSelected ? 'text-teal-400' : 'text-zinc-300')}>
                  {name}
                </span>
                <span className={cn('ml-auto text-[10px] px-1.5 py-0.5 rounded-full', RISK_COLORS[meta.risk])}>
                  {meta.risk}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">{meta.description}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Timeline</span>
          <span className="text-xs text-teal-400 font-mono">{months} months</span>
        </div>
        <input
          type="range"
          min={6}
          max={60}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-teal-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-600">
          <span>6mo</span>
          <span>60mo</span>
        </div>
      </div>

      <motion.button
        onClick={handleRun}
        disabled={!selectedScenario || isSimulating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors',
          selectedScenario && !isSimulating
            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-500 hover:to-emerald-500'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
        )}
      >
        {isSimulating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Simulating...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Run Simulation
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isSimulating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-1">Running {months}-month simulation...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {activeSimulation && !isSimulating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Browse Timeline</span>
            <span className="text-xs text-teal-400 font-mono">
              Month {timelineMonth}/{activeSimulation.timeline.length}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={activeSimulation.timeline.length}
            value={timelineMonth}
            onChange={(e) => setTimelineMonth(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-teal-500"
          />

          {currentEvents.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Events</p>
              {currentEvents.map((ev, i) => (
                <div key={i} className="text-[11px] text-zinc-400 bg-zinc-800/50 rounded-lg px-2 py-1">
                  {ev}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
