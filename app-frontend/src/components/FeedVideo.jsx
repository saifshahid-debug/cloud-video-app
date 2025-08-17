import { useEffect, useRef, useState } from "react";
import { AiFillHeart } from "react-icons/ai";

export default function FeedVideo({ src, active, onDoubleLike }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  const [heart, setHeart] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  const dbl = () => {
    setHeart(true);
    onDoubleLike?.();
    setTimeout(() => setHeart(false), 350);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <video
        ref={ref}
        className="videoEl"
        src={src}
        muted={muted}
        loop
        playsInline
        onClick={() => setMuted((m) => !m)}
        onDoubleClick={dbl}
      />
      <div className={`heart ${heart ? "show" : ""}`}>
        <AiFillHeart color="#ff2d55" />
      </div>
    </div>
  );
}
