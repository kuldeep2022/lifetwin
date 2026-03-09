'use client';

import { useStore } from '@/lib/store';
import ProfileCard from '@/components/twin/ProfileCard';
import HealthDashboard from '@/components/twin/HealthDashboard';
import FinanceDashboard from '@/components/twin/FinanceDashboard';
import CareerDashboard from '@/components/twin/CareerDashboard';
import WellnessDashboard from '@/components/twin/WellnessDashboard';
import TimelineView from '@/components/twin/TimelineView';
import SimulationPanel from '@/components/twin/SimulationPanel';
import LifeEventsFeed from '@/components/twin/LifeEventsFeed';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Activity,
  Heart,
  DollarSign,
  Briefcase,
  Smile,
  LayoutGrid,
  Loader2,
} from 'lucide-react';
import type { Dimension } from '@/lib/types';

const TABS: { key: Dimension; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid, color: 'text-teal-400' },
  { key: 'health', label: 'Health', icon: Heart, color: 'text-emerald-400' },
  { key: 'finance', label: 'Finance', icon: DollarSign, color: 'text-blue-400' },
  { key: 'career', label: 'Career', icon: Briefcase, color: 'text-purple-400' },
  { key: 'wellness', label: 'Wellness', icon: Smile, color: 'text-amber-400' },
];

function DimensionContent({ dimension }: { dimension: Dimension }) {
  switch (dimension) {
    case 'health':
      return <HealthDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    case 'career':
      return <CareerDashboard />;
    case 'wellness':
      return <WellnessDashboard />;
    case 'overview':
    default:
      return <TimelineView />;
  }
}

export default function SimulatorPage() {
  const selectedDimension = useStore((s) => s.selectedDimension);
  const setDimension = useStore((s) => s.setDimension);
  const isSimulating = useStore((s) => s.isSimulating);
  const activeSimulation = useStore((s) => s.activeSimulation);
  const profile = useStore((s) => s.profile);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top Bar */}
      <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-xs tracking-wider">LIFETWIN</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">{profile.name}</span>
            {isSimulating && (
              <div className="flex items-center gap-1.5 text-teal-400">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[10px]">Simulating...</span>
              </div>
            )}
            {activeSimulation && !isSimulating && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400">
                  {activeSimulation.scenario}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1400px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-72 shrink-0 border-r border-zinc-900 p-4 space-y-4 overflow-y-auto">
          <ProfileCard />

          <div className="space-y-1">
            <p className="text-[10px] text-zinc-600 uppercase tracking-widest px-2 mb-2">
              Dimensions
            </p>
            {TABS.map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setDimension(tab.key)}
                whileHover={{ x: 2 }}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors text-xs',
                  selectedDimension === tab.key
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                )}
              >
                <tab.icon
                  className={cn(
                    'w-3.5 h-3.5',
                    selectedDimension === tab.key ? tab.color : 'text-zinc-600'
                  )}
                />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <DimensionContent dimension={selectedDimension} />

          {/* Events feed at bottom when simulation active */}
          {activeSimulation && !isSimulating && (
            <div className="mt-6">
              <LifeEventsFeed />
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 shrink-0 border-l border-zinc-900 p-4 overflow-y-auto">
          <SimulationPanel />
        </aside>
      </div>
    </div>
  );
}
