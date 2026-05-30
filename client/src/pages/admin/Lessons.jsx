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
  FiChevronDown,
  FiChevronUp,
  FiMaximize2,
} from "react-icons/fi";
import {
  uploadAudio,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsAdmin,
} from "../../api/admin.lessons.api";
import { getTopicsAdmin } from "../../api/admin.topics.api";

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
    isPublished: false,
    audioUrl: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Modal state
  const [modalLesson, setModalLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadData();
  }, [page, topicFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(timer);
  }, [page, topicFilter, search]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const loadTopics = async () => {
    try {
      const data = await getTopicsAdmin();
      setTopics(data || []);
    } catch (err) {
      console.log(err);
      setTopics([]);
    }
  };

  const loadData = async () => {
    try {
      const res = await getLessonsAdmin({
        page,
        limit: 10,
        search,
        topic: topicFilter,
      });

      const lessons = res?.lessons || res?.data?.lessons || [];
      setLessons(lessons);
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
      setAudioPreview(
        `https://englishspeakpro-e7ve.onrender.com/${res.fileUrl}`,
      );
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
      isPublished: false,
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
      isPublished: lesson.isPublished,
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

  const handleTogglePublish = async (lesson) => {
    try {
      await updateLesson(lesson._id, {
        isPublished: !lesson.isPublished,
      });
      await loadData();
      showToast(
        lesson.isPublished
          ? "Lesson moved to draft"
          : "Lesson published successfully",
        "success",
      );
    } catch (err) {
      showToast("Failed to update publish status", "error");
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  const openModal = (lesson) => {
    setModalLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalLesson(null);
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  return (
    <div className="p-4 md:p-6 bg-[#F7F9F7] dark:bg-[var(--surface)] min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-6 left-4 right-4 md:left-auto md:right-6 z-50 animate-slide-in-right">
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
              {toast.type === "success" && (
                <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
              )}
              {toast.type === "error" && (
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              {toast.type === "warning" && (
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              {toast.type === "info" && (
                <FiInfo className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium break-words flex-1">
                {toast.message}
              </span>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {isModalOpen && modalLesson && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            onClick={closeModal}
          >
            <div
              className="relative bg-white dark:bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transition-all duration-300 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex justify-between items-center px-5 py-4 border-b border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)]">
                <h2 className="font-bold text-lg md:text-xl text-[#2C2C2C] dark:text-[var(--text)] truncate">
                  Lesson Details
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
                  aria-label="Close modal"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-5 space-y-5 max-h-[calc(90vh-70px)]">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {modalLesson.isPremium && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2.5 py-1 rounded-full font-medium">
                      Premium
                    </span>
                  )}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      modalLesson.isPublished
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200"
                        : "bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {modalLesson.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 text-[#2E8B57] dark:text-[var(--accent)] px-2.5 py-1 rounded-full font-medium">
                    Order: {modalLesson.order}
                  </span>
                  <span className="text-xs bg-[#8FAF9A]/10 dark:bg-[var(--accent)]/20 text-[#2E8B57] dark:text-[var(--accent)] px-2.5 py-1 rounded-full font-medium truncate max-w-[200px]">
                    Topic: {modalLesson.topicId?.title}
                  </span>
                </div>

                {/* Question Section */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8FAF9A] dark:text-[var(--accent)] mb-2">
                    Question
                  </h3>
                  <div className="bg-[#F7F9F7] dark:bg-[var(--surface)] rounded-xl p-4 border border-[#E2E8E3] dark:border-[var(--border)]">
                    <p className="text-[#2C2C2C] dark:text-[var(--text)] text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
                      {modalLesson.questionText}
                    </p>
                  </div>
                </div>

                {/* Answer Section */}
                {modalLesson.answerText && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8FAF9A] dark:text-[var(--accent)] mb-2">
                      Answer
                    </h3>
                    <div className="bg-[#F7F9F7] dark:bg-[var(--surface)] rounded-xl p-4 border border-[#E2E8E3] dark:border-[var(--border)]">
                      <p className="text-[#5F6B63] dark:text-[var(--muted)] text-base leading-relaxed whitespace-pre-wrap break-words">
                        {modalLesson.answerText}
                      </p>
                    </div>
                  </div>
                )}

                {/* Audio Section */}
                {modalLesson.audioUrl && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8FAF9A] dark:text-[var(--accent)] mb-2">
                      Audio
                    </h3>
                    <div className="bg-[#F7F9F7] dark:bg-[var(--surface)] rounded-xl p-4 border border-[#E2E8E3] dark:border-[var(--border)]">
                      <audio
                        controls
                        src={`https://englishspeakpro-e7ve.onrender.com/${modalLesson.audioUrl}`}
                        className="w-full rounded-lg"
                        preload="metadata"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex justify-end gap-3 px-5 py-4 border-t border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)]">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)]">
                Lessons Management
              </h1>

              <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-0.5">
                Manage lesson content
              </p>
            </div>

            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="inline-flex items-center gap-2 bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base flex-shrink-0 w-auto"
            >
              <FiPlus className="w-4 h-4" />
              New
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3 dark:border-[var(--border)] p-3 mb-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex-1 min-w-0 relative">
              {" "}
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FAF9A]" />
              <input
                placeholder="Search question..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-8 pr-2 py-1.5 text-sm rounded-lg border
        border-[#E2E8E3] dark:border-[var(--border)]
        bg-white dark:bg-[var(--card)]
        focus:border-[#8FAF9A] outline-none"
              />
            </div>
            {/* Select */}
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="px-2 py-1.5 text-sm rounded-lg border border-[#E2E8E3]
      dark:border-[var(--border)] bg-white dark:bg-[var(--card)] w-full sm:w-auto"
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
            {/* Button */}
            <button
              onClick={handleSearch}
              className="bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149]
      text-white px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              Search
            </button>
          </div>
        </div>
        {/* Form Modal/Card */}
        {isFormVisible && (
          <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-lg mb-6 overflow-hidden transition-colors duration-200">
            <div className="px-4 sm:px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] border-b border-[#E2E8E3] dark:border-[var(--border)] flex justify-between items-center transition-colors duration-200">
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

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                    Question *
                  </label>
                  <textarea
                    placeholder="Enter question"
                    value={form.questionText}
                    onChange={(e) =>
                      setForm({ ...form, questionText: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)] resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] dark:text-[var(--text)] mb-1 transition-colors duration-200">
                    Answer
                  </label>
                  <textarea
                    placeholder="Enter answer"
                    value={form.answerText}
                    onChange={(e) =>
                      setForm({ ...form, answerText: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] dark:border-[var(--border)] focus:border-[#8FAF9A] dark:focus:border-[var(--accent)] focus:ring-1 focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] outline-none transition-all bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] placeholder:text-[#5F6B63] dark:placeholder:text-[var(--muted)] resize-y"
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

              <div className="flex flex-wrap items-center gap-4 mt-4">
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

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({ ...form, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-[#E2E8E3] dark:border-[var(--border)] text-[#2E8B57] dark:text-[var(--accent)] focus:ring-[#8FAF9A] dark:focus:ring-[var(--accent)] bg-white dark:bg-[var(--card)]"
                  />
                  <span className="text-sm text-[#2C2C2C] dark:text-[var(--text)] transition-colors duration-200">
                    Published
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
                    className="inline-flex items-center gap-2 bg-[#8FAF9A] dark:bg-[var(--accent)] hover:bg-[#7a9e86] text-white px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 text-sm sm:text-base"
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
                  <p className="text-xs text-[#5F6B63] dark:text-[var(--muted)] mt-2 transition-colors duration-200 break-words">
                    Selected: {audioFile.name}
                  </p>
                )}
                {audioPreview && (
                  <div className="mt-3">
                    <audio
                      controls
                      src={audioPreview}
                      className="w-full max-w-full rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
                <button
                  onClick={handleSubmit}
                  className="bg-[#2E8B57] dark:bg-[var(--accent)] hover:bg-[#257149] text-white px-5 sm:px-6 py-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
                >
                  {editId ? "Update Lesson" : "Create Lesson"}
                </button>
                <button
                  onClick={() => {
                    setIsFormVisible(false);
                    resetForm();
                  }}
                  className="border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] px-5 sm:px-6 py-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lessons List */}
        <div className="space-y-4 w-full">
          {lessons?.map((lesson) => (
            <div
              key={lesson._id}
              className="w-full bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* LEFT CONTENT */}
                  <div className="flex-1 min-w-0 w-full">
                    {/* TAGS */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {lesson.isPremium && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium transition-colors duration-200">
                          Premium
                        </span>
                      )}

                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors duration-200 ${
                          lesson.isPublished
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200"
                            : "bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {lesson.isPublished ? "Published" : "Draft"}
                      </span>

                      <span className="text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                        Order: {lesson.order}
                      </span>

                      <span className="text-xs text-[#8FAF9A] dark:text-[var(--accent)] transition-colors duration-200 break-words max-w-[150px] sm:max-w-none truncate">
                        Topic: {lesson.topicId?.title}
                      </span>
                    </div>

                    {/* TEXT CONTENT - Short Preview Only */}
                    <div className="space-y-2 w-full">
                      {/* QUESTION PREVIEW */}
                      <div>
                        <h3
                          className="font-semibold text-[#2C2C2C] dark:text-[var(--text)] text-base sm:text-lg leading-relaxed break-words whitespace-normal"
                          title={lesson.questionText}
                        >
                          {lesson.questionText?.length >= 40
                            ? `${lesson.questionText.substring(0, 20)}...`
                            : lesson.questionText}
                        </h3>
                      </div>

                      {/* ANSWER PREVIEW */}
                      {lesson.answerText && (
                        <div>
                          <p
                            className="text-sm sm:text-base text-[#5F6B63] dark:text-[var(--muted)] leading-relaxed break-words whitespace-normal"
                            title={lesson.answerText}
                          >
                            {lesson.answerText?.length >= 40
                              ? `${lesson.answerText.substring(0, 20)}...`
                              : lesson.answerText}
                          </p>
                        </div>
                      )}
                      {/* DISPLAY MORE BUTTON */}
                      <button
                        onClick={() => openModal(lesson)}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#2E8B57] dark:text-[var(--accent)] hover:text-[#257149] font-medium transition-colors duration-200 mt-2"
                      >
                        <FiMaximize2 className="w-3.5 h-3.5" />
                        <span>Display More</span>
                      </button>
                    </div>

                    {/* AUDIO PLAYER */}
                    {lesson.audioUrl && (
                      <audio
                        controls
                        src={`https://englishspeakpro-e7ve.onrender.com${lesson.audioUrl}`}
                        className="w-50 max-w-50 rounded-lg"
                        preload="metadata"
                      />
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0 items-center lg:items-stretch">
                    <button
                      onClick={() => handleTogglePublish(lesson)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border border-[#E2E8E3] dark:border-[var(--border)] bg-white dark:bg-[var(--card)] text-[#2C2C2C] dark:text-[var(--text)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] whitespace-nowrap"
                    >
                      {lesson.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={() => handleEdit(lesson)}
                      className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                      aria-label="Edit lesson"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(lesson._id)}
                      className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      aria-label="Delete lesson"
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
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 pt-4 border-t border-[#E2E8E3] dark:border-[var(--border)]">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200 text-sm"
            >
              <FiChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="px-3 sm:px-4 py-2 bg-[#8FAF9A] dark:bg-[var(--accent)] text-white rounded-lg font-medium text-sm transition-colors duration-200">
              Page {page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200 text-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lessons;
