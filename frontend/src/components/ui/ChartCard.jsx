import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import Card from './Card';
import { PieChart, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ComplaintStatusChartCard = ({
  submitted = 12,
  inProgress = 6,
  resolved = 24,
  rejected = 2,
  title = "Complaint Status Breakdown",
  subtitle = "Distribution of active municipal complaints",
}) => {
  const total = submitted + inProgress + resolved + rejected;

  const chartData = {
    labels: ['Submitted', 'In Progress', 'Resolved', 'Rejected'],
    datasets: [
      {
        data: [submitted, inProgress, resolved, rejected],
        backgroundColor: [
          '#2563eb', // Primary Blue
          '#f59e0b', // Warning Amber
          '#22c55e', // Success Green
          '#ef4444', // Danger Red
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
          font: { family: 'Inter', size: 11, weight: '600' },
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'Inter', size: 12, weight: '700' },
        bodyFont: { family: 'Inter', size: 11 },
      },
    },
    cutout: '74%',
  };

  return (
    <Card hoverEffect={false} className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          {total} Total
        </span>
      </div>

      <div className="h-56 relative flex items-center justify-center">
        {total === 0 ? (
          <div className="text-center text-xs text-slate-400">No status data yet</div>
        ) : (
          <>
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{total}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Issues</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export const MonthlyTrendChartCard = ({
  trendData = [],
  title = "Complaint Trend Chart",
  subtitle = "Monthly overview of reported vs resolved issues",
}) => {
  const months = trendData.length > 0 ? trendData.map((d) => d.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const submittedCounts = trendData.length > 0 ? trendData.map((d) => d.submitted) : [14, 22, 18, 30, 28, 35, 42];
  const resolvedCounts = trendData.length > 0 ? trendData.map((d) => d.resolved) : [10, 18, 15, 26, 24, 30, 38];

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Submitted',
        data: submittedCounts,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#2563eb',
        pointRadius: 3,
      },
      {
        label: 'Resolved',
        data: resolvedCounts,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.04)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#22c55e',
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { family: 'Inter', size: 11, weight: '600' },
        },
      },
      tooltip: {
        backgroundColor: '#111827',
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'Inter', size: 12, weight: '700' },
        bodyFont: { family: 'Inter', size: 11 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(229, 231, 235, 0.6)' },
        ticks: { font: { family: 'Inter', size: 10 } },
      },
    },
  };

  return (
    <Card hoverEffect={false} className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="h-56">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default ComplaintStatusChartCard;
