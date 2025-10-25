// src/pages/Auth.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Auth({ onGuest }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const toggleMode = () => setMode((m) => (m === 'signin' ? 'signup' : 'signin'));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message ?? 'Authentication error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 via-sky-100 to-violet-100 px-4">
      {/* Logo / Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-[conic-gradient(from_0deg_at_50%_50%,#ff4444,#f59e0b,#84cc16,#06b6d4,#3b82f6,#a855f7,#ec4899,#ff4444)] animate-[spin_12s_linear_infinite]">
          EduAlign
        </h1>
        <p className="text-slate-700 text-sm mt-1 italic tracking-wide">
          Where Data Meets Destiny
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/50 p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500">
          {mode === 'signin' ? 'Sign in to continue' : 'Create your EduAlign account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
            required
          />

          {error && (
            <div className="text-center text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg py-1">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl py-2 font-medium text-white bg-gradient-to-r from-rose-500 via-amber-400 to-sky-500 hover:opacity-90 transition disabled:opacity-50"
          >
            {busy
              ? 'Please wait…'
              : mode === 'signin'
              ? 'Sign in'
              : 'Create account'}
          </button>
        </form>

        <div className="text-center text-sm space-x-1">
          {mode === 'signin' ? (
            <>
              <span>New here?</span>
              <button className="text-sky-600 hover:underline" onClick={toggleMode}>
                Create account
              </button>
            </>
          ) : (
            <>
              <span>Already registered?</span>
              <button className="text-sky-600 hover:underline" onClick={toggleMode}>
                Sign in
              </button>
            </>
          )}
        </div>

        <div className="pt-3">
          <button
            onClick={onGuest}
            className="w-full border border-slate-300 rounded-xl py-2 text-slate-600 hover:bg-gradient-to-r hover:from-pink-100 hover:via-sky-100 hover:to-violet-100 transition"
          >
            🌈 Browse as Guest (no cloud save)
          </button>
        </div>
      </div>
    </div>
  );
}
