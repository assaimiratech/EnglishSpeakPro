import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiStar,
  FiXCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiUsers,
  FiAlertCircle,
  FiInfo,
  FiLoader,
  FiSave,
  FiMapPin,
} from "react-icons/fi";
import { TfiCrown } from "react-icons/tfi";
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../../api/users.api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    whatsapp: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
      showToast(err.message || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`))
      return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      showToast(`User "${name}" deleted successfully`, "success");
    } catch (err) {
      showToast(err.message || "Failed to delete user", "error");
    }
  };

  const handlePremium = async (user) => {
    try {
      const updated = await updateUser(user._id, {
        isPremium: !user.isPremium,
      });
      setUsers(users.map((u) => (u._id === user._id ? updated : u)));
      showToast(
        `${user.name} is now ${updated.isPremium ? "Premium" : "Standard"} user`,
        "success",
      );
    } catch (err) {
      showToast(err.message || "Failed to update user", "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      showToast("Please fill in name, email, and password", "warning");
      return;
    }
    try {
      const created = await createUser({ ...newUser, role: "user" });
      setUsers([created, ...users]);
      setShowCreate(false);
      setNewUser({
        name: "",
        email: "",
        password: "",
        whatsapp: "",
        country: "",
        city: "",
      });
      showToast(`User "${created.name}" created successfully`, "success");
    } catch (err) {
      showToast(err.message || "Failed to create user", "error");
    }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    try {
      const updateData = {
        name: editUser.name,
        email: editUser.email,
        country: editUser.country || "",
        city: editUser.city || "",
        ...(editUser.password && { password: editUser.password }),
      };
      const updated = await updateUser(editUser._id, updateData);
      setUsers(users.map((u) => (u._id === updated._id ? updated : u)));
      setEditUser(null);
      showToast(`User "${updated.name}" updated successfully`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update user", "error");
    }
  };

  const stats = {
    total: users.length,
    premium: users.filter((u) => u.isPremium).length,
    standard: users.filter((u) => !u.isPremium).length,
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 text-[#8FAF9A] dark:text-[var(--accent)] animate-spin" />
        <span className="ml-2 text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
          Loading users...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 text-red-500 dark:text-red-400">
        <FiAlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );

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
                  : toast.type === "warning"
                    ? "bg-yellow-500 dark:bg-yellow-600 text-white"
                    : "bg-[#8FAF9A] dark:bg-[var(--accent)] text-white"
            }`}
          >
            {toast.type === "success" && <FiCheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <FiAlertCircle className="w-5 h-5" />}
            {toast.type === "warning" && <FiAlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center transition-colors duration-200">
              <FiUsers className="w-5 h-5 text-[#8FAF9A] dark:text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Users Management
              </h1>
              <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                Manage platform users and their roles
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchUsers}
              className="inline-flex items-center gap-2 text-[#5F6B63] dark:text-[var(--muted)] hover:text-[#2E8B57] dark:hover:text-[var(--accent)] px-3 py-2 rounded-xl transition-all duration-200"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create User</span>
            </button>
          </div>
        </div>
        <div className="w-12 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mt-3 transition-colors duration-200"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm text-center transition-colors duration-200">
          <FiUsers className="w-5 h-5 text-[#8FAF9A] dark:text-[var(--accent)] mx-auto mb-1" />
          <p className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
            {stats.total}
          </p>
          <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Total Users
          </p>
        </div>
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm text-center transition-colors duration-200">
          <TfiCrown className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.premium}
          </p>
          <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Premium Users
          </p>
        </div>
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm text-center transition-colors duration-200">
          <FiUser className="w-5 h-5 text-[#8FAF9A] dark:text-[var(--accent)] mx-auto mb-1" />
          <p className="text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
            {stats.standard}
          </p>
          <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Standard Users
          </p>
        </div>
      </div>

      {/* Create User Form */}
      {showCreate && (
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-lg mb-6 overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] flex justify-between items-center transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiPlus className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Create New User
              </h2>
            </div>
            <button
              onClick={() => setShowCreate(false)}
              className="p-1 rounded-lg text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
            >
              <FiXCircle className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreate} className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Full Name *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Email *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="user@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  WhatsApp
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="text"
                    value={newUser.whatsapp}
                    onChange={(e) =>
                      setNewUser({ ...newUser, whatsapp: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="+94 XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Country
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newUser.country}
                    onChange={(e) =>
                      setNewUser({ ...newUser, country: e.target.value })
                    }
                    className="w-full pl-3 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="Country"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Password *
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  City
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newUser.city}
                    onChange={(e) =>
                      setNewUser({ ...newUser, city: e.target.value })
                    }
                    className="w-full pl-3 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                    placeholder="City"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-5 py-2 rounded-xl font-medium transition-all duration-200"
              >
                <FiSave className="w-4 h-4" />
                Create User
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] px-5 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[var(--card)] rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-xl transition-colors duration-200">
            <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] flex justify-between items-center transition-colors duration-200">
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Edit User
              </h2>
              <button
                onClick={() => setEditUser(null)}
                className="p-1 rounded-lg text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
              >
                <FiXCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    value={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Country
                </label>
                <div className="relative">
                  <input
                    value={editUser.country || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, country: e.target.value })
                    }
                    className="w-full pl-3 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  City
                </label>
                <div className="relative">
                  <input
                    value={editUser.city || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, city: e.target.value })
                    }
                    className="w-full pl-3 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  New Password (optional)
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    onChange={(e) =>
                      setEditUser({ ...editUser, password: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleEdit}
                  className="bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-5 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditUser(null)}
                  className="border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] px-5 py-2 rounded-xl font-medium transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[var(--card)] rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-xl transition-colors duration-200">
            <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] flex justify-between items-center transition-colors duration-200">
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                User Details
              </h2>
              <button
                onClick={() => setViewUser(null)}
                className="p-1 rounded-lg text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
              >
                <FiXCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8E3] dark:border-[var(--border)]">
                <div className="w-12 h-12 rounded-full bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-[#8FAF9A] dark:text-[var(--accent)]" />
                </div>
                <div>
                  <p className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    {viewUser.name}
                  </p>
                  <div className="flex items-center gap-1">
                    {viewUser.isPremium && (
                      <FiStar className="w-3 h-3 text-yellow-500" />
                    )}
                    <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                      {viewUser.isPremium ? "Premium Member" : "Standard User"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiMail className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <span className="text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  {viewUser.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiPhone className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <span className="text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  {viewUser.whatsapp || "Not provided"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiMapPin className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <span className="text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  {viewUser.country && viewUser.city
                    ? `${viewUser.city}, ${viewUser.country}`
                    : viewUser.country || viewUser.city || "No location set"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FiUsers className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <span className="text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  Role: {viewUser.role || "user"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      {users.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
          <FiUsers className="w-12 h-12 text-[#E2E8E3] dark:text-[var(--border)] mx-auto mb-3 transition-colors duration-200" />
          <p className="text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            No users found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] text-lg transition-colors duration-200">
                        {user.name}
                      </h3>
                      {user.isPremium && (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full transition-colors duration-200">
                          <FiStar className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                      {user.email}
                    </p>
                    {user.whatsapp && (
                      <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                        📱 {user.whatsapp}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setViewUser(user)}
                      className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <FiEye className="w-3.5 h-3.5" /> View
                    </button>
                    <button
                      onClick={() => handlePremium(user)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        user.isPremium
                          ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                          : "bg-[#2E8B57]/10 dark:bg-[var(--accent)]/20 text-[#2E8B57] dark:text-[var(--accent)] hover:bg-[#2E8B57]/20 dark:hover:bg-[var(--accent)]/30"
                      }`}
                    >
                      <FiStar className="w-3.5 h-3.5" />{" "}
                      {user.isPremium ? "Remove Premium" : "Make Premium"}
                    </button>
                    <button
                      onClick={() => setEditUser(user)}
                      className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <FiEdit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
