import styles from "./Post.module.css";
import { Heart, MessageSquare, MoreVertical, Send } from "lucide-react";
import { useState, useRef, useEffect, use } from "react";
import { timeAgo } from "../../lib/timeAgo";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabaseClient";
import { usePostContext } from "../../context/PostContext";
import { groupComments } from "../../lib/groupComments";
import ActionMenu from "../ui/ActionMenu";
import Avatar from "../ui/Avatar";

export default function Post({ post }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, profile, avatarSrc } = useUser();
  const [hasLiked, setHasLiked] = useState(post.post_likes?.length > 0);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [imgLoaded, setImgLoaded] = useState(false);
  

  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null); // comment id

  const [comments, setComments] = useState([]);

  const { openEditPost, openDeletePost } = usePostContext();

  const isMine = post.user_id === user?.id;
  const postAvatar = isMine
    ? avatarSrc
    : post.profile?.avatar_url;

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
 {/* MENU CLOSES ON CLICK OUTSIDE*/}
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);


useEffect(() => {
  async function load() {
      const { data } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          parent_id,
          profiles (username, avatar_url)
        `)
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      setComments(groupComments(data));
    }

    load();
}, [post.id]);

async function submitComment() {
  if (!commentText.trim()) return;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: post.id,
      user_id: user.id,
      content: commentText,
      parent_id: replyTo ? replyTo.id : null
    })
    .select(`
      id,
      content,
      created_at,
      user_id,
      parent_id,
      profiles (username, avatar_url)
    `)
    .single();

  if (!error && data) {
    // 1) Aggiorno la UI locale
    if (replyTo) {
      // è una reply
      setComments(prev =>
        prev.map(c =>
          c.id === replyTo.id
            ? { ...c, replies: [...c.replies, data] }
            : c
        )
      );
    } else {
      // è un commento root
      setComments(prev => [...prev, { ...data, replies: [] }]);
    }

    // 2) Reset input
    setCommentText("");
    setReplyTo(null);
  }
}

 
  return (
    <div className={styles.post}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
           <Avatar
              userId={post.user_id}
              avatarUrl={post.profile?.avatar_url}
              username={post.profile?.username}
              size="sm"          // sm | md | lg
            />
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
        <ActionMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          actions={[
            {
              label: "Segnala",
              onClick: () => openEditPost(post)
            },
            {
              label: "Nascondi",
              danger: true,
              onClick: () => openDeletePost(post)
            }
          ]}
        />
      )}
      {menuOpen && user?.id === post.user_id && (
        <ActionMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          actions={[
            {
              label: "Modifica",
              onClick: () => openEditPost(post)
            },
            {
              label: "Elimina",
              danger: true,
              onClick: () => openDeletePost(post)
            }
          ]}
        />
      )}
      {/* TEXT */}
      <div className={styles.content}>{post.content}</div>

      {/* IMAGE */}
      {post.image_url && (
        <div className={styles.imageWrapper}>
          {!imgLoaded && <div className={styles.imageSkeleton} />}

          <img
            src={post.image_url}
            className={`${styles.image} ${imgLoaded ? styles.loaded : ""}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            alt=""
          />
        </div>
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
          <MessageSquare size={20} stroke={comments?.length ? "var(--color-accent)" : "var(--text-secondary)"}/>
          <span className={styles.count}>{comments?.length}</span>
        </div>
      </div>

      {/* COMMENTS */}
        <div className={styles.comments}>
          {comments?.length > 0  && comments.map((c) => (
            <div key={c.id} className={styles.comment}>
              
              {/* Comment main block */}
              <div className={styles.commentHeader}>
                 <Avatar
                    userId={c.user_id}
                    avatarUrl={c.profile?.avatar_url}
                    username={c.profile?.username}
                    size="sm"
                  />
                <div>
                  <div className={styles.commentAuthor}>{c.profiles.username}</div>
                  <div className={styles.commentText}>{c.content}</div>
                  <div className={styles.commentMeta}>
                      <span>{timeAgo(c.created_at)}</span>
                      <span
                        className={styles.replyBtn}
                        onClick={() => setReplyTo(c)}
                      >
                        Rispondi
                      </span>
                  </div>
                </div>
              </div>

              {/* REPLIES */}
              {c.replies?.length > 0 && (
                <div className={styles.replies}>
                  {c.replies.map((r) => (
                    <div key={r.id} className={styles.reply}>
                      <Avatar
                        userId={r.user_id}
                        avatarUrl={r.profile?.avatar_url}
                        username={r.profile?.username}
                        size="sm"
                      />
                      <div>
                        <div className={styles.commentAuthor}>{r.profiles.username}</div>
                        <div className={styles.commentText}>{r.content}</div>
                        <div className={styles.commentMeta}>
                          <span>{timeAgo(r.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* COMMENT AND REPLY TO SECTION */}
            <div className={styles.addCommentSection}>
              {replyTo && (
                <div className={styles.replyChip}>
                  <span className={styles.replyLabel}>
                    Rispondendo a @{replyTo.profiles.username}
                  </span>
                  <span className={styles.replyClose} onClick={() => setReplyTo(null)}>×</span>
                </div>
              )}

              <div className={styles.addComment}>
                <Avatar
                  userId={post.user_id}
                  avatarUrl={post.profile?.avatar_url}
                  username={post.profile?.username}
                  size="sm"
                />

                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="Aggiungi un commento…"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitComment();
                    }}
                  />

                  {commentText.trim().length > 0 && (
                    <button className={styles.sendBtn} onClick={submitComment}>
                      <Send size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
        </div>
      

    </div>
  );
}
