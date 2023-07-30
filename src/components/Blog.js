import React, { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = (props) => {
  const blog = props.blog
  let showDeleteBtn = props.showDeleteBtnValue
  console.log(showDeleteBtn)
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const removeBlog = () => props.deleteHandler(blog)

  const handleLike = async () => {
    setLikes((prev) => prev + 1)
    await blogService.updateBlog(blog, likes + 1)
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
