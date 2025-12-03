import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);      // auth user
  const [profile, setProfile] = useState(null); // row della tabella profiles
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const userId = user?.id;
      setUser(authUser);

      if (authUser) {
        const { data: profData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        setProfile(profData || null);
      }

      setLoading(false);
    }

    load();

    // update on login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);

      if (u) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, setProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
