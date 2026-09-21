import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlogPost.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const BlogPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Define selectedPost here
  const [displayForm, setDisplayForm] = useState(false); // State variable for form display

  useEffect(() => {
    axios.get('/api/post/listPosts').then((res) => {
      setPosts(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    try {
      await axios.post('/api/post/addPosts', formData);
      setTitle('');
      setContent('');
      setImage('');
      axios.get('/api/post/listPosts').then((res) => {
        setPosts(res.data);
      });
    } catch (error) {
      console.error(error);
    }
    setDisplayForm(false); // Hide the form after submission
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', selectedPost.title);
    formData.append('content', selectedPost.content);
    formData.append('image', selectedPost.image);
    try {
      await axios.put(`/api/post/Singlepost/${selectedPost._id}`, formData);
      setSelectedPost(null);
      axios.get('/api/listPosts').then((res) => {
        setPosts(res.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      axios.get('/api/post/listPosts').then((res) => {
        setPosts(res.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const editPost = (id) => {
    const post = posts.find((p) => p._id === id);
    setSelectedPost(post);
  };

  const deletePost = (id) => {
    handleDelete(id);
  };

  return (
    <div className="AD-container">
      <h1>New Blog</h1>
      <div className="AD-form">
        {/* Button to display the form */}
        {!displayForm && (
          <button className="BPBN" onClick={() => setDisplayForm(true)}>
             <FontAwesomeIcon className='writeicon' icon={faAdd} />
          </button>
        )}
        {displayForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <label htmlFor='fileInput'>
            <FontAwesomeIcon className='writeicon' icon={faAdd} />
            Add Image
          </label>
          <input type="file"  id='fileInput' style={{ display: 'none' }} onChange={(e) => setImage(e.target.files[0])} />
          <button className='BPBN green' type="submit">Add Post</button>
        </form>
        )}
        {selectedPost && (
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Title"
              value={selectedPost.title}
              onChange={(e) =>
                setSelectedPost({
                  ...selectedPost,
                  title: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Content"
              value={selectedPost.content}
              onChange={(e) =>
                setSelectedPost({
                  ...selectedPost,
                  content: e.target.value,
                })
              }
            />
            <input
              type="file"
              onChange={(e) =>
                setSelectedPost({
                  ...selectedPost,
                  image: e.target.files[0],
                })
              }
            />
                   <button type="submit">Update</button>
      </form>
    )}

  </div>
</div>
);
}

export default BlogPost;
