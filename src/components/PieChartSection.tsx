'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../utils/calculations';

interface PieChartSectionProps {
  principal: number;
  totalInterest: number;
}

export default function PieChartSection({ principal, totalInterest }: PieChartSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [
    { name: 'Principal Amount', value: principal },
    { name: 'Interest Amount', value: totalInterest },
  ];

  const total = principal + totalInterest;
  const principalPercentage = total > 0 ? ((principal / total) * 100).toFixed(1) : '0.0';
  const interestPercentage = total > 0 ? ((totalInterest / total) * 100).toFixed(1) : '0.0';

  // Customized tooltip rendering
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-800/95 text-white p-3 rounded-xl border border-slate-700/50 shadow-xl backdrop-blur-sm text-xs font-semibold">
          <p className="font-bold text-slate-300 mb-1">{payload[0].name}</p>
          <p className="text-sm font-extrabold text-white">
            {formatINR(payload[0].value)} ({((payload[0].value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-card-border bg-card-bg shadow-xl dark:shadow-slate-900/10 backdrop-blur-md">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Breakup of Total Payment</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Visual ratio of principal vs. interest</p>
      </div>

      <div className="relative w-full h-[260px] flex items-center justify-center">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Principal Gradient */}
                <linearGradient id="principalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                {/* Interest Gradient */}
                <linearGradient id="interestGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                <Cell fill="url(#principalGrad)" />
                <Cell fill="url(#interestGrad)" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-40 h-40 rounded-full border-4 border-dashed border-indigo-200 dark:border-indigo-900/50 animate-spin flex items-center justify-center">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Loading Graph...</span>
          </div>
        )}

        {/* Center overlay label */}
        {isMounted && total > 0 && (
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              Total Cost
            </span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
              {formatINR(total)}
            </span>
          </div>
        )}
      </div>

      {/* Modern custom legend */}
      <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 dark:from-indigo-300 dark:to-indigo-500 shadow-sm" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Principal Amount</span>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 pl-5">
            {formatINR(principal)} <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">({principalPercentage}%)</span>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 dark:from-rose-300 dark:to-rose-500 shadow-sm" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Interest Amount</span>
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 pl-5">
            {formatINR(totalInterest)} <span className="text-xs font-semibold text-rose-500 dark:text-rose-400">({interestPercentage}%)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
