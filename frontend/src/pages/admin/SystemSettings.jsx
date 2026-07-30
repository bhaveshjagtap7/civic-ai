import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import { Settings, Save, Shield, Sparkles, Clock, Globe } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

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
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          System Settings & AI Controls
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure Gemini AI auto-routing algorithms, SLA resolution thresholds, and global parameters
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-6">
        
        {/* Branding */}
        <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
            <Globe className="w-5 h-5" /> Platform Branding
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Platform Name</label>
            <input
              type="text"
              value={settings.app_name}
              onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none"
            />
          </div>
        </div>

        {/* AI Integration Config */}
        <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sparkles className="w-5 h-5" /> Gemini AI Integration Engine
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Automated Department Routing</label>
            <select
              value={settings.ai_auto_routing}
              onChange={(e) => setSettings({ ...settings, ai_auto_routing: e.target.value })}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold outline-none"
            >
              <option value="enabled">Enabled (Auto-assign complaints via Gemini AI NLP)</option>
              <option value="disabled">Disabled (Manual Admin Queue Assignment)</option>
            </select>
          </div>
        </div>

        {/* SLA Hours */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
            <Clock className="w-5 h-5" /> Resolution SLA Hours Thresholds
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Critical Priority SLA (Hours)</label>
              <input
                type="number"
                value={settings.sla_critical_hours}
                onChange={(e) => setSettings({ ...settings, sla_critical_hours: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-rose-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">High Priority SLA (Hours)</label>
              <input
                type="number"
                value={settings.sla_high_hours}
                onChange={(e) => setSettings({ ...settings, sla_high_hours: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Medium Priority SLA (Hours)</label>
              <input
                type="number"
                value={settings.sla_medium_hours}
                onChange={(e) => setSettings({ ...settings, sla_medium_hours: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Low Priority SLA (Hours)</label>
              <input
                type="number"
                value={settings.sla_low_hours}
                onChange={(e) => setSettings({ ...settings, sla_low_hours: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none font-bold text-slate-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SystemSettings;
