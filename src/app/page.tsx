'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  DollarSign,
  Briefcase,
  Smile,
  GitBranch,
  Brain,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Heart,
    title: 'Health Modeling',
    description: 'Track and simulate physical health, sleep, exercise, stress, and nutrition trajectories.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: DollarSign,
    title: 'Financial Projections',
    description: 'Model net worth growth, investment returns, savings rates, and expense optimization.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Briefcase,
    title: 'Career Trajectories',
    description: 'Visualize skill growth, promotion paths, and career satisfaction over time.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Smile,
    title: 'Wellness Tracking',
    description: 'Monitor happiness, work-life balance, social connections, and mindfulness.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: GitBranch,
    title: 'What-If Scenarios',
    description: 'Run divergent life simulations: startup, career push, health focus, or balanced growth.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    icon: Brain,
    title: 'AI Predictions',
    description: 'Intelligent modeling with momentum, randomness, and realistic life event generation.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm tracking-wider">LIFETWIN</span>
          </div>
          <Link
            href="/simulator"
            className="text-xs text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
          >
            Launch Simulator <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs text-teal-400">Digital Life Simulator</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your{' '}
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Digital Twin
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Simulate your life decisions before you make them. Model health, finance, career, and
              wellness trajectories with AI-powered predictions.
            </p>

            <Link href="/simulator">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl font-medium text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 mx-auto"
              >
                Start Simulating
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Decorative grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-4 gap-2 max-w-lg mx-auto"
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.03 }}
              >
                <div
                  className="w-full h-full rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${
                      ['#10b981', '#3b82f6', '#a855f7', '#f59e0b'][i % 4]
                    }08, transparent)`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold mb-3">Four Dimensions of Life</h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">
              A comprehensive model of your life across health, finance, career, and wellness.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={cn(
                  'p-5 rounded-2xl border transition-colors',
                  feature.bg,
                  feature.border
                )}
              >
                <feature.icon className={cn('w-8 h-8 mb-3', feature.color)} />
                <h3 className="font-semibold text-sm mb-2 text-white">{feature.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-800 rounded-3xl p-10"
        >
          <Activity className="w-10 h-10 text-teal-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to see your future?</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Run your first life simulation and explore what-if scenarios across every dimension.
          </p>
          <Link href="/simulator">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl font-medium text-sm transition-all shadow-lg shadow-teal-500/20"
            >
              Launch Simulator
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-600">
          <span>LifeTwin -- Digital Life Simulator</span>
          <span>Built by Kuldeep Dave</span>
        </div>
      </footer>
    </div>
  );
}
