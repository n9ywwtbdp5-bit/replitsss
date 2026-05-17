import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0d0f14",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32 }}>🔥</div>
          <div style={{
            width: 32, height: 32,
            border: "3px solid rgba(249,115,22,0.2)",
            borderTop: "3px solid #F97316",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-root {
          min-height: 100vh; background: #0d0f14;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; padding: 24px;
        }
        .auth-root::before {
          content: ''; position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,150,30,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-card {
          background: #161821; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 40px; width: 100%; max-width: 420px;
          position: relative; z-index: 1; box-shadow: 0 25px 60px rgba(0,0,0,0.5);
          animation: cardIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); text-align: center;
        }
        @keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .auth-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 32px; }
        .auth-logo .logo-text { font-family: 'Sora', sans-serif; font-weight: 700; font-size: 20px; color: #fff; }
        .auth-title { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 26px; color: #fff; margin-bottom: 8px; }
        .auth-subtitle { color: #6b7280; font-size: 14px; margin-bottom: 32px; line-height: 1.6; }
        .btn-primary {
          width: 100%; background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff; border: none; border-radius: 12px; padding: 14px;
          font-size: 15px; font-weight: 700; font-family: 'Sora', sans-serif;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 20px rgba(249,115,22,0.35);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(249,115,22,0.45); }
        .perks { list-style: none; margin: 28px 0 0; display: flex; flex-direction: column; gap: 10px; text-align: left; }
        .perks li { display: flex; align-items: center; gap: 10px; color: #9ca3af; font-size: 13.5px; font-weight: 500; }
        .perks li span.check { color: #34d399; font-size: 16px; }
      `}</style>
      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-logo">
            <span style={{ fontSize: 22 }}>🔥</span>
            <span className="logo-text">StudyStreak</span>
          </div>
          <h1 className="auth-title">Welcome back 👋</h1>
          <p className="auth-subtitle">
            Log in to track your streaks, earn XP, and build study habits that stick.
          </p>
          <button className="btn-primary" onClick={handleLogin}>
            🔥 Log In to Continue
          </button>
          <ul className="perks">
            <li><span className="check">✓</span> Free forever — no credit card needed</li>
            <li><span className="check">✓</span> Streak tracking & XP system</li>
            <li><span className="check">✓</span> Deep analytics & achievements</li>
          </ul>
        </div>
      </div>
    </>
  );
}
