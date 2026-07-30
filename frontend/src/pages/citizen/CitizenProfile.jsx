import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

const CitizenProfile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [saving, setSaving] = useState(false);

  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/auth/profile', { name, phone, address });
      if (res.status === 'success') {
        updateUser({ name, phone, address });
        showSuccess("Profile details updated!");
      }
    } catch (err) {
      showError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information and civic contact preferences
        </p>
      </div>

      <Card hoverEffect={false} className="p-6 sm:p-8 space-y-6">
        
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            <Badge variant={user?.role} className="mt-1.5">
              Role: {user?.role}
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
          />

          <FormInput
            label="Email Address (Read Only)"
            type="email"
            name="email"
            value={user?.email || ''}
            icon={Mail}
            disabled
          />

          <FormInput
            label="Phone Number"
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 987-654-3210"
            icon={Phone}
          />

          <FormInput
            label="Address / Ward Location"
            type="text"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Sector 5, Park Road"
            icon={MapPin}
          />

          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={Save}
            className="w-full py-3 mt-4"
          >
            Save Profile Changes
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default CitizenProfile;
