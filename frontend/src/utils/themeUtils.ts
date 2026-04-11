// Dark Mode Utility
export const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (systemPrefersDark ? "dark" : "light");
  
  applyTheme(theme);
  return theme;
};

export const applyTheme = (theme: "light" | "dark") => {
  const root = document.documentElement;
  
  if (theme === "dark") {
    root.style.setProperty("--bg", "#0f172a");
    root.style.setProperty("--text", "#cbd5e1");
    root.style.setProperty("--text-h", "#f1f5f9");
    root.style.setProperty("--border", "#1e293b");
    root.style.setProperty("--code-bg", "#1e293b");
    root.style.setProperty("--shadow", "0 10px 15px -3px rgba(0, 0, 0, 0.5)");
  } else {
    root.style.setProperty("--bg", "#ffffff");
    root.style.setProperty("--text", "#4b5563");
    root.style.setProperty("--text-h", "#1f2937");
    root.style.setProperty("--border", "#e5e7eb");
    root.style.setProperty("--code-bg", "#f9fafb");
    root.style.setProperty("--shadow", "0 10px 15px -3px rgba(0, 0, 0, 0.1)");
  }
  
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
};

export const toggleTheme = () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(newTheme as "light" | "dark");
  return newTheme;
};

export const getCurrentTheme = () => {
  return (localStorage.getItem("theme") || "light") as "light" | "dark";
};
