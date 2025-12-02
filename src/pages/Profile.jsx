import LogoutButton from "../components/LogoutButton";
import styles from "./Profile.module.css";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import ProfileSkeleton from "../components/ProfileSkeleton";
import ProfileComponent from "../components/ProfileComponent";
import Header from "../components/Header";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    }).catch((err)=>{setLoading(false); console.log(err)});
  }, []);

  return (
    <>
      <Header />
      <div className={styles.container}>
        {loading ? (
            <ProfileSkeleton />
          ) : (
            <ProfileComponent user={user}/>
        )}


        <LogoutButton />
      </div>
    </>
  );
}
