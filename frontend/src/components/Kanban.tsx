import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getApplications, updateApplication } from "../api.js";
import ApplicationModal from "./ApplicationModal.js";

const columns = [
  { name: "Applied", icon: "📝" },
  { name: "Phone Screen", icon: "☎️" },
  { name: "Interview", icon: "👤" },
  { name: "Offer", icon: "🎉" },
  { name: "Rejected", icon: "❌" }
];

interface KanbanProps {
  allApplications?: any[];
}

const KanbanComponent = forwardRef<any, KanbanProps>((props, ref) => {
  const [applications, setApplications] = useState<any[]>(props.allApplications || []);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedApp, setDraggedApp] = useState<any>(null);

  useEffect(() => {
    if (props.allApplications && props.allApplications.length > 0) {
      setApplications(props.allApplications);
      setLoading(false);
    } else {
      fetchApplications();
    }
  }, [props.allApplications]);

  useImperativeHandle(ref, () => ({
    refreshApplications: () => fetchApplications()
  }));

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter(app => app.status === status);
  };

  const handleDragStart = (e: React.DragEvent, app: any) => {
    setDraggedApp(app);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedApp && draggedApp.status !== status) {
      try {
        await updateApplication(draggedApp._id, { status });
        setDraggedApp(null);
        fetchApplications();
      } catch (err) {
        console.error("Error updating application:", err);
      }
    }
  };

  const handleCardClick = (app: any) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handleModalUpdate = () => {
    fetchApplications();
    handleModalClose();
  };

  return (
    <>
      <section style={{ marginTop: "2rem" }}>
        <h2 style={{
          margin: "0 0 1.5rem 0",
          color: "var(--text-h)",
          fontSize: "1.3rem",
          fontWeight: "700"
        }}>
          Application Pipeline
        </h2>

        {loading ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text)" }}>
            Loading applications...
          </div>
        ) : (
          <div className="kanban-container">
            {columns.map(column => {
              const apps = getApplicationsByStatus(column.name);
              return (
                <div
                  key={column.name}
                  className="kanban-column"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.name)}
                >
                  <div className="kanban-header">
                    <div>
                      <div className="kanban-title">
                        <span>{column.icon}</span> {column.name}
                      </div>
                    </div>
                    <div className="kanban-count">{apps.length}</div>
                  </div>

                  <div className="kanban-cards">
                    {apps.length > 0 ? (
                      apps.map(app => (
                        <div
                          key={app._id}
                          className="kanban-card"
                          draggable
                          onDragStart={(e) => handleDragStart(e, app)}
                          onClick={() => handleCardClick(app)}
                        >
                          <h3 className="kanban-card-title">{app.company}</h3>
                          <p className="kanban-card-role">{app.role}</p>
                          <div className="kanban-card-meta">
                            <span className="status-badge">{column.name}</span>
                            <span>
                              {new Date(app.dateApplied).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "var(--text)",
                          padding: "2rem 1rem",
                          opacity: 0.5,
                          fontSize: "0.9rem"
                        }}
                      >
                        No applications yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ApplicationModal
        app={selectedApp}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleModalUpdate}
      />
    </>
  );
});

KanbanComponent.displayName = "Kanban";
export default KanbanComponent;
