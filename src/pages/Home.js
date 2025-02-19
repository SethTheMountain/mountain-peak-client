import { useEffect, useState } from 'react';
import api from '../api'; // Import the Axios instance

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.error('Error fetching posts:', err));
  }, []);

  return (
    <div className="home">
      <div className="header">
        <h1>The Mountain's Peak</h1>
        <a href="/about">About the Mountain</a>
      </div>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <small>{new Date(post.created_at).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;