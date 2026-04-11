import { useState } from "react";
import { createApplication } from "../api.js";
import "../App.css";

interface AddApplicationProps {
  onApplicationAdded?: () => void;
}

export default function AddApplication({ onApplicationAdded }: AddApplicationProps) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!jd.trim()) {
      setError("Please paste a job description");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const data = await createApplication(jd);
      setSuccess("Job application added successfully!");
      setJd("");
      
      // Refresh Kanban board data
      if (onApplicationAdded) {
        onApplicationAdded();
      }
      
      console.log(data);
    } catch (err) {
      setError("Failed to add application. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <section className="form-section">
      <h2 style={{ margin: "0 0 1.5rem 0", color: "var(--text-h)", fontSize: "1.3rem", fontWeight: "700" }}>
        Add New Job Application
      </h2>

      <div className="form-group">
        <label className="form-label">Job Description</label>
        <textarea
          className="form-textarea"
          placeholder="Paste the job description here... Include company name, position, requirements, etc."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          disabled={loading}
        />
        <span style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "0.25rem" }}>
          {jd.length} characters
        </span>
      </div>

      {error && (
        <div style={{ 
          background: "rgba(239, 68, 68, 0.1)", 
          color: "#ef4444", 
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          fontSize: "0.9rem",
          marginBottom: "1rem",
          border: "1px solid rgba(239, 68, 68, 0.3)"
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ 
          background: "rgba(34, 197, 94, 0.1)", 
          color: "#22c55e", 
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          fontSize: "0.9rem",
          marginBottom: "1rem",
          border: "1px solid rgba(34, 197, 94, 0.3)"
        }}>
          ✓ {success}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary"
        style={{ width: "100%", marginTop: "1rem" }}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Parsing...
          </>
        ) : (
          "Add Application"
        )}
      </button>
    </section>
  );
}
