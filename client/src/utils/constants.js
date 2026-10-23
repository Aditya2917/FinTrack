export const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹)', rate: 83.5 },
  { code: 'USD', symbol: '$', label: 'USD ($)', rate: 1.0 },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.92 },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.79 },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)', rate: 1.52 },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)', rate: 155.0 }
];

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: '#f97316', icon: 'Utensils' },
  { id: 'groceries', label: 'Groceries', color: '#10b981', icon: 'ShoppingBag' },
  { id: 'housing', label: 'Rent & Housing', color: '#6366f1', icon: 'Home' },
  { id: 'utilities', label: 'Bills & Utilities', color: '#06b6d4', icon: 'Zap' },
  { id: 'transport', label: 'Transportation', color: '#3b82f6', icon: 'Car' },
  { id: 'shopping', label: 'Shopping', color: '#ec4899', icon: 'Tag' },
  { id: 'entertainment', label: 'Entertainment', color: '#a855f7', icon: 'Film' },
  { id: 'health', label: 'Healthcare & Fitness', color: '#ef4444', icon: 'HeartPulse' },
  { id: 'education', label: 'Education & Courses', color: '#14b8a6', icon: 'GraduationCap' },
  { id: 'travel', label: 'Travel & Vacation', color: '#eab308', icon: 'Plane' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#8b5cf6', icon: 'CreditCard' },
  { id: 'other_expense', label: 'Other Expenses', color: '#64748b', icon: 'MoreHorizontal' }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary / Wages', color: '#10b981', icon: 'Briefcase' },
  { id: 'freelance', label: 'Freelance & Contract', color: '#3b82f6', icon: 'Laptop' },
  { id: 'investments', label: 'Investments & Dividends', color: '#8b5cf6', icon: 'TrendingUp' },
  { id: 'business', label: 'Business Revenue', color: '#f59e0b', icon: 'Building' },
  { id: 'rental', label: 'Rental Income', color: '#06b6d4', icon: 'Key' },
  { id: 'gifts', label: 'Gifts & Awards', color: '#ec4899', icon: 'Gift' },
  { id: 'other_income', label: 'Other Income', color: '#64748b', icon: 'PlusCircle' }
];

export const PAYMENT_METHODS = [
  { id: 'card', label: 'Debit / Credit Card' },
  { id: 'upi', label: 'UPI / Online' },
  { id: 'cash', label: 'Cash' },
  { id: 'bank', label: 'Bank Transfer' },
  { id: 'wallet', label: 'Digital Wallet' }
];

export const INITIAL_BUDGETS = {
  food: 20000,
  housing: 25000,
  groceries: 8000,
  utilities: 5000,
  transport: 4000,
  shopping: 6000,
  entertainment: 3500,
  subscriptions: 1500
};
