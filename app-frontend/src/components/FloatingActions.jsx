import { AiFillHeart } from "react-icons/ai";
import { BiShare } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";

export default function FloatingActions({ likes, onLike, onComments, onShare }){
  return (
    <div className="actions">
      <button className="fab" onClick={onLike}><AiFillHeart size={22}/></button>
      <div className="count">{likes}</div>
      <button className="fab" onClick={onComments}><FaRegCommentDots size={20}/></button>
      <div className="count">Comments</div>
      <button className="fab" onClick={onShare}><BiShare size={22}/></button>
      <div className="count">Share</div>
    </div>
  );
}
