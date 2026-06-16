import { Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-8 px-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-base">Akshansh Vijay</p>
          <a
            href="mailto:akshanshvj4803@gmail.com"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
            id="footer-email-link"
          >
            <Mail className="w-4 h-4" />
            <span>akshanshvj4803@gmail.com</span>
          </a>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-indigo-500/20 active:scale-[0.98]"
            id="built-for-digital-heroes-btn"
          >
            <span>Built for Digital Heroes</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <div className="text-center md:text-right text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} LoanWise. All rights reserved.</p>
          <p className="mt-1">Crafted with precision & fintech excellence.</p>
        </div>
      </div>
    </footer>
  );
}
