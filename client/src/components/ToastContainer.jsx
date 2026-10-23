import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useTransactions();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
        let borderClass = 'border-emerald-500/30 bg-slate-900/95';

        if (toast.type === 'error') {
          icon = <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/30 bg-slate-900/95';
        } else if (toast.type === 'info') {
          icon = <Info className="h-4 w-4 text-cyan-400 shrink-0" />;
          borderClass = 'border-cyan-500/30 bg-slate-900/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border ${borderClass} shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <p className="text-xs font-semibold text-white leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
