import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS,
  CURRENCIES
} from '../utils/constants';
import { X, Plus, Check, ArrowUpRight, ArrowDownRight, ScanLine } from 'lucide-react';

export const TransactionModal = ({
  isOpen,
  onClose,
  initialData = null,
  onOpenReceiptScanner = null
}) => {
  const { addTransaction, updateTransaction, accounts } = useTransactions();
  const { currency } = useAuth();

  const currentCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'acc_checking');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState('none');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setTitle(initialData.title || '');
      setAmount(initialData.amount ? initialData.amount.toString() : '');
      setCategory(initialData.category || (initialData.type === 'income' ? INCOME_CATEGORIES[0].id : EXPENSE_CATEGORIES[0].id));
      setPaymentMethod(initialData.paymentMethod || 'card');
      setAccountId(initialData.accountId || accounts[0]?.id || 'acc_checking');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setNotes(initialData.notes || '');
      setRecurring(initialData.recurring || 'none');
    } else {
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0].id);
      setPaymentMethod('card');
      setAccountId(accounts[0]?.id || 'acc_checking');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setRecurring('none');
    }
    setError('');
  }, [initialData, isOpen, accounts]);

  const handleTitleChange = (val) => {
    setTitle(val);
    const lower = val.toLowerCase();
    if (lower.includes('food') || lower.includes('bistro') || lower.includes('restaurant') || lower.includes('starbucks') || lower.includes('mcdonald') || lower.includes('coffee') || lower.includes('burger')) {
      setType('expense');
      setCategory('food');
    } else if (lower.includes('grocery') || lower.includes('whole foods') || lower.includes('trader') || lower.includes('supermarket') || lower.includes('mart')) {
      setType('expense');
      setCategory('groceries');
    } else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('disney') || lower.includes('subscription') || lower.includes('prime') || lower.includes('youtube')) {
      setType('expense');
      setCategory('subscriptions');
    } else if (lower.includes('rent') || lower.includes('apartment') || lower.includes('lease')) {
      setType('expense');
      setCategory('housing');
    } else if (lower.includes('salary') || lower.includes('payroll') || lower.includes('wages')) {
      setType('income');
      setCategory('salary');
    } else if (lower.includes('freelance') || lower.includes('client') || lower.includes('gig') || lower.includes('design')) {
      setType('income');
      setCategory('freelance');
    } else if (lower.includes('dividend') || lower.includes('stock') || lower.includes('etf') || lower.includes('crypto')) {
      setType('income');
      setCategory('investments');
    } else if (lower.includes('uber') || lower.includes('lyft') || lower.includes('flight') || lower.includes('gas') || lower.includes('fuel')) {
      setType('expense');
      setCategory('transport');
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0].id);
    } else {
      setCategory(EXPENSE_CATEGORIES[0].id);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title or description');
      return;
    }

    const payload = {
      type,
      title: title.trim(),
      amount: parseFloat(amount),
      currency: initialData?.currency || currency,
      category,
      paymentMethod,
      accountId,
      date,
      notes: notes.trim(),
      recurring
    };

    if (initialData && initialData.id) {
      updateTransaction(initialData.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-slate-200">
          <div>
            <h3 className="text-base font-bold dark:text-white text-slate-900">
              {initialData?.id ? 'Edit Transaction' : 'Record New Transaction'}
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">Record amounts in your active currency ({currency})</p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenReceiptScanner && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReceiptScanner();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
                title="Scan physical receipt with OCR"
              >
                <ScanLine className="h-3.5 w-3.5" />
                <span>Scan Receipt</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Type Switcher */}
          <div>
            <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Transaction Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl dark:bg-slate-950 bg-slate-100 border dark:border-slate-800 border-slate-200">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ArrowDownRight className="h-3.5 w-3.5" />
                <span>Expense</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[3]" />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Amount & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Amount ({currency})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  {currentCurrencyObj.symbol}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-sm font-bold dark:text-white text-slate-900 pl-7 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Title / Merchant</label>
              <input
                type="text"
                required
                placeholder="e.g. Whole Foods, Netflix, Salary"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Account / Wallet</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Notes (Optional)</label>
            <textarea
              rows="2"
              placeholder="Additional details, tax notes, split tags..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-medium dark:text-white text-slate-900 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t dark:border-slate-800 border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
              }`}
            >
              {initialData?.id ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4 stroke-[3]" />}
              <span>{initialData?.id ? 'Save Changes' : 'Add Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
