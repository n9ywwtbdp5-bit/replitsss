import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pxagibfmciysowbfpsds.supabase.co",
  "sb_publishable_znQXBRBmdjvc_LBHy0Bu7Q_ahSIj8iL"
);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithPlan = async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("plan")
      .eq("id", authUser.id)
      .single();

    if (error || !data) {
      setUser({ ...authUser, plan: "free" });
    } else {
      setUser({ ...authUser, plan: data.plan || "free" });
    }
  };

  useEffect(() => {
    // Flag to ignore the getSession result if onAuthStateChange fires first
    let initialised = false;

    // 2. Listen for auth changes FIRST so we don't miss events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      initialised = true;
      setLoading(true); // ← key fix: hold the gate while we fetch the plan
      if (session?.user) {
        await fetchUserWithPlan(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // 1. Then get the initial session (in case onAuthStateChange doesn't fire)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (initialised) return; // onAuthStateChange already handled it
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
