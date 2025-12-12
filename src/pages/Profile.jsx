import LogoutButton from "../components/auth/LogoutButton";
import styles from "./Profile.module.css";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import ProfileComponent from "../components/profile/ProfileComponent";
import Header from "../components/layout/Header";
import { useUser } from "../context/UserContext";


export default function Profile() {
  
  const { loading } = useUser();

  return (
    <>
      <Header />
      <div className={styles.container}>
        {loading ? (
            <ProfileSkeleton />
          ) : (
            <ProfileComponent/>
        )}


        <LogoutButton />
      </div>
    </>
  );
}
