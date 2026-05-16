import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_SUBJECTS = [
  { id: 'math',     label: 'Mathematics', emoji: '📐', color: '#FF6B35', custom: false },
  { id: 'science',  label: 'Science',     emoji: '🔬', color: '#4ECDC4', custom: false },
  { id: 'history',  label: 'History',     emoji: '📜', color: '#FFE66D', custom: false },
  { id: 'language', label: 'Language',    emoji: '✍️', color: '#A8E6CF', custom: false },
  { id: 'coding',   label: 'Coding',      emoji: '💻', color: '#C9B1FF', custom: false },
  { id: 'art',      label: 'Art',         emoji: '🎨', color: '#FF8B94', custom: false },
]

const generateWeekData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, i) => ({
    day,
    minutes: i < 5 ? Math.floor(Math.random() * 80 + 20) : Math.floor(Math.random() * 30),
    xp: Math.floor(Math.random() * 200 + 50),
  }))
}

const initialWeekData = generateWeekData()
const initialWeeklyXP = initialWeekData.reduce((s, d) => s + d.xp, 0)

export const useStore = create(
  persist(
    (set, get) => ({
      // User
      user: {
        name: 'Student',
        avatar: '🎓',
        plan: 'free',
        joinDate: new Date().toISOString(),
      },
      // Streak
      currentStreak: 7,
      longestStreak: 23,
      lastStudyDate: new Date().toISOString(),
      // XP & Level
      xp: 1240,
      level: 5,
      xpToNextLevel: 2000,
      weeklyXP: initialWeeklyXP,
      // Sessions
      todayMinutes: 45,
      weeklyGoal: 300,
      weeklyMinutes: 187,
      weekData: initialWeekData,
      // Subjects
      subjects: DEFAULT_SUBJECTS,
      activeSubjects: ['math', 'science', 'coding'],
      // Timer
      timerRunning: false,
      timerSeconds: 0,
      timerSubject: 'math',
      // Achievements
      achievements: [
        { id: 'first_day',    label: 'Day One',     emoji: '🌱', unlocked: true,  desc: 'Complete your first study session' },
        { id: 'week_warrior', label: 'Week Warrior', emoji: '⚔️', unlocked: true,  desc: 'Study 7 days in a row' },
        { id: 'century',      label: 'Century Club', emoji: '💯', unlocked: false, desc: 'Reach a 100-day streak' },
        { id: 'night_owl',    label: 'Night Owl',    emoji: '🦉', unlocked: true,  desc: 'Study after 10pm' },
        { id: 'early_bird',   label: 'Early Bird',   emoji: '🐦', unlocked: false, desc: 'Study before 7am' },
        { id: 'marathon',     label: 'Marathon',     emoji: '🏃', unlocked: false, desc: 'Study 3 hours in one day' },
      ],
      // Modal
      showPaywall: false,
      paywallFeature: '',

      // ── Actions ────────────────────────────────
      setUser: (user) => set((s) => ({ user: { ...s.user, ...user } })),
      setPlan: (plan) => set((s) => ({ user: { ...s.user, plan } })),

      addXP: (amount) => set((s) => {
        const newXP    = s.xp + amount
        const levelUp  = newXP >= s.xpToNextLevel
        return {
          xp:           levelUp ? newXP - s.xpToNextLevel : newXP,
          level:        levelUp ? s.level + 1 : s.level,
          xpToNextLevel: levelUp ? Math.floor(s.xpToNextLevel * 1.4) : s.xpToNextLevel,
          weeklyXP:     s.weeklyXP + amount,
        }
      }),

      addMinutes: (mins) => set((s) => ({
        todayMinutes:  s.todayMinutes + mins,
        weeklyMinutes: s.weeklyMinutes + mins,
      })),

      incrementStreak: () => set((s) => ({
        currentStreak:  s.currentStreak + 1,
        longestStreak:  Math.max(s.longestStreak, s.currentStreak + 1),
        lastStudyDate:  new Date().toISOString(),
      })),

      // Subject management
      addSubject: (subject) => set((s) => ({
        subjects: [...s.subjects, { ...subject, id: `custom_${Date.now()}`, custom: true }],
      })),
      removeSubject: (subjectId) => set((s) => ({
        subjects:       s.subjects.filter(sub => sub.id !== subjectId),
        activeSubjects: s.activeSubjects.filter(id => id !== subjectId),
      })),
      toggleActiveSubject: (subjectId) => set((s) => {
        const active = s.activeSubjects.includes(subjectId)
        return {
          activeSubjects: active
            ? s.activeSubjects.filter(id => id !== subjectId)
            : [...s.activeSubjects, subjectId],
        }
      }),

      openPaywall:  (feature = '') => set({ showPaywall: true, paywallFeature: feature }),
      closePaywall: () => set({ showPaywall: false, paywallFeature: '' }),
    }),
    {
      name: 'studystreak-storage',
      partialize: (s) => ({
        user:           s.user,
        currentStreak:  s.currentStreak,
        longestStreak:  s.longestStreak,
        xp:             s.xp,
        level:          s.level,
        xpToNextLevel:  s.xpToNextLevel,
        weeklyXP:       s.weeklyXP,
        todayMinutes:   s.todayMinutes,
        weeklyMinutes:  s.weeklyMinutes,
        achievements:   s.achievements,
        activeSubjects: s.activeSubjects,
        subjects:       s.subjects,
      }),
    }
  )
)
