import "./App.css";
import AddApplication from "./components/AddApplication";
import Kanban from "./components/Kanban";
import Register from "./pages/Register";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="header-title">📋 Job Application Tracker</h1>
            <p className="header-subtitle">
              Manage your job applications with ease
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Register />
      </main>
    </div>
  );
}

export default App;
