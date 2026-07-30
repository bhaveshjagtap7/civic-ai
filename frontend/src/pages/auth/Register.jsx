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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-7 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-gray-900">CivicAI</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Create your account</h1>
          <p className="text-xs text-gray-400 mt-0.5">Join CivicAI for fast municipal grievance resolution</p>
        </div>

        <div className="px-6 py-5">
          <form onSubmit={handleRegister} className="space-y-3">
            <FormInput label="Full Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" icon={User} required />
            <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" icon={Mail} required />
            <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={Lock} required />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765-43210" icon={Phone} />
              <FormInput label="Address" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Sector 5, Park Road" icon={MapPin} />
            </div>
            <Button type="submit" variant="primary" loading={loading} icon={UserPlus} className="w-full mt-1">
              Create Account
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 pt-4 mt-2 border-t border-gray-100">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
