import Header from "../components/layout/Header";
import styles from "./Feed.module.css";
import Post from "../components/feed/Post";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import PostSkeleton from "../components/feed/PostSkeleton";
import { usePostContext } from "../context/PostContext";
import NewPost from "../components/feed/NewPost";
import ConfirmModal from '../components/ui/ConfirmModal'
import Fab from "../components/layout/Fab";


export default function Feed() {

  const { lastCreatedPost, postBeingDeleted, deletePost, closeDeletePost } = usePostContext();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastDate, setLastDate] = useState(null); // per la paginazione
  const loaderRef = useRef(null);

  const POSTS_LIMIT = 3;
  
  const { openNewPost, showNewPost, closeNewPost, postBeingEdited, postsToDelete, lastUpdatedPost  } = usePostContext();

  useEffect(() => {
    if (postsToDelete) {
      setPosts(prev => prev.filter(p => p.id !== postsToDelete));
    }
  }, [postsToDelete]);

  useEffect(() => {
    if (lastUpdatedPost) {
      setPosts(prev =>
        prev.map(p => 
          p.id === lastUpdatedPost.id ? lastUpdatedPost : p
        )
      );
    }
  }, [lastUpdatedPost]);

  const loadPosts = async (initial = false) => {
    setLoading(true);

    let query = supabase
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
        ),
        post_likes!left (user_id)
      `)
      .order("created_at", { ascending: false })
      .limit(POSTS_LIMIT);

      if (!initial && lastDate) {
        query = query.lt("created_at", lastDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setPosts(prev => [...prev, ...data]);
        setLastDate(data[data.length - 1].created_at);
        if (data.length < 10) setHasMore(false); // finiti i post
      } else {
        setHasMore(false);
      }
      /* wait one second because setPosts takes time */
      setTimeout(()=>setLoading(false), 1000)
    };


   useEffect(() => {
      if (lastCreatedPost) {
        setPosts(prev => [lastCreatedPost, ...prev]);
      }
    }, [lastCreatedPost]);

    useEffect(() => {
      loadPosts(true);
    }, []);

    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPosts();
        }
      });

      if (loaderRef.current) observer.observe(loaderRef.current);

      return () => observer.disconnect();
    }, [hasMore, loading]);


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
                <div ref={loaderRef} />
        </div>
        {showNewPost && (
          <NewPost
            postToEdit={postBeingEdited} 
            onClose={closeNewPost}
          />
        )}
        <Fab onClick={openNewPost} />
        <ConfirmModal
          open={!!postBeingDeleted}
          title="Eliminare il post?"
          subtitle="Questa azione non può essere annullata."
          confirmText="Elimina"
          danger
          onConfirm={deletePost}
          onCancel={closeDeletePost}
        />
    </div>
  );
}
