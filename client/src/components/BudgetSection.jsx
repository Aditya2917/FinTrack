import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, convertCurrency } from '../utils/formatters';
import { Target, AlertTriangle, CheckCircle2, Sliders, X, Save } from 'lucide-react';
import { EXPENSE_CATEGORIES, CURRENCIES } from '../utils/constants';

export const BudgetSection = () => {
  const { budgetProgress, budgets, budgetsCurrency, updateAllBudgets } = useTransactions();
  const { currency } = useAuth();
  const [editingBudget, setEditingBudget] = useState(false);
  const [tempBudgets, setTempBudgets] = useState({});

  const currentCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const handleOpenEdit = () => {
    // Populate tempBudgets converted to current active currency
    const converted = {};
    EXPENSE_CATEGORIES.forEach((cat) => {
      const rawLimit = budgets[cat.id] ?? 0;
      converted[cat.id] = convertCurrency(rawLimit, budgetsCurrency || 'INR', currency);
    });
    setTempBudgets(converted);
    setEditingBudget(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateAllBudgets(tempBudgets, currency);
    setEditingBudget(false);
  };

  return (
    <div className="rounded-2xl glass-card p-5 transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900">Monthly Category Budgets</h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">Track and avoid overspending in key categories ({currentCurrencyObj.symbol} {currentCurrencyObj.code})</p>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 border dark:border-slate-700/60 border-slate-300 transition cursor-pointer"
        >
          <Sliders className="h-3.5 w-3.5 text-indigo-500" />
          <span>Adjust Limits</span>
        </button>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {budgetProgress.map((item) => {
          let barColor = 'from-emerald-500 to-teal-400';
          let statusBadge = (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
              <CheckCircle2 className="h-3 w-3" /> On Track
            </span>
          );

          if (item.isExceeded) {
            barColor = 'from-rose-500 to-red-600';
            statusBadge = (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-500 animate-pulse">
                <AlertTriangle className="h-3 w-3" /> Exceeded!
              </span>
            );
          } else if (item.isWarning) {
            barColor = 'from-amber-400 to-orange-500';
            statusBadge = (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                <AlertTriangle className="h-3 w-3" /> Warning (80%+)
              </span>
            );
          }

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition ${
                item.isExceeded
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : item.isWarning
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'dark:border-slate-800/80 border-slate-200 dark:bg-slate-900/60 bg-slate-50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold dark:text-white text-slate-900 truncate">{item.name}</span>
                {statusBadge}
              </div>

              <div className="mt-3 flex items-baseline justify-between text-xs">
                <span className="font-extrabold text-sm dark:text-slate-100 text-slate-900">
                  {formatCurrency(item.spent, currency)}
                </span>
                <span className="dark:text-slate-400 text-slate-500">
                  of {formatCurrency(item.limit, currency)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-2 w-full dark:bg-slate-800 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-500">
                <span>{item.percentage}% used</span>
                <span>
                  {item.limit >= item.spent
                    ? `${formatCurrency(item.limit - item.spent, currency)} left`
                    : `${formatCurrency(item.spent - item.limit, currency)} over`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adjust Budgets Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-500" />
                <div>
                  <h3 className="text-base font-bold dark:text-white text-slate-900">Customize Category Budgets</h3>
                  <p className="text-[11px] text-slate-400">Set limits in your active currency ({currentCurrencyObj.symbol} {currentCurrencyObj.code})</p>
                </div>
              </div>
              <button
                onClick={() => setEditingBudget(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-2">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 flex items-center justify-between">
                <span>Active Currency: <strong className="text-white">{currentCurrencyObj.label}</strong></span>
                <span className="text-[11px] text-slate-400">Dynamic exchange trend active</span>
              </div>

              {EXPENSE_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between gap-4 py-1.5 border-b dark:border-slate-800/40 border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <label className="text-xs font-semibold dark:text-slate-200 text-slate-700">{cat.label}</label>
                  </div>
                  <div className="relative w-36">
                    {/* Dynamic currency sign matching active currency */}
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold select-none pointer-events-none">
                      {currentCurrencyObj.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={tempBudgets[cat.id] ?? ''}
                      onChange={(e) =>
                        setTempBudgets({ ...tempBudgets, [cat.id]: e.target.value })
                      }
                      className="w-full dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg text-xs font-semibold dark:text-white text-slate-900 pl-8 pr-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-end gap-2 border-t dark:border-slate-800 border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingBudget(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold dark:text-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Budgets ({currentCurrencyObj.symbol} {currentCurrencyObj.code})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
