import { useEffect, useState } from "react";
import { getApplications } from "../api.js";
import "../styles/reminders.css";

export default function FollowUpReminders() {
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const checkReminders = async () => {
      try {
        const apps = await getApplications();
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const overdueApps = apps.filter((app: any) => {
          const appDate = new Date(app.dateApplied);
          return appDate < sevenDaysAgo && app.status === "Applied";
        });
        setReminders(overdueApps);
      } catch (err) {
        console.error("Error fetching reminders:", err);
      }
    };

    checkReminders();
  }, []);

  if (reminders.length === 0) {
    return null;
  }

  const getDaysOverdue = (dateApplied: string) => {
    const appDate = new Date(dateApplied);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - appDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="reminders-container">
      <div className="reminders-header">
        <h3>⏰ Follow-up Reminders</h3>
        <span className="reminder-badge">{reminders.length}</span>
      </div>
      
      <div className="reminders-list">
        {reminders.map((app: any) => (
          <div key={app._id} className="reminder-item">
            <div className="reminder-indicator"></div>
            <div className="reminder-content">
              <p className="reminder-company">{app.company} - {app.role}</p>
              <p className="reminder-text">
                Applied {getDaysOverdue(app.dateApplied)} days ago. Time to follow up!
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
