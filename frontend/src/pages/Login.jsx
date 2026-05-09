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

  const inp = { width:'100%', background:'#1e1e1e', border:'1px solid #2a2a2a', borderRadius:8, padding:'10px 12px', color:'#e5e5e5', fontSize:14, outline:'none', fontFamily:'inherit', marginBottom:14, boxSizing:'border-box' }

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0a0a0a', padding:'2rem' }}>
      <div style={{ background:'#141414', border:'1px solid #2a2a2a', borderRadius:16, padding:'2.5rem 2rem', width:'100%', maxWidth:380 }}>
        <div style={{ fontSize:22, fontWeight:800, color:'#f5a623', marginBottom:4 }}>
          Heed<span style={{ color:'#fff' }}>Hive</span>
        </div>
        <div style={{ fontSize:12, color:'#666', marginBottom:'2rem' }}>HR & Attendance Management Portal</div>

        <form onSubmit={handleLogin}>
          <label style={{ fontSize:12, color:'#888', marginBottom:6, display:'block' }}>Work Email</label>
          <input style={inp} type="email" placeholder="hr@heedhive.in" value={email} onChange={e => setEmail(e.target.value)} required />

          <label style={{ fontSize:12, color:'#888', marginBottom:6, display:'block' }}>Password</label>
          <input style={inp} type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} required />

          {error && <div style={{ color:'#f87171', fontSize:12, marginBottom:12 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ width:'100%', background:'#f5a623', color:'#0a0a0a', border:'none', borderRadius:8, padding:11, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
