import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [showNewPost, setShowNewPost] = useState(false);

  const [postBeingEdited, setPostBeingEdited] = useState(null);

  const [lastCreatedPost, setLastCreatedPost] = useState(null);
  const [lastUpdatedPost, setLastUpdatedPost] = useState(null);

  const [postBeingDeleted, setPostBeingDeleted] = useState(null);
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [postsToDelete, setPostsToDelete] = useState(null);

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
    setShowDeletePostModal(true);
  };

  // close delete modal
  const closeDeletePost = () => {
    setPostBeingDeleted(null);
    setShowDeletePostModal(false);
  };

  // notify feed
  const triggerPostDeleted = (postId) => {
    setShowDeletePostModal(false);
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

      //delte
      showDeletePostModal,
      postBeingDeleted,
      openDeletePost,
      closeDeletePost,
      triggerPostDeleted,
      postsToDelete,
    }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  return useContext(PostContext);
}
