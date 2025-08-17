import { useState } from 'react';
import Protected from '../components/Protected';
import NavBar from '../components/NavBar';

export default function Admin(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [displayName,setDisplay]=useState(''); const [msg,setMsg]=useState('');
  const create=async()=>{
    const t = localStorage.getItem('t');
    const res = await fetch(`${import.meta.env.VITE_API || 'http://localhost:8080'}/api/admin/creators`, {
      method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${t}` },
      body: JSON.stringify({ email,password,displayName })
    });
    const j = await res.json();
    setMsg(res.ok ? `Created: ${j.email}` : (j.error||'Failed'));
  };
  return (
    <Protected roles={['admin']}>
      <div><NavBar/>
        <div style={{maxWidth:500,margin:'20px auto',border:'1px solid #eee',padding:20,borderRadius:8}}>
          <h2>Enroll Creator</h2>
          <input placeholder="Display name" value={displayName} onChange={e=>setDisplay(e.target.value)} style={{width:'100%',marginBottom:8,padding:8}}/>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',marginBottom:8,padding:8}}/>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',marginBottom:8,padding:8}}/>
          <button onClick={create}>Create</button>
          {msg && <div style={{marginTop:8}}>{msg}</div>}
        </div>
      </div>
    </Protected>
  );
}
