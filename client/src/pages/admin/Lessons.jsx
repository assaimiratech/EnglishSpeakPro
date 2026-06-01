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
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import {
  uploadAudio,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsAdmin,
} from "../../api/admin.lessons.api";
import { getTopicsAdmin } from "../../api/admin.topics.api";
import { useLocation, useSearchParams } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const topicId = searchParams.get("topic");
  const topicTitle = location.state?.topicTitle || "Loading...";
  const [form, setForm] = useState({
    topicId: topicId || "",
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
  const [loading, setLoading] = useState(false);
  const [modalLesson, setModalLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load topics for dropdown
  useEffect(() => {
    loadTopics();
  }, []);

  // Load lessons when topicId changes
  useEffect(() => {
    if (topicId) {
      loadData(topicId);
      setForm((prev) => ({ ...prev, topicId: topicId }));
    }
  }, [topicId]);

  const loadTopics = async () => {
    try {
      const data = await getTopicsAdmin();
      setTopics(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async (id) => {
    setLoading(true);
    try {
      const res = await getLessonsAdmin(id);
      setLessons(res?.lessons || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load lessons", "error");
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAudio = async () => {
    if (!audioFile) return;

    try {
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      const res = await uploadAudio(audioFile, token);
      const audioUrl = `${apiUrl}${res.fileUrl}`;
      setAudioPreview(audioUrl);
      setForm((prev) => ({
        ...prev,
        audioUrl: res.fileUrl,
      }));
      showToast("Audio uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Upload failed", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.questionText.trim()) {
      showToast("Question is required", "warning");
      return;
    }
    if (!form.topicId) {
      showToast("Please select a topic", "warning");
      return;
    }
    // if (!form.audioUrl) {
    //   showToast("Please upload an audio file", "warning");
    //   return;
    // }

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
      if (topicId) {
        await loadData(topicId);
      }
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
      topicId: topicId || "",
      questionText: "",
      answerText: "",
      order: lessons.length + 1,
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
      topicId: lesson.topicId?._id || topicId,
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
    setSaving(true);
    try {
      await deleteLesson(id);
      setLessons(lessons.filter((l) => l._id !== id));
      showToast("Lesson deleted successfully!", "success");
      setDeleteConfirm(null);
    } catch (err) {
      showToast("Failed to delete topic", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (lesson) => {
    try {
      await updateLesson(lesson._id, {
        isPublished: !lesson.isPublished,
      });
      if (topicId) {
        await loadData(topicId);
      }
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

  const openModal = (lesson) => {
    setModalLesson(lesson);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalLesson(null);
    document.body.style.overflow = "unset";
  };

  // Handle escape key
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
    <div className="p-3 sm:p-4 md:p-6 bg-[#F7F9F7] dark:bg-[var(--surface)] min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 md:left-auto md:right-6 z-50 animate-slide-in-right">
            <div
              className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-lg ${
                toast.type === "success"
                  ? "bg-[#2E8B57] text-white"
                  : toast.type === "error"
                    ? "bg-[#DC2626] text-white"
                    : toast.type === "warning"
                      ? "bg-yellow-500 text-white"
                      : "bg-[#8FAF9A] text-white"
              }`}
            >
              {toast.type === "success" && (
                <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {toast.type === "error" && (
                <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {toast.type === "warning" && (
                <FiAlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              {toast.type === "info" && (
                <FiInfo className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
              <span className="text-xs sm:text-sm font-medium break-words">
                {toast.message}
              </span>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[var(--card)] rounded-2xl max-w-md w-full mx-4 overflow-hidden shadow-xl">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <FiAlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-[#2C2C2C] dark:text-[var(--text)] mb-2">
                  Confirm Delete
                </h3>
                <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] mb-6">
                  Are you sure you want to delete? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(deleteConfirm.id)}
                    disabled={saving}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
                  >
                    {saving ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 border border-[#E2E8E3] text-[#5F6B63] hover:bg-[#F1F4F1] px-4 py-2 rounded-xl font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {isModalOpen && modalLesson && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 transition-all duration-300"
            onClick={closeModal}
          >
            <div
              className="relative bg-white dark:bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 flex justify-between items-center px-4 sm:px-5 py-4 border-b border-[#E2E8E3] bg-white dark:bg-[var(--card)]">
                <h2 className="font-bold text-lg md:text-xl text-[#2C2C2C] dark:text-[var(--text)] truncate">
                  Lesson Details
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1] transition-all"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-5 space-y-5 max-h-[calc(90vh-70px)]">
                <div className="flex flex-wrap gap-2">
                  {modalLesson.isPremium && (
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2.5 py-1 rounded-full font-medium">
                      Premium
                    </span>
                  )}
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      modalLesson.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {modalLesson.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs bg-[#8FAF9A]/10 text-[#2E8B57] px-2.5 py-1 rounded-full font-medium">
                    Order: {modalLesson.order}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8FAF9A] mb-2">
                    Question
                  </h3>
                  <div className="bg-[#F7F9F7] rounded-xl p-4 border border-[#E2E8E3]">
                    <p className="text-[#2C2C2C] text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words">
                      {modalLesson.questionText}
                    </p>
                  </div>
                </div>

                {modalLesson.answerText && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8FAF9A] mb-2">
                      Answer
                    </h3>
                    <div className="bg-[#F7F9F7] rounded-xl p-4 border border-[#E2E8E3]">
                      <p className="text-[#5F6B63] text-base leading-relaxed whitespace-pre-wrap break-words">
                        {modalLesson.answerText}
                      </p>
                    </div>
                  </div>
                )}

                {modalLesson.audioUrl && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-[#8FAF9A] mb-2">
                      Audio
                    </h3>
                    <div className="bg-[#F7F9F7] rounded-xl p-4 border border-[#E2E8E3]">
                      <audio
                        controls
                        src={`${apiUrl}/${modalLesson.audioUrl}`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 flex justify-end gap-3 px-4 sm:px-5 py-4 border-t border-[#E2E8E3] bg-white">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 rounded-xl border border-[#E2E8E3] text-[#5F6B63] hover:bg-[#F1F4F1] font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-[#2C2C2C] dark:text-[var(--text)]">
                Questions Management
              </h1>
              <p className="text-xs text-[#5F6B63] mt-0.5">
                <b>Topic{" :  "}</b>
                <span className="font-medium">
                  {topicTitle || "Select a topic"}
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsFormVisible(!isFormVisible);
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#2E8B57] hover:bg-[#257149] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all text-sm w-full sm:w-auto"
            >
              <FiPlus className="w-4 h-4" />
              New Lesson
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {isFormVisible && (
          <div className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] shadow-lg mb-6 overflow-hidden">
            <div className="px-4 sm:px-5 py-4 bg-gradient-to-r from-[#F7F9F7] to-white border-b border-[#E2E8E3] dark:bg-gradient-to-r dark:from-[#5b835b] to-white flex justify-between items-center">
              <h2 className="font-semibold text-[#2C2C2C]">
                {editId ? "Edit Question" : "Create New Question"}
              </h2>
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  resetForm();
                }}
                className="p-1 rounded-lg text-[#5F6B63] hover:bg-[#F1F4F1]"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                    Question *
                  </label>
                  <textarea
                    placeholder="Enter question"
                    value={form.questionText}
                    onChange={(e) =>
                      setForm({ ...form, questionText: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] outline-none transition-all resize-y"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                    Answer
                  </label>
                  <textarea
                    placeholder="Enter answer"
                    value={form.answerText}
                    onChange={(e) =>
                      setForm({ ...form, answerText: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] outline-none transition-all resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C2C2C] mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    placeholder="Order"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8E3] focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] outline-none transition-all"
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
                    className="w-4 h-4 rounded border-[#E2E8E3] text-[#2E8B57] focus:ring-[#8FAF9A]"
                  />
                  <span className="text-sm text-[#2C2C2C]">Premium Lesson</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) =>
                      setForm({ ...form, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-[#E2E8E3] text-[#2E8B57] focus:ring-[#8FAF9A]"
                  />
                  <span className="text-sm text-[#2C2C2C]">Published</span>
                </label>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E2E8E3]">
                <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                  Audio File *
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files[0])}
                      className="w-full text-sm text-[#5F6B63] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#8FAF9A]/10 file:text-[#2E8B57] hover:file:bg-[#8FAF9A]/20"
                    />
                  </div>
                  <button
                    onClick={handleUploadAudio}
                    disabled={uploadLoading || !audioFile}
                    className="inline-flex items-center justify-center gap-2 bg-[#8FAF9A] hover:bg-[#7a9e86] text-white px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 text-sm"
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
                  <p className="text-xs text-[#5F6B63] mt-2">
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
                {form.audioUrl && !audioPreview && (
                  <div className="mt-3">
                    <audio
                      controls
                      src={`${apiUrl}${form.audioUrl}`}
                      className="w-full max-w-full rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[#E2E8E3]">
                <button
                  onClick={handleSubmit}
                  className="bg-[#2E8B57] hover:bg-[#257149] text-white px-5 sm:px-6 py-2 rounded-xl font-medium transition-all text-sm"
                >
                  {editId ? "Update Lesson" : "Create Lesson"}
                </button>
                <button
                  onClick={() => {
                    setIsFormVisible(false);
                    resetForm();
                  }}
                  className="border border-[#E2E8E3] text-[#5F6B63] hover:bg-[#F1F4F1] px-5 sm:px-6 py-2 rounded-xl font-medium transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lessons List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <FiLoader className="w-8 h-8 text-[#8FAF9A] animate-spin" />
            <span className="ml-2 text-[#5F6B63]">Loading lessons...</span>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3]">
            <FiFileText className="w-12 h-12 text-[#E2E8E3] mx-auto mb-3" />
            <p className="text-[#5F6B63]">No lessons found for this topic</p>
            <button
              onClick={() => {
                resetForm();
                setIsFormVisible(true);
              }}
              className="mt-3 text-[#2E8B57] hover:text-[#257149] text-sm font-medium"
            >
              Create your first lesson →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {lesson.isPremium && (
                          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full font-medium">
                            Premium
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            lesson.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {lesson.isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-[#5F6B63]">
                          Order: {lesson.order}
                        </span>
                      </div>

                      <div className="space-y-2">
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
                      </div>

                      <button
                        onClick={() => openModal(lesson)}
                        className="inline-flex items-center gap-1.5 text-xs text-[#2E8B57] hover:text-[#257149] font-medium mt-3"
                      >
                        <FiMaximize2 className="w-3.5 h-3.5" />
                        <span>View Full Details</span>
                      </button>

                      {lesson.audioUrl && (
                        <audio
                          controls
                          src={`${apiUrl}${lesson.audioUrl}`}
                          className="w-full max-w-md rounded-lg mt-3"
                          preload="metadata"
                        />
                      )}
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2">
                      <button
                        onClick={() => handleTogglePublish(lesson)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#E2E8E3] bg-white text-[#2C2C2C] hover:bg-[#F1F4F1] whitespace-nowrap"
                      >
                        {lesson.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            id: lesson._id,
                          })
                        }
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
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
      </div>
    </div>
  );
};

export default Lessons;
