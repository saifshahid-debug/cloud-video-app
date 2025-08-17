import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";

export default function NavBar(){
  const { user, logout } = useStore();
  const nav = useNavigate();
  return (
    <div className="nav">
      <Link to="/" className="brand">CloudVideo</Link>
      <div style={{marginLeft:'auto',display:'flex',gap:12}}>
        {user && <Link to="/upload">Upload</Link>}
        {user && <Link to="/profile">Profile</Link>}
        {user ? (
          <button onClick={()=>{logout(); nav('/onboarding');}}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}
