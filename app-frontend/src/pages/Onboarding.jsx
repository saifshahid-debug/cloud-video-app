import { useNavigate, Link } from "react-router-dom";

export default function Onboarding() {
  const nav = useNavigate();

  return (
    <div className="onboarding-container">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="onboarding-video"
      >
        <source src="/videos/landing-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="onboarding-overlay"></div>

      {/* Content */}
      <div className="onboarding-content">
        <h1 className="onboarding-title">
          Welcome to <span className="onboarding-gradient-text">CloudVideo</span>
        </h1>
        <p className="onboarding-subtitle">
          Swipe through short videos. Like, comment, share — or upload your own!
        </p>
        <div className="onboarding-btn-group">
          <button
            className="onboarding-btn-primary"
            onClick={() => nav("/signup")}
          >
            Get Started
          </button>
          <Link to="/login" className="onboarding-btn-secondary">
            I already have an account
          </Link>
        </div>
      </div>
    </div>
  );
}
