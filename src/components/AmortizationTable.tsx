'use client';

import React, { useState } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { AmortizationScheduleItem, formatINR } from '../utils/calculations';

interface AmortizationTableProps {
  schedule: AmortizationScheduleItem[];
}

export default function AmortizationTable({ schedule }: AmortizationTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Clean search input to search only digits
  const filteredSchedule = schedule.filter((item) => {
    const cleanQuery = searchQuery.replace(/\D/g, '');
    if (!cleanQuery) return true;
    return item.month.toString() === cleanQuery;
  });

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-card-border bg-card-bg shadow-xl dark:shadow-slate-900/10 backdrop-blur-md">
      
      {/* Table Header and Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Amortization Schedule</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Month-on-month principal and interest breakdown</p>
        </div>
        
        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by Month (e.g. 12)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
            id="search-month-input"
          />
        </div>
      </div>

      {/* Repayment Table Container */}
      <div className="relative overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/60 custom-scrollbar max-h-[380px]">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100/80 dark:bg-slate-900/80 sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/60 dark:border-slate-850">
            <tr>
              <th scope="col" className="px-6 py-4 font-bold">Month</th>
              <th scope="col" className="px-6 py-4 font-bold text-right">EMI</th>
              <th scope="col" className="px-6 py-4 font-bold text-right">Principal component</th>
              <th scope="col" className="px-6 py-4 font-bold text-right">Interest component</th>
              <th scope="col" className="px-6 py-4 font-bold text-right">Remaining Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((row) => (
                <tr 
                  key={row.month} 
                  className="bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                    Month {row.month}
                  </td>
                  <td className="px-6 py-4 font-semibold text-right text-slate-950 dark:text-white">
                    {formatINR(row.emi, true)}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatINR(row.principal, true)}
                  </td>
                  <td className="px-6 py-4 text-right text-rose-500 dark:text-rose-400 font-semibold">
                    {formatINR(row.interest, true)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">
                    {formatINR(row.remainingBalance, true)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <HelpCircle className="w-8 h-8 opacity-55" />
                    <span className="font-semibold text-sm">No details found for that month</span>
                    <span className="text-xs text-slate-400">Try entering a month between 1 and {schedule.length}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Extra helper details */}
      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
        <span>Principal component directly reduces your outstanding loan balance.</span>
      </div>
      
    </div>
  );
}
