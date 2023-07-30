import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const blog = props.blog
  let showDeleteBtn = true
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const showWhenVisible = { display: visible ? '' : 'none' }

  // Toggling visibility
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // Delete blog
  const removeBlog = () => props.deleteHandler(blog)

  // Increase likes
  const handleLike = () => {
    setLikes(likes + 1)
    props.likeHandler(blog, likes)
  }
  const buttonLabel = visible ? 'hide' : 'view'
  const blogStyle = {
    padding: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: '5px',
  }
  return (
    <div style={blogStyle} className='blog'>
      <div>
        <p>
          {blog.title} - {blog.author}{' '}
          <button onClick={toggleVisibility}>{buttonLabel}</button>
        </p>
      </div>
      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          {likes}{' '}
          <button id='like-button' onClick={handleLike}>
            like
          </button>
        </p>
        {showDeleteBtn && (
          <button id='remove' onClick={removeBlog}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
