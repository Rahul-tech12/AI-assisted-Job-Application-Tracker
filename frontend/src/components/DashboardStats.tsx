import { useEffect, useState } from "react";
import { getApplications } from "../api.js";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    phoneScreen: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    successRate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apps = await getApplications();
        const newStats = {
          total: apps.length,
          applied: apps.filter((a: any) => a.status === "Applied").length,
          phoneScreen: apps.filter((a: any) => a.status === "Phone Screen").length,
          interview: apps.filter((a: any) => a.status === "Interview").length,
          offer: apps.filter((a: any) => a.status === "Offer").length,
          rejected: apps.filter((a: any) => a.status === "Rejected").length,
          successRate: apps.length > 0 ? Math.round((apps.filter((a: any) => a.status === "Offer").length / apps.length) * 100) : 0
        };
        setStats(newStats);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Applications", value: stats.total, icon: "📋", color: "#667eea" },
    { label: "Applied", value: stats.applied, icon: "📝", color: "#3b82f6" },
    { label: "Phone Screen", value: stats.phoneScreen, icon: "☎️", color: "#8b5cf6" },
    { label: "Interview", value: stats.interview, icon: "👤", color: "#ec4899" },
    { label: "Offer", value: stats.offer, icon: "🎉", color: "#10b981" },
    { label: "Rejected", value: stats.rejected, icon: "❌", color: "#ef4444" },
    { label: "Success Rate", value: `${stats.successRate}%`, icon: "🎯", color: "#f59e0b" }
  ];

  return (
    <div className="dashboard-stats">
      <h2 style={{
        margin: "0 0 1.5rem 0",
        color: "var(--text-h)",
        fontSize: "1.3rem",
        fontWeight: "700"
      }}>
        Application Statistics
      </h2>

      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon" style={{ background: `${card.color}20` }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{card.label}</p>
              <p className="stat-value" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
