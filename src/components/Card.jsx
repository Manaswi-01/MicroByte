// src/components/Card.jsx

export default function Card({ title, description, icon: Icon, color = "indigo", className = "" }) {
  const colorClasses = {
    indigo: "from-indigo-500 to-purple-600",
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
    pink: "from-pink-500 to-rose-600",
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 card-hover dark:bg-slate-800/50 dark:border-slate-700 ${className}`}>
      {Icon && (
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-700 dark:text-slate-300">{description}</p>
    </div>
  );
}