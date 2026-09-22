import { useEffect, useState } from 'react';
import './Blog.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IMG_URL = '/uploads/';

/* The blog index. This component is rendered both at /Blog and inside the
   dashboard, so it deliberately brings no header or footer of its own; the
   standalone route wraps it in BlogPage. */

const excerptOf = (content, limit = 150) => {
  if (!content) return '';
  const flat = content.replace(/\s+/g, ' ').trim();
  return flat.length > limit ? `${flat.slice(0, limit).trimEnd()}...` : flat;
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    axios.get('/api/post/listPosts')
      .then((res) => {
        if (!alive) return;
        setPosts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className='loading'>
        <span className='loading__dot' />
        <span className='loading__dot' />
        <span className='loading__dot' />
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className='blog-empty'>Nothing published yet.</p>;
  }

  return (
    <ul className='blog-grid' data-stagger>
      {posts.map((post) => (
        <li className='blogpost-card' key={post._id}>
          <Link className='blogcard-link' to={`/posts/${post._id}`}>
            <img
              className='blogcard-img'
              src={IMG_URL + post.image}
              alt=''
              loading='lazy'
            />
            <span className='blogcard-body'>
              <span className='blogcard-title'>{post.title}</span>
              <span className='blogcard-excerpt'>{excerptOf(post.content)}</span>
              <span className='b-Read-more'>Read more</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Blog;
