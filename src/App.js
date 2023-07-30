import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Togglable from './components/TogglableComponent'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [user, setUser] = useState(null)
  const [allBlogs, setAllBlogs] = useState([])
  const [sortedBlogs, setSortedBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notitfication, setNotification] = useState({
    message: '',
    type: '',
  })
  const setNotificationHandler = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 2000)
  }
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

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

  const fetchBlogs = async (userToken) => {
    try {
      const blogs = await blogService.getAll(userToken)
      setAllBlogs(blogs)
    } catch (error) {
      // Handle the error if needed
      console.error('Error fetching blogs:', error)
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedBlogAppUser'))
    if (user?.token) {
      fetchBlogs(user.token)
    }
  }, [user?.token])

  const logOutHandler = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setNotificationHandler('Logged out', 'error')

    setUser(null)
  }
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
        setAllBlogs(allBlogs.filter((blogItem) => blogItem.id !== blog.id))
      }
    } catch (error) {
      setNotificationHandler('Not authorized to delete this blog.', 'error')
    }
  }
  useEffect(() => {
    const sortedBlogListBasedOnLikes = allBlogs.sort(
      (a, b) => b.likes - a.likes
    )
    setSortedBlogs(sortedBlogListBasedOnLikes)
  }, [allBlogs])
  return (
    <div>
      {notitfication.message && (
        <div className={`notifications ${notitfication.type}`}>
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
                setAllBlogs={setAllBlogs}
                allBlogs={allBlogs}
              />
            </Togglable>
          </div>
          <br />
          {sortedBlogs.map((blog) => (
            <Blog deleteHandler={deleteBlogHandler} key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
