import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_METHODS
} from '../utils/constants';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit3,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  FileText,
  Printer,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export const TransactionList = ({ onOpenAddModal, onEditTransaction }) => {
  const {
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    deleteTransaction,
    isDemoMode,
    toggleDemoData
  } = useTransactions();
  const { currency } = useAuth();
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const getCategoryMeta = (catId) => {
    return (
      allCategories.find((c) => c.id === catId) || {
        label: catId,
        color: '#64748b'
      }
    );
  };

  const handleDelete = (id) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="rounded-2xl glass-card p-5 transition-colors duration-200">
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b dark:border-slate-800 border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold dark:text-white text-slate-900">Transaction History</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700">
              {filteredTransactions.length} records
            </span>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> Demo Preview Active
              </span>
            )}
          </div>
          <p className="text-xs dark:text-slate-400 text-slate-500">Search, filter, categorize, and export your cashflow</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 border dark:border-slate-700/60 border-slate-300 transition cursor-pointer"
            title="Print or Save as PDF Report"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-5">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, category, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs dark:text-white text-slate-900 pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="lg:col-span-3 flex p-1 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200">
          {[
            { id: 'all', label: 'All' },
            { id: 'income', label: 'Income' },
            { id: 'expense', label: 'Expense' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTypeFilter(item.id)}
              className={`flex-1 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                typeFilter === item.id
                  ? 'dark:bg-slate-800 bg-white dark:text-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-medium dark:text-slate-200 text-slate-800 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <optgroup label="Expense Categories">
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Income Categories">
              {INCOME_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="lg:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 rounded-xl text-xs font-medium dark:text-slate-200 text-slate-800 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="date_desc">Date: Newest First</option>
            <option value="date_asc">Date: Oldest First</option>
            <option value="amount_desc">Amount: Highest First</option>
            <option value="amount_asc">Amount: Lowest First</option>
          </select>
        </div>
      </div>

      {/* Transactions Table / Empty State */}
      <div className="mt-5 overflow-x-auto">
        {filteredTransactions.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-slate-800/80 border-slate-200 text-[11px] font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">
                <th className="pb-3 pl-3">Transaction</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 hidden sm:table-cell">Date</th>
                <th className="pb-3 hidden md:table-cell">Payment</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 pr-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800/50 divide-slate-100">
              {filteredTransactions.map((tx) => {
                const catMeta = getCategoryMeta(tx.category);
                const isIncome = tx.type === 'income';
                const displayVal = Number(tx.displayAmount ?? tx.amount) || 0;

                return (
                  <tr
                    key={tx.id}
                    className="group dark:hover:bg-slate-900/40 hover:bg-slate-100/60 transition duration-150"
                  >
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                            isIncome
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold dark:text-white text-slate-900 group-hover:text-emerald-500 transition">
                            {tx.title || catMeta.label}
                          </p>
                          {tx.notes && (
                            <p className="text-[11px] dark:text-slate-400 text-slate-500 truncate max-w-xs">
                              {tx.notes}
                            </p>
                          )}
                          <span className="sm:hidden text-[10px] text-slate-400">
                            {formatDate(tx.date)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                        style={{
                          backgroundColor: `${catMeta.color}15`,
                          color: catMeta.color,
                          borderColor: `${catMeta.color}35`
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: catMeta.color }}
                        />
                        {catMeta.label}
                      </span>
                    </td>

                    <td className="py-3.5 hidden sm:table-cell text-xs dark:text-slate-300 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatDate(tx.date)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 hidden md:table-cell text-xs dark:text-slate-400 text-slate-500">
                      <span className="capitalize px-2 py-0.5 rounded dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700/40 border-slate-200 text-[11px]">
                        {tx.paymentMethod || 'Card'}
                      </span>
                    </td>

                    <td className="py-3.5 text-right font-bold text-xs sm:text-sm">
                      <span className={isIncome ? 'text-emerald-500' : 'dark:text-slate-100 text-slate-800'}>
                        {isIncome ? '+' : '-'}{formatCurrency(displayVal, currency)}
                      </span>
                    </td>

                    <td className="py-3.5 pr-3 text-right">
                      {deleteConfirmId === tx.id ? (
                        <div className="flex items-center justify-end gap-1.5 animate-in fade-in">
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-0.5 rounded dark:bg-slate-800 bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 dark:hover:bg-slate-800 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit transaction"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(tx.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:bg-rose-500/10 hover:bg-rose-50 transition cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <div className="h-14 w-14 rounded-2xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <FileText className="h-7 w-7 text-emerald-500" />
            </div>
            <h4 className="text-base font-extrabold dark:text-white text-slate-900">No transactions recorded yet</h4>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Your account starts fresh with zero transactions. Record your first income or expense to start tracking your cashflow.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                <span>Add Your First Transaction</span>
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
