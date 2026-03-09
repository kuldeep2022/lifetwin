'use client';

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Smile, Users, Palette, Scale, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

function GaugeCard({ label, value, icon: Icon, max = 100 }: {
  label: string;
  value: number;
  icon: React.ElementType;
  max?: number;
}) {
  const pct = (value / max) * 100;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-amber-400" />
        <span className="text-zinc-500 text-xs">{label}</span>
      </div>
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#27272a" strokeWidth="5" />
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-amber-400">
          {Math.round(value)}
        </span>
      </div>
    </div>
  );
}

export default function WellnessDashboard() {
  const profile = useStore((s) => s.profile);
  const activeSimulation = useStore((s) => s.activeSimulation);
  const { wellness } = profile.currentState;

  const barData = [
    { name: 'Social', value: wellness.socialConnections },
    { name: 'Hobbies', value: wellness.hobbies },
    { name: 'Balance', value: wellness.workLifeBalance },
    { name: 'Mindful', value: wellness.mindfulness },
  ];

  const timelineData = activeSimulation
    ? activeSimulation.timeline.map((pt) => ({
        month: `M${pt.month}`,
        happiness: Math.round(pt.wellness.happiness),
        balance: Math.round(pt.wellness.workLifeBalance),
        mindfulness: Math.round(pt.wellness.mindfulness),
      }))
    : [];

  // Generate a mood heatmap grid (7x5 = 5 weeks)
  const moodGrid = useMemo(() => {
    const grid: number[] = [];
    for (let i = 0; i < 35; i++) {
      const base = wellness.happiness / 100;
      grid.push(Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.4)));
    }
    return grid;
  }, [wellness.happiness]);

  function getMoodColor(val: number): string {
    if (val >= 0.8) return 'bg-amber-400';
    if (val >= 0.6) return 'bg-amber-500/70';
    if (val >= 0.4) return 'bg-amber-600/50';
    if (val >= 0.2) return 'bg-amber-700/30';
    return 'bg-zinc-700';
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
        <Smile className="w-5 h-5" />
        Wellness Dashboard
      </h2>

      <div className="grid grid-cols-3 gap-3">
        <GaugeCard label="Happiness" value={wellness.happiness} icon={Smile} />
        <GaugeCard label="Work-Life Balance" value={wellness.workLifeBalance} icon={Scale} />
        <GaugeCard label="Mindfulness" value={wellness.mindfulness} icon={Brain} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Social & Activities</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#52525b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#52525b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#a1a1aa',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">
            {timelineData.length > 0 ? 'Wellness Over Time' : 'Run simulation to see trends'}
          </p>
          <div className="h-56">
            {timelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#52525b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#52525b" tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#a1a1aa',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="happiness" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="balance" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="mindfulness" stroke="#d97706" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                No simulation data yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-zinc-500 text-xs mb-3 uppercase tracking-wider">Mood Calendar</p>
        <div className="grid grid-cols-7 gap-1.5 max-w-xs mx-auto">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[10px] text-zinc-600 mb-1">{day}</div>
          ))}
          {moodGrid.map((val, i) => (
            <motion.div
              key={i}
              className={cn('w-full aspect-square rounded-sm', getMoodColor(val))}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.01 }}
            />
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-3">
          <span className="text-[10px] text-zinc-500">Low</span>
          {['bg-zinc-700', 'bg-amber-700/30', 'bg-amber-600/50', 'bg-amber-500/70', 'bg-amber-400'].map((c, i) => (
            <div key={i} className={cn('w-3 h-3 rounded-sm', c)} />
          ))}
          <span className="text-[10px] text-zinc-500">High</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-500 text-xs">Social Connections</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{wellness.socialConnections}</p>
          <p className="text-zinc-600 text-xs mt-1">Active relationships</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-500 text-xs">Hobbies</span>
          </div>
          <p className="text-3xl font-bold text-amber-400">{wellness.hobbies}</p>
          <p className="text-zinc-600 text-xs mt-1">Active hobbies & interests</p>
        </div>
      </div>
    </motion.div>
  );
}
