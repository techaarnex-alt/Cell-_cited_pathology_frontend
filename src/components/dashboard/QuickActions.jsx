import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LuUsers,
  LuFlaskConical,
  LuClipboardList,
  LuFileText,
  LuArrowUpRight,
} from 'react-icons/lu';

export default function QuickActions() {
  const { setView } = useApp();

  const actions = [
    {
      title: 'Patients & Registration',
      description: 'Register new patient or update existing records',
      icon: LuUsers,
      bg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      view: 'patients',
    },
    {
      title: 'Test Booking',
      description: 'Book investigations, select doctors, and generate invoice',
      icon: LuFlaskConical,
      bg: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      view: 'newreport',
    },
    {
      title: 'Result Entry',
      description: 'Enter clinical findings, values, and flags',
      icon: LuClipboardList,
      bg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
      view: 'results',
    },
    {
      title: 'Reports & Delivery',
      description: 'Review, finalize, print, and release diagnostic reports',
      icon: LuFileText,
      bg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
      view: 'reports',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
            WORKFLOW ACCELERATORS
          </span>
          <h2 className="text-base font-bold text-slate-900 m-0 tracking-tight">
            Quick Actions
          </h2>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          Instant Launch
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div
              key={idx}
              onClick={() => setView(act.view)}
              role="button"
              tabIndex={0}
              className="group flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all duration-150 shadow-sm hover:shadow"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${act.bg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-bold text-slate-900 m-0 mb-0.5 group-hover:text-blue-600 transition-colors">
                  {act.title}
                </h3>
                <p className="text-[11px] text-slate-500 m-0 leading-tight truncate">
                  {act.description}
                </p>
              </div>
              <LuArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { QuickActions };
