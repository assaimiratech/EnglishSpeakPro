import { create } from "zustand";
import { updateProfile } from "../api/auth.api";

const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
})();

// Get saved theme with priority: localStorage theme > user theme > light
const getSavedTheme = () => {
  const localTheme = localStorage.getItem("theme");
  if (localTheme && ["light", "dark", "system"].includes(localTheme)) {
    return localTheme;
  }
  if (
    savedUser?.theme &&
    ["light", "dark", "system"].includes(savedUser.theme)
  ) {
    return savedUser.theme;
  }
  return "light";
};

const savedAutoPlay = localStorage.getItem("autoPlay") === "true";
const savedAutoNext = localStorage.getItem("autoNext") === "true";

export const useSettingsStore = create((set, get) => ({
  theme: getSavedTheme(),
  autoPlay: savedAutoPlay,
  autoNext: savedAutoNext,

  applyTheme: (theme) => {
    localStorage.setItem("theme", theme);

    // Handle system preference
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(isDark ? "dark" : "light");
    } else {
      document.documentElement.classList.remove("light", "dark", "system");
      document.documentElement.classList.add(theme);
    }

    set({ theme });
  },

  setTheme: (theme) => {
    const applyLocalTheme = (themeValue) => {
      localStorage.setItem("theme", themeValue);

      // Handle system preference
      if (themeValue === "system") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(isDark ? "dark" : "light");
      } else {
        document.documentElement.classList.remove("light", "dark", "system");
        document.documentElement.classList.add(themeValue);
      }

      set({ theme: themeValue });
    };

    applyLocalTheme(theme);

    const user =
      savedUser ||
      (() => {
        try {
          return JSON.parse(localStorage.getItem("user"));
        } catch {
          return null;
        }
      })();

    if (user?.id) {
      updateProfile({ theme })
        .then((res) => {
          if (res?.user) {
            localStorage.setItem("user", JSON.stringify(res.user));
          }
        })
        .catch(() => {
          // ignore theme save failures; local theme state still works
        });
    }
  },

  resetTheme: () => {
    const theme = "light";
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark", "system");
    document.documentElement.classList.add(theme);
    set({ theme });
  },

  setAutoPlay: (value) => {
    localStorage.setItem("autoPlay", value);
    set({ autoPlay: value });
  },

  setAutoNext: (value) => {
    localStorage.setItem("autoNext", value);
    set({ autoNext: value });
  },
}));

// Initialize theme on app load
const initialTheme = getSavedTheme();
if (initialTheme === "system") {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.add(isDark ? "dark" : "light");
} else {
  document.documentElement.classList.add(initialTheme);
}

// Listen for system theme changes
if (window.matchMedia) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme === "system") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(e.matches ? "dark" : "light");
      }
    });
}
