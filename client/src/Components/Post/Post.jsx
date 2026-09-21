import './Post.css'
import {Link} from "react-router-dom"
const Post=({post})=>{
    return(
        <div className='card-body'>
            {post.photo &&(
                        <img src='/Images/img-2.jpg' alt=''></img>
            )}
         <div className='postCat'>
            {post.categories.map((c)=>(
                <span className='postcat'>{c.name}</span>
            ))}

         </div>
         <Link to={`/post/${post._id}`} className='link'>
         <h4 className='card-title'>{post.title}</h4>
         </Link>
      
        <span className='postDate'>{new Date(post.createdAt).toDateString}</span>
        <span className='card-content'>
        <p className='content-intro'>{post.desc}</p>
        </span>
    </div>
    )

}
export default Post;