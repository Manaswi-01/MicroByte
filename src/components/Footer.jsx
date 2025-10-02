// src/components/Footer.jsx

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:border-t dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-3">
          <p className="text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} MicroByte. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}