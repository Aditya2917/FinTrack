import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  Users,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../utils/constants';

export const SplitBillModal = ({ isOpen, onClose }) => {
  const { addSplitBill } = useTransactions();
  const { currency } = useAuth();

  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [members, setMembers] = useState(['You', 'Jordan', 'Sam']);
  const [newMemberName, setNewMemberName] = useState('');

  if (!isOpen) return null;

  const totalNum = parseFloat(totalAmount) || 0;
  const perPersonShare = members.length > 0 ? totalNum / members.length : 0;

  const handleAddMember = () => {
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      setMembers([...members, newMemberName.trim()]);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (idx) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || totalNum <= 0) return;

    const splitData = {
      title,
      totalAmount: totalNum,
      category,
      myShare: perPersonShare,
      members: members.map((m) => ({
        name: m,
        share: perPersonShare,
        settled: m === 'You'
      }))
    };

    addSplitBill(splitData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Splitwise-Style Bill Splitter</h3>
              <p className="text-xs text-slate-400">Evenly split group meals, rent, or trips</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bill Title / Event</label>
            <input
              type="text"
              required
              placeholder="e.g. Italian Bistro Dinner, Weekend Cabin"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Bill Amount ({currency})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                placeholder="0.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Group Members List */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Participants ({members.length})</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add friend's name..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddMember();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                      {member.slice(0, 1)}
                    </span>
                    <span>{member}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">
                      {formatCurrency(perPersonShare, currency)}
                    </span>
                    {member !== 'You' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
            <div>
              <p className="font-semibold">Your Share to Pay</p>
              <p className="text-[11px] text-indigo-300/80">Will be recorded in your transactions</p>
            </div>
            <span className="text-lg font-black text-white">
              {formatCurrency(perPersonShare, currency)}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            >
              Confirm & Split Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
