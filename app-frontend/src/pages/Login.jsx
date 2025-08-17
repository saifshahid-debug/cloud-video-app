import { useState } from "react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import "../styles.css";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return setMsg("Please fill in all fields");
    }
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setMsg("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        <div className="input-group">
          <FaUserAlt className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button type="submit" className="auth-btn">
          Login
        </button>

        {msg && <p className="auth-msg">{msg}</p>}

        <p className="switch-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}
