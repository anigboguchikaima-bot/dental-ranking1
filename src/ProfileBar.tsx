import React, { useState } from 'react';
import { signIn, signOut } from './cloud';

export default function ProfileBar({ user }:{ user: { email?: string } | null }) {
  const [email, setEmail] = useState('');
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border bg-white/80">
      <div className="text-sm">
        {user ? <>Signed in as <b>{user.email}</b></> : <>Not signed in</>}
      </div>
      {!user ? (
        <>
          <input
            className="border rounded px-2 py-1"
            placeholder="you@email.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
          <button
            className="px-3 py-1 rounded bg-black text-white"
            onClick={async ()=>{
              if (!email) return alert('Enter email');
              try { await signIn(email); alert('Check your email for a magic link.'); }
              catch (e:any) { alert(e.message); }
            }}
          >Sign in</button>
        </>
      ) : (
        <button className="px-3 py-1 rounded border" onClick={()=>signOut()}>Sign out</button>
      )}
    </div>
  );
}
