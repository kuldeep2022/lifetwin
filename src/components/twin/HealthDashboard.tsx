'use client';

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Heart, Moon, Dumbbell, Brain, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn('w-4 h-4', color)} />
        <span className="text-zinc-500 text-xs">{label}</span>
      </div>
      <p className={cn('text-2xl font-bold', color)}>{value}</p>
      {sub && <p className="text-zinc-600 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function HealthDashboard() {
  const profile = useStore((s) => s.profile);
  const activeSimulation = useStore((s) => s.activeSimulation);
  const { health } = profile.currentState;

  const radialData = [
    { name: 'Nutrition', value: health.nutrition, fill: '#34d399' },
    { name: 'Exercise', value: Math.min(100, (health.exercise / 7) * 100), fill: '#6ee7b7' },
    { name: 'Sleep', value: Math.min(100, (health.sleep / 9) * 100), fill: '#a7f3d0' },
    { name: 'Overall', value: health.overall, fill: '#10b981' },
  ];

  const timelineData = activeSimulation
    ? activeSimulation.timeline.map((pt) => ({
        month: `M${pt.month}`,
        overall: Math.round(pt.health.overall),
        sleep: Math.round((pt.health.sleep / 9) * 100),
        stress: Math.round(pt.health.stress),
        exercise: Math.round((pt.health.exercise / 7) * 100),
      }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
        <Heart className="w-5 h-5" />
        Health Dashboard
      </h2>

      <div className="grid grid-cols-4 gap-3">
        <StatCard icon={Activity} label="Heart Rate" value={`${health.heartRate}`} sub="bpm" color="text-emerald-400" />
        <StatCard icon={Brain} label="Stress Level" value={`${health.stress}`} sub="/100" color="text-emerald-400" />
        <StatCard icon={Moon} label="Sleep" value={`${health.sleep}h`} sub="per night" color="text-emerald-400" />
        <StatCard icon={Dumbbell} label="Exercise" value={`${health.exercise}x`} sub="per week" color="text-emerald-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Health Scores</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                data={radialData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={4}
                  background={{ fill: '#27272a' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#a1a1aa',
                    fontSize: '12px',
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {radialData.map((d) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-[10px] text-zinc-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">
            {timelineData.length > 0 ? 'Health Over Time' : 'Run a simulation to see trends'}
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
                  <Line type="monotone" dataKey="overall" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sleep" stroke="#6ee7b7" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="exercise" stroke="#34d399" strokeWidth={1.5} dot={false} />
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
        <p className="text-zinc-500 text-xs mb-3 uppercase tracking-wider">BMI & Body Metrics</p>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-3xl font-bold text-emerald-400">{health.bmi}</p>
            <p className="text-zinc-600 text-xs">BMI</p>
          </div>
          <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${((health.bmi - 15) / 25) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex gap-4 text-[10px] text-zinc-500">
            <span>Underweight &lt;18.5</span>
            <span className="text-emerald-400">Normal 18.5-25</span>
            <span>Overweight &gt;25</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
