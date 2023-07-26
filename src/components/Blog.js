import { useState } from 'react'
import blogService from '../services/blogs'
const Blog = ({ blog }) => {
  const [showFullDetails, setShowFullDetails] = useState(false)
  const blogStyle = {
    padding: '.5rem',
    borderRadius: '10px',
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const [likes, setLikes] = useState(blog.likes)

  const handleLike = async () => {
    const updateBlog = await blogService.updateBlog(blog, likes)
    setLikes(updateBlog.likes)
  }
  const buttonTxt = showFullDetails ? 'hide' : 'view'
  return (
    <div style={blogStyle}>
      <div>
        <p>
          {blog.title}{' '}
          <button onClick={() => setShowFullDetails((prev) => !prev)}>
            {buttonTxt}
          </button>
        </p>
        {showFullDetails && (
          <div>
            <a href={blog.url}>{blog.url}</a>
            <p>
              likes: {likes}{' '}
              <button onClick={() => handleLike(blog)}>like</button>
            </p>
            <p>{blog.author}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
