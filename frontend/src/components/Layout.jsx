import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/dashboard',  icon: '⊞', label: 'Dashboard'  },
  { to: '/attendance', icon: '◫', label: 'Attendance'  },
  { to: '/employees',  icon: '◉', label: 'Employees'   },
  { to: '/analytics',  icon: '◈', label: 'Analytics'   },
]

export default function Layout() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('hh_token')
    navigate('/login')
  }

  return (
    <div style={{ display:'flex', height:'100vh', background:'#0a0a0a' }}>
      {/* Sidebar */}
      <aside style={{ width:200, background:'#0f0f0f', borderRight:'1px solid #1e1e1e', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'18px 16px 14px', borderBottom:'1px solid #1e1e1e' }}>
          <div style={{ fontSize:18, fontWeight:800, color:'#f5a623' }}>
            Heed<span style={{ color:'#fff' }}>Hive</span>
          </div>
          <div style={{ fontSize:10, color:'#444', marginTop:2 }}>HR Management System</div>
        </div>

        <nav style={{ flex:1, padding:'12px 8px' }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
              borderRadius:8, fontSize:13, marginBottom:2, textDecoration:'none',
              color: isActive ? '#f5a623' : '#888',
              background: isActive ? '#1e1800' : 'transparent',
            })}>
              <span style={{ fontSize:15 }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding:'12px 8px', borderTop:'1px solid #1e1e1e' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'#1a1a1a', borderRadius:8, marginBottom:6 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#f5a623', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#0a0a0a', flexShrink:0 }}>HR</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'#ccc' }}>HR Admin</div>
              <div style={{ fontSize:10, color:'#555' }}>Administrator</div>
            </div>
          </div>
          <button onClick={logout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, fontSize:13, color:'#888', background:'transparent', border:'none', cursor:'pointer', width:'100%' }}>
            <span style={{ fontSize:14 }}>↩</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        <Outlet />
      </main>
    </div>
  )
}
