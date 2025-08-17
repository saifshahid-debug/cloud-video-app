import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "./store";
import Onboarding from "./pages/Onboarding";
import Feed from "./pages/Feed";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function AppRouter(){
  const { user, loading } = useStore();
  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {!user && (
          <>
            <Route path="/onboarding" element={<Onboarding/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="*" element={<Navigate to="/onboarding" replace/>}/>
          </>
        )}
        {user && (
          <>
            <Route path="/" element={<Feed/>}/>
            <Route path="/upload" element={<Upload/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
