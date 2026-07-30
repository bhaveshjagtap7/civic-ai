import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Shield, Mail, Lock, LogIn, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 glass-card">
        
        {/* Left Hero Panel */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight">CivicAI</span>
            </div>

            <div className="mt-10 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200">
                Government SaaS Portal
              </span>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
                AI Powered Public Service Automation Platform
              </h2>
              <p className="text-blue-100/80 text-xs leading-relaxed">
                Empowering citizens and municipal officers with intelligent complaint classification, automated department routing, real-time SLA tracking, and resolution analytics.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 space-y-2.5">
            <div className="flex items-center gap-3 text-xs text-blue-100 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
              <span>Automated Gemini AI Complaint Classification & Dept Routing</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-blue-100 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>Transparent Audit Logs & Public Service SLA Monitoring</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Portal Login</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in with your Citizen, Officer, or Admin credentials</p>

            {/* Quick Demo Accounts Helper */}
            <div className="mt-5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Quick Demo Fill:
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('Citizen')}
                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                >
                  Citizen User
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('Officer')}
                  className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg font-semibold hover:bg-amber-100 transition-colors"
                >
                  Roads Officer
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('Admin')}
                  className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-lg font-semibold hover:bg-purple-100 transition-colors"
                >
                  System Admin
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@civicai.gov"
                icon={Mail}
                required
              />

              <FormInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={Lock}
                required
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={LogIn}
                className="w-full py-3"
              >
                Sign In to Portal
              </Button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have a citizen account?{' '}
              <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
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
