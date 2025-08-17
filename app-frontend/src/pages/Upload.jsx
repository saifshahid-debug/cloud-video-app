import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaVideo, FaTag, FaFilm, FaUserTie, FaUserEdit, FaChild } from "react-icons/fa";
import Protected from "../components/Protected";
import NavBar from "../components/NavBar";
import { api } from "../api";
import "../styles.css";

export default function Upload() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    publisher: "",
    producer: "",
    genre: "",
    ageRating: "PG",
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!file) return setMsg("Please select a video file");
    if (!form.title || !form.genre) return setMsg("Please fill all required fields");

    try {
      setLoading(true);
      setMsg("Uploading video...");
      const newVideo = await api.upload({ ...form, file });
      setMsg("Upload successful! Redirecting to feed...");

      setTimeout(() => {
        navigate("/", { state: { addedVideo: newVideo } });
      }, 1000);
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.error || "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected roles={["creator"]}>
      <NavBar />
      <div style={{ display: "flex", justifyContent: "center", padding: "50px 20px" }}>
        <div style={{ width: "100%", maxWidth: 500, padding: 30, borderRadius: 20, boxShadow: "0 8px 20px rgba(0,0,0,0.15)", backgroundColor: "#fff" }}>
          <h2 style={{ marginBottom: 10 }}>Upload Video</h2>
          <p style={{ marginBottom: 20, color: "#555" }}>Fill in the details below to share your video</p>

          {["title", "publisher", "producer", "genre"].map((field, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
              {field === "title" && <FaFilm style={{ marginRight: 10, color: "#555" }} />}
              {field === "publisher" && <FaUserTie style={{ marginRight: 10, color: "#555" }} />}
              {field === "producer" && <FaUserEdit style={{ marginRight: 10, color: "#555" }} />}
              {field === "genre" && <FaTag style={{ marginRight: 10, color: "#555" }} />}
              <input
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ccc", outline: "none" }}
              />
            </div>
          ))}

          <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
            <FaChild style={{ marginRight: 10, color: "#555" }} />
            <select
              value={form.ageRating}
              onChange={(e) => setForm({ ...form, ageRating: e.target.value })}
              style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ccc" }}
            >
              <option value="PG">PG</option>
              <option value="18+">18+</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <FaTag style={{ marginRight: 10, color: "#555" }} />
            <input
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ccc", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: 20, padding: 15, border: "2px dashed #aaa", borderRadius: 15, textAlign: "center", cursor: "pointer", color: "#555" }}>
            <label htmlFor="videoUpload" style={{ cursor: "pointer" }}>
              <FaVideo style={{ marginRight: 10 }} /> {file ? file.name : "Choose Video"}
            </label>
            <input type="file" id="videoUpload" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            style={{ width: "100%", padding: 12, borderRadius: 15, border: "none", backgroundColor: "#007bff", color: "#fff", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", marginBottom: 10 }}
          >
            {loading ? "Uploading..." : "Upload Video"}
          </button>

          {msg && <p style={{ color: loading ? "#555" : "green", textAlign: "center" }}>{msg}</p>}
        </div>
      </div>
    </Protected>
  );
}
