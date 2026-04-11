import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import { initTheme } from "./utils/themeUtils.js";

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    // Initialize theme on app load
    initTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
