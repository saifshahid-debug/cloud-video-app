import { useEffect, useState } from "react";
import { api } from "../api";
import NavBar from "../components/NavBar";
import { Link, useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const [q, setQ] = useState("");
  const [vids, setVids] = useState([]);

  useEffect(() => {
    const load = async () => {
      let items = q.trim() ? await api.search(q) : await api.latest();

      // Prepend newly uploaded video if redirected
      if (location.state?.addedVideo) items = [location.state.addedVideo, ...items];

      setVids(items);
    };
    load();
  }, [location.state, q]);

  const search = async () => {
    const res = q.trim() ? await api.search(q) : await api.latest();
    setVids(res);
  };

  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "20px auto" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search title, genre, tags..." style={{ flex: 1, padding: 10 }} />
          <button onClick={search}>Search</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16, marginTop: 16 }}>
          {vids.map(v => (
            <Link key={v._id} to={`/watch/${v._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 8 }}>
                <div style={{ aspectRatio: "16/9", background: "#f3f3f3", display: "grid", placeItems: "center" }}>
                  {v.src ? <video src={v.src} style={{ width: "100%", height: "100%" }} /> : "thumbnail"}
                </div>
                <div style={{ fontWeight: 600, marginTop: 8 }}>{v.title}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{v.genre} • {v.avgRating}★</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
