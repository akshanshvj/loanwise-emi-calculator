import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LoanWise | EMI Calculator",
  description: "Calculate EMI, interest, repayment schedules, and loan costs instantly with LoanWise.",
  metadataBase: new URL("https://loanwise-emi.vercel.app"),
  openGraph: {
    title: "LoanWise | EMI Calculator",
    description: "Calculate EMI, interest, repayment schedules, and loan costs instantly with LoanWise.",
    url: "https://loanwise-emi.vercel.app",
    siteName: "LoanWise",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LoanWise - EMI Calculator",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoanWise | EMI Calculator",
    description: "Calculate EMI, interest, repayment schedules, and loan costs instantly with LoanWise.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}

