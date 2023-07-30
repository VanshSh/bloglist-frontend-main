import React, { useEffect, useState } from 'react'
import blogService from '../services/blogs'
const NewBlogForm = ({
  setNotificationHandler,

  fetchBlogs,
}) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
    }
  }, [])
  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }
    try {
      const returnedBlog = await blogService.createNewBlog(blogObject)
      if (returnedBlog) {
        fetchBlogs()
        setNotificationHandler(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          `success`
        )
      } else {
        setNotificationHandler('Error creating blog', 'error')
      }
      setNewBlog({
        title: '',
        author: '',
        url: '',
      })
    } catch (err) {
      setNotificationHandler('Error creating blog', 'error')
    }
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const newBlogForm = () => (
    <form onSubmit={addBlog}>
      title:{' '}
      <input
        id='newblogtitle'
        placeholder='title'
        name='title'
        value={newBlog.title}
        onChange={handleBlogChange}
      />
      <br />
      author:{' '}
      <input
        id='newblogauthor'
        placeholder='author'
        name='author'
        value={newBlog.author}
        onChange={handleBlogChange}
      />
      <br />
      url:{' '}
      <input
        id='newblogurl'
        name='url'
        placeholder='url'
        value={newBlog.url}
        onChange={handleBlogChange}
      />
      <br />
      <button id='submitnewblogbtn' type='submit'>
        create
      </button>
    </form>
  )
  return <div>{newBlogForm()}</div>
}

export default NewBlogForm
