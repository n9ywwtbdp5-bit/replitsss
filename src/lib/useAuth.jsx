import { useState, useEffect, createContext, useContext, useRef } from "react";
import { useStore } from "../store.js";
import { supabase, isSupabaseConfigured } from "./supabaseClient.js";

const AuthContext = createContext(null);
const PROFILE_FETCH_MS = 8000;
const AUTH_INIT_MS = 10000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), ms);
    }),
  ]);
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const profileRequestId = useRef(0);

  const applyProfileToUser = (authUser, profile) => {
    const appUser = {
      ...authUser,
      plan:                profile?.plan                ?? "free",
      stripe_customer_id:  profile?.stripe_customer_id  ?? null,
      subscription_status: profile?.subscription_status ?? null,
    };
    setUser(appUser);
    useStore.getState().setUser({
      name: authUser.user_metadata?.username || authUser.email?.split("@")[0] || "Student",
      plan: appUser.plan,
    });
    return appUser;
  };

  const fetchUserWithPlan = async (authUser) => {
    if (!authUser) {
      setUser(null);
      useStore.getState().setUser({ name: "Student", plan: "free" });
      return null;
    }

    const requestId = ++profileRequestId.current;

    try {
      const { data, error } = await withTimeout(
        supabase
          .from("users")
          .select("plan, stripe_customer_id, subscription_status")
          .eq("id", authUser.id)
          .maybeSingle(),
        PROFILE_FETCH_MS
      );

      if (requestId !== profileRequestId.current) return null;

      if (error) {
        console.warn("[auth] profile fetch failed:", error.message);
      }

      return applyProfileToUser(authUser, error ? null : data);
    } catch (err) {
      if (requestId !== profileRequestId.current) return null;
      console.warn("[auth] profile fetch timed out or failed:", err?.message || err);
      return applyProfileToUser(authUser, null);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    const finishAuthInit = () => {
      if (!cancelled) setLoading(false);
    };

    const initTimeout = setTimeout(() => {
      console.warn("[auth] session init timed out — continuing without blocking");
      finishAuthInit();
    }, AUTH_INIT_MS);

    const clearInitTimeout = () => {
      clearTimeout(initTimeout);
    };

    // Never await inside onAuthStateChange — that deadlocks getSession().
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (cancelled) return;

        if (session?.user) {
          applyProfileToUser(session.user, null);
          void fetchUserWithPlan(session.user);
        } else {
          profileRequestId.current += 1;
          setUser(null);
          useStore.getState().setUser({ name: "Student", plan: "free" });
        }

        clearInitTimeout();
        finishAuthInit();
      }
    );

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return;

        if (session?.user) {
          applyProfileToUser(session.user, null);
          void fetchUserWithPlan(session.user);
        } else {
          setUser(null);
        }

        clearInitTimeout();
        finishAuthInit();
      })
      .catch((err) => {
        console.warn("[auth] getSession failed:", err?.message || err);
        clearInitTimeout();
        finishAuthInit();
      });

    return () => {
      cancelled = true;
      clearInitTimeout();
      subscription.unsubscribe();
    };
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
