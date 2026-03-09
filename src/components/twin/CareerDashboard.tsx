'use client';

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Briefcase, Award, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const CAREER_LEVELS = ['Junior', 'Mid-Level', 'Senior', 'Staff', 'Principal'];

export default function CareerDashboard() {
  const profile = useStore((s) => s.profile);
  const activeSimulation = useStore((s) => s.activeSimulation);
  const { career } = profile.currentState;

  const radarData = career.skills.map((s) => ({
    skill: s.name,
    level: s.level,
    fullMark: 100,
  }));

  const timelineData = activeSimulation
    ? activeSimulation.timeline.map((pt) => ({
        month: `M${pt.month}`,
        satisfaction: Math.round(pt.career.satisfaction),
        productivity: Math.round(pt.career.productivity),
      }))
    : [];

  const currentLevelIdx = CAREER_LEVELS.indexOf(career.level);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
        <Briefcase className="w-5 h-5" />
        Career Dashboard
      </h2>

      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Award, label: 'Level', value: career.level },
          { icon: TrendingUp, label: 'Satisfaction', value: `${career.satisfaction}%` },
          { icon: Zap, label: 'Productivity', value: `${career.productivity}%` },
          { icon: Briefcase, label: 'Experience', value: `${career.yearsExperience} yrs` },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className="w-4 h-4 text-purple-400" />
              <span className="text-zinc-500 text-xs">{item.label}</span>
            </div>
            <p className="text-xl font-bold text-purple-400">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Skills Radar</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#a1a1aa' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#52525b' }} />
                <Radar
                  name="Skills"
                  dataKey="level"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">
            {timelineData.length > 0 ? 'Career Metrics Over Time' : 'Run simulation to see trends'}
          </p>
          <div className="h-64">
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
                  <Line type="monotone" dataKey="satisfaction" stroke="#a855f7" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="productivity" stroke="#c084fc" strokeWidth={1.5} dot={false} />
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
        <p className="text-zinc-500 text-xs mb-4 uppercase tracking-wider">Skill Levels</p>
        <div className="space-y-3">
          {career.skills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 w-28 shrink-0">{skill.name}</span>
              <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.1 }}
                />
              </div>
              <span className="text-xs text-purple-400 font-mono w-8 text-right">{skill.level}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-zinc-500 text-xs mb-4 uppercase tracking-wider">Career Trajectory</p>
        <div className="flex items-center gap-2">
          {CAREER_LEVELS.map((level, i) => (
            <div key={level} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'flex-1 flex flex-col items-center gap-1',
              )}>
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2',
                  i <= currentLevelIdx
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-600'
                )}>
                  {i + 1}
                </div>
                <span className={cn(
                  'text-[10px]',
                  i <= currentLevelIdx ? 'text-purple-400' : 'text-zinc-600'
                )}>
                  {level}
                </span>
              </div>
              {i < CAREER_LEVELS.length - 1 && (
                <div className={cn(
                  'h-0.5 w-full',
                  i < currentLevelIdx ? 'bg-purple-500' : 'bg-zinc-700'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
