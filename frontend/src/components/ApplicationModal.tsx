import { useState } from "react";
import { deleteApplication, updateApplication } from "../api.js";
import "../styles/modal.css";

interface ApplicationModalProps {
  app: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ApplicationModal({ app, isOpen, onClose, onUpdate }: ApplicationModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(app?.status || "Applied");
  const [notes, setNotes] = useState(app?.notes || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !app) return null;

  const statuses = ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"];

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      await updateApplication(app._id, { status: selectedStatus });
      onUpdate();
      setLoading(false);
    } catch (err) {
      console.error("Error updating status:", err);
      setLoading(false);
    }
  };

  const handleNotesChange = async () => {
    setLoading(true);
    try {
      await updateApplication(app._id, { notes });
      onUpdate();
      setLoading(false);
    } catch (err) {
      console.error("Error updating notes:", err);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this application?")) {
      setLoading(true);
      try {
        await deleteApplication(app._id);
        onUpdate();
        onClose();
        setLoading(false);
      } catch (err) {
        console.error("Error deleting application:", err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{app.company} - {app.role}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {/* Company & Role */}
          <div className="modal-section">
            <h3>Position Details</h3>
            <p><strong>Company:</strong> {app.company}</p>
            <p><strong>Position:</strong> {app.role}</p>
            {app.location && <p><strong>Location:</strong> {app.location}</p>}
            {app.seniority && <p><strong>Seniority Level:</strong> {app.seniority}</p>}
            <p><strong>Applied On:</strong> {new Date(app.dateApplied).toLocaleDateString()}</p>
          </div>

          {/* Skills */}
          {app.skills && app.skills.length > 0 && (
            <div className="modal-section">
              <h3>Required Skills</h3>
              <div className="skills-container">
                {app.skills.map((skill: string, idx: number) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Resume Suggestions */}
          {app.resumePoints && app.resumePoints.length > 0 && (
            <div className="modal-section">
              <h3>Resume Points (AI Generated)</h3>
              <ul className="resume-points">
                {app.resumePoints.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Status */}
          <div className="modal-section">
            <h3>Application Status</h3>
            <div className="status-selector">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="status-dropdown"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button
                onClick={handleStatusChange}
                className="btn-update"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="modal-section">
            <h3>Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this application..."
              className="notes-textarea"
            />
            <button
              onClick={handleNotesChange}
              className="btn-save"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleDelete}
            className="btn-delete"
            disabled={loading}
          >
            Delete Application
          </button>
          <button onClick={onClose} className="btn-close">Close</button>
        </div>
      </div>
    </div>
  );
}
