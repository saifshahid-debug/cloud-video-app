import { IoClose } from "react-icons/io5";

export default function CommentDrawer({ open, comments, text, setText, onPost, onClose }){
  if(!open) return null;
  return (
    <div className="commentSheet">
      <div className="sheetHead">
        <div className="sheetTitle">Comments</div>
        <div style={{marginLeft:'auto'}}><button onClick={onClose} style={{background:'none',border:0,color:'#fff'}}><IoClose size={22}/></button></div>
      </div>
      <div className="cList">
        {comments.map(c=>(
          <div key={c._id} className="cItem">
            <img src={c.avatar} alt="avatar"/>
            <div>
              <div className="who">{c.author}</div>
              <div className="txt">{c.text}</div>
            </div>
          </div>
        ))}
        {!comments.length && <div style={{opacity:.6}}>No comments yet.</div>}
      </div>
      <div className="cInput">
        <input placeholder="Add a comment..." value={text} onChange={e=>setText(e.target.value)}/>
        <button onClick={onPost}>Send</button>
      </div>
    </div>
  );
}
