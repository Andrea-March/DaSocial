import styles from "./Post.module.css";
import { Heart, MessageSquare, MoreVertical } from "lucide-react";
import { useState } from "react";
import { timeAgo } from "../lib/timeAgo";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabaseClient";
import { usePostContext } from "../context/PostContext";

export default function Post({ post }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const [hasLiked, setHasLiked] = useState(post.post_likes?.length > 0);
  const [likeCount, setLikeCount] = useState(post.like_count);

  const { openEditPost, openDeletePost } = usePostContext();

  async function toggleLike(postId, hasLiked) {
    const userId = user?.id;
    if (!userId) return;

    if (!hasLiked) {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: userId
      });

      await supabase.rpc("increment_like", { post_uuid: postId });
    } else {
      await supabase
        .from("post_likes")
        .delete()
        .match({ post_id: postId, user_id: userId });

      await supabase.rpc("decrement_like", { post_uuid: postId });
    }
  }

  async function handleLike() {
    if (!hasLiked) {
      await toggleLike(post.id, false);
      setHasLiked(true);
      setLikeCount(likeCount + 1);
    } else {
      await toggleLike(post.id, true);
      setHasLiked(false);
      setLikeCount(likeCount - 1);
    }
  }

 
  return (
    <div className={styles.post}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {post.profiles?.avatar_url ? (
              <img src={post.profiles.avatar_url} className={styles.avatar} alt="" />
            ) : (
              <div className={styles.avatarFallback}>
                {post.username?.[0]?.toUpperCase() || "?"}
              </div>
          )}
          <div className={styles.info}>
            <div className={styles.author}>{post.profiles.username}</div>
            <div className={styles.time}>{timeAgo(post.created_at)}</div>
          </div>
        </div>

        <div className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          <MoreVertical size={20} />
        </div>
      </div>

      {/* POST MENU */}
      {menuOpen && user?.id !== post.user_id && (
        <div className={styles.menu}>
          <div className={styles.menuItem}>Segnala</div>
          <div className={styles.menuItem}>Nascondi</div>
        </div>
      )}
      {menuOpen && user?.id === post.user_id && (
        <div className={styles.menu}>
          <div
            className={styles.menuItem}
            onClick={() => openEditPost(post)}
          >
            Modifica
          </div>

          <button 
            className={styles.menuItemDelete}
            onClick={() => openDeletePost(post)}
          >
            Elimina
          </button>
        </div>
      )}
      {/* TEXT */}
      <div className={styles.content}>{post.content}</div>

      {/* IMAGE */}
      {post.image_url && (
        <img className={styles.image} src={post.image_url} alt="" />
      )}

      {/* ACTIONS */}
      <div className={styles.actions}>
        <div className={styles.action} onClick={handleLike}>
          <Heart 
            size={20}
            fill={hasLiked ? "red" : "none"}
            stroke={hasLiked ? "red" : "currentColor"}
            className={hasLiked ? styles.heartLiked : ""}
          />
          <span className={styles.count}>{likeCount}</span>
        </div>

        <div className={styles.action}>
          <MessageSquare size={20} />
          <span className={styles.count}>{post.comments?.length}</span>
        </div>
      </div>

      {/* COMMENTS */}
      {post.comments?.length > 0 && (
        <div className={styles.comments}>
          {post.comments.map((c) => (
            <div key={c.id} className={styles.comment}>
              {/* Comment main block */}
              <div className={styles.commentHeader}>
                <div className={styles.avatarSmall}></div>
                <div>
                  <div className={styles.commentAuthor}>{c.author}</div>
                  <div className={styles.commentText}>{c.text}</div>
                  <div className={styles.commentMeta}>
                      <span>{c.time}</span>
                      <span className={styles.replyBtn}>Rispondi</span>
                  </div>
                </div>
              </div>

              {/* REPLIES */}
              {c.replies?.length > 0 && (
                <div className={styles.replies}>
                  {c.replies.map((r) => (
                    <div key={r.id} className={styles.reply}>
                      <div className={styles.avatarSmall}></div>
                      <div>
                        <div className={styles.commentAuthor}>{r.author}</div>
                        <div className={styles.commentText}>{r.text}</div>
                        <div className={styles.commentMeta}>
                          <span>{r.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
