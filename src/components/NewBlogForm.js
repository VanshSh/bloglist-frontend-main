import React, { useEffect, useState } from 'react'
import blogService from '../services/blogs'
const NewBlogForm = ({ setNotificationHandler, setAllBlogs, allBlogs }) => {
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
      setNotificationHandler(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        `success`
      )
      setAllBlogs(allBlogs.concat(returnedBlog))
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
      <input name='title' value={newBlog.title} onChange={handleBlogChange} />
      <br />
      author:{' '}
      <input name='author' value={newBlog.author} onChange={handleBlogChange} />
      <br />
      url: <input name='url' value={newBlog.url} onChange={handleBlogChange} />
      <br />
      <button type='submit'>create</button>
    </form>
  )
  return <div>{newBlogForm()}</div>
}

export default NewBlogForm
