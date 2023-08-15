import React, { useState, useEffect } from "react";
import axios from "axios";

const baseURL = "https://jsonplaceholder.typicode.com/posts";

const App = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState([]);
  const [updatingPost, setUpdatingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get(`${baseURL}?_limit=10`);
    setPosts(response.data);
  };

  const deletePost = async (id) => {
    await axios.delete(`${baseURL}/${id}`);
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleUpdate = (post) => {
    setUpdatingPost(post);
    setTitle(post.title);
    setBody(post.body);
  };

  const cancelUpdate = () => {
    setUpdatingPost(null);
    setTitle("");
    setBody("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updatingPost) {
      await axios.put(`${baseURL}/${updatingPost.id}`, {
        title: title,
        body: body,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatingPost.id
            ? { ...post, title: title, body: body }
            : post
        )
      );

      setUpdatingPost(null);
      setTitle("");
      setBody("");
    } else {
      const response = await axios.post(baseURL, {
        title: title,
        body: body,
      });

      setPosts([response.data, ...posts]);
      setTitle("");
      setBody("");
    }
  };

  return (
    <div className='app'>
      <nav>
        <h1>POSTS APP</h1>
      </nav>
      <div className='add-post-container'>
        <form onSubmit={handleSubmit}>
          <h2>{updatingPost ? "Update Post" : "Add New Post"}</h2>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className='form-control'
            cols='10'
            rows='8'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
          <button type='submit'>{updatingPost ? "Update" : "Add Post"}</button>
          {updatingPost && (
            <button type='button' onClick={cancelUpdate}>
              Cancel
            </button>
          )}
        </form>
      </div>
      <div className='posts-container'>
        <h2>All Posts</h2>
        {posts.map((post) => (
          <div className='post-card' key={post.id}>
            <h2 className='post-title'>{post.title}</h2>
            <p className='post-body'>{post.body}</p>
            <div className='button'>
              <div className='delete-btn' onClick={() => deletePost(post.id)}>
                Delete
              </div>
              {!updatingPost && (
                <div className='delete-btn' onClick={() => handleUpdate(post)}>
                  Update
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
