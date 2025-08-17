import { useStore } from "../store";
import { FaUserEdit, FaVideo, FaHeart, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";
import "../styles.css";

export default function Profile() {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);

  const goBack = () => navigate("/");

  useEffect(() => {
    const loadVideos = async () => {
      if (!user) return;
      try {
        const res = await api.feed({ cursor: 0, size: 50 });
        if (user.role === "creator") {
          setVideos(res.items.filter(v => v.author._id === user._id));
        } else {
          setLikedVideos(res.items.filter(v => v.likedBy?.includes(user._id)));
        }
      } catch (err) {
        console.error("Failed to load videos:", err);
      }
    };
    loadVideos();
  }, [user]);

  const displayVideos = user?.role === "creator" ? videos : likedVideos;

  const handleUploadClick = () => {
    if (user?.role !== "creator") {
      alert("You are a consumer. Only creators can upload videos.");
      return;
    }
    navigate("/upload"); // your upload page route
  };

  return (
    <div className="profile-page">
      {/* Back Arrow */}
      <div className="back-arrow" onClick={goBack}><FaArrowLeft /></div>

      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={user?.avatar || "https://i.pravatar.cc/150?img=3"} alt="Profile" />
          <button className="edit-btn"><FaUserEdit /></button>
        </div>
        <h2 className="username">{user?.name || "User Name"}</h2>
        <p className="email">{user?.email || "user@email.com"}</p>
        <span className={`role-badge ${user?.role || "consumer"}`}>
          {user?.role?.toUpperCase() || "CONSUMER"}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-section">
        <div className="stat-card">
          <FaVideo className="stat-icon" />
          <strong>{videos.length}</strong>
          <span>Videos</span>
        </div>
        <div className="stat-card">
          <FaHeart className="stat-icon" />
          <strong>{likedVideos.length}</strong>
          <span>Likes</span>
        </div>
        <div className="stat-card">
          <FaUserEdit className="stat-icon" />
          <strong>{user?.followers?.length || 0}</strong>
          <span>Followers</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="profile-buttons">
        <button className="gradient-btn" onClick={handleUploadClick}>
          {user?.role === "creator" ? <FaVideo /> : null} Upload Video
        </button>
        <button className="gradient-btn"><FaUserEdit /> Edit Profile</button>
        <button className="logout-btn" onClick={logout}><FaSignOutAlt /> Logout</button>
      </div>

      {/* Video Grid */}
      <div className="videos-section">
        <h3>{user?.role === "creator" ? "My Videos" : "Liked Videos"}</h3>
        {displayVideos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#ccc", marginTop: "20px" }}>
            No videos to display
          </p>
        ) : (
          <div className="video-grid">
            {displayVideos.map(v => (
              <div key={v._id} className="video-card">
                <video src={v.src} muted loop autoPlay className="videoEl" />
                <div className="video-info" style={{ bottom: "10px", left: "10px" }}>
                  <div className="video-meta">
                    <p className="title">{v.title}</p>
                    <p className="sub">{v.genre || "General"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
