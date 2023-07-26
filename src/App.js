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
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
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

  useEffect(() => {
    blogService.getAll(user?.token).then((blogs) => setAllBlogs(blogs))
  }, [user?.token])

  const logOutHandler = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setNotificationHandler('Logged out', 'error')

    setUser(null)
  }

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
          {allBlogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
