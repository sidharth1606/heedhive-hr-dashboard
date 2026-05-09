import { useState, useEffect } from 'react'
import api from '../utils/api'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [search,    setSearch]    = useState('')
  const [dept,      setDept]      = useState('All')
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [depts,     setDepts]     = useState([])
  const [form,      setForm]      = useState({ name:'', email:'', role:'', department_id:'', phone:'', join_date:'' })
  const [saving,    setSaving]    = useState(false)
  const [message,   setMessage]   = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/employees/'),
      api.get('/employees/departments'),
    ]).then(([empRes, deptRes]) => {
      setEmployees(empRes.data)
      setDepts(deptRes.data)
    }).finally(() => setLoading(false))
  }, [])

  async function addEmployee(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.post('/employees/', form)
      setEmployees(prev => [...prev, res.data])
      setShowForm(false)
      setForm({ name:'', email:'', role:'', department_id:'', phone:'', join_date:'' })
      setMessage('Employee added!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error adding employee')
    } finally {
      setSaving(false)
    }
  }

  const filtered = employees.filter(e => {
    const ms = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
    const md = dept === 'All' || e.department === dept
    return ms && md
  })

  const deptNames = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))]

  const inp = { background:'#1e1e1e', border:'1px solid #2a2a2a', borderRadius:8, padding:'9px 12px', color:'#e5e5e5', fontSize:13, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box' }

  if (loading) return <div style={{ padding:40, color:'#555' }}>Loading employees...</div>

  return (
    <div>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid #1e1e1e', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'#0a0a0a', zIndex:10 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>Employees</div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {message && <span style={{ fontSize:12, color:'#4ade80' }}>{message}</span>}
          <button onClick={() => setShowForm(!showForm)} style={{ background:'#f5a623', border:'none', borderRadius:7, color:'#0a0a0a', fontSize:12, fontWeight:700, padding:'6px 16px', cursor:'pointer', fontFamily:'inherit' }}>
            {showForm ? '✕ Cancel' : '+ Add Employee'}
          </button>
        </div>
      </div>

      <div style={{ padding:'16px 20px' }}>

        {/* Add Employee Form */}
        {showForm && (
          <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'16px', marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#666', marginBottom:14, textTransform:'uppercase', letterSpacing:.6 }}>New Employee</div>
            <form onSubmit={addEmployee}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <label style={{ fontSize:11, color:'#666', display:'block', marginBottom:5 }}>Full Name *</label>
                  <input style={inp} placeholder="Arjun Mehta" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div>
                  <label style={{ fontSize:11, color:'#666', display:'block', marginBottom:5 }}>Work Email *</label>
                  <input style={inp} type="email" placeholder="arjun@heedhive.in" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
                <div>
                  <label style={{ fontSize:11, color:'#666', display:'block', marginBottom:5 }}>Role *</label>
                  <input style={inp} placeholder="SEO Analyst" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required />
                </div>
                <div>
                  <label style={{ fontSize:11, color:'#666', display:'block', marginBottom:5 }}>Department *</label>
                  <select style={{...inp, cursor:'pointer'}} value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})} required>
                    <option value="">Select department</option>
                    {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:11, color:'#666', display:'block', marginBottom:5 }}>Phone</label>
                  <input style={inp} placeholder="9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label style={{ fontSize:11, color:'#666', display:'block', marginBottom:5 }}>Join Date</label>
                  <input style={inp} type="date" value={form.join_date} onChange={e => setForm({...form, join_date: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={saving} style={{ background:'#f5a623', border:'none', borderRadius:7, color:'#0a0a0a', fontSize:13, fontWeight:700, padding:'8px 20px', cursor:'pointer', fontFamily:'inherit', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Adding...' : 'Add Employee'}
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center' }}>
          <input
            style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:7, padding:'7px 12px', color:'#e5e5e5', fontSize:13, outline:'none', fontFamily:'inherit', width:200 }}
            placeholder="Search name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:7, padding:'7px 10px', color:'#888', fontSize:12, outline:'none', fontFamily:'inherit', cursor:'pointer' }}
            value={dept}
            onChange={e => setDept(e.target.value)}
          >
            {deptNames.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
          </select>
          <span style={{ color:'#555', fontSize:12, marginLeft:'auto' }}>{filtered.length} of {employees.length} employees</span>
        </div>

        {/* Table */}
        <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>
                  {['Name','Role','Department','Email','Phone','Joined','Status'].map(h =>
                    <th key={h} style={{ color:'#555', fontWeight:500, fontSize:11, textTransform:'uppercase', letterSpacing:.5, padding:'0 12px 10px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} style={{ borderTop:'1px solid #1a1a1a' }}>
                    <td style={{ padding:'10px 12px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:28, height:28, borderRadius:'50%', background: e.avatar_color||'#f5a623', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#0a0a0a', flexShrink:0 }}>
                          {e.name?.split(' ').map(p=>p[0]).join('').toUpperCase().substring(0,2)}
                        </div>
                        <span style={{ fontWeight:500 }}>{e.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'10px 12px', color:'#888', fontSize:12 }}>{e.role}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ background:'#1e1e1e', color:'#888', fontSize:11, padding:'3px 8px', borderRadius:6 }}>{e.department}</span>
                    </td>
                    <td style={{ padding:'10px 12px', color:'#555', fontSize:12 }}>{e.email}</td>
                    <td style={{ padding:'10px 12px', color:'#555', fontSize:12 }}>{e.phone || '—'}</td>
                    <td style={{ padding:'10px 12px', color:'#555', fontSize:12 }}>
                      {e.join_date ? new Date(e.join_date).toLocaleDateString('en-IN', { month:'short', year:'numeric' }) : '—'}
                    </td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:11, padding:'3px 9px', borderRadius:20, fontWeight:500, background: e.status==='active' ? '#0d2e1a' : '#2e0d0d', color: e.status==='active' ? '#4ade80' : '#f87171', border:`1px solid ${e.status==='active' ? '#143d22' : '#3d1414'}` }}>
                        {e.status?.charAt(0).toUpperCase() + e.status?.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
