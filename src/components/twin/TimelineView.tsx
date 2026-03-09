'use client';

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { Activity, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TimelineView() {
  const activeSimulation = useStore((s) => s.activeSimulation);
  const profile = useStore((s) => s.profile);
  const timelineMonth = useStore((s) => s.timelineMonth);

  if (!activeSimulation || activeSimulation.timeline.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full text-center py-20"
      >
        <Activity className="w-16 h-16 text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-500 mb-2">No Active Simulation</h3>
        <p className="text-sm text-zinc-600 max-w-md">
          Select a scenario from the right panel and run a simulation to see your life trajectories
          across all dimensions.
        </p>
      </motion.div>
    );
  }

  const data = activeSimulation.timeline.map((pt) => {
    const financeScore = Math.min(100, (pt.finance.creditScore / 850) * 100);
    return {
      month: pt.month,
      health: Math.round(pt.health.overall),
      finance: Math.round(financeScore),
      career: Math.round(pt.career.satisfaction),
      wellness: Math.round(pt.wellness.happiness),
      hasEvent: pt.events.length > 0,
      events: pt.events,
      netWorth: pt.finance.netWorth,
    };
  });

  // Find event months for markers
  const eventMonths = data.filter((d) => d.hasEvent);

  const currentPoint = timelineMonth > 0 ? data[timelineMonth - 1] : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-400" />
          Life Timeline — {activeSimulation.scenario}
        </h2>
        {currentPoint && (
          <div className="flex gap-3 text-xs">
            <span className="text-emerald-400">Health: {currentPoint.health}</span>
            <span className="text-blue-400">Finance: {currentPoint.finance}</span>
            <span className="text-purple-400">Career: {currentPoint.career}</span>
            <span className="text-amber-400">Wellness: {currentPoint.wellness}</span>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="month"
                stroke="#52525b"
                tick={{ fontSize: 10 }}
                label={{ value: 'Month', position: 'insideBottom', offset: -5, style: { fill: '#52525b', fontSize: 11 } }}
              />
              <YAxis stroke="#52525b" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#a1a1aa',
                  fontSize: '12px',
                }}
                labelFormatter={(label) => `Month ${label}`}
                formatter={(value, name) => {
                  const colors: Record<string, string> = {
                    health: '#10b981',
                    finance: '#3b82f6',
                    career: '#a855f7',
                    wellness: '#f59e0b',
                  };
                  const n = String(name);
                  return [<span key={n} style={{ color: colors[n] || '#fff' }}>{String(value)}</span>, n];
                }}
              />
              <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="finance" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="career" stroke="#a855f7" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="wellness" stroke="#f59e0b" strokeWidth={2} dot={false} />
              {eventMonths.slice(0, 20).map((em) => (
                <ReferenceDot
                  key={em.month}
                  x={em.month}
                  y={em.health}
                  r={3}
                  fill="#10b981"
                  stroke="none"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center gap-6 mt-3">
          {[
            { label: 'Health', color: '#10b981' },
            { label: 'Finance', color: '#3b82f6' },
            { label: 'Career', color: '#a855f7' },
            { label: 'Wellness', color: '#f59e0b' },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-[11px] text-zinc-500">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {currentPoint && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Health Score', value: currentPoint.health, color: 'text-emerald-400', border: 'border-emerald-500/20' },
            { label: 'Finance Score', value: currentPoint.finance, color: 'text-blue-400', border: 'border-blue-500/20' },
            { label: 'Career Score', value: currentPoint.career, color: 'text-purple-400', border: 'border-purple-500/20' },
            { label: 'Wellness Score', value: currentPoint.wellness, color: 'text-amber-400', border: 'border-amber-500/20' },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-zinc-900 border ${item.border} rounded-xl p-3 text-center`}
            >
              <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-zinc-600 text-[10px] mt-1">Month {timelineMonth}</p>
            </motion.div>
          ))}
        </div>
      )}

      {currentPoint && currentPoint.netWorth && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
          <span className="text-zinc-500 text-xs">Projected Net Worth at Month {timelineMonth}: </span>
          <span className="text-blue-400 font-bold">{formatCurrency(currentPoint.netWorth)}</span>
        </div>
      )}
    </motion.div>
  );
}
