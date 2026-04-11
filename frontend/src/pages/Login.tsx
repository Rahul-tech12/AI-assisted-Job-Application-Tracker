import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-container min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="background-decoration dot-1"></div>
      <div className="background-decoration dot-2"></div>

      <div className="auth-card bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="auth-title text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Login to your account</p>
        </div>

        {error && (
          <div className="error-message p-4 rounded-lg mb-6 text-red-400 text-sm">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading && <span className="loading-spinner"></span>}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link text-center mt-6 text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="font-semibold hover:text-blue-400">
            Register here
          </a>
        </p>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            type="button"
            className="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
