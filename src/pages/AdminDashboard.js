import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Fetch posts on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }
    api
      .get('/posts', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error('Error fetching posts:', err);
        navigate('/admin'); // Redirect if token is invalid
      });
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
      const res = await api.post(
        '/admin/posts',
        { title, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Post created successfully!');
      setTitle('');
      setBody('');
      // Refresh posts after creation
      setPosts([{ id: res.data.id, title, body, created_at: new Date() }, ...posts]);
    } catch (err) {
      console.error('Post error:', err);
      navigate('/admin');
    }
  };

  // Handle post deletion
  const handleDelete = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/admin/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Post deleted successfully!');
        setPosts(posts.filter((post) => post.id !== postId));
      } catch (err) {
        console.error('Delete error:', err);
        navigate('/admin');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Create Post Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            placeholder="Write your post here..."
          />
        </div>
        <button type="submit">Upload Post</button>
      </form>

      {/* Display Posts */}
      <h2>Your Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.body.substring(0, 100)}...</p>
              <small>{new Date(post.created_at).toLocaleDateString()}</small>
              <button
                onClick={() => handleDelete(post.id)}
                style={{ background: '#e74c3c', marginLeft: '10px' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/')} className="back-btn">
        Back to Home
      </button>
    </div>
  );
}

export default AdminDashboard;