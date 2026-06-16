'use client';

import React, { useState, useEffect } from 'react';
import { IndianRupee, Percent, Calendar, RotateCcw, Calculator, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface LoanFormProps {
  onCalculate: (principal: number, interestRate: number, tenure: number, tenureType: 'years' | 'months') => void;
  onReset: () => void;
}

export default function LoanForm({ onCalculate, onReset }: LoanFormProps) {
  // Input states
  const [principal, setPrincipal] = useState<number>(1000000); // 10 Lakhs
  const [principalInput, setPrincipalInput] = useState<string>('1000000');
  
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [interestRateInput, setInterestRateInput] = useState<string>('8.5');
  
  const [tenure, setTenure] = useState<number>(120); // 10 Years in Months as default, but we'll show years
  const [tenureInput, setTenureInput] = useState<string>('10');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  // Validation errors
  const [errors, setErrors] = useState<{
    principal?: string;
    interestRate?: string;
    tenure?: string;
  }>({});

  // Sync sliders and inputs
  useEffect(() => {
    setPrincipalInput(principal.toString());
  }, [principal]);

  useEffect(() => {
    setInterestRateInput(interestRate.toString());
  }, [interestRate]);

  useEffect(() => {
    if (tenureType === 'years') {
      setTenureInput((tenure / 12).toString());
    } else {
      setTenureInput(tenure.toString());
    }
  }, [tenure, tenureType]);

  // Clean and parse text input helper
  const handlePrincipalTextChange = (val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    setPrincipalInput(cleanVal);
    
    if (cleanVal) {
      const num = parseInt(cleanVal, 10);
      setPrincipal(num);
      // Validate
      if (num < 10000) {
        setErrors(prev => ({ ...prev, principal: 'Loan amount must be at least ₹10,000' }));
      } else if (num > 100000000) {
        setErrors(prev => ({ ...prev, principal: 'Maximum loan amount limit is ₹10 Crore' }));
      } else {
        setErrors(prev => ({ ...prev, principal: undefined }));
      }
    } else {
      setErrors(prev => ({ ...prev, principal: 'Loan amount is required' }));
    }
  };

  const handleInterestTextChange = (val: string) => {
    // Allow float
    const cleanVal = val.replace(/[^0-9.]/g, '');
    setInterestRateInput(cleanVal);
    
    const num = parseFloat(cleanVal);
    if (!isNaN(num)) {
      setInterestRate(num);
      if (num <= 0) {
        setErrors(prev => ({ ...prev, interestRate: 'Interest rate must be greater than 0%' }));
      } else if (num > 30) {
        setErrors(prev => ({ ...prev, interestRate: 'Maximum interest rate limit is 30%' }));
      } else {
        setErrors(prev => ({ ...prev, interestRate: undefined }));
      }
    } else {
      setErrors(prev => ({ ...prev, interestRate: 'Interest rate is required' }));
    }
  };

  const handleTenureTextChange = (val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    setTenureInput(cleanVal);
    
    if (cleanVal) {
      const num = parseInt(cleanVal, 10);
      if (tenureType === 'years') {
        setTenure(num * 12);
        if (num < 1) {
          setErrors(prev => ({ ...prev, tenure: 'Tenure must be at least 1 year' }));
        } else if (num > 40) {
          setErrors(prev => ({ ...prev, tenure: 'Maximum tenure limit is 40 years' }));
        } else {
          setErrors(prev => ({ ...prev, tenure: undefined }));
        }
      } else {
        if (num < 1) {
          setErrors(prev => ({ ...prev, tenure: 'Tenure must be at least 1 month' }));
        } else if (num > 480) {
          setErrors(prev => ({ ...prev, tenure: 'Maximum tenure limit is 480 months' }));
        } else {
          setErrors(prev => ({ ...prev, tenure: undefined }));
        }
      }
    } else {
      setErrors(prev => ({ ...prev, tenure: 'Tenure is required' }));
    }
  };

  const handleTenureTypeToggle = (type: 'years' | 'months') => {
    setTenureType(type);
    if (type === 'years') {
      // Convert months to years
      const years = Math.max(1, Math.round(tenure / 12));
      setTenure(years * 12);
      setTenureInput(years.toString());
      if (years > 40) {
        setErrors(prev => ({ ...prev, tenure: 'Maximum tenure limit is 40 years' }));
      } else {
        setErrors(prev => ({ ...prev, tenure: undefined }));
      }
    } else {
      // Convert years to months
      setTenureInput(tenure.toString());
      if (tenure > 480) {
        setErrors(prev => ({ ...prev, tenure: 'Maximum tenure limit is 480 months' }));
      } else {
        setErrors(prev => ({ ...prev, tenure: undefined }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    const newErrors: typeof errors = {};
    if (!principal || principal < 10000 || principal > 100000000) {
      newErrors.principal = 'Please enter a valid loan amount between ₹10,000 and ₹10 Crore';
    }
    if (!interestRate || interestRate <= 0 || interestRate > 30) {
      newErrors.interestRate = 'Please enter a valid interest rate between 0.1% and 30%';
    }
    
    const currentTenure = tenureType === 'years' ? tenure / 12 : tenure;
    if (tenureType === 'years') {
      if (!currentTenure || currentTenure < 1 || currentTenure > 40) {
        newErrors.tenure = 'Please enter a valid tenure between 1 and 40 years';
      }
    } else {
      if (!currentTenure || currentTenure < 1 || currentTenure > 480) {
        newErrors.tenure = 'Please enter a valid tenure between 1 and 480 months';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCalculate(principal, interestRate, tenure, 'months');
  };

  const handleFormReset = () => {
    setPrincipal(1000000);
    setPrincipalInput('1000000');
    setInterestRate(8.5);
    setInterestRateInput('8.5');
    setTenure(120);
    setTenureInput('10');
    setTenureType('years');
    setErrors({});
    onReset();
  };

  // Initial calculation on component mount
  useEffect(() => {
    onCalculate(1000000, 8.5, 120, 'months');
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 md:p-8 rounded-3xl border border-card-border bg-card-bg shadow-xl dark:shadow-slate-900/10 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Configure Loan Parameters</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter your loan details below</p>
        </div>
        <button
          type="button"
          onClick={handleFormReset}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          id="btn-reset-form"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Loan Amount Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-indigo-500" />
            <span>Loan Amount</span>
          </label>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">
            {formatINR(principal)}
          </span>
        </div>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-slate-400 font-semibold text-base">₹</span>
          <input
            type="text"
            value={principalInput}
            onChange={(e) => handlePrincipalTextChange(e.target.value)}
            className={`w-full pl-8 pr-4 py-3 rounded-xl border font-medium text-base bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
              errors.principal 
                ? 'border-rose-500 focus:ring-rose-500/20' 
                : 'border-slate-200 dark:border-slate-700'
            }`}
            placeholder="e.g. 10,00,000"
            id="input-loan-amount"
          />
        </div>
        {errors.principal && (
          <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.principal}</span>
          </div>
        )}
        <div className="mt-1 flex items-center gap-3">
          <input
            type="range"
            min="10000"
            max="100000000"
            step="10000"
            value={principal}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setPrincipal(val);
              setErrors(prev => ({ ...prev, principal: undefined }));
            }}
            className="w-full h-2 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-800"
            id="slider-loan-amount"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-0.5">
          <span>₹10K</span>
          <span>₹25L</span>
          <span>₹50L</span>
          <span>₹1Cr</span>
          <span>₹10Cr</span>
        </div>
      </div>

      {/* Interest Rate Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-violet-500" />
            <span>Annual Interest Rate</span>
          </label>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 rounded">
            {interestRate}% p.a.
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            value={interestRateInput}
            onChange={(e) => handleInterestTextChange(e.target.value)}
            className={`w-full pl-4 pr-10 py-3 rounded-xl border font-medium text-base bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
              errors.interestRate 
                ? 'border-rose-500 focus:ring-rose-500/20' 
                : 'border-slate-200 dark:border-slate-700'
            }`}
            placeholder="e.g. 8.5"
            id="input-interest-rate"
          />
          <span className="absolute right-3.5 text-slate-400 font-semibold text-base">%</span>
        </div>
        {errors.interestRate && (
          <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.interestRate}</span>
          </div>
        )}
        <div className="mt-1 flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="30"
            step="0.05"
            value={interestRate}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setInterestRate(val);
              setErrors(prev => ({ ...prev, interestRate: undefined }));
            }}
            className="w-full h-2 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-800"
            id="slider-interest-rate"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-0.5">
          <span>1%</span>
          <span>10%</span>
          <span>20%</span>
          <span>30%</span>
        </div>
      </div>

      {/* Tenure Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Loan Tenure</span>
          </label>
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-100 dark:bg-slate-900 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleTenureTypeToggle('years')}
              className={`px-3 py-1 rounded-md transition-colors ${
                tenureType === 'years' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              id="btn-tenure-years"
            >
              Years
            </button>
            <button
              type="button"
              onClick={() => handleTenureTypeToggle('months')}
              className={`px-3 py-1 rounded-md transition-colors ${
                tenureType === 'months' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              id="btn-tenure-months"
            >
              Months
            </button>
          </div>
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            value={tenureInput}
            onChange={(e) => handleTenureTextChange(e.target.value)}
            className={`w-full pl-4 pr-16 py-3 rounded-xl border font-medium text-base bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all ${
              errors.tenure 
                ? 'border-rose-500 focus:ring-rose-500/20' 
                : 'border-slate-200 dark:border-slate-700'
            }`}
            placeholder={tenureType === 'years' ? 'e.g. 10' : 'e.g. 120'}
            id="input-tenure"
          />
          <span className="absolute right-3.5 text-slate-400 font-semibold text-sm">
            {tenureType === 'years' ? 'Years' : 'Months'}
          </span>
        </div>
        {errors.tenure && (
          <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors.tenure}</span>
          </div>
        )}
        <div className="mt-1 flex items-center gap-3">
          {tenureType === 'years' ? (
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={tenure / 12}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTenure(val * 12);
                setErrors(prev => ({ ...prev, tenure: undefined }));
              }}
              className="w-full h-2 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-800"
              id="slider-tenure-years"
            />
          ) : (
            <input
              type="range"
              min="1"
              max="480"
              step="1"
              value={tenure}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTenure(val);
                setErrors(prev => ({ ...prev, tenure: undefined }));
              }}
              className="w-full h-2 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-800"
              id="slider-tenure-months"
            />
          )}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold px-0.5">
          <span>{tenureType === 'years' ? '1 Year' : '1 Month'}</span>
          <span>{tenureType === 'years' ? '20 Years' : '240 Months'}</span>
          <span>{tenureType === 'years' ? '40 Years' : '480 Months'}</span>
        </div>
      </div>

      {/* Actions */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 mt-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-base py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-600/10 dark:shadow-indigo-500/10 hover:shadow-indigo-600/25 active:scale-[0.99]"
        id="btn-calculate-emi"
      >
        <Calculator className="w-5 h-5" />
        <span>Calculate EMI</span>
      </button>
    </form>
  );
}
