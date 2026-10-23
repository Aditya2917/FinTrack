import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  Sparkles,
  Bot,
  Lightbulb,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

export const AIAdvisorCard = () => {
  const { aiInsights, stats, categoryBreakdown } = useTransactions();
  const { currency } = useAuth();
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [customReply, setCustomReply] = useState('');

  const quickPrompts = [
    'How can I save an extra $200 this month?',
    'Analyze my highest spending category',
    'Am I on track for a 30% savings rate?'
  ];

  const handlePromptClick = (prompt) => {
    setSelectedPrompt(prompt);
    if (prompt.includes('$200')) {
      const topCat = categoryBreakdown[0]?.name || 'Dining & Shopping';
      setCustomReply(
        `Based on your current patterns, reducing spending in "${topCat}" by 15% and auditing your digital subscriptions can easily save you $220/month without altering your lifestyle.`
      );
    } else if (prompt.includes('highest spending')) {
      const topCat = categoryBreakdown[0];
      if (topCat) {
        setCustomReply(
          `Your biggest outflow is "${topCat.name}" at ${formatCurrency(topCat.value, currency)}. This represents ${Math.round((topCat.value / (stats.totalExpenses || 1)) * 100)}% of your total expenditures.`
        );
      } else {
        setCustomReply('Please record transactions or preview demo data to calculate your highest category.');
      }
    } else {
      setCustomReply(
        `Your current savings rate is ${stats.savingsRate}%. ${stats.savingsRate >= 30 ? 'You are successfully hitting your target!' : 'To reach 30%, aim to limit discretionary categories to under $500 total.'}`
      );
    }
  };

  return (
    <div className="rounded-2xl glass-card p-5 border dark:border-indigo-500/30 border-indigo-200 relative overflow-hidden group transition-colors duration-200">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-teal-500/10 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b dark:border-slate-800 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold dark:text-white text-slate-900">AI Financial Copilot</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full dark:bg-indigo-500/20 bg-indigo-50 dark:text-indigo-300 text-indigo-700 border dark:border-indigo-500/30 border-indigo-200">
                Live Insights
              </span>
            </div>
            <p className="text-xs dark:text-slate-400 text-slate-500">Intelligent spending diagnosis & proactive cashflow optimization</p>
          </div>
        </div>

        {/* Financial Health Score Badge */}
        <div className="flex items-center gap-3 p-2 rounded-xl dark:bg-slate-900/80 bg-slate-100 border dark:border-slate-800 border-slate-200 self-start sm:self-auto">
          <BrainCircuit className="h-4 w-4 text-emerald-500" />
          <div>
            <span className="text-[10px] uppercase font-bold dark:text-slate-400 text-slate-500 block">Financial Score</span>
            <span className="text-sm font-extrabold text-emerald-500">{aiInsights.healthScore}/100</span>
          </div>
        </div>
      </div>

      {/* AI Advice Bullet Points */}
      <div className="mt-4 space-y-2.5">
        <p className="text-xs font-semibold dark:text-slate-200 text-slate-800 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>{aiInsights.headline}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {aiInsights.tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 hover:border-indigo-400 transition text-xs dark:text-slate-300 text-slate-700 flex items-start gap-2 leading-relaxed"
            >
              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="mt-4 pt-3 border-t dark:border-slate-800 border-slate-200">
        <p className="text-[11px] font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-2">Ask Copilot</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handlePromptClick(prompt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                selectedPrompt === prompt
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 dark:border-slate-800 border-slate-200'
              }`}
            >
              <MessageSquare className="h-3 w-3 text-indigo-500" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {customReply && (
          <div className="mt-3 p-3.5 rounded-xl dark:bg-indigo-950/30 bg-indigo-50 border dark:border-indigo-500/30 border-indigo-200 text-xs dark:text-indigo-200 text-indigo-900 animate-in fade-in flex items-start gap-2.5">
            <Bot className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{customReply}</p>
          </div>
        )}
      </div>
    </div>
  );
};
