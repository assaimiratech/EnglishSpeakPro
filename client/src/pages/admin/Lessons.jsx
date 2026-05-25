import { useEffect, useState } from "react";
import {
  FiUpload,
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiMic,
  FiFileText,
} from "react-icons/fi";
import {
  uploadAudio,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../api/admin.lessons.api";
import { getTopics } from "../../api/admin.topics.api";
import { getAllLessons } from "../../api/lessons.api";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const [topicFilter, setTopicFilter] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    topicId: "",
    questionText: "",
    answerText: "",
    order: 1,
    isPremium: false,
    audioUrl: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, topicFilter]);

  const loadTopics = async () => {
    try {
      const res = await getTopics();
      const data = res?.topics || res || [];
      setTopics(data);
    } catch (err) {
      console.log(err);
      setTopics([]);
    }
  };

  const loadData = async () => {
    try {
      const res = await getAllLessons(page, topicFilter);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Failed to load lessons", "error");
      setLessons([]);
    }
  };

  const handleUploadAudio = async () => {
    if (!audioFile) return;

    try {
      setUploadLoading(true);

      const token = localStorage.getItem("token");

      const res = await uploadAudio(audioFile, token);

      // ✅ TEMP PREVIEW (immediate play)
      setAudioPreview(`http://localhost:5000${res.fileUrl}`);

      // ✅ STORE FOR DB LATER
      setForm((prev) => ({
        ...prev,
        audioUrl: res.fileUrl,
      }));
    } catch (err) {
      console.error(err);
      showToast("Upload failed", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.questionText) {
      showToast("Question is required", "warning");
      return;
    }
    if (!form.topicId) {
      showToast("Please select a topic", "warning");
      return;
    }
    if (!form.audioUrl) {
      showToast("Please upload an audio file before creating", "warning");
      return;
    }

    try {
      showToast(editId ? "Updating lesson..." : "Creating lesson...", "info");

      if (editId) {
        await updateLesson(editId, form);
        showToast("Lesson updated successfully!", "success");
      } else {
        await createLesson(form);
        showToast("Lesson created successfully!", "success");
      }

      resetForm();
      await loadData();
      setIsFormVisible(false);
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Failed to save lesson", "error");
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setForm({
      topicId: "",
      questionText: "",
      answerText: "",
      order: 1,
      isPremium: false,
      audioUrl: "",
    });
    setEditId(null);
    setAudioFile(null);
    setAudioPreview(null);
  };

  const handleEdit = (lesson) => {
    setEditId(lesson._id);
    setForm({
      topicId: lesson.topicId?._id,
      questionText: lesson.questionText,
      answerText: lesson.answerText,
      order: lesson.order,
      isPremium: lesson.isPremium,
      audioUrl: lesson.audioUrl,
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await deleteLesson(id);
      setLessons(lessons.filter((l) => l._id !== id));
      showToast("Lesson deleted successfully!", "success");
    } catch (err) {
      showToast("Failed to delete lesson", "error");
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadData();
  };

  return (
    <div className="p-4 md:p-6 bg-[#F7F9F7] dark:bg-[var(--surface)] min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
              Lessons Management
            </h1>
            <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-1 transition-colors duration-200">
              Create, edit, and manage lesson content
            </p>
            <div className="w-12 h-0.5 bg-[#8FAF9A] dark:bg-[var(--accent)] rounded-full mt-2 transition-colors duration-200"></div>
          </div>
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Lesson</span>
          </button>
        </div>
      </div>

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
            {toast.type === "info" && <FiInfo className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] p-4 shadow-sm mb-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
            <input
              placeholder="Search by question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
            />
          </div>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none text-[#2C2C2C] dark:text-[var(--text)]"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* Form Modal/Card */}
      {isFormVisible && (
        <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-lg mb-6 overflow-hidden transition-colors duration-200">
          <div className="px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] flex justify-between items-center transition-colors duration-200">
            <h2 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
              {editId ? "Edit Lesson" : "Create New Lesson"}
            </h2>
            <button
              onClick={() => {
                setIsFormVisible(false);
                resetForm();
              }}
              className="p-1 rounded-lg text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-colors duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Question *
                </label>
                <input
                  placeholder="Enter question"
                  value={form.questionText}
                  onChange={(e) =>
                    setForm({ ...form, questionText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Answer
                </label>
                <input
                  placeholder="Enter answer"
                  value={form.answerText}
                  onChange={(e) =>
                    setForm({ ...form, answerText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Topic *
                </label>
                <select
                  value={form.topicId}
                  onChange={(e) =>
                    setForm({ ...form, topicId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                  Order
                </label>
                <input
                  type="number"
                  placeholder="Order"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPremium}
                  onChange={(e) =>
                    setForm({ ...form, isPremium: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-[#E2E8E3] dark:border-[var(--border)] text-[#2E8B57] dark:text-[var(--accent)] focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] bg-white dark:bg-[var(--card)]"
                />
                <span className="text-sm text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                  Premium Lesson
                </span>
              </label>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
              <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-2 transition-colors duration-200">
                Audio File
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    className="w-full text-sm text-[#5F6B63] dark:text-[var(--muted)] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#8FAF9A]/10 dark:file:bg-[var(--accent)]/20 file:text-[#2E8B57] dark:file:text-[var(--accent)] hover:file:bg-[#8FAF9A]/20 dark:hover:file:bg-[var(--accent)]/30 transition-colors duration-200"
                  />
                </div>
                <button
                  onClick={handleUploadAudio}
                  disabled={uploadLoading || !audioFile}
                  className="inline-flex items-center gap-2 bg-[#8FAF9A] dark:bg-[var(--accent)] hover:bg-[#7a9e86] text-white px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  {uploadLoading ? (
                    <FiLoader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FiUpload className="w-4 h-4" />
                  )}
                  {uploadLoading ? "Uploading..." : "Upload Audio"}
                </button>
              </div>
              {audioFile && (
                <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-2 transition-colors duration-200">
                  Selected: {audioFile.name}
                </p>
              )}
              {audioPreview && (
                <div className="mt-3">
                  <audio
                    controls
                    src={audioPreview}
                    className="w-full max-w-md rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
              <button
                onClick={handleSubmit}
                className="bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-6 py-2 rounded-xl font-medium transition-all duration-200"
              >
                {editId ? "Update Lesson" : "Create Lesson"}
              </button>
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  resetForm();
                }}
                className="border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] px-6 py-2 rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons?.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {lesson.isPremium && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium transition-colors duration-200">
                        Premium
                      </span>
                    )}
                    <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                      Order: {lesson.order}
                    </span>
                    <span className="text-xs text-[#8FAF9A] dark:text-[var(--accent)] transition-colors duration-200">
                      Topic: {lesson.topicId?.title}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] text-lg mb-2 transition-colors duration-200">
                    {lesson.questionText}
                  </h3>
                  {lesson.answerText && (
                    <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] leading-relaxed transition-colors duration-200">
                      {lesson.answerText}
                    </p>
                  )}
                  {lesson.audioUrl && (
                    <audio
                      controls
                      src={`http://localhost:5000${lesson.audioUrl}`}
                      className="mt-3 w-full max-w-md rounded-lg"
                    />
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson._id)}
                    className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {lessons.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] transition-colors duration-200">
            <FiFileText className="w-12 h-12 text-[#E2E8E3] dark:text-[var(--border)] mx-auto mb-3 transition-colors duration-200" />
            <p className="text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              No lessons found
            </p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="mt-3 text-[#2E8B57] dark:text-[var(--accent)] hover:text-[#257149] text-sm font-medium transition-colors duration-200"
            >
              Create your first lesson →
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {lessons.length > 0 && (
        <div className="flex items-center justify-center gap-3 mt-8 pt-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
          >
            <FiChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <span className="px-4 py-2 bg-[#8FAF9A] dark:bg-[var(--accent)] text-white rounded-lg font-medium text-sm transition-colors duration-200">
            Page {page}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
          >
            <span>Next</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Lessons;
