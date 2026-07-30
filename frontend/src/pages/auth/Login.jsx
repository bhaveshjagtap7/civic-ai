import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import {
  Shield, Mail, Lock, LogIn, Sparkles, CheckCircle2,
  Building2, Clock, ShieldCheck, Activity, Award
} from 'lucide-react';
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
      showError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.status === 'success') {
        login(res.data.user, res.data.token);
        showSuccess(`Welcome back, ${res.data.user.name}!`);
        if (res.data.user.role === 'Admin') navigate('/admin');
        else if (res.data.user.role === 'Officer') navigate('/officer');
        else navigate('/');
      }
    } catch (err) {
      showError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fill = (role) => {
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-12">
        
        {/* Left Information Panel: Official Government SaaS Info (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          
          {/* Top Brand Header */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white block">CivicAI</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Municipal Governance Platform
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                <Building2 className="w-3.5 h-3.5" /> Official Government Digital Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Smart Public Grievance Automation & SLA Governance System
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Empowering citizens and municipal departments with intelligent AI complaint classification, automatic ward routing, transparent resolution tracking, and real-time SLA analytics.
              </p>
            </div>

            {/* Platform Metrics Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                  <Award className="w-4 h-4" /> 99.4% SLA Speed
                </div>
                <p className="text-[11px] text-slate-300">On-time target resolution for ward complaints</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4" /> Gemini AI Engine
                </div>
                <p className="text-[11px] text-slate-300">Instant NLP auto-categorization & priority tagging</p>
              </div>
            </div>

            {/* Key Service Directives */}
            <div className="space-y-2 pt-1 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-modal submission: Audio, Geo-location photo upload, and text</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated dispatching to designated ward officers & department heads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>End-to-end transparent resolution timeline & citizen satisfaction feedback</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Pledge */}
          <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>ISO 27001 Security & Audit Compliant</span>
            </div>
            <span className="font-mono">v2.4.0-GOV</span>
          </div>
        </div>

        {/* Right Portal Single Sign-On (SSO) Form Panel (5 Cols) */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div className="space-y-6">
            
            {/* Form Header */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block mb-2">
                Single Sign-On (SSO)
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Portal Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your official Citizen, Officer, or Admin credentials
              </p>
            </div>

            {/* Quick Demo Fill Accounts Selector */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Quick Demo Profile Login:
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fill('Citizen')}
                  className="text-xs px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => fill('Officer')}
                  className="text-xs px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Roads Officer
                </button>
                <button
                  type="button"
                  onClick={() => fill('Admin')}
                  className="text-xs px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-xs"
                >
                  System Admin
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <FormInput
                label="Official Email Address"
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
                className="w-full h-11 text-sm font-bold mt-2"
              >
                Sign In to Portal
              </Button>
            </form>
          </div>

          {/* Footer Register Link & Security Audit Notice */}
          <div className="mt-8 pt-4 border-t border-slate-100 space-y-2 text-center">
            <p className="text-xs text-slate-500">
              New citizen user?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Create an account
              </Link>
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              Authorized municipal access only. Unauthorized login attempts are monitored and recorded.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
