import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";

const API = "http://192.168.0.6:8000/";   // ← change to your Django base URL

export default function HRDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);   // null = loading
  const [error,   setError]   = useState(false);

  /* ── check session on mount ── */
  useEffect(() => {
    fetch(`${API}/api/hr/session/`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.authenticated) setSession(d);
        else navigate("/signup");          // not logged in → back to signup
      })
      .catch(() => setError(true));
  }, []);

  /* ── logout ── */
  const logout = () =>
    fetch(`${API}/api/hr/logout/`, { method: "POST", credentials: "include" })
      .then(() => navigate("/signup"));

  /* ── loading ── */
  if (session === null && !error) return (
    <div style={{
      minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 35%,#FAF5FF 100%)",
      fontFamily:"'Outfit',sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Loader2 style={{width:32,height:32,color:"#7C3AED",animation:"spin 0.8s linear infinite"}}/>
    </div>
  );

  if (error) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",color:"#BE123C"}}>
      Could not reach server.
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Outfit', system-ui, sans-serif !important; box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 35%,#F5F3FF 65%,#FAF5FF 100%)",
        fontFamily:"'Outfit',sans-serif",
      }}>

        {/* top bar */}
        <header style={{
          background:"rgba(255,255,255,0.82)",backdropFilter:"blur(20px)",
          borderBottom:"1px solid #DDD6FE",
          boxShadow:"0 2px 16px rgba(124,58,237,0.08)",
          padding:"13px 28px",
          display:"flex",alignItems:"center",justifyContent:"space-between",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{
              width:40,height:40,borderRadius:13,
              background:"linear-gradient(135deg,#4C1D95,#7C3AED)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 4px 14px rgba(124,58,237,0.35)",
            }}>
              <span style={{color:"#fff",fontWeight:800,fontSize:14}}>HR</span>
            </div>
            <div>
              <p style={{margin:0,fontSize:9,color:"#A855F7",fontWeight:800,letterSpacing:"0.16em",textTransform:"uppercase"}}>Connect Portal</p>
              <p style={{margin:0,fontSize:15,color:"#2E1065",fontWeight:800,letterSpacing:"-0.3px"}}>HR Dashboard</p>
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {/* session badge */}
            <div style={{
              display:"flex",alignItems:"center",gap:7,
              background:"rgba(237,233,254,0.75)",
              border:"1px solid #C4B5FD",
              borderRadius:99,padding:"5px 12px",
            }}>
              <ShieldCheck style={{width:13,height:13,color:"#7C3AED"}}/>
              <span style={{fontSize:11,fontWeight:700,color:"#6D28D9"}}>
                {session.hr_id}
              </span>
            </div>

            <button onClick={logout} style={{
              display:"flex",alignItems:"center",gap:6,
              padding:"7px 14px",
              background:"#FFF1F2",border:"1.5px solid #FECDD3",
              borderRadius:10,cursor:"pointer",
              fontSize:12,fontWeight:700,color:"#BE123C",
              transition:"all 0.15s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="#FFE4E6";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#FFF1F2";}}>
              <LogOut style={{width:13,height:13}}/> Logout
            </button>
          </div>
        </header>

        {/* ── empty main area (build your dashboard here) ── */}
        <main style={{
          maxWidth:1100,margin:"0 auto",padding:"40px 28px",
          animation:"fadeUp 0.4s ease both",
        }}>
          <div style={{
            background:"rgba(255,255,255,0.80)",
            border:"1px solid #DDD6FE",
            borderRadius:22,
            padding:"48px 32px",
            textAlign:"center",
            boxShadow:"0 2px 4px rgba(124,58,237,0.06),0 12px 40px rgba(109,40,217,0.10)",
          }}>
            <div style={{
              width:64,height:64,borderRadius:"50%",
              background:"linear-gradient(135deg,#EDE9FE,#DDD6FE)",
              border:"2px solid #C4B5FD",
              display:"flex",alignItems:"center",justifyContent:"center",
              margin:"0 auto 18px",
              boxShadow:"0 4px 18px rgba(124,58,237,0.18)",
            }}>
              <ShieldCheck style={{width:28,height:28,color:"#7C3AED"}}/>
            </div>

            <p style={{margin:0,fontSize:22,fontWeight:800,color:"#2E1065",letterSpacing:"-0.4px"}}>
              Welcome, {session.first_name}!
            </p>
            <p style={{margin:"8px 0 0",fontSize:13.5,color:"#A78BFA"}}>
              You're logged in as <strong style={{color:"#6D28D9"}}>{session.hr_id}</strong>
            </p>
            <p style={{margin:"4px 0 0",fontSize:12,color:"#C4B5FD"}}>{session.email}</p>

            <div style={{
              marginTop:28,padding:"14px 20px",
              background:"#F5F3FF",border:"1px dashed #C4B5FD",borderRadius:14,
              fontSize:13,color:"#7C3AED",fontWeight:600,
              display:"inline-block",
            }}>
              🏗️ &nbsp; Dashboard content goes here
            </div>
          </div>
        </main>

      </div>
    </>
  );
}