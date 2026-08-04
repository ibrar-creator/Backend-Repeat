// usePost.js
import { useState, useEffect } from 'react';
import { getFeed } from '/src/features/post/services/post.api.js';

export const usePost = (enabled = true) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setPosts([]);
      setLoading(false);
      return;
    }

    getFeed()
      .then((data) => {
        console.log('API Response:', data);
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [enabled]);

  return { posts, loading };
};