import './SinglePost.css';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PageShell from '../PageShell/PageShell';

const IMG_URL = '/uploads/';

/* Post bodies are stored as plain text: blank lines separate blocks, and a
   short block with no closing punctuation is a section heading rather than a
   paragraph. Splitting on that is what turns the wall of text the page used
   to render into something readable. */
const blocksOf = (content) => {
  if (!content) return [];

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const looksLikeHeading = line.length < 80 && !/[.!?:;]$/.test(line);
      return { key: `${index}-${line.slice(0, 24)}`, text: line, heading: looksLikeHeading };
    });
};

const SinglePost = () => {
  const location = useLocation();
  const path = location.pathname.split('/')[2];
  const [post, setPost] = useState({});
  const [others, setOthers] = useState([]);

  useEffect(() => {
    let alive = true;

    axios.get(`/api/post/posts/${path}`)
      .then((res) => {
        if (alive) setPost(res.data);
      })
      .catch((err) => console.log(err));

    // The reading list: everything else that has been published.
    axios.get('/api/post/listPosts')
      .then((res) => {
        if (alive) setOthers(res.data);
      })
      .catch((err) => console.log(err));

    // A different post means starting from the top of the new article.
    window.scrollTo({ top: 0, behavior: 'auto' });

    return () => {
      alive = false;
    };
  }, [path]);

  const blocks = blocksOf(post.content);
  const readingList = others.filter((item) => item._id !== path).slice(0, 6);

  return (
    <PageShell wide>
      <div className='Post-layout'>
        <article className='Post' data-reveal>
          {post.image && (
            <img className='Post-image' src={IMG_URL + post.image} alt='' />
          )}

          <header className='Post-head'>
            <h1 className='Post-title'>{post.title}</h1>
            <p className='Post-meta'>
              <span>GHABSA IT</span>
              {post.createdAt && (
                <>
                  <span className='Post-meta-sep' aria-hidden='true' />
                  <span>{new Date(post.createdAt).toDateString()}</span>
                </>
              )}
            </p>
          </header>

          <div className='Post-body'>
            {blocks.map((block) =>
              block.heading
                ? <h2 key={block.key}>{block.text}</h2>
                : <p key={block.key}>{block.text}</p>
            )}
          </div>
        </article>

        <aside className='Post-aside' data-reveal>
          <div className='Post-aside-inner'>
            <p className='Post-aside-heading'>More from the blog</p>

            {readingList.length === 0 ? (
              <p className='Post-aside-empty'>Nothing else published yet.</p>
            ) : (
              <ul className='Post-aside-list'>
                {readingList.map((item) => (
                  <li key={item._id}>
                    <Link className='Post-aside-item' to={`/posts/${item._id}`}>
                      {item.image && (
                        <img
                          className='Post-aside-thumb'
                          src={IMG_URL + item.image}
                          alt=''
                          loading='lazy'
                        />
                      )}
                      <span className='Post-aside-text'>
                        <span className='Post-aside-title'>{item.title}</span>
                        {item.createdAt && (
                          <span className='Post-aside-date'>
                            {new Date(item.createdAt).toDateString()}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <Link className='Post-aside-all' to='/Blog'>All posts</Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
};

export default SinglePost;
