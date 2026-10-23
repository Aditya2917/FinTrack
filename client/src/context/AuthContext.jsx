import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fintrack_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    return null; // Require login first!
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fintrack_theme') || 'dark';
  });

  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('fintrack_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('fintrack_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#f8fafc';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setCurrency = (code) => {
    setCurrencyState(code);
    localStorage.setItem('fintrack_currency', code);
    if (user) {
      const updated = { ...user, currency: code };
      setUser(updated);
      localStorage.setItem('fintrack_user', JSON.stringify(updated));
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        const userData = {
          id: data.id || 'usr_' + Date.now(),
          name: data.name || email.split('@')[0],
          email: data.email,
          token: data.token,
          currency: data.currency || currency || 'INR',
          baseCurrency: 'INR'
        };
        setUser(userData);
        setCurrency(userData.currency);
        localStorage.setItem('fintrack_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend offline, using client auth simulation', err);
    }

    // Client fallback simulation
    const simulated = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].replace('.', ' '),
      email,
      token: 'jwt_token_' + Math.random().toString(36).substring(7),
      currency: currency || 'INR',
      baseCurrency: 'INR'
    };
    setUser(simulated);
    localStorage.setItem('fintrack_user', JSON.stringify(simulated));
    return { success: true };
  };

  const register = async (name, email, password, preferredCurrency = 'INR') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, currency: preferredCurrency })
      });
      if (res.ok) {
        const data = await res.json();
        const userData = {
          id: data.id || 'usr_' + Date.now(),
          name: data.name || name,
          email: data.email || email,
          token: data.token,
          currency: data.currency || preferredCurrency,
          baseCurrency: preferredCurrency || 'INR'
        };
        setUser(userData);
        setCurrency(userData.currency);
        localStorage.setItem('fintrack_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend offline, using client registration simulation', err);
    }

    const simulated = {
      id: 'usr_' + Date.now(),
      name,
      email,
      token: 'jwt_token_' + Math.random().toString(36).substring(7),
      currency: preferredCurrency,
      baseCurrency: preferredCurrency || 'INR'
    };
    setUser(simulated);
    setCurrency(preferredCurrency);
    localStorage.setItem('fintrack_user', JSON.stringify(simulated));
    return { success: true };
  };

  const demoLogin = () => {
    const demo = {
      id: 'usr_demo_alex',
      name: 'Alex Morgan',
      email: 'alex.morgan@fintrack.io',
      token: 'jwt_demo_token_alex_2026',
      currency: 'USD',
      baseCurrency: 'USD'
    };
    setUser(demo);
    setCurrency('USD');
    localStorage.setItem('fintrack_user', JSON.stringify(demo));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fintrack_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        theme,
        currency,
        toggleTheme,
        setCurrency,
        login,
        register,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
