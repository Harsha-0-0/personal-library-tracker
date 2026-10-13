import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.email, res.data.role);
      navigate("/books");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-80 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800">Sign in</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded p-2" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-slate-800 text-white rounded p-2 hover:bg-slate-700">
          Log in
        </button>
        <p className="text-sm text-center text-slate-500">
          Need an account? <Link to="/register" className="underline">Register</Link>
        </p>
      </form>
    </div>
  );
}