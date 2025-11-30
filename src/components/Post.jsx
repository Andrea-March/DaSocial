import styles from "./Post.module.css";
import { Heart, MessageSquare, MoreVertical } from "lucide-react";
import { useState } from "react";
export default function Post({ post }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.post}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar}></div>
          <div className={styles.info}>
            <div className={styles.author}>{post.author}</div>
            <div className={styles.time}>{post.time}</div>
          </div>
        </div>

        <div className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          <MoreVertical size={20} />
        </div>
      </div>

      {/* POST MENU */}
      {menuOpen && (
        <div className={styles.menu}>
          <div className={styles.menuItem}>Segnala</div>
          <div className={styles.menuItem}>Nascondi</div>
        </div>
      )}
      {/* TEXT */}
      <div className={styles.content}>{post.content}</div>

      {/* IMAGE */}
      {post.image && (
        <img className={styles.image} src={post.image} alt="" />
      )}

      {/* ACTIONS */}
      <div className={styles.actions}>
        <div className={styles.action}>
          <Heart size={18} />
          <span>{post.likes}</span>
        </div>
        <div className={styles.action}>
          <MessageSquare size={18} />
          <span>{post.comments?.length}</span>
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
