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

  // initial loading of blogs
  useEffect(() => {
    async function fetchData() {
      const returnedBlogs = await blogService.getAll()
      setBlogs(returnedBlogs)
    }
    fetchData()
  }, [])

  // setToken
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('Login successful!')
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
      setMessage('Logout successful!')
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

  const deleteBlog = async (blogObject) => {
    console.log('blogObject', blogObject)
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)
    ) {
      try {
        await blogService.deleteOne(blogObject.id)
        setBlogs(blogs.filter((blog) => blog.id !== blogObject.id))
        setMessage('Blog removed')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } catch (e) {
        console.log('e', e)
        if (e.response.status === 401) {
          setMessage('Unauthorized')
        } else {
          setMessage('Cannot delete')
        }
        setIsErrorMessage(true)
        setTimeout(() => {
          setMessage(null)
          setIsErrorMessage(false)
        }, 5000)
      }
    }
  }

  // *** FOR TESTING ONLY!! DELETE EVERYTHING
  /*
  const DeleteAllBlogs = () => {
    const deleteAllBlogs = async (event) => {
      const response = await blogService.deleteAll()
      if (response.status === 204) setBlogs([])
    }
    return <button onClick={deleteAllBlogs}>delete all blogs</button>
  }
  */

  return (
    <div>
      <Notification message={message} isErrorMessage={isErrorMessage} />

      {!user && (
        <LoginForm
          handleSubmit={handleLogin}
          username={username}
          handleUsername={({ target }) => setUsername(target.value)}
          password={password}
          handlePassword={({ target }) => setPassword(target.value)}
        />
      )}
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

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                user={user}
                blog={blog}
                incrementLikes={() => incrementLikes(blog)}
                deleteThisBlog={() => deleteBlog(blog)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
