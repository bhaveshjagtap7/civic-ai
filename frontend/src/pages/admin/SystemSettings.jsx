import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import { Save, Sparkles, Clock, Globe } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    app_name: 'CivicAI Platform',
    ai_auto_routing: 'enabled',
    sla_critical_hours: '24',
    sla_high_hours: '48',
    sla_medium_hours: '72',
    sla_low_hours: '120'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/admin/settings');
        if (res.status === 'success' && Array.isArray(res.data)) {
          const map = {};
          res.data.forEach((s) => {
            map[s.setting_key] = s.setting_value;
          });
          setSettings((prev) => ({ ...prev, ...map }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/admin/settings', settings);
      if (res.status === 'success') {
        showSuccess("System settings updated successfully!");
      }
    } catch (err) {
      showError(err.message || "Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonLoader count={3} type="card" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="System Settings & AI Controls"
        subtitle="Configure Gemini AI auto-routing algorithms, SLA resolution thresholds, and global platform parameters."
        breadcrumbs={[{ label: 'Admin', link: '/admin' }, { label: 'Settings' }]}
      />

      <Card hoverEffect={false} className="p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Branding */}
          <div className="space-y-4 pb-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Globe className="w-5 h-5" /> Platform Branding
            </div>

            <FormInput
              label="Platform Title / Heading"
              type="text"
              name="app_name"
              value={settings.app_name}
              onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
            />
          </div>

          {/* AI Integration Config */}
          <div className="space-y-4 pb-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Sparkles className="w-5 h-5" /> Gemini AI Integration Engine
            </div>

            <FormInput
              label="Automated Department Routing"
              type="select"
              name="ai_auto_routing"
              value={settings.ai_auto_routing}
              onChange={(e) => setSettings({ ...settings, ai_auto_routing: e.target.value })}
              options={[
                { value: 'enabled', label: 'Enabled (Auto-assign complaints via Gemini AI NLP)' },
                { value: 'disabled', label: 'Disabled (Manual Admin Queue Assignment)' }
              ]}
            />
          </div>

          {/* SLA Hours */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Clock className="w-5 h-5" /> Resolution SLA Hours Thresholds
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Critical Priority SLA (Hours)"
                type="number"
                name="sla_critical_hours"
                value={settings.sla_critical_hours}
                onChange={(e) => setSettings({ ...settings, sla_critical_hours: e.target.value })}
              />

              <FormInput
                label="High Priority SLA (Hours)"
                type="number"
                name="sla_high_hours"
                value={settings.sla_high_hours}
                onChange={(e) => setSettings({ ...settings, sla_high_hours: e.target.value })}
              />

              <FormInput
                label="Medium Priority SLA (Hours)"
                type="number"
                name="sla_medium_hours"
                value={settings.sla_medium_hours}
                onChange={(e) => setSettings({ ...settings, sla_medium_hours: e.target.value })}
              />

              <FormInput
                label="Low Priority SLA (Hours)"
                type="number"
                name="sla_low_hours"
                value={settings.sla_low_hours}
                onChange={(e) => setSettings({ ...settings, sla_low_hours: e.target.value })}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={saving}
            icon={Save}
            className="w-full py-3.5 mt-4"
          >
            Save System Settings
          </Button>
        </form>
      </Card>
    </motion.div>
  );
};

export default SystemSettings;
