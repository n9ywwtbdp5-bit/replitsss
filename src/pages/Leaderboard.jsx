import React, { useState, useMemo } from 'react'
import { useStore } from '../store.js'

const FAKE_PLAYERS = [
  { id: 'p1',  name: 'Priya S.',     avatar: '👩‍💻', weeklyXP: 3840, streak: 45, level: 12 },
  { id: 'p2',  name: 'James K.',     avatar: '👨‍🎓', weeklyXP: 3310, streak: 31, level: 11 },
  { id: 'p3',  name: 'Yuna L.',      avatar: '👩‍🔬', weeklyXP: 2980, streak: 28, level: 10 },
  { id: 'p4',  name: 'Carlos M.',    avatar: '👨‍💼', weeklyXP: 2540, streak: 19, level: 9  },
  { id: 'p5',  name: 'Ava T.',       avatar: '👩‍🎨', weeklyXP: 2200, streak: 22, level: 9  },
  { id: 'p6',  name: 'Ravi D.',      avatar: '👨‍🔬', weeklyXP: 1960, streak: 14, level: 8  },
  { id: 'p7',  name: 'Sophie W.',    avatar: '👩‍⚕️', weeklyXP: 1710, streak: 11, level: 7  },
  { id: 'p8',  name: 'Marcus J.',    avatar: '👨‍🏫', weeklyXP: 1490, streak: 9,  level: 7  },
  { id: 'p9',  name: 'Amara N.',     avatar: '👩‍💼', weeklyXP: 1250, streak: 8,  level: 6  },
  { id: 'p10', name: 'Leo C.',       avatar: '👨‍🎤', weeklyXP: 1080, streak: 7,  level: 6  },
  { id: 'p11', name: 'Nina R.',      avatar: '👩‍🏫', weeklyXP:  870, streak: 6,  level: 5  },
  { id: 'p12', name: 'Tom H.',       avatar: '👨‍🎓', weeklyXP:  640, streak: 5,  level: 4  },
  { id: 'p13', name: 'Fatima Z.',    avatar: '👩‍💻', weeklyXP:  490, streak: 4,  level: 4  },
  { id: 'p14', name: 'Ethan B.',     avatar: '👨‍⚕️', weeklyXP:  320, streak: 3,  level: 3  },
  { id: 'p15', name: 'Chloe P.',     avatar: '👩‍🔬', weeklyXP:  180, streak: 2,  level: 2  },
]

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' }
const RANK_COLORS = {
  1: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', text: '#FBBF24' },
  2: { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)', text: '#CBD5E1' },
  3: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)', text: '#FB923C' },
}

const FILTERS = ['This Week', 'This Month', 'All Time']

export default function Leaderboard() {
  const { user, weeklyXP, level, currentStreak } = useStore()
  const [filter, setFilter] = useState('This Week')
  const [showOnlyNearMe, setShowOnlyNearMe] = useState(false)

  const multiplier = filter === 'This Week' ? 1 : filter === 'This Month' ? 4.2 : 18.5

  const allPlayers = useMemo(() => {
    const me = {
      id: 'me',
      name: user.name,
      avatar: user.avatar,
      weeklyXP,
      streak: currentStreak,
      level,
      isMe: true,
    }
    const faked = FAKE_PLAYERS.map(p => ({
      ...p,
      weeklyXP: Math.round(p.weeklyXP * multiplier * (0.9 + Math.random() * 0.2)),
    }))
    return [...faked, me].sort((a, b) => b.weeklyXP - a.weeklyXP)
  }, [weeklyXP, user, level, currentStreak, multiplier])

  const myRank  = allPlayers.findIndex(p => p.isMe) + 1
  const maxXP   = allPlayers[0]?.weeklyXP || 1

  const displayed = showOnlyNearMe
    ? allPlayers.slice(Math.max(0, myRank - 4), Math.min(allPlayers.length, myRank + 3))
    : allPlayers

  const xpLabel = filter === 'This Week' ? 'weekly XP' : filter === 'This Month' ? 'monthly XP' : 'total XP'

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: 'slide-up 0.4s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.4px' }}>
          🏆 Leaderboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.92rem' }}>
          See how you stack up against other StudyStreak students.
        </p>
      </div>

      {/* My rank card */}
      <div style={{
        background: 'linear-gradient(135deg, #F97316, #FBBF24)',
        borderRadius: 18, padding: '22px 24px', marginBottom: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(249,115,22,0.4)',
        position: 'relative', overflow: 'hidden',
        animation: 'pop-in 0.4s var(--ease-bounce) both',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 140, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            border: '2px solid rgba(255,255,255,0.4)',
          }}>{user.avatar}</div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Your Ranking</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>
              #{myRank} {myRank <= 3 && MEDAL[myRank]}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 600, marginTop: 2 }}>
              out of {allPlayers.length} students
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', position: 'relative' }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 2 }}>Your {xpLabel}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {weeklyXP.toLocaleString()}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600, marginTop: 2 }}>⚡ XP</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 99,
              background: filter === f ? 'linear-gradient(135deg, #F97316, #FBBF24)' : 'var(--bg-glass)',
              color: filter === f ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${filter === f ? 'transparent' : 'var(--border-strong)'}`,
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer',
              transition: 'all 0.2s var(--ease-bounce)',
              boxShadow: filter === f ? '0 4px 12px rgba(249,115,22,0.35)' : 'none',
            }}>{f}</button>
          ))}
        </div>
        <button onClick={() => setShowOnlyNearMe(v => !v)} style={{
          padding: '7px 14px', borderRadius: 99,
          background: showOnlyNearMe ? 'rgba(99,102,241,0.18)' : 'var(--bg-glass)',
          color: showOnlyNearMe ? '#818CF8' : 'var(--text-secondary)',
          border: `1px solid ${showOnlyNearMe ? 'rgba(99,102,241,0.35)' : 'var(--border-strong)'}`,
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          {showOnlyNearMe ? '👁 Near Me' : '👁 Near Me'}
        </button>
      </div>

      {/* Leaderboard list */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Top 3 podium (only when not filtered) */}
        {!showOnlyNearMe && filter === 'This Week' && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: 0, borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(180deg, rgba(251,191,36,0.04) 0%, transparent 100%)',
          }}>
            {[allPlayers[1], allPlayers[0], allPlayers[2]].map((p, col) => {
              if (!p) return null
              const rank = col === 1 ? 1 : col === 0 ? 2 : 3
              return (
                <div key={p.id} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: col === 1 ? '24px 12px 16px' : '32px 12px 16px',
                  borderLeft: col > 0 ? '1px solid var(--border)' : 'none',
                  background: p.isMe ? 'rgba(249,115,22,0.06)' : 'transparent',
                }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{MEDAL[rank]}</div>
                  <div style={{
                    width: col === 1 ? 54 : 44, height: col === 1 ? 54 : 44,
                    borderRadius: '50%', fontSize: col === 1 ? 26 : 22,
                    background: p.isMe ? 'linear-gradient(135deg, #F97316, #FBBF24)' : 'var(--bg-elevated)',
                    border: `2px solid ${RANK_COLORS[rank]?.border || 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 6,
                  }}>{p.avatar}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', textAlign: 'center', marginBottom: 2 }}>
                    {p.isMe ? 'You 👋' : p.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: RANK_COLORS[rank]?.text || 'var(--text-secondary)' }}>
                    {p.weeklyXP.toLocaleString()} XP
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* List */}
        <div>
          {displayed.map((player, i) => {
            const rank     = allPlayers.indexOf(player) + 1
            const rankCol  = RANK_COLORS[rank]
            const barWidth = Math.max(4, (player.weeklyXP / maxXP) * 100)

            return (
              <div key={player.id} className="animate-pop-in" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: i < displayed.length - 1 ? '1px solid var(--border)' : 'none',
                background: player.isMe ? 'rgba(249,115,22,0.07)' : 'transparent',
                borderLeft: player.isMe ? '3px solid #F97316' : '3px solid transparent',
                transition: 'background 0.2s',
                animationDelay: `${i * 35}ms`,
              }}>
                {/* Rank */}
                <div style={{
                  width: 36, flexShrink: 0, textAlign: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: rank <= 3 ? '1.1rem' : '0.95rem',
                  color: rankCol?.text || 'var(--text-muted)',
                }}>
                  {rank <= 3 ? MEDAL[rank] : `#${rank}`}
                </div>

                {/* Avatar */}
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', fontSize: 20, flexShrink: 0,
                  background: player.isMe ? 'linear-gradient(135deg, #F97316, #FBBF24)' : 'var(--bg-elevated)',
                  border: `2px solid ${player.isMe ? '#F97316' : rankCol?.border || 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: player.isMe ? '0 4px 12px rgba(249,115,22,0.35)' : 'none',
                }}>{player.avatar}</div>

                {/* Name + bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {player.isMe ? `${player.name} (You)` : player.name}
                      </span>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)', color: '#818CF8',
                        borderRadius: 99, padding: '1px 7px', fontSize: '0.68rem', fontWeight: 800,
                      }}>Lv.{player.level}</span>
                      <span style={{ fontSize: '0.75rem', color: '#FB923C', fontWeight: 700 }}>🔥 {player.streak}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: player.isMe ? '#F97316' : 'var(--text-primary)', whiteSpace: 'nowrap', marginLeft: 10 }}>
                      {player.weeklyXP.toLocaleString()} XP
                    </span>
                  </div>
                  <div style={{ background: 'var(--bg-glass)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99, width: `${barWidth}%`,
                      background: player.isMe
                        ? 'linear-gradient(90deg, #F97316, #FBBF24)'
                        : rank <= 3 ? `linear-gradient(90deg, ${rankCol.text}, ${rankCol.text}90)` : 'rgba(99,102,241,0.45)',
                      transition: 'width 1s var(--ease-bounce)',
                    }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <div style={{ textAlign: 'center', marginTop: 18, color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
        🔄 Leaderboard refreshes weekly every Monday · {allPlayers.length} students competing
      </div>
    </div>
  )
}
