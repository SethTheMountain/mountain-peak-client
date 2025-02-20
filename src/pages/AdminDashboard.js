import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminDashboard() {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // State for posts and UI feedback
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Unable to load posts. Please try again.');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  // Handle post creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }

    try {
      setError(null);
      const response = await api.post(
        '/admin/posts',
        { title, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const newPost = {
        id: response.data.id,
        title,
        body,
        created_at: new Date(),
      };
      setPosts([newPost, ...posts]);
      setTitle('');
      setBody('');
      alert('Post created successfully!');
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/admin/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== postId));
      alert('Post deleted successfully!');
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  // Handle navigation to home
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Post Creation Form */}
      <section className="create-post">
        <h2>Create a New Post</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter post title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Write your post here..."
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Uploading...' : 'Upload Post'}
          </button>
        </form>
      </section>

      {/* Posts List */}
      <section className="posts-list">
        <h2>Your Posts</h2>
        {isLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id} className="post">
                <h3>{post.title}</h3>
                <p>{post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}</p>
                <small>{new Date(post.created_at).toLocaleDateString()}</small>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="delete-btn"
                  style={{ background: '#e74c3c', marginLeft: '10px' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Navigation */}
      <button onClick={handleBackToHome} className="back-btn">
        Back to Home
      </button>
    </div>
  );
}

export default AdminDashboard;