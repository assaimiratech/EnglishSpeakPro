// components/admin/StatCard.jsx
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatCard = ({ title, value, icon, trend, trendUp = true }) => {
  return (
    <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center transition-colors duration-200">
          <div className="text-[#2E8B57] dark:text-[var(--accent)]">{icon}</div>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
          {value}
        </span>

        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {trendUp ? (
              <FiTrendingUp className="w-3 h-3" />
            ) : (
              <FiTrendingDown className="w-3 h-3" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {!trend && (
        <div className="mt-2 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
          vs last month
        </div>
      )}
    </div>
  );
};

export default StatCard;
