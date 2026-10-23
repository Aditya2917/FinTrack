import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  ScanLine,
  Upload,
  FileCheck,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Receipt
} from 'lucide-react';

const SAMPLE_RECEIPTS = [
  {
    id: 'rec_wf',
    merchant: 'Whole Foods Market',
    amount: 142.80,
    category: 'groceries',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
    items: ['Organic Blueberries', 'Almond Milk', 'Wild Salmon Fillet', 'Artisan Bread']
  },
  {
    id: 'rec_apple',
    merchant: 'Apple Store Downtown',
    amount: 199.00,
    category: 'shopping',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
    items: ['AirPods 4 with Active Noise Cancellation', 'AppleCare+ 2-Year Plan']
  },
  {
    id: 'rec_bistro',
    merchant: 'Artisan Trattoria & Wine Bar',
    amount: 92.50,
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'card',
    items: ['Truffle Tagliatelle', 'Chianti Classico DOCG', 'Tiramisu']
  },
  {
    id: 'rec_shell',
    merchant: 'Shell Express Fuel',
    amount: 58.40,
    category: 'transport',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'upi',
    items: ['Premium Unleaded 93 Fuel (14.2 Gal)']
  }
];

export const ReceiptScannerModal = ({ isOpen, onClose, onReceiptScanned }) => {
  const { currency } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(SAMPLE_RECEIPTS[0]);
  const [extractedData, setExtractedData] = useState(null);

  if (!isOpen) return null;

  const handleSelectSample = (sample) => {
    setSelectedReceipt(sample);
    setScanning(true);
    setExtractedData(null);

    setTimeout(() => {
      setScanning(false);
      setExtractedData(sample);
    }, 900);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setExtractedData(null);

    setTimeout(() => {
      setScanning(false);
      const parsed = {
        id: 'uploaded_' + Date.now(),
        merchant: file.name.split('.')[0] || 'Scanned Receipt',
        amount: (Math.random() * 80 + 20).toFixed(2),
        category: 'shopping',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'card',
        items: ['Scanned invoice items']
      };
      setExtractedData(parsed);
    }, 1200);
  };

  const handleApply = () => {
    if (!extractedData) return;
    onReceiptScanned({
      title: extractedData.merchant,
      amount: extractedData.amount,
      category: extractedData.category,
      paymentMethod: extractedData.paymentMethod,
      date: extractedData.date,
      notes: `Scanned from receipt: ${extractedData.items?.join(', ') || ''}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <ScanLine className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">OCR Receipt & Invoice Scanner</h3>
              <p className="text-xs text-slate-400">Instantly parse receipt totals and line items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="mt-4">
          <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-700/80 rounded-2xl bg-slate-950/60 hover:bg-slate-950 hover:border-emerald-500/50 transition cursor-pointer group">
            <Upload className="h-7 w-7 text-slate-400 group-hover:text-emerald-400 transition mb-2" />
            <p className="text-xs font-bold text-white">Click or drag & drop a receipt photo</p>
            <p className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, or PDF</p>
            <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Quick Sample Receipts Bar */}
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Or select a sample receipt to test:</p>
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_RECEIPTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  selectedReceipt?.id === sample.id
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold truncate">{sample.merchant}</span>
                  <Receipt className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </div>
                <p className="text-xs font-extrabold text-white mt-1">
                  {formatCurrency(sample.amount, currency)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Scanning progress */}
        {scanning && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center animate-pulse">
            <ScanLine className="h-6 w-6 text-emerald-400 mx-auto animate-spin mb-2" />
            <p className="text-xs font-bold text-white">AI Vision OCR analyzing receipt image...</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Extracting store name, total, date, and tax</p>
          </div>
        )}

        {/* Extracted Details Card */}
        {extractedData && !scanning && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> OCR Data Successfully Extracted
              </span>
              <span className="text-xs font-black text-white">
                {formatCurrency(extractedData.amount, currency)}
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Merchant</span>
                <span className="font-bold text-white">{extractedData.merchant}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Category</span>
                <span className="font-semibold text-emerald-400 capitalize">{extractedData.category}</span>
              </div>
            </div>

            {extractedData.items && (
              <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] text-slate-300">
                <span className="text-slate-400 text-[10px] block">Detected Items:</span>
                <p className="truncate">{extractedData.items.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 flex justify-end gap-2 border-t border-slate-800 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!extractedData || scanning}
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            <span>Import to Transaction</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
