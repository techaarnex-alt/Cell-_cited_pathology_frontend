import React from 'react';
import { useApp } from '../../context/AppContext';
import { patientName, formatDisplayDate } from '../../utils/helpers';
import { LuChevronRight } from 'react-icons/lu';

export default function RecentOrdersTable() {
  const { data, setView, setPatientRecordId } = useApp();

  const recentReports = (data.reports || []).slice(-5).reverse();

  if (recentReports.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10.5px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
            INVESTIGATION QUEUE
          </span>
          <h2 className="text-base font-bold text-slate-900 m-0 tracking-tight">
            Recent Orders &amp; Tests
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setView('reports')}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 cursor-pointer"
        >
          <span>View All ({data.reports.length})</span>
          <LuChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Report #</th>
              <th className="py-2.5 px-3">Patient</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Investigations</th>
              <th className="py-2.5 px-3">Fee</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentReports.map((report) => {
              const patient = data.patients.find((p) => p.id === report.patientId);
              const isPending = !report.results || Object.keys(report.results).length === 0;
              const isReleased = Boolean(report.finalisedAt || report.released);

              return (
                <tr
                  key={report.id || report.number}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {report.number || report.id}
                  </td>
                  <td className="py-3 px-3">
                    {patient ? (
                      <span
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        onClick={() => {
                          setPatientRecordId(patient.id);
                          setView('patientrecord');
                        }}
                      >
                        {patientName(patient)}
                      </span>
                    ) : (
                      <span className="text-slate-400">Patient</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {report.date || formatDisplayDate()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {report.tests ? report.tests.length : 1} test(s)
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">
                    ₹{report.fee || 0}
                  </td>
                  <td className="py-3 px-3">
                    {isReleased ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Released
                      </span>
                    ) : isPending ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Entry
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Ready
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setView(isPending ? 'results' : 'reports')}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white hover:bg-blue-50 text-blue-600 border border-slate-300 hover:border-blue-300 transition-colors cursor-pointer"
                    >
                      {isPending ? 'Enter Result' : 'View Report'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { RecentOrdersTable };
