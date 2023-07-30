import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/TogglableComponent'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [allBlogs, setAllBlogs] = useState([])
  const [sortedBlogs, setSortedBlogs] = useState([])
  const [notitfication, setNotification] = useState({
    message: '',
    type: '',
  })

  // Notification Handler
  const setNotificationHandler = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 2000)
  }
  // Login Form
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          id='username'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          id='password'
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='loginbtn' type='submit'>
        login
      </button>
    </form>
  )

  // Likes Handler
  const handleLike = async (blog, likes) => {
    const response = await blogService.updateBlog(blog, likes + 1)
    if (response) {
      fetchBlogs(user.token)
    } else {
      setNotificationHandler('Error updating likes', 'error')
    }
  }

  // Login Handler
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setNotificationHandler('Successfully logged in', 'success')
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (err) {
      setNotificationHandler('Wrong username or password', 'error')
      console.log(err)
    }
  }

  // Get all blogs
  async function fetchBlogs(userToken) {
    try {
      const blogs = await blogService.getAll(userToken)
      if (blogs) {
        setAllBlogs(blogs)
        setSortedBlogs(blogs.sort((a, b) => b.likes - a.likes))
      } else {
        setNotificationHandler('Error fetching blogs', 'error')
      }
    } catch (error) {
      // Handle the error if needed
      console.error('Error fetching blogs:', error)
    }
  }

  // Logout Handler
  const logOutHandler = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setNotificationHandler('Logged out', 'error')

    setUser(null)
  }

  // Delete Handler
  const deleteBlogHandler = async (blog) => {
    const confirmResult = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )
    if (!confirmResult) {
      console.log('Delete operation cancelled by the user.')
      return // Exit the function if the user cancels the delete operation.
    }

    try {
      const response = await blogService.deleteBlog(blog.id)
      if (response.status === 204) {
        setNotificationHandler('Blog deleted successfully', 'success')
        fetchBlogs(user.token)
      }
    } catch (error) {
      setNotificationHandler('Not authorized to delete this blog.', 'error')
    }
  }

  // UseEffect to check if user is logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  // UseEffect to fetch all blogs
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedBlogAppUser'))
    if (user?.token) {
      fetchBlogs(user.token)
    }
  }, [])

  return (
    <div>
      {notitfication.message && (
        <div
          id='notificationdiv'
          className={`notifications ${notitfication.type}`}
        >
          {notitfication.message}
        </div>
      )}
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>Blogs App</h2>
          <p>{user.name} logged in</p>
          <button onClick={logOutHandler}>Logout</button>
          <br />

          <div>
            <h3>Create new blog</h3>
            <Togglable buttonLabel='Create new blog'>
              <NewBlogForm
                setNotificationHandler={setNotificationHandler}
                fetchBlogs={() => fetchBlogs(user.token)}
              />
            </Togglable>
          </div>
          <br />
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              deleteHandler={deleteBlogHandler}
              likeHandler={handleLike}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
