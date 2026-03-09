'use client';

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard, PiggyBank, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string;
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
      <p className={cn('text-xl font-bold', color)}>{value}</p>
    </motion.div>
  );
}

const EXPENSE_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#2563eb'];

export default function FinanceDashboard() {
  const profile = useStore((s) => s.profile);
  const activeSimulation = useStore((s) => s.activeSimulation);
  const { finance } = profile.currentState;

  const savingsRate = ((finance.savings / (finance.income / 12)) * 100).toFixed(0);

  const expenseBreakdown = [
    { name: 'Housing', value: finance.expenses * 0.35 },
    { name: 'Food', value: finance.expenses * 0.2 },
    { name: 'Transport', value: finance.expenses * 0.15 },
    { name: 'Entertainment', value: finance.expenses * 0.15 },
    { name: 'Savings', value: finance.savings },
  ];

  const investmentBreakdown = [
    { name: 'Stocks', value: finance.investments * 0.5 },
    { name: 'Bonds', value: finance.investments * 0.2 },
    { name: 'Crypto', value: finance.investments * 0.15 },
    { name: 'Real Estate', value: finance.investments * 0.15 },
  ];

  const netWorthTimeline = activeSimulation
    ? activeSimulation.timeline.map((pt) => ({
        month: `M${pt.month}`,
        netWorth: Math.round(pt.finance.netWorth),
        investments: Math.round(pt.finance.investments),
      }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Finance Dashboard
      </h2>

      <div className="grid grid-cols-5 gap-3">
        <StatCard icon={Wallet} label="Net Worth" value={formatCurrency(finance.netWorth)} color="text-blue-400" />
        <StatCard icon={TrendingUp} label="Income" value={`${formatCurrency(finance.income)}/yr`} color="text-blue-400" />
        <StatCard icon={DollarSign} label="Expenses" value={`${formatCurrency(finance.expenses)}/mo`} color="text-blue-400" />
        <StatCard icon={PiggyBank} label="Savings Rate" value={`${savingsRate}%`} color="text-blue-400" />
        <StatCard icon={CreditCard} label="Credit Score" value={`${finance.creditScore}`} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">
            {netWorthTimeline.length > 0 ? 'Net Worth Projection' : 'Run simulation for projections'}
          </p>
          <div className="h-56">
            {netWorthTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={netWorthTimeline}>
                  <defs>
                    <linearGradient id="netWorthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#52525b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#52525b" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      color: '#a1a1aa',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                  />
                  <Area type="monotone" dataKey="netWorth" stroke="#3b82f6" strokeWidth={2} fill="url(#netWorthGrad)" />
                  <Area type="monotone" dataKey="investments" stroke="#60a5fa" strokeWidth={1.5} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                No simulation data yet
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Monthly Expense Breakdown</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {expenseBreakdown.map((_, i) => (
                    <Cell key={i} fill={EXPENSE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#a1a1aa',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {expenseBreakdown.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: EXPENSE_COLORS[i] }} />
                <span className="text-[10px] text-zinc-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">Investment Portfolio</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={investmentBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" stroke="#52525b" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <YAxis type="category" dataKey="name" stroke="#52525b" tick={{ fontSize: 11 }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  color: '#a1a1aa',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatCurrency(Number(value)), '']}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
