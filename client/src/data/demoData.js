export const generateDemoTransactions = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const formatD = (d) => d.toISOString().split('T')[0];

  return [
    // Current Month Transactions
    {
      id: 'tx-1',
      title: 'Senior Software Engineer Salary',
      amount: 5200,
      type: 'income',
      category: 'salary',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month, 1)),
      notes: 'Monthly tech salary from TechCorp',
      recurring: 'monthly'
    },
    {
      id: 'tx-2',
      title: 'Modern Luxury Apartment Rent',
      amount: 1200,
      type: 'expense',
      category: 'housing',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month, 2)),
      notes: 'Monthly apartment rent & maintenance',
      recurring: 'monthly'
    },
    {
      id: 'tx-3',
      title: 'Whole Foods Market & Organic Produce',
      amount: 145.5,
      type: 'expense',
      category: 'groceries',
      paymentMethod: 'card',
      date: formatD(new Date(year, month, 4)),
      notes: 'Weekly groceries & fresh fruits'
    },
    {
      id: 'tx-4',
      title: 'Freelance Mobile App UI Design',
      amount: 950,
      type: 'income',
      category: 'freelance',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month, 7)),
      notes: 'Milestone 2 payment for FinTech Client'
    },
    {
      id: 'tx-5',
      title: 'Electric & Fiber High-Speed Internet',
      amount: 135,
      type: 'expense',
      category: 'utilities',
      paymentMethod: 'upi',
      date: formatD(new Date(year, month, 8)),
      notes: 'Gigabit internet + green power electricity'
    },
    {
      id: 'tx-6',
      title: 'Fine Dining at Artisan Bistro',
      amount: 88,
      type: 'expense',
      category: 'food',
      paymentMethod: 'card',
      date: formatD(new Date(year, month, 10)),
      notes: 'Team dinner celebration'
    },
    {
      id: 'tx-7',
      title: 'Trader Joe’s Weekly Grocery Run',
      amount: 112.4,
      type: 'expense',
      category: 'groceries',
      paymentMethod: 'card',
      date: formatD(new Date(year, month, 13)),
      notes: 'Snacks, dairy, and meal prep'
    },
    {
      id: 'tx-8',
      title: 'Vanguard Index Fund Dividends',
      amount: 220,
      type: 'income',
      category: 'investments',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month, 15)),
      notes: 'Quarterly ETF distribution'
    },
    {
      id: 'tx-9',
      title: 'Uber Rides & City Transit Pass',
      amount: 64,
      type: 'expense',
      category: 'transport',
      paymentMethod: 'card',
      date: formatD(new Date(year, month, 16)),
      notes: 'Metro reload and ride shares'
    },
    {
      id: 'tx-10',
      title: 'Nike Performance Running Shoes',
      amount: 130,
      type: 'expense',
      category: 'shopping',
      paymentMethod: 'card',
      date: formatD(new Date(year, month, 18)),
      notes: 'Marathon training gear'
    },
    {
      id: 'tx-11',
      title: 'Netflix 4K & Spotify Family Bundle',
      amount: 32,
      type: 'expense',
      category: 'subscriptions',
      paymentMethod: 'card',
      date: formatD(new Date(year, month, 19)),
      notes: 'Monthly digital entertainment',
      recurring: 'monthly'
    },
    {
      id: 'tx-12',
      title: 'Equinox Gym & Wellness Membership',
      amount: 75,
      type: 'expense',
      category: 'health',
      paymentMethod: 'card',
      date: formatD(new Date(year, month, 21)),
      notes: 'Monthly gym and sauna pass'
    },
    {
      id: 'tx-13',
      title: 'Weekend Coffee & Brunch Outings',
      amount: 46.5,
      type: 'expense',
      category: 'food',
      paymentMethod: 'upi',
      date: formatD(new Date(year, month, 22)),
      notes: 'Espresso and avocado toast'
    },

    // Previous Month 1 Transactions
    {
      id: 'tx-14',
      title: 'Monthly Tech Salary',
      amount: 5200,
      type: 'income',
      category: 'salary',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month - 1, 1)),
      notes: 'Direct deposit',
      recurring: 'monthly'
    },
    {
      id: 'tx-15',
      title: 'Apartment Rent',
      amount: 1200,
      type: 'expense',
      category: 'housing',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month - 1, 2)),
      notes: 'Monthly rent',
      recurring: 'monthly'
    },
    {
      id: 'tx-16',
      title: 'Grocery Supplies & Pantry Restock',
      amount: 320,
      type: 'expense',
      category: 'groceries',
      paymentMethod: 'card',
      date: formatD(new Date(year, month - 1, 6)),
      notes: 'Monthly bulk items'
    },
    {
      id: 'tx-17',
      title: 'Web Consulting Gig',
      amount: 1200,
      type: 'income',
      category: 'freelance',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month - 1, 14)),
      notes: 'E-commerce API integration'
    },
    {
      id: 'tx-18',
      title: 'Weekend Mountain Getaway AirBnB',
      amount: 280,
      type: 'expense',
      category: 'travel',
      paymentMethod: 'card',
      date: formatD(new Date(year, month - 1, 20)),
      notes: 'Cabin weekend with friends'
    },
    {
      id: 'tx-19',
      title: 'Dining Out & Cocktail Lounge',
      amount: 125,
      type: 'expense',
      category: 'food',
      paymentMethod: 'card',
      date: formatD(new Date(year, month - 1, 23)),
      notes: 'Friday dinner'
    },

    // Previous Month 2 Transactions
    {
      id: 'tx-20',
      title: 'Monthly Tech Salary',
      amount: 5200,
      type: 'income',
      category: 'salary',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month - 2, 1)),
      notes: 'Direct deposit',
      recurring: 'monthly'
    },
    {
      id: 'tx-21',
      title: 'Apartment Rent',
      amount: 1200,
      type: 'expense',
      category: 'housing',
      paymentMethod: 'bank',
      date: formatD(new Date(year, month - 2, 2)),
      notes: 'Monthly rent',
      recurring: 'monthly'
    },
    {
      id: 'tx-22',
      title: 'Tech Gadgets & Ergonomic Keyboard',
      amount: 210,
      type: 'expense',
      category: 'shopping',
      paymentMethod: 'card',
      date: formatD(new Date(year, month - 2, 11)),
      notes: 'Home office ergonomic upgrade'
    },
    {
      id: 'tx-23',
      title: 'Annual Car Insurance & Maintenance',
      amount: 195,
      type: 'expense',
      category: 'transport',
      paymentMethod: 'card',
      date: formatD(new Date(year, month - 2, 18)),
      notes: 'Oil change and insurance installment'
    }
  ];
};
