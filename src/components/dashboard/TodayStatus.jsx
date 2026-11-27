import React from 'react';
import { useApp } from '../../context/AppContext';
import { patientName } from '../../utils/helpers';

export default function TodayStatus() {
  const { todayBookings, data, latestReport, latestPatient, pendingReports, setView } =
    useApp();

  const statusItems = [
    {
      title: "Today's Test Bookings",
      desc: 'New investigation entries received today',
      count: todayBookings,
      dotColor: 'bg-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => setView('newreport'),
    },
    {
      title: 'Recent Released Reports',
      desc: latestReport
        ? `Latest: ${latestReport.number} · ${patientName(latestPatient) || 'Patient'}`
        : 'No reports finalized yet today',
      count: data.reports.length,
      dotColor: 'bg-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => setView('reports'),
    },
    {
      title: 'Pending Result Entry',
      desc: 'Investigation reports awaiting laboratory values',
      count: pendingReports,
      dotColor: 'bg-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      action: () => setView('results'),
    },
    {
      title: 'Active Test Catalogue',
      desc: 'Nested laboratory tests across 10 categories',
      count: 91,
      dotColor: 'bg-purple-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      action: () => {
        window.history.pushState({}, '', '/test-catalogue');
        setView('tests');
      },
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">
            LIVE OPERATIONS
          </span>
          <h2 className="text-base font-bold text-slate-900 m-0 tracking-tight">
            Today's Status
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </span>
      </div>

      <div className="flex flex-col gap-2.5 flex-1 justify-between">
        {statusItems.map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            role="button"
            tabIndex={0}
            className="group flex items-center justify-between gap-3 p-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer transition-all duration-150"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dotColor}`} />
              <div className="min-w-0">
                <h4 className="text-[13px] font-bold text-slate-800 m-0 mb-0.5 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 m-0 truncate">
                  {item.desc}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${item.badgeColor}`}
            >
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { TodayStatus };
