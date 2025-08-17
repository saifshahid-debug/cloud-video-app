import { Link, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { IoMdAddCircle } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export default function BottomNav(){
  const { pathname } = useLocation();
  const active = (p)=> pathname === p ? "active" : "";
  return (
    <div className="bottomnav">
      <Link className={active("/")} to="/"><AiFillHome size={24}/></Link>
      <Link className={active("/search")} to="/"><BiSearch size={24}/></Link>
      <Link className={active("/upload")} to="/upload"><IoMdAddCircle size={28}/></Link>
      <Link className={active("/profile")} to="/profile"><CgProfile size={24}/></Link>
    </div>
  );
}
