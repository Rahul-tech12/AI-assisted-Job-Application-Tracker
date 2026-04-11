import { useState } from "react";
import { exportToCSV } from "../utils/exportUtils.js";

interface KanbanFilterProps {
  applications: any[];
  onFilterChange: (filtered: any[]) => void;
}

export default function KanbanFilter({ applications, onFilterChange }: KanbanFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");

  const statuses = ["All", "Applied", "Phone Screen", "Interview", "Offer", "Rejected"];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterApplications(term, statusFilter, dateFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterApplications(searchTerm, status, dateFilter);
  };

  const handleDateFilter = (date: string) => {
    setDateFilter(date);
    filterApplications(searchTerm, statusFilter, date);
  };

  const filterApplications = (search: string, status: string, date: string) => {
    let filtered = applications;

    // Search filter
    if (search) {
      filtered = filtered.filter(app =>
        app.company?.toLowerCase().includes(search.toLowerCase()) ||
        app.role?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status !== "All") {
      filtered = filtered.filter(app => app.status === status);
    }

    // Date filter
    if (date !== "all") {
      const now = new Date();
      const appDate = new Date();

      if (date === "today") {
        appDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(app => {
          const timestamp = new Date(app.dateApplied);
          timestamp.setHours(0, 0, 0, 0);
          return timestamp.getTime() === appDate.getTime();
        });
      } else if (date === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(app => new Date(app.dateApplied) >= weekAgo);
      } else if (date === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(app => new Date(app.dateApplied) >= monthAgo);
      }
    }

    onFilterChange(filtered);
  };

  return (
    <div className="kanban-filter">
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by company or position..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={dateFilter}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <button
          onClick={() => exportToCSV(applications)}
          className="btn-export"
          title="Export to CSV"
        >
          📥 Export
        </button>
      </div>
    </div>
  );
}
