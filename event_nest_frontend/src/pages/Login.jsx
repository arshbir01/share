import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { showToast } from '../lib/toast.js';

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginView) await login(email, password);
      else await register(name, email, password);
      showToast(isLoginView ? 'Login successful!' : 'Account created!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      showToast(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="page-login">
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="panel-glass max-w-4xl w-full grid md:grid-cols-2 rounded-2xl overflow-hidden">
          <div className="hidden md:flex flex-col items-center justify-center text-center p-12 bg-gray-900/50">
            <div className="relative w-48 h-48 mb-6">
              <div className="abstract-graphic h-48">
                <div className="graphic-element"></div>
                <div className="graphic-element"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Join the Nest</h2>
            <p className="text-gray-300">Sign up to unlock your campus experience. Register for events, get updates, and connect.</p>
          </div>
          <div className="p-8 md:p-12">
            <div className="flex mb-8 border-b border-gray-700/50">
              <button onClick={() => setIsLoginView(true)} className={`flex-1 py-3 text-lg font-semibold border-b-2 ${isLoginView ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400'}`}>Login</button>
              <button onClick={() => setIsLoginView(false)} className={`flex-1 py-3 text-lg font-semibold border-b-2 ${!isLoginView ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400'}`}>Sign Up</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-bold text-white">{isLoginView ? 'Welcome Back!' : 'Create Account'}</h2>
              {error && <p className="text-red-400">{error}</p>}
              {!isLoginView && (
                <div>
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div>
                <label className="form-label">College Email</label>
                <input type="email" className="form-input" placeholder="you@college.edu" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-full !mt-4 py-3 text-lg" disabled={loading}>
                {loading ? 'Processing...' : (isLoginView ? (<><LogIn className="inline-block mr-2 w-5 h-5" /> Login</>) : (<><UserPlus className="inline-block mr-2 w-5 h-5" /> Create Account</>))}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
