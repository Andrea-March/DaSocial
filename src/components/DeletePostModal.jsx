import styles from "./DeletePostModal.module.css";
import { usePostContext } from "../context/PostContext";
import { supabase } from "../lib/supabaseClient";

export default function DeletePostModal() {
  const {
    postBeingDeleted,
    closeDeletePost,
    triggerPostDeleted
  } = usePostContext();

  if (!postBeingDeleted) return null;

  function extractPath(url) {
    // Prende tutto dopo "public/{bucket}/"
    const match = url.match(/public\/([^/]+)\/(.+)$/);

    if (!match) return null;

    // match[1] = bucket ("posts")
    // match[2] = internal path ("posts/filename.webp")
    return match[2];
  }

  async function handleDelete() {
    const post = postBeingDeleted;

    // delete image
    if (post.image_url) {
      const path = extractPath(post.image_url);
      await supabase.storage.from("posts").remove([path]);
    }

    // delete post row
    await supabase.from("posts").delete().eq("id", post.id);

    // notify feed
    triggerPostDeleted(post.id);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.title}>Eliminare il post?</div>
        <div className={styles.subtitle}>L’azione non può essere annullata.</div>

        <button className={styles.deleteBtn} onClick={handleDelete}>
          Elimina
        </button>

        <button className={styles.cancelBtn} onClick={closeDeletePost}>
          Annulla
        </button>
      </div>
    </div>
  );
}
