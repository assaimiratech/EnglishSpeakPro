import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FiUpload,
  FiX,
  FiEye,
  FiEyeOff,
  FiSave,
  FiFileText,
  FiUnlock,
  FiLock,
} from "react-icons/fi";

import {
  getTopicsAdmin,
  createTopic,
  updateTopic,
  deleteTopic,
} from "../../api/admin.topics.api";

import {
  uploadAudio,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonsAdmin,
} from "../../api/admin.lessons.api";

const emptyTopic = {
  title: "",
  isPremium: false,
  isPublished: false,
};

const emptyLesson = {
  questionText: "",
  answerText: "",
  order: 1,
  isPremium: false,
  isPublished: false,
  audioUrl: "",
};
const apiUrl = import.meta.env.VITE_API_URL;

const Content = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [topicForm, setTopicForm] = useState(emptyTopic);
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);

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
      const data = await getTopicsAdmin();
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

    setSaving(true);
    try {
      if (editId) {
        await updateTopic(editId, { title, isPremium, isPublished });
        showToast("Topic updated successfully!", "success");
      } else {
        await createTopic({ title, isPremium, isPublished });
        showToast("Topic created successfully!", "success");
      }

      setTitle("");
      setIsPremium(false);
      setIsPublished(false);
      setEditId(null);
      setIsFormVisible(false);
      await fetchTopics();
    } catch (err) {
      showToast(err?.message || "Failed to save topic", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEditTopic = (topic) => {
    setEditId(topic._id);
    setTitle(topic.title);
    setIsPremium(topic.isPremium);
    setIsPublished(topic.isPublished);
    setIsFormVisible(true);
  };

  const handleDeleteTopic = async (id) => {
    setSaving(true);
    try {
      await deleteTopic(id);
      setTopics(topics.filter((t) => t._id !== id));
      showToast("Topic deleted successfully!", "success");
      setDeleteConfirm(null);
    } catch (err) {
      showToast("Failed to delete topic", "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelForm = () => {
    setTitle("");
    setIsPremium(false);
    setIsPublished(false);
    setEditId(null);
    setIsFormVisible(false);
  };

  const handleTogglePublish = async (topic) => {
    try {
      await updateTopic(topic._id, {
        isPublished: !topic.isPublished,
      });
      await fetchTopics();
      showToast(
        topic.isPublished
          ? "Topic moved to draft"
          : "Topic published successfully",
        "success",
      );
    } catch (err) {
      showToast("Failed to update publish status", "error");
    }
  };

  const openTopic = async (topic) => {
    setSelectedTopic(topic);
    setTopicForm(topic);
    setViewMode("create");
    // Clear lessons when opening a new topic for adding lessons
    setLessons([{ ...emptyLesson }]);
    setEditingLessonIndex(null);
    setEditingLessonId(null);
  };

  const addLessonField = () => {
    setLessons([...lessons, { ...emptyLesson }]);
  };

  const removeLessonField = (index) => {
    const updated = [...lessons];
    updated.splice(index, 1);
    setLessons(updated);
    if (editingLessonIndex === index) {
      setEditingLessonIndex(null);
      setEditingLessonId(null);
    }
  };

  const updateLessonField = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const handleUploadAudio = async (index) => {
    if (!audioFile) return;

    try {
      setUploadingIndex(index);
      setUploadLoading(true);
      const token = localStorage.getItem("token");
      const res = await uploadAudio(audioFile, token);

      updateLessonField(index, "audioUrl", res.fileUrl);
      setAudioPreview(URL.createObjectURL(audioFile));
      showToast("Audio uploaded successfully!", "success");
      setAudioFile(null);
    } catch (err) {
      showToast("Upload failed", "error");
    } finally {
      setUploadLoading(false);
      setUploadingIndex(null);
    }
  };

  const saveTopicWithLessons = async () => {
    if (!topicForm.title?.trim()) {
      showToast("Please enter a topic title", "warning");
      return;
    }

    setSaving(true);
    try {
      let topicRes;
      if (selectedTopic?._id) {
        topicRes = await updateTopic(selectedTopic._id, topicForm);
      } else {
        topicRes = await createTopic(topicForm);
      }

      const topicId = topicRes._id;

      // // Delete existing lessons if editing
      // if (selectedTopic?._id) {
      //   const existingLessons = await getLessonsAdmin({ topicId });
      //   for (const lesson of existingLessons.lessons || []) {
      //     await deleteLesson(lesson._id);
      //   }
      // }

      // Create new lessons
      for (const lesson of lessons) {
        if (lesson.questionText?.trim()) {
          await createLesson({
            ...lesson,
            topicId,
          });
        }
      }

      await fetchTopics();
      setViewMode("list");
      setLessons([]);
      setSelectedTopic(null);
      setTopicForm(emptyTopic);
      showToast("Topic and lessons saved successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const cancelTopicCreation = () => {
    setViewMode("list");
    setLessons([]);
    setSelectedTopic(null);
    setTopicForm(emptyTopic);
    setEditingLessonIndex(null);
    setEditingLessonId(null);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-[#F7F9F7] dark:bg-[var(--surface)] min-h-screen transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 md:left-auto md:right-6 z-50 animate-slide-in-right">
          <div
            className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl shadow-lg transition-colors duration-200 ${
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
              <FiXCircle className="w-4 h-4 sm:w-5 sm:h-5" />
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

      {/* Delete Confirmation Modal */}
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
                Are you sure you want to delete "{deleteConfirm.title}"? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteTopic(deleteConfirm.id)}
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

      {/* HEADER */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8FAF9A]/10 flex items-center justify-center flex-shrink-0">
              <FiBookOpen className="w-5 h-5 text-[#8FAF9A]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)]">
                Content Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6B63] dark:text-[var(--muted)] mt-0.5">
                Create, edit, and manage learning topics with Questions
              </p>
            </div>
          </div>
          {viewMode === "list" && !isFormVisible && (
            <button
              onClick={() => setViewMode("create")}
              className="inline-flex items-center justify-center gap-2 bg-[#2E8B57] hover:bg-[#257149] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all duration-200 shadow-sm text-sm sm:text-base w-full sm:w-auto"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Topic</span>
            </button>
          )}
          {(viewMode === "create" || viewMode === "edit") && (
            <button
              onClick={cancelTopicCreation}
              className="inline-flex items-center justify-center gap-2 border border-[#E2E8E3] text-[#5F6B63] hover:bg-[#F1F4F1] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiXCircle className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>
        <div className="w-12 h-0.5 bg-[#8FAF9A] rounded-full mt-2 sm:mt-3"></div>
      </div>

      {/* CREATE/EDIT TOPIC WITH LESSONS FORM */}
      {(viewMode === "create" || viewMode === "edit") && (
        <div className="space-y-4 sm:space-y-6">
          {/* Topic Info Card */}
          <div className="bg-white dark:bg-[var(--card)] rounded-xl sm:rounded-2xl border border-[#E2E8E3] dark:border-[var(--border)] shadow-lg overflow-hidden">
            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#F7F9F7] to-white border-b border-[#E2E8E3]">
              <div className="flex items-center gap-2">
                <FiFolderPlus className="w-4 h-4 sm:w-5 sm:h-5 text-[#2E8B57]" />
                <h2 className="font-semibold text-sm sm:text-base text-[#2C2C2C]">
                  {selectedTopic ? "Edit Topic" : "Create New Topic"}
                </h2>
              </div>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#2C2C2C] mb-1">
                  Topic Title *
                </label>
                <input
                  value={topicForm.title}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, title: e.target.value })
                  }
                  placeholder="e.g., Business English, Grammar Basics..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E2E8E3] focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] outline-none transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={topicForm.isPremium}
                    onChange={(e) =>
                      setTopicForm({
                        ...topicForm,
                        isPremium: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-[#E2E8E3] text-[#2E8B57] focus:ring-[#8FAF9A]"
                  />
                  <span className="text-sm text-[#2C2C2C]">Premium Topic</span>
                  <FiStar className="w-4 h-4 text-yellow-500" />
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={topicForm.isPublished}
                    onChange={(e) =>
                      setTopicForm({
                        ...topicForm,
                        isPublished: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-[#E2E8E3] text-[#2E8B57] focus:ring-[#8FAF9A]"
                  />
                  <span className="text-sm text-[#2C2C2C]">Published</span>
                </label>
              </div>
            </div>
          </div>

          {/* Lessons Section */}
          <div>
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#2C2C2C]">
                    Add Questions
                  </h2>
                  <p className="text-xs text-[#5F6B63] mt-0.5">
                    Add lessons/questions to this topic
                  </p>
                </div>
                <button
                  onClick={addLessonField}
                  className="inline-flex items-center justify-center gap-2 bg-[#2E8B57] hover:bg-[#257149] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all duration-200 text-sm w-full sm:w-auto"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
            </div>

            {lessons.length === 0 && (
              <div className="text-center py-8 sm:py-12 bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3]">
                <FiFileText className="w-10 h-10 sm:w-12 sm:h-12 text-[#E2E8E3] mx-auto mb-2" />
                <p className="text-sm text-[#5F6B63]">No questions added yet</p>
                <button
                  onClick={addLessonField}
                  className="mt-3 text-[#2E8B57] hover:text-[#257149] text-sm font-medium"
                >
                  Add your first question →
                </button>
              </div>
            )}

            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--card)] rounded-xl sm:rounded-2xl border border-[#E2E8E3] shadow-lg mb-4 sm:mb-6 overflow-hidden"
              >
                <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#F7F9F7] to-white border-b border-[#E2E8E3] flex justify-between items-center">
                  <h3 className="font-semibold text-sm sm:text-base text-[#2C2C2C]">
                    Question #{index + 1}
                  </h3>
                  <button
                    onClick={() => removeLessonField(index)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#2C2C2C] mb-1">
                        Question *
                      </label>
                      <textarea
                        placeholder="Enter question"
                        value={lesson.questionText}
                        onChange={(e) =>
                          updateLessonField(
                            index,
                            "questionText",
                            e.target.value,
                          )
                        }
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-[#E2E8E3] focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] outline-none transition-all resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#2C2C2C] mb-1">
                        Answer
                      </label>
                      <textarea
                        placeholder="Enter answer"
                        value={lesson.answerText}
                        onChange={(e) =>
                          updateLessonField(index, "answerText", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-[#E2E8E3] focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] outline-none transition-all resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-[#2C2C2C] mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        placeholder="Order"
                        value={lesson.order}
                        onChange={(e) =>
                          updateLessonField(
                            index,
                            "order",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 text-sm rounded-xl border border-[#E2E8E3] focus:border-[#8FAF9A] focus:ring-1 focus:ring-[#8FAF9A] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lesson.isPremium}
                        onChange={(e) =>
                          updateLessonField(
                            index,
                            "isPremium",
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 rounded border-[#E2E8E3] text-[#2E8B57] focus:ring-[#8FAF9A]"
                      />
                      <span className="text-sm text-[#2C2C2C]">
                        Premium Question
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lesson.isPublished}
                        onChange={(e) =>
                          updateLessonField(
                            index,
                            "isPublished",
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 rounded border-[#E2E8E3] text-[#2E8B57] focus:ring-[#8FAF9A]"
                      />
                      <span className="text-sm text-[#2C2C2C]">Published</span>
                    </label>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E2E8E3]">
                    <label className="block text-xs sm:text-sm font-medium text-[#2C2C2C] mb-2">
                      Audio File
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setAudioFile(e.target.files[0])}
                          className="w-full text-xs sm:text-sm text-[#5F6B63] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-[#8FAF9A]/10 file:text-[#2E8B57] hover:file:bg-[#8FAF9A]/20 transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => handleUploadAudio(index)}
                        disabled={uploadLoading || !audioFile}
                        className="inline-flex items-center justify-center gap-2 bg-[#8FAF9A] hover:bg-[#7a9e86] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium transition-all disabled:opacity-50 text-xs sm:text-sm"
                      >
                        {uploadLoading && uploadingIndex === index ? (
                          <FiLoader className="w-4 h-4 animate-spin" />
                        ) : (
                          <FiUpload className="w-4 h-4" />
                        )}
                        {uploadLoading && uploadingIndex === index
                          ? "Uploading..."
                          : "Upload Audio"}
                      </button>
                    </div>
                    {lesson.audioUrl && (
                      <div className="mt-3">
                        <audio
                          controls
                          src={`${apiUrl}${lesson.audioUrl}`}
                          className="w-full max-w-full sm:max-w-md rounded-lg"
                        />
                        <p className="text-[10px] text-green-600 mt-1">
                          ✓ Audio uploaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Save All Button */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[#E2E8E3]">
              <button
                onClick={saveTopicWithLessons}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#2E8B57] hover:bg-[#257149] text-white px-4 sm:px-6 py-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base disabled:opacity-50"
              >
                {saving ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save All (Topic & Lessons)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPICS LIST VIEW */}
      {viewMode === "list" && !isFormVisible && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <FiLoader className="w-8 h-8 text-[#8FAF9A] animate-spin" />
              <span className="ml-2 text-[#5F6B63]">Loading topics...</span>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3]">
              <FiBookOpen className="w-12 h-12 text-[#E2E8E3] mx-auto mb-3" />
              <p className="text-[#5F6B63]">No topics found</p>
              <button
                onClick={() => setViewMode("create")}
                className="mt-3 text-[#2E8B57] hover:text-[#257149] text-sm font-medium"
              >
                Create your first topic →
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3">
                {topics.map((topic) => (
                  <div
                    key={topic._id}
                    className="bg-white dark:bg-[var(--card)] rounded-xl border border-[#E2E8E3] p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-[#2C2C2C] text-base">
                        {topic.title?.length >= 35
                          ? `${topic.title.substring(0, 35)}...`
                          : topic.title}{" "}
                      </h3>
                      <div className="flex gap-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${topic.isPremium ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600"}`}
                        >
                          {topic.isPremium ? "Premium" : "Free"}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${topic.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}
                        >
                          {topic.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[#5F6B63] mb-3">
                      Lessons: {topic.lessonCount || 0}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E2E8E3]">
                      <button
                        onClick={() =>
                          navigate(`/admin/lessons?topic=${topic._id}`, {
                            state: { topicTitle: topic.title },
                          })
                        }
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        <FiEye className="w-3.5 h-3.5" /> View Lessons
                      </button>
                      <button
                        onClick={() => openTopic(topic)}
                        // onClick={() => handleEditTopic(topic)}
                        className="flex-1 flex items-center justify-center gap-1 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(topic)}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {topic.isPublished ? (
                          <FiUnlock className="w-4 h-4" />
                        ) : (
                          <FiLock className="w-4 h-4" />
                        )}
                        {topic.isPublished ? "Draft" : "Publish"}
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            id: topic._id,
                            title: topic.title,
                          })
                        }
                        className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white dark:bg-[var(--card)] rounded-2xl border border-[#E2E8E3] shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 text-[#5F6B63] dark:bg-[#3b3b3b]">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Lessons</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics.map((topic) => (
                      <tr
                        key={topic._id}
                        className="border-t border-[#E2E8E3] hover:bg-gray-50 hover:dark:bg-[#30302f] transition"
                      >
                        <td className="px-4 py-3 font-medium text-[#2C2C2C]">
                          {topic.title?.length >= 35
                            ? `${topic.title.substring(0, 25)}...`
                            : topic.title}
                        </td>
                        <td className="px-4 py-3 text-[#5F6B63]">
                          {topic.lessonCount || 0}
                        </td>
                        <td className="px-4 py-3">
                          {topic.isPremium ? (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                              <FiStar className="w-3 h-3" /> Premium
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              Free
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${topic.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}
                          >
                            {topic.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/lessons?topic=${topic._id}`, {
                                  state: { topicTitle: topic.title },
                                })
                              }
                              // onClick={() => handleEditTopic(topic)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                              title="Add Lessons"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openTopic(topic)}
                              className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleTogglePublish(topic)}
                              className={`p-2 rounded-lg ${topic.isPublished ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                              title={
                                topic.isPublished ? "Unpublish" : "Publish"
                              }
                            >
                              {topic.isPublished ? (
                                <FiLock className="w-4 h-4" />
                              ) : (
                                <FiUnlock className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  id: topic._id,
                                  title: topic.title,
                                })
                              }
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Content;
