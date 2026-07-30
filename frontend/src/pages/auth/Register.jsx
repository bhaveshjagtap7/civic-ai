import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Shield, User, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showError("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.status === 'success') {
        login(res.data.user, res.data.token);
        showSuccess("Citizen account created successfully! Welcome to CivicAI.");
        navigate('/');
      }
    } catch (err) {
      showError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 glass-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Citizen Registration</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Join CivicAI for fast automated municipal grievance resolution</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <FormInput
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            icon={User}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            icon={Mail}
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            icon={Lock}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Phone Number"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 987-654-3210"
              icon={Phone}
            />

            <FormInput
              label="Residential Address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Sector 5, Park Road"
              icon={MapPin}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={UserPlus}
            className="w-full py-3 mt-2"
          >
            Create Citizen Account
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
