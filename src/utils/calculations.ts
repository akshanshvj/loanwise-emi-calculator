/**
 * Formats a number in the Indian Rupee (INR) system.
 * Example: 1050000 -> ₹10,50,000
 * 
 * @param amount - The numerical value to format.
 * @param includeDecimals - Whether to display decimal points.
 * @returns The formatted string.
 */
export function formatINR(amount: number, includeDecimals: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  
  return formatter.format(amount);
}

export interface AmortizationScheduleItem {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule: AmortizationScheduleItem[];
}

/**
 * Calculates monthly EMI and outputs the repayment schedule.
 * 
 * @param principal - Loan Amount (P)
 * @param annualRate - Annual Interest Rate (%)
 * @param tenure - Loan Tenure (Years or Months)
 * @param tenureType - 'years' | 'months'
 * @returns EmiResult containing EMI, total payable interest, total payment, and schedule.
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenure: number,
  tenureType: 'years' | 'months'
): EmiResult {
  // Edge case checks
  if (!principal || principal <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalAmount: 0, amortizationSchedule: [] };
  }

  const n = tenureType === 'years' ? tenure * 12 : tenure;
  
  if (n <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalAmount: 0, amortizationSchedule: [] };
  }

  const r = annualRate / 12 / 100; // Monthly interest rate

  // Zero interest rate edge case
  if (r === 0) {
    const emi = principal / n;
    const amortizationSchedule: AmortizationScheduleItem[] = [];
    let remaining = principal;
    
    for (let i = 1; i <= n; i++) {
      remaining -= emi;
      amortizationSchedule.push({
        month: i,
        emi,
        principal: emi,
        interest: 0,
        remainingBalance: Math.max(0, remaining),
      });
    }

    return {
      monthlyEmi: emi,
      totalInterest: 0,
      totalAmount: principal,
      amortizationSchedule,
    };
  }

  // Standard EMI Formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;

  const amortizationSchedule: AmortizationScheduleItem[] = [];
  let remaining = principal;

  for (let i = 1; i <= n; i++) {
    const interest = remaining * r;
    // For the final month, reconcile any rounding discrepancies
    let principalPaid = emi - interest;
    if (i === n) {
      principalPaid = remaining;
    }
    
    remaining -= principalPaid;

    amortizationSchedule.push({
      month: i,
      emi: interest + principalPaid,
      principal: principalPaid,
      interest,
      remainingBalance: Math.max(0, remaining),
    });
  }

  return {
    monthlyEmi: emi,
    totalInterest,
    totalAmount,
    amortizationSchedule,
  };
}
