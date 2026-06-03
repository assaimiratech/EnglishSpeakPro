import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  FiBookOpen,
  FiHeadphones,
  FiCheckCircle,
  FiTrendingUp,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { GoDotFill } from "react-icons/go";

import LessonHeader from "../../components/lesson/LessonHeader";
import StickyPlayer from "../../components/lesson/StickyPlayer";
import AnswerToggle from "../../components/lesson/AnswerToggle";
import LessonNavigation from "../../components/lesson/LessonNavigation";
import { getLessonsByTopic } from "../../api/lessons.api";
const getAudioUrl = (url) => {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  const base =
    import.meta.env.VITE_API_BASE_URL ||
    "https://englishspeakpro-e7ve.onrender.com";

  return `${base}${url}`;
};
const Lessons = () => {
  const location = useLocation();
  const { topicId } = useParams();
  const [topicTitle, setTopicTitle] = useState(
    location.state?.topicTitle || "",
  );
  const [lessons, setLessons] = useState([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW: Global display answers toggle state
  const [globalShowAnswers, setGlobalShowAnswers] = useState(false);

  const [hiddenByUser, setHiddenByUser] = useState(false);

  const shouldShowAnswer = globalShowAnswers ? !hiddenByUser : showAnswer;
  const lesson = lessons[index] || null;
  const progress = lessons.length ? ((index + 1) / lessons.length) * 100 : 0;

  useEffect(() => {
    setShowAnswer(false);
  }, [index]);

  useEffect(() => {
    if (!topicId) return;

    const loadLessons = async () => {
      try {
        setLoading(true);
        const data = await getLessonsByTopic(topicId);
        const lessonsData = Array.isArray(data) ? data : data?.lessons || [];
        const normalized = lessonsData.map((lesson) => ({
          question: lesson.questionText || lesson.question || "",
          answer: lesson.answerText || lesson.answer || "",
          audio: getAudioUrl(lesson.audioUrl || lesson.audio),
        }));
        setTopicTitle(
          Array.isArray(data)
            ? location.state?.topicTitle || ""
            : data?.topicTitle || location.state?.topicTitle || "",
        );
        setLessons(normalized);
        setIndex(0);
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 mb-4 transition-colors duration-200">
          <FiAlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#2E8B57] dark:bg-[var(--accent)] text-white rounded-lg hover:bg-[#257149] transition-all duration-200"
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
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F9F7] to-white dark:from-[var(--surface)] dark:to-[var(--bg)] pb-20 mt-0 transition-colors duration-200 relative">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-[#8FAF9A]/5 dark:bg-[var(--accent)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-[#2E8B57]/5 dark:bg-[var(--accent)]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8 lg:py-10">
        {/* Header Section */}
        <div className="mb-0 flex flex-row justify-between items-end">
          <LessonHeader
            topicTitle={topicTitle}
            current={index + 1}
            total={lessons.length}
            progress={progress}
          />
        </div>
        {/* NEW: Global Display Answers Toggle Button - Placed directly */}
        <div className="flex justify-end h-10">
          <button
            onClick={() => setGlobalShowAnswers(!globalShowAnswers)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[var(--surface)] border border-[#E2E8E3] dark:border-[var(--border)] text-[#5F6B63] dark:text-[var(--muted)] hover:border-[#2E8B57] dark:hover:border-[var(--accent)] hover:text-[#2E8B57] dark:hover:text-[var(--accent)] transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Toggle display all answers"
          >
            {globalShowAnswers ? (
              <>
                <FiEyeOff className="w-4 h-4" />
                <span className="text-sm font-medium">Hide All Answers</span>
              </>
            ) : (
              <>
                <FiEye className="w-4 h-4" />
                <span className="text-sm font-medium">Display All Answers</span>
              </>
            )}
          </button>
        </div>

        {/* Question Card */}
        <div className="mt-6 bg-white dark:bg-[var(--card)] rounded-2xl shadow-md border border-[#E2E8E3] dark:border-[var(--border)] overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-xl">
          {/* Question Content */}
          <div className="p-6 pb-2">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-[#2C2C2C] dark:text-[var(--text)] leading-relaxed whitespace-normal break-words">
              {lesson.question}
            </p>

            <AnswerToggle
              show={shouldShowAnswer}
              onToggle={() => {
                if (globalShowAnswers) {
                  setHiddenByUser(!hiddenByUser);
                } else {
                  setShowAnswer(!showAnswer);
                }
              }}
              answer={lesson.answer}
            />
            <div className="flex justify-end items-center mt-3">
              <p className="text-xs font-semibold text-[#545d55] dark:text-[var(--text)]">
                SPEAK THIS ALOUD
              </p>
              <GoDotFill className="text-[#4ecb84]" />
            </div>
          </div>
        </div>
        <LessonNavigation
          onPrev={() => setIndex(index - 1)}
          onNext={() => setIndex(index + 1)}
          disablePrev={index === 0}
          disableNext={index === lessons.length - 1}
        />
        {index === lessons.length - 1 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-900/30 text-center transition-colors duration-200">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FiCheckCircle className="w-5 h-5 text-[#2E8B57] dark:text-[var(--accent)]" />
              <span className="font-semibold text-[#2E8B57] dark:text-[var(--accent)] transition-colors duration-200">
                Congratulations!
              </span>
            </div>
            <p className="text-sm text-[#5F6B63] dark:text-[var(--muted)] transition-colors duration-200">
              You've completed all questions in this topic. Great job! 🎉
            </p>
          </div>
        )}
      </div>

      {/* Sticky Audio Player */}
      {/* Audio automatically plays when question changes. The useAudioPlayback hook handles:
          - Auto-play on new question load
          - Stopping previous audio before starting new one
          - Mobile autoplay restrictions with graceful fallback
          - Proper resource cleanup
          - Promise-based play() error handling */}
      {lesson.audio && (
        <StickyPlayer
          key={`audio-${index}`}
          src={lesson.audio}
          title={"Listen to Question"}
        />
      )}
    </div>
  );
};

export default Lessons;
