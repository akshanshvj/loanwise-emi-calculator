'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Share2, Wallet, Calendar, TrendingUp, Check } from 'lucide-react';
import { formatINR } from '../utils/calculations';

// Custom Hook for Animated Counter
interface AnimatedCounterProps {
  value: number;
  formatter: (v: number) => string;
  duration?: number;
}

function AnimatedCounter({ value, formatter, duration = 800 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;
    const diff = value - startValue;

    if (diff === 0) {
      setDisplayValue(value);
      return;
    }

    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out quad formula
      const easeProgress = progress * (2 - progress);
      const current = startValue + diff * easeProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return <>{formatter(displayValue)}</>;
}

interface ResultsCardProps {
  principal: number;
  interestRate: number;
  tenure: number; // in months
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  isLoading?: boolean;
}

export default function ResultsCard({
  principal,
  interestRate,
  tenure,
  monthlyEmi,
  totalInterest,
  totalAmount,
  isLoading = false,
}: ResultsCardProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const getSummaryText = () => {
    const yearsStr = tenure % 12 === 0 
      ? `${tenure / 12} Years` 
      : `${Math.floor(tenure / 12)} Years ${tenure % 12} Months`;
      
    return `LoanWise - EMI Calculation Report
--------------------------------------
Loan Principal: ${formatINR(principal)}
Annual Interest Rate: ${interestRate}% p.a.
Loan Tenure: ${yearsStr} (${tenure} Months)
--------------------------------------
Monthly EMI: ${formatINR(monthlyEmi)}
Total Interest: ${formatINR(totalInterest)}
Total Amount: ${formatINR(totalAmount)}
--------------------------------------
Calculate yours at: ${window.location.origin}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getSummaryText());
      setToastMessage('Results copied to clipboard!');
      
      // Trigger a confetti or check effect
      if (typeof window !== 'undefined') {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#8b5cf6', '#10b981'],
        });
      }
    } catch (err) {
      setToastMessage('Failed to copy results.');
    }
  };

  const handleShare = async () => {
    const summaryText = getSummaryText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LoanWise EMI Calculation Details',
          text: summaryText,
          url: window.location.href,
        });
        setToastMessage('Shared successfully!');
      } catch (err) {
        // user cancelled share or error occurred
      }
    } else {
      // Fallback
      handleCopy();
      setToastMessage('Share API not supported. Copied to clipboard instead!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full gap-6 p-6 md:p-8 rounded-3xl border border-card-border bg-card-bg shadow-xl animate-pulse">
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full gap-6 p-6 md:p-8 rounded-3xl border border-card-border bg-card-bg shadow-xl dark:shadow-slate-900/10 backdrop-blur-md overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute -right-24 -top-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold shadow-lg animate-soft-pulse z-50 transition-all duration-300">
          <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-600 font-bold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Summary Results</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Based on your inputs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            title="Copy Report"
            id="btn-copy-results"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            title="Share Report"
            id="btn-share-results"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main EMI Indicator */}
      <div className="flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-indigo-50/20 to-transparent dark:from-indigo-950/20 dark:via-indigo-950/5 dark:to-transparent border border-indigo-100/50 dark:border-indigo-950/50 text-center">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-1">
          Monthly Loan EMI
        </span>
        <span className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center">
          <AnimatedCounter value={monthlyEmi} formatter={(v) => formatINR(v)} />
        </span>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-2">
          Payable each month for {tenure} installments
        </span>
      </div>

      {/* Interest and Total Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Interest Payable
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            <AnimatedCounter value={totalInterest} formatter={(v) => formatINR(v)} />
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Amount Payable
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            <AnimatedCounter value={totalAmount} formatter={(v) => formatINR(v)} />
          </p>
        </div>
      </div>

      {/* Quick Summary Meta */}
      <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between text-xs text-slate-400 dark:text-slate-500 font-semibold gap-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-500" />
          <span>Tenure: {tenure % 12 === 0 ? `${tenure / 12} yrs` : `${tenure} mos`}</span>
        </div>
        <div>
          <span>Rate of Interest: {interestRate}% p.a.</span>
        </div>
      </div>
      
    </div>
  );
}
