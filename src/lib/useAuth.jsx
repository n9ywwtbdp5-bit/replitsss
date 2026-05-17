import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// Your production-ready Supabase Client
const supabase = createClient(
  "https://pxagibfmciysowbfpsds.supabase.co",
  "sb_publishable_znQXBRBmdjvc_LBHy0Bu7Q_ahSIj8iL"
);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to attach subscription plan status from your public.users table
  const fetchUserWithPlan = async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    // Fetches the 'plan' column (e.g., 'free', 'pro', 'premium') linked to this user
    const { data, error } = await supabase
      .from("users")
      .select("plan")
      .eq("id", authUser.id)
      .single();

    if (error || !data) {
      // Fallback to free if no record exists yet in your user database table
      setUser({ ...authUser, plan: "free" });
    } else {
      setUser({ ...authUser, plan: data.plan || "free" });
    }
  };

  useEffect(() => {
    // 1. Get initial session on boot
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await fetchUserWithPlan(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // 2. Listen for real-time live auth changes (login, logout, token refreshes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserWithPlan(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}