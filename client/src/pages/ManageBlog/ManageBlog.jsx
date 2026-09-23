import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import './ManageBlog.css'

function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);



  useEffect(() => {
    axios.get("/api/post/listPosts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  const handleEdit = (post) => {
    setSelectedPost({ ...post });
  };
  
  const handleDelete = (postId) => {
    axios.delete(`/api/post/deletepost/${postId}`)
      .then(() => {
        setPosts(posts.filter((post) => post._id !== postId));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", selectedPost.title);
    formData.append("content", selectedPost.content);
    if (selectedPost.image) {
      formData.append("image", selectedPost.image);
      
    }
    const postId = selectedPost._id; // save post id to a variable
    if (!postId) {
      console.log("Post ID is undefined");
      return;
    }
    axios
      .put(`/api/post/Singlepost/${postId}`, formData)
      .then((response) => {
        setPosts(
          posts.map((post) => (post.id === response.data.id ? response.data : post))
        );
        setSelectedPost(null);
      });
  };
  
   const img_url = "/uploads/";
  return (
    <div className="MNB-w">
      <h2>All Blog Posts</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
                {posts.map((post) => (
        <tr key={post.id} className="MNB-M">
            <td>{post.title}</td>
            <td>
            {post.image && <img src={img_url + post.image} alt="Post Image" />}
            <button className='MNB-btn green' onClick={() => handleEdit(post)}>Edit</button>
            <button className='MNB-btn red' onClick={() => handleDelete(post._id)}>Delete</button>

            </td>
        </tr>
        ))}

        </tbody>
      </table>
      {selectedPost && (
        <form className='MNB-X'onSubmit={handleUpdate}>
          <label className="block">
           Title
          </label>
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
          <label className="block">
           Content
          </label>
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
          <div className="setIMG">
          {selectedPost && selectedPost.image && (
            <img src={img_url + selectedPost.image} alt="Post Image" />
          )}
          </div>
          <label htmlFor='fileInput'>
            <FontAwesomeIcon className='writeicon' icon={faAdd} />
            Edit Image
          </label>
          <input
            type="file"
            id='fileInput'
            style={{ display: 'none' }}
            onChange={(e) =>
              setSelectedPost({
                ...selectedPost,
                image: e.target.files[0],
              })
            }
          />
          
          <button className="MNB-btn blue" type="submit">Update Post</button>
          <button className="MNB-btn black" onClick={() => setSelectedPost(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default ManageBlog;
