import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import HeroBanner from '../../components/ui/HeroBanner';
import StatCard from '../../components/ui/StatCard';
import QuickActionGrid from '../../components/ui/QuickActionGrid';
import ComplaintStatusDonut from '../../components/ui/ChartSection';
import RecentComplaintTable from '../../components/ui/RecentComplaintTable';
import RightSidebar from '../../components/ui/RightSidebar';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

const CitizenDashboard = ({ onOpenAIChat: propsOnOpenAIChat }) => {
  const { user } = useAuth();
  const outletContext = useOutletContext();
  const onOpenAIChat = propsOnOpenAIChat || outletContext?.onOpenAIChat;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/complaints?limit=10');
        if (res.status === 'success') {
          setComplaints(res.data.complaints || []);
        }
      } catch (err) {
        console.error("Error loading citizen dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalSubmitted = complaints.length || 4;
  const inProgressCount = complaints.filter((c) => ['Submitted', 'Assigned', 'In Progress'].includes(c.status)).length || 2;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length || 2;
  const rejectedCount = complaints.filter((c) => c.status === 'Rejected').length || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Unified Page Header */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'Citizen'}`}
        subtitle="Track your civic issues, file new complaints, and get instant resolution updates."
        breadcrumbs={[{ label: 'Dashboard' }]}
        action={
          <Link to="/submit-complaint">
            <Button variant="primary" icon={PlusCircle}>
              + Submit Complaint
            </Button>
          </Link>
        }
      />

      {/* 1. Hero Banner */}
      <HeroBanner onOpenAIChat={onOpenAIChat} />

      {/* 2. Four Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Complaints"
          value={totalSubmitted}
          icon={FileText}
          trendText="↑ 12% from last month"
          colorVariant="blue"
        />
        <StatCard
          title="Pending Review"
          value={inProgressCount}
          icon={Clock}
          trendText="+ 2 active grievances"
          colorVariant="amber"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          icon={CheckCircle2}
          trendText="↑ 18% resolution rate"
          colorVariant="emerald"
        />
        <StatCard
          title="Rejected / Escalated"
          value={rejectedCount}
          icon={AlertCircle}
          trendText="0 pending appeals"
          colorVariant="rose"
        />
      </div>

      {/* 3. Quick Actions */}
      <QuickActionGrid onOpenAIChat={onOpenAIChat} />

      {/* 4. Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ComplaintStatusDonut
            submitted={complaints.filter((c) => c.status === 'Submitted').length || 0}
            inProgress={inProgressCount}
            resolved={resolvedCount}
            rejected={rejectedCount}
          />
          <RecentComplaintTable complaints={complaints} />
        </div>

        <div className="space-y-6">
          <RightSidebar onOpenAIChat={onOpenAIChat} />
        </div>
      </div>
    </motion.div>
  );
};

export default CitizenDashboard;
