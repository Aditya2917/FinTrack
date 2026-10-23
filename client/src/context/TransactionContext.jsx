import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { generateDemoTransactions } from '../data/demoData';
import { INITIAL_BUDGETS, EXPENSE_CATEGORIES } from '../utils/constants';
import { convertCurrency, fetchLiveRates, getActiveRates } from '../utils/formatters';
import confetti from 'canvas-confetti';

const TransactionContext = createContext();

const DEFAULT_ACCOUNTS = [
  { id: 'acc_checking', name: 'Primary Checking', type: 'bank', balance: 0.00, institution: 'Chase Bank', color: '#10b981', currency: 'INR' },
  { id: 'acc_savings', name: 'High-Yield Savings', type: 'savings', balance: 0.00, institution: 'Savings Account', color: '#6366f1', currency: 'INR' },
  { id: 'acc_credit', name: 'Credit Card', type: 'credit', balance: 0.00, institution: 'Card', color: '#f43f5e', currency: 'INR' },
  { id: 'acc_cash', name: 'Cash Wallet', type: 'cash', balance: 0.00, institution: 'Cash', color: '#f59e0b', currency: 'INR' }
];

const DEMO_ACCOUNTS = [
  { id: 'acc_checking', name: 'Primary Checking', type: 'bank', balance: 4250.00, institution: 'Chase Bank', color: '#10b981', currency: 'USD' },
  { id: 'acc_savings', name: 'High-Yield Savings (4.5%)', type: 'savings', balance: 15800.00, institution: 'Marcus Goldman', color: '#6366f1', currency: 'USD' },
  { id: 'acc_credit', name: 'Sapphire Preferred', type: 'credit', balance: -520.00, institution: 'Visa Card', color: '#f43f5e', currency: 'USD' },
  { id: 'acc_cash', name: 'Physical Cash Wallet', type: 'cash', balance: 220.00, institution: 'Cash', color: '#f59e0b', currency: 'USD' }
];

const DEFAULT_GOALS = [];

const DEMO_GOALS = [
  { id: 'goal_emergency', title: '6-Month Emergency Vault', targetAmount: 150000, currentAmount: 65000, currency: 'INR', targetDate: '2026-12-31', icon: 'ShieldCheck' },
  { id: 'goal_vacation', title: 'Annual Family Trip', targetAmount: 80000, currentAmount: 32000, currency: 'INR', targetDate: '2026-11-20', icon: 'Plane' },
  { id: 'goal_laptop', title: 'Workstation Tech Upgrade', targetAmount: 120000, currentAmount: 90000, currency: 'INR', targetDate: '2026-10-31', icon: 'Laptop' }
];


// Synchronous localStorage loaders for persistent state across page refreshes
const getSavedUserEmail = () => {
  try {
    const saved = localStorage.getItem('fintrack_user');
    if (saved) {
      const u = JSON.parse(saved);
      return u?.email || null;
    }
  } catch (e) {}
  return null;
};

const getInitialTransactions = () => {
  const email = getSavedUserEmail();
  if (email) {
    const saved = localStorage.getItem('fintrack_tx_' + email);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((t) => ({ ...t, currency: t.currency || 'INR' }));
        }
      } catch (e) {}
    }
  }
  return [];
};

const getInitialAccounts = () => {
  const email = getSavedUserEmail();
  if (email) {
    const saved = localStorage.getItem('fintrack_acc_' + email);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((a) => ({ ...a, currency: a.currency || 'INR' }));
        }
      } catch (e) {}
    }
  }
  return DEFAULT_ACCOUNTS.map((a) => ({ ...a, currency: 'INR' }));
};

const getInitialBudgets = () => {
  const email = getSavedUserEmail();
  if (email) {
    const saved = localStorage.getItem('fintrack_budgets_' + email);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.values || parsed;
      } catch (e) {}
    }
  }
  return INITIAL_BUDGETS;
};

const getInitialBudgetsCurrency = () => {
  const email = getSavedUserEmail();
  if (email) {
    const saved = localStorage.getItem('fintrack_budgets_' + email);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.currency || 'INR';
      } catch (e) {}
    }
  }
  return 'INR';
};

const getInitialGoals = () => {
  const email = getSavedUserEmail();
  if (email) {
    const saved = localStorage.getItem('fintrack_goals_' + email);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const isOldMock = Array.isArray(parsed) && parsed.some(g => g.id === 'goal_emergency' || g.id === 'goal_vacation' || g.id === 'goal_laptop');
        if (isOldMock) {
          localStorage.setItem('fintrack_goals_' + email, JSON.stringify([]));
          return [];
        }
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
  }
  return [];
};

export const TransactionProvider = ({ children }) => {
  const { user, currency } = useAuth();

  // User-scoped data state (persistently initialized from localStorage on reload)
  const [transactions, setTransactions] = useState(getInitialTransactions);
  const [budgets, setBudgets] = useState(getInitialBudgets);
  const [budgetsCurrency, setBudgetsCurrency] = useState(getInitialBudgetsCurrency);
  const [accounts, setAccounts] = useState(getInitialAccounts);
  const [recurringBills, setRecurringBills] = useState([]);
  const [splitBills, setSplitBills] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState(getInitialGoals);

  // Live FX engine state
  const [liveRates, setLiveRates] = useState(getActiveRates());
  const [ratesSource, setRatesSource] = useState('cached');
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  // Demo Data Preview Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);
  const userOriginalTransactions = useRef(getInitialTransactions());
  const userOriginalAccounts = useRef(getInitialAccounts());
  const userOriginalGoals = useRef(getInitialGoals());
  const currentlyLoadedEmailRef = useRef(null);

  const [backendStatus, setBackendStatus] = useState('checking');

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('this_month');
  const [sortBy, setSortBy] = useState('date_desc');

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auto-fetch Live Exchange Rates on mount
  useEffect(() => {
    const initRates = async () => {
      const res = await fetchLiveRates();
      if (res.success) {
        setLiveRates(res.rates);
        setRatesSource('live');
      }
    };
    initRates();
  }, []);

  const refreshRates = async () => {
    setIsRefreshingRates(true);
    try {
      const res = await fetchLiveRates();
      if (res.success) {
        setLiveRates(res.rates);
        setRatesSource('live');
        addToast('Updated live global foreign exchange rates!', 'success');
      } else {
        addToast('Live FX feed verified (using current cached rates)', 'info');
      }
    } catch (e) {
      addToast('Using offline exchange rates', 'info');
    } finally {
      setIsRefreshingRates(false);
    }
  };

  // Comprehensive user data loader from localStorage
  const loadUserData = (email) => {
    if (!email) return;

    // Load transactions
    const userKey = 'fintrack_tx_' + email;
    const saved = localStorage.getItem(userKey);
    let loadedTx = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          loadedTx = parsed.map((t) => ({ ...t, currency: t.currency || 'INR' }));
        }
      } catch (e) {
        console.error('Error parsing user transactions', e);
      }
    }
    setTransactions(loadedTx);
    userOriginalTransactions.current = loadedTx;

    // Load accounts
    const accKey = 'fintrack_acc_' + email;
    const savedAcc = localStorage.getItem(accKey);
    let loadedAcc = DEFAULT_ACCOUNTS.map((a) => ({ ...a, currency: 'INR' }));
    if (savedAcc) {
      try {
        const parsedAcc = JSON.parse(savedAcc);
        if (Array.isArray(parsedAcc) && parsedAcc.length > 0) {
          loadedAcc = parsedAcc.map((a) => ({ ...a, currency: a.currency || 'INR' }));
        }
      } catch (e) {}
    }
    setAccounts(loadedAcc);
    userOriginalAccounts.current = loadedAcc;

    // Load budgets
    const budgetKey = 'fintrack_budgets_' + email;
    const savedBudget = localStorage.getItem(budgetKey);
    let loadedBudgets = INITIAL_BUDGETS;
    let loadedBudgetsCurrency = 'INR';
    if (savedBudget) {
      try {
        const parsedB = JSON.parse(savedBudget);
        loadedBudgets = parsedB.values || parsedB;
        loadedBudgetsCurrency = parsedB.currency || 'INR';
      } catch (e) {}
    }
    setBudgets(loadedBudgets);
    setBudgetsCurrency(loadedBudgetsCurrency);

    // Load goals
    const goalsKey = 'fintrack_goals_' + email;
    const savedGoals = localStorage.getItem(goalsKey);
    let loadedGoals = [];
    if (savedGoals) {
      try {
        const parsedG = JSON.parse(savedGoals);
        const isOldMock = Array.isArray(parsedG) && parsedG.some(g => g.id === 'goal_emergency' || g.id === 'goal_vacation' || g.id === 'goal_laptop');
        if (isOldMock) {
          localStorage.setItem(goalsKey, JSON.stringify([]));
          loadedGoals = [];
        } else if (Array.isArray(parsedG)) {
          loadedGoals = parsedG;
        }
      } catch (e) {}
    }
    setSavingsGoals(loadedGoals);
    userOriginalGoals.current = loadedGoals;
  };

  // Lifecycle effect: whenever user is logged in, ensure their data is loaded
  useEffect(() => {
    if (!user || !user.email) {
      // User logged out: clear memory state but DO NOT touch their localStorage!
      currentlyLoadedEmailRef.current = null;
      setTransactions([]);
      setAccounts(DEFAULT_ACCOUNTS.map((a) => ({ ...a, currency: 'INR' })));
      setBudgets(INITIAL_BUDGETS);
      setSavingsGoals([]);
      setIsDemoMode(false);
      return;
    }

    // User is logged in: if memory does not belong to this user, load their saved data!
    if (currentlyLoadedEmailRef.current !== user.email) {
      currentlyLoadedEmailRef.current = user.email;
      setIsDemoMode(false);
      loadUserData(user.email);
    }
  }, [user?.email]);

  // Persist user-specific data
  useEffect(() => {
    if (user?.email && currentlyLoadedEmailRef.current === user.email && !isDemoMode) {
      localStorage.setItem('fintrack_tx_' + user.email, JSON.stringify(transactions));
      userOriginalTransactions.current = transactions;
    }
  }, [transactions, user?.email, isDemoMode]);

  useEffect(() => {
    if (user?.email && currentlyLoadedEmailRef.current === user.email && !isDemoMode) {
      localStorage.setItem('fintrack_acc_' + user.email, JSON.stringify(accounts));
      userOriginalAccounts.current = accounts;
    }
  }, [accounts, user?.email, isDemoMode]);

  useEffect(() => {
    if (user?.email && currentlyLoadedEmailRef.current === user.email && !isDemoMode) {
      localStorage.setItem('fintrack_budgets_' + user.email, JSON.stringify({
        values: budgets,
        currency: budgetsCurrency
      }));
    }
  }, [budgets, budgetsCurrency, user?.email, isDemoMode]);

  useEffect(() => {
    if (user?.email && currentlyLoadedEmailRef.current === user.email && !isDemoMode) {
      localStorage.setItem('fintrack_goals_' + user.email, JSON.stringify(savingsGoals));
      userOriginalGoals.current = savingsGoals;
    }
  }, [savingsGoals, user?.email, isDemoMode]);

  // Check backend health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/health', { method: 'GET' });
        if (res.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('offline');
        }
      } catch (e) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  // TOGGLE DEMO DATA PREVIEW ON / OFF
  const toggleDemoData = () => {
    if (!isDemoMode) {
      userOriginalTransactions.current = transactions;
      userOriginalAccounts.current = accounts;
      userOriginalGoals.current = savingsGoals;

      const demo = generateDemoTransactions();
      setTransactions(demo);
      setAccounts(DEMO_ACCOUNTS);
      setSavingsGoals(DEMO_GOALS);
      setIsDemoMode(true);

      addToast('Demo preview active! Click the same button to revert to your original data.', 'info');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      const restored = userOriginalTransactions.current || [];
      const restoredAcc = userOriginalAccounts.current || DEFAULT_ACCOUNTS;
      const restoredG = userOriginalGoals.current || DEFAULT_GOALS;
      setTransactions(restored);
      setAccounts(restoredAcc);
      setSavingsGoals(restoredG);
      setIsDemoMode(false);

      addToast('Reverted back to your original personal data.', 'success');
    }
  };

  // CRUD Actions
  const addTransaction = (newTx) => {
    const activeCurr = currency || 'INR';
    const tx = {
      ...newTx,
      id: 'tx_' + Date.now(),
      amount: parseFloat(newTx.amount) || 0,
      currency: newTx.currency || activeCurr
    };

    setTransactions((prev) => {
      const updated = [tx, ...prev];
      if (user?.email && !isDemoMode) {
        try {
          localStorage.setItem('fintrack_tx_' + user.email, JSON.stringify(updated));
          userOriginalTransactions.current = updated;
        } catch (e) {}
      }
      return updated;
    });

    if (isDemoMode) {
      userOriginalTransactions.current = [tx, ...userOriginalTransactions.current];
    }

    // Update account balance
    if (tx.accountId) {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === tx.accountId) {
            const accCurr = acc.currency || 'INR';
            const txAmtInAccCurr = convertCurrency(tx.amount, tx.currency, accCurr, liveRates);
            const diff = tx.type === 'income' ? txAmtInAccCurr : -txAmtInAccCurr;
            return {
              ...acc,
              balance: Math.round((acc.balance + diff) * 100) / 100,
              currency: accCurr
            };
          }
          return acc;
        })
      );
    }

    if (tx.type === 'income' && tx.amount >= 500) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#10b981', '#34d399', '#6ee7b7']
        });
      } catch (e) {}
    }

    addToast(`Added ${tx.type === 'income' ? 'Income' : 'Expense'}: "${tx.title || tx.category}"`, 'success');
  };

  const updateTransaction = (id, updatedFields) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newAmount = updatedFields.amount !== undefined ? parseFloat(updatedFields.amount) : t.amount;
          return {
            ...t,
            ...updatedFields,
            amount: newAmount,
            currency: updatedFields.currency || t.currency || currency || 'INR'
          };
        }
        return t;
      })
    );
    addToast('Transaction updated', 'success');
  };

  const deleteTransaction = (id) => {
    const target = transactions.find((t) => t.id === id);
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      if (user?.email && !isDemoMode) {
        try {
          localStorage.setItem('fintrack_tx_' + user.email, JSON.stringify(updated));
          userOriginalTransactions.current = updated;
        } catch (e) {}
      }
      return updated;
    });
    addToast(`Deleted "${target?.title || 'Transaction'}"`, 'info');
  };

  const updateBudget = (category, amount, cur = 'INR') => {
    setBudgets((prev) => ({
      ...prev,
      [category]: Math.max(0, parseFloat(amount) || 0)
    }));
    setBudgetsCurrency(cur);
    addToast(`Updated ${category} budget in ${cur}`, 'success');
  };

  const updateAllBudgets = (newBudgets, cur = 'INR') => {
    const cleaned = {};
    Object.entries(newBudgets).forEach(([cat, val]) => {
      cleaned[cat] = Math.max(0, parseFloat(val) || 0);
    });
    setBudgets(cleaned);
    setBudgetsCurrency(cur);
    addToast(`Updated all category budgets in ${cur}`, 'success');
  };

  // Savings Goals Actions
  const addSavingsGoal = (newGoal) => {
    const goal = {
      ...newGoal,
      id: 'goal_' + Date.now()
    };
    setSavingsGoals((prev) => [...prev, goal]);
    addToast(`Created new goal "${goal.title}"`, 'success');
  };

  const contributeToGoal = (goalId, depositAmt, fromAccountId) => {
    const activeCurr = currency || 'INR';
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return;

    // Deduct from account
    const fromAcc = accounts.find((a) => a.id === fromAccountId) || accounts[0];
    if (fromAcc) {
      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === fromAcc.id) {
            const amtInAccCurr = convertCurrency(depositAmt, activeCurr, acc.currency || 'INR', liveRates);
            return {
              ...acc,
              balance: Math.round((acc.balance - amtInAccCurr) * 100) / 100
            };
          }
          return acc;
        })
      );
    }

    // Convert deposit amount to goal's base currency and add
    const amtInGoalCurr = convertCurrency(depositAmt, activeCurr, goal.currency || 'INR', liveRates);
    const newSaved = Math.round(((goal.currentAmount || 0) + amtInGoalCurr) * 100) / 100;
    const isCompleted = newSaved >= goal.targetAmount;

    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: newSaved } : g))
    );

    // Record transaction
    addTransaction({
      title: `Goal Deposit: ${goal.title}`,
      amount: depositAmt,
      currency: activeCurr,
      type: 'expense',
      category: 'investments',
      paymentMethod: 'bank',
      accountId: fromAcc?.id,
      date: new Date().toISOString().split('T')[0],
      notes: `Allocated to ${goal.title} savings milestone`
    });

    if (isCompleted) {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#6366f1']
        });
      } catch (e) {}
      addToast(`🌟 Congratulations! You reached your goal "${goal.title}"!`, 'success');
    } else {
      addToast(`Deposited ${depositAmt} ${activeCurr} into "${goal.title}"`, 'success');
    }
  };

  // Reset all savings goals and wealth milestones
  const resetSavingsGoals = () => {
    setSavingsGoals([]);
    userOriginalGoals.current = [];
    if (user?.email) {
      localStorage.setItem('fintrack_goals_' + user.email, JSON.stringify([]));
    }
    addToast('All savings goals and wealth milestones have been reset.', 'info');
  };

  const deleteSavingsGoal = (goalId) => {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
    addToast('Savings goal removed', 'info');
  };

  const clearAll = () => {
    setTransactions([]);
    userOriginalTransactions.current = [];
    if (user?.email) {
      localStorage.removeItem('fintrack_tx_' + user.email);
    }
    addToast('All transactions cleared', 'info');
  };

  // Transfer Between Accounts
  const transferBetweenAccounts = (fromId, toId, amount, note = '') => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      addToast('Please enter a valid amount', 'error');
      return;
    }
    if (fromId === toId) {
      addToast('Cannot transfer to the same account', 'error');
      return;
    }

    const activeCurr = currency || 'INR';

    setAccounts((prev) =>
      prev.map((acc) => {
        const accCurr = acc.currency || 'INR';
        if (acc.id === fromId) {
          const amtInFrom = convertCurrency(amt, activeCurr, accCurr, liveRates);
          return { ...acc, balance: Math.round((acc.balance - amtInFrom) * 100) / 100 };
        }
        if (acc.id === toId) {
          const amtInTo = convertCurrency(amt, activeCurr, accCurr, liveRates);
          return { ...acc, balance: Math.round((acc.balance + amtInTo) * 100) / 100 };
        }
        return acc;
      })
    );

    const fromAcc = accounts.find((a) => a.id === fromId);
    const toAcc = accounts.find((a) => a.id === toId);

    addTransaction({
      title: `Transfer: ${fromAcc?.name} → ${toAcc?.name}`,
      amount: amt,
      currency: activeCurr,
      type: 'expense',
      category: 'other_expense',
      paymentMethod: 'bank',
      date: new Date().toISOString().split('T')[0],
      notes: note || `Transfer to ${toAcc?.name}`
    });

    addToast(`Transferred ${amt} from ${fromAcc?.name} to ${toAcc?.name}`, 'success');
  };

  const processRecurringBill = (billId) => {
    const bill = recurringBills.find((b) => b.id === billId);
    if (!bill) return;

    addTransaction({
      title: bill.title,
      amount: bill.amount,
      currency: bill.currency || currency || 'INR',
      type: 'expense',
      category: bill.category,
      paymentMethod: 'card',
      date: new Date().toISOString().split('T')[0],
      notes: `Recurring ${bill.frequency} payment`,
      recurring: bill.frequency.toLowerCase()
    });

    addToast(`Processed payment for "${bill.title}"`, 'success');
  };

  const addRecurringBill = (newBill) => {
    const bill = {
      ...newBill,
      id: 'rec_' + Date.now(),
      amount: parseFloat(newBill.amount) || 0,
      currency: newBill.currency || currency || 'INR',
      dueDay: parseInt(newBill.dueDay) || 1
    };
    setRecurringBills((prev) => [...prev, bill]);
    addToast(`Added recurring bill "${bill.title}"`, 'success');
  };

  const addSplitBill = (splitData) => {
    const record = {
      ...splitData,
      id: 'split_' + Date.now(),
      currency: currency || 'INR',
      createdAt: new Date().toISOString()
    };
    setSplitBills((prev) => [record, ...prev]);

    addTransaction({
      title: `${splitData.title} (Split with ${splitData.members.length} people)`,
      amount: splitData.myShare,
      currency: currency || 'INR',
      type: 'expense',
      category: splitData.category || 'food',
      paymentMethod: 'card',
      date: new Date().toISOString().split('T')[0],
      notes: `Total bill: ${splitData.totalAmount}. My portion: ${splitData.myShare}.`
    });

    addToast(`Created split bill "${splitData.title}"`, 'success');
  };

  // Converted Accounts for Active Currency
  const displayAccounts = useMemo(() => {
    const activeCurr = currency || 'INR';
    return accounts.map((acc) => {
      const fromCurr = acc.currency || (isDemoMode ? 'USD' : 'INR');
      const convertedBal = convertCurrency(acc.balance, fromCurr, activeCurr, liveRates);
      return {
        ...acc,
        displayBalance: convertedBal
      };
    });
  }, [accounts, currency, isDemoMode, liveRates]);

  // Converted Filtered Transactions for Active Currency
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const activeCurr = currency || 'INR';

    return transactions
      .map((t) => {
        const fromCurr = t.currency || (isDemoMode ? 'USD' : 'INR');
        const displayAmt = convertCurrency(t.amount, fromCurr, activeCurr, liveRates);
        return {
          ...t,
          displayAmount: displayAmt
        };
      })
      .filter((t) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = (t.title || '').toLowerCase().includes(q);
          const matchNotes = (t.notes || '').toLowerCase().includes(q);
          const matchCat = (t.category || '').toLowerCase().includes(q);
          if (!matchTitle && !matchNotes && !matchCat) return false;
        }

        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

        if (dateRange !== 'all' && t.date) {
          const txDate = new Date(t.date + 'T00:00:00');
          if (dateRange === 'this_month') {
            if (txDate.getFullYear() !== currentYear || txDate.getMonth() !== currentMonth) return false;
          } else if (dateRange === 'last_month') {
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            if (txDate.getFullYear() !== lastYear || txDate.getMonth() !== lastMonth) return false;
          } else if (dateRange === '7_days') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            if (txDate < sevenDaysAgo) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount_desc') return b.displayAmount - a.displayAmount;
        if (sortBy === 'amount_asc') return a.displayAmount - b.displayAmount;
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, dateRange, sortBy, currency, isDemoMode, liveRates]);

  // Overall Statistics (summing converted display amounts in active currency)
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    filteredTransactions.forEach((t) => {
      const amt = Number(t.displayAmount) || 0;
      if (t.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpenses += amt;
      }
    });

    const netBalance = Math.round((totalIncome - totalExpenses) * 100) / 100;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netBalance,
      savingsRate,
      transactionCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  // Category Breakdown for Donut Chart (in active currency)
  const categoryBreakdown = useMemo(() => {
    const expenseMap = {};

    filteredTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const cat = t.category || 'other_expense';
        expenseMap[cat] = (expenseMap[cat] || 0) + Number(t.displayAmount);
      });

    return Object.entries(expenseMap).map(([catId, amount]) => {
      const meta = EXPENSE_CATEGORIES.find((c) => c.id === catId) || {
        label: catId,
        color: '#94a3b8'
      };
      return {
        id: catId,
        name: meta.label,
        value: Math.round(amount * 100) / 100,
        color: meta.color
      };
    }).sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Monthly Cash Flow for Bar Chart (in active currency)
  const monthlyTrends = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const map = {};
    const activeCurr = currency || 'INR';

    transactions.forEach((t) => {
      if (!t.date) return;
      const d = new Date(t.date + 'T00:00:00');
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;

      if (!map[key]) {
        map[key] = { month: key, timestamp: d.getTime(), income: 0, expense: 0 };
      }

      const fromCurr = t.currency || (isDemoMode ? 'USD' : 'INR');
      const amtInActiveCurr = convertCurrency(t.amount, fromCurr, activeCurr, liveRates);

      if (t.type === 'income') {
        map[key].income += amtInActiveCurr;
      } else {
        map[key].expense += amtInActiveCurr;
      }
    });

    return Object.values(map)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(m => ({
        ...m,
        income: Math.round(m.income * 100) / 100,
        expense: Math.round(m.expense * 100) / 100
      }))
      .slice(-6);
  }, [transactions, currency, isDemoMode, liveRates]);

  // Budget vs Actual for Current Month (in active currency)
  const budgetProgress = useMemo(() => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const activeCurr = currency || 'INR';

    const spending = {};
    transactions
      .filter((t) => {
        if (t.type !== 'expense' || !t.date) return false;
        const d = new Date(t.date + 'T00:00:00');
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .forEach((t) => {
        const cat = t.category || 'other_expense';
        const fromCurr = t.currency || (isDemoMode ? 'USD' : 'INR');
        const amt = convertCurrency(t.amount, fromCurr, activeCurr, liveRates);
        spending[cat] = (spending[cat] || 0) + amt;
      });

    return Object.entries(budgets).map(([catId, rawLimit]) => {
      // Convert budget limit to active currency according to FX trend
      const limit = convertCurrency(rawLimit, budgetsCurrency || 'INR', activeCurr, liveRates);
      const spent = Math.round((spending[catId] || 0) * 100) / 100;
      const percentage = limit > 0 ? Math.min(200, Math.round((spent / limit) * 100)) : 0;
      const meta = EXPENSE_CATEGORIES.find((c) => c.id === catId) || {
        label: catId,
        color: '#6366f1'
      };

      return {
        id: catId,
        name: meta.label,
        limit,
        spent,
        percentage,
        isWarning: percentage >= 80 && percentage <= 100,
        isExceeded: percentage > 100
      };
    });
  }, [transactions, budgets, budgetsCurrency, currency, isDemoMode, liveRates]);

  // AI-Powered Spending Insights
  const aiInsights = useMemo(() => {
    if (transactions.length === 0) {
      return {
        healthScore: 100,
        headline: "Ready for your financial records",
        tips: [
          "Start by adding your first income or expense transaction.",
          "Click 'Preview Demo Data' anytime to see full analytics with sample data, and click it again to revert.",
          "Categorizing expenses accurately helps you monitor budget targets."
        ]
      };
    }

    const tips = [];
    let score = 85;

    if (stats.savingsRate >= 30) {
      tips.push(`🌟 Outstanding savings rate of ${stats.savingsRate}%! Well above the standard 20% benchmark.`);
      score += 10;
    } else if (stats.savingsRate > 0) {
      tips.push(`💡 Your savings rate is ${stats.savingsRate}%. Trimming discretionary expenses could help you reach the 25% target.`);
      score -= 5;
    } else {
      tips.push(`⚠️ Your expenses currently exceed your income. Audit dining and subscriptions to restore positive balance.`);
      score -= 25;
    }

    if (categoryBreakdown.length > 0) {
      const topExpense = categoryBreakdown[0];
      tips.push(`📊 Your highest expenditure category is "${topExpense.name}" (${topExpense.value.toLocaleString()}).`);
    }

    const exceededBudgets = budgetProgress.filter((b) => b.isExceeded);
    if (exceededBudgets.length > 0) {
      tips.push(`🚨 Over budget in: ${exceededBudgets.map((b) => b.name).join(', ')}.`);
      score -= 10;
    } else {
      tips.push(`✅ All category budgets are currently under control.`);
    }

    return {
      healthScore: Math.max(20, Math.min(100, score)),
      headline: score >= 80 ? "Your finances are in top shape!" : score >= 50 ? "Balanced cashflow with optimization opportunities" : "Attention needed: High spending rate",
      tips
    };
  }, [transactions, stats, categoryBreakdown, budgetProgress]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        filteredTransactions,
        budgets,
        budgetsCurrency,
        accounts: displayAccounts,
        rawAccounts: accounts,
        recurringBills,
        splitBills,
        savingsGoals,
        stats,
        categoryBreakdown,
        monthlyTrends,
        budgetProgress,
        aiInsights,
        liveRates,
        ratesSource,
        isRefreshingRates,
        refreshRates,
        backendStatus,
        isDemoMode,
        toggleDemoData,
        searchQuery,
        setSearchQuery,
        typeFilter,
        setTypeFilter,
        categoryFilter,
        setCategoryFilter,
        dateRange,
        setDateRange,
        sortBy,
        setSortBy,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        updateAllBudgets,
        addSavingsGoal,
        contributeToGoal,
        deleteSavingsGoal,
    resetSavingsGoals,
        transferBetweenAccounts,
        processRecurringBill,
        addRecurringBill,
        addSplitBill,
        clearAll,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
