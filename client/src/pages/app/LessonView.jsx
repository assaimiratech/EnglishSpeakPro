import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiHeadphones,
  FiCheckCircle,
  FiTrendingUp,
  FiAlertCircle,
  FiArrowLeft,
  FiBookmark,
  FiShare2,
  FiThumbsUp,
  FiMessageCircle,
} from "react-icons/fi";

import LessonHeader from "../../components/lesson/LessonHeader";
import ProgressBar from "../../components/lesson/ProgressBar";
import StickyPlayer from "../../components/lesson/StickyPlayer";
import AnswerToggle from "../../components/lesson/AnswerToggle";
import LessonNavigation from "../../components/lesson/LessonNavigation";
import { getLessonsByTopic, markLessonComplete } from "../../api/lessons.api";

const getAudioUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  const base =
    import.meta.env.VITE_API_BASE_URL ||
    "https://englishspeakpro-e7ve.onrender.com";

  return `${base}${url}`;
};

const Lessons = () => {
  const { topicId, topicTitle } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const contentRef = useRef(null);

  const lesson = lessons[index] || null;
  const progress = lessons.length ? ((index + 1) / lessons.length) * 100 : 0;

  useEffect(() => {
    setShowAnswer(false);
    // Scroll to top when lesson changes
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [index]);

  useEffect(() => {
    if (!topicId) return;

    const loadLessons = async () => {
      try {
        setLoading(true);
        const data = await getLessonsByTopic(topicId);
        const normalized = (data || []).map((lesson, idx) => ({
          id: lesson._id || idx,
          question: lesson.questionText || lesson.question || "",
          answer: lesson.answerText || lesson.answer || "",
          audio: getAudioUrl(lesson.audioUrl || lesson.audio),
          completed: lesson.completed || false,
        }));
        setLessons(normalized);

        // Find first uncompleted lesson
        const firstUncompleted = normalized.findIndex((l) => !l.completed);
        setIndex(firstUncompleted !== -1 ? firstUncompleted : 0);

        setError("");
      } catch (err) {
        setError(err?.message || "Failed to load lessons");
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [topicId]);

  const handleNext = async () => {
    if (!completed && !lessons[index]?.completed) {
      // Mark current lesson as completed
      try {
        await markLessonComplete(topicId, lessons[index].id);
        setCompleted(true);
        setLessons((prev) =>
          prev.map((l, i) => (i === index ? { ...l, completed: true } : l)),
        );
      } catch (err) {
        console.error("Failed to mark lesson as complete:", err);
      }
    }

    if (index < lessons.length - 1) {
      setIndex(index + 1);
      setCompleted(false);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setCompleted(false);
      setShowAnswer(false);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // Save bookmark to localStorage or backend
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedLessons") || "[]",
    );
    if (!bookmarked) {
      bookmarks.push({
        topicId,
        lessonId: lessons[index].id,
        lessonIndex: index,
      });
      localStorage.setItem("bookmarkedLessons", JSON.stringify(bookmarks));
    } else {
      const filtered = bookmarks.filter(
        (b) => !(b.topicId === topicId && b.lessonId === lessons[index].id),
      );
      localStorage.setItem("bookmarkedLessons", JSON.stringify(filtered));
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // Track likes in analytics
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `English Lesson: ${lessons[index].question.substring(0, 50)}`,
          text: `Check out this English lesson from EnglishSpeakPro!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled:", err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E2E8E3] dark:border-[var(--border)] border-t-[#2E8B57] dark:border-t-[var(--accent)] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6 text-[#2E8B57] dark:text-[var(--accent)] animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-[#5F6B63] dark:text-[var(--muted)] font-medium transition-colors duration-200">
          Loading lessons...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 mb-4 transition-colors duration-200">
          <FiAlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-500 dark:text-red-400 font-medium text-center">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#2E8B57] dark:bg-[var(--accent)] text-white rounded-lg hover:bg-[#257149] transition-all duration-200 font-medium"
        >
          Try Again
        </button>
      </div>
    );

  if (!lesson)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-[#F1F4F1] dark:bg-[var(--card)] rounded-full p-4 mb-4 transition-colors duration-200">
          <FiBookOpen className="w-8 h-8 text-[#8FAF9A] dark:text-[var(--accent)]" />
        </div>
        <p className="text-[#5F6B63] dark:text-[var(--muted)] font-medium transition-colors duration-200">
          No lessons found for this topic.
        </p>
        <button
          onClick={() => navigate("/topics")}
          className="mt-4 px-6 py-2 bg-[#2E8B57] dark:bg-[var(--accent)] text-white rounded-lg hover:bg-[#257149] transition-all duration-200 font-medium"
        >
          Browse Topics
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] pb-20 mt-0 transition-colors duration-200 relative">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#8FAF9A]/5 dark:bg-[var(--accent)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-[#2E8B57]/5 dark:bg-[var(--accent)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div
        ref={contentRef}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10"
      >
        {/* Header Section */}
        <div className="mb-6">
          <LessonHeader
            topicTitle={topicTitle || "Daily English Conversation"}
            current={index + 1}
            total={lessons.length}
            progress={progress}
          />
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)] transition-colors duration-200" />
              <span className="text-xs font-medium text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                Overall Progress
              </span>
            </div>
            <span className="text-xs font-semibold text-[#2E8B57] dark:text-[var(--accent)] transition-colors duration-200">
              {Math.round(progress)}%
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>

        {/* Question Card */}
        <div className="mt-6 bg-white dark:bg-[var(--card)] rounded-2xl shadow-md border border-[#E2E8E3] dark:border-[var(--border)] overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl">
          {/* Card Header */}
          <div className="px-6 pt-5 pb-3 border-b border-[#E2E8E3] dark:border-[var(--border)] bg-gradient-to-r from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--card)] transition-colors duration-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8FAF9A]/10 dark:bg-[#8FAF9A]/20 flex items-center justify-center transition-colors duration-200">
                  <FiBookOpen className="w-4 h-4 text-[#8FAF9A] dark:text-[var(--accent)]" />
                </div>
                <span className="text-xs font-medium text-[#8FAF9A] dark:text-[var(--accent)] uppercase tracking-wide transition-colors duration-200">
                  Lesson {index + 1}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    bookmarked
                      ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : "text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)]"
                  }`}
                  aria-label="Bookmark lesson"
                >
                  <FiBookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    liked
                      ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                      : "text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)]"
                  }`}
                  aria-label="Like lesson"
                >
                  <FiThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg text-[#5F6B63] dark:text-[var(--muted)] hover:bg-[#F1F4F1] dark:hover:bg-[var(--surface)] transition-all duration-200"
                  aria-label="Share lesson"
                >
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C2C2C] dark:text-[var(--text)] leading-relaxed transition-colors duration-200">
              {lesson.question}
            </h2>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-2">
              {lesson.audio && (
                <div className="flex items-center gap-1.5 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                  <FiHeadphones className="w-3.5 h-3.5 text-[#8FAF9A] dark:text-[var(--accent)]" />
                  <span>Audio lesson</span>
                </div>
              )}
              <div className="w-1 h-1 rounded-full bg-[#E2E8E3] dark:bg-[var(--border)]" />
              <div className="flex items-center gap-1 text-xs text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
                <FiMessageCircle className="w-3.5 h-3.5 text-[#8FAF9A] dark:text-[var(--accent)]" />
                <span>Interactive</span>
              </div>
              {lessons[index]?.completed && (
                <>
                  <div className="w-1 h-1 rounded-full bg-[#E2E8E3] dark:bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-xs text-[#2E8B57] dark:text-[var(--accent)]">
                    <FiCheckCircle className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </div>
                </>
              )}
            </div>

            {/* Answer Toggle */}
            <AnswerToggle
              show={showAnswer}
              onToggle={() => setShowAnswer(!showAnswer)}
              answer={lesson.answer}
              showCopyButton={true}
            />
          </div>
        </div>

        {/* Navigation */}
        <LessonNavigation
          onPrev={handlePrev}
          onNext={handleNext}
          disablePrev={index === 0}
          disableNext={index === lessons.length - 1}
        />

        {/* Completion Message */}
        {index === lessons.length - 1 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-900/30 text-center transition-colors duration-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiCheckCircle className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <span className="font-semibold text-[#2E8B57] dark:text-[var(--accent)] transition-colors duration-200">
                Topic Completed! 🎉
              </span>
            </div>
            <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              You've mastered all lessons in this topic. Ready for the next
              challenge?
            </p>
            <button
              onClick={() => navigate("/topics")}
              className="mt-3 px-4 py-2 bg-[#2E8B57] dark:bg-[var(--accent)] text-white rounded-lg hover:bg-[#257149] transition-all duration-200 text-sm font-medium"
            >
              Explore More Topics
            </button>
          </div>
        )}
      </div>

      {/* Sticky Audio Player */}
      {lesson.audio && (
        <StickyPlayer
          src={lesson.audio}
          title={lesson.question.substring(0, 50)}
        />
      )}
    </div>
  );
};

export default Lessons;
