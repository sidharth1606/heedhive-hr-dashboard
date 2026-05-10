import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

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
      minHeight:'100vh', background:'#000000', padding:'2rem',
    }}>
      <div style={{ position:'relative', width:'100%', maxWidth:400 }}>
        {/* Gold glow */}
        <div style={{
          position:'absolute', inset:-1, borderRadius:18,
          background:'linear-gradient(135deg, #f5a623, #c47d0a, #f5a623)',
          opacity:0.2, filter:'blur(10px)',
        }} />

        <div style={{
          position:'relative', background:'#0a0a0a',
          border:'1.5px solid #f5a623', borderRadius:16,
          padding:'2.8rem 2.2rem',
          boxShadow:'0 0 40px rgba(245,166,35,0.1)',
        }}>
          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:'1.8rem' }}>
            <div style={{ fontSize:34, fontWeight:900, letterSpacing:'-1px', color:'#f5a623' }}>
              HeedHive
            </div>
            <div style={{ width:48, height:2, background:'linear-gradient(90deg,#f5a623,#c47d0a)', borderRadius:2, margin:'10px auto' }} />
            <div style={{ fontSize:13, color:'#ffffff', fontWeight:500, letterSpacing:'0.5px' }}>
              HR & Attendance Portal
            </div>
          </div>

          {/* Email */}
          <label style={{ fontSize:11, color:'#f5a623', fontWeight:600, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.8px' }}>
            Work Email
          </label>
          <input
            type="email" placeholder="hr@heedhive.in" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{ width:'100%', background:'#111', border:'1px solid #2a2a2a', borderRadius:8, padding:'11px 14px', color:'#ffffff', fontSize:14, outline:'none', fontFamily:'inherit', marginBottom:16, boxSizing:'border-box' }}
            onFocus={e => e.target.style.borderColor='#f5a623'}
            onBlur={e => e.target.style.borderColor='#2a2a2a'}
          />

          {/* Password */}
          <label style={{ fontSize:11, color:'#f5a623', fontWeight:600, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.8px' }}>
            Password
          </label>
          <input
            type="password" placeholder="Enter your password" value={password}
            onChange={e => setPassword(e.target.value)} required
            onKeyDown={e => e.key==='Enter' && handleLogin(e)}
            style={{ width:'100%', background:'#111', border:'1px solid #2a2a2a', borderRadius:8, padding:'11px 14px', color:'#ffffff', fontSize:14, outline:'none', fontFamily:'inherit', marginBottom:20, boxSizing:'border-box' }}
            onFocus={e => e.target.style.borderColor='#f5a623'}
            onBlur={e => e.target.style.borderColor='#2a2a2a'}
          />

          {error && <div style={{ color:'#f87171', fontSize:12, marginBottom:14, textAlign:'center' }}>{error}</div>}

          {/* Sign In Button */}
          <button
            onClick={handleLogin} disabled={loading}
            style={{
              width:'100%', background:'linear-gradient(135deg, #f5a623, #c47d0a)',
              color:'#000000', border:'none', borderRadius:8, padding:'13px',
              fontSize:15, fontWeight:800, cursor: loading ? 'not-allowed':'pointer',
              fontFamily:'inherit', letterSpacing:'0.5px',
              boxShadow:'0 4px 20px rgba(245,166,35,0.35)',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ textAlign:'center', marginTop:'1.6rem', fontSize:11, color:'#333' }}>
            © 2025 <span style={{ color:'#f5a623' }}>Heedhive Agency</span> · All rights reserved
          </div>
        </div>
      </div>
    </div>
  )
}