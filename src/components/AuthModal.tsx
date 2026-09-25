'use client';

import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Building,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { UNIVERSITIES } from '@/data/universities';
import { UniversityId } from '@/types/market';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useMarket();
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login form states
  const [loginSchoolId, setLoginSchoolId] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form states
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [universityId, setUniversityId] = useState<UniversityId>(UNIVERSITIES[0].id);
  const [hostel, setHostel] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const selectedUni = UNIVERSITIES.find((u) => u.id === universityId) || UNIVERSITIES[0];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginSchoolId.trim() || !loginUsername.trim() || !loginPassword.trim()) {
      setError('Please enter your school ID, username, and password.');
      return;
    }
    const result = await login(loginSchoolId, loginUsername, loginPassword);
    if (!result.success) setError(result.error || 'Unable to sign in.');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!schoolId.trim() || !username.trim()) {
      setError('Please enter your school ID and username.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your student email.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your WhatsApp or phone number.');
      return;
    }
    if (!hostel.trim()) {
      setError('Please specify your hall or hostel on campus.');
      return;
    }

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
    if (!result.success) setError(result.error || 'Unable to create account.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Campus Security
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Student Login Required
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            To ensure trust and prevent scam listings, <strong>only verified university students</strong> can post items for sale on CampusMart.
          </p>
        </div>

        {/* Tab navigation: Login vs Register */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              tab === 'login'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In to Existing Account
          </button>

          <button
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              tab === 'signup'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Register Student Account
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  School ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. STU/UG/2026/001"
                    value={loginSchoolId}
                    onChange={(e) => setLoginSchoolId(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Profile Image URL <span className="font-normal text-slate-400">(optional)</span></label>
                <input type="url" placeholder="https://..." value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Username</label>
                <input type="text" placeholder="Your username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required className="w-full text-xs sm:text-sm px-3 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
              >
                Sign In & Continue Posting
              </button>
            </form>
          ) : (
            /* Student Sign-up Form */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input aria-label="School ID" type="text" placeholder="School ID" value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none" />
                <input aria-label="Username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Abena Owusu"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Student Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. aowusu@st.ug.edu.gh or student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  WhatsApp Number (Ghana) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="e.g. 0244123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    University / College <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value as UniversityId)}
                    className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none bg-white font-medium"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.shortName} - {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    Hall or Hostel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Agyeiwaa Hostel, Pent"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {selectedUni.popularHostels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] text-slate-400">Suggestions:</span>
                  {selectedUni.popularHostels.slice(0, 3).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHostel(h)}
                      className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 rounded border border-slate-200"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98"
              >
                Create Account & Post Item
              </button>
            </form>
          )}

          {/* Trust badge */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 justify-center text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>CampusMart never shares your contact details outside Ghana campus trades.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
