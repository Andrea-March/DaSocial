import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabaseClient";
const PostContext = createContext();

export function PostProvider({ children }) {
  const [showNewPost, setShowNewPost] = useState(false);

  const [postBeingEdited, setPostBeingEdited] = useState(null);

  const [lastCreatedPost, setLastCreatedPost] = useState(null);
  const [lastUpdatedPost, setLastUpdatedPost] = useState(null);

  const [postBeingDeleted, setPostBeingDeleted] = useState(null);
  const [postsToDelete, setPostsToDelete] = useState(null);

  function extractPath(url) {
    // Prende tutto dopo "public/{bucket}/"
    const match = url.match(/public\/([^/]+)\/(.+)$/);

    if (!match) return null;

    // match[1] = bucket ("posts")
    // match[2] = internal path ("posts/filename.webp")
    return match[2];
  }

  async function deletePost() {
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

  // --- CREATE ---
  const openNewPost = () => {
    setPostBeingEdited(null);   // modal vuota
    setShowNewPost(true);
  };

  const triggerPostCreated = (post) => {
    setLastCreatedPost(post);
    setShowNewPost(false);
  };

  // --- EDIT ---
  const openEditPost = (post) => {
    setPostBeingEdited(post);   // imposta post da modificare
    setShowNewPost(true);       // riusa la stessa modale
  };

  const triggerPostUpdated = (post) => {
    setLastUpdatedPost(post);
    setShowNewPost(false);
    setPostBeingEdited(null);
  };

  // --- CLOSE ---
  const closeNewPost = () => {
    setShowNewPost(false);
    setPostBeingEdited(null);
  };

  // open delete modal
  const openDeletePost = (post) => {
    setPostBeingDeleted(post);
  };

  // close delete modal
  const closeDeletePost = () => {
    setPostBeingDeleted(null);
  };

  // notify feed
  const triggerPostDeleted = (postId) => {
    setPostBeingDeleted(null);
    setPostsToDelete(postId); // feed listener
  };

  return (
    <PostContext.Provider value={{
      // modal
      showNewPost,
      openNewPost,
      closeNewPost,

      // create
      lastCreatedPost,
      triggerPostCreated,

      // edit
      postBeingEdited,
      openEditPost,
      lastUpdatedPost,
      triggerPostUpdated,

      //delete
      postBeingDeleted,
      deletePost,
      openDeletePost,
      closeDeletePost,
      postsToDelete,
    }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  return useContext(PostContext);
}
