import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export function PostProvider({ children }) {
  const [showNewPost, setShowNewPost] = useState(false);
  const [lastCreatedPost, setLastCreatedPost] = useState(null);

  const openNewPost = () => setShowNewPost(true);
  const closeNewPost = () => setShowNewPost(false);

  const triggerPostCreated = (post) => {
    setLastCreatedPost(post);
    setShowNewPost(false);
  };

  return (
    <PostContext.Provider value={{
      showNewPost,
      openNewPost,
      closeNewPost,
      lastCreatedPost,
      triggerPostCreated
    }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  return useContext(PostContext);
}
