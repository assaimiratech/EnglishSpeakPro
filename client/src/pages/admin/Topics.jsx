import { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBookOpen,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInfo,
  FiLoader,
  FiFolderPlus,
} from "react-icons/fi";
import {
  getTopics,
  createTopic,
  deleteTopic,
  updateTopic,
} from "../../api/admin.topics.api";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [title, setTitle] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const data = await getTopics();
      setTopics(data || []);
    } catch (err) {
      showToast("Failed to load topics", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!title.trim()) {
      showToast("Please enter a topic title", "warning");
      return;
    }

    try {
      if (editId) {
        await updateTopic(editId, { title, isPremium });
        showToast("Topic updated successfully!", "success");
      } else {
        await createTopic({ title, isPremium });
        showToast("Topic created successfully!", "success");
      }

      setTitle("");
      setIsPremium(false);
      setEditId(null);
      setIsFormVisible(false);
      await fetchTopics();
    } catch (err) {
      showToast(err?.message || "Failed to save topic", "error");
    }
  };

  const handleEdit = (topic) => {
    setEditId(topic._id);
    setTitle(topic.title);
    setIsPremium(topic.isPremium);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    try {
      await deleteTopic(id);
      setTopics(topics.filter((t) => t._id !== id));
      showToast("Topic deleted successfully!", "success");
    } catch (err) {
      showToast("Failed to delete topic", "error");
    }
  };

  const cancelForm = () => {
    setTitle("");
    setIsPremium(false);
    setEditId(null);
    setIsFormVisible(false);
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
                  : toast.type === "warning"
                    ? "bg-yellow-500 dark:bg-yellow-600 text-white"
                    : "bg-[#8FAF9A] dark:bg-[var(--accent)] text-white"
            }`}
          >
            {toast.type === "success" && <FiCheckCircle className="w-5 h-5" />}
            {toast.type === "error" && <FiXCircle className="w-5 h-5" />}
            {toast.type === "warning" && <FiAlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <FiInfo className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center transition-colors duration-200">
              <FiBookOpen className="w-5 h-5 text-[#8FAF9A] dark:text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Topics Management
              </h1>
              <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
                Create, edit, and manage learning topics
              </p>
            </div>
          </div>
          {!isFormVisible && (
            <button
              onClick={() => setIsFormVisible(true)}
              className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Topic</span>
            </button>
          )}
        </div>
        <div className="w-12 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mt-3 transition-colors duration-200"></div>
      </div>

      {/* Form Modal/Card */}
      {isFormVisible && (
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-lg mb-6 overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] flex justify-between items-center transition-colors duration-200">
            <div className="flex items-center gap-2">
              <FiFolderPlus className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                {editId ? "Edit Topic" : "Create New Topic"}
              </h2>
            </div>
            <button
              onClick={cancelForm}
              className="p-1 rounded-lg text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
            >
              <FiXCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                Topic Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Business English, Grammar Basics..."
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                onKeyPress={(e) => e.key === "Enter" && handleCreateOrUpdate()}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="w-4 h-4 rounded border-[#E2E8E3] dark:border-[var(--border)] text-[#2E8B57] dark:text-[var(--accent)] focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] bg-white dark:bg-[var(--card)] transition-colors duration-200"
              />
              <span className="text-sm text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                Premium Topic
              </span>
              <FiStar className="w-4 h-4 text-yellow-500" />
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreateOrUpdate}
                className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-5 py-2 rounded-xl font-medium transition-all duration-200"
              >
                <FiCheckCircle className="w-4 h-4" />
                {editId ? "Update Topic" : "Create Topic"}
              </button>
              <button
                onClick={cancelForm}
                className="border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] px-5 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topics List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <FiLoader className="w-8 h-8 text-[#8FAF9A] dark:text-[var(--accent)] animate-spin" />
          <span className="ml-2 text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Loading topics...
          </span>
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
          <FiBookOpen className="w-12 h-12 text-[#E2E8E3] dark:text-[var(--border)] mx-auto mb-3 transition-colors duration-200" />
          <p className="text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            No topics found
          </p>
          <button
            onClick={() => setIsFormVisible(true)}
            className="mt-3 text-[#2E8B57] dark:text-[var(--accent)] hover:text-[#257149] text-sm font-medium transition-colors duration-200"
          >
            Create your first topic →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="group bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 flex items-center justify-center transition-colors duration-200">
                        <FiBookOpen className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                      </div>
                      <h3 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] text-lg line-clamp-1 transition-colors duration-200">
                        {topic.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                        📚 {topic.lessonCount || 0} lessons
                      </span>
                      {topic.isPremium && (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full transition-colors duration-200">
                          <FiStar className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(topic)}
                      className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {topics.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#E2E8E3] dark:border-[var(--border)] text-center transition-colors duration-200">
          <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
            Total Topics:{" "}
            <span className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
              {topics.length}
            </span>
            &nbsp;|&nbsp; Premium:{" "}
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">
              {topics.filter((t) => t.isPremium).length}
            </span>
            &nbsp;|&nbsp; Free:{" "}
            <span className="font-semibold text-[#2E8B57] dark:text-[var(--accent)]">
              {topics.filter((t) => !t.isPremium).length}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Topics;
