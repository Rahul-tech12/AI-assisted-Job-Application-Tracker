import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications } from "../api.js";
import AddApplication from "../components/AddApplication.js";
import DashboardStats from "../components/DashboardStats.js";
import FollowUpReminders from "../components/FollowUpReminders.js";
import Kanban from "../components/Kanban.js";
import KanbanFilter from "../components/KanbanFilter.js";
import { toggleTheme, getCurrentTheme } from "../utils/themeUtils.js";
import "../styles/dashboard.css";
import "../styles/stats.css";
import "../styles/reminders.css";
import "../styles/filter.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const kanbanRef = useRef<any>(null);
  const [theme, setTheme] = useState<"light" | "dark">(getCurrentTheme());
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [filteredApps, setFilteredApps] = useState<any[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      const data = await getApplications();
      setAllApplications(data);
      setFilteredApps(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleApplicationAdded = () => {
    fetchAllApplications();
    if (kanbanRef.current) {
      kanbanRef.current.refreshApplications();
    }
  };

  const handleThemeToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme as "light" | "dark");
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="dashboard-nav-content">
          <h1 className="dashboard-title">🎯 Job Application Tracker</h1>
          <div className="nav-actions">
            <button
              onClick={handleThemeToggle}
              className="btn-theme"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <DashboardStats />
        <FollowUpReminders />
        <AddApplication onApplicationAdded={handleApplicationAdded} />
        <KanbanFilter
          applications={allApplications}
          onFilterChange={setFilteredApps}
        />
        <div className="kanban-section">
          <Kanban ref={kanbanRef} allApplications={filteredApps} />
        </div>
      </div>
    </div>
  );
}
