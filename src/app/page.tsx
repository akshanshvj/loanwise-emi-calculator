'use client';

import React, { useState } from 'react';
import { Landmark, TrendingUp, Sparkles } from 'lucide-react';
import LoanForm from '../components/LoanForm';
import ResultsCard from '../components/ResultsCard';
import PieChartSection from '../components/PieChartSection';
import AmortizationTable from '../components/AmortizationTable';
import PdfExportButton from '../components/PdfExportButton';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
import { calculateEMI } from '../utils/calculations';

export default function Home() {
  // Shared state to propagate loan inputs to calculations
  const [loanState, setLoanState] = useState({
    principal: 1000000,
    interestRate: 8.5,
    tenure: 120, // normalized to months
  });

  // Calculate results on the fly for optimal performance & rendering
  const { monthlyEmi, totalInterest, totalAmount, amortizationSchedule } = calculateEMI(
    loanState.principal,
    loanState.interestRate,
    loanState.tenure,
    'months'
  );

  const handleCalculate = (
    principal: number,
    interestRate: number,
    tenure: number,
    tenureType: 'years' | 'months'
  ) => {
    // tenure parameter is already normalized by the form
    setLoanState({
      principal,
      interestRate,
      tenure,
    });
  };

  const handleReset = () => {
    setLoanState({
      principal: 1000000,
      interestRate: 8.5,
      tenure: 120,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-violet-500/5 dark:bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Header navigation */}
      <header className="w-full py-5 px-4 md:px-8 border-b border-slate-200/50 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/10">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                LoanWise
              </span>
              <span className="text-[10px] font-bold block text-slate-400 dark:text-slate-500 tracking-wider uppercase -mt-0.5">
                EMI CALCULATOR
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main body content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Intro Section */}
        <div className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              Calculate Your Monthly EMI Instantly
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Make smart borrowing decisions. Calculate EMI, visualize interest breakups, track repayment schedules, and export professional PDF statements instantly.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Loan Inputs Form */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <LoanForm onCalculate={handleCalculate} onReset={handleReset} />
          </div>

          {/* Right Column - Results and Graph Breakups */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <div className="flex flex-col">
                <ResultsCard
                  principal={loanState.principal}
                  interestRate={loanState.interestRate}
                  tenure={loanState.tenure}
                  monthlyEmi={monthlyEmi}
                  totalInterest={totalInterest}
                  totalAmount={totalAmount}
                />
              </div>
              <div className="flex flex-col">
                <PieChartSection
                  principal={loanState.principal}
                  totalInterest={totalInterest}
                />
              </div>
            </div>
            
            {/* PDF Export Button Action Container */}
            <div className="rounded-3xl border border-card-border bg-card-bg p-4 shadow-xl dark:shadow-slate-900/10 backdrop-blur-md">
              <PdfExportButton
                principal={loanState.principal}
                interestRate={loanState.interestRate}
                tenure={loanState.tenure}
                monthlyEmi={monthlyEmi}
                totalInterest={totalInterest}
                totalAmount={totalAmount}
                schedule={amortizationSchedule}
              />
            </div>
          </div>
        </div>

        {/* Amortization Repayment Table (Full Width) */}
        <div className="w-full">
          <AmortizationTable schedule={amortizationSchedule} />
        </div>

      </main>

      {/* Footer Details */}
      <Footer />
      
    </div>
  );
}
