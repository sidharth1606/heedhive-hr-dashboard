import { useState, useEffect } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'
import api from '../utils/api'

ChartJS.register(ArcElement, BarElement, LinearScale, CategoryScale, Tooltip, Legend)

const PERF_GRADE = r => r >= 90 ? ['Excellent','#4ade80'] : r >= 75 ? ['Good','#f5a623'] : r >= 60 ? ['Average','#fb923c'] : ['Poor','#f87171']

export default function Analytics() {
  const [stats,     setStats]     = useState({})
  const [employees, setEmployees] = useState([])
  const [attMap,    setAttMap]    = useState({})
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const from = new Date(Date.now() - 30*24*60*60*1000).toISOString().slice(0,10)
    const to   = new Date().toISOString().slice(0,10)
    Promise.all([
      api.get(`/attendance/stats?from_date=${from}&to_date=${to}`),
      api.get('/employees/'),
      api.get(`/attendance/?from_date=${from}&to_date=${to}`),
    ]).then(([statsRes, empRes, attRes]) => {
      setStats(statsRes.data)
      setEmployees(empRes.data)
      // build per-employee count map
      const map = {}
      attRes.data.forEach(r => {
        if (!map[r.employee_id]) map[r.employee_id] = { present:0, absent:0, wfh:0, half:0, total:0 }
        map[r.employee_id][r.status] = (map[r.employee_id][r.status] || 0) + 1
        map[r.employee_id].total++
      })
      setAttMap(map)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding:40, color:'#555' }}>Loading analytics...</div>

  const donutData = {
    labels: ['Present','WFH','Absent','Half-day'],
    datasets: [{
      data: [stats.present||0, stats.wfh||0, stats.absent||0, stats.half||0],
      backgroundColor: ['#4ade80','#818cf8','#f87171','#fb923c'],
      borderWidth: 0, hoverOffset: 4,
    }]
  }

  // dept breakdown
  const deptGroups = {}
  employees.forEach(e => {
    if (!deptGroups[e.department]) deptGroups[e.department] = { p:0, tot:0 }
    const em = attMap[e.id] || {}
    deptGroups[e.department].p   += (em.present||0) + (em.wfh||0)
    deptGroups[e.department].tot += em.total || 0
  })
  const deptLabels = Object.keys(deptGroups)
  const deptRates  = deptLabels.map(d => deptGroups[d].tot ? Math.round((deptGroups[d].p / deptGroups[d].tot)*100) : 0)

  const barData = {
    labels: deptLabels,
    datasets: [{
      label: 'Attendance %',
      data: deptRates,
      backgroundColor: ['#f5a623','#818cf8','#4ade80','#38bdf8','#fb923c'],
      borderRadius: 4, borderWidth: 0,
    }]
  }

  const chartOpts = (min=0,max=100) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display:false } },
    scales: {
      y: { min, max, ticks:{ color:'#555', font:{size:10}, callback: v=>v+'%' }, grid:{ color:'rgba(255,255,255,0.04)' }, border:{display:false} },
      x: { ticks:{ color:'#555', font:{size:11} }, grid:{display:false}, border:{display:false} }
    }
  })

  return (
    <div>
      <div style={{ padding:'14px 20px', borderBottom:'1px solid #1e1e1e', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'#0a0a0a', zIndex:10 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>Analytics</div>
        <span style={{ fontSize:11, color:'#555' }}>Last 30 days</span>
      </div>

      <div style={{ padding:'16px 20px' }}>

        {/* KPI Row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:18 }}>
          {[
            ['Overall Rate',  `${stats.attendance_rate||0}%`, '#f5a623'],
            ['Total Records', stats.total||0,                  '#fff'],
            ['Avg Present',   `${stats.present||0}d`,          '#4ade80'],
            ['Avg Absent',    `${stats.absent||0}d`,           '#f87171'],
          ].map(([l,v,c]) => (
            <div key={l} style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
              <div style={{ fontSize:11, color:'#666', marginBottom:6 }}>{l}</div>
              <div style={{ fontSize:22, fontWeight:700, color:c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:12, marginBottom:18 }}>
          <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#666', marginBottom:14, textTransform:'uppercase', letterSpacing:.6 }}>Attendance Breakdown</div>
            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
              <div style={{ position:'relative', height:160, width:160, flexShrink:0 }}>
                <Doughnut data={donutData} options={{ responsive:true, maintainAspectRatio:false, cutout:'65%', plugins:{ legend:{display:false} } }} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[['Present',stats.present||0,'#4ade80'],['WFH',stats.wfh||0,'#818cf8'],['Absent',stats.absent||0,'#f87171'],['Half-day',stats.half||0,'#fb923c']].map(([l,v,c]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                    <div style={{ width:9, height:9, borderRadius:'50%', background:c, flexShrink:0 }} />
                    <span style={{ color:'#888' }}>{l}</span>
                    <span style={{ marginLeft:'auto', paddingLeft:16, color:'#e5e5e5', fontWeight:600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#666', marginBottom:14, textTransform:'uppercase', letterSpacing:.6 }}>Department Comparison</div>
            <div style={{ position:'relative', height:160 }}>
              <Bar data={barData} options={chartOpts(0,100)} />
            </div>
          </div>
        </div>

        {/* Individual Performance Table */}
        <div style={{ background:'#141414', border:'1px solid #1e1e1e', borderRadius:10, padding:'14px 16px' }}>
          <div style={{ fontSize:11, fontWeight:600, color:'#666', marginBottom:14, textTransform:'uppercase', letterSpacing:.6 }}>Individual Performance (30 Days)</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>
                  {['Employee','Dept','Present','WFH','Absent','Half','Rate','Grade'].map(h =>
                    <th key={h} style={{ color:'#555', fontWeight:500, fontSize:11, textTransform:'uppercase', letterSpacing:.5, padding:'0 12px 10px', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {employees.map(e => {
                  const em = attMap[e.id] || { present:0, absent:0, wfh:0, half:0, total:1 }
                  const rate = em.total ? Math.round(((em.present + em.wfh + em.half * 0.5) / em.total) * 100) : 0
                  const [grade, gc] = PERF_GRADE(rate)
                  return (
                    <tr key={e.id} style={{ borderTop:'1px solid #1a1a1a' }}>
                      <td style={{ padding:'10px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <div style={{ width:26, height:26, borderRadius:'50%', background: e.avatar_color||'#f5a623', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#0a0a0a', flexShrink:0 }}>
                            {e.name?.split(' ').map(p=>p[0]).join('').toUpperCase().substring(0,2)}
                          </div>
                          {e.name}
                        </div>
                      </td>
                      <td style={{ padding:'10px 12px' }}><span style={{ background:'#1e1e1e', color:'#888', fontSize:11, padding:'3px 8px', borderRadius:6 }}>{e.department}</span></td>
                      <td style={{ padding:'10px 12px', color:'#4ade80', fontWeight:600 }}>{em.present}</td>
                      <td style={{ padding:'10px 12px', color:'#818cf8', fontWeight:600 }}>{em.wfh}</td>
                      <td style={{ padding:'10px 12px', color:'#f87171', fontWeight:600 }}>{em.absent}</td>
                      <td style={{ padding:'10px 12px', color:'#fb923c', fontWeight:600 }}>{em.half}</td>
                      <td style={{ padding:'10px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ flex:1, background:'#1e1e1e', borderRadius:3, height:4, overflow:'hidden' }}>
                            <div style={{ width:`${rate}%`, height:'100%', background:gc, borderRadius:3 }} />
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:gc, width:34 }}>{rate}%</span>
                        </div>
                      </td>
                      <td style={{ padding:'10px 12px' }}>
                        <span style={{ fontSize:11, padding:'3px 9px', borderRadius:20, fontWeight:500, background:`${gc}22`, color:gc, border:`1px solid ${gc}44` }}>
                          {grade}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
