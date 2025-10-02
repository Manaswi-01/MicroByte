// src/components/Badge.jsx

export default function Badge({ label, variant = "default", className = "" }) {
  const variants = {
    default: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 dark:bg-purple-100 dark:text-purple-700 dark:border-purple-200",
    success: "bg-green-500/20 text-green-400 border border-green-500/30 dark:bg-green-100 dark:text-green-700 dark:border-green-200",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 dark:bg-yellow-100 dark:text-yellow-700 dark:border-yellow-200",
    error: "bg-red-500/20 text-red-400 border border-red-500/30 dark:bg-red-100 dark:text-red-700 dark:border-red-200",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {label}
    </span>
  );
}