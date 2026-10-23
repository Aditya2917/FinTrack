import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  Bell,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Check,
  Volume2
} from 'lucide-react';

export const NotificationDropdown = () => {
  const { recurringBills, processRecurringBill, budgetProgress } = useTransactions();
  const { currency } = useAuth();
  const [open, setOpen] = useState(false);
  const [browserAlertsEnabled, setBrowserAlertsEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setBrowserAlertsEnabled(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setBrowserAlertsEnabled(true);
        new Notification('FinTrack Alerts Activated', {
          body: 'You will receive desktop alerts 24h prior to subscription and bill deadlines.',
          icon: '/favicon.svg'
        });
      }
    }
  };

  const today = new Date().getDate();
  const upcomingBills = recurringBills.map((b) => {
    let daysLeft = b.dueDay - today;
    if (daysLeft < 0) daysLeft += 30;
    return { ...b, daysLeft };
  }).filter((b) => b.daysLeft <= 5).sort((a, b) => a.daysLeft - b.daysLeft);

  const exceededBudgets = budgetProgress.filter((b) => b.isExceeded);
  const totalAlerts = upcomingBills.length + exceededBudgets.length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl dark:text-slate-300 text-slate-700 dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 border dark:border-slate-800 border-slate-300 transition cursor-pointer"
        title="View Upcoming Bill Deadlines & Alerts"
      >
        <Bell className="h-4 w-4" />
        {totalAlerts > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {totalAlerts}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2.5 border-b dark:border-slate-800 border-slate-100">
            <span className="text-xs font-bold dark:text-white text-slate-900">Alerts & Due Dates</span>
            <span className="text-[10px] font-semibold text-emerald-500">{totalAlerts} active</span>
          </div>

          <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
            {/* Exceeded Budgets Alerts */}
            {exceededBudgets.map((eb) => (
              <div key={eb.id} className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-rose-500">Budget Exceeded: {eb.name}</p>
                  <p className="text-[11px] text-slate-400">
                    Spent {formatCurrency(eb.spent, currency)} of {formatCurrency(eb.limit, currency)} ({eb.percentage}%)
                  </p>
                </div>
              </div>
            ))}

            {/* Upcoming Recurring Bills */}
            {upcomingBills.map((bill) => (
              <div key={bill.id} className="p-2.5 rounded-xl dark:bg-slate-800/60 bg-slate-50 border dark:border-slate-700/60 border-slate-200 flex items-center justify-between gap-2">
                <div className="text-xs">
                  <p className="font-bold dark:text-white text-slate-900">{bill.title}</p>
                  <p className="text-[11px] dark:text-slate-400 text-slate-500">
                    {formatCurrency(bill.amount, currency)} • {bill.daysLeft === 0 ? 'Due Today!' : `Due in ${bill.daysLeft} days`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    processRecurringBill(bill.id);
                    setOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] shrink-0"
                >
                  Pay Now
                </button>
              </div>
            ))}

            {totalAlerts === 0 && (
              <div className="py-6 text-center text-xs dark:text-slate-400 text-slate-500">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-semibold">All clear! No urgent dues or alerts.</p>
              </div>
            )}
          </div>

          {/* Browser Push Permission CTA */}
          <div className="mt-3 pt-2.5 border-t dark:border-slate-800 border-slate-100">
            {browserAlertsEnabled ? (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-semibold justify-center">
                <Check className="h-3 w-3" />
                <span>Desktop Push Notifications Active</span>
              </div>
            ) : (
              <button
                onClick={requestNotificationPermission}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/30 text-[11px] font-bold cursor-pointer"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Enable Desktop Due Alerts</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
