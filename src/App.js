import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
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
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (err) {
      console.log(err)
    }
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
  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }
  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    }
    try {
      const returnedBlog = await blogService.createNewBlog(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({
        title: '',
        author: '',
        url: '',
      })
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    blogService.getAll(user?.token).then((blogs) => setBlogs(blogs))
  }, [user?.token])

  const logOutHandler = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  return (
    <div>
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
            {newBlogForm()}
          </div>
          <br />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
