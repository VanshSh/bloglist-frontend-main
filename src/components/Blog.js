import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showFullDetails, setShowFullDetails] = useState(false)
  const blogStyle = {
    padding: '.5rem',
    borderRadius: '10px',
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
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
              likes: {blog.likes} <button>like</button>
            </p>
            <p>{blog.author}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
