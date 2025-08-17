import { Navigate } from 'react-router-dom';
import { useStore } from '../store';
export default function Protected({ roles, children }){
  const { user } = useStore();
  if(!user) return <Navigate to="/login" replace/>;
  if(roles && !roles.includes(user.role)) return <Navigate to="/" replace/>;
  return children;
}
