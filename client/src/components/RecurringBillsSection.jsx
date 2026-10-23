import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  CalendarClock,
  Plus,
  Play,
  X,
  Zap
} from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../utils/constants';

export const RecurringBillsSection = () => {
  const { recurringBills, processRecurringBill, addRecurringBill } = useTransactions();
  const { currency } = useAuth();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('subscriptions');
  const [dueDay, setDueDay] = useState('1');
  const [frequency, setFrequency] = useState('Monthly');
  const [autopay, setAutopay] = useState(true);

  const todayDate = new Date().getDate();

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    addRecurringBill({
      title,
      amount: parseFloat(amount),
      category,
      dueDay: parseInt(dueDay) || 1,
      frequency,
      autopay
    });
    setTitle('');
    setAmount('');
    setAddModalOpen(false);
  };

  return (
    <div className="rounded-2xl glass-card p-5 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b dark:border-slate-800 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <CalendarClock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900">Automated Recurring Bills & Subscriptions</h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">Never miss a payment deadline or unexpected fee</p>
          </div>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 border dark:border-slate-700/60 border-slate-300 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5 text-amber-500" />
          <span>Add Recurring Bill</span>
        </button>
      </div>

      {/* Grid of Recurring Bills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {recurringBills.map((bill) => {
          const daysLeft = bill.dueDay >= todayDate ? bill.dueDay - todayDate : 30 - (todayDate - bill.dueDay);
          const isDueSoon = daysLeft <= 3;

          return (
            <div
              key={bill.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                isDueSoon
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'dark:border-slate-800/80 border-slate-200 dark:bg-slate-900/60 bg-slate-50 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isDueSoon ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'dark:bg-slate-800 bg-slate-200 dark:text-slate-400 text-slate-600'
                  }`}>
                    {daysLeft === 0 ? 'Due Today!' : `Due in ${daysLeft} days`}
                  </span>
                  {bill.autopay && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
                      <Zap className="h-3 w-3" /> Auto
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold dark:text-white text-slate-900 mt-2.5 truncate">{bill.title}</h4>
                <p className="text-lg font-black dark:text-white text-slate-900 mt-1">
                  {formatCurrency(bill.amount, currency)}
                </p>
                <p className="text-[11px] dark:text-slate-400 text-slate-500">
                  {bill.frequency} on day {bill.dueDay}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t dark:border-slate-800/60 border-slate-200">
                <button
                  onClick={() => processRecurringBill(bill.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold dark:bg-slate-800 bg-slate-200 hover:bg-emerald-500 hover:text-slate-950 dark:text-slate-300 text-slate-700 transition cursor-pointer"
                >
                  <Play className="h-3 w-3" />
                  <span>Record Payment</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Recurring Bill Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold dark:text-white text-slate-900">Add Recurring Bill</h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Bill Name / Service</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Disney+, Health Insurance, Rent"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Amount ({currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-bold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Due Day (1-31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autopay"
                  checked={autopay}
                  onChange={(e) => setAutopay(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 dark:bg-slate-950 bg-slate-50 border-slate-300"
                />
                <label htmlFor="autopay" className="text-xs dark:text-slate-300 text-slate-700 cursor-pointer">
                  Autopay enabled via credit card / bank
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t dark:border-slate-800 border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold dark:text-slate-400 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                >
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
