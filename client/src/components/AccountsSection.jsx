import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  CreditCard,
  Building2,
  PiggyBank,
  Banknote,
  ArrowRightLeft,
  X,
  Layers
} from 'lucide-react';

export const AccountsSection = () => {
  const { accounts, transferBetweenAccounts } = useTransactions();
  const { currency } = useAuth();
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [fromAccount, setFromAccount] = useState(accounts[0]?.id || '');
  const [toAccount, setToAccount] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Total assets summed in current active currency
  const totalAssets = accounts.reduce((sum, a) => sum + (Number(a.displayBalance ?? a.balance) || 0), 0);

  const getAccountIcon = (type) => {
    switch (type) {
      case 'savings':
        return <PiggyBank className="h-5 w-5 text-indigo-500" />;
      case 'credit':
        return <CreditCard className="h-5 w-5 text-rose-500" />;
      case 'cash':
        return <Banknote className="h-5 w-5 text-amber-500" />;
      default:
        return <Building2 className="h-5 w-5 text-emerald-500" />;
    }
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    transferBetweenAccounts(fromAccount, toAccount, amount, note);
    setAmount('');
    setNote('');
    setTransferModalOpen(false);
  };

  return (
    <div className="rounded-2xl glass-card p-5 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b dark:border-slate-800 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 border border-teal-500/20">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900">Accounts & Wallets</h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">
              Total Liquid Net Worth: <strong className="text-emerald-500">{formatCurrency(totalAssets, currency)}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setTransferModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 border dark:border-slate-700/60 border-slate-300 transition cursor-pointer self-start sm:self-auto"
        >
          <ArrowRightLeft className="h-3.5 w-3.5 text-teal-500" />
          <span>Transfer Between Accounts</span>
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {accounts.map((acc) => {
          const bal = Number(acc.displayBalance ?? acc.balance) || 0;
          const isNegative = bal < 0;

          return (
            <div
              key={acc.id}
              className="p-4 rounded-xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold dark:text-slate-400 text-slate-500 uppercase tracking-wider">{acc.institution}</span>
                <div className="p-1.5 rounded-lg dark:bg-slate-800/60 bg-white border dark:border-slate-800 border-slate-200">{getAccountIcon(acc.type)}</div>
              </div>

              <div className="mt-2">
                <h4 className="text-xs font-bold dark:text-slate-200 text-slate-700 truncate">{acc.name}</h4>
                <p className={`text-lg sm:text-xl font-extrabold mt-1 tracking-tight ${isNegative ? 'text-rose-500' : 'dark:text-white text-slate-900'}`}>
                  {formatCurrency(bal, currency)}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t dark:border-slate-800/50 border-slate-200 flex items-center justify-between text-[10px] dark:text-slate-500 text-slate-400">
                <span className="capitalize">{acc.type} account</span>
                <span className="text-emerald-500 font-semibold">Live Converted</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transfer Modal */}
      {transferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b dark:border-slate-800 border-slate-200">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-teal-500" />
                <h3 className="text-base font-bold dark:text-white text-slate-900">Transfer Funds</h3>
              </div>
              <button
                onClick={() => setTransferModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 hover:bg-slate-100 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">From Account</label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.displayBalance ?? a.balance, currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">To Account</label>
                <select
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.displayBalance ?? a.balance, currency)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Transfer Amount ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-sm font-bold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Transfer Memo / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly emergency savings allocation"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full dark:bg-slate-950 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-medium dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t dark:border-slate-800 border-slate-200">
                <button
                  type="button"
                  onClick={() => setTransferModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold dark:text-slate-400 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
