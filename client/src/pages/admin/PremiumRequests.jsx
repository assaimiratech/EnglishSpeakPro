import { useEffect, useState } from "react";
import {
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiMail,
  FiMessageSquare,
  FiCalendar,
  FiLoader,
  FiUsers,
  FiStar,
  FiFilter,
} from "react-icons/fi";
import {
  getAllPremiumRequests,
  updatePremiumRequestStatus,
} from "../../api/admin.premium.api";

const PremiumRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllPremiumRequests();
      setRequests(res || []);
    } catch (err) {
      showToast(err?.message || "Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdate = async (id, status) => {
    try {
      await updatePremiumRequestStatus(id, status);
      showToast(`Request ${status} successfully!`, "success");
      await load();
    } catch (err) {
      showToast(err?.response?.data?.message || "Update failed", "error");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          color:
            "bg-green-50 dark:bg-green-900/30 text-[#2E8B57] dark:text-green-400 border-green-200 dark:border-green-800",
          icon: <FiCheckCircle className="w-3.5 h-3.5" />,
          text: "Approved",
        };
      case "rejected":
        return {
          color:
            "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
          icon: <FiXCircle className="w-3.5 h-3.5" />,
          text: "Rejected",
        };
      default:
        return {
          color:
            "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
          icon: <FiClock className="w-3.5 h-3.5" />,
          text: "Pending",
        };
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== "all" && (r.status || "pending") !== statusFilter)
      return false;
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const name = (r.name || r.userId?.name || "").toLowerCase();
    const whatsapp = (r.whatsapp || r.userId?.whatsapp || "").toLowerCase();
    const message = (r.message || "").toLowerCase();
    return (
      name.includes(query) ||
      whatsapp.includes(query) ||
      message.includes(query)
    );
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => (r.status || "pending") === "pending")
      .length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="p-4 md:p-6 bg-[#F7F9F7] dark:bg-[var(--surface)] min-h-screen transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg transition-colors duration-200 ${
              toast.type === "success"
                ? "bg-[#2E8B57] dark:bg-[var(--accent)] text-white"
                : toast.type === "error"
                  ? "bg-[#DC2626] dark:bg-red-700 text-white"
                  : "bg-[#8FAF9A] dark:bg-[var(--accent)] text-white"
            }`}
          >
            {toast.type === "success" && <FiCheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <FiXCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
              Premium Requests
            </h1>
            <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Manage and review premium access requests from users
            </p>
            <div className="w-12 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mt-2 transition-colors duration-200"></div>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 text-[#2E8B57] dark:text-[var(--accent)] hover:text-[#257149] text-sm font-medium transition-colors duration-200"
          >
            <FiLoader className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-1">
            <FiUsers className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
            <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Total
            </span>
          </div>
          <p className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
            {stats.total}
          </p>
        </div>
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-1">
            <FiClock className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Pending
            </span>
          </div>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-1">
            <FiCheckCircle className="w-4 h-4 text-[#2E8B57] dark:text-[var(--accent)]" />
            <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Approved
            </span>
          </div>
          <p className="text-2xl font-bold text-[#2E8B57] dark:text-[var(--accent)]">
            {stats.approved}
          </p>
        </div>
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-1">
            <FiXCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              Rejected
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.rejected}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm mb-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, whatsapp or message..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all text-[#2C2C2C] dark:text-[var(--text)]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[#8FAF9A] dark:text-[var(--accent)] animate-spin" />
          <span className="ml-2 text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Loading requests...
          </span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
          <FiStar className="w-12 h-12 text-[#E2E8E3] dark:text-[var(--border)] mx-auto mb-3 transition-colors duration-200" />
          <p className="text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            No premium requests found
          </p>
          <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
            When users request premium access, they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const statusBadge = getStatusBadge(req.status || "pending");
            return (
              <div
                key={req._id}
                className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left - User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center transition-colors duration-200">
                          <FiUser className="w-5 h-5 text-[#8FAF9A] dark:text-[var(--accent)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] text-lg transition-colors duration-200">
                            {req.name || req.userId?.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                            <FiMail className="w-3.5 h-3.5" />
                            <span>{req.whatsapp || req.userId?.whatsapp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-13 space-y-2">
                        <div className="flex items-start gap-2">
                          <FiMessageSquare className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#2C2C2C] dark:text-[var(--text)] leading-relaxed transition-colors duration-200">
                            {req.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                          <FiCalendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(req.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex flex-col items-start lg:items-end gap-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ${statusBadge.color}`}
                      >
                        {statusBadge.icon}
                        <span>{statusBadge.text}</span>
                      </div>

                      {(req.status || "pending") === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(req._id, "approved")}
                            className="inline-flex items-center gap-1.5 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                          >
                            <FiCheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdate(req._id, "rejected")}
                            className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                          >
                            <FiXCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PremiumRequests;
