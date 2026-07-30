import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, FileText, CheckCircle2, Clock, ArrowRight, Sparkles, MapPin, Shield, Bell, User, Mic, AlertTriangle } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import { motion } from 'framer-motion';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [complaintsRes, notifRes] = await Promise.all([
          api.get('/complaints?limit=10'),
          api.get('/notifications')
        ]);
        if (complaintsRes.status === 'success') {
          setComplaints(complaintsRes.data.complaints || []);
        }
        if (notifRes.status === 'success') {
          setNotifications(notifRes.data || []);
        }
      } catch (err) {
        console.error("Error loading citizen dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalSubmitted = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const activeCount = complaints.filter((c) => ['Submitted', 'Assigned', 'In Progress'].includes(c.status)).length;
  const rejectedCount = complaints.filter((c) => c.status === 'Rejected').length;

  // Calculate Profile Completion %
  const calculateProfileCompletion = () => {
    if (!user) return 50;
    let fields = [user.name, user.email, user.phone, user.address];
    let filled = fields.filter((f) => f && String(f).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const profilePct = calculateProfileCompletion();

  // Aggregate recent status activity from user's complaints
  const recentActivities = complaints.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Welcome Section Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">
              <Shield className="w-4 h-4 text-amber-300" />
              Citizen Municipal Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {user?.name || 'Citizen'}!
            </h1>
            <p className="mt-2 text-blue-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
              Lodge civic issues in seconds. Gemini AI automatically classifies your complaint, routes it to the correct department officer, and updates status in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/submit-complaint">
              <Button variant="primary" icon={PlusCircle} className="bg-white text-blue-700 hover:bg-blue-50 shadow-none border-none">
                Submit New Complaint
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          hoverEffect
          onClick={() => navigate('/submit-complaint')}
          className="p-4 flex items-center gap-3 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800 dark:to-slate-800/60 border-blue-200/60 dark:border-slate-700"
        >
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Submit Ticket</h4>
            <p className="text-[10px] text-slate-500">File civic issue</p>
          </div>
        </Card>

        <Card
          hoverEffect
          onClick={() => navigate('/complaints')}
          className="p-4 flex items-center gap-3 cursor-pointer bg-gradient-to-br from-indigo-50 to-purple-50/50 dark:from-slate-800 dark:to-slate-800/60 border-indigo-200/60 dark:border-slate-700"
        >
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">History & Logs</h4>
            <p className="text-[10px] text-slate-500">Track all tickets</p>
          </div>
        </Card>

        <Card
          hoverEffect
          onClick={() => navigate('/submit-complaint')}
          className="p-4 flex items-center gap-3 cursor-pointer bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-800 dark:to-slate-800/60 border-emerald-200/60 dark:border-slate-700"
        >
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Voice Filing</h4>
            <p className="text-[10px] text-slate-500">Speak to submit</p>
          </div>
        </Card>

        <Card
          hoverEffect
          onClick={() => navigate('/profile')}
          className="p-4 flex items-center gap-3 cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-slate-800 dark:to-slate-800/60 border-purple-200/60 dark:border-slate-700"
        >
          <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">My Profile</h4>
            <p className="text-[10px] text-slate-500">{profilePct}% Completed</p>
          </div>
        </Card>
      </div>

      {/* Complaint Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Submitted</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={totalSubmitted} />
          </h3>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active In Progress</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={activeCount} />
          </h3>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolved</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={resolvedCount} />
          </h3>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rejected</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={rejectedCount} />
          </h3>
        </Card>
      </div>

      {/* Main Grid: Recent Complaints & Status Timeline / Notifications / Profile */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Complaints */}
        <div className="md:col-span-2 space-y-6">
          <Card hoverEffect={false} className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">My Recent Complaints</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track real-time officer progress & department routing</p>
              </div>
              <Link
                to="/complaints"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View All &rarr;
              </Link>
            </div>

            {loading ? (
              <SkeletonLoader count={3} type="card" />
            ) : complaints.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <Sparkles className="w-10 h-10 text-blue-500 mx-auto" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No complaints submitted yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  If you see a pothole, broken street lamp, water leak, or uncollected garbage, file a ticket now!
                </p>
                <Link to="/submit-complaint">
                  <Button variant="primary" icon={PlusCircle} size="sm" className="mt-2">
                    Submit First Complaint
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.slice(0, 5).map((cmp) => (
                  <Card
                    key={cmp.id}
                    hoverEffect
                    className="p-5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                          #{cmp.complaint_number}
                        </span>
                        <Badge variant={cmp.priority}>{cmp.priority} Priority</Badge>
                        <span className="text-xs text-slate-400">&bull;</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{cmp.category}</span>
                      </div>

                      <Badge variant={cmp.status}>{cmp.status}</Badge>
                    </div>

                    <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{cmp.title}</h4>

                    {cmp.ai_summary && (
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-blue-600 dark:text-blue-400">AI Summary: </span>
                          {cmp.ai_summary}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{cmp.location || 'Location Not Specified'}</span>
                      </div>

                      <Link
                        to={`/complaints/${cmp.id}`}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Status Timeline, Notifications, Profile Completion */}
        <div className="space-y-6">
          
          {/* Profile Completion Card */}
          <Card hoverEffect={false} className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Profile Completion</h3>
              <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">{profilePct}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${profilePct}%` }} />
            </div>
            {profilePct < 100 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Complete address & phone in <Link to="/profile" className="text-blue-600 font-bold hover:underline">My Profile</Link> for SMS updates.
              </p>
            )}
          </Card>

          {/* Notifications Card */}
          <Card hoverEffect={false} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-600" /> Recent Notifications
              </h3>
              {notifications.filter((n) => !n.is_read).length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                  {notifications.filter((n) => !n.is_read).length} New
                </span>
              )}
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
              ) : (
                notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => n.link && navigate(n.link)}
                    className="p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:border-blue-400 transition-all text-xs space-y-1"
                  >
                    <p className="font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Complaint Status Timeline Feed */}
          <Card hoverEffect={false} className="p-6 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Live Status Timeline</h3>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-4 text-xs">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 pl-4">No activity history yet</p>
              ) : (
                recentActivities.map((cmp) => (
                  <div key={cmp.id} className="relative pl-5">
                    <div className="absolute -left-[7px] top-0.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">#{cmp.complaint_number} - {cmp.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={cmp.status} size="sm">{cmp.status}</Badge>
                      <span className="text-[10px] text-slate-400">{new Date(cmp.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

      </div>
    </motion.div>
  );
};

export default CitizenDashboard;
