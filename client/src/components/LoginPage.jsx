import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CURRENCIES } from '../utils/constants';
import {
  Wallet,
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  TrendingUp,
  Sparkles,
  Globe2
} from 'lucide-react';

export const LoginPage = () => {
  const { login, register, theme, toggleTheme, currency } = useAuth();
  
  // Tab state: 'login' | 'register'
  const [tab, setTab] = useState('login');
  
  // Sign In form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Create Account form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currencyPref, setCurrencyPref] = useState(currency || 'INR');

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);
      if (!res?.success) {
        setError('Invalid email or password. Please verify your credentials.');
      }
    } catch (err) {
      setError('Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    if (regPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(regName, regEmail, regPassword, currencyPref);
      if (!res?.success) {
        setError('Failed to create account. Email may already be in use.');
      }
    } catch (err) {
      setError('Account registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 relative overflow-hidden transition-colors duration-200">
      {/* Background Animated Gradient Mesh Glows */}
      <div className="absolute top-0 left-1/4 -mt-32 w-[520px] h-[520px] rounded-full bg-emerald-500/15 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 -mb-32 w-[520px] h-[520px] rounded-full bg-indigo-500/15 blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-teal-500/10 blur-[160px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Wallet className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                FinTrack
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] dark:text-slate-400 text-slate-500 font-medium hidden sm:block">
              Personal Finance & Multi-Currency Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Spring Boot Status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-900/80 bg-white/80 border dark:border-slate-800 border-slate-200 backdrop-blur-md shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] dark:text-slate-300 text-slate-700">Spring Boot 3.3.5 API Active</span>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl dark:text-slate-300 text-slate-700 dark:bg-slate-900/80 bg-white/80 hover:bg-slate-200 dark:hover:bg-slate-800 border dark:border-slate-800 border-slate-200 transition cursor-pointer backdrop-blur-md shadow-xs"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
        </div>
      </header>

      {/* Main Showcase & Sliding Auth Card */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: HERO WITH EYE-CATCHING SLIDING ANIMATION   */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left animate-slide-in-left">
            
            {/* Top Pill Badge */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>Next-Generation Personal Finance Suite</span>
            </div>

            {/* Sliding Hero Content Carousel */}
            <div className="overflow-hidden relative w-full">
              <div
                className="flex transition-transform duration-700 ease-out w-[200%]"
                style={{ transform: tab === 'login' ? 'translateX(0%)' : 'translateX(-50%)' }}
              >
                {/* ---------------------------------------------------- */}
                {/* Hero Slide 1: Master Your Money with Intelligent Clarity */}
                {/* ---------------------------------------------------- */}
                <div className="w-1/2 pr-3 space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    Master Your Money with <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent">Intelligent Clarity</span>.
                  </h1>
                  <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Track liquid net worth, convert across global currencies in real-time, enforce category budget limits, and automate expense intelligence with bank-grade security.
                  </p>
                </div>

                {/* ---------------------------------------------------- */}
                {/* Hero Slide 2: Start Fresh Today with Clean Default Slate */}
                {/* ---------------------------------------------------- */}
                <div className="w-1/2 pl-3 space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    Start Your Journey to <span className="bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Financial Freedom</span>.
                  </h1>
                  <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Create your personalized vault in seconds. Zero clutter on entry, isolated per-user records, and smart budgeting calibrated to your chosen currency.
                  </p>
                </div>

              </div>
            </div>

            {/* Feature Capability Highlights */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left"
            >
              <div className="p-4 rounded-2xl glass-card border dark:border-slate-800/80 border-slate-200 transition hover:border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Globe2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold dark:text-white text-slate-900">Real-Time FX Trends</h2>
                    <p className="text-[11px] dark:text-slate-400 text-slate-500">INR, USD, EUR, GBP, CAD & JPY</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl glass-card border dark:border-slate-800/80 border-slate-200 transition hover:border-indigo-500/40">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold dark:text-white text-slate-900">Adaptive Budgets</h2>
                    <p className="text-[11px] dark:text-slate-400 text-slate-500">Dynamic limit conversion</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bullet Proof Highlights */}
            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1"
            >
              <div className="flex items-center gap-2 text-xs font-medium dark:text-slate-300 text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Zero Demo Clutter on Entry</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium dark:text-slate-300 text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Isolated Per-User Data</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium dark:text-slate-300 text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>JWT Session Authentication</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: SLIDING AUTHENTICATION CARD                */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto animate-slide-in-right">
            <div className="rounded-3xl glass-card p-6 sm:p-8 border dark:border-slate-800/80 border-slate-200 shadow-2xl relative transition-all duration-300 backdrop-blur-xl">
              
              {/* SLIDING SEGMENTED SWITCHER (Sign In vs Create Account) */}
              <div className="relative p-1 rounded-2xl dark:bg-slate-950/80 bg-slate-100 border dark:border-slate-800 border-slate-200 flex mb-6">
                {/* Animated Sliding Highlight Pill */}
                <div
                  className={`absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/25 transition-all duration-300 ease-out ${
                    tab === 'login' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(''); }}
                  className={`relative z-10 flex-1 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition cursor-pointer flex items-center justify-center gap-2 ${
                    tab === 'login' ? 'text-slate-950 font-black' : 'dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(''); }}
                  className={`relative z-10 flex-1 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition cursor-pointer flex items-center justify-center gap-2 ${
                    tab === 'register' ? 'text-slate-950 font-black' : 'dark:text-slate-400 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Error Alert with Fade-in */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2 animate-in fade-in zoom-in-95">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* SLIDING FORM CAROUSEL CONTAINER */}
              <div className="overflow-hidden relative w-full">
                <div
                  className="flex transition-transform duration-500 ease-in-out w-[200%]"
                  style={{ transform: tab === 'login' ? 'translateX(0%)' : 'translateX(-50%)' }}
                >
                  
                  {/* =================================================== */}
                  {/* SLIDE 1: SIGN IN FORM */}
                  {/* =================================================== */}
                  <div className="w-1/2 pr-2">
                    <div className="mb-4">
                      <h3 className="text-lg font-extrabold dark:text-white text-slate-900">Welcome Back</h3>
                      <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">Enter your email and password to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 pl-10 pr-3 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700">Password</label>
                        </div>
                        <div className="relative">
                          <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 pl-10 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                          />
                          {/* Eye / EyeOff Button to see and unsee password */}
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 cursor-pointer focus:outline-none"
                            title={showLoginPassword ? 'Hide password' : 'Show password'}
                            aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                          >
                            {showLoginPassword ? (
                              <EyeOff className="h-4 w-4 text-emerald-500 transition-transform active:scale-90" />
                            ) : (
                              <Eye className="h-4 w-4 transition-transform active:scale-90" />
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide uppercase transition shadow-lg shadow-emerald-500/25 active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span>Authenticating...</span>
                        ) : (
                          <>
                            <span>Sign In to Dashboard</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-5 text-center">
                      <p className="text-xs dark:text-slate-400 text-slate-500">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => { setTab('register'); setError(''); }}
                          className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Create an account →
                        </button>
                      </p>
                    </div>
                  </div>

                  {/* =================================================== */}
                  {/* SLIDE 2: CREATE ACCOUNT (SIGN UP) FORM */}
                  {/* =================================================== */}
                  <div className="w-1/2 pl-2">
                    <div className="mb-4">
                      <h3 className="text-lg font-extrabold dark:text-white text-slate-900">Create Account</h3>
                      <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">Start fresh with your own financial records</p>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                          <User className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            placeholder="Alex Morgan"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                          <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Password</label>
                        <div className="relative">
                          <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            placeholder="Create strong password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                          />
                          {/* Eye / EyeOff Button for Registration Password */}
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 cursor-pointer focus:outline-none"
                            title={showRegPassword ? 'Hide password' : 'Show password'}
                            aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                          >
                            {showRegPassword ? (
                              <EyeOff className="h-4 w-4 text-emerald-500 transition-transform active:scale-90" />
                            ) : (
                              <Eye className="h-4 w-4 transition-transform active:scale-90" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Confirm Password</label>
                        <div className="relative">
                          <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs dark:text-white text-slate-900 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
                          />
                          {/* Eye / EyeOff Button for Confirm Password */}
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 cursor-pointer focus:outline-none"
                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-emerald-500 transition-transform active:scale-90" />
                            ) : (
                              <Eye className="h-4 w-4 transition-transform active:scale-90" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold dark:text-slate-300 text-slate-700 mb-1">Default Base Currency</label>
                        <select
                          value={currencyPref}
                          onChange={(e) => setCurrencyPref(e.target.value)}
                          className="w-full dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-300 rounded-xl text-xs font-semibold dark:text-white text-slate-900 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.symbol} {c.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs tracking-wide uppercase transition shadow-lg shadow-emerald-500/25 active:scale-98 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span>Creating Account...</span>
                        ) : (
                          <>
                            <span>Create My Account</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="mt-4 text-center">
                      <p className="text-xs dark:text-slate-400 text-slate-500">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => { setTab('login'); setError(''); }}
                          className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Sign in here →
                        </button>
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Security Footer */}
              <div className="mt-6 pt-4 border-t dark:border-slate-800/80 border-slate-200 flex items-center justify-center gap-2 text-[11px] dark:text-slate-400 text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>JWT Protected & Encrypted Multi-User Storage</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t dark:border-slate-900 border-slate-200 py-4 text-center text-xs dark:text-slate-500 text-slate-600">
        FinTrack Enterprise Edition • Spring Boot 3.3.5 & React 19 Fullstack Architecture
      </footer>
    </div>
  );
};
