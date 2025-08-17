import { useEffect, useRef, useState } from "react";
import { api } from "../api";
import FeedVideo from "../components/FeedVideo";
import FloatingActions from "../components/FloatingActions";
import CommentDrawer from "../components/CommentDrawer";
import BottomNav from "../components/BottomNav";
import { FaSearch } from "react-icons/fa";
import "../styles.css";

export default function Feed() {
  const [items, setItems] = useState([]);           // all videos loaded
  const [next, setNext] = useState(null);           // next cursor
  const [active, setActive] = useState(0);         // active video index
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [q, setQ] = useState("");                  // search query
  const containerRef = useRef(null);

  // Load initial videos
  useEffect(() => {
    loadMore(0);
  }, []);

  // Safe load more videos
  async function loadMore(cursor) {
    try {
      const r = await api.feed({ cursor, size: 5 });
      const safeItems = r?.items || [];
      setItems(prev => (cursor === 0 ? safeItems : [...prev, ...safeItems]));
      setNext(r?.next ?? null);
    } catch (err) {
      console.error("Feed load error:", err);
    }
  }

  // Scroll observer to detect active video and load more
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const cards = [...el.querySelectorAll("[data-card]")];
    const obs = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActive(Number(best.target.getAttribute("data-index")));

        if (el.scrollTop + el.clientHeight + 400 >= el.scrollHeight && next != null) {
          obs.disconnect();
          loadMore(next);
        }
      },
      { threshold: [0.6, 0.9] }
    );
    cards.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, [items, next]);

  // Open comments drawer
  const openComments = async (vid) => {
    try {
      const list = await api.comments(vid._id);
      setComments(list || []);
      setDrawerOpen(true);
    } catch (err) {
      console.error("Comments load error:", err);
    }
  };

  // Post new comment
  const postComment = async () => {
    if (!text.trim()) return;
    try {
      const c = await api.addComment(items[active]._id, text);
      setComments(prev => [c, ...prev]);
      setText("");
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  // Like current video
  const like = async () => {
    try {
      const v = items[active];
      const r = await api.like(v._id);
      setItems(prev => {
        const copy = [...prev];
        copy[active] = { ...copy[active], likes: r.likes };
        return copy;
      });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // Share video link
  const share = () => {
    const url = `${location.origin}/?v=${items[active]?._id}`;
    navigator.clipboard.writeText(url).catch(() => {});
    alert("Link copied!");
  };

  // Filter videos by search query
  const filtered = q.trim()
    ? (items || []).filter(v =>
        ((v.title || "") + (v.genre || "") + (v.tags || "")).toLowerCase().includes(q.toLowerCase())
      )
    : items || [];

  return (
    <div className="tiktok-feed">
      {/* Fixed header */}
      <header className="tiktok-header">
        <div className="logo">CloudVideo</div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search videos, genres, tags..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </header>

      {/* Feed */}
      <div ref={containerRef} className="video-feed">
        {(filtered || []).map((v, i) => (
          <section className="video-card" key={v._id || i} data-card data-index={i}>
            <FeedVideo src={v.src} active={i === active} onDoubleLike={like} />
            <div className="video-info">
              <img className="avatar" src={v.author?.avatar} alt="avatar" />
              <div className="video-meta">
                <div className="username">@{v.author?.name || "Unknown"}</div>
                <div className="title">
                  {v.title || "Untitled"} <span>{v.tags || ""}</span>
                </div>
                <div className="sub">
                  {v.genre || "Unknown"} • {v.ageRating || ""} • {v.avgRating || 0}★
                </div>
              </div>
            </div>
            <FloatingActions
              likes={v.likes || 0}
              onLike={like}
              onComments={() => openComments(v)}
              onShare={share}
            />
          </section>
        ))}
      </div>

      {/* Comments drawer */}
      <CommentDrawer
        open={drawerOpen}
        comments={comments || []}
        text={text}
        setText={setText}
        onPost={postComment}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Bottom nav */}
      <BottomNav />
    </div>
  );
}
