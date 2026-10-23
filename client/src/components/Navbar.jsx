import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { CURRENCIES } from '../utils/constants';
import { exportToCSV } from '../utils/formatters';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Wallet,
  Plus,
  Download,
  Moon,
  Sun,
  LogOut,
  Sparkles,
  Server,
  ChevronDown,
  RotateCcw,
  Users,
  ScanLine,
  Printer,
  RefreshCw
} from 'lucide-react';

export const Navbar = ({
  onOpenTransactionModal,
  onOpenReceiptScanner,
  onOpenSplitBill,
  onOpenStatementModal
}) => {
  const { user, theme, toggleTheme, currency, setCurrency, logout } = useAuth();
  const {
    filteredTransactions,
    backendStatus,
    isDemoMode,
    toggleDemoData,
    liveRates,
    refreshRates,
    isRefreshingRates
  } = useTransactions();
  const [profileOpen, setProfileOpen] = useState(false);

  const currentRateVsUSD = liveRates[currency] || 1.0;

  return (
    <header className="sticky top-0 z-40 w-full border-b dark:border-slate-800/80 border-slate-200 dark:bg-slate-950/80 bg-white/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight dark:text-white text-slate-900">
                FinTrack
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] dark:text-slate-400 text-slate-500 -mt-0.5 hidden sm:block">
              Personal Finance & Analytics
            </p>
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Spring Boot API status indicator */}
          <div
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 text-slate-400"
            title={backendStatus === 'connected' ? 'Connected to Spring Boot 3.3.5 Backend API' : 'Running in Offline / Local Simulation Mode'}
          >
            <Server className="h-3 w-3" />
            <span>{backendStatus === 'connected' ? 'Spring Boot API' : 'Local Mode'}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>

          {/* LIVE FX ENGINE STATUS & REFRESH BUTTON */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-500 font-extrabold">Live FX:</span>
            <span className="dark:text-slate-200 text-slate-700">1 USD = {currentRateVsUSD} {currency}</span>
            <button
              onClick={refreshRates}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition cursor-pointer"
              title="Refresh Live Exchange Rates"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshingRates ? 'animate-spin text-emerald-500' : ''}`} />
            </button>
          </div>

          {/* REVERSIBLE DEMO DATA PREVIEW TOGGLE BUTTON */}
          <button
            onClick={toggleDemoData}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer border ${
              isDemoMode
                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'dark:bg-amber-500/10 bg-amber-50 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 dark:border-amber-500/30 border-amber-200'
            }`}
            title={isDemoMode ? 'Click to revert to your real personal data' : 'Preview 3 months of sample transactions'}
          >
            {isDemoMode ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
                <span>Revert to My Data</span>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse ml-0.5" />
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="hidden sm:inline">Preview Demo Data</span>
                <span className="sm:hidden">Demo</span>
              </>
            )}
          </button>

          {/* Scan Receipt */}
          <button
            onClick={onOpenReceiptScanner}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-200 text-slate-700 border dark:border-slate-800 border-slate-300 transition cursor-pointer"
            title="Scan paper or digital receipt OCR"
          >
            <ScanLine className="h-3.5 w-3.5 text-emerald-500" />
            <span>Scan Receipt</span>
          </button>

          {/* Split Bill */}
          <button
            onClick={onOpenSplitBill}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-200 text-slate-700 border dark:border-slate-800 border-slate-300 transition cursor-pointer"
            title="Split bill with friends"
          >
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span>Split Bill</span>
          </button>

          {/* Monthly Statement / Print PDF Generator */}
          <button
            onClick={onOpenStatementModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-200 text-slate-700 border dark:border-slate-800 border-slate-300 transition cursor-pointer"
            title="Generate & Print Monthly Financial Statement"
          >
            <Printer className="h-3.5 w-3.5 text-teal-500" />
            <span className="hidden sm:inline">Statement</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(filteredTransactions, `fintrack_${Date.now()}.csv`)}
            className="p-2 rounded-xl dark:text-slate-300 text-slate-700 dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 border dark:border-slate-800 border-slate-300 transition cursor-pointer"
            title="Export transactions to CSV"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Currency Dropdown */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="appearance-none dark:bg-slate-900 bg-slate-100 dark:text-slate-200 text-slate-800 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-semibold px-2.5 py-1.5 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3 w-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl dark:text-slate-300 text-slate-700 dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 border dark:border-slate-800 border-slate-300 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          {/* Add Transaction Button */}
          <button
            onClick={onOpenTransactionModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* User Profile / Logout */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800/60 transition cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white/20">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b dark:border-slate-800 border-slate-100">
                  <p className="text-xs font-bold dark:text-white text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-500">
                    JWT Session Active
                  </span>
                </div>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenStatementModal();
                  }}
                  className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100 rounded-lg transition text-left cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-teal-500" />
                  <span>Print Monthly Statement</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenReceiptScanner();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100 rounded-lg transition text-left cursor-pointer"
                >
                  <ScanLine className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Scan Receipt OCR</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenSplitBill();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs dark:text-slate-300 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100 rounded-lg transition text-left cursor-pointer"
                >
                  <Users className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Split Bill with Group</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition text-left cursor-pointer mt-1 border-t dark:border-slate-800 border-slate-100"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
