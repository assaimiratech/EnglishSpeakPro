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
      title: "Lessons",
      value: stats.totalLessons,
      icon: <FiFileText className="w-5 h-5" />,
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: "+15",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
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
            <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm overflow-hidden transition-colors duration-200">
              <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <FiActivity className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
                  <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    Weekly Signups
                  </h2>
                </div>
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                  New users from the last 7 days, driven by database activity.
                </p>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-7 gap-2 items-end h-52">
                  {stats.weeklySignups.map((day) => {
                    const maxCount = Math.max(
                      ...stats.weeklySignups.map((item) => item.count),
                      1,
                    );
                    const barHeight = Math.max(
                      16,
                      Math.round((day.count / maxCount) * 100),
                    );
                    return (
                      <div
                        key={day.day}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full rounded-xl bg-[#8FAF9A]/20 dark:bg-[var(--accent)]/20 transition-all duration-300"
                          style={{ height: `${barHeight}%` }}
                        >
                          <div
                            className="h-full w-full rounded-xl bg-[#2E8B57] dark:bg-[var(--accent)] transition-all duration-300"
                            style={{ height: `${barHeight}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                          {day.day}
                        </span>
                        <span className="text-[11px] font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                          {day.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Signups */}
            <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm overflow-hidden transition-colors duration-200">
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
