import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/register", { email, password, role });
      login(res.data.token, res.data.email, res.data.role);
      navigate("/books");
    } catch (err: any) {
      setError(err.response?.data ?? "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-80 space-y-4">
        <h1 className="text-xl font-semibold text-slate-800">Create account</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded p-2" type="email" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="w-full border rounded p-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="w-full bg-slate-800 text-white rounded p-2 hover:bg-slate-700">
          Create account
        </button>
        <p className="text-sm text-center text-slate-500">
          Already have an account? <Link to="/login" className="underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}