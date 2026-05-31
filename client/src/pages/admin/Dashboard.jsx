import { useEffect, useState } from "react";
import {
  FiUsers,
  FiStar,
  FiBookOpen,
  FiFileText,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";

import AdminHeader from "../../components/admin/AdminHeader";
import StatCard from "../../components/admin/StatCard";
import { getAdminStats } from "../../api/admin.api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    premiumUsers: 0,
    totalTopics: 0,
    totalLessons: 0,
    activeUsersLast7Days: 0,
    weeklySignups: [],
    weeklyLogins: [],
    recentUsers: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FiUsers className="w-5 h-5" />,
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers,
      icon: <FiStar className="w-5 h-5" />,
      color: "from-yellow-500/10 to-yellow-500/5",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Topics",
      value: stats.totalTopics,
      icon: <FiBookOpen className="w-5 h-5" />,
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-[#2E8B57] dark:text-[var(--accent)]",
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Active Users",
      value: stats.activeUsersLast7Days,
      icon: <FiActivity className="w-5 h-5" />,
      color: "from-cyan-500/10 to-cyan-500/5",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      trend: "Last 7 days",
      trendUp: true,
    },
  ];

  return (
    <div className="p-4 md:p-6 bg-[#F7F9F7] dark:bg-[var(--surface)] min-h-screen transition-colors duration-200">
      {/* Header with date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <AdminHeader
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your platform."
        />

        <div className="flex items-center gap-2 text-sm text-[#5F6B63] dark:text-[var(--muted)] bg-[#F1F4F1] dark:bg-[var(--card)] rounded-xl px-3 py-2 transition-colors duration-200">
          <FiCalendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] p-5 shadow-sm animate-pulse transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-20 h-4 bg-[#E2E8E3] dark:bg-[var(--border)] rounded"></div>
                <div className="w-8 h-8 bg-[#E2E8E3] dark:bg-[var(--border)] rounded-xl"></div>
              </div>
              <div className="w-16 h-8 bg-[#E2E8E3] dark:bg-[var(--border)] rounded mt-2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statItems.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value.toLocaleString()}
                icon={stat.icon}
                trend={stat.trend}
                trendUp={stat.trendUp}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5 mt-5">
            {/* Weekly Signups Chart */}
            <div className="w-full">
              {/* Chart Container */}
              <div className="relative bg-white dark:bg-[var(--card)] rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E2E8E3] dark:border-[var(--border)] transition-all duration-200 hover:shadow-md">
                {/* Chart Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8E3] dark:border-[var(--border)]">
                  <div>
                    <h3 className="text-sm font-semibold text-[#2C2C2C] dark:text-[var(--text)]">
                      Weekly Signups
                    </h3>
                    <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-0.5">
                      New user registrations this week
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#2E8B57] dark:text-[var(--accent)] bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] dark:bg-[var(--accent)] animate-pulse"></span>
                    <span>Live</span>
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="w-full h-56 sm:h-64 md:h-72 relative">
                  <svg
                    viewBox="0 0 100 50"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    {(() => {
                      const data = stats.weeklySignups;
                      const maxCount = Math.max(...data.map((d) => d.count), 1);
                      const minCount = Math.min(...data.map((d) => d.count), 0);
                      const range = maxCount - minCount;

                      const points = data
                        .map((d, i) => {
                          const x = (i / (data.length - 1)) * 100;
                          const y =
                            50 - ((d.count - minCount) / range) * 38 - 5;
                          return `${x},${y}`;
                        })
                        .join(" ");

                      // Area fill points
                      const areaPoints =
                        data
                          .map((d, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y =
                              50 - ((d.count - minCount) / range) * 38 - 5;
                            return `${x},${y}`;
                          })
                          .join(" ") + " 100,50 0,50";

                      return (
                        <>
                          {/* Gradient Definition */}
                          <defs>
                            <linearGradient
                              id="areaGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#2E8B57"
                                stopOpacity="0.3"
                              />
                              <stop
                                offset="100%"
                                stopColor="#2E8B57"
                                stopOpacity="0.02"
                              />
                            </linearGradient>
                            <linearGradient
                              id="lineGradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#8FAF9A"
                                stopOpacity="0.6"
                              />
                              <stop
                                offset="50%"
                                stopColor="#2E8B57"
                                stopOpacity="1"
                              />
                              <stop
                                offset="100%"
                                stopColor="#8FAF9A"
                                stopOpacity="0.6"
                              />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur
                                stdDeviation="0.3"
                                result="coloredBlur"
                              />
                              <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Area under the curve */}
                          <polygon
                            fill="url(#areaGradient)"
                            points={areaPoints}
                            className="transition-all duration-300"
                          />

                          {/* Main Line */}
                          <polyline
                            fill="none"
                            stroke="url(#lineGradient)"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={points}
                            className="transition-all duration-500"
                          />

                          {/* Animated Dashed Line (behind) */}
                          <polyline
                            fill="none"
                            stroke="#2E8B57"
                            strokeWidth="0.3"
                            strokeDasharray="1 2"
                            opacity="0.4"
                            points={points}
                          />

                          {/* Data Points with Glow */}
                          {data.map((d, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y =
                              50 - ((d.count - minCount) / range) * 38 - 5;
                            const isHighest = d.count === maxCount;
                            const isLowest = d.count === minCount;

                            return (
                              <g key={i} className="group">
                                {/* Outer glow ring */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isHighest ? "1.2" : "0.9"}
                                  fill="#2E8B57"
                                  opacity="0.2"
                                  className="transition-all duration-300"
                                />
                                {/* Main dot */}
                                <circle
                                  cx={x}
                                  cy={y}
                                  r={isHighest ? "0.8" : "0.6"}
                                  fill="#2E8B57"
                                  stroke="white"
                                  strokeWidth="0.15"
                                  filter="url(#glow)"
                                  className="transition-all duration-300 hover:r-1.2 cursor-pointer"
                                />
                                {/* Highlight for highest value */}
                                {isHighest && (
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="1.5"
                                    fill="none"
                                    stroke="#2E8B57"
                                    strokeWidth="0.2"
                                    opacity="0.5"
                                    className="animate-ping"
                                  />
                                )}
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Floating Tooltip (on hover) - Would need JS for full functionality */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#2E8B57] to-[#1a5c3a] text-white rounded-lg px-3 py-1.5 text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="font-medium">Total: </span>
                    <span className="font-bold">
                      {stats.weeklySignups.reduce((sum, d) => sum + d.count, 0)}
                    </span>
                  </div>
                </div>

                {/* Labels with enhanced styling */}
                <div className="grid grid-cols-7 mt-4 gap-1">
                  {stats.weeklySignups.map((day, idx) => {
                    const isHighest =
                      day.count ===
                      Math.max(...stats.weeklySignups.map((d) => d.count));
                    const isToday =
                      day.day ===
                      new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                      });

                    return (
                      <div key={day.day} className="text-center group">
                        <div
                          className={`
              text-[10px] sm:text-xs font-medium mb-1 transition-colors duration-200
              ${isToday ? "text-[#2E8B57] dark:text-[var(--accent)]" : "text-[#5F6B63] dark:text-[var(--muted)]"}
              group-hover:text-[#2E8B57] dark:group-hover:text-[var(--accent)]
            `}
                        >
                          {day.day}
                        </div>
                        <div
                          className={`
              text-xs sm:text-sm font-bold transition-all duration-200
              ${isHighest ? "text-[#2E8B57] dark:text-[var(--accent)] scale-110" : "text-[#2C2C2C] dark:text-[var(--text)]"}
              ${isToday ? "bg-green-50 dark:bg-green-900/20 rounded-lg px-1 py-0.5" : ""}
            `}
                        >
                          {day.count}
                        </div>
                        {/* Mini bar indicator */}
                        <div className="w-full h-0.5 bg-[#E2E8E3] dark:border-[var(--border)] rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#8FAF9A] to-[#2E8B57] rounded-full transition-all duration-500"
                            style={{
                              width: `${(day.count / Math.max(...stats.weeklySignups.map((d) => d.count))) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="mt-4 pt-3 border-t border-[#E2E8E3] dark:border-[var(--border)] flex justify-between items-center">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#2E8B57]"></div>
                      <span className="text-[#5F6B63] dark:text-[var(--muted)]">
                        This week
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#8FAF9A]"></div>
                      <span className="text-[#5F6B63] dark:text-[var(--muted)]">
                        Trend
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)]">
                      Avg:{" "}
                    </span>
                    <span className="text-sm font-semibold text-[#2C2C2C] dark:text-[var(--text)]">
                      {(
                        stats.weeklySignups.reduce(
                          (sum, d) => sum + d.count,
                          0,
                        ) / 7
                      ).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-[#2E8B57]">/day</span>
                  </div>
                </div>

                {/* Trend Indicator */}
                {(() => {
                  const data = stats.weeklySignups;
                  const lastWeek = data
                    .slice(0, 3)
                    .reduce((sum, d) => sum + d.count, 0);
                  const thisWeek = data
                    .slice(4, 7)
                    .reduce((sum, d) => sum + d.count, 0);
                  const trend = ((thisWeek - lastWeek) / lastWeek) * 100;
                  const isUp = trend > 0;

                  return (
                    <div className="mt-3 flex items-center justify-center gap-2 text-[10px]">
                      <span className="text-[#5F6B63] dark:text-[var(--muted)]">
                        vs last week
                      </span>
                      <div
                        className={`flex items-center gap-1 font-medium ${isUp ? "text-green-600" : "text-red-500"}`}
                      >
                        {isUp ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}%
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>{" "}
            {/* Recent Signups */}
            <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm overflow-hidden transition-colors duration-200 max-h-[34em] overflow-y-auto">
              <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <FiActivity className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
                  <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    Recent Signups
                  </h2>
                </div>
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                  Latest users created in the database.
                </p>
              </div>
              <div className="p-5 space-y-3">
                {stats.recentUsers.length === 0 ? (
                  <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                    No recent user signups found.
                  </p>
                ) : (
                  stats.recentUsers.map((user) => (
                    <div
                      key={user._id}
                      className="rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] p-3 bg-[#F8FBF8] dark:bg-[var(--surface)] transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                            {user.email}
                          </p>
                        </div>
                        <span className="text-[11px] text-[#2E8B57] dark:text-[var(--accent)] font-semibold transition-colors duration-200">
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                        Last login:{" "}
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : "Never"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
