import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from 'chart.js'
import api from '../utils/api'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

const STATUS_COLORS = { present:'#4ade80', absent:'#f87171', wfh:'#818cf8', half:'#fb923c', not_marked:'#555' }

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
      <div style={{ fontSize:11, color:'#666', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:700, color: color || '#fff' }}>{value}</div>
      <div style={{ fontSize:11, color:'#555', marginTop:3 }}>{sub}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  return (
    <span style={{ fontSize:11, padding:'3px 9px', borderRadius:20, fontWeight:500, background: STATUS_COLORS[status]+'22', color: STATUS_COLORS[status], border:`1px solid ${STATUS_COLORS[status]}44` }}>
      {status?.charAt(0).toUpperCase() + status?.slice(1).replace('_', ' ')}
    </span>
  )
}

export default function Dashboard() {
  const [todayData, setTodayData] = useState([])
  const [stats,     setStats]     = useState({})
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/attendance/today'),
      api.get('/attendance/stats'),
    ]).then(([todayRes, statsRes]) => {
      setTodayData(todayRes.data)
      setStats(statsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const present = todayData.filter(r => r.status === 'present' || r.status === 'wfh').length
  const absent  = todayData.filter(r => r.status === 'absent').length
  const wfh     = todayData.filter(r => r.status === 'wfh').length
  const half    = todayData.filter(r => r.status === 'half').length

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Attendance %',
      data: [78, 82, 75, stats.attendance_rate || 80],
      borderColor: '#f5a623',
      backgroundColor: 'rgba(245,166,35,0.06)',
      borderWidth: 2,
      pointBackgroundColor: '#f5a623',
      pointRadius: 4,
      tension: 0.35,
      fill: true,
    }]
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })

  function exportCSV() {
    const rows = [['Employee','Department','Status']]
    todayData.forEach(r => rows.push([r.employee_name, r.department || '', r.status]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `heedhive_attendance_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  if (loading) return <div style={{ padding:40, color:'#555' }}>Loading dashboard...</div>

  return (
    <div>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid #1e1e1e', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'#0a0a0a', zIndex:10 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>Dashboard</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:11, color:'#555' }}>{today}</span>
          <span style={{ background:'#1e1800', color:'#f5a623', fontSize:11, padding:'3px 10px', borderRadius:20, border:'1px solid #3a2a00' }}>⬡ Heedhive Agency</span>
        </div>
      </div>

      <div style={{ padding:'16px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
          <MetricCard label="Total Employees" value={todayData.length} sub="Active headcount" />
          <MetricCard label="Present Today"   value={present}          sub={`${wfh} remote / WFH`}   color="#4ade80" />
          <MetricCard label="Absent Today"    value={absent}           sub={`${half} on half-day`}    color="#f87171" />
          <MetricCard label="30-Day Rate"     value={`${stats.attendance_rate || 0}%`} sub="Overall attendance" color="#f5a623" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:12, marginBottom:18 }}>
          <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#666', marginBottom:14, textTransform:'uppercase', letterSpacing:.6 }}>Weekly Trend</div>
            <div style={{ position:'relative', height:170 }}>
              <Line data={chartData} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ y:{ min:50, max:100, ticks:{color:'#555',font:{size:11},callback:v=>v+'%'}, grid:{color:'rgba(255,255,255,0.04)'}, border:{display:false} }, x:{ ticks:{color:'#555',font:{size:11}}, grid:{display:false}, border:{display:false} } } }} />
            </div>
          </div>
          <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#666', marginBottom:14, textTransform:'uppercase', letterSpacing:.6 }}>Attendance Breakdown</div>
            {[['Present', stats.present||0,'#4ade80'],['WFH',stats.wfh||0,'#818cf8'],['Absent',stats.absent||0,'#f87171'],['Half-day',stats.half||0,'#fb923c']].map(([l,v,c])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ color:'#666', width:68, fontSize:11 }}>{l}</span>
                <div style={{ flex:1, height:6, background:'#1e1e1e', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ width:`${stats.total ? Math.round((v/stats.total)*100) : 0}%`, height:'100%', background:c, borderRadius:3 }} />
                </div>
                <span style={{ color:'#888', width:24, textAlign:'right', fontSize:11 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#666', textTransform:'uppercase', letterSpacing:.6 }}>Today's Snapshot</div>
            <button onClick={exportCSV} style={{ background:'transparent', border:'1px solid #2a2a2a', borderRadius:7, color:'#888', fontSize:12, padding:'6px 12px', cursor:'pointer', fontFamily:'inherit' }}>↓ Export CSV</button>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>{['Employee','Department','Status','Role'].map(h => <th key={h} style={{ color:'#555', fontWeight:500, fontSize:11, textTransform:'uppercase', letterSpacing:.5, padding:'0 12px 10px', textAlign:'left' }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {todayData.map(r => (
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
                    <td style={{ padding:'10px 12px' }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding:'10px 12px', color:'#555', fontSize:12 }}>{r.role}</td>
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
