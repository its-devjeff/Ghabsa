import './SectionC.css';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight, faArrowRight, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SectionC = () => {
  const [posts, setPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/post/listPosts')
      .then((response) => {
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const slideNext = () => {
    setCurrentSlide(currentSlide === posts.length - 4 ? 0 : currentSlide + 1);
  };

  const slidePrev = () => {
    setCurrentSlide(currentSlide === 0 ? posts.length - 4 : currentSlide - 1);
  };

  const getSlideClassName = (index) => {
    if (index === currentSlide) {
      return 'carousel-item _1';
    } else if (index === currentSlide + 1) {
      return 'carousel-item _2';
    } else if (index === currentSlide + 2) {
      return 'carousel-item _3';
    } else {
      return 'carousel-item _4';
    }
  };

  const img_url = "/uploads/";

  return (
    <div className='SectionC-carousel-container'>
      {isLoading ? (
        <div className='loading-cards'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='card loading-card'>
              <div className='loading-image'></div>
              <div className='loading-text'></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='SectionC-carousel-items' data-stagger>
          {posts.length > 0 ? (
            Array.from({ length: 4 }).map((_, index) => {
              const post = posts[currentSlide + index];
              if (!post || !post.image || !post.title || !post.content) {
                return null;
              }
              return (
                <div key={index} className={`card ${getSlideClassName(index)}`}>
                  <Link to={`/posts/${post._id}`}>
                    <img src={img_url + post.image} alt='' />
                    <div className='card-body'>
                      <h4 className='card-title'>{post.title}</h4>
                      <p>{post.content}</p>
                    </div>
                    <span className='Read-more'>
                      <h5>Read more</h5> <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </Link>
                </div>
              );
            })
          ) : (
            <p>No posts available</p>
          )}
        </div>
      )}
      <div className='carousel-nav'>
        <div className='round-btn'>
          <button className='' onClick={slidePrev}>
            <FontAwesomeIcon className='SlidePrev' icon={faChevronCircleLeft} />
          </button>
        </div>
        <div className='round-btn -right'>
          <button onClick={slideNext}>
            {' '}
            <FontAwesomeIcon className='SlideNext' icon={faChevronCircleRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionC;
