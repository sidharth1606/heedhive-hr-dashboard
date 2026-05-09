import { useState, useEffect } from 'react'
import api from '../utils/api'

const STATUS_OPTIONS = ['present','absent','wfh','half']
const STATUS_ABBR    = { present:'P', absent:'A', wfh:'W', half:'H' }
const STATUS_COLORS  = { present:'#4ade80', absent:'#f87171', wfh:'#818cf8', half:'#fb923c' }

export default function Attendance() {
  const [records,  setRecords]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [message,  setMessage]  = useState('')
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => { fetchToday() }, [])

  async function fetchToday() {
    setLoading(true)
    try {
      const res = await api.get('/attendance/today')
      setRecords(res.data)
    } finally {
      setLoading(false)
    }
  }

  function updateStatus(empId, status) {
    setRecords(prev => prev.map(r => r.employee_id === empId ? { ...r, status } : r))
  }

  async function saveAll() {
    setSaving(true)
    try {
      await api.post('/attendance/bulk-mark', {
        records: records.map(r => ({ employee_id: r.employee_id, date: today, status: r.status }))
      })
      setMessage('Attendance saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Error saving attendance')
    } finally {
      setSaving(false)
    }
  }

  function exportCSV() {
    const rows = [['Employee','Department','Date','Status']]
    records.forEach(r => rows.push([r.employee_name, r.department||'', today, r.status]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `attendance_${today}.csv`
    a.click()
  }

  if (loading) return <div style={{ padding:40, color:'#555' }}>Loading attendance...</div>

  const present = records.filter(r => r.status === 'present' || r.status === 'wfh').length

  return (
    <div>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid #1e1e1e', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'#0a0a0a', zIndex:10 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>Attendance</div>
        <div style={{ display:'flex', gap:10 }}>
          {message && <span style={{ fontSize:12, color:'#4ade80', padding:'6px 12px' }}>{message}</span>}
          <button onClick={exportCSV} style={{ background:'transparent', border:'1px solid #2a2a2a', borderRadius:7, color:'#888', fontSize:12, padding:'6px 12px', cursor:'pointer', fontFamily:'inherit' }}>↓ Export</button>
          <button onClick={saveAll} disabled={saving} style={{ background:'#f5a623', border:'none', borderRadius:7, color:'#0a0a0a', fontSize:12, fontWeight:700, padding:'6px 16px', cursor:'pointer', fontFamily:'inherit', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      <div style={{ padding:'16px 20px' }}>
        <div style={{ display:'flex', gap:12, marginBottom:18 }}>
          {[['Present / WFH', present, '#4ade80'], ['Absent', records.filter(r=>r.status==='absent').length, '#f87171'], ['Half-day', records.filter(r=>r.status==='half').length, '#fb923c']].map(([l,v,c]) => (
            <div key={l} style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'12px 16px', flex:1 }}>
              <div style={{ fontSize:11, color:'#666' }}>{l}</div>
              <div style={{ fontSize:20, fontWeight:700, color:c, marginTop:4 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#666', marginBottom:14, textTransform:'uppercase', letterSpacing:.6 }}>
            Mark Attendance — {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr>
                {['Employee','Department','Mark Status','Check In','Check Out'].map(h =>
                  <th key={h} style={{ color:'#555', fontWeight:500, fontSize:11, textTransform:'uppercase', letterSpacing:.5, padding:'0 12px 10px', textAlign:'left' }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {records.map(r => (
                <tr key={r.employee_id} style={{ borderTop:'1px solid #1a1a1a' }}>
                  <td style={{ padding:'10px 12px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:26, height:26, borderRadius:'50%', background: r.avatar_color||'#f5a623', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#0a0a0a', flexShrink:0 }}>
                        {r.employee_name?.split(' ').map(p=>p[0]).join('').toUpperCase().substring(0,2)}
                      </div>
                      {r.employee_name}
                    </div>
                  </td>
                  <td style={{ padding:'10px 12px' }}><span style={{ background:'#1e1e1e', color:'#888', fontSize:11, padding:'3px 8px', borderRadius:6 }}>{r.department}</span></td>
                  <td style={{ padding:'10px 12px' }}>
                    <div style={{ display:'flex', gap:4 }}>
                      {STATUS_OPTIONS.map(s => (
                        <button key={s} onClick={() => updateStatus(r.employee_id, s)} style={{
                          background: r.status === s ? STATUS_COLORS[s]+'22' : 'transparent',
                          border: `1px solid ${r.status === s ? STATUS_COLORS[s] : '#2a2a2a'}`,
                          borderRadius:6, color: r.status === s ? STATUS_COLORS[s] : '#555',
                          fontSize:11, padding:'4px 9px', cursor:'pointer', fontFamily:'inherit', fontWeight: r.status===s ? 700 : 400,
                        }}>
                          {STATUS_ABBR[s]}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding:'10px 12px', color:'#555', fontSize:12' }}>{r.check_in || '—'}</td>
                  <td style={{ padding:'10px 12px', color:'#555', fontSize:12' }}>{r.check_out || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
