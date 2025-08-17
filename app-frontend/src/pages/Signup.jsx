import { useState } from "react";
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import "../styles.css";


export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [msg, setMsg] = useState("");
  const { signup } = useStore();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.role) {
      return setMsg("Please fill in all fields");
    }
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setMsg("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <form className="auth-card" onSubmit={handleSignup}>
        <h2>Create Account</h2>
        <p className="subtitle">Join us and start exploring videos</p>

        {/* Name input */}
<div className="input-group">
  <FaUserAlt className="input-icon" />
  <input
    type="text"
    placeholder="Full Name"
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
  />
</div>

{/* Email input */}
<div className="input-group">
  <FaEnvelope className="input-icon" />
  <input
    type="email"
    placeholder="Email"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
  />
</div>

{/* Password input */}
<div className="input-group">
  <FaLock className="input-icon" />
  <input
    type="password"
    placeholder="Password"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
  />
</div>

{/* Role Dropdown — ONLY this gets has-select */}
<div className="input-group has-select">
  <select
    className="auth-select"
    value={form.role}
    onChange={(e) => setForm({ ...form, role: e.target.value })}
  >
    <option value="">Select Role</option>
    <option value="creator">Creator</option>
    <option value="consumer">Consumer</option>
  </select>
</div>


        <button type="submit" className="auth-btn">
          Sign Up
        </button>

        {msg && <p className="auth-msg">{msg}</p>}

        <p className="switch-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
