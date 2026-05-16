import React, { useState } from 'react'
import { useStore } from '../store.js'

const EMOJI_OPTIONS = [
  '📖','🎵','🏋️','🧪','🌍','💰','🎭','🧮','🔭','🎸',
  '🏛️','🌿','🚀','🎓','🏆','🌏','🧠','⚗️','🎯','🏊',
  '🎹','📊','🌐','🔐','🍎','⚽','🎬','🧩','🖥️','🌙',
]

const COLOR_OPTIONS = [
  '#FF6B35','#4ECDC4','#FFE66D','#A8E6CF','#C9B1FF','#FF8B94',
  '#6366F1','#10B981','#3B82F6','#EC4899','#8B5CF6','#14B8A6',
  '#EF4444','#F59E0B','#06B6D4','#84CC16','#F97316','#E879F9',
]

export default function SubjectModal({ onClose }) {
  const { subjects, activeSubjects, addSubject, removeSubject, toggleActiveSubject } = useStore()
  const [tab, setTab] = useState('manage')
  const [newLabel, setNewLabel]   = useState('')
  const [newEmoji, setNewEmoji]   = useState('📖')
  const [newColor, setNewColor]   = useState('#6366F1')
  const [addError, setAddError]   = useState('')
  const [justAdded, setJustAdded] = useState('')

  const handleAdd = () => {
    const trimmed = newLabel.trim()
    if (!trimmed) { setAddError('Please enter a subject name.'); return }
    if (trimmed.length > 24) { setAddError('Name must be 24 characters or less.'); return }
    if (subjects.some(s => s.label.toLowerCase() === trimmed.toLowerCase())) {
      setAddError('A subject with that name already exists.')
      return
    }
    addSubject({ label: trimmed, emoji: newEmoji, color: newColor })
    setJustAdded(trimmed)
    setNewLabel('')
    setAddError('')
    setTimeout(() => { setJustAdded(''); setTab('manage') }, 1400)
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(4,8,16,0.75)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 8888, padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-strong)',
        borderRadius: 22, maxWidth: 500, width: '100%',
        boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        animation: 'pop-in 0.3s var(--ease-bounce) forwards',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          borderBottom: '1px solid var(--border)',
          padding: '22px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: 2 }}>
              📚 Manage Subjects
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', fontWeight: 500 }}>
              Customize your study subjects list
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--bg-glass)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontSize: '1.1rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          {[{ id: 'manage', label: '📋 My Subjects' }, { id: 'add', label: '➕ Add New' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '12px', fontFamily: 'var(--font-body)', fontWeight: 700,
              fontSize: '0.88rem', border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'var(--bg-primary)' : 'transparent',
              color: tab === t.id ? '#818CF8' : 'var(--text-secondary)',
              borderBottom: tab === t.id ? '2px solid #6366F1' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '20px 24px', maxHeight: 420, overflowY: 'auto' }}>

          {/* ── Manage tab ── */}
          {tab === 'manage' && (
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 14 }}>
                Toggle subjects on/off for your timer. Remove custom subjects with ×.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {subjects.map(sub => {
                  const isActive = activeSubjects.includes(sub.id)
                  return (
                    <div key={sub.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 12,
                      background: isActive ? `${sub.color}10` : 'var(--bg-glass)',
                      border: `1px solid ${isActive ? sub.color + '40' : 'var(--border)'}`,
                      transition: 'all 0.2s',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, fontSize: 18, flexShrink: 0,
                        background: `${sub.color}20`,
                        border: `1px solid ${sub.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{sub.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.label}</div>
                        {sub.custom && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Custom</div>}
                      </div>
                      {/* Toggle switch */}
                      <button onClick={() => toggleActiveSubject(sub.id)} style={{
                        width: 44, height: 24, borderRadius: 99, position: 'relative',
                        background: isActive ? sub.color : 'var(--bg-elevated)',
                        border: `1px solid ${isActive ? sub.color : 'var(--border-strong)'}`,
                        cursor: 'pointer', transition: 'all 0.25s var(--ease-bounce)', flexShrink: 0,
                      }}>
                        <div style={{
                          position: 'absolute', top: 2,
                          left: isActive ? 20 : 2,
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#fff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          transition: 'left 0.22s var(--ease-bounce)',
                        }} />
                      </button>
                      {/* Remove (custom only) */}
                      {sub.custom && (
                        <button onClick={() => removeSubject(sub.id)} style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                          color: '#EF4444', fontSize: '0.85rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, transition: 'all 0.2s', flexShrink: 0,
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        >×</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Add tab ── */}
          {tab === 'add' && (
            <div>
              {justAdded ? (
                <div style={{
                  textAlign: 'center', padding: '32px 0',
                  animation: 'pop-in 0.4s var(--ease-bounce) both',
                }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#34D399', marginBottom: 6 }}>
                    "{justAdded}" added!
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Taking you back to your subjects…</div>
                </div>
              ) : (
                <div>
                  {/* Name */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 7 }}>
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={e => { setNewLabel(e.target.value); setAddError('') }}
                      placeholder="e.g. Piano, French, Guitar…"
                      maxLength={24}
                      className="input-premium"
                      onKeyDown={e => e.key === 'Enter' && handleAdd()}
                      style={{ fontSize: '0.95rem' }}
                    />
                    {addError && (
                      <div style={{ color: '#FCA5A5', fontSize: '0.8rem', fontWeight: 600, marginTop: 6 }}>⚠️ {addError}</div>
                    )}
                  </div>

                  {/* Emoji picker */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 7 }}>
                      Choose an Emoji
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5 }}>
                      {EMOJI_OPTIONS.map(e => (
                        <button key={e} onClick={() => setNewEmoji(e)} style={{
                          aspectRatio: '1', borderRadius: 8, fontSize: '1.3rem',
                          background: newEmoji === e ? `${newColor}25` : 'var(--bg-glass)',
                          border: `2px solid ${newEmoji === e ? newColor : 'transparent'}`,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s var(--ease-bounce)',
                        }}>{e}</button>
                      ))}
                    </div>
                  </div>

                  {/* Color picker */}
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 7 }}>
                      Choose a Color
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {COLOR_OPTIONS.map(c => (
                        <button key={c} onClick={() => setNewColor(c)} style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: c, border: `3px solid ${newColor === c ? 'var(--text-primary)' : 'transparent'}`,
                          cursor: 'pointer', transition: 'all 0.15s var(--ease-bounce)',
                          transform: newColor === c ? 'scale(1.2)' : 'scale(1)',
                          boxShadow: newColor === c ? `0 0 0 2px var(--bg-secondary), 0 0 0 4px ${c}` : 'none',
                        }} />
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 12, marginBottom: 18,
                    background: `${newColor}12`, border: `1px solid ${newColor}40`,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20,
                      background: `${newColor}20`, border: `1px solid ${newColor}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{newEmoji}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {newLabel || 'Your Subject Name'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: newColor, fontWeight: 700 }}>Preview</div>
                    </div>
                  </div>

                  <button onClick={handleAdd} className="btn btn-indigo" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                    ➕ Add Subject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
