import { useState, useEffect } from 'react'
import './index.css'

import Blog from './components/Blog'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
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
      setTitle('')
      setAuthor('')
      setUrl('')
      setMessage(`Logout successful!`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.error(exception)
    }
  }

  const addBlogForm = () => {
    const addNewBlog = async (event) => {
      event.preventDefault()

      const blogObject = {
        title: title,
        author: author,
        url: url,
      }
      try {
        const savedBlog = await blogService.create(blogObject)

        setBlogs(blogs.concat(savedBlog))
        setTitle('')
        setAuthor('')
        setUrl('')
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
        }
        setTimeout(() => {
          setMessage(null)
          setIsErrorMessage(false)
        }, 5000)
        if (e.response.status === 401) {
          setMessage('Unauthorized')
          setIsErrorMessage(true)
        }
        setTimeout(() => {
          setMessage(null)
          setIsErrorMessage(false)
        }, 5000)
      }
    }
    return (
      <form onSubmit={addNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    )
  }

  const DeleteAllBlogs = () => {
    // *** FOR TESTING ONLY!! DELETE EVERYTHING
    const deleteAllBlogs = async (event) => {
      const response = await blogService.deleteAll()
      if (response.status === 204) setBlogs([])
      return <button onClick={deleteAllBlogs}>delete all blogs</button>
    }
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
          {addBlogForm()}
          {/* <DeleteAllBlogs /> */}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
