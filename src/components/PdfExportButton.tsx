'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { AmortizationScheduleItem, formatINR } from '../utils/calculations';

interface PdfExportButtonProps {
  principal: number;
  interestRate: number;
  tenure: number; // in months
  monthlyEmi: number;
  totalInterest: number;
  totalAmount: number;
  schedule: AmortizationScheduleItem[];
}

export default function PdfExportButton({
  principal,
  interestRate,
  tenure,
  monthlyEmi,
  totalInterest,
  totalAmount,
  schedule,
}: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Modern Color Palette
      const primaryColor: [number, number, number] = [99, 102, 241]; // Indigo #6366f1
      const darkColor: [number, number, number] = [15, 23, 42]; // Slate 900
      const greyColor: [number, number, number] = [100, 116, 139]; // Slate 500
      const lightGreyColor: [number, number, number] = [241, 245, 249]; // Slate 100

      // Top Indigo Band Accent
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 8, 'F');

      // Brand Title & Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('LoanWise', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('FINANCIAL INTELLIGENCE', 20, 30);

      // Metadata (Right-Aligned)
      const dateStr = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      doc.setFontSize(9);
      doc.setTextColor(greyColor[0], greyColor[1], greyColor[2]);
      doc.text(`Generated: ${dateStr}`, 190, 25, { align: 'right' });
      doc.text(`Report ID: LW-${Math.floor(100000 + Math.random() * 900000)}`, 190, 30, { align: 'right' });

      // Horizontal Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(20, 35, 190, 35);

      // Section 1: Loan Overview
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('1. Loan Parameters', 20, 46);

      const yearsStr = tenure % 12 === 0 
        ? `${tenure / 12} Years` 
        : `${Math.floor(tenure / 12)} Years ${tenure % 12} Months`;

      autoTable(doc, {
        startY: 50,
        theme: 'plain',
        head: [['Parameter', 'Input Details']],
        body: [
          ['Loan Amount (Principal)', formatINR(principal)],
          ['Annual Interest Rate', `${interestRate}% p.a.`],
          ['Loan Tenure', `${yearsStr} (${tenure} Months)`],
        ],
        headStyles: { fillColor: lightGreyColor, textColor: darkColor, fontStyle: 'bold' },
        bodyStyles: { textColor: darkColor },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
        margin: { left: 20, right: 20 },
      });

      // Section 2: Calculated Totals
      const nextY = (doc as any).lastAutoTable.finalY + 8;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('2. Estimate Summary', 20, nextY);

      autoTable(doc, {
        startY: nextY + 4,
        theme: 'grid',
        head: [['Monthly EMI', 'Total Interest Payable', 'Total Amount Payable']],
        body: [
          [formatINR(monthlyEmi), formatINR(totalInterest), formatINR(totalAmount)]
        ],
        headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        bodyStyles: { textColor: darkColor, fontStyle: 'bold', halign: 'center', fontSize: 10 },
        margin: { left: 20, right: 20 },
      });

      // Section 3: Amortization Schedule (Summary)
      const scheduleY = (doc as any).lastAutoTable.finalY + 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('3. Amortization Summary (First 12 Months)', 20, scheduleY);

      // Format first 12 months, and append last month if there are more
      const displayRows = schedule.slice(0, 12).map(item => [
        `Month ${item.month}`,
        formatINR(item.emi, true),
        formatINR(item.principal, true),
        formatINR(item.interest, true),
        formatINR(item.remainingBalance, true)
      ]);

      if (schedule.length > 12) {
        displayRows.push(['...', '...', '...', '...', '...']);
        const last = schedule[schedule.length - 1];
        displayRows.push([
          `Month ${last.month}`,
          formatINR(last.emi, true),
          formatINR(last.principal, true),
          formatINR(last.interest, true),
          formatINR(last.remainingBalance, true)
        ]);
      }

      autoTable(doc, {
        startY: scheduleY + 4,
        theme: 'striped',
        head: [['Month', 'EMI Paid', 'Principal Paid', 'Interest Paid', 'Remaining Balance']],
        body: displayRows,
        headStyles: { fillColor: lightGreyColor, textColor: darkColor, fontStyle: 'bold' },
        bodyStyles: { textColor: darkColor, fontSize: 8 },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'right' },
        },
        margin: { left: 20, right: 20 },
      });

      // Footer Disclaimer
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7);
        doc.setTextColor(greyColor[0], greyColor[1], greyColor[2]);
        doc.text(
          'Disclaimer: This estimate is indicative and might vary based on bank schemes and fees. Verify with your financial institution.',
          105,
          282,
          { align: 'center' }
        );
        doc.setFont('helvetica', 'normal');
        doc.text(
          'Calculated using LoanWise - Built for Digital Heroes',
          105,
          286,
          { align: 'center' }
        );
      }

      doc.save(`LoanWise_EMI_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-base py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-md hover:shadow-slate-500/10 dark:hover:shadow-white/10 active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
      id="btn-download-pdf-report"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Download PDF Report</span>
        </>
      )}
    </button>
  );
}
