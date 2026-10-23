import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { AIAdvisorCard } from './components/AIAdvisorCard';
import { ChartsSection } from './components/ChartsSection';
import { AccountsSection } from './components/AccountsSection';
import { SavingsGoalsSection } from './components/SavingsGoalsSection';
import { BudgetSection } from './components/BudgetSection';
import { RecurringBillsSection } from './components/RecurringBillsSection';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { SplitBillModal } from './components/SplitBillModal';
import { StatementModal } from './components/StatementModal';
import { ToastContainer } from './components/ToastContainer';


function DashboardContent() {
  const { user } = useAuth();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [receiptScannerOpen, setReceiptScannerOpen] = useState(false);
  const [splitBillOpen, setSplitBillOpen] = useState(false);
  const [statementModalOpen, setStatementModalOpen] = useState(false);

  // RULE: User MUST login first to access the dashboard!
  if (!user) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setTransactionModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setTransactionModalOpen(true);
  };

  const handleReceiptScanned = (scannedData) => {
    setEditingTransaction(scannedData);
    setTransactionModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 transition-colors duration-200">
      {/* Navigation */}
      <Navbar
        onOpenTransactionModal={handleOpenAdd}
        onOpenReceiptScanner={() => setReceiptScannerOpen(true)}
        onOpenSplitBill={() => setSplitBillOpen(true)}
        onOpenStatementModal={() => setStatementModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Overview Cards & Greeting */}
        <StatsCards />

        {/* AI-Powered Spending Copilot & Financial Score */}
        <AIAdvisorCard />

        {/* Visual Charts & Cash Flow Analytics */}
        <ChartsSection />

        {/* Multi-Account & Wallet Management */}
        <AccountsSection />

        {/* Savings Goals & Wealth Milestones */}
        <SavingsGoalsSection />

        {/* Monthly Category Budgets */}
        <BudgetSection />

        {/* Automated Recurring Bills & Subscriptions */}
        <RecurringBillsSection />

        {/* Transaction History & Records Table */}
        <TransactionList
          onOpenAddModal={handleOpenAdd}
          onEditTransaction={handleOpenEdit}
        />
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-slate-900 border-slate-200 dark:bg-slate-950/80 bg-white/80 py-6 text-center text-xs dark:text-slate-500 text-slate-600 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold dark:text-slate-300 text-slate-800">FinTrack</span>
            <span>•</span>
            <span>Personal Finance & Expense Tracker Enterprise</span>
          </div>

          <div className="text-xs dark:text-slate-400 text-slate-500 font-medium">
            © {new Date().getFullYear()} FinTrack PRO. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals & Popups */}
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
        initialData={editingTransaction}
        onOpenReceiptScanner={() => setReceiptScannerOpen(true)}
      />

      <ReceiptScannerModal
        isOpen={receiptScannerOpen}
        onClose={() => setReceiptScannerOpen(false)}
        onReceiptScanned={handleReceiptScanned}
      />

      <SplitBillModal
        isOpen={splitBillOpen}
        onClose={() => setSplitBillOpen(false)}
      />

      <StatementModal
        isOpen={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <DashboardContent />
      </TransactionProvider>
    </AuthProvider>
  );
}
