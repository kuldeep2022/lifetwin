'use client';

import { useStore } from '@/lib/store';
import { cn, getScoreColor } from '@/lib/utils';
import { motion } from 'framer-motion';
import { User, Heart, DollarSign, Briefcase, Smile } from 'lucide-react';

function MiniGauge({ label, value, color }: { label: string; value: number; color: string }) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#27272a" strokeWidth="4" />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <span className={cn('absolute inset-0 flex items-center justify-center text-xs font-bold', getScoreColor(value))}>
          {Math.round(value)}
        </span>
      </div>
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

export default function ProfileCard() {
  const profile = useStore((s) => s.profile);
  const { health, finance, career, wellness } = profile.currentState;

  const healthScore = health.overall;
  const financeScore = Math.min(100, (finance.creditScore / 850) * 100);
  const careerScore = career.satisfaction;
  const wellnessScore = wellness.happiness;
  const overallScore = Math.round((healthScore + financeScore + careerScore + wellnessScore) / 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{profile.name}</h3>
          <p className="text-zinc-500 text-xs">
            {profile.age}y/o &middot; {profile.occupation}
          </p>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">Life Score</p>
        <span className={cn('text-3xl font-bold', getScoreColor(overallScore))}>{overallScore}</span>
        <span className="text-zinc-600 text-sm">/100</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <MiniGauge label="Health" value={healthScore} color="#10b981" />
        <MiniGauge label="Finance" value={financeScore} color="#3b82f6" />
        <MiniGauge label="Career" value={careerScore} color="#a855f7" />
        <MiniGauge label="Wellness" value={wellnessScore} color="#f59e0b" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { icon: Heart, label: 'Heart Rate', value: `${health.heartRate} bpm`, color: 'text-emerald-400' },
          { icon: DollarSign, label: 'Net Worth', value: `$${(finance.netWorth / 1000).toFixed(0)}K`, color: 'text-blue-400' },
          { icon: Briefcase, label: 'Level', value: career.level, color: 'text-purple-400' },
          { icon: Smile, label: 'Happiness', value: `${wellness.happiness}%`, color: 'text-amber-400' },
        ].map((item) => (
          <div key={item.label} className="bg-zinc-800/50 rounded-lg p-2 flex items-center gap-2">
            <item.icon className={cn('w-3.5 h-3.5', item.color)} />
            <div>
              <p className="text-[10px] text-zinc-500">{item.label}</p>
              <p className={cn('text-xs font-medium', item.color)}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
