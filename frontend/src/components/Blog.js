import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ user, blog, incrementLikes, deleteThisBlog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      {visible && (
        <div>
          {blog.url} <br />
          likes {blog.likes} <button onClick={incrementLikes}>like</button>
          <br />
          {blog.user.name} <br />
          {blog.user.id === user.id && (
            <button onClick={deleteThisBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  user: PropTypes.object.isRequired,
  blog: PropTypes.object.isRequired,
  incrementLikes: PropTypes.func.isRequired,
  deleteThisBlog: PropTypes.func.isRequired,
}

export default Blog
