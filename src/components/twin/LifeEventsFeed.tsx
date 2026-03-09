'use client';

import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Heart,
  DollarSign,
  Briefcase,
  Smile,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

function getEventType(description: string): 'health' | 'finance' | 'career' | 'wellness' {
  const lower = description.toLowerCase();
  if (lower.includes('fitness') || lower.includes('flu') || lower.includes('meditation') || lower.includes('burnout') || lower.includes('marathon') || lower.includes('diet') || lower.includes('meal'))
    return 'health';
  if (lower.includes('market') || lower.includes('bonus') || lower.includes('repair') || lower.includes('income') || lower.includes('refinance') || lower.includes('portfolio'))
    return 'finance';
  if (lower.includes('promot') || lower.includes('project') || lower.includes('talk') || lower.includes('side project') || lower.includes('mentor') || lower.includes('review'))
    return 'career';
  return 'wellness';
}

function getEventSentiment(description: string): 'positive' | 'negative' | 'neutral' {
  const positive = ['started', 'completed', 'promoted', 'rally', 'bonus', 'launched', 'milestone', 'joined', 'vacation', 'hobby', 'improved', 'adopted', 'mentorship', 'rejuven'];
  const negative = ['crash', 'flu', 'burnout', 'repair', 'fallout', 'tough', 'down'];
  const lower = description.toLowerCase();
  if (positive.some((w) => lower.includes(w))) return 'positive';
  if (negative.some((w) => lower.includes(w))) return 'negative';
  return 'neutral';
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  health: Heart,
  finance: DollarSign,
  career: Briefcase,
  wellness: Smile,
};

const TYPE_COLORS: Record<string, string> = {
  health: 'text-emerald-400',
  finance: 'text-blue-400',
  career: 'text-purple-400',
  wellness: 'text-amber-400',
};

const SENTIMENT_CONFIG: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
  positive: { icon: TrendingUp, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  negative: { icon: TrendingDown, bg: 'bg-red-500/10', text: 'text-red-400' },
  neutral: { icon: Minus, bg: 'bg-zinc-800', text: 'text-zinc-500' },
};

export default function LifeEventsFeed() {
  const activeSimulation = useStore((s) => s.activeSimulation);

  if (!activeSimulation) return null;

  // Collect all events from the timeline
  const allEvents = activeSimulation.timeline.flatMap((pt) =>
    pt.events.map((desc) => ({
      month: pt.month,
      description: desc,
      type: getEventType(desc),
      sentiment: getEventSentiment(desc),
    }))
  );

  if (allEvents.length === 0) return null;

  // Show latest 20 events, reversed (newest first)
  const displayEvents = allEvents.slice(-20).reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-teal-400" />
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Life Events</h3>
        <span className="text-[10px] text-zinc-600 ml-auto">{allEvents.length} events</span>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
        <AnimatePresence>
          {displayEvents.map((ev, i) => {
            const Icon = TYPE_ICONS[ev.type];
            const sentimentConfig = SENTIMENT_CONFIG[ev.sentiment];
            const SentimentIcon = sentimentConfig.icon;
            return (
              <motion.div
                key={`${ev.month}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg',
                  sentimentConfig.bg
                )}
              >
                <Icon className={cn('w-3.5 h-3.5 shrink-0', TYPE_COLORS[ev.type])} />
                <span className="text-[11px] text-zinc-300 flex-1">{ev.description}</span>
                <SentimentIcon className={cn('w-3 h-3 shrink-0', sentimentConfig.text)} />
                <span className="text-[10px] text-zinc-600 font-mono shrink-0">M{ev.month}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
