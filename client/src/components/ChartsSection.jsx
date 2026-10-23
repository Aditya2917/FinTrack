import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Sparkles } from 'lucide-react';

const CustomPieTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl dark:bg-slate-900/95 bg-white/95 border dark:border-slate-700 border-slate-200 p-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span className="text-xs font-bold dark:text-white text-slate-900">{data.name}</span>
        </div>
        <p className="mt-1 text-sm font-extrabold text-emerald-500">
          {formatCurrency(data.value, currency)}
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl dark:bg-slate-900/95 bg-white/95 border dark:border-slate-700 border-slate-200 p-3 shadow-2xl backdrop-blur-md space-y-1">
        <p className="text-xs font-bold dark:text-slate-300 text-slate-700">{label}</p>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: item.color }}>
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}:
            </span>
            <span className="font-bold dark:text-white text-slate-900">
              {formatCurrency(item.value, currency)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartsSection = () => {
  const { categoryBreakdown, monthlyTrends } = useTransactions();
  const { currency, theme } = useAuth();

  const totalExpenseVal = categoryBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Category Expenses Donut Chart */}
      <div className="lg:col-span-5 rounded-2xl glass-card p-5 flex flex-col justify-between transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                <PieIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold dark:text-white text-slate-900">Expenses by Category</h3>
                <p className="text-xs dark:text-slate-400 text-slate-500">Distribution of spending</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-600">
              {categoryBreakdown.length} Categories
            </span>
          </div>

          <div className="h-64 w-full mt-2 relative flex items-center justify-center">
            {categoryBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip currency={currency} />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Total</span>
                  <span className="text-base font-extrabold dark:text-white text-slate-900">
                    {formatCurrency(totalExpenseVal, currency)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center dark:text-slate-500 text-slate-400 text-xs py-12">
                No expense data in this timeframe
              </div>
            )}
          </div>
        </div>

        {/* Legend Pills */}
        <div className="mt-4 pt-3 border-t dark:border-slate-800 border-slate-200 grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
          {categoryBreakdown.slice(0, 6).map((item) => {
            const pct = totalExpenseVal > 0 ? Math.round((item.value / totalExpenseVal) * 100) : 0;
            return (
              <div key={item.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg dark:bg-slate-900/60 bg-slate-100 dark:border-slate-800/60 border-slate-200 border">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="dark:text-slate-300 text-slate-700 truncate">{item.name}</span>
                </div>
                <span className="dark:text-slate-400 text-slate-500 font-bold ml-1">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trends Cash Flow Bar Chart */}
      <div className="lg:col-span-7 rounded-2xl glass-card p-5 flex flex-col justify-between transition-colors duration-200">
        <div>
          <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold dark:text-white text-slate-900">Monthly Cash Flow Trends</h3>
                <p className="text-xs dark:text-slate-400 text-slate-500">Income vs Expenses over recent months</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                <span className="dark:text-slate-300 text-slate-700 font-medium">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                <span className="dark:text-slate-300 text-slate-700 font-medium">Expense</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full mt-4">
            {monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: theme === 'dark' ? '#334155' : '#cbd5e1' }}
                  />
                  <YAxis
                    stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: theme === 'dark' ? '#334155' : '#cbd5e1' }}
                    tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
                  />
                  <Tooltip content={<CustomBarTooltip currency={currency} />} />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#f43f5e"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center dark:text-slate-500 text-slate-400 text-xs py-20">
                No monthly data recorded yet
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between text-xs dark:text-slate-400 text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>Interactive chart recalculates instantly on transaction changes</span>
          </div>
          <span className="font-medium">Auto-synced</span>
        </div>
      </div>
    </div>
  );
};
