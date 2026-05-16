import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useStore } from '../store.js'

const COLORS = ['#6366F1', '#F97316', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1A2235', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10, padding: '10px 14px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: 'var(--font-body)', fontWeight: 700,
    }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#FB923C', fontSize: '1rem' }}>{payload[0].value} {payload[0].name === 'minutes' ? 'min' : 'XP'}</div>
    </div>
  )
}

const MiniCard = ({ emoji, label, value, color, delay = 0 }) => (
  <div className="card animate-pop-in" style={{ padding: '18px', textAlign: 'center', animationDelay: `${delay}ms` }}>
    <div style={{ fontSize: 26, marginBottom: 6 }}>{emoji}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
    <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</div>
  </div>
)

export default function Progress() {
  const { weekData, currentStreak, todayMinutes, weeklyMinutes, weeklyGoal, subjects, openPaywall, user } = useStore()
  const [activeChart, setActiveChart] = useState('minutes')

  const subjectData = subjects.map((s, i) => ({
    name: s.label, value: Math.floor(Math.random() * 60 + 10), color: COLORS[i],
  }))

  const consistencyScore = Math.min(100, Math.round((currentStreak / 30) * 100))
  const bestDay = Math.max(...weekData.map(d => d.minutes))
  const dailyAvg = Math.round(weeklyMinutes / 7)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: 'slide-up 0.4s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.4px' }}>📊 Your Progress</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.92rem' }}>See how far you've come. Every minute counts.</p>
      </div>

      {/* Summary mini cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 22 }}>
        <MiniCard emoji="📅" label="This Week" value={`${weeklyMinutes}m`} color="#FB923C" delay={0} />
        <MiniCard emoji="🎯" label="Consistency" value={`${consistencyScore}%`} color="#34D399" delay={80} />
        <MiniCard emoji="⭐" label="Best Day" value={`${bestDay}m`} color="#818CF8" delay={160} />
        <MiniCard emoji="📈" label="Daily Avg" value={`${dailyAvg}m`} color="#60A5FA" delay={240} />
      </div>

      {/* Weekly Chart */}
      <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#F1F5F9' }}>📈 Weekly Activity</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {['minutes', 'xp'].map(c => (
              <button key={c} onClick={() => setActiveChart(c)} style={{
                padding: '5px 14px', borderRadius: 99,
                background: activeChart === c ? 'linear-gradient(135deg, #F97316, #FBBF24)' : 'rgba(255,255,255,0.06)',
                color: activeChart === c ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeChart === c ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>{c === 'minutes' ? '⏱ Time' : '⚡ XP'}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={weekData} barSize={32}>
            <XAxis dataKey="day" tick={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)', radius: 8 }} />
            <Bar dataKey={activeChart} name={activeChart} radius={[8, 8, 0, 0]}>
              {weekData.map((_, i) => (
                <Cell key={i} fill={i === new Date().getDay() - 1 ? '#F97316' : 'rgba(99,102,241,0.4)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Subject Breakdown */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 18, color: '#F1F5F9' }}>🎯 Subject Breakdown</h3>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <PieChart width={150} height={150}>
              <Pie data={subjectData} cx={70} cy={70} innerRadius={40} outerRadius={68} dataKey="value" strokeWidth={0}>
                {subjectData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
            </PieChart>
          </div>
          {subjectData.map(({ name, value, color }) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{name}</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{value}m</span>
            </div>
          ))}
        </div>

        {/* Streak calendar */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: 14, color: '#F1F5F9' }}>🔥 Streak Calendar</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', paddingBottom: 4 }}>{d}</div>
            ))}
            {[...Array(28)].map((_, i) => {
              const studied = i < currentStreak || (i > 10 && Math.random() > 0.3)
              const isToday = i === 20
              return (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: 6,
                  background: isToday ? '#F97316' : studied ? 'rgba(249,115,22,0.22)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isToday ? '#F97316' : studied ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem',
                }}>
                  {isToday && <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.6rem' }}>▲</span>}
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: 'rgba(249,115,22,0.22)', border: '1px solid rgba(249,115,22,0.3)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Studied</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 4, background: '#F97316' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Upsell */}
      {user.plan === 'free' && (
        <div className="card" style={{
          padding: '28px', textAlign: 'center',
          background: 'linear-gradient(145deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
          border: '1px solid rgba(99,102,241,0.2)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🔒</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: '#818CF8' }}>Advanced Analytics</h3>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem', marginBottom: 18, lineHeight: 1.6 }}>
            Unlock peak study hour analysis, subject mastery scores, and 6-month trend reports with Pro.
          </p>
          <button className="btn btn-indigo" onClick={() => openPaywall('Advanced Analytics')} style={{ margin: '0 auto', padding: '11px 28px', fontSize: '0.92rem' }}>
            👑 Unlock Pro Analytics
          </button>
        </div>
      )}
    </div>
  )
}
