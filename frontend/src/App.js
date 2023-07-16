import { useState, useEffect } from 'react'
import './index.css'

import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const returnedBlogs = await blogService.getAll()
      setBlogs(returnedBlogs)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
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
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage(`Login successful!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('Wrong credentials')
      setIsErrorMessage(true)
      setTimeout(() => {
        setMessage(null)
        setIsErrorMessage(false)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBloglistUser')

      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
      setMessage(`Logout successful!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.error(exception)
    }
  }

  const addNewBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)
      // setBlogs(blogs.concat(savedBlog))
      setBlogs(blogs.concat({ ...savedBlog, user }))
      setMessage(
        `A new blog '${blogObject.title}' by ${blogObject.author} added!`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (e) {
      if (e.response.data.error === 'missingTitleOrUrl') {
        setMessage('title and url required')
        setIsErrorMessage(true)
      } else if (e.response.status === 401) {
        setMessage('Unauthorized')
        setIsErrorMessage(true)
      }
      setTimeout(() => {
        setMessage(null)
        setIsErrorMessage(false)
      }, 5000)
    }
  }

  const incrementLikes = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, {
        ...blogObject,
        likes: blogObject.likes + 1,
        user: blogObject.user.id,
      })
      setBlogs(
        blogs.map((blog) =>
          blog.id === updatedBlog.id
            ? { ...blog, likes: updatedBlog.likes }
            : blog
        )
      )
      setMessage(`Liked ${blogObject.title}!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (e) {
      setMessage('Cannot like')
      setIsErrorMessage(true)
      setTimeout(() => {
        setMessage(null)
        setIsErrorMessage(false)
      }, 5000)
    }
  }

  const DeleteAllBlogs = () => {
    // *** FOR TESTING ONLY!! DELETE EVERYTHING
    const deleteAllBlogs = async (event) => {
      const response = await blogService.deleteAll()
      if (response.status === 204) setBlogs([])
    }
    return <button onClick={deleteAllBlogs}>delete all blogs</button>
  }

  return (
    <div>
      <Notification message={message} isErrorMessage={isErrorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="create new blog">
            <NewBlogForm createBlog={addNewBlog} />
          </Togglable>
          {/* <DeleteAllBlogs /> */}

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              incrementLikes={() => incrementLikes(blog)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
