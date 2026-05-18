import { useState, useEffect, createContext, useContext } from "react";
import { useStore } from "../store.js";
import { supabase, isSupabaseConfigured } from "./supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const fetchUserWithPlan = async (authUser) => {
    if (!authUser) {
      setUser(null);
      useStore.getState().setUser({ name: "Student", plan: "free" });
      return;
    }
    const { data, error } = await supabase
      .from("users")
      .select("plan, stripe_customer_id, subscription_status")
      .eq("id", authUser.id)
      .single();

    const appUser = {
      ...authUser,
      plan:                (!error && data?.plan)                ? data.plan                : "free",
      stripe_customer_id:  (!error && data?.stripe_customer_id)  ? data.stripe_customer_id  : null,
      subscription_status: (!error && data?.subscription_status) ? data.subscription_status : null,
    };

    setUser(appUser);
    useStore.getState().setUser({
      name: authUser.user_metadata?.username || authUser.email?.split("@")[0] || "Student",
      plan: appUser.plan,
    });
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

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
    if (supabase) await supabase.auth.signOut();
    useStore.getState().setUser({ name: "Student", plan: "free" });
    window.location.href = "/";
  };

  const refreshUser = async () => {
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserWithPlan(session.user);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser, supabase, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
