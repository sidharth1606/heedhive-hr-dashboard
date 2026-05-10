import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const GOLD = '#FFD700'
const GOLD2 = '#FFA500'
const GOLD3 = '#FFEC6E'
const GOLD_GLOW = 'rgba(255,215,0,0.55)'
const GOLD_DIM  = 'rgba(255,215,0,0.15)'

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
      background:'radial-gradient(ellipse at center, #1a1400 0%, #000000 70%)',
      padding:'2rem',
    }}>
      <div style={{ position:'relative', width:'100%', maxWidth:420 }}>

        {/* Outer gold glow ring */}
        <div style={{
          position:'absolute', inset:-3, borderRadius:22,
          background:`linear-gradient(135deg, ${GOLD}, ${GOLD2}, ${GOLD3}, ${GOLD2}, ${GOLD})`,
          opacity:0.7, filter:'blur(14px)', zIndex:0,
        }} />

        {/* Card */}
        <div style={{
          position:'relative', zIndex:1,
          background:'linear-gradient(160deg, #0d0d0d 0%, #111 100%)',
          border:`1.5px solid ${GOLD}`,
          borderRadius:18,
          padding:'3rem 2.4rem',
          boxShadow:`0 0 60px ${GOLD_DIM}, inset 0 1px 0 rgba(255,215,0,0.1)`,
        }}>

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{
              fontSize:38, fontWeight:900, letterSpacing:'-1px',
              background:`linear-gradient(180deg, ${GOLD3} 0%, ${GOLD} 50%, ${GOLD2} 100%)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              filter:`drop-shadow(0 0 12px ${GOLD_GLOW})`,
            }}>
              HeedHive
            </div>
            {/* Shiny divider */}
            <div style={{
              width:60, height:2, margin:'12px auto 10px',
              background:`linear-gradient(90deg, transparent, ${GOLD3}, ${GOLD}, ${GOLD3}, transparent)`,
              boxShadow:`0 0 8px ${GOLD_GLOW}`,
              borderRadius:2,
            }} />
            <div style={{ fontSize:13, color:'#ffffff', fontWeight:400, letterSpacing:'1px', opacity:0.9 }}>
              HR &amp; Attendance Portal
            </div>
          </div>

          {/* Email */}
          <label style={{
            fontSize:11, fontWeight:700, display:'block', marginBottom:7,
            textTransform:'uppercase', letterSpacing:'1.2px',
            background:`linear-gradient(90deg, ${GOLD}, ${GOLD3})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            Work Email
          </label>
          <input
            type="email" placeholder="hr@heedhive.in" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{
              width:'100%', background:'#0a0a0a',
              border:`1px solid #2a2a2a`,
              borderRadius:9, padding:'12px 14px', color:'#ffffff',
              fontSize:14, outline:'none', fontFamily:'inherit',
              marginBottom:18, boxSizing:'border-box',
              transition:'border-color .2s, box-shadow .2s',
            }}
            onFocus={e => { e.target.style.borderColor=GOLD; e.target.style.boxShadow=`0 0 10px ${GOLD_DIM}` }}
            onBlur={e => { e.target.style.borderColor='#2a2a2a'; e.target.style.boxShadow='none' }}
          />

          {/* Password */}
          <label style={{
            fontSize:11, fontWeight:700, display:'block', marginBottom:7,
            textTransform:'uppercase', letterSpacing:'1.2px',
            background:`linear-gradient(90deg, ${GOLD}, ${GOLD3})`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            Password
          </label>
          <input
            type="password" placeholder="Enter your password" value={password}
            onChange={e => setPassword(e.target.value)} required
            onKeyDown={e => e.key==='Enter' && handleLogin(e)}
            style={{
              width:'100%', background:'#0a0a0a',
              border:`1px solid #2a2a2a`,
              borderRadius:9, padding:'12px 14px', color:'#ffffff',
              fontSize:14, outline:'none', fontFamily:'inherit',
              marginBottom:22, boxSizing:'border-box',
              transition:'border-color .2s, box-shadow .2s',
            }}
            onFocus={e => { e.target.style.borderColor=GOLD; e.target.style.boxShadow=`0 0 10px ${GOLD_DIM}` }}
            onBlur={e => { e.target.style.borderColor='#2a2a2a'; e.target.style.boxShadow='none' }}
          />

          {error && <div style={{ color:'#f87171', fontSize:12, marginBottom:14, textAlign:'center' }}>{error}</div>}

          {/* Sign In Button */}
          <button
            onClick={handleLogin} disabled={loading}
            style={{
              width:'100%',
              background:`linear-gradient(135deg, ${GOLD3} 0%, ${GOLD} 40%, ${GOLD2} 100%)`,
              color:'#000000', border:'none', borderRadius:9, padding:'14px',
              fontSize:15, fontWeight:900, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily:'inherit', letterSpacing:'1px',
              boxShadow:`0 4px 24px ${GOLD_GLOW}, 0 0 0 1px rgba(255,215,0,0.2)`,
              opacity: loading ? 0.75 : 1,
              transition:'box-shadow .2s, transform .1s',
              textShadow:'0 1px 2px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => { if(!loading){ e.target.style.boxShadow=`0 6px 32px ${GOLD_GLOW}, 0 0 0 1px ${GOLD}`; e.target.style.transform='translateY(-1px)' }}}
            onMouseLeave={e => { e.target.style.boxShadow=`0 4px 24px ${GOLD_GLOW}, 0 0 0 1px rgba(255,215,0,0.2)`; e.target.style.transform='none' }}
          >
            {loading ? 'Signing in...' : '✦ Sign In'}
          </button>

          <div style={{ textAlign:'center', marginTop:'1.8rem', fontSize:11, color:'#444' }}>
            © 2025 <span style={{ color:GOLD, filter:`drop-shadow(0 0 4px ${GOLD_GLOW})` }}>Heedhive Agency</span> · All rights reserved
          </div>
        </div>
      </div>
    </div>
  )
}