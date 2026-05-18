import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ────────────────────────────────────────────────────────────
// FIX: keys were hardcoded as plain text in the original file, making them
// visible to anyone who inspects your built JavaScript bundle.
// They now read from .env — make sure your .env has:
//   VITE_SUPABASE_URL=https://pxagibfmciysowbfpsds.supabase.co
//   VITE_SUPABASE_ANON_KEY=your-anon-key-here
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithPlan = async (authUser) => {
    if (!authUser) {
      setUser(null);
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("plan, stripe_customer_id, subscription_status")
      .eq("id", authUser.id)
      .single();

    setUser({
      ...authUser,
      plan:                (!error && data?.plan)                ? data.plan                : "free",
      stripe_customer_id:  (!error && data?.stripe_customer_id)  ? data.stripe_customer_id  : null,
      subscription_status: (!error && data?.subscription_status) ? data.subscription_status : null,
    });
  };

  useEffect(() => {
    let initialised = false;

    // onAuthStateChange fires on every login, logout, and token refresh.
    // This is the primary way we keep user state up to date.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        initialised = true;
        setLoading(true);
        if (session?.user) {
          await fetchUserWithPlan(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // getSession handles the initial page load where onAuthStateChange
    // may not fire (e.g. hard refresh with an existing session cookie).
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (initialised) return; // onAuthStateChange already ran, skip
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
