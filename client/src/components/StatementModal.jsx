import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Printer,
  X,
  FileCheck2,
  ShieldCheck,
  Building2,
  PieChart,
  Calendar,
  Wallet
} from 'lucide-react';

export const StatementModal = ({ isOpen, onClose }) => {
  const { user, currency } = useAuth();
  const { stats, accounts, budgetProgress, filteredTransactions } = useTransactions();

  if (!isOpen) return null;

  const totalLiquidAssets = accounts.reduce((sum, a) => sum + (Number(a.displayBalance ?? a.balance) || 0), 0);
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const currentMonthYear = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="statement-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="statement-modal-content relative w-full max-w-4xl rounded-3xl bg-[#090d16] border border-slate-800 text-slate-100 shadow-2xl p-6 sm:p-8 max-h-[92vh] flex flex-col justify-between my-auto">
        
        {/* Action Controls (Hidden when printing) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Executive Financial Statement</h3>
              <p className="text-xs text-slate-300">Institutional monthly wealth & cashflow audit report</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE STATEMENT BODY */}
        <div className="print-statement overflow-y-auto py-4 space-y-6 text-slate-100 pr-1">
          
          {/* Header & Verification Seal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10">
                <Wallet className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-white">
                    FinTrack <span className="text-emerald-400">PRO</span>
                  </span>
                  <span className="print-brand-badge text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wide">
                    OFFICIAL STATEMENT
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Statement Period: <strong className="text-white font-bold">{currentMonthYear}</strong> • Issued: <strong className="text-white font-bold">{currentDate}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <p className="font-extrabold text-sm text-white">{user?.name || 'Account Holder'}</p>
              <p className="text-slate-300 font-semibold">{user?.email}</p>
              <p className="text-[11px] text-emerald-400 font-bold mt-1">Audit Reference: FT-STMT-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          {/* Key Financial Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Liquid Net Worth</span>
              <p className="text-base sm:text-lg font-black text-white mt-1">
                {formatCurrency(totalLiquidAssets, currency)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Monthly Inflow</span>
              <p className="text-base sm:text-lg font-black text-emerald-400 mt-1">
                +{formatCurrency(stats.totalIncome, currency)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Monthly Outflow</span>
              <p className="text-base sm:text-lg font-black text-rose-400 mt-1">
                -{formatCurrency(stats.totalExpenses, currency)}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Savings Rate</span>
              <p className="text-base sm:text-lg font-black text-indigo-400 mt-1">
                {stats.savingsRate}%
              </p>
            </div>
          </div>

          {/* Accounts & Holdings Table */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-2.5 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-teal-400" />
              <span>Accounts & Liquid Holdings</span>
            </h4>
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-200 font-bold border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Account Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Institution</th>
                    <th className="py-2.5 px-3 text-right">Balance ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-bold text-white">{acc.name}</td>
                      <td className="py-2.5 px-3 capitalize text-slate-300 font-semibold">{acc.type}</td>
                      <td className="py-2.5 px-3 text-slate-300 font-semibold">{acc.institution}</td>
                      <td className="py-2.5 px-3 text-right font-black text-emerald-400">
                        {formatCurrency(acc.displayBalance ?? acc.balance, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Budget Performance Table */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-2.5 flex items-center gap-1.5">
              <PieChart className="h-4 w-4 text-indigo-400" />
              <span>Monthly Category Budgets Variance</span>
            </h4>
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-200 font-bold border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Limit</th>
                    <th className="py-2.5 px-3">Actual Spent</th>
                    <th className="py-2.5 px-3">Utilization</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {budgetProgress.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-bold text-white">{b.name}</td>
                      <td className="py-2.5 px-3 text-slate-200 font-semibold">{formatCurrency(b.limit, currency)}</td>
                      <td className="py-2.5 px-3 text-slate-200 font-semibold">{formatCurrency(b.spent, currency)}</td>
                      <td className="py-2.5 px-3 text-white font-bold">{b.percentage}%</td>
                      <td className="py-2.5 px-3 text-right font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${b.isExceeded ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : b.isWarning ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}>{b.isExceeded ? 'Exceeded' : b.isWarning ? 'Warning' : 'On Track'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Top Transactions Table */}
          {filteredTransactions.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 mb-2.5 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span>Recent Significant Transactions</span>
              </h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-200 font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                    {filteredTransactions.slice(0, 6).map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-2 px-3 text-slate-300 font-semibold">{formatDate(t.date)}</td>
                        <td className="py-2 px-3 font-bold text-white">{t.title}</td>
                        <td className="py-2 px-3 capitalize text-slate-300 font-semibold">{t.category}</td>
                        <td className={`py-2 px-3 text-right font-black ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>{t.type === 'income' ? '+' : '-'}{formatCurrency(t.displayAmount ?? t.amount, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Audit Verification Seal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
              <span>Digitally verified by FinTrack Enterprise Suite • Spring Boot 3.3.5 & JWT Security</span>
            </div>
            <span className="font-bold text-white">Page 1 of 1</span>
          </div>

        </div>

      </div>
    </div>
  );
};