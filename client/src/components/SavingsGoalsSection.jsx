import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, convertCurrency } from '../utils/formatters';
import {
  Target,
  Plus,
  Sparkles,
  ShieldCheck,
  Plane,
  Laptop,
  Car,
  Home,
  CheckCircle2,
  X,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Trash2
} from 'lucide-react';

export const SavingsGoalsSection = () => {
  const { savingsGoals, contributeToGoal, addSavingsGoal, deleteSavingsGoal, resetSavingsGoals, accounts } = useTransactions();
  const { currency } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [contributeGoalId, setContributeGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '');

  // New goal state
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('ShieldCheck');

  const getGoalIcon = (iconName) => {
    switch (iconName) {
      case 'Plane':
        return <Plane className="h-5 w-5 text-indigo-400" />;
      case 'Laptop':
        return <Laptop className="h-5 w-5 text-amber-400" />;
      case 'Car':
        return <Car className="h-5 w-5 text-cyan-400" />;
      case 'Home':
        return <Home className="h-5 w-5 text-rose-400" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5 text-purple-400" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
    }
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    contributeToGoal(contributeGoalId, amt, fromAccount);
    setDepositAmount('');
    setContributeGoalId(null);
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    const targetAmt = parseFloat(newTarget);
    if (!newTitle.trim() || !targetAmt || targetAmt <= 0) return;

    addSavingsGoal({
      title: newTitle.trim(),
      targetAmount: targetAmt,
      currentAmount: 0,
      currency: currency || 'INR',
      targetDate: newDate || '2026-12-31',
      icon: newCategory
    });

    setNewTitle('');
    setNewTarget('');
    setNewDate('');
    setModalOpen(false);
  };

  return (
    <div className="rounded-2xl glass-card p-5 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b dark:border-slate-800 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900">Savings Goals & Wealth Milestones</h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">Allocate funds towards personal targets and track progress</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {savingsGoals.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset all savings goals to empty? You can set manual goals anytime.')) {
                  resetSavingsGoals();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold dark:bg-rose-500/10 bg-rose-50 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition cursor-pointer"
              title="Reset all goals"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Goal Cards Grid or Empty State */}
      {savingsGoals.length === 0 ? (
        <div className="mt-5 py-12 px-6 rounded-2xl border-2 border-dashed dark:border-slate-800/80 border-slate-300 flex flex-col items-center justify-center text-center dark:bg-slate-950/40 bg-slate-50/60">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <Target className="h-7 w-7" />
          </div>
          <h4 className="text-sm font-bold dark:text-white text-slate-900 mb-1">
            No Savings Goals Set Yet
          </h4>
          <p className="text-xs dark:text-slate-400 text-slate-500 max-w-md mb-5 leading-relaxed">
            Define your custom wealth milestones (e.g. 6-Month Emergency Vault, Dream Vacation, New Vehicle, Tech Upgrade, or Real Estate Down Payment). Set your manual targets and start tracking progress with one-click deposits.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Create Your First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {savingsGoals.map((goal) => {
            const targetConverted = convertCurrency(goal.targetAmount, goal.currency || 'INR', currency);
            const savedConverted = convertCurrency(goal.currentAmount || 0, goal.currency || 'INR', currency);
            const pct = Math.min(100, targetConverted > 0 ? Math.round((savedConverted / targetConverted) * 100) : 0);
            const isCompleted = pct >= 100;

            return (
              <div
                key={goal.id}
                className="p-4 rounded-xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 hover:border-emerald-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl dark:bg-slate-800 bg-white border dark:border-slate-700/60 border-slate-200">
                      {getGoalIcon(goal.icon)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isCompleted ? 'bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/30' : 'dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700'}`}>{isCompleted ? 'Goal Achieved! 🌟' : `${pct}% Funded`}</span>
                      <button
                        onClick={() => deleteSavingsGoal(goal.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold dark:text-white text-slate-900 mt-3 truncate">{goal.title}</h4>
                  <div className="mt-2 flex items-baseline justify-between text-xs">
                    <span className="text-base font-extrabold text-emerald-500">
                      {formatCurrency(savedConverted, currency)}
                    </span>
                    <span className="dark:text-slate-400 text-slate-500 text-[11px]">
                      of {formatCurrency(targetConverted, currency)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 w-full dark:bg-slate-800 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-teal-500 to-indigo-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] dark:text-slate-500 text-slate-400">
                    <span>Target: {goal.targetDate}</span>
                    <span>{formatCurrency(Math.max(0, targetConverted - savedConverted), currency)} to go</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t dark:border-slate-800/60 border-slate-200 flex items-center gap-2">
                  <button
                    onClick={() => setContributeGoalId(goal.id)}
                    disabled={isCompleted}
                    className="w-full py-1.5 rounded-lg text-xs font-bold dark:bg-slate-800 bg-slate-200 hover:bg-emerald-500 hover:text-slate-950 dark:text-slate-300 text-slate-700 transition cursor-pointer disabled:opacity-40"
                  >
                    {isCompleted ? 'Completed' : '+ Deposit Funds'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contribute Funds Modal */}
      {contributeGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
              <h3 className="text-sm font-bold dark:text-white text-slate-900">Deposit Towards Goal</h3>
              <button onClick={() => setContributeGoalId(null)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">From Account</label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.displayBalance ?? a.balance, currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Deposit Amount ({currency})</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-sm font-bold dark:text-white text-slate-900 px-3 py-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContributeGoalId(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
              <h3 className="text-sm font-bold dark:text-white text-slate-900">Create New Savings Goal</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Vehicle Down Payment"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Target Amount ({currency})</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="100000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs dark:text-white text-slate-900 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Milestone Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs dark:text-white text-slate-900 px-3 py-2 font-medium"
                  >
                    <option value="ShieldCheck">🛡️ Emergency / Safety</option>
                    <option value="Plane">✈️ Travel / Vacation</option>
                    <option value="Laptop">💻 Tech / Gadgets</option>
                    <option value="Car">🚗 Vehicle / Auto</option>
                    <option value="Home">🏠 Real Estate / Home</option>
                    <option value="Sparkles">✨ Wealth / Investments</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};