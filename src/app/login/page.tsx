'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { UNIVERSITIES } from '@/data/universities';
import { UniversityId } from '@/types/market';

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login, signup } = useMarket();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login form
  const [loginSchoolId, setLoginSchoolId] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Signup form
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState<UniversityId>(UNIVERSITIES[0].id);
  const [hostel, setHostel] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedUni = UNIVERSITIES.find((u) => u.id === universityId) || UNIVERSITIES[0];

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginSchoolId.trim() || !loginUsername.trim() || !loginPassword.trim()) {
      setError('Please enter your school ID, username, and password.');
      return;
    }
    setIsSubmitting(true);
    const result = await login(loginSchoolId, loginUsername, loginPassword);
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || 'Unable to sign in.');
      return;
    }
    router.push('/');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!schoolId.trim() || !username.trim()) { setError('Please enter your school ID and username.'); return; }
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim()) { setError('Please enter your student email.'); return; }
    if (!phone.trim()) { setError('Please provide your WhatsApp or phone number.'); return; }
    if (!hostel.trim()) { setError('Please specify your hall or hostel on campus.'); return; }
    if (!password.trim() || password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setIsSubmitting(true);
    const result = await signup({
        schoolId: schoolId.trim(),
        username: username.trim(),
        password,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        universityId,
        universityName: selectedUni.name,
        hostelOrHall: hostel.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        studentId: `STU/${selectedUni.shortName}/${Math.floor(1000 + Math.random() * 9000)}`,
      });
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || 'Unable to create account.');
      return;
    }
    router.push('/');
  };

  // If already logged in, show nothing while redirecting
  if (currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Hero Panel */}
      <div className="relative hidden lg:flex lg:w-[45%] xl:w-[48%] flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-teal-500/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-emerald-400/5 blur-2xl" />

        {/* Logo & Back */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-emerald-500/30 shrink-0">
              <Image src="/images/logo.png" alt="CampusMart logo" fill sizes="48px" className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">CampusMart</h1>
              <p className="text-xs font-medium text-emerald-400/80">Ghana&apos;s #1 Student Marketplace</p>
            </div>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mt-8">
            Buy & sell on your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              university campus
            </span>
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-sm">
            Join thousands of students across 28+ Ghanaian universities trading textbooks, electronics, dorm essentials & more — safely and affordably.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: ShieldCheck, label: 'Verified student-only community' },
            { icon: Sparkles, label: 'Post items in under 60 seconds' },
            { icon: CheckCircle2, label: 'Prices in GH₵ — no hidden fees' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-emerald-400" />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Right Auth Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16 bg-slate-50 relative overflow-y-auto">
        {/* Mobile back link */}
        <div className="w-full max-w-md lg:hidden mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0">
              <Image src="/images/logo.png" alt="CampusMart logo" fill sizes="40px" className="object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900">CampusMart</h1>
              <p className="text-[10px] font-semibold text-emerald-600">Student Marketplace</p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Secure student account access</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-slate-200/70 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-medium mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-school-id" className="text-xs font-bold text-slate-700">
                  School ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-school-id"
                    type="text"
                    placeholder="e.g. STU/UG/2026/001"
                    value={loginSchoolId}
                    onChange={(e) => setLoginSchoolId(e.target.value)}
                    required
                    className="w-full text-sm pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="login-username" className="text-xs font-bold text-slate-700">Username</label>
                <input id="login-username" type="text" placeholder="Your username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required className="w-full text-sm px-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-sm pl-10 pr-11 py-3 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/15 hover:shadow-lg hover:shadow-emerald-600/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>

              <p className="text-center text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('signup'); setError(null); }}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Create one free
                </button>
              </p>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input aria-label="School ID" type="text" placeholder="School ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required className="w-full text-sm px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none" />
                <input aria-label="Username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full text-sm px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="signup-name" className="text-xs font-bold text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="e.g. Abena Owusu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="signup-email" className="text-xs font-bold text-slate-700">
                  Student Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="e.g. aowusu@st.ug.edu.gh"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="signup-avatar" className="text-xs font-bold text-slate-700">Profile Image URL <span className="font-normal text-slate-400">(optional)</span></label>
                <input id="signup-avatar" type="url" placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full text-sm px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 outline-none" />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="signup-phone" className="text-xs font-bold text-slate-700">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-phone"
                    type="tel"
                    placeholder="e.g. 0244123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="signup-university" className="text-xs font-bold text-slate-700">
                    University <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="signup-university"
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value as UniversityId)}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.shortName} – {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="signup-hostel" className="text-xs font-bold text-slate-700">
                    Hall / Hostel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="signup-hostel"
                    type="text"
                    placeholder="e.g. Agyeiwaa Hostel"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              {selectedUni.popularHostels.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-400 self-center mr-1">Quick pick:</span>
                  {selectedUni.popularHostels.slice(0, 4).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHostel(h)}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                        hostel === h
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="text-xs font-bold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="signup-password"
                    type={showSignupPass ? 'text' : 'password'}
                    placeholder="Create a password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full text-sm pl-10 pr-11 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPass(!showSignupPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showSignupPass ? 'Hide password' : 'Show password'}
                  >
                    {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/15 hover:shadow-lg hover:shadow-emerald-600/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : 'Create Account & Start Trading'}
              </button>

              <p className="text-center text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(null); }}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-6 mt-6 border-t border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>CampusMart never shares your contact details outside campus trades.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
