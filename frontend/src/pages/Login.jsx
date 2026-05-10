import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

// Match exact Heedhive logo gold
const GOLD  = '#C9A84C'
const GOLD2 = '#E8C96A'
const GOLD3 = '#A07830'
const GLOW  = 'rgba(201,168,76,0.5)'
const GLOW_DIM = 'rgba(201,168,76,0.15)'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('hh_token', res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center',
      minHeight:'100vh',
      background:'radial-gradient(ellipse at center, #110e00 0%, #000000 70%)',
      padding:'2rem',
    }}>
      <div style={{ position:'relative', width:'100%', maxWidth:420 }}>

        {/* Outer gold glow */}
        <div style={{
          position:'absolute', inset:-4, borderRadius:22,
          background:`linear-gradient(135deg, ${GOLD3}, ${GOLD}, ${GOLD2}, ${GOLD}, ${GOLD3})`,
          opacity:0.5, filter:'blur(16px)', zIndex:0,
        }} />

        {/* Card */}
        <div style={{
          position:'relative', zIndex:1,
          background:'linear-gradient(160deg, #0c0c0c 0%, #111 100%)',
          border:`1.5px solid ${GOLD}`,
          borderRadius:18,
          padding:'2.8rem 2.4rem',
          boxShadow:`0 0 50px ${GLOW_DIM}, inset 0 1px 0 rgba(201,168,76,0.1)`,
        }}>

          {/* Logo + Name side by side */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:'1.8rem' }}>
            <img
              src="/logo.png"
              alt="Heedhive Logo"
              style={{
                width:90, height:90, borderRadius:'50%',
                objectFit:'cover', flexShrink:0,
                boxShadow:`0 0 24px ${GLOW}, 0 0 8px ${GLOW}`,
                border:`2px solid ${GOLD}`,
              }}
            />
            <div>
              <div style={{
                fontSize:28, fontWeight:900, letterSpacing:'1px',
                background:`linear-gradient(180deg, ${GOLD2} 0%, ${GOLD} 60%, ${GOLD3} 100%)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                lineHeight:1.1, textTransform:'uppercase',
              }}>
                HeedHive
              </div>
              <div style={{
                width:40, height:1.5, margin:'6px 0',
                background:`linear-gradient(90deg, ${GOLD}, transparent)`,
                boxShadow:`0 0 6px ${GLOW}`,
              }} />
              <div style={{ fontSize:11, color:'#ffffff', letterSpacing:'1.5px', textTransform:'uppercase', opacity:0.7 }}>
                HR &amp; Attendance Portal
              </div>
            </div>
          </div>

          {/* Email */}
          <label style={{
            fontSize:10, fontWeight:700, display:'block', marginBottom:7,
            textTransform:'uppercase', letterSpacing:'1.5px',
            background:`linear-gradient(90deg, ${GOLD}, ${GOLD2})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>Work Email</label>
          <input
            type="email" placeholder="hr@heedhive.in" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{
              width:'100%', background:'#080808', border:`1px solid #2a2a2a`,
              borderRadius:9, padding:'12px 14px', color:'#fff',
              fontSize:14, outline:'none', fontFamily:'inherit',
              marginBottom:18, boxSizing:'border-box', transition:'all .2s',
            }}
            onFocus={e => { e.target.style.borderColor=GOLD; e.target.style.boxShadow=`0 0 12px ${GLOW_DIM}` }}
            onBlur={e => { e.target.style.borderColor='#2a2a2a'; e.target.style.boxShadow='none' }}
          />

          {/* Password */}
          <label style={{
            fontSize:10, fontWeight:700, display:'block', marginBottom:7,
            textTransform:'uppercase', letterSpacing:'1.5px',
            background:`linear-gradient(90deg, ${GOLD}, ${GOLD2})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>Password</label>
          <input
            type="password" placeholder="Enter your password" value={password}
            onChange={e => setPassword(e.target.value)} required
            onKeyDown={e => e.key==='Enter' && handleLogin(e)}
            style={{
              width:'100%', background:'#080808', border:`1px solid #2a2a2a`,
              borderRadius:9, padding:'12px 14px', color:'#fff',
              fontSize:14, outline:'none', fontFamily:'inherit',
              marginBottom:22, boxSizing:'border-box', transition:'all .2s',
            }}
            onFocus={e => { e.target.style.borderColor=GOLD; e.target.style.boxShadow=`0 0 12px ${GLOW_DIM}` }}
            onBlur={e => { e.target.style.borderColor='#2a2a2a'; e.target.style.boxShadow='none' }}
          />

          {error && <div style={{ color:'#f87171', fontSize:12, marginBottom:14, textAlign:'center' }}>{error}</div>}

          {/* Sign In Button */}
          <button
            onClick={handleLogin} disabled={loading}
            style={{
              width:'100%',
              background:`linear-gradient(135deg, ${GOLD2} 0%, ${GOLD} 50%, ${GOLD3} 100%)`,
              color:'#000', border:'none', borderRadius:9, padding:'14px',
              fontSize:15, fontWeight:900, cursor: loading ? 'not-allowed':'pointer',
              fontFamily:'inherit', letterSpacing:'1.5px', textTransform:'uppercase',
              boxShadow:`0 4px 24px ${GLOW}, 0 0 0 1px rgba(201,168,76,0.3)`,
              opacity: loading ? 0.75 : 1, transition:'all .2s',
            }}
            onMouseEnter={e => { if(!loading){ e.target.style.boxShadow=`0 8px 32px ${GLOW}`; e.target.style.transform='translateY(-2px)' }}}
            onMouseLeave={e => { e.target.style.boxShadow=`0 4px 24px ${GLOW}`; e.target.style.transform='none' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ textAlign:'center', marginTop:'1.8rem', fontSize:11, color:'#3a3a3a', letterSpacing:'0.5px' }}>
            © 2025 <span style={{ color:GOLD }}>Heedhive Agency</span> · All rights reserved
          </div>
        </div>
      </div>
    </div>
  )
}