import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient.js";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const resetForm = () => {
    setEmail(""); setPassword(""); setConfirmPassword("");
    setUsername(""); setError(""); setSuccess("");
  };

  const switchMode = (newMode) => { resetForm(); setMode(newMode); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Logged in! Redirecting...");
      setTimeout(() => navigate("/app/dashboard"), 500);
    }

    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) { setError("Passwords don't match."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
    if (error) { setError(error.message); }
    else { setSuccess("Account created! Check your email to confirm, then log in."); setTimeout(() => switchMode("login"), 3000); }
    setLoading(false);
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { setError(error.message); }
    else { setSuccess("Password reset link sent! Check your email."); }
    setLoading(false);
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/app/dashboard` },
    });
    if (error) setError(error.message);
  };

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
        .auth-root::after {
          content: ''; position: fixed; bottom: -150px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .auth-card {
          background: #161821; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 40px; width: 100%; max-width: 420px;
          position: relative; z-index: 1; box-shadow: 0 25px 60px rgba(0,0,0,0.5);
          animation: cardIn 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        @keyframes cardIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .auth-logo { display:flex; align-items:center; gap:10px; margin-bottom:32px; }
        .auth-logo .logo-text { font-family:'Sora',sans-serif; font-weight:700; font-size:20px; color:#fff; }
        .auth-logo .flame { font-size:22px; }
        .auth-title { font-family:'Sora',sans-serif; font-weight:800; font-size:26px; color:#fff; margin-bottom:6px; line-height:1.2; }
        .auth-subtitle { color:#6b7280; font-size:14px; margin-bottom:28px; }
        .auth-subtitle span { color:#f97316; cursor:pointer; font-weight:500; }
        .auth-subtitle span:hover { text-decoration:underline; }
        .field { margin-bottom:14px; }
        .field label { display:block; font-size:13px; font-weight:500; color:#9ca3af; margin-bottom:6px; font-family:'Sora',sans-serif; }
        .field-wrap { position:relative; }
        .field input {
          width:100%; background:#1e2130; border:1px solid rgba(255,255,255,0.08);
          border-radius:12px; padding:13px 16px; color:#fff; font-size:15px;
          font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.2s,box-shadow 0.2s;
        }
        .field input::placeholder { color:#4b5563; }
        .field input:focus { border-color:#f97316; box-shadow:0 0 0 3px rgba(249,115,22,0.12); }
        .field input.has-toggle { padding-right:48px; }
        .toggle-pw {
          position:absolute; right:14px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:#6b7280; font-size:16px;
          padding:0; display:flex; align-items:center;
        }
        .toggle-pw:hover { color:#f97316; }
        .forgot-link { text-align:right; margin-top:-6px; margin-bottom:20px; }
        .forgot-link button { background:none; border:none; color:#6b7280; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; }
        .forgot-link button:hover { color:#f97316; }
        .btn-primary {
          width:100%; background:linear-gradient(135deg,#f97316,#ea580c); color:#fff;
          border:none; border-radius:12px; padding:14px; font-size:15px; font-weight:700;
          font-family:'Sora',sans-serif; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s,opacity 0.15s;
          box-shadow:0 4px 20px rgba(249,115,22,0.35); margin-bottom:14px;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 28px rgba(249,115,22,0.45); }
        .btn-primary:active:not(:disabled) { transform:translateY(0); }
        .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
        .btn-google {
          width:100%; background:#1e2130; color:#e5e7eb; border:1px solid rgba(255,255,255,0.09);
          border-radius:12px; padding:13px; font-size:14px; font-weight:500;
          font-family:'DM Sans',sans-serif; cursor:pointer; transition:background 0.15s,border-color 0.15s;
          display:flex; align-items:center; justify-content:center; gap:10px; margin-bottom:22px;
        }
        .btn-google:hover { background:#252838; border-color:rgba(255,255,255,0.15); }
        .divider { display:flex; align-items:center; gap:12px; margin-bottom:22px; color:#374151; font-size:12px; }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.07); }
        .alert { border-radius:10px; padding:11px 14px; font-size:13.5px; margin-bottom:16px; display:flex; align-items:flex-start; gap:8px; animation:fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }
        .alert-error { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); color:#fca5a5; }
        .alert-success { background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.25); color:#86efac; }
        .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .back-link { display:flex; align-items:center; gap:6px; background:none; border:none; color:#6b7280; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; margin-bottom:24px; padding:0; }
        .back-link:hover { color:#f97316; }
        .terms { font-size:12px; color:#4b5563; text-align:center; margin-top:20px; line-height:1.6; }
        .terms a { color:#6b7280; text-decoration:underline; }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="flame">🔥</span>
            <span className="logo-text">StudyStreak</span>
          </div>

          {mode === "forgot" && (
            <>
              <button className="back-link" onClick={() => switchMode("login")}>← Back to login</button>
              <h1 className="auth-title">Reset password</h1>
              <p className="auth-subtitle">We'll send a reset link to your email.</p>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ {success}</div>}
              <form onSubmit={handleForgot}>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

          {mode === "login" && (
            <>
              <h1 className="auth-title">Welcome back 👋</h1>
              <p className="auth-subtitle">Don't have an account? <span onClick={() => switchMode("signup")}>Sign up free</span></p>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ {success}</div>}
              <button className="btn-google" type="button" onClick={handleGoogle}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.2 17.8 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.1z"/>
                  <path fill="#FBBC05" d="M10.6 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8-6.1z"/>
                  <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.6-5.9c-2 1.4-4.6 2.2-7.6 2.2-6.2 0-11.5-4.2-13.4-9.8l-8 6.1C6.6 42.6 14.6 48 24 48z"/>
                </svg>
                Continue with Google
              </button>
              <div className="divider">or continue with email</div>
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="field-wrap">
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="has-toggle" required />
                    <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
                  </div>
                </div>
                <div className="forgot-link">
                  <button type="button" onClick={() => switchMode("forgot")}>Forgot password?</button>
                </div>
                <button className="btn-primary" type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : "🔥 Log In"}
                </button>
              </form>
            </>
          )}

          {mode === "signup" && (
            <>
              <h1 className="auth-title">Start your streak 🚀</h1>
              <p className="auth-subtitle">Already have an account? <span onClick={() => switchMode("login")}>Log in</span></p>
              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✅ {success}</div>}
              <button className="btn-google" type="button" onClick={handleGoogle}>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.2 17.8 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.1z"/>
                  <path fill="#FBBC05" d="M10.6 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8-6.1z"/>
                  <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.6-5.9c-2 1.4-4.6 2.2-7.6 2.2-6.2 0-11.5-4.2-13.4-9.8l-8 6.1C6.6 42.6 14.6 48 24 48z"/>
                </svg>
                Sign up with Google
              </button>
              <div className="divider">or sign up with email</div>
              <form onSubmit={handleSignup}>
                <div className="field">
                  <label>Username</label>
                  <input type="text" placeholder="coolstudent99" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Password</label>
                  <div className="field-wrap">
                    <input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="has-toggle" required />
                    <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
                  </div>
                </div>
                <div className="field">
                  <label>Confirm Password</label>
                  <input type={showPassword ? "text" : "password"} placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button className="btn-primary" type="submit" disabled={loading} style={{marginTop:6}}>
                  {loading ? <span className="spinner" /> : "🔥 Create Account — Free"}
                </button>
              </form>
              <p className="terms">
                By signing up you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
