const columns = [
  { name: "Applied", color: "status-applied", icon: "📝" },
  { name: "Phone Screen", color: "status-phone", icon: "☎️" },
  { name: "Interview", color: "status-interview", icon: "👤" },
  { name: "Offer", color: "status-offer", icon: "🎉" },
  { name: "Rejected", color: "status-rejected", icon: "❌" }
];

// Sample data for demonstration
const sampleApplications = {
  "Applied": [
    { id: 1, company: "Google", position: "Senior Engineer", date: "2 days ago" },
    { id: 2, company: "Microsoft", position: "Full-stack Developer", date: "1 week ago" }
  ],
  "Phone Screen": [
    { id: 3, company: "Apple", position: "iOS Developer", date: "3 days ago" }
  ],
  "Interview": [
    { id: 4, company: "Meta", position: "React Developer", date: "5 days ago" }
  ],
  "Offer": [
    { id: 5, company: "Amazon", position: "Backend Engineer", date: "1 week ago" }
  ],
  "Rejected": []
};

export default function Kanban() {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2 style={{ 
        margin: "0 0 1.5rem 0", 
        color: "var(--text-h)", 
        fontSize: "1.3rem", 
        fontWeight: "700" 
      }}>
        Application Pipeline
      </h2>
      
      <div className="kanban-container">
        {columns.map(column => (
          <div key={column.name} className="kanban-column">
            <div className="kanban-header">
              <div>
                <div className={`kanban-title`}>
                  <span>{column.icon}</span> {column.name}
                </div>
              </div>
              <div className="kanban-count">
                {sampleApplications[column.name]?.length || 0}
              </div>
            </div>

            <div className="kanban-cards">
              {sampleApplications[column.name]?.length > 0 ? (
                sampleApplications[column.name].map(app => (
                  <div key={app.id} className="kanban-card">
                    <h3 className="kanban-card-title">{app.company}</h3>
                    <p className="kanban-card-role">{app.position}</p>
                    <div className="kanban-card-meta">
                      <span className={`status-badge ${column.color}`}>
                        {column.name}
                      </span>
                      <span>{app.date}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: "center",
                  color: "var(--text)",
                  padding: "2rem 1rem",
                  opacity: 0.5,
                  fontSize: "0.9rem"
                }}>
                  No applications yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
