import React, { useState } from 'react'
import { useStore } from '../store.js'

const ALL_ACHIEVEMENTS = [
  { id: 'first_day',     label: 'Day One',         emoji: '🌱', desc: 'Complete your first study session',   xp: 50,   category: 'Beginner' },
  { id: 'week_warrior',  label: 'Week Warrior',     emoji: '⚔️', desc: 'Study 7 days in a row',              xp: 150,  category: 'Streak'   },
  { id: 'century',       label: 'Centurion',        emoji: '💯', desc: 'Reach a 100-day streak',             xp: 1000, category: 'Streak'   },
  { id: 'night_owl',     label: 'Night Owl',        emoji: '🦉', desc: 'Study after 10pm',                   xp: 75,   category: 'Habits'   },
  { id: 'early_bird',    label: 'Early Bird',       emoji: '🐦', desc: 'Study before 7am',                   xp: 75,   category: 'Habits'   },
  { id: 'marathon',      label: 'Marathon',         emoji: '🏃', desc: 'Study 3 hours in one day',           xp: 300,  category: 'Time'     },
  { id: 'scholar',       label: 'Scholar',          emoji: '🎓', desc: 'Reach Level 10',                     xp: 500,  category: 'Level'    },
  { id: 'pomodoro_king', label: 'Pomodoro King',    emoji: '🍅', desc: 'Complete 50 Pomodoro sessions',      xp: 400,  category: 'Time'     },
  { id: 'multi_subject', label: 'Renaissance',      emoji: '🎨', desc: 'Study 5 different subjects',         xp: 200,  category: 'Variety'  },
  { id: 'perfect_week',  label: 'Perfect Week',     emoji: '✨', desc: 'Hit your goal every day for a week', xp: 350,  category: 'Goals'    },
  { id: 'comeback',      label: 'Comeback Kid',     emoji: '💪', desc: 'Restart a streak after breaking it', xp: 100,  category: 'Habits'   },
  { id: 'legend',        label: 'Legend',           emoji: '👑', desc: 'Reach a 365-day streak',             xp: 9999, category: 'Streak'   },
]

const CATEGORIES = ['All', 'Streak', 'Habits', 'Time', 'Level', 'Goals', 'Variety', 'Beginner']

const categoryColors = {
  Streak: '#F97316', Habits: '#10B981', Time: '#3B82F6',
  Level: '#8B5CF6', Goals: '#FBBF24', Variety: '#EC4899', Beginner: '#34D399', All: '#6366F1',
}

export default function Achievements() {
  const { achievements } = useStore()
  const [filter, setFilter] = useState('All')
  const unlockedIds = new Set(achievements.filter(a => a.unlocked).map(a => a.id))

  const filtered = ALL_ACHIEVEMENTS.filter(a => filter === 'All' || a.category === filter)
  const unlocked = filtered.filter(a => unlockedIds.has(a.id))
  const locked   = filtered.filter(a => !unlockedIds.has(a.id))
  const totalPct = Math.round((unlockedIds.size / ALL_ACHIEVEMENTS.length) * 100)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: 'slide-up 0.4s ease both' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, marginBottom: 6, letterSpacing: '-0.4px' }}>🏅 Achievements</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.92rem' }}>
          {unlockedIds.size} of {ALL_ACHIEVEMENTS.length} badges unlocked · Keep pushing! 💪
        </p>
      </div>

      {/* Progress bar card */}
      <div className="card" style={{ padding: '22px 24px', marginBottom: 22, background: 'linear-gradient(145deg, rgba(251,191,36,0.07), rgba(249,115,22,0.05))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#F1F5F9' }}>Badge Collection</span>
          <span style={{ color: '#FB923C', fontWeight: 800, fontSize: '0.95rem' }}>{unlockedIds.size} / {ALL_ACHIEVEMENTS.length}</span>
        </div>
        <div className="xp-bar-container" style={{ height: 12 }}>
          <div className="xp-bar-fill" style={{ width: `${totalPct}%` }} />
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, marginTop: 6 }}>{totalPct}% complete</div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(c => {
          const col = categoryColors[c] || '#6366F1'
          return (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: '7px 16px', borderRadius: 99,
              background: filter === c ? col + '20' : 'rgba(255,255,255,0.05)',
              color: filter === c ? col : 'var(--text-secondary)',
              border: `1px solid ${filter === c ? col + '50' : 'rgba(255,255,255,0.09)'}`,
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
              transition: 'all 0.2s var(--ease-bounce)',
            }}>{c}</button>
          )
        })}
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#34D399' }}>✓ Unlocked</span>
            <span style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', borderRadius: 99, padding: '1px 9px', fontSize: '0.72rem', fontWeight: 800 }}>{unlocked.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14, marginBottom: 28 }}>
            {unlocked.map(({ id, label, emoji, desc, xp, category }) => {
              const col = categoryColors[category] || '#F97316'
              return (
                <div key={id} className="card animate-pop-in" style={{ padding: '22px', background: `linear-gradient(145deg, ${col}12, rgba(22,29,46,0.9))`, borderColor: col + '25' }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>{emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 4, color: '#F1F5F9' }}>{label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: 12, lineHeight: 1.5 }}>{desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: col + '25', color: col, borderRadius: 99, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>{category}</span>
                    <span style={{ color: '#FB923C', fontWeight: 800, fontSize: '0.85rem' }}>+{xp} XP</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-muted)' }}>🔒 Locked</span>
            <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', borderRadius: 99, padding: '1px 9px', fontSize: '0.72rem', fontWeight: 800 }}>{locked.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
            {locked.map(({ id, label, emoji, desc, xp, category }) => (
              <div key={id} className="card" style={{ padding: '22px', opacity: 0.45, filter: 'grayscale(0.5)' }}>
                <div style={{ fontSize: 40, marginBottom: 10, filter: 'grayscale(1)' }}>{emoji}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 4, color: '#F1F5F9' }}>{label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: 12, lineHeight: 1.5 }}>{desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', borderRadius: 99, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>{category}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.85rem' }}>+{xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
