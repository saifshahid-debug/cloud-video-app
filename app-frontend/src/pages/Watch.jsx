import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { api } from "../api";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);

  useEffect(() => {
    api.video(id).then(setVideo);
    api.commentList(id).then(setComments);
  }, [id]);

  const addComment = async () => {
    if (!text.trim()) return;
    const c = await api.commentAdd(id, text);
    setComments([c, ...comments]);
    setText("");
  };

  const rateVideo = async () => {
    const r = await api.rate(id, stars);
    alert(`Rating submitted! New average: ${r.avgRating}★`);
  };

  if (!video) {
    return (
      <div>
        <NavBar />
        <div style={{ padding: 20 }}>Loading video...</div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 900, margin: "20px auto" }}>
        <h2>{video.title}</h2>
        <video
          src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
          style={{ width: "100%", background: "#000" }}
          controls
        />
        <div style={{ opacity: 0.7, marginTop: 8 }}>
          {video.genre} • {video.ageRating} • {video.avgRating}★
        </div>
        <div style={{ marginTop: 16 }}>
          <h3>Rate this video</h3>
          <input
            type="number"
            min="1"
            max="5"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
          />
          <button onClick={rateVideo} style={{ marginLeft: 8 }}>
            Submit rating
          </button>
        </div>
        <div style={{ marginTop: 16 }}>
          <h3>Comments</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: 8 }}
            />
            <button onClick={addComment}>Post</button>
          </div>
          <ul>
            {comments.map((c) => (
              <li key={c._id}>
                <b>{c.author}</b>: {c.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
