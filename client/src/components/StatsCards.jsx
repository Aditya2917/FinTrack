import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';

export const StatsCards = () => {
  const { stats, dateRange, setDateRange, isDemoMode } = useTransactions();
  const { user, currency } = useAuth();

  const isNetPositive = stats.netBalance >= 0;

  return (
    <div className="space-y-4">
      {/* Greeting and Quick Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-white text-slate-900">
              Welcome back, <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">{user?.name || 'Explorer'}</span> 👋
            </h1>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Demo Active
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-500">
            {isDemoMode ? 'Previewing demo financial records across 3 months' : 'Here is your live cashflow summary and financial health'}
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="inline-flex p-1 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 shadow-inner self-start sm:self-auto">
          {[
            { id: 'this_month', label: 'This Month' },
            { id: 'last_month', label: 'Last Month' },
            { id: '7_days', label: '7 Days' },
            { id: 'all', label: 'All Time' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDateRange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                dateRange === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Balance Card */}
        <div className="relative overflow-hidden rounded-2xl glass-card p-5 border dark:border-slate-800/80 border-slate-200 transition hover:border-emerald-500/40 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">Net Balance</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isNetPositive ? 'dark:text-white text-slate-900' : 'text-rose-500'}`}>
              {formatCurrency(stats.netBalance, currency)}
            </h2>
            <div className="mt-2 flex items-center gap-1.5 text-xs dark:text-slate-400 text-slate-500">
              <span className={`inline-flex items-center font-bold ${isNetPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isNetPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {stats.savingsRate}%
              </span>
              <span>of total income saved</span>
            </div>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="relative overflow-hidden rounded-2xl glass-card p-5 border dark:border-slate-800/80 border-slate-200 transition hover:border-emerald-500/40 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl group-hover:bg-emerald-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">Total Income</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-500">
              +{formatCurrency(stats.totalIncome, currency)}
            </h2>
            <p className="mt-2 text-xs dark:text-slate-400 text-slate-500">
              Total earnings in selected timeframe
            </p>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="relative overflow-hidden rounded-2xl glass-card p-5 border dark:border-slate-800/80 border-slate-200 transition hover:border-rose-500/40 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-rose-500/10 blur-xl group-hover:bg-rose-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">Total Expenses</span>
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-rose-500">
              -{formatCurrency(stats.totalExpenses, currency)}
            </h2>
            <p className="mt-2 text-xs dark:text-slate-400 text-slate-500">
              Total spending in selected timeframe
            </p>
          </div>
        </div>

        {/* Savings Rate Card */}
        <div className="relative overflow-hidden rounded-2xl glass-card p-5 border dark:border-slate-800/80 border-slate-200 transition hover:border-indigo-500/40 group">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">Savings Target</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
              <PiggyBank className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight dark:text-indigo-300 text-indigo-600">
                {stats.savingsRate}%
              </h2>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                stats.savingsRate >= 30 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
              }`}>
                {stats.savingsRate >= 30 ? 'Healthy' : 'Needs Care'}
              </span>
            </div>
            <div className="mt-3 w-full dark:bg-slate-800 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, stats.savingsRate))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
