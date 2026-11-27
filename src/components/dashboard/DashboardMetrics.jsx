import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuUsers,
  LuUserPlus,
  LuCalendarCheck,
  LuClock,
  LuCheck,
  LuIndianRupee,
  LuChevronRight,
} from 'react-icons/lu';

export default function DashboardMetrics() {
  const {
    totalPatients,
    todayPatients,
    todayBookings,
    pendingReports,
    todayRelease,
    todayRevenue,
    setView,
  } = useApp();

  const metrics = [
    {
      label: 'Total Patients',
      value: totalPatients,
      sub: 'Open patient records',
      icon: LuUsers,
      accent: 'border-t-blue-600',
      iconBg: 'bg-blue-50 text-blue-600',
      action: () => setView('patients'),
      title: 'View all patient records',
    },
    {
      label: "Today's Patients",
      value: todayPatients,
      sub: 'Registered today',
      icon: LuUserPlus,
      accent: 'border-t-sky-500',
      iconBg: 'bg-sky-50 text-sky-600',
      action: () => setView('patients'),
      title: 'View patients registered today',
    },
    {
      label: "Today's Bookings",
      value: todayBookings,
      sub: 'Investigations booked today',
      icon: LuCalendarCheck,
      accent: 'border-t-purple-600',
      iconBg: 'bg-purple-50 text-purple-600',
      action: () => setView('newreport'),
      title: 'View test bookings created today',
    },
    {
      label: 'Pending Reports',
      value: pendingReports,
      sub: 'Awaiting result entry',
      icon: LuClock,
      accent: 'border-t-amber-500',
      iconBg: 'bg-amber-50 text-amber-600',
      action: () => setView('results'),
      title: 'View reports awaiting result entry',
    },
    {
      label: "Today's Released",
      value: todayRelease,
      sub: 'Final reports delivered',
      icon: LuCheck,
      accent: 'border-t-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
      action: () => setView('reports'),
      title: 'View finalized reports released today',
    },
    {
      label: "Today's Revenue",
      value: `₹${(todayRevenue || 0).toLocaleString('en-IN')}`,
      sub: 'Billing collected today',
      icon: LuIndianRupee,
      accent: 'border-t-rose-500',
      iconBg: 'bg-rose-50 text-rose-600',
      action: () => setView('business'),
      title: 'View business revenue summary',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            onClick={m.action}
            role="button"
            tabIndex={0}
            title={m.title}
            className={`bg-white border border-slate-200 border-t-4 ${m.accent} rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[112px] group`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12.5px] font-semibold text-slate-600">
                {m.label}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${m.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-extrabold text-slate-900 tracking-tight my-1.5 leading-none">
              {m.value}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{m.sub}</span>
              <LuChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </section>
  );
}

export { DashboardMetrics };
