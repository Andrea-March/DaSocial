import Header from "../components/Header";
import styles from "./Home.module.css";
import Post from "../components/Post";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import PostSkeleton from "../components/PostSkeleton";
import { usePostContext } from "../context/PostContext";

const mockPost = 
  {
    id: 1,
    author: "Nome Utente",
    time: "3 ore fa",
    content: "Testo del post",
    image: "/mock/photo1.jpg",
    likes: 12,
    comments: [
      {
        id: 1,
        author: "Giulia D.",
        text: "Grazie per l'avviso!",
        time: "2h fa",
        replies: [
          {
            id: 11,
            author: "Marco R.",
            text: "Figurati!",
            time: "1h fa"
          }
        ]
      }
    ]
  };

export default function Home() {

  const [posts, setPosts] = useState([]);
  const { lastCreatedPost } = usePostContext();
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      image_url,
      like_count,
      created_at,
      user_id,
      profiles (
        username,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setPosts(data);
    /* wait one second because setPosts takes time */
    setLoading(false);
  };

  function handlePostCreated(newPost) {
    setPosts(prev => [newPost, ...prev]);
  }

   useEffect(() => {
    if (lastCreatedPost) {
      setPosts(prev => [lastCreatedPost, ...prev]);
    }
  }, [lastCreatedPost]);

  useEffect(() => {
    loadPosts();
  }, []);


  return (
    <div className={styles.container}>
        <Header />
       {/*  <TopTabs /> */}

        <div className={styles.content}>
            {posts.length === 0 && !loading ? (
                    <div className={styles.emptyState}>
                        <p className={styles.title}>Nessun post ancora.</p>
                        <p className={styles.subtitle}>Premi il + in basso per crearne uno.</p>
                    </div>
                ) : (
                    <div className={styles.feed}>
                      {loading ? (
                        <>
                          <PostSkeleton />
                          <PostSkeleton />
                          <PostSkeleton />
                        </>
                      ) : (
                        posts.map((p) => <Post key={p.id} post={p} />)
                      )}
                    </div>
                )}
        </div>
    </div>
  );
}
