import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Shield, Mail, Lock, LogIn, Sparkles, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.status === 'success') {
        login(res.data.user, res.data.token);
        showSuccess(`Welcome back, ${res.data.user.name}!`);

        // Redirect based on role
        if (res.data.user.role === 'Admin') navigate('/admin');
        else if (res.data.user.role === 'Officer') navigate('/officer');
        else navigate('/');
      }
    } catch (err) {
      showError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Demo account quick fill helper
  const fillDemoAccount = (role) => {
    if (role === 'Admin') {
      setEmail('admin@civicai.gov');
      setPassword('Admin123!');
    } else if (role === 'Officer') {
      setEmail('road.officer@civicai.gov');
      setPassword('Officer123!');
    } else {
      setEmail('citizen@civicai.gov');
      setPassword('Citizen123!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 glass-card">
        
        {/* Left Hero Panel */}
        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">CivicAI</span>
            </div>

            <div className="mt-10 space-y-4">
              <h2 className="text-3xl font-extrabold leading-tight">
                AI Powered Public Service Automation Platform
              </h2>
              <p className="text-brand-100 text-sm leading-relaxed">
                Empowering citizens and municipal officers with intelligent complaint classification, automated department routing, real-time SLA tracking, and resolution analytics.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 space-y-3">
            <div className="flex items-center gap-3 text-xs text-brand-100 bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
              <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <span>Automated Gemini AI Complaint Classification & Dept Routing</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-brand-100 bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
              <span>Transparent Audit Logs & Public Service SLA Monitoring</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Portal Login</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in with your Citizen, Officer, or Admin account</p>

            {/* Quick Demo Accounts Helper */}
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Quick Demo Fill:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('Citizen')}
                  className="text-xs px-2.5 py-1 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800 rounded-lg hover:bg-brand-100 font-medium transition-colors"
                >
                  Citizen User
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('Officer')}
                  className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 font-medium transition-colors"
                >
                  Roads Officer
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('Admin')}
                  className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 font-medium transition-colors"
                >
                  System Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@civicai.gov"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have a citizen account?{' '}
              <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
